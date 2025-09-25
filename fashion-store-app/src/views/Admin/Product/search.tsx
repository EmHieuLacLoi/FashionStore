import { Form, Input, Row, Col, Select, InputNumber, Switch } from "antd";
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
  const [nameValue, setNameValue] = useState("");
  const debouncedNameValue = useDebounce(nameValue, 700);

  const maxWidthInput = 250;

  useEffect(() => {
    if (initialValues) {
      const formValues = { ...initialValues };
      if (typeof formValues.is_available === "string") {
        formValues.is_available = formValues.is_available === "true";
      }
      form.setFieldsValue(formValues);
    }
  }, [initialValues, form]);

  useEffect(() => {
    if (debouncedNameValue !== undefined) {
      const currentValues = form.getFieldsValue();
      if (currentValues.name === debouncedNameValue && handleSearch) {
        const payload = prepareSearchPayload(currentValues);
        handleSearch(payload);
      }
    }
  }, [debouncedNameValue]);
  useImperativeHandle(ref, () => ({
    getFields: () => form.getFieldsValue(),
  }));

  const prepareSearchPayload = (values: any) => {
    const payload = { ...values };

    // Convert boolean to string for API
    if (typeof payload.is_available === "boolean") {
      payload.is_available = payload.is_available.toString();
    }

    return payload;
  };

  const onValuesChange = (changedValues: any, allValues: any) => {
    if ("name" in changedValues) {
      setNameValue(changedValues.name || "");
      return;
    }

    const payload = prepareSearchPayload(allValues);

    if (handleSearch) {
      handleSearch(payload);
    }
  };

  const handleNameChange = (e: any) => {
    const newValue = e.target.value;
    setNameValue(newValue);
  };

  return (
    <Form
      layout="vertical"
      form={form}
      initialValues={{ is_available: undefined }}
      onValuesChange={onValuesChange}
    >
      <Row gutter={16} align="bottom" wrap={false}>
        <Col flex={1} style={{ width: maxWidthInput }}>
          <Form.Item label={t("product.form.name")} name="name">
            <Input
              className="w-full"
              allowClear
              placeholder={t("product.form.namePlaceholder")}
              onChange={handleNameChange}
              value={nameValue}
              maxLength={255}
              autoComplete="off"
            />
          </Form.Item>
        </Col>

        <Col flex={1} style={{ width: maxWidthInput }}>
          <Form.Item label={t("product.form.category")} name="category_id">
            <InputNumber
              className="w-full"
              placeholder={t("product.form.categoryPlaceholder")}
              min={1}
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>

        <Col flex={1} style={{ width: maxWidthInput }}>
          <Form.Item label={t("product.form.minPrice")} name="min_price">
            <InputNumber
              className="w-full"
              placeholder={t("product.form.minPricePlaceholder")}
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
          <Form.Item label={t("product.form.maxPrice")} name="max_price">
            <InputNumber
              className="w-full"
              placeholder={t("product.form.maxPricePlaceholder")}
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
          <Form.Item label={t("product.form.isAvailable")} name="is_available">
            <Select
              className="w-full"
              allowClear
              placeholder={t("product.form.isAvailablePlaceholder")}
            >
              <Select.Option value="true">Available</Select.Option>
              <Select.Option value="false">Unavailable</Select.Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
});

export default SearchAction;
