import moment from "moment";
import { Button, Form, Input, Modal, Row, Col, Select } from "antd";
import React, { useEffect, useState } from "react";
import { ServerStateKeysEnum, useCreate, useUpdate } from "@hooks/UserHooks";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { SaveOutlined } from "@ant-design/icons";
import { message } from "@utils/antd-static";

interface FormComponentProps {
  dataEdit?: any;
  showModal: boolean;
  handleCancel?: () => void;
  type: "create" | "update" | "delete";
}

const FormComponent: React.FC<FormComponentProps> = ({
  dataEdit,
  showModal,
  handleCancel,
  type,
}) => {
  const { t } = useTranslation();
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [form] = Form.useForm();
  const insertMutation = useCreate();
  const updateMutation = useUpdate();
  const queryClient = useQueryClient();

  const transformDates = (
    data: any,
    keyMapping: { [targetKey: string]: string },
    isForCreate = false
  ) => {
    return Object.keys(keyMapping).reduce((acc, targetKey) => {
      const sourceKey = keyMapping[targetKey];
      const dateValue = data[sourceKey];
      if (dateValue) {
        const m = moment(dateValue);
        acc[targetKey] = m.isValid()
          ? isForCreate
            ? m.format("YYYY-MM-DDTHH:mm:ss")
            : m
          : null;
      }
      return acc;
    }, {} as any);
  };

  useEffect(() => {
    if (dataEdit && type === "update") {
      const mapping: { [key: string]: any } = {};

      const transformedDataBase = {
        ...dataEdit,
        ...transformDates(dataEdit, mapping),
      };

      const transformedData = {
        ...transformedDataBase,
        role: transformedDataBase.role == "ROLE_ADMIN" ? 1 : 2,
      };

      form.setFieldsValue({
        ...transformedData,
      });
    }
  }, [dataEdit, type, form]);

  const submitForm = async () => {
    setLoadingFetch(true);
    try {
      await form.validateFields();
      const formData = form.getFieldsValue();
      formData.username = formData.username.trim();
      formData.email = formData.email.trim();
      formData.full_name = formData.full_name.trim();

      let res: any;
      if (type === "create") {
        res = await insertMutation.mutateAsync(formData);
      } else {
        const dataUpdate = {
          ...dataEdit,
          ...formData,
          id: dataEdit.id,
        };
        res = await updateMutation.mutateAsync(dataUpdate);
      }
      if (res && (res?.error_status == 1 || res?.data?.error_status == 1)) {
        message.success(
          t(`common.message.${type}_success`, {
            value: t(`user.name`),
          })
        );
        queryClient.invalidateQueries({
          queryKey: [ServerStateKeysEnum.Items],
        });
        closeForm();
      } else {
        message.error(
          t(`common.message.${type}_fail`, { value: t(`user.name`) })
        );
      }
    } catch (error: any) {
      console.log(error);
      if (error?.response?.data?.error_message) {
        message.destroy();
        message.error(
          t(`common.message.${type}_fail`, { value: t(`user.name`) }) +
            ": " +
            error?.response?.data?.error_message
        );
      } else {
        message.error(
          t(`common.message.${type}_fail`, { value: t(`user.name`) })
        );
      }
    } finally {
      setLoadingFetch(false);
    }
  };

  const closeForm = () => {
    handleCancel && handleCancel();
    form.resetFields();
  };

  return (
    <Modal
      maskClosable={false}
      open={showModal}
      centered
      footer={false}
      onCancel={closeForm}
      width={600}
      className="custom-modal"
    >
      <div
        className="text-[18px] font-semibold p-4"
        style={{ maxWidth: "95%", marginBottom: "4px" }}
      >
        {t(`user.title.${type}`)} {dataEdit?.username || ""}
      </div>
      <div className="max-h-[600px] custom-scrollbar px-4">
        <Form form={form} layout="vertical">
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                label={t("user.form.username")}
                name="username"
                rules={[
                  {
                    required: true,
                    message: t("user.form.usernamePlaceholder"),
                  },
                ]}
              >
                <Input
                  placeholder={t("user.form.usernamePlaceholder")}
                  maxLength={50}
                  autoComplete="off"
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label={t("user.form.email")}
                name="email"
                rules={[
                  {
                    required: true,
                    type: "email",
                    message: t("user.form.emailPlaceholder"),
                  },
                ]}
              >
                <Input
                  placeholder={t("user.form.emailPlaceholder")}
                  maxLength={100}
                  autoComplete="off"
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label={t("user.form.full_name")}
                name="full_name"
                rules={[
                  {
                    required: true,
                    message: t("user.form.full_namePlaceholder"),
                  },
                ]}
              >
                <Input
                  placeholder={t("user.form.full_namePlaceholder")}
                  maxLength={50}
                  autoComplete="off"
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label={t("user.form.phone_number")}
                name="phone_number"
                rules={[
                  {
                    required: true,
                    message: t("user.form.phoneNumberPlaceholder"),
                  },
                ]}
              >
                <Input
                  placeholder={t("user.form.phoneNumberPlaceholder")}
                  maxLength={10}
                  autoComplete="off"
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label={t("user.form.address")}
                name="address"
                rules={[
                  {
                    required: true,
                    message: t("user.form.addressPlaceholder"),
                  },
                ]}
              >
                <Input
                  placeholder={t("user.form.addressPlaceholder")}
                  maxLength={255}
                  autoComplete="off"
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label={t("user.form.role")}
                name="role"
                rules={[
                  {
                    required: true,
                    message: t("user.form.rolePlaceholder"),
                  },
                ]}
              >
                <Select placeholder={t("user.form.rolePlaceholder")}>
                  <Select.Option value={1}>
                    {t("common.constant.ADMIN")}
                  </Select.Option>
                  <Select.Option value={2}>
                    {t("common.constant.USER")}
                  </Select.Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label={t("user.form.status")}
                name="status"
                rules={[
                  {
                    required: true,
                    message: t("user.form.statusPlaceholder"),
                  },
                ]}
              >
                <Select placeholder={t("user.form.statusPlaceholder")}>
                  <Select.Option value={1}>
                    {t("common.constant.ACTIVE")}
                  </Select.Option>
                  <Select.Option value={0}>
                    {t("common.constant.INACTIVE")}
                  </Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
      <div className="flex gap-2 pt-2 justify-end p-4">
        <Button disabled={loadingFetch} onClick={closeForm} type="text">
          {t("common.button.cancel")}
        </Button>
        <Button loading={loadingFetch} onClick={submitForm} type="primary">
          {t("common.button.save")} <SaveOutlined />
        </Button>
      </div>
    </Modal>
  );
};

export default FormComponent;
