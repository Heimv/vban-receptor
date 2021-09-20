import React, { useEffect, useState } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import { Layout } from "antd";
import { useQuery } from "@apollo/client";
import Home from "./Pages/Home";
import Header from "./Components/Header";
import "./Styles/Index.less";
import { ConfigQuery } from "./Types/Queries/GetConfig.d";
import GetConfigQuery from "./Graphql/Fetching/Queries/GetConfig.graphql";
import {
  StreamAudio,
  StreamDefinition as StreamDefinitionType,
} from "./Types/Component.d";

const { Content } = Layout;

function App() {
  const { loading, data } = useQuery<ConfigQuery>(GetConfigQuery);
  const [streamDef, setStreamDef] = useState<StreamDefinitionType>({
    name: "stream1",
    ip: "127.0.0.0",
  });
  const [streamAudio, setStreamAudio] = useState<StreamAudio>({
    sampleRate: 48000,
    channel: 2,
    format: 16,
  });

  useEffect(() => {
    if (data && data.getConfig.stream) setStreamDef(data.getConfig.stream);
    if (data && data.getConfig.audio) setStreamAudio(data.getConfig.audio);
  }, [loading, setStreamDef, setStreamAudio]);

  if (loading || !streamDef || !streamAudio) {
    return <div />;
  }
  return (
    <Layout className="app-layout">
      <Header streamDef={streamDef} streamAudio={streamAudio} />
      <Content>
        <Home
          streamDef={streamDef}
          streamAudio={streamAudio}
          setStreamDef={setStreamDef}
          setStreamAudio={setStreamAudio}
        />
      </Content>
    </Layout>
  );
}

export default App;
