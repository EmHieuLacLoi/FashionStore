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
    const payload = { ...values };

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
          <Form.Item label={t("order.form.userName")} name="fullName">
            <Input
              className="w-full"
              placeholder={t("order.form.userNamePlaceholder")}
              style={{ width: "100%" }}
              allowClear
            />
          </Form.Item>
        </Col>

        <Col flex={1} style={{ width: maxWidthInput }}>
          <Form.Item label={t("order.form.minTotalAmount")} name="minPrice">
            <InputNumber
              className="w-full"
              placeholder={t("order.form.minTotalAmountPlaceholder")}
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
          <Form.Item label={t("order.form.maxTotalAmount")} name="maxPrice">
            <InputNumber
              className="w-full"
              placeholder={t("order.form.maxTotalAmountPlaceholder")}
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
          <Form.Item label={t("order.form.status")} name="status">
            <Select
              className="w-full"
              allowClear
              placeholder={t("order.form.statusPlaceholder")}
            >
              <Select.Option value={0}>
                {t("order.constant.PENDING")}
              </Select.Option>
              <Select.Option value={1}>
                {t("order.constant.PROCESSING")}
              </Select.Option>
              <Select.Option value={2}>
                {t("order.constant.SHIPPED")}
              </Select.Option>
              <Select.Option value={3}>
                {t("order.constant.COMPLETED")}
              </Select.Option>
              <Select.Option value={4}>
                {t("order.constant.CANCELLED")}
              </Select.Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
});

export default SearchAction;
