import { Dispatch, SetStateAction } from "react";
import { StreamAudio } from "../Components/OutputStream";
import { ChannelsLoudness } from "./Audio.d";

export interface HeaderProps {
  streamDef: StreamDefinition;
  streamAudio: StreamAudio;
}

export interface ButtonProps {
  title: string;
  shape?: "round" | "circle";
  onClick?: () => void;
  useSwitch?: boolean;
}

export interface InputProps {
  title: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
}

export interface GroupProps {
  title: string;
  audio?: boolean;
}

export interface SampleRateSelectProps {
  currentSR: number;
}

export interface ChannelSelectProps {
  currentChannel: number;
  setChannel: Dispatch<SetStateAction<StreamAudio>>;
}

export interface FormatSelectProps {
  currentFormat: number;
}

export interface ChannelProps {
  volume: number;
}

export interface VolumeStepProps {
  type?: "on" | "ok" | "danger";
}

export interface VolumeControllerProps {
  initialVolume: number;
  onChange: (value: number) => void;
}

export interface AudioChannelsProps {
  channels: number;
  volume: ChannelsLoudness;
  mute: boolean;
}

export interface AudioControllerProps {
  channels: number;
}

export interface StreamDefinition {
  name: string;
  ip: string;
}

export interface StreamDefinitionProps {
  streamDefinition: StreamDefinition;
  setStreamDefinition: Dispatch<SetStateAction<StreamDefinition>>;
}

export interface FormatSlugName {
  [key: number]: string;

  16: "PCM 16 bit";
  24: "PCM 24 bit";
}

export interface ChannelsSlugName {
  [key: number]: string;

  1: "Mono";
  2: "Stereo";
  3: "Surround";
  5: "5.1";
  7: "7.1";
}

export interface AudioDefinitionSubscription {
  onAudioDefinition: StreamAudio;
}

export interface StreamAudio {
  sampleRate: number;
  channel: keyof ChannelsSlugName;
  format: keyof FormatSlugName;
}

export interface ReceivedStreamProps {
  receivedStream: StreamAudio;
}

export interface OutputStreamProps {
  streamAudio: StreamAudio;
  setStreamAudio: Dispatch<SetStateAction<StreamAudio>>;
}

export interface OnAudioSubscription {
  onAudio: number[];
}
