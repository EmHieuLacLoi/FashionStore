import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Modal,
  Descriptions,
  Empty,
  Button,
  Divider,
  Tag,
  Table,
  type TableProps,
} from "antd";
import moment from "moment";
import { OrderStatusColor } from "@constants/OrderStatus";
import { PaymentMethodLabel } from "@constants/PaymentMethod";
import { PaymentStatusColor } from "@constants/PaymentStatus";

interface OrderDetailComponentProps {
  data: any;
  visible: boolean;
  onOk: () => void;
  onCancel: () => void;
  loading?: boolean;
}

const currencyFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
});

const OrderDetailComponent: React.FC<OrderDetailComponentProps> = ({
  data,
  visible,
  onOk,
  onCancel,
}) => {
  const { t } = useTranslation();

  useEffect(() => {
    if (data) {
      console.log(data);
    }
  }, [data]);

  const itemColumns: TableProps<any>["columns"] = [
    {
      title: t("order.detail.product_name"),
      dataIndex: "product_name",
      key: "product_name",
      align: "left",
    },
    {
      title: t("order.detail.color"),
      dataIndex: "color",
      key: "color",
      align: "left",
      render: (text, record) => record?.product_variant?.color || "",
    },
    {
      title: t("order.detail.size"),
      dataIndex: "size",
      key: "size",
      align: "left",
      render: (text, record) => record?.product_variant?.size || "",
    },
    {
      title: t("order.detail.quantity"),
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
    },
    {
      title: t("order.detail.unit_price"),
      dataIndex: "unit_price",
      key: "unit_price",
      align: "right",
      render: (price: number) => currencyFormatter.format(price),
    },
    {
      title: t("order.detail.total_price"),
      dataIndex: "total_price",
      key: "total_price",
      align: "right",
      render: (price: number) => currencyFormatter.format(price),
    },
  ];

  return (
    <Modal
      title={`${t("order.detail.title")} - ${data?.code || ""}`}
      open={visible}
      onOk={onOk}
      onCancel={onCancel}
      width={800}
      centered
      footer={[
        <Button key="ok" type="primary" onClick={onOk}>
          {t("common.button.ok")}
        </Button>,
      ]}
    >
      {data ? (
        <div className="max-h-[500px] overflow-y-auto custom-scrollbar pr-4">
          <Divider orientation="left">{t("order.detail.order_info")}</Divider>
          <Descriptions bordered size="small" column={2}>
            <Descriptions.Item label={t("order.attribute.code")}>
              {data.code}
            </Descriptions.Item>
            <Descriptions.Item label={t("order.attribute.status")}>
              <Tag
                className={
                  OrderStatusColor(t)[data?.status || 0].color + " text-white"
                }
              >
                {OrderStatusColor(t)[data?.status || 0].label}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label={t("order.attribute.user_name")}>
              {data.user_name}
            </Descriptions.Item>
            <Descriptions.Item label={t("order.attribute.created_at")}>
              {moment(data.created_at).format("HH:mm DD/MM/YYYY")}
            </Descriptions.Item>
            <Descriptions.Item
              label={t("order.attribute.phone_number")}
              span={2}
            >
              {data.phone_number}
            </Descriptions.Item>
            <Descriptions.Item label={t("order.attribute.address")} span={2}>
              {data.address}
            </Descriptions.Item>
            <Descriptions.Item label={t("order.attribute.shipping_fee")}>
              {currencyFormatter.format(data.shipping_fee || 0)}
            </Descriptions.Item>
            <Descriptions.Item label={t("order.attribute.total_amount")}>
              {currencyFormatter.format(data.total_amount || 0)}
            </Descriptions.Item>
          </Descriptions>

          <Divider orientation="left">{t("order.detail.product_info")}</Divider>
          <Table
            columns={itemColumns}
            dataSource={data.order_items || []}
            rowKey="id"
            pagination={false}
            size="small"
          />

          {data.payment && (
            <>
              <Divider orientation="left">
                {t("order.detail.payment_info")}
              </Divider>
              <Descriptions bordered size="small" column={1}>
                <Descriptions.Item
                  label={t("payment.attribute.payment_method")}
                >
                  {
                    PaymentMethodLabel(t)[data.payment?.payment_method || 0]
                      .label
                  }
                </Descriptions.Item>
                <Descriptions.Item label={t("payment.attribute.status")}>
                  <Tag
                    className={
                      PaymentStatusColor(t)[data.payment?.status || 0].color +
                      " text-white"
                    }
                  >
                    {PaymentStatusColor(t)[data.payment?.status || 0].label}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label={t("payment.attribute.amount")}>
                  <strong>
                    {currencyFormatter.format(data.payment.amount || 0)}
                  </strong>
                </Descriptions.Item>
              </Descriptions>
            </>
          )}
        </div>
      ) : (
        <Empty description={t("common.change_info.no_detail_data")} />
      )}
    </Modal>
  );
};

export default OrderDetailComponent;
