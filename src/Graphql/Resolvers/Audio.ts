import { ApolloError, PubSub } from "apollo-server";
import * as dgram from "dgram";
// @ts-ignore
import Speaker, { getFormat, isSupported } from "speaker";
import { WaveFile } from "wavefile";
import { decode } from "wav-decoder";
import { AudioContext } from "web-audio-api";
import { readFileSync } from "fs";
import { AudioSample, ChannelsLoudness } from "../../Types/Audio.d";
import { StreamAudio } from "../../Types/Component.d";
import { Config } from "../../Types/Queries/GetConfig.d";

const config: Config = JSON.parse(
  readFileSync("vban-config.json", { encoding: "utf-8", flag: "r" })
);

const currentConfig = {
  name: config.stream.name || "Stream1",
  ip: config.stream.ip || "127.0.0.1",
  format: config.audio.format || 16,
  channel: config.audio.channel || 2,
  sampleRate: config.audio.sampleRate || 41000,
  float: false,
  signed: true,
  gain: 1,
  mute: false,
};
let currentReceivedConfig: StreamAudio | undefined;
let speaker = new Speaker({
  channels: currentConfig.channel,
  bitDepth: currentConfig.format,
  sampleRate: currentConfig.sampleRate,
  float: currentConfig.float,
  signed: currentConfig.signed,
});

const SR = [
  6000, 12000, 24000, 48000, 96000, 192000, 384000, 8000, 16000, 32000, 64000,
  128000, 256000, 512000, 11025, 22050, 44100, 88200, 176400, 352800, 705600,
];
const bitDepth = [8, 16, 24, 32, 32, 64, 12, 10];
const signed = [false, true, true, true, true, true, true, true];
const float = [false, false, false, false, true, true, false, false];

const proccessSample = (buffer: Buffer): AudioSample => {
  const headerBuffer = buffer.slice(0, 28);
  const audio = buffer.slice(28);

  if (headerBuffer.toString("ascii", 0, 4) !== "VBAN") {
    throw new Error("Invalid Header");
  }

  const srsp = headerBuffer.readUInt8(4);
  const srIndex = srsp & 0x1f; // 5 Bits
  const sp = srsp >> 5; // 3 bits
  const dfcodec = headerBuffer.readUInt8(7);
  const format = dfcodec & 3;

  return {
    header: {
      sampleRate: SR[srIndex],
      samplePerFrame: (sp * 2) << 4,
      nbSample: headerBuffer.readUInt8(5) + 1,
      channels: headerBuffer.readUInt8(6) + 1,
      formatIndex: format,
      bitDepth: bitDepth[format],
      signed: signed[format],
      float: float[format],
      codec: (dfcodec >> 4) << 4,
      streamName: headerBuffer.toString("ascii", 8, 22).replace(/\0/g, ""),
      frameCounter: headerBuffer.readUInt32LE(21),
    },
    audio,
  };
};

const pubsub = new PubSub();
let nbClient = 0;
let currentNbClient = 0;
const server = dgram.createSocket("udp4");
const wav = new WaveFile();
const context = new AudioContext();
// eslint-disable-next-line no-buffer-constructor
let currentBuffer: Buffer = Buffer.alloc(0);
context.outStream = speaker;

const loudness = (buffer) => {
  if (currentBuffer.length === 0) {
    currentBuffer = buffer;
  } else {
    currentBuffer = Buffer.concat([currentBuffer, buffer.slice(44)]);
  }
  if (
    (currentBuffer.length - 44) /
      (currentConfig.sampleRate *
        (currentConfig.format / 8) *
        currentConfig.channel) >
    0.5
  ) {
    const arrayBuffer = decode.sync(currentBuffer);
    // eslint-disable-next-line no-buffer-constructor
    currentBuffer = Buffer.alloc(0);
    const rmsPerChannel: number[] = [];
    arrayBuffer.channelData.forEach((channel) => {
      let rms = 0.0;
      channel.forEach((value) => {
        rms += value * value;
      });
      rms = -48 - Math.log10(Math.sqrt(rms / channel.length)) * 100;
      rmsPerChannel.push(rms > -0.5 ? -48 : rms);
    });
    if (process.env.connected) {
      pubsub.publish("Loudness", { onAudio: rmsPerChannel });
    }
  }
};

