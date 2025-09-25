import { Form, Input, Button, message } from "antd";
import "./index.scss";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { useLogin } from "@hooks/AuthHooks";
import { getAxiosErrorMessage } from "@utils/axiosUtils";
import { getToken, saveToken } from "@utils/auth";

const Login = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const loginMutation = useLogin();

  if (getToken()) {
    navigate("/");
  }

  const handleFinish = async () => {
    const values = await form.validateFields();
    try {
      const res = await loginMutation.mutateAsync(values);
      message.success(
        `${t("common.message.success", { value: t("auth.login.title") })}`
      );

      const tokenRes = res?.data?.token;
      if (tokenRes) {
        saveToken(tokenRes);
      }

      setTimeout(() => {
        if (res?.data?.roles?.includes("ROLE_ADMIN")) {
          navigate("/admin");
        } else {
          navigate("/");
        }
      }, 1000);
    } catch (error) {
      console.log(error);
      message.error(
        getAxiosErrorMessage(error) == "Unknown error"
          ? t("common.message.fail", { value: t("auth.login.title") })
          : getAxiosErrorMessage(error)
      );
    }
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
          name="username"
          label={t("auth.login.username")}
          rules={[
            { required: true, message: t("auth.login.username_required") },
          ]}
        >
          <Input
            autoComplete="off"
            placeholder={t("auth.login.username_placeholder")}
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
