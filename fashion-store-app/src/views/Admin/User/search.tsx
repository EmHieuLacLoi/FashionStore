import { Form, Input, Row, Col, Select } from "antd";
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
      if (typeof formValues.status === "string" && formValues.status) {
        formValues.status = formValues.status.split(",").map(String);
      }
      form.setFieldsValue(formValues);
    }
  }, [initialValues, form]);

  useEffect(() => {
    if (debouncedNameValue !== undefined) {
      const currentValues = form.getFieldsValue();
      if (currentValues.username === debouncedNameValue && handleSearch) {
        const payload = prepareSearchPayload(currentValues);
        handleSearch(payload);
      }
    }
  }, [debouncedNameValue]);
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
    if ("username" in changedValues) {
      setNameValue(changedValues.username || "");
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
      initialValues={{ status: [] }}
      onValuesChange={onValuesChange}
    >
      <Row gutter={16} align="bottom" wrap={false}>
        <Col flex={1} style={{ width: maxWidthInput }}>
          <Form.Item label={t("user.form.username")} name="username">
            <Input
              className="w-full"
              allowClear
              placeholder={t("user.form.usernamePlaceholder")}
              onChange={handleNameChange}
              value={nameValue}
              maxLength={50}
              autoComplete="off"
            />
          </Form.Item>
        </Col>

        <Col flex={1} style={{ width: maxWidthInput }}>
          <Form.Item label={t("user.form.full_name")} name="full_name">
            <Input
              className="w-full"
              allowClear
              placeholder={t("user.form.full_namePlaceholder")}
              maxLength={100}
              autoComplete="off"
            />
          </Form.Item>
        </Col>

        <Col flex={1} style={{ width: maxWidthInput }}>
          <Form.Item label={t("user.form.email")} name="email">
            <Input
              className="w-full"
              allowClear
              placeholder={t("user.form.emailPlaceholder")}
              maxLength={100}
              autoComplete="off"
            />
          </Form.Item>
        </Col>

        <Col flex={1} style={{ width: maxWidthInput }}>
          <Form.Item label={t("user.form.phone_number")} name="phone_number">
            <Input
              className="w-full"
              allowClear
              placeholder={t("user.form.phoneNumberPlaceholder")}
              maxLength={10}
              autoComplete="off"
            />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
});

export default SearchAction;
