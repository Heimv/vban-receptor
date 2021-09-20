import React from "react";
import { notification, Select } from "antd";
import { useMutation } from "@apollo/client";
import { ChannelSelectProps } from "../Types/Component.d";
import {
  SetChannelMutationProps,
  SetChannelMutationResult,
} from "../Types/Mutations/SetChannel.d";
import SetChannelMutation from "../Graphql/Fetching/Mutations/SetChannel.graphql";

const { Option } = Select;

const ChannelSelect = (props: ChannelSelectProps) => {
  const { currentChannel, setChannel } = { ...props };
  const [setChannelMutation] = useMutation<
    SetChannelMutationResult,
    SetChannelMutationProps
  >(SetChannelMutation);

  const onChangeHandler = (value: string) => {
    setChannelMutation({ variables: { channel: parseInt(value, 10) } })
      .then(({ data }) => {
        if (data && data.setChannel) {
          setChannel((prevState) => ({
            ...prevState,
            channel: data.setChannel,
          }));
          notification.success({
            message: `Channel number successfully set to ${data.setChannel} channel(s)`,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="vban-select-group">
      <h2 className="app-title">Channel</h2>
      <Select
        className="vban-select"
        size="large"
        onChange={onChangeHandler}
        value={currentChannel.toString()}
      >
        <Option value="1">Mono</Option>
        <Option value="2">Stereo</Option>
        <Option value="3">Surround</Option>
        <Option value="5">5.1</Option>
        <Option value="7">7.1</Option>
      </Select>
    </div>
  );
};

export default ChannelSelect;
