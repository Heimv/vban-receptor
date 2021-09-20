import { Dispatch, SetStateAction } from "react";
import { StreamAudio, StreamDefinition } from "./Component.d";

export interface HomeProps {
  streamDef: StreamDefinition;
  setStreamDef: Dispatch<SetStateAction<StreamDefinition>>;
  streamAudio: StreamAudio;
  setStreamAudio: Dispatch<SetStateAction<StreamAudio>>;
}
