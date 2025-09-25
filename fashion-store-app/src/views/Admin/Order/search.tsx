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
  const [codeValue, setCodeValue] = useState("");
  const debouncedCodeValue = useDebounce(codeValue, 700);

  const maxWidthInput = 250;

  useEffect(() => {
    if (initialValues) {
      const formValues = { ...initialValues };
      if (typeof formValues.status === "string" && formValues.status) {
        formValues.status = formValues.status.split(",").map(String);
      }
      form.setFieldsValue(formValues);
    }
  }, [initialValues, form]);

  useEffect(() => {
    if (debouncedCodeValue !== undefined) {
      const currentValues = form.getFieldsValue();
      if (currentValues.code === debouncedCodeValue && handleSearch) {
        const payload = prepareSearchPayload(currentValues);
        handleSearch(payload);
      }
    }
  }, [debouncedCodeValue]);
  useImperativeHandle(ref, () => ({
    getFields: () => form.getFieldsValue(),
  }));

  const prepareSearchPayload = (values: any) => {
    const statusArray = Array.isArray(values.status) ? values.status : [];
    const cleanedStatus = statusArray.filter(
      (v: any) => v !== "" && v !== null && v !== undefined
    );
    const payload = { ...values };

    if (cleanedStatus.length) {
      payload.status = cleanedStatus.join(",");
    } else {
      delete payload.status;
    }
    return payload;
  };

  const onValuesChange = (changedValues: any, allValues: any) => {
    if ("code" in changedValues) {
      setCodeValue(changedValues.code || "");
      return;
    }

    const payload = prepareSearchPayload(allValues);

    if (handleSearch) {
      handleSearch(payload);
    }
  };

  const handleCodeChange = (e: any) => {
    const newValue = e.target.value;
    setCodeValue(newValue);
  };

  return (
    <Form
      layout="vertical"
      form={form}
      initialValues={{ status: [] }}
      onValuesChange={onValuesChange}
    >
      <Row gutter={16} align="bottom" wrap={false}>
        <Col flex={1} style={{ width: maxWidthInput }}>
          <Form.Item label={t("order.form.code")} name="code">
            <Input
              className="w-full"
              allowClear
              placeholder={t("order.form.codePlaceholder")}
              onChange={handleCodeChange}
              value={codeValue}
              maxLength={50}
              autoComplete="off"
            />
          </Form.Item>
        </Col>

        <Col flex={1} style={{ width: maxWidthInput }}>
          <Form.Item label={t("order.form.userId")} name="user_id">
            <InputNumber
              className="w-full"
              placeholder={t("order.form.userIdPlaceholder")}
              min={1}
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>

        <Col flex={1} style={{ width: maxWidthInput }}>
          <Form.Item label={t("order.form.minTotalAmount")} name="min_total_amount">
            <InputNumber
              className="w-full"
              placeholder={t("order.form.minTotalAmountPlaceholder")}
              min={0}
              style={{ width: "100%" }}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value?.replace(/\$\s?|(,*)/g, '') as any}
            />
          </Form.Item>
        </Col>

        <Col flex={1} style={{ width: maxWidthInput }}>
          <Form.Item label={t("order.form.maxTotalAmount")} name="max_total_amount">
            <InputNumber
              className="w-full"
              placeholder={t("order.form.maxTotalAmountPlaceholder")}
              min={0}
              style={{ width: "100%" }}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value?.replace(/\$\s?|(,*)/g, '') as any}
            />
          </Form.Item>
        </Col>

        <Col flex={1} style={{ width: maxWidthInput }}>
          <Form.Item label={t("order.form.status")} name="status">
            <Select
              className="w-full"
              allowClear
              placeholder={t("order.form.statusPlaceholder")}
              mode="multiple"
            >
              <Select.Option value="PENDING">Pending</Select.Option>
              <Select.Option value="CONFIRMED">Confirmed</Select.Option>
              <Select.Option value="PROCESSING">Processing</Select.Option>
              <Select.Option value="SHIPPED">Shipped</Select.Option>
              <Select.Option value="DELIVERED">Delivered</Select.Option>
              <Select.Option value="CANCELLED">Cancelled</Select.Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
});

export default SearchAction;
