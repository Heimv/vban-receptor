import React from "react";
import { useMutation } from "@apollo/client";
import Input from "./Input";
import Group from "./Group";
import { StreamDefinitionProps } from "../Types/Component.d";
import SetStreamName from "../Graphql/Fetching/Mutations/SetStreamName.graphql";
import SetStreamIp from "../Graphql/Fetching/Mutations/setStreamIp.graphql";

const StreamDefinition = (props: StreamDefinitionProps) => {
  const { streamDefinition, setStreamDefinition } = { ...props };
  const [setStreamName] = useMutation<string, { streamName: string }>(SetStreamName);
  const [setStreamIp] = useMutation<string, { streamIp: string }>(SetStreamIp);

  return (
    <Group title="Stream Definition">
      <Input
        title="Stream Name"
        placeholder={streamDefinition.name}
        onChange={(value) => {
          setStreamName({ variables: { streamName: value } }).then(() => {
            setStreamDefinition((prevState) => ({ ...prevState, name: value }));
          });
        }}
      />
      <Input
        title="Ip address from"
        placeholder={streamDefinition.ip}
        onChange={(value) => {
          setStreamIp({ variables: { streamIp: value } }).then(() => {
            setStreamDefinition((prevState) => ({ ...prevState, name: value }));
          });
        }}
      />
    </Group>
  );
};

export default StreamDefinition;
