import React, { useEffect } from "react";
import { App as AntdApp } from "antd";
import {
  setMessageInstance,
  setModalInstance,
  setNotificationInstance,
} from "@utils/antd-static";

const StaticAntdProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { message, notification, modal } = AntdApp.useApp();

  useEffect(() => {
    setMessageInstance(message);
    setNotificationInstance(notification);
    setModalInstance(modal);
  }, [message, notification, modal]);

  return <>{children}</>;
};

export default StaticAntdProvider;
