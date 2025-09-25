import moment from "moment";
import { Button, Form, Input, Modal, Row, Col, message, InputNumber, Switch, Select } from "antd";
import React, { useEffect, useState } from "react";
import {
  ProductServerStateKeysEnum,
  useCreateProduct,
  useUpdateProduct,
} from "@hooks/ProductHooks";
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
  const insertMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
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
      formData.name = formData.name.trim();
      formData.description = formData.description.trim();

      let res: any;
      if (type === "create") {
        res = await insertMutation.mutateAsync(formData);
      } else {
        console.log(dataEdit, formData);
        res = await updateMutation.mutateAsync({ ...dataEdit, ...formData });
      }
      if (res && (res.error_status === 1 || res.data?.error_status === 1)) {
        message.success(
          t(`common.message.${type}_success`, { value: t(`product.name`) })
        );
        queryClient.invalidateQueries({
          queryKey: [ProductServerStateKeysEnum.Items],
        });
        closeForm();
      } else {
        message.error(
          t(`common.message.${type}_fail`, { value: t(`product.name`) })
        );
      }
    } catch (error: any) {
      console.log(error);
      if (error?.response?.data?.error_message) {
        message.destroy();
        message.error(
          t(`common.message.${type}_fail`, { value: t(`product.name`) }) +
            ": " +
            error?.response?.data?.error_message
        );
      } else {
        message.error(
          t(`common.message.${type}_fail`, { value: t(`product.name`) })
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
        {t(`product.title.${type}`)} {dataEdit?.name || ""}
      </div>
      <div className="max-h-[600px] custom-scrollbar px-4">
        <Form form={form} layout="vertical">
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                label={t("product.form.name")}
                name="name"
                rules={[
                  {
                    required: true,
                    message: t("product.form.namePlaceholder"),
                  },
                ]}
              >
                <Input
                  placeholder={t("product.form.namePlaceholder")}
                  maxLength={255}
                  autoComplete="off"
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label={t("product.form.category")}
                name="category_id"
                rules={[
                  {
                    required: true,
                    message: t("product.form.categoryPlaceholder"),
                  },
                ]}
              >
                <InputNumber
                  placeholder={t("product.form.categoryPlaceholder")}
                  min={1}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label={t("product.form.price")}
                name="price"
                rules={[
                  {
                    required: true,
                    message: t("product.form.pricePlaceholder"),
                  },
                ]}
              >
                <InputNumber
                  placeholder={t("product.form.pricePlaceholder")}
                  min={0}
                  style={{ width: "100%" }}
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => value?.replace(/\$\s?|(,*)/g, '') as any}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label={t("product.form.originalPrice")}
                name="original_price"
              >
                <InputNumber
                  placeholder={t("product.form.originalPricePlaceholder")}
                  min={0}
                  style={{ width: "100%" }}
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => value?.replace(/\$\s?|(,*)/g, '') as any}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label={t("product.form.stockQuantity")}
                name="stock_quantity"
                rules={[
                  {
                    required: true,
                    message: t("product.form.stockQuantityPlaceholder"),
                  },
                ]}
              >
                <InputNumber
                  placeholder={t("product.form.stockQuantityPlaceholder")}
                  min={0}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label={t("product.form.isAvailable")}
                name="is_available"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                label={t("product.form.description")}
                name="description"
                rules={[
                  {
                    required: true,
                    message: t("product.form.descriptionPlaceholder"),
                  },
                ]}
              >
                <Input.TextArea
                  placeholder={t("product.form.descriptionPlaceholder")}
                  maxLength={1000}
                  autoComplete="off"
                  rows={4}
                />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                label={t("product.form.imageUrl")}
                name="image_url"
              >
                <Input
                  placeholder={t("product.form.imageUrlPlaceholder")}
                  maxLength={500}
                  autoComplete="off"
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
