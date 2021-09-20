import React, { useState } from "react";
import { notification, Select } from "antd";
import { useMutation } from "@apollo/client";
// eslint-disable-next-line import/extensions,import/no-unresolved
import { SampleRateSelectProps } from "../Types/Component";
// eslint-disable-next-line import/extensions,import/no-unresolved
import { SetSampleRateMutationProps, SetSampleRateMutationResult } from "../Types/Mutations/SetSampleRate";
import SetSampleRateMutation from "../Graphql/Fetching/Mutations/SetSampleRate.graphql";

const { Option } = Select;

const SampleRateSelect = (props: SampleRateSelectProps) => {
  const { currentSR } = { ...props };
  const [sampleRate, setSampleRate] = useState<number>(currentSR);
  const [setSampleRateMutation] = useMutation<
    SetSampleRateMutationResult,
    SetSampleRateMutationProps
  >(SetSampleRateMutation);

  const onChangeHandler = (value: string) => {
    setSampleRateMutation({ variables: { sampleRate: parseInt(value, 10) } })
      .then(({ data }) => {
        if (data && data.setSampleRate) {
          setSampleRate(data.setSampleRate);
          notification.success({
            message: `Sample rate successfully set to ${data.setSampleRate} Hz`,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="vban-select-group">
      <h2 className="app-title">Sample Rate</h2>
      <Select
        className="vban-select"
        size="large"
        onChange={onChangeHandler}
        value={sampleRate.toString()}
      >
        <Option value="11025">11025 Hz</Option>
        <Option value="16000">16000 Hz</Option>
        <Option value="22050">22050 Hz</Option>
        <Option value="24000">24000 Hz</Option>
        <Option value="32000">32000 Hz</Option>
        <Option value="44000">44000 Hz</Option>
        <Option value="48000">48000 Hz</Option>
        <Option value="64000">64000 Hz</Option>
        <Option value="88200">88200 Hz</Option>
        <Option value="96000">96000 Hz</Option>
      </Select>
    </div>
  );
};

export default SampleRateSelect;
