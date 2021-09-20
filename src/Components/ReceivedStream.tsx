import React, { useState } from "react";
import { useSubscription } from "@apollo/client";
import Group from "./Group";
import Input from "./Input";
import {
  AudioDefinitionSubscription,
  ChannelsSlugName,
  FormatSlugName,
  StreamAudio,
} from "../Types/Component.d";
import OnAudioDefinition from "../Graphql/Fetching/Subscriptions/OnAudioDefinition.graphql";

const ReceivedStream = () => {
  const [audioDefinition, setAudioDefinition] = useState<StreamAudio>({
    channel: 2,
    sampleRate: 41000,
    format: 16
  });
  useSubscription<AudioDefinitionSubscription>(OnAudioDefinition, {
    onSubscriptionData: ({ subscriptionData }) => {
      if (subscriptionData.data) {
        setAudioDefinition(subscriptionData.data.onAudioDefinition);
      }
    },
  });
  const channelsSlugName: ChannelsSlugName = {
    1: "Mono",
    2: "Stereo",
    3: "Surround",
    5: "5.1",
    7: "7.1",
  };
  const formatsSlugName: FormatSlugName = {
    16: "PCM 16 bit",
    24: "PCM 24 bit",
  };

  return (
    <Group title="Received">
      <Input
        disabled
        title="Sample Rate"
        placeholder={`${audioDefinition.sampleRate} Hz`}
      />
      <Input
        disabled
        title="Channel"
        placeholder={channelsSlugName[audioDefinition.channel]}
      />
      <Input
        disabled
        title="Format"
        placeholder={formatsSlugName[audioDefinition.format]}
      />
    </Group>
  );
};

export default ReceivedStream;
