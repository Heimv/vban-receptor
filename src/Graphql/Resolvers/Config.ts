import { promises as fsPromise } from "fs";
// eslint-disable-next-line import/extensions,import/no-unresolved
import { Config, SetConfigArgs } from "../../Types/Queries/GetConfig";

const defaultConfig: Config = {
  stream: {
    name: "stream1",
    ip: "127.0.0.1",
  },
  audio: {
    sampleRate: 48000,
    channel: 2,
    format: 16,
  },
};

export default {
  Query: {
    getConfig: (): Promise<Config> => fsPromise
      .readFile("vban-config.json", { encoding: "utf-8", flag: "r" })
      .then((data) => JSON.parse(data))
      .catch(() => defaultConfig),
  },
  Mutation: {
    setConfig: (_, { config }: SetConfigArgs): Promise<Config> => fsPromise
      .writeFile("vban-config.json", JSON.stringify(config), { encoding: "utf-8", flag: "w+" })
      .then(() => config),
  },
};
