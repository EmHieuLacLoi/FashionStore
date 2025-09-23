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
  Radio,
} from "antd";
import {
  CopyOutlined,
  RollbackOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { useGlobalContext } from "../../GlobalContext";
import { useNavigate } from "react-router";
import "./CheckoutPage.scss";
import { useCreateOrder, useDeleteOrder } from "@hooks/OrderHooks";
import { useCreatePayment } from "@hooks/PaymentHooks";
import { OrderStatus } from "@constants/OrderStatus";
import { PaymentMethod } from "@constants/PaymentMethod";
import { PaymentStatus } from "@constants/PaymentStatus";
import { useTranslation } from "react-i18next";

const { Title, Text } = Typography;

const CheckoutPage: React.FC = () => {
  const { cartItems, clearCart, currentUser, shippingFee } = useGlobalContext();
  const navigate = useNavigate();
  const createOrderMutation = useCreateOrder();
  const createPaymentMutation = useCreatePayment();
  const deleteOrderMutation = useDeleteOrder();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const generateOrderId = () => {
    try {
      if (typeof crypto !== "undefined" && (crypto as any).randomUUID) {
        return `ORD-${(crypto as any)
          .randomUUID()
          .split("-")[0]
          .toUpperCase()}`;
      }
    } catch {}
    return `ORD-${Date.now().toString(36)}${Math.random()
      .toString(36)
      .slice(2, 6)}`.toUpperCase();
  };

  const [transferNote, setTransferNote] = useState(generateOrderId());
  const [paymentMethod, setPaymentMethod] = useState<"bank" | "cod">("cod");

  const subtotal =
    cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0) + shippingFee;

  const bankName = (import.meta as any).env?.VITE_BANK_NAME || "MB BANK";
  const accountName =
    (import.meta as any).env?.VITE_ACCOUNT_NAME || "VO TRUNG HIEU";
  const accountNumber =
    (import.meta as any).env?.VITE_ACCOUNT_NUMBER || "0945941389";

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
    { label: t("checkout_page.payment.bankName"), value: bankName },
    { label: t("checkout_page.payment.accountName"), value: accountName },
    {
      label: t("checkout_page.payment.accountNumber"),
      value: accountNumber,
      copyable: true,
    },
    {
      label: t("checkout_page.payment.amount"),
      value: `${(subtotal + shippingFee).toLocaleString("vi-VN")}đ`,
      isAmount: true,
    },
  ];

  const handleConfirmOrder = async () => {
    setLoading(true);

    const orderItemsData = cartItems.map((item) => ({
      product_variant_id: item.productVariantId,
      quantity: item.quantity,
      unit_price: item.price,
      total_price: item.price * item.quantity,
    }));

    const orderData = {
      code: transferNote,
      user_id: currentUser?.id,
      status: OrderStatus.PENDING,
      total_amount: subtotal + shippingFee,
      address: currentUser?.address,
      phone_number: currentUser?.phone_number,
      order_items: orderItemsData,
    };

    try {
      const orderRes = await createOrderMutation.mutateAsync(orderData);
      if (orderRes?.error_status === 1) {
        const paymentData = {
          order_id: orderRes.data.id,
          payment_method:
            paymentMethod === "bank"
              ? PaymentMethod.BANK_TRANSFER
              : PaymentMethod.COD,
          amount: subtotal + shippingFee,
          status: PaymentStatus.PENDING,
          payment_date: new Date(),
        };

        const paymentRes = await createPaymentMutation.mutateAsync(paymentData);
        if (paymentRes?.error_status === 1) {
          if (paymentMethod === "bank") {
            message.success(t("checkout_page.message.bank_success"));
          } else {
            message.success(t("checkout_page.message.cod_success"));
          }
        } else {
          await deleteOrderMutation.mutateAsync(orderRes.data.id);
          message.error(t("checkout_page.message.payment_failed"));
        }
      } else {
        message.error(t("checkout_page.message.failed"));
      }
    } catch (error) {
      console.error(error);
      message.error(t("checkout_page.message.failed"));
    } finally {
      setLoading(false);
    }

    clearCart();
    navigate("/");
  };

  return (
    <div className="checkout-page">
      <Row gutter={[32, 32]}>
        <Col span={24} className="page-header">
          <Title level={3}>{t("checkout_page.confirm_order")}</Title>
        </Col>

        <Col xs={24} lg={16}>
          <Card className="payment-details-card" bordered={false}>
            {paymentMethod === "bank" ? (
              <Row>
                <Col xs={24} md={8} className="qr-section">
                  <Image src={vietQRUrl} preview={false} />
                  <Text className="qr-note">{t("checkout_page.qr_note")}</Text>
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
                          <Tooltip title={t("checkout_page.copy")}>
                            <Button
                              shape="circle"
                              icon={<CopyOutlined />}
                              size="small"
                              onClick={() =>
                                copyToClipboard(
                                  info.value,
                                  `${t(
                                    "checkout_page.copied"
                                  )} ${info.label.toLowerCase()}`
                                )
                              }
                            />
                          </Tooltip>
                        )}
                      </div>
                    </div>
                  ))}
                  <div className="info-row">
                    <Text className="info-label">
                      {t("checkout_page.transfer_note")}
                    </Text>
                    <div className="info-value">
                      <Input.Group compact style={{ width: "100%" }}>
                        <Input
                          style={{ width: "calc(100% - 32px)" }}
                          value={transferNote}
                          onChange={(e) => setTransferNote(e.target.value)}
                        />
                        <Tooltip title={t("checkout_page.copy")}>
                          <Button
                            icon={<CopyOutlined />}
                            onClick={() =>
                              copyToClipboard(
                                transferNote,
                                t("checkout_page.copied")
                              )
                            }
                          />
                        </Tooltip>
                      </Input.Group>
                      <Text className="transfer-note-guide">
                        {t("checkout_page.transfer_note_guide")}
                      </Text>
                    </div>
                  </div>
                </Col>
              </Row>
            ) : (
              <div>
                <Title level={5}>{t("checkout_page.cod")}</Title>
                <Text>{t("checkout_page.cod_note")}</Text>
                <Divider />
                <Text type="secondary">
                  {t("checkout_page.cod_note_guide")}
                </Text>
              </div>
            )}
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card
            className="order-summary-card"
            title={
              <Title level={5} style={{ margin: 0 }}>
                {t("checkout_page.order_summary")}
              </Title>
            }
            bordered={false}
          >
            <div style={{ marginBottom: 16 }}>
              <Text strong>{t("checkout_page.payment_method")}</Text>
              <div style={{ marginTop: 8 }}>
                <Radio.Group
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <Space direction="vertical">
                    <Radio value="cod">{t("checkout_page.cod")}</Radio>
                    <Radio value="bank">{t("checkout_page.bank")}</Radio>
                  </Space>
                </Radio.Group>
              </div>
            </div>
            <div className="order-item-list">
              {cartItems.length > 0 ? (
                cartItems.map((item) => (
                  <div key={item.key} className="order-item">
                    <div>
                      <Text style={{ marginRight: 8 }}>
                        {item.name}{" "}
                        <Text type="secondary">x{item.quantity}:</Text>
                      </Text>
                      <Text strong>
                        {(item.price * item.quantity).toLocaleString("vi-VN")}đ
                      </Text>
                    </div>
                    <div>
                      <Text style={{ marginRight: 8 }}>
                        {t("checkout_page.shipping_fee")}:
                      </Text>
                      <Text strong>{shippingFee.toLocaleString("vi-VN")}đ</Text>
                    </div>
                  </div>
                ))
              ) : (
                <Text type="secondary">{t("checkout_page.empty_cart")}</Text>
              )}
            </div>

            <div className="summary-total">
              <Text strong className="total-label">
                {t("checkout_page.total")}
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
                loading={loading}
                onClick={handleConfirmOrder}
              >
                {t("checkout_page.confirm_order")}
              </Button>
              <Button
                className="back-to-cart-btn"
                icon={<RollbackOutlined />}
                onClick={() => navigate("/cart")}
                block
              >
                {t("checkout_page.back_to_cart")}
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CheckoutPage;
