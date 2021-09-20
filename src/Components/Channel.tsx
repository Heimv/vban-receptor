import React, { ReactElement, useEffect, useState } from "react";
import { ChannelProps } from "../Types/Component.d";
import VolumeStep from "./VolumeStep";

const Channel = (props: ChannelProps) => {
  const { volume } = { ...props };
  const [volumeSteps, setVolumeSteps] = useState<ReactElement[]>();

  useEffect(() => {
    const tmpSteps = Array(20);
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < 20; i++) {
      if (-48 + i * 2.4 < volume && -48 + i * 2.4 < -24) {
        tmpSteps.push(<VolumeStep key={i} type="on" />);
      } else if (volume > -24 && -48 + i * 2.4 < volume && -48 + i * 2.4 < -2.4) {
        tmpSteps.push(<VolumeStep key={i} type="ok" />);
      } else if (volume > -2.4) {
        tmpSteps.push(<VolumeStep key={i} type="danger" />);
      } else tmpSteps.push(<VolumeStep key={i} />);
    }
    setVolumeSteps(tmpSteps.reverse());
  }, [volume, setVolumeSteps]);

  return <div className="vban-single-channel">{volumeSteps}</div>;
};

export default Channel;
