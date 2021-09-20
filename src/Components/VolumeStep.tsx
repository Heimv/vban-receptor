import React, { useEffect, useState } from "react";
import { Tag } from "antd";
// eslint-disable-next-line import/extensions,import/no-unresolved
import { VolumeStepProps } from "../Types/Component";

const VolumeStep = (props: VolumeStepProps) => {
  const { type } = { ...props };
  const [className, setClassName] = useState("vban-volume-step");

  useEffect(() => {
    setClassName(type ? `vban-volume-step ${type}` : "vban-volume-step");
  }, [type, setClassName]);
  return <Tag className={className} />;
};

export default VolumeStep;