const checkUpdatedConfig = (audioSample) => {
  if (
    !currentReceivedConfig ||
    (currentReceivedConfig &&
      (audioSample.header.sampleRate !== currentReceivedConfig.sampleRate ||
        audioSample.header.channels !== currentReceivedConfig.channel ||
        audioSample.header.bitDepth !== currentReceivedConfig.format)) ||
    currentNbClient !== nbClient
  ) {
    currentNbClient = nbClient;
    pubsub
      .publish("AudioDefinition", {
        onAudioDefinition: {
          sampleRate: audioSample.header.sampleRate,
          channel: audioSample.header.channels,
          format: audioSample.header.bitDepth,
        },
      })
      .then(() => {
        currentReceivedConfig = {
          sampleRate: audioSample.header.sampleRate,
          channel: audioSample.header.channels,
          format: audioSample.header.bitDepth,
        };
      })
      .catch((err) => {
        console.log(err);
      });
  }
};

// eslint-disable-next-line no-nested-ternary
const clip = (num) => (num <= 0 ? 0 : num >= 255 ? 255 : num);

const applyGain = () => {
  const buffer = wav.getSamples(true, Uint8Array).slice(44);
  buffer.forEach((value, idx) => {
    wav.setSample(idx, clip(value * currentConfig.gain));
  });
};

const createWaveBuffer = (audioSample) => {
  wav.fromScratch(
    audioSample.header.channels,
    audioSample.header.sampleRate,
    "8",
    audioSample.audio
  );
  if (audioSample.header.sampleRate !== currentConfig.sampleRate) {
    wav.toSampleRate(currentConfig.sampleRate);
  }
};

server.on("message", (msg) => {
  const audioSample = proccessSample(msg);
  if (audioSample.header.streamName !== currentConfig.name) {
    return;
  }
  if (
    !currentConfig.mute &&
    audioSample.header.samplePerFrame === 0 &&
    audioSample.audio
  ) {
    createWaveBuffer(audioSample);
    checkUpdatedConfig(audioSample);
    applyGain();
    loudness(wav.toBuffer());
    speaker.write(wav.toBuffer().slice(44), (err) => {
      if (err) {
        console.log(err);
        pubsub.publish("Error", { onError: "Unsupported Format" });
      }
    });
  }
});

server.on("listening", () => {
  const address = server.address();
  console.log(`server listening ${address.address}:${address.port}`);
});

server.bind(6980);

const updateSpeaker = () => {
  if (
    !isSupported({
      channels: currentConfig.channel,
      bitDepth: currentConfig.format,
      sampleRate: currentConfig.sampleRate,
      float: currentConfig.float,
      signed: currentConfig.signed,
    })
  ) {
    throw new ApolloError(
      "this speaker configuration is not supported on your platform",
      "200"
    );
  }
  speaker = new Speaker({
    channels: currentConfig.channel,
    bitDepth: currentConfig.format,
    sampleRate: currentConfig.sampleRate,
    float: currentConfig.float,
    signed: currentConfig.signed,
  });
};

export default {
  Mutation: {
    setStreamName: (_, { streamName }: { streamName: string }): string => {
      currentConfig.name = streamName;
      return currentConfig.name;
    },
    setStreamIp: (_, { streamIp }: { streamIp: string }): string => {
      currentConfig.ip = streamIp;
      return currentConfig.ip;
    },
    setFormat: (_, { format }: { format: number }): number => {
      currentConfig.format = format;
      updateSpeaker();
      return currentConfig.format;
    },
    setSampleRate: (_, { sampleRate }: { sampleRate: number }): number => {
      currentConfig.sampleRate = sampleRate;
      updateSpeaker();
      return sampleRate;
    },
    setChannel: (_, { channel }: { channel: number }): number => {
      currentConfig.channel = channel;
      updateSpeaker();
      return channel;
    },
    setGain: (_, { gain }: { gain: number }): number => {
      // currentConfig.gain = (gain - -48) / (12 - -48); // gain convert to range [0, 1]
      currentConfig.gain = 10 ** (gain / 10);
      return gain;
    },
    mute: (): boolean => {
      currentConfig.mute = !currentConfig.mute;
      return currentConfig.mute;
    },
  },
  Subscription: {
    onAudio: {
      subscribe: () => pubsub.asyncIterator<ChannelsLoudness>("Loudness"),
    },
    onAudioDefinition: {
      subscribe: () => {
        nbClient++;
        return pubsub.asyncIterator<StreamAudio>("AudioDefinition");
      },
      unsubscribe: () => {
        nbClient--;
      },
    },
  },
};
