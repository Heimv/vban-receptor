import React from "react";
import { Divider, Row, Col } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import AudioController from "../Components/AudioController";
import StreamDefinition from "../Components/StreamDefinition";
import ReceivedStream from "../Components/ReceivedStream";
import OutputStream from "../Components/OutputStream";
import { HomeProps } from "../Types/Home.d";

// eslint-disable-next-line no-unused-vars
const Home = (props: HomeProps) => {
  const {
    streamDef,
    setStreamDef,
    streamAudio,
    setStreamAudio,
  } = { ...props };

  return (
    <Row className="home-main-row" gutter={8} justify="space-between">
      <Col flex="auto">
        <Row style={{ flexFlow: "column" }}>
          <StreamDefinition
            streamDefinition={streamDef}
            setStreamDefinition={setStreamDef}
          />
        </Row>
        <Row>
          <Col className="vban-stream-audio-column">
            <ReceivedStream />
          </Col>
          <Col className="vban-stream-audio-arrow-column">
            <ArrowRightOutlined className="arrow" />
            <ArrowRightOutlined className="arrow" />
            <ArrowRightOutlined className="arrow" />
          </Col>
          <Col className="vban-stream-audio-column">
            <OutputStream
              streamAudio={streamAudio}
              setStreamAudio={setStreamAudio}
            />
          </Col>
        </Row>
      </Col>
      <Col>
        <Divider className="HomeDivider" type="vertical" plain />
      </Col>
      <Col flex="auto">
        <AudioController channels={streamAudio.channel} />
      </Col>
    </Row>
  );
};

export default Home;
