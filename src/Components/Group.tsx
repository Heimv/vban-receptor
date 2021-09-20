import React, { PropsWithChildren } from "react";
// eslint-disable-next-line import/extensions,import/no-unresolved
import { GroupProps } from "../Types/Component";

const Group = (props: PropsWithChildren<GroupProps>) => {
  const { title, children, audio } = { ...props };

  return (
    <>
      <h1 className="app-title">{title}</h1>
      <div className={`vban-group ${audio ? "audio-channels" : ""}`}>
        {children}
      </div>
    </>
  );
};

export default Group;
