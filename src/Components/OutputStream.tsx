import React from "react";
import SampleRateSelect from "./SampleRateSelect";
import ChannelSelect from "./ChannelSelect";
import FormatSelect from "./FormatSelect";
import Group from "./Group";
import { OutputStreamProps } from "../Types/Component.d";

const OutputStream = (props: OutputStreamProps) => {
  const { streamAudio, setStreamAudio } = { ...props };

  return (
    <Group title="Output">
      <SampleRateSelect
        currentSR={streamAudio.sampleRate}
      />
      <ChannelSelect
        currentChannel={streamAudio.channel}
        setChannel={setStreamAudio}
      />
      <FormatSelect
        currentFormat={streamAudio.format}
      />
    </Group>
  );
};

export default OutputStream;
