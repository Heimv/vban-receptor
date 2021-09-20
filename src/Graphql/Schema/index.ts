import "graphql-import-node";
import typesSchema from "./Types.graphql";
import getConfigSchema from "./Queries/GetConfig.graphql";
import setConfigSchema from "./Mutations/SetConfig.graphql";
import audio from "./Subscriptions/OnAudio.graphql";
import audioDef from "./Subscriptions/OnAudioDefinition.graphql"
import audioConfig from "./Mutations/Audio.graphql";

export default [
  typesSchema,
  setConfigSchema,
  getConfigSchema,
  audio,
  audioDef,
  audioConfig
];
