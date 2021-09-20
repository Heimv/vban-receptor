import React, { useState } from "react";
import { useMutation, useSubscription } from "@apollo/client";
import Button from "./Button";
import VolumeController from "./VolumeController";
import AudioChannels from "./AudioChannels";
import Group from "./Group";
import { AudioControllerProps, OnAudioSubscription } from "../Types/Component.d";
import { MuteMutationResult } from "../Types/Mutations/Mute.d";
import { SetGainMutationResult } from "../Types/Mutations/SetGain.d";
import AudioSubscription from "../Graphql/Fetching/Subscriptions/OnAudio.graphql";
import Mute from "../Graphql/Fetching/Mutations/Mute.graphql";
import SetGain from "../Graphql/Fetching/Mutations/SetGain.graphql";
import { ChannelsLoudness } from "../Types/Audio.d";

const AudioController = (props: AudioControllerProps) => {
  const { channels } = { ...props };
  const [volume, setVolume] = useState<ChannelsLoudness>(Array(channels).fill(-48));
  const [gain, setGain] = useState(0);
  const [mute, setMute] = useState(false);
  const [muteMutation] = useMutation<MuteMutationResult>(Mute);
  const [gainMutation, { loading }] = useMutation<SetGainMutationResult>(SetGain);
  useSubscription<OnAudioSubscription>(AudioSubscription, {
    onSubscriptionData: ({ subscriptionData }) => {
      if (subscriptionData && subscriptionData.data) {
        setVolume(subscriptionData.data.onAudio);
      }
    },
  });

  const onClickHandler = () => {
    muteMutation().then(({ data }) => {
      if (data) {
        setMute(data.mute);
      }
    });
  };

  const onGainChangeHandler = (value: number) => {
    if (!loading) {
      gainMutation({ variables: { gain: value } }).then(({ data }) => {
        if (data && data.setGain) {
          setGain(data.setGain);
        }
      });
    }
  };

  return (
    <Group audio title="Stream Audio">
      <div className="vban-audio-controller-group">
        <Button title="M" onClick={onClickHandler} useSwitch />
        <VolumeController initialVolume={gain} onChange={onGainChangeHandler} />
      </div>
      <AudioChannels channels={channels} volume={volume} mute={mute} />
    </Group>
  );
};

export default AudioController;
