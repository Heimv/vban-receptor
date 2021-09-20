import React, { useState } from "react";
import { /* InputNumber, */ Slider } from "antd";
// eslint-disable-next-line import/extensions,import/no-unresolved
import { VolumeControllerProps } from "../Types/Component";

const VolumeController = (props: VolumeControllerProps) => {
  const { initialVolume, onChange } = { ...props };
  const [volume, setVolume] = useState<number>(initialVolume);

  const onChangeHandler = (value: number) => {
    if (Number.isNaN(value)) return;
    setVolume(value);
    onChange(value);
  };

  return (
    <div className="vban-slider-group">
      <h1 className="app-title" style={{ textTransform: "none" }}>{`${volume.toFixed(1)} dB`}</h1>
      { /* <InputNumber
        className="app-title"
        min={-48}
        max={12}
        defaultValue={volume}
        onChange={onChangeHandler}
        bordered={false}
      /> */ }
      <Slider className="vban-slider" defaultValue={initialVolume} tooltipVisible={false} vertical min={-48} step={0.1} max={12} onChange={onChangeHandler} />
    </div>
  );
};

export default VolumeController;
