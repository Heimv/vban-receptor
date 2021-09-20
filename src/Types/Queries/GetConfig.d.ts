export interface Stream {
  name: string;
  ip: string;
}

export interface Audio {
  sampleRate: number;
  channel: number;
  format: number;
}

export interface Config {
  stream: Stream;
  audio: Audio;
}

export interface ConfigQuery {
  getConfig: Config
}

export interface SetConfigArgs {
  config: Config
}
