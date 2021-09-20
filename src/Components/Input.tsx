import React, { ChangeEventHandler } from "react";
import { Input as AntInput } from "antd";
// eslint-disable-next-line import/extensions,import/no-unresolved
import { InputProps } from "../Types/Component";

const Input = (props: InputProps) => {
  const {
    title, placeholder, onChange, disabled,
  } = { ...props };

  const onChangeHandler: ChangeEventHandler<HTMLInputElement> = (event) => {
    if (onChange) {
      onChange(event?.target?.value);
    }
  };

  return (
    <div className="vban-input-group">
      <h2 className="app-title">{title}</h2>
      <AntInput disabled={disabled} className="vban-input" placeholder={placeholder} bordered size="large" onChange={onChangeHandler} />
    </div>
  );
};

export default Input;
