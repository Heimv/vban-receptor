import React, { ReactElement, useEffect, useState } from "react";
import Channel from "./Channel";
// eslint-disable-next-line import/extensions,import/no-unresolved
import { AudioChannelsProps } from "../Types/Component";
import AudioLevel from "./AudioLevel";

const AudioChannels = (props: AudioChannelsProps) => {
  const { channels, volume, mute } = { ...props };
  const [audioChannels, setAudioChannels] = useState<ReactElement[]>(
    Array(channels)
      .fill(0)
      .map((value, idx) => (
        <Channel
          key={`Channel-${idx.toString()}`}
          volume={mute ? -48 : volume[idx]}
        />
      )),
  );

  useEffect(() => {
    setAudioChannels(
      Array(channels)
        .fill(0)
        .map((value, idx) => (
          <Channel
            key={`Channel-${idx.toString()}`}
            volume={mute ? -48 : volume[idx]}
          />
        )),
    );
  }, [channels, volume, mute]);

  return (
    <div className="vban-audio-channels">
      {audioChannels}
      <AudioLevel />
    </div>
  );
};

export default AudioChannels;
