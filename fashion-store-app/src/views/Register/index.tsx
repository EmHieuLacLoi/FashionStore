import React from "react";
import { Form, Input, Button, message } from "antd";
import "./index.scss";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

const Register = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { t } = useTranslation();

  const handleFinish = (values: any) => {
    message.success(`Đăng ký thành công cho: ${values.name}`);
  };

  return (
    <div className="register-form-container">
      <h2>{t("auth.register.title")}</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        autoComplete="off"
      >
        <input
          type="text"
          name="fake_user"
          autoComplete="username"
          style={{ display: "none" }}
        />
        <input
          type="password"
          name="fakepasswordremembered"
          style={{ display: "none" }}
        />

        <Form.Item
          name="name"
          label={t("auth.register.name")}
          rules={[
            { required: true, message: t("auth.register.name_required") },
          ]}
        >
          <Input
            autoComplete="off"
            placeholder={t("auth.register.name_placeholder")}
          />
        </Form.Item>
        <Form.Item
          name="email"
          label={t("auth.register.email")}
          rules={[
            { required: true, message: t("auth.register.email_required") },
            { type: "email", message: t("auth.register.email_not_valid") },
          ]}
        >
          <Input
            autoComplete="off"
            placeholder={t("auth.register.email_placeholder")}
          />
        </Form.Item>
        <Form.Item
          name="phone"
          label={t("auth.register.phone")}
          rules={[
            { required: true, message: t("auth.register.phone_required") },
          ]}
        >
          <Input
            autoComplete="off"
            placeholder={t("auth.register.phone_placeholder")}
          />
        </Form.Item>
        <Form.Item
          name="password"
          label={t("auth.register.password")}
          rules={[
            { required: true, message: t("auth.register.password_required") },
            { min: 6, message: t("auth.register.password_min") },
          ]}
        >
          <Input.Password
            autoComplete="off"
            placeholder={t("auth.register.password_placeholder")}
          />
        </Form.Item>
        <Form.Item
          name="confirm_password"
          label={t("auth.register.confirm_password")}
          rules={[
            {
              required: true,
              message: t("auth.register.confirm_password_required"),
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error(t("auth.register.confirm_password_not_match"))
                );
              },
            }),
          ]}
        >
          <Input.Password
            autoComplete="off"
            placeholder={t("auth.register.confirm_password_placeholder")}
          />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            style={{ marginTop: "3px" }}
          >
            {t("auth.register.title")}
          </Button>
        </Form.Item>
      </Form>
      <p>
        {t("auth.register.already_have_account")}{" "}
        <span
          className="switch-link"
          onClick={() => {
            navigate("/login");
          }}
        >
          {t("auth.login.title")}
        </span>
      </p>
    </div>
  );
};

export default Register;
