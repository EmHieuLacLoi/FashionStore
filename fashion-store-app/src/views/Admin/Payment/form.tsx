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
import {
  PaymentServerStateKeysEnum,
  useCreatePayment,
  useUpdatePayment,
} from "@hooks/PaymentHooks";
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
  const insertMutation = useCreatePayment();
  const updateMutation = useUpdatePayment();
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
      formData.transaction_id = formData.transaction_id.trim();

      let res: any;
      if (type === "create") {
        res = await insertMutation.mutateAsync(formData);
      } else {
        console.log(dataEdit, formData);
        res = await updateMutation.mutateAsync({ ...dataEdit, ...formData });
      }
      if (res && (res.error_status === 1 || res.data?.error_status === 1)) {
        message.success(
          t(`common.message.${type}_success`, { value: t(`payment.name`) })
        );
        queryClient.invalidateQueries({
          queryKey: [PaymentServerStateKeysEnum.Items],
        });
        closeForm();
      } else {
        message.error(
          t(`common.message.${type}_fail`, { value: t(`payment.name`) })
        );
      }
    } catch (error: any) {
      console.log(error);
      if (error?.response?.data?.error_message) {
        message.destroy();
        message.error(
          t(`common.message.${type}_fail`, { value: t(`payment.name`) }) +
            ": " +
            error?.response?.data?.error_message
        );
      } else {
        message.error(
          t(`common.message.${type}_fail`, { value: t(`payment.name`) })
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
        {t(`payment.title.${type}`)} {dataEdit?.transaction_id || ""}
      </div>
      <div className="max-h-[600px] custom-scrollbar px-4">
        <Form form={form} layout="vertical">
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                label={t("payment.form.orderId")}
                name="order_id"
                rules={[
                  {
                    required: true,
                    message: t("payment.form.orderIdPlaceholder"),
                  },
                ]}
              >
                <InputNumber
                  placeholder={t("payment.form.orderIdPlaceholder")}
                  min={1}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label={t("payment.form.amount")}
                name="amount"
                rules={[
                  {
                    required: true,
                    message: t("payment.form.amountPlaceholder"),
                  },
                ]}
              >
                <InputNumber
                  placeholder={t("payment.form.amountPlaceholder")}
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
                label={t("payment.form.paymentMethod")}
                name="payment_method"
                rules={[
                  {
                    required: true,
                    message: t("payment.form.paymentMethodPlaceholder"),
                  },
                ]}
              >
                <Select
                  placeholder={t("payment.form.paymentMethodPlaceholder")}
                >
                  <Select.Option value="CREDIT_CARD">Credit Card</Select.Option>
                  <Select.Option value="DEBIT_CARD">Debit Card</Select.Option>
                  <Select.Option value="PAYPAL">PayPal</Select.Option>
                  <Select.Option value="BANK_TRANSFER">
                    Bank Transfer
                  </Select.Option>
                  <Select.Option value="CASH_ON_DELIVERY">
                    Cash on Delivery
                  </Select.Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label={t("payment.form.status")}
                name="status"
                rules={[
                  {
                    required: true,
                    message: t("payment.form.statusPlaceholder"),
                  },
                ]}
              >
                <Select placeholder={t("payment.form.statusPlaceholder")}>
                  <Select.Option value="PENDING">Pending</Select.Option>
                  <Select.Option value="PROCESSING">Processing</Select.Option>
                  <Select.Option value="COMPLETED">Completed</Select.Option>
                  <Select.Option value="FAILED">Failed</Select.Option>
                  <Select.Option value="REFUNDED">Refunded</Select.Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label={t("payment.form.transactionId")}
                name="transaction_id"
                rules={[
                  {
                    required: true,
                    message: t("payment.form.transactionIdPlaceholder"),
                  },
                ]}
              >
                <Input
                  placeholder={t("payment.form.transactionIdPlaceholder")}
                  maxLength={100}
                  autoComplete="off"
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label={t("payment.form.paymentDate")}
                name="payment_date"
                rules={[
                  {
                    required: true,
                    message: t("payment.form.paymentDatePlaceholder"),
                  },
                ]}
              >
                <Input
                  type="datetime-local"
                  placeholder={t("payment.form.paymentDatePlaceholder")}
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
