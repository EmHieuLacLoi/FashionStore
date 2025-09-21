import React, { useState } from "react";
import {
  Row,
  Col,
  Card,
  Space,
  Typography,
  Image,
  Divider,
  Input,
  Button,
  Tooltip,
  message,
  List,
} from "antd";
import {
  CopyOutlined,
  RollbackOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { useGlobalContext } from "../../GlobalContext";
import { useNavigate } from "react-router";
import "./CheckoutPage.scss"; // Import file SCSS mới

const { Title, Text } = Typography;

const CheckoutPage: React.FC = () => {
  const { cartItems, clearCart } = useGlobalContext();
  const navigate = useNavigate();

  const [transferNote, setTransferNote] = useState(
    `ORDER-${new Date().getTime()}`
  );

  const subtotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const bankName = (import.meta as any).env?.VITE_BANK_NAME || "MB BANK";
  const accountName =
    (import.meta as any).env?.VITE_ACCOUNT_NAME || "NGUYEN VAN A";
  const accountNumber =
    (import.meta as any).env?.VITE_ACCOUNT_NUMBER || "0123456789";

  const vietQRUrl = `https://img.vietqr.io/image/${bankName.replace(
    /\s/g,
    ""
  )}-${accountNumber}-print.png?amount=${subtotal}&addInfo=${encodeURIComponent(
    transferNote
  )}&accountName=${encodeURIComponent(accountName)}`;

  const copyToClipboard = (text: string, successMessage: string) => {
    navigator.clipboard.writeText(text);
    message.success(successMessage);
  };

  const paymentInfo = [
    { label: "Ngân hàng", value: bankName },
    { label: "Chủ tài khoản", value: accountName },
    { label: "Số tài khoản", value: accountNumber, copyable: true },
    {
      label: "Số tiền",
      value: `${subtotal.toLocaleString("vi-VN")}đ`,
      isAmount: true,
    },
  ];

  return (
    <div className="checkout-page">
      <Row gutter={[32, 32]}>
        <Col span={24} className="page-header">
          <Title level={3}>Xác nhận thanh toán</Title>
        </Col>

        {/* Cột trái: Thông tin chuyển khoản */}
        <Col xs={24} lg={16}>
          <Card className="payment-details-card" bordered={false}>
            <Row>
              <Col xs={24} md={8} className="qr-section">
                <Image src={vietQRUrl} preview={false} />
                <Text className="qr-note">
                  Sử dụng App Ngân hàng hoặc Ví điện tử để quét mã QR
                </Text>
              </Col>
              <Col xs={24} md={16} className="info-section">
                {paymentInfo.map((info) => (
                  <div key={info.label} className="info-row">
                    <Text className="info-label">{info.label}</Text>
                    <div
                      className={`info-value ${
                        info.isAmount ? "total-amount" : ""
                      }`}
                    >
                      <Text strong>{info.value}</Text>
                      {info.copyable && (
                        <Tooltip title="Sao chép">
                          <Button
                            shape="circle"
                            icon={<CopyOutlined />}
                            size="small"
                            onClick={() =>
                              copyToClipboard(
                                info.value,
                                `Đã sao chép ${info.label.toLowerCase()}`
                              )
                            }
                          />
                        </Tooltip>
                      )}
                    </div>
                  </div>
                ))}
                <div className="info-row">
                  <Text className="info-label">Nội dung CK</Text>
                  <div className="info-value">
                    <Input.Group compact style={{ width: "100%" }}>
                      <Input
                        style={{ width: "calc(100% - 32px)" }}
                        value={transferNote}
                        onChange={(e) => setTransferNote(e.target.value)}
                      />
                      <Tooltip title="Sao chép">
                        <Button
                          icon={<CopyOutlined />}
                          onClick={() =>
                            copyToClipboard(
                              transferNote,
                              "Đã sao chép nội dung"
                            )
                          }
                        />
                      </Tooltip>
                    </Input.Group>
                    <Text className="transfer-note-guide">
                      Giữ nguyên nội dung để được xác nhận nhanh nhất.
                    </Text>
                  </div>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Cột phải: Tóm tắt đơn hàng */}
        <Col xs={24} lg={8}>
          <Card
            className="order-summary-card"
            title={
              <Title level={5} style={{ margin: 0 }}>
                Tóm tắt đơn hàng
              </Title>
            }
            bordered={false}
          >
            <div className="order-item-list">
              {cartItems.length > 0 ? (
                cartItems.map((item) => (
                  <div key={item.key} className="order-item">
                    <Text>
                      {item.name} <Text type="secondary">x{item.quantity}</Text>
                    </Text>
                    <Text strong>
                      {(item.price * item.quantity).toLocaleString("vi-VN")}đ
                    </Text>
                  </div>
                ))
              ) : (
                <Text type="secondary">Chưa có sản phẩm nào.</Text>
              )}
            </div>

            <div className="summary-total">
              <Text strong className="total-label">
                Tổng cộng
              </Text>
              <Text className="total-value">
                {subtotal.toLocaleString("vi-VN")}đ
              </Text>
            </div>

            <div className="action-buttons">
              <Button
                type="primary"
                className="confirm-payment-btn"
                disabled={cartItems.length === 0}
                icon={<CheckCircleOutlined />}
                onClick={() => {
                  message.success(
                    "Cảm ơn bạn! Đơn hàng sẽ được xử lý sau khi chúng tôi nhận được thanh toán."
                  );
                  clearCart();
                  navigate("/");
                }}
              >
                Tôi đã thanh toán
              </Button>
              <Button
                className="back-to-cart-btn"
                icon={<RollbackOutlined />}
                onClick={() => navigate("/cart")}
                block
              >
                Quay lại giỏ hàng
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CheckoutPage;
