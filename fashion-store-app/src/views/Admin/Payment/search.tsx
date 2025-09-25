import { Form, Input, Row, Col, Select, InputNumber } from "antd";
import { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDebounce } from "@utils/debounce";

export type keySearchAction = "search" | "add";
interface SearchActionProps {
  handleSearch?: (values: any) => void;
  entity?: string;
  initialValues?: any;
}
const SearchAction = forwardRef<unknown, SearchActionProps>((props, ref) => {
  const { t } = useTranslation();
  const { handleSearch, initialValues } = props;
  const [form] = Form.useForm();
  const [transactionIdValue, setTransactionIdValue] = useState("");
  const debouncedTransactionIdValue = useDebounce(transactionIdValue, 700);

  const maxWidthInput = 250;

  useEffect(() => {
    if (initialValues) {
      const formValues = { ...initialValues };
      if (typeof formValues.status === "string" && formValues.status) {
        formValues.status = formValues.status.split(",").map(String);
      }
      if (typeof formValues.payment_method === "string" && formValues.payment_method) {
        formValues.payment_method = formValues.payment_method.split(",").map(String);
      }
      form.setFieldsValue(formValues);
    }
  }, [initialValues, form]);

  useEffect(() => {
    if (debouncedTransactionIdValue !== undefined) {
      const currentValues = form.getFieldsValue();
      if (currentValues.transaction_id === debouncedTransactionIdValue && handleSearch) {
        const payload = prepareSearchPayload(currentValues);
        handleSearch(payload);
      }
    }
  }, [debouncedTransactionIdValue]);
  useImperativeHandle(ref, () => ({
    getFields: () => form.getFieldsValue(),
  }));

  const prepareSearchPayload = (values: any) => {
    const statusArray = Array.isArray(values.status) ? values.status : [];
    const paymentMethodArray = Array.isArray(values.payment_method) ? values.payment_method : [];

    const cleanedStatus = statusArray.filter(
      (v: any) => v !== "" && v !== null && v !== undefined
    );
    const cleanedPaymentMethod = paymentMethodArray.filter(
      (v: any) => v !== "" && v !== null && v !== undefined
    );

    const payload = { ...values };

    if (cleanedStatus.length) {
      payload.status = cleanedStatus.join(",");
    } else {
      delete payload.status;
    }

    if (cleanedPaymentMethod.length) {
      payload.payment_method = cleanedPaymentMethod.join(",");
    } else {
      delete payload.payment_method;
    }

    return payload;
  };

  const onValuesChange = (changedValues: any, allValues: any) => {
    if ("transaction_id" in changedValues) {
      setTransactionIdValue(changedValues.transaction_id || "");
      return;
    }

    const payload = prepareSearchPayload(allValues);

    if (handleSearch) {
      handleSearch(payload);
    }
  };

  const handleTransactionIdChange = (e: any) => {
    const newValue = e.target.value;
    setTransactionIdValue(newValue);
  };

  return (
    <Form
      layout="vertical"
      form={form}
      initialValues={{ status: [], payment_method: [] }}
      onValuesChange={onValuesChange}
    >
      <Row gutter={16} align="bottom" wrap={false}>
        <Col flex={1} style={{ width: maxWidthInput }}>
          <Form.Item label={t("payment.form.transactionId")} name="transaction_id">
            <Input
              className="w-full"
              allowClear
              placeholder={t("payment.form.transactionIdPlaceholder")}
              onChange={handleTransactionIdChange}
              value={transactionIdValue}
              maxLength={100}
              autoComplete="off"
            />
          </Form.Item>
        </Col>

        <Col flex={1} style={{ width: maxWidthInput }}>
          <Form.Item label={t("payment.form.orderId")} name="order_id">
            <InputNumber
              className="w-full"
              placeholder={t("payment.form.orderIdPlaceholder")}
              min={1}
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>

        <Col flex={1} style={{ width: maxWidthInput }}>
          <Form.Item label={t("payment.form.minAmount")} name="min_amount">
            <InputNumber
              className="w-full"
              placeholder={t("payment.form.minAmountPlaceholder")}
              min={0}
              style={{ width: "100%" }}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value?.replace(/\$\s?|(,*)/g, '') as any}
            />
          </Form.Item>
        </Col>

        <Col flex={1} style={{ width: maxWidthInput }}>
          <Form.Item label={t("payment.form.maxAmount")} name="max_amount">
            <InputNumber
              className="w-full"
              placeholder={t("payment.form.maxAmountPlaceholder")}
              min={0}
              style={{ width: "100%" }}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value?.replace(/\$\s?|(,*)/g, '') as any}
            />
          </Form.Item>
        </Col>

        <Col flex={1} style={{ width: maxWidthInput }}>
          <Form.Item label={t("payment.form.paymentMethod")} name="payment_method">
            <Select
              className="w-full"
              allowClear
              placeholder={t("payment.form.paymentMethodPlaceholder")}
              mode="multiple"
            >
              <Select.Option value="CREDIT_CARD">Credit Card</Select.Option>
              <Select.Option value="DEBIT_CARD">Debit Card</Select.Option>
              <Select.Option value="PAYPAL">PayPal</Select.Option>
              <Select.Option value="BANK_TRANSFER">Bank Transfer</Select.Option>
              <Select.Option value="CASH_ON_DELIVERY">Cash on Delivery</Select.Option>
            </Select>
          </Form.Item>
        </Col>

        <Col flex={1} style={{ width: maxWidthInput }}>
          <Form.Item label={t("payment.form.status")} name="status">
            <Select
              className="w-full"
              allowClear
              placeholder={t("payment.form.statusPlaceholder")}
              mode="multiple"
            >
              <Select.Option value="PENDING">Pending</Select.Option>
              <Select.Option value="PROCESSING">Processing</Select.Option>
              <Select.Option value="COMPLETED">Completed</Select.Option>
              <Select.Option value="FAILED">Failed</Select.Option>
              <Select.Option value="REFUNDED">Refunded</Select.Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
});

export default SearchAction;
