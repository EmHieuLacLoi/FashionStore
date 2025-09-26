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

  const maxWidthInput = 280;

  useEffect(() => {
    if (initialValues) {
      const formValues = { ...initialValues };

      form.setFieldsValue(formValues);
    }
  }, [initialValues, form]);

  useEffect(() => {
    if (debouncedTransactionIdValue !== undefined) {
      const currentValues = form.getFieldsValue();
      if (
        currentValues.transaction_id === debouncedTransactionIdValue &&
        handleSearch
      ) {
        const payload = prepareSearchPayload(currentValues);
        handleSearch(payload);
      }
    }
  }, [debouncedTransactionIdValue]);
  useImperativeHandle(ref, () => ({
    getFields: () => form.getFieldsValue(),
  }));

  const prepareSearchPayload = (values: any) => {
    const payload = { ...values };

    return payload;
  };

  const onValuesChange = (changedValues: any, allValues: any) => {
    const payload = prepareSearchPayload(allValues);

    if (handleSearch) {
      handleSearch(payload);
    }
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
          <Form.Item label={t("payment.form.orderCode")} name="orderCode">
            <Input
              className="w-full"
              allowClear
              placeholder={t("payment.form.orderCodePlaceholder")}
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>

        <Col flex={1} style={{ width: maxWidthInput }}>
          <Form.Item label={t("payment.form.minAmount")} name="minAmount">
            <InputNumber
              className="w-full"
              placeholder={t("payment.form.minAmountPlaceholder")}
              min={0}
              style={{ width: "100%" }}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value?.replace(/\$\s?|(,*)/g, "") as any}
            />
          </Form.Item>
        </Col>

        <Col flex={1} style={{ width: maxWidthInput }}>
          <Form.Item label={t("payment.form.maxAmount")} name="maxAmount">
            <InputNumber
              className="w-full"
              placeholder={t("payment.form.maxAmountPlaceholder")}
              min={0}
              style={{ width: "100%" }}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value?.replace(/\$\s?|(,*)/g, "") as any}
            />
          </Form.Item>
        </Col>

        <Col flex={1} style={{ width: maxWidthInput }}>
          <Form.Item
            label={t("payment.form.paymentMethodSearch")}
            name="paymentMethod"
          >
            <Select
              className="w-full"
              allowClear
              placeholder={t("payment.form.paymentMethodPlaceholder")}
            >
              <Select.Option value="2">
                {t("payment.constant.COD")}
              </Select.Option>
              <Select.Option value="3">
                {t("payment.constant.BANK_TRANSFER")}
              </Select.Option>
            </Select>
          </Form.Item>
        </Col>

        <Col flex={1} style={{ width: maxWidthInput }}>
          <Form.Item label={t("payment.form.status")} name="status">
            <Select
              className="w-full"
              allowClear
              placeholder={t("payment.form.statusPlaceholder")}
            >
              <Select.Option value={0}>
                {t("payment.constant.PENDING")}
              </Select.Option>
              <Select.Option value={1}>
                {t("payment.constant.COMPLETED")}
              </Select.Option>
              <Select.Option value={2}>
                {t("payment.constant.FAILED")}
              </Select.Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
});

export default SearchAction;
