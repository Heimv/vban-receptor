export interface SampleHeader {
  sampleRate: number;
  samplePerFrame: number;
  nbSample: number;
  channels: number;
  formatIndex: number;
  bitDepth: number;
  signed: boolean;
  codec: number;
  float: boolean;
  streamName: string;
  frameCounter: number;
}

export interface AudioSample {
  header: SampleHeader;
  audio: Buffer;
}

export type ChannelsLoudness = number[];
