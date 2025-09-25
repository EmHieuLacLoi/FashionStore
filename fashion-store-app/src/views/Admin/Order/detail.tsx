import React from "react";
import { useTranslation } from "react-i18next";
import {
  Modal,
  Descriptions,
  Spin,
  Empty,
  Button,
  Divider,
  Table,
  Tag,
} from "antd"; // Thêm Divider, Table, Tag
import moment from "moment"; // Dùng moment để format ngày tháng

interface OrderDetailComponentProps {
  data?: any;
  visible: boolean;
  onOk: () => void;
  onCancel: () => void;
  loading?: boolean;
}

// --- Các hàm và object tiện ích để chuyển đổi dữ liệu ---

// Chuyển đổi status đơn hàng
const orderStatusMap: { [key: number]: { text: string; color: string } } = {
  1: { text: "Pending", color: "gold" },
  2: { text: "Confirmed", color: "lime" },
  3: { text: "Processing", color: "processing" },
  4: { text: "Shipped", color: "geekblue" },
  5: { text: "Delivered", color: "success" },
  6: { text: "Cancelled", color: "error" },
};

// Chuyển đổi status thanh toán
const paymentStatusMap: { [key: number]: { text: string; color: string } } = {
  0: { text: "Chưa thanh toán", color: "orange" },
  1: { text: "Đã thanh toán", color: "success" },
  2: { text: "Thất bại", color: "error" },
};

// Chuyển đổi phương thức thanh toán
const paymentMethodMap: { [key: number]: string } = {
  1: "Thanh toán khi nhận hàng (COD)",
  2: "Chuyển khoản ngân hàng",
  3: "Thanh toán qua VNPAY",
};

// Định dạng tiền tệ
const currencyFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
});

const OrderDetailComponent: React.FC<OrderDetailComponentProps> = ({
  data,
  visible,
  onOk,
  onCancel,
  loading,
}) => {
  const { t } = useTranslation();

  const hasData = data && Object.keys(data).length > 0;
  const isLoading = loading || (visible && !data);

  // Cấu hình cột cho bảng chi tiết sản phẩm
  const itemColumns = [
    {
      title: "Sản phẩm",
      dataIndex: "product_name",
      key: "product_name",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
    },
    {
      title: "Đơn giá",
      dataIndex: "unit_price",
      key: "unit_price",
      align: "right",
      render: (price: number) => currencyFormatter.format(price),
    },
    {
      title: "Thành tiền",
      dataIndex: "total_price",
      key: "total_price",
      align: "right",
      render: (price: number) => currencyFormatter.format(price),
    },
  ];

  return (
    <Modal
      title={`${t("order.detail_title")} - ${data?.code || ""}`}
      open={visible}
      onOk={onOk}
      onCancel={onCancel}
      width={800} // Tăng chiều rộng để hiển thị bảng
      centered
      footer={[
        <Button key="ok" type="primary" onClick={onOk}>
          {t("common.button.ok")}
        </Button>,
      ]}
    >
      {isLoading ? (
        <div style={{ textAlign: "center", padding: "50px 0" }}>
          <Spin size="large" />
        </div>
      ) : hasData ? (
        <div className="max-h-[600px] overflow-y-auto custom-scrollbar pr-4">
          {/* === Thông tin chính của đơn hàng === */}
          <Divider orientation="left">Thông tin đơn hàng</Divider>
          <Descriptions bordered size="small" column={2}>
            <Descriptions.Item label="Mã đơn hàng">
              {data.code}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Tag color={orderStatusMap[data.status]?.color}>
                {orderStatusMap[data.status]?.text || "Không xác định"}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Khách hàng">
              {data.user_name}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày đặt">
              {moment(data.created_at).format("HH:mm DD/MM/YYYY")}
            </Descriptions.Item>
            <Descriptions.Item label="Số điện thoại" span={2}>
              {data.phone_number}
            </Descriptions.Item>
            <Descriptions.Item label="Địa chỉ giao hàng" span={2}>
              {data.address}
            </Descriptions.Item>
            <Descriptions.Item label="Phí vận chuyển">
              {currencyFormatter.format(data.shipping_fee || 0)}
            </Descriptions.Item>
            <Descriptions.Item label="Tổng tiền hàng">
              {currencyFormatter.format(data.total_amount || 0)}
            </Descriptions.Item>
          </Descriptions>

          {/* === Chi tiết thanh toán === */}
          {data.payment && (
            <>
              <Divider orientation="left">Thông tin thanh toán</Divider>
              <Descriptions bordered size="small" column={1}>
                <Descriptions.Item label="Phương thức">
                  {paymentMethodMap[data.payment.payment_method] ||
                    "Không xác định"}
                </Descriptions.Item>
                <Descriptions.Item label="Trạng thái thanh toán">
                  <Tag color={paymentStatusMap[data.payment.status]?.color}>
                    {paymentStatusMap[data.payment.status]?.text ||
                      "Không xác định"}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Tổng tiền thanh toán">
                  <strong>
                    {currencyFormatter.format(data.payment.amount || 0)}
                  </strong>
                </Descriptions.Item>
              </Descriptions>
            </>
          )}

          {/* === Danh sách sản phẩm === */}
          <Divider orientation="left">Chi tiết sản phẩm</Divider>
          {/* <Table
            columns={itemColumns}
            dataSource={data.order_items || []}
            rowKey="id"
            pagination={false}
            size="small"
          /> */}
        </div>
      ) : (
        <Empty description={t("common.change_info.no_detail_data")} />
      )}
    </Modal>
  );
};

export default OrderDetailComponent;
