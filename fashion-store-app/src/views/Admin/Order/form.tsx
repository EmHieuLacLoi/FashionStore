import moment from "moment";
import { Button, Form, Modal, Row, Col, Select } from "antd";
import React, { useEffect, useState } from "react";
import { message } from "@utils/antd-static";
import { OrderServerStateKeysEnum, useUpdateOrder } from "@hooks/OrderHooks";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { SaveOutlined } from "@ant-design/icons";
import { OrderStatus, OrderStatusColor } from "@constants/OrderStatus";

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

      let res: any;
      if (type === "update") {
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
      width={400}
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
            <Col span={24}>
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
                  <Select.Option value={OrderStatus.PENDING}>
                    {OrderStatusColor(t)[OrderStatus.PENDING].label}
                  </Select.Option>
                  <Select.Option value={OrderStatus.PROCESSING}>
                    {OrderStatusColor(t)[OrderStatus.PROCESSING].label}
                  </Select.Option>
                  <Select.Option value={OrderStatus.SHIPPED}>
                    {OrderStatusColor(t)[OrderStatus.SHIPPED].label}
                  </Select.Option>
                  <Select.Option value={OrderStatus.COMPLETED}>
                    {OrderStatusColor(t)[OrderStatus.COMPLETED].label}
                  </Select.Option>
                  <Select.Option value={OrderStatus.CANCELLED}>
                    {OrderStatusColor(t)[OrderStatus.CANCELLED].label}
                  </Select.Option>
                </Select>
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
