import { Form, Input, Row, Col } from "antd";
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
  const [nameValue, setNameValue] = useState("");
  const debouncedCodeValue = useDebounce(codeValue, 700);
  const debouncedNameValue = useDebounce(nameValue, 700);

  const [maxWidthInput, width] = [250, "100%"];

  useEffect(() => {
    if (initialValues) {
      const formValues = { ...initialValues };
      if (typeof formValues.status === "string" && formValues.status) {
        formValues.status = formValues.status.split(",").map(Number);
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
    if ("name" in changedValues) {
      setNameValue(changedValues.name || "");
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
        {/* Code */}
        <Col flex={1} style={{ width: maxWidthInput }}>
          <Form.Item label={t("environment.form.code")} name="code">
            <Input
              className="w-full"
              allowClear
              placeholder={t("environment.form.codePlaceholder")}
              onChange={handleCodeChange}
              value={codeValue}
              maxLength={20}
              autoComplete="off"
            />
          </Form.Item>
        </Col>
        {/* Name */}
        <Col flex={1} style={{ width: maxWidthInput }}>
          <Form.Item label={t("environment.form.name")} name="name">
            <Input
              placeholder={t("environment.form.namePlaceholder")}
              allowClear
              onChange={handleNameChange}
              value={nameValue}
              maxLength={255}
              autoComplete="off"
            />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
});

export default SearchAction;
