import React from "react";
import { Layout, notification } from "antd";
import { ApolloError, useMutation } from "@apollo/client";
import { ReactComponent as Logo } from "../Assets/Logo.svg";
import Button from "./Button";
import { HeaderProps } from "../Types/Component.d";
import { Config } from "../Types/Queries/GetConfig.d";
import SetConfigMutation from "../Graphql/Fetching/Mutations/SetConfig.graphql";

const AntHeader = Layout.Header;

const Header = (props: HeaderProps) => {
  const { streamDef, streamAudio } = { ...props };
  const [setConfig] = useMutation<Config>(SetConfigMutation);

  const config: Config = { stream: streamDef, audio: streamAudio };

  const onClickHandler = () => {
    setConfig({
      variables: { config },
    })
      .then(() => notification.success({ message: "Configuration Saved" }))
      .catch((err: ApolloError) =>
        notification.error({
          message: "Enable to save current configuration",
          description: err,
        })
      );
  };

  return (
    <AntHeader className="app-header">
      <Logo />
      <Button title="Save current config" onClick={onClickHandler} />
    </AntHeader>
  );
};

export default Header;
