import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Card,
  message,
  Space,
  Typography,
  Divider,
  Row,
  Col,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  LockOutlined,
  HomeOutlined,
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { useUpdate } from "@hooks/UserHooks";
import { useGetUserInfo } from "@hooks/AuthHooks";
import { useTranslation } from "react-i18next";
import "./index.scss";
import { getAxiosErrorMessage } from "@utils/axiosUtils";

const { Title, Text } = Typography;
const { TextArea } = Input;

const UserProfileForm = () => {
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const updateMutation = useUpdate();

  const [userData, setUserData] = useState<any | null>(null);

  const { data, error } = useGetUserInfo({
    refetchOnWindowFocus: false,
    retry: false,
  });

  useEffect(() => {
    if (error) {
      message.error(t("auth.profile_not_found"));
    }
    if (data) {
      setUserData(data?.data);
    }
  }, [data, error]);

  useEffect(() => {
    if (userData) {
      form.setFieldsValue(userData);
    }
  }, [form, userData]);

  const handleEdit = () => {
    setIsEditing(true);
    form.setFieldsValue(userData);
  };

  const handleCancel = () => {
    setIsEditing(false);
    form.setFieldsValue(userData);
    form.resetFields();
  };

  const handleSave = async (values: any) => {
    setLoading(true);
    try {
      const updateData = { ...values };

      if (values?.confirm_password) {
        delete updateData.confirm_password;
      }

      const updateRes = await updateMutation.mutateAsync(updateData);

      if (updateRes?.error_status == 1) {
        message.success(t("profile.message.success"));

        delete updateData?.confirm_password;
        delete updateData?.old_password;
        delete updateData?.password;

        setUserData((prev: any) => ({ ...prev, ...updateData }));
        setIsEditing(false);
        form.resetFields();
      } else {
        message.error(t("profile.message.fail"));
      }
    } catch (error) {
      console.log(error);
      message.error(
        getAxiosErrorMessage(error) == "Unknown error"
          ? t("profile.message.fail")
          : getAxiosErrorMessage(error)
      );
    } finally {
      setLoading(false);
    }
  };

  const validatePhone = (_: any, value: any) => {
    if (value && !/^[0-9]{10}$/.test(value)) {
      return Promise.reject(
        new Error(t("profile.required.phone_number_min", { value: 10 }))
      );
    }
    return Promise.resolve();
  };

  const validateOldPassword = (_: any, value: any) => {
    if (value && value.length < 8) {
      return Promise.reject(
        new Error(t("auth.register.password_min", { value: 8 }))
      );
    }
    return Promise.resolve();
  };

  const validateConfirmPassword = (_: any, value: any) => {
    if (value && value !== form.getFieldValue("password")) {
      return Promise.reject(
        new Error(t("auth.register.confirm_password_not_match"))
      );
    }
    return Promise.resolve();
  };

  return (
    <div className="user-profile-form">
      <Card
        className="profile-card"
        title={
          <div className="card-header">
            <Title level={4} className="profile-title">
              <UserOutlined />
              {t("profile.title")}
            </Title>
            {!isEditing && (
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={handleEdit}
              >
                {t("profile.edit")}
              </Button>
            )}
          </div>
        }
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
          initialValues={userData}
          disabled={!isEditing}
          className="profile-form"
        >
          <Row gutter={24} className="form-row">
            <Col xs={24} md={12} className="form-col">
              <Form.Item
                name="full_name"
                label={t("profile.full_name")}
                rules={[
                  { required: true, message: t("auth.register.name_required") },
                  {
                    min: 2,
                    message: t("profile.required.full_name_min", { value: 2 }),
                  },
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder={t("auth.register.name_placeholder")}
                  size="large"
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12} className="form-col">
              <Form.Item
                name="email"
                label={t("profile.email")}
                rules={[
                  {
                    required: true,
                    message: t("auth.register.email_required"),
                  },
                  {
                    type: "email",
                    message: t("auth.register.email_not_valid"),
                  },
                ]}
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder={t("auth.register.email_placeholder")}
                  size="large"
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12} className="form-col">
              <Form.Item
                name="phone_number"
                label={t("profile.phone_number")}
                rules={[
                  {
                    required: true,
                    message: t("auth.register.phone_required"),
                  },
                  { validator: validatePhone },
                ]}
              >
                <Input
                  prefix={<PhoneOutlined />}
                  placeholder={t("auth.register.phone_placeholder")}
                  size="large"
                  maxLength={10}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12} className="form-col">
              <Form.Item name="username" label={t("profile.username")}>
                <Input
                  prefix={<UserOutlined />}
                  placeholder={t("auth.register.username_placeholder")}
                  size="large"
                  disabled
                />
              </Form.Item>
            </Col>

            <Col xs={24} className="form-col">
              <Form.Item
                name="address"
                label={t("profile.address")}
                rules={[
                  {
                    required: true,
                    message: t("profile.required.address_required"),
                  },
                  {
                    min: 2,
                    message: t("profile.required.address_min", { value: 2 }),
                  },
                ]}
              >
                <TextArea
                  placeholder={t("auth.register.address_placeholder")}
                  rows={3}
                  showCount
                  maxLength={255}
                />
              </Form.Item>
            </Col>

            {isEditing && (
              <Col xs={24} className="form-col password-section">
                <Divider orientation="left" className="password-divider">
                  <Text strong className="divider-text">
                    {t("profile.edit_password")}
                  </Text>
                </Divider>

                <Row gutter={24} className="form-row password-fields">
                  <Col xs={24} md={8} className="form-col">
                    <Form.Item
                      name="old_password"
                      label={t("profile.current_password")}
                      rules={[{ validator: validateOldPassword }]}
                    >
                      <Input.Password
                        prefix={<LockOutlined />}
                        placeholder={t("profile.current_password")}
                        size="large"
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={8} className="form-col">
                    <Form.Item
                      name="password"
                      label={t("profile.new_password")}
                      rules={[
                        {
                          required: true,
                          message: t("auth.register.password_required"),
                        },
                        {
                          validator: (_, value) => {
                            if (!value) return Promise.resolve();

                            if (value.length < 8) {
                              return Promise.reject(
                                t("auth.register.password_min")
                              );
                            }

                            if (!/[A-Z]/.test(value)) {
                              return Promise.reject(
                                t("auth.register.password_uppercase")
                              );
                            }

                            if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
                              return Promise.reject(
                                t("auth.register.password_special")
                              );
                            }

                            if (/\s/.test(value)) {
                              return Promise.reject(
                                t("auth.register.password_whitespace")
                              );
                            }

                            return Promise.resolve();
                          },
                        },
                      ]}
                    >
                      <Input.Password
                        prefix={<LockOutlined />}
                        placeholder={t("profile.new_password")}
                        size="large"
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={8} className="form-col">
                    <Form.Item
                      name="confirm_password"
                      label={t("profile.confirm_password")}
                      rules={[{ validator: validateConfirmPassword }]}
                    >
                      <Input.Password
                        prefix={<LockOutlined />}
                        placeholder={t("profile.confirm_password")}
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
            )}
          </Row>

          {isEditing && (
            <div className="form-actions">
              <Divider />
              <div className="action-buttons">
                <Button
                  icon={<CloseOutlined />}
                  onClick={handleCancel}
                  size="large"
                >
                  {t("profile.cancel")}
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SaveOutlined />}
                  loading={loading}
                  size="large"
                >
                  {t("profile.save")}
                </Button>
              </div>
            </div>
          )}
        </Form>
      </Card>
    </div>
  );
};

export default UserProfileForm;
