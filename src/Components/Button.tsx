import React, { useState } from "react";
import { Button as AntButton } from "antd";
// eslint-disable-next-line import/extensions,import/no-unresolved
import { ButtonProps } from "../Types/Component";

const Button = (props: ButtonProps) => {
  const {
    title, shape = "round", onClick, useSwitch,
  } = { ...props };
  const [state, setState] = useState(false);

  const onClickHandler = () => {
    if (onClick) onClick();
    if (useSwitch) setState(!state);
  };

  return (
    <AntButton
      size="large"
      className={`vban-button audio-controller ${shape} ${state ? "on" : "off"}`}
      onClick={onClickHandler}
    >
      <span className="app-title audio-controller">{title}</span>
    </AntButton>
  );
};

export default Button;
