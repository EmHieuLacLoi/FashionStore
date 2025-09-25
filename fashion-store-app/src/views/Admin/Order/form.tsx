import moment from "moment";
import {
  Button,
  Form,
  Input,
  Modal,
  Row,
  Col,
  InputNumber,
  Select,
} from "antd";
import React, { useEffect, useState } from "react";
import { message } from "@utils/antd-static";
import {
  OrderServerStateKeysEnum,
  useCreateOrder,
  useUpdateOrder,
} from "@hooks/OrderHooks";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { SaveOutlined } from "@ant-design/icons";

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
  const insertMutation = useCreateOrder();
  const updateMutation = useUpdateOrder();
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

      const transformedData = transformedDataBase;
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
      formData.code = formData.code.trim();
      formData.address = formData.address.trim();
      formData.phone_number = formData.phone_number.trim();

      let res: any;
      if (type === "create") {
        res = await insertMutation.mutateAsync(formData);
      } else {
        console.log(dataEdit, formData);
        res = await updateMutation.mutateAsync({ ...dataEdit, ...formData });
      }
      if (res && (res.error_status === 1 || res.data?.error_status === 1)) {
        message.success(
          t(`common.message.${type}_success`, { value: t(`order.name`) })
        );
        queryClient.invalidateQueries({
          queryKey: [OrderServerStateKeysEnum.Items],
        });
        closeForm();
      } else {
        message.error(
          t(`common.message.${type}_fail`, { value: t(`order.name`) })
        );
      }
    } catch (error: any) {
      console.log(error);
      if (error?.response?.data?.error_message) {
        message.destroy();
        message.error(
          t(`common.message.${type}_fail`, { value: t(`order.name`) }) +
            ": " +
            error?.response?.data?.error_message
        );
      } else {
        message.error(
          t(`common.message.${type}_fail`, { value: t(`order.name`) })
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
      width={800}
      className="custom-modal"
    >
      <div
        className="text-[18px] font-semibold p-4"
        style={{ maxWidth: "95%", marginBottom: "4px" }}
      >
        {t(`order.title.${type}`)} {dataEdit?.code || ""}
      </div>
      <div className="max-h-[600px] custom-scrollbar px-4">
        <Form form={form} layout="vertical">
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                label={t("order.form.code")}
                name="code"
                rules={[
                  {
                    required: true,
                    message: t("order.form.codePlaceholder"),
                  },
                ]}
              >
                <Input
                  placeholder={t("order.form.codePlaceholder")}
                  maxLength={50}
                  autoComplete="off"
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label={t("order.form.userId")}
                name="user_id"
                rules={[
                  {
                    required: true,
                    message: t("order.form.userIdPlaceholder"),
                  },
                ]}
              >
                <InputNumber
                  placeholder={t("order.form.userIdPlaceholder")}
                  min={1}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label={t("order.form.totalAmount")}
                name="total_amount"
                rules={[
                  {
                    required: true,
                    message: t("order.form.totalAmountPlaceholder"),
                  },
                ]}
              >
                <InputNumber
                  placeholder={t("order.form.totalAmountPlaceholder")}
                  min={0}
                  style={{ width: "100%" }}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value?.replace(/\$\s?|(,*)/g, "") as any}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label={t("order.form.status")}
                name="status"
                rules={[
                  {
                    required: true,
                    message: t("order.form.statusPlaceholder"),
                  },
                ]}
              >
                <Select placeholder={t("order.form.statusPlaceholder")}>
                  <Select.Option value="PENDING">Pending</Select.Option>
                  <Select.Option value="CONFIRMED">Confirmed</Select.Option>
                  <Select.Option value="PROCESSING">Processing</Select.Option>
                  <Select.Option value="SHIPPED">Shipped</Select.Option>
                  <Select.Option value="DELIVERED">Delivered</Select.Option>
                  <Select.Option value="CANCELLED">Cancelled</Select.Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label={t("order.form.phoneNumber")}
                name="phone_number"
                rules={[
                  {
                    required: true,
                    message: t("order.form.phoneNumberPlaceholder"),
                  },
                ]}
              >
                <Input
                  placeholder={t("order.form.phoneNumberPlaceholder")}
                  maxLength={20}
                  autoComplete="off"
                />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                label={t("order.form.address")}
                name="address"
                rules={[
                  {
                    required: true,
                    message: t("order.form.addressPlaceholder"),
                  },
                ]}
              >
                <Input.TextArea
                  placeholder={t("order.form.addressPlaceholder")}
                  maxLength={500}
                  autoComplete="off"
                  rows={3}
                />
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
