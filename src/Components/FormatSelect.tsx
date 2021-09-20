import React, { useState } from "react";
import { notification, Select } from "antd";
import { useMutation } from "@apollo/client";
// eslint-disable-next-line import/extensions,import/no-unresolved
import { FormatSelectProps } from "../Types/Component";
import {
  SetFormatMutationProps,
  SetFormatMutationResult,
// eslint-disable-next-line import/extensions,import/no-unresolved
} from "../Types/Mutations/SetFormat";
import SetFormatMutation from "../Graphql/Fetching/Mutations/SetFormat.graphql";

const { Option } = Select;

const FormatSelect = (props: FormatSelectProps) => {
  const { currentFormat } = { ...props };
  const [format, setFormat] = useState<number>(currentFormat);
  const [setFormatMutation] = useMutation<
    SetFormatMutationResult,
    SetFormatMutationProps
  >(SetFormatMutation);

  const onChangeHandler = (value: string) => {
    setFormatMutation({ variables: { format: parseInt(value, 10) } })
      .then(({ data }) => {
        if (data && data.setFormat) {
          setFormat(data.setFormat);
          notification.success({
            message: `Format successfully set to ${data.setFormat} bits`,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="vban-select-group">
      <h2 className="app-title">Format</h2>
      <Select
        className="vban-select"
        size="large"
        onChange={onChangeHandler}
        value={format.toString()}
      >
        <Option value="16">PCM 16 bits</Option>
        <Option value="24">PCM 24 bits</Option>
      </Select>
    </div>
  );
};

export default FormatSelect;
