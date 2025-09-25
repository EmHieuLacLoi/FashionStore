import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Empty,
  Image,
  Input,
  InputNumber,
  List,
  Row,
  Space,
  Typography,
  Divider,
  Tag,
} from "antd";
import { message } from "@utils/antd-static";
import {
  DeleteOutlined,
  ShoppingCartOutlined,
  CreditCardOutlined,
} from "@ant-design/icons";
import { useGlobalContext } from "../../GlobalContext";
import { useNavigate } from "react-router";
import "./CartPage.scss";
import { useGetUserInfo } from "@hooks/AuthHooks";
import { useUpdate } from "@hooks/UserHooks";
import { useTranslation } from "react-i18next";

const { Title, Text } = Typography;

const CartPage: React.FC = () => {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    setCurrentUser,
    shippingFee,
    setShippingFee,
  } = useGlobalContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const updateMutation = useUpdate();
  const [userInfo, setUserInfo] = useState<any>(null);
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    address: "",
    phone_number: "",
  });
  const [touched, setTouched] = useState({
    address: false,
    phone_number: false,
  });

  const { data } = useGetUserInfo({
    enabled: !!localStorage.getItem("accessToken"),
    refetchOnWindowFocus: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target as HTMLInputElement;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSaveUserInfo = async () => {
    try {
      setLoading(true);
      const updateData = {
        ...userInfo,
        address: formData.address,
        phone_number: formData.phone_number,
      };
      const updateRes = await updateMutation.mutateAsync(updateData);

      if (updateRes?.error_status == 1) {
        message.success(t("cart_page.update_user_info_success"));
      }

      setUserInfo({
        ...userInfo,
        address: formData.address,
        phone_number: formData.phone_number,
      });
    } catch (error) {
      console.log(error);
      message.error(t("cart_page.update_user_info_error"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (data) {
      setUserInfo(data?.data);
    }
  }, [data]);

  useEffect(() => {
    if (userInfo) {
      setFormData({
        address: userInfo.address || "",
        phone_number: userInfo.phone_number || "",
      });
    }
  }, [userInfo]);

  const subtotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const totalItems = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  useEffect(() => {
    if (subtotal > 500000) {
      setShippingFee(0);
    } else if (subtotal > 0) {
      const thousands = Math.floor(Math.random() * 21) + 10;
      const fee = thousands * 1000;
      setShippingFee(fee);
    } else {
      setShippingFee(0);
    }
  }, [subtotal]);

  const grandTotal = subtotal + shippingFee;

  const handleCheckout = () => {
    if (!userInfo) {
      navigate("/login");
      return;
    }

    const addressValue = (formData.address || "").trim();
    const phoneValue = (formData.phone_number || "").trim();
    if (!addressValue || !phoneValue) {
      setTouched((prev) => ({ ...prev, address: true, phone_number: true }));
      if (!addressValue && !phoneValue) {
        message.warning(t("cart_page.warning.address_and_phone_number"));
      } else if (!addressValue) {
        message.warning(t("cart_page.warning.address"));
      } else {
        message.warning(t("cart_page.warning.phone_number"));
      }
      return;
    }

    setCurrentUser({
      ...userInfo,
      address: formData.address,
      phone_number: formData.phone_number,
    });

    navigate("/checkout");
  };

  return (
    <div className="cart-page">
      <div className="cart-header">
        <Title level={2} className="cart-title">
          <ShoppingCartOutlined /> {t("cart_page.cart_title")}
        </Title>
        {cartItems.length > 0 && (
          <Tag color="blue" className="item-count">
            {totalItems} {t("cart_page.product")}
          </Tag>
        )}
      </div>

      <Row gutter={[32, 32]} className="cart-content">
        <Col xs={24} lg={16}>
          <Card className="cart-items-card" bordered={false}>
            {cartItems.length === 0 ? (
              <div className="empty-cart">
                <Empty
                  description={
                    <div className="empty-description">
                      <Text className="empty-text">
                        {t("cart_page.empty_cart")}
                      </Text>
                      <Text type="secondary">
                        {t("cart_page.empty_cart_description")}
                      </Text>
                    </div>
                  }
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
                <Button
                  type="primary"
                  size="large"
                  onClick={() => navigate("/products")}
                  className="continue-shopping-btn"
                >
                  {t("cart_page.continue_shopping")}
                </Button>
              </div>
            ) : (
              <>
                <div className="cart-items-header">
                  <Text strong>{t("cart_page.product_in_cart")}</Text>
                  <Button
                    type="text"
                    danger
                    onClick={clearCart}
                    className="clear-all-btn"
                    icon={<DeleteOutlined />}
                  >
                    {t("cart_page.clear_all")}
                  </Button>
                </div>

                <List
                  className="cart-items-list"
                  itemLayout="horizontal"
                  dataSource={cartItems}
                  renderItem={(item) => (
                    <List.Item className="cart-item">
                      <div className="item-image">
                        {item.image ? (
                          <Image
                            src={item.image}
                            width={100}
                            height={100}
                            style={{ objectFit: "cover", borderRadius: "8px" }}
                            preview={false}
                          />
                        ) : (
                          <div className="no-image">
                            <ShoppingCartOutlined />
                          </div>
                        )}
                      </div>

                      <div className="item-details">
                        <div className="item-info">
                          <Title level={5} className="item-name">
                            {item.name}
                          </Title>
                          <Space direction="vertical" size={4}>
                            <div className="item-variants">
                              <Tag color="blue">{item.color}</Tag>
                              {item.size && (
                                <Tag color="green">{item.size}</Tag>
                              )}
                            </div>
                          </Space>
                        </div>

                        <div className="item-price">
                          <Text strong className="price-text">
                            {item.price.toLocaleString("vi-VN")}đ
                          </Text>
                        </div>
                      </div>

                      <div className="item-actions">
                        <div className="quantity-controls">
                          <Text className="quantity-label">
                            {t("cart_page.quantity")}:
                          </Text>
                          <InputNumber
                            min={1}
                            value={item.quantity}
                            onChange={(val) =>
                              updateQuantity(item.key, Number(val || 1))
                            }
                            className="quantity-input"
                          />
                        </div>

                        <div className="item-total">
                          <Text type="secondary">{t("cart_page.total")}:</Text>
                          <Text strong className="total-price">
                            {(item.price * item.quantity).toLocaleString(
                              "vi-VN"
                            )}
                            đ
                          </Text>
                        </div>

                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => removeFromCart(item.key)}
                          className="remove-btn"
                        >
                          {t("cart_page.remove")}
                        </Button>
                      </div>
                    </List.Item>
                  )}
                />
              </>
            )}
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <div className="cart-summary-sticky">
            <Card className="cart-summary-card" bordered={false}>
              <div className="summary-header">
                <Title level={4}>{t("cart_page.order_info")}</Title>
              </div>

              <div className="summary-content">
                <div className="summary-row" style={{ display: "block" }}>
                  <Text strong>{t("cart_page.shipping_info")}</Text>
                  <div style={{ marginTop: 8 }}>
                    <Input
                      placeholder="Địa chỉ giao hàng"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      style={{ marginBottom: 8 }}
                      required
                    />
                    {touched.address && !(formData.address || "").trim() && (
                      <Text
                        type="danger"
                        style={{
                          fontSize: 12,
                          display: "block",
                          marginTop: -4,
                          marginBottom: 8,
                        }}
                      >
                        {t("cart_page.warning.address_required")}
                      </Text>
                    )}
                    <Input
                      placeholder="Số điện thoại"
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      style={{ marginBottom: 8 }}
                      required
                    />
                    {touched.phone_number &&
                      !(formData.phone_number || "").trim() && (
                        <Text
                          type="danger"
                          style={{
                            fontSize: 12,
                            display: "block",
                            marginTop: -4,
                            marginBottom: 8,
                          }}
                        >
                          {t("cart_page.warning.phone_number_required")}
                        </Text>
                      )}
                    <Space>
                      <Button
                        type="primary"
                        onClick={handleSaveUserInfo}
                        disabled={!formData.address}
                        loading={loading}
                      >
                        {t("cart_page.save_shipping_info")}
                      </Button>
                    </Space>
                  </div>
                </div>
                <div className="summary-row">
                  <Text>
                    {t("cart_page.subtotal")} ({totalItems}{" "}
                    {t("cart_page.product")}):
                  </Text>
                  <Text strong>{subtotal.toLocaleString("vi-VN")}đ</Text>
                </div>

                <div className="summary-row">
                  <Text>{t("cart_page.shipping_fee")}:</Text>
                  <Text>
                    {shippingFee === 0
                      ? t("cart_page.free_shipping")
                      : `${shippingFee.toLocaleString("vi-VN")}đ`}
                  </Text>
                </div>

                <Divider className="summary-divider" />

                <div className="summary-row total-row">
                  <Text strong className="total-label">
                    {t("cart_page.summary")}:
                  </Text>
                  <Text strong className="total-amount">
                    {grandTotal.toLocaleString("vi-VN")}đ
                  </Text>
                </div>
              </div>

              <div className="summary-actions">
                <Button
                  type="primary"
                  size="large"
                  icon={<CreditCardOutlined />}
                  onClick={handleCheckout}
                  className="checkout-btn"
                  disabled={
                    cartItems.length === 0 ||
                    !(formData.address || "").trim() ||
                    !(formData.phone_number || "").trim()
                  }
                >
                  {t("cart_page.checkout")}
                </Button>

                <Button
                  type="default"
                  size="large"
                  onClick={() => navigate("/products")}
                  className="continue-btn"
                  block
                >
                  {t("cart_page.continue_shopping")}
                </Button>
              </div>
            </Card>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default CartPage;
