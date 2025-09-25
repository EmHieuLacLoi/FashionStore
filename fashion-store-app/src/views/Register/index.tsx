import { Form, Input, Button } from "antd";
import "./index.scss";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { useCreate } from "@hooks/UserHooks";
import { getAxiosErrorMessage } from "@utils/axiosUtils";
import { message } from "@utils/antd-static";

const Register = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const registerMutation = useCreate();
  const handleFinish = async () => {
    const values = await form.validateFields();
    try {
      await registerMutation.mutateAsync(values);
      message.success(
        `${t("common.message.success", {
          value: t("auth.register.title"),
        })}`
      );

      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      console.log(error);
      message.error(
        getAxiosErrorMessage(error) == "Unknown error"
          ? t("common.message.fail", { value: t("auth.register.title") })
          : getAxiosErrorMessage(error)
      );
    }
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
          name="username"
          label={t("auth.register.username")}
          rules={[
            { required: true, message: t("auth.register.username_required") },
          ]}
        >
          <Input
            autoComplete="off"
            placeholder={t("auth.register.username_placeholder")}
          />
        </Form.Item>

        <Form.Item
          name="full_name"
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
          name="password"
          label={t("auth.register.password")}
          rules={[
            { required: true, message: t("auth.register.password_required") },
            {
              validator: (_, value) => {
                if (!value) return Promise.resolve();

                if (value.length < 8) {
                  return Promise.reject(t("auth.register.password_min"));
                }

                if (!/[A-Z]/.test(value)) {
                  return Promise.reject(t("auth.register.password_uppercase"));
                }

                if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
                  return Promise.reject(t("auth.register.password_special"));
                }

                if (/\s/.test(value)) {
                  return Promise.reject(t("auth.register.password_whitespace"));
                }

                return Promise.resolve();
              },
            },
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

        <Form.Item
          name="email"
          label={t("auth.register.email")}
          rules={[
            { type: "email", message: t("auth.register.email_not_valid") },
          ]}
        >
          <Input
            autoComplete="off"
            placeholder={t("auth.register.email_placeholder")}
          />
        </Form.Item>

        <Form.Item name="phone_number" label={t("auth.register.phone")}>
          <Input
            autoComplete="off"
            placeholder={t("auth.register.phone_placeholder")}
          />
        </Form.Item>

        <Form.Item name={"address"} label={t("auth.register.address")}>
          <Input
            autoComplete="off"
            placeholder={t("auth.register.address_placeholder")}
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
