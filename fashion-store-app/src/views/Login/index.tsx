import React from "react";
import { Form, Input, Button, message } from "antd";
import "./index.scss";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

const Login = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { t } = useTranslation();

  const handleFinish = (values: any) => {
    message.success(`Đăng nhập thành công với email: ${values.email}`);
  };

  return (
    <div className="login-form-container">
      <h2>{t("auth.login.title")}</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        autoComplete="off"
      >
        <Form.Item
          name="email"
          label={t("auth.login.email")}
          rules={[
            { required: true, message: t("auth.login.email_required") },
            { type: "email", message: t("auth.login.email_not_valid") },
          ]}
        >
          <Input
            autoComplete="off"
            placeholder={t("auth.login.email_placeholder")}
          />
        </Form.Item>
        <Form.Item
          name="password"
          label={t("auth.login.password")}
          rules={[
            { required: true, message: t("auth.login.password_required") },
            { min: 6, message: t("auth.login.password_min") },
          ]}
        >
          <Input.Password
            autoComplete="off"
            placeholder={t("auth.login.password_placeholder")}
          />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            style={{ marginTop: "3px" }}
          >
            {t("auth.login.title")}
          </Button>
        </Form.Item>
      </Form>
      <p>
        {t("auth.login.not_have_account")}{" "}
        <span
          className="switch-link"
          onClick={() => {
            navigate("/register");
          }}
        >
          {t("auth.register.title")}
        </span>
      </p>
    </div>
  );
};

export default Login;
