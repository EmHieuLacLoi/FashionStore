import React from "react";
import {
  Button,
  Card,
  Col,
  Empty,
  Image,
  InputNumber,
  List,
  Row,
  Space,
  Typography,
  Divider,
  Tag,
} from "antd";
import {
  DeleteOutlined,
  ShoppingCartOutlined,
  CreditCardOutlined,
} from "@ant-design/icons";
import { useGlobalContext } from "../../GlobalContext";
import { useNavigate } from "react-router";
import "./CartPage.scss";

const { Title, Text } = Typography;

const CartPage: React.FC = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart } =
    useGlobalContext();
  const navigate = useNavigate();

  const subtotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const totalItems = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="cart-page">
      <div className="cart-header">
        <Title level={2} className="cart-title">
          <ShoppingCartOutlined /> Giỏ hàng của bạn
        </Title>
        {cartItems.length > 0 && (
          <Tag color="blue" className="item-count">
            {totalItems} sản phẩm
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
                        Giỏ hàng của bạn đang trống
                      </Text>
                      <Text type="secondary">
                        Hãy thêm sản phẩm để tiếp tục mua sắm
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
                  Tiếp tục mua sắm
                </Button>
              </div>
            ) : (
              <>
                <div className="cart-items-header">
                  <Text strong>Sản phẩm trong giỏ</Text>
                  <Button
                    type="text"
                    danger
                    onClick={clearCart}
                    className="clear-all-btn"
                    icon={<DeleteOutlined />}
                  >
                    Xóa tất cả
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
                            <Text type="secondary" className="item-sku">
                              SKU: {item.sku}
                            </Text>
                            <div className="item-variants">
                              <Tag color="blue">{item.color}</Tag>
                              {item.storage && (
                                <Tag color="green">{item.storage}</Tag>
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
                          <Text className="quantity-label">Số lượng:</Text>
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
                          <Text type="secondary">Thành tiền:</Text>
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
                          Xóa
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
                <Title level={4}>Thông tin đơn hàng</Title>
              </div>

              <div className="summary-content">
                <div className="summary-row">
                  <Text>Tạm tính ({totalItems} sản phẩm):</Text>
                  <Text strong>{subtotal.toLocaleString("vi-VN")}đ</Text>
                </div>

                <div className="summary-row">
                  <Text>Phí vận chuyển:</Text>
                  <Text>Miễn phí</Text>
                </div>

                <Divider className="summary-divider" />

                <div className="summary-row total-row">
                  <Text strong className="total-label">
                    Tổng cộng:
                  </Text>
                  <Text strong className="total-amount">
                    {subtotal.toLocaleString("vi-VN")}đ
                  </Text>
                </div>
              </div>

              <div className="summary-actions">
                <Button
                  type="primary"
                  size="large"
                  disabled={cartItems.length === 0}
                  onClick={() => navigate("/checkout")}
                  className="checkout-btn"
                  icon={<CreditCardOutlined />}
                  block
                >
                  Tiến hành thanh toán
                </Button>

                <Button
                  type="default"
                  size="large"
                  onClick={() => navigate("/products")}
                  className="continue-btn"
                  block
                >
                  Tiếp tục mua sắm
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
