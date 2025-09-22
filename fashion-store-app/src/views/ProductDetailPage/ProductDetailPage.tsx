import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router";
import {
  Layout,
  Row,
  Col,
  Card,
  Button,
  Typography,
  Rate,
  Tag,
  Divider,
  InputNumber,
  Space,
  Breadcrumb,
  Image,
  Tabs,
  List,
  Avatar,
  Progress,
  Badge,
  Alert,
  Radio,
  Select,
  message,
} from "antd";
import {
  ShoppingCartOutlined,
  HeartOutlined,
  ShareAltOutlined,
  MinusOutlined,
  PlusOutlined,
  StarOutlined,
  CheckCircleOutlined,
  TruckOutlined,
  SafetyOutlined,
  ReloadOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { useGlobalContext } from "../../GlobalContext";
import type { Product } from "@models/product.interface";
import type { ProductVariant } from "@models/productVariant.interface";
import { useGetProductDetail } from "@hooks/ProductHooks";
import { useTranslation } from "react-i18next";
import { formatPrice } from "@utils/formatPrice";

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

interface Review {
  id: number;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

interface ProductDetailPageProps {
  productId?: number;
  onBackToList?: () => void;
}

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  productId,
  onBackToList,
}) => {
  const navigate = useNavigate();
  const params = useParams();
  const { addToCart, cloudinaryUrl, allProducts } = useGlobalContext();
  const resolvedProductId = (productId ?? Number(params.id)) || 1;
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | null>("");
  const [selectedSize, setSelectedSize] = useState<string | null>("");
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null
  );
  const { t } = useTranslation();

  const { data: productData } = useGetProductDetail(resolvedProductId, {
    enabled: !!resolvedProductId,
    onError: () => {
      message.error(t("product_detail_page.error.product_detail"));
    },
  });

  const product: Product = useMemo((): Product => {
    if (!productData?.data) {
      return {} as Product;
    }
    const rawProductData = productData.data;

    const imageUrlsArray: string[] = rawProductData.image_url
      ? JSON.parse(rawProductData.image_url)
      : [];
    const fullImageUrls = imageUrlsArray.map(
      (publicId: string) => `${cloudinaryUrl}${publicId}`
    );
    return {
      ...rawProductData,
      image_url: fullImageUrls,
    };
  }, [productData, cloudinaryUrl]);

  const reviews: Review[] = [
    {
      id: 1,
      userName: "Nguyễn Văn A",
      rating: 5,
      comment:
        "Sản phẩm tuyệt vời, camera chụp rất đẹp, pin trâu. Giao hàng nhanh, đóng gói cẩn thận.",
      date: "2024-12-15",
      verified: true,
    },
    {
      id: 2,
      userName: "Trần Thị B",
      rating: 4,
      comment:
        "Máy chạy mượt, thiết kế đẹp. Tuy nhiên giá hơi cao so với mong đợi.",
      date: "2024-12-10",
      verified: true,
    },
    {
      id: 3,
      userName: "Lê Minh C",
      rating: 5,
      comment:
        "Đã dùng được 2 tuần, rất hài lòng. Chip A17 Pro xử lý mọi tác vụ rất mượt mà.",
      date: "2024-12-08",
      verified: false,
    },
  ];

  const uniqueColors = useMemo(() => {
    if (!product?.variants) {
      return [];
    }
    return Array.from(new Set(product.variants.map((v: any) => v.color)));
  }, [product]);

  const getSizeOptions = (): string[] => {
    if (!product?.variants || !selectedColor) return [];
    return Array.from(
      new Set(
        product.variants
          .filter((v: any) => v.color === selectedColor && v.size != null)
          .map((v: any) => v.size as string)
      )
    );
  };

  useEffect(() => {
    if (product?.variants && selectedColor && selectedSize) {
      const variant = product.variants.find(
        (v: any) => v.color === selectedColor && v.size === selectedSize
      );
      setSelectedVariant(variant || null);
      setQuantity(1);
      setSelectedImage(0);
    } else {
      setSelectedVariant(null);
    }
  }, [selectedColor, selectedSize, product?.variants]);

  useEffect(() => {
    if (!selectedColor && uniqueColors.length > 0) {
      setSelectedColor(uniqueColors[0]);
    }
  }, [uniqueColors, selectedColor]);

  useEffect(() => {
    const sizeOptions = getSizeOptions();
    if (selectedColor && !selectedSize && sizeOptions.length > 0) {
      setSelectedSize(sizeOptions[0]);
    } else if (
      selectedColor &&
      selectedSize &&
      !sizeOptions.includes(selectedSize)
    ) {
      setSelectedSize(sizeOptions[0] || "");
    }
  }, [selectedColor, selectedSize]);

  const getCurrentImages = (): string[] => {
    if (!product || !product.image_url) {
      return [];
    }
    return product.image_url as string[];
  };

  const handleQuantityChange = (value: number | null) => {
    if (
      value &&
      value > 0 &&
      selectedVariant &&
      value <= selectedVariant.stock_quantity
    ) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    if (!selectedVariant) {
      alert(t("product_detail_page.alert.select_color_size"));
      return;
    }
    const key = `${resolvedProductId}-${selectedVariant.id}`;
    const images = getCurrentImages();

    if (images.length === 0) {
      return;
    }

    const image = images[0];
    addToCart({
      key,
      productId: resolvedProductId,
      name: `${product.name} ${selectedSize ? `- ${selectedSize}` : ""}`.trim(),
      color: selectedVariant.color,
      size: selectedVariant.size,
      price: product.price,
      image,
      quantity,
    });
    message.success(t("product_detail_page.message.add_to_cart"));
  };

  const handleBuyNow = () => {
    if (!selectedVariant) {
      alert(t("product_detail_page.alert.select_color_size"));
      return;
    }
    const key = `${resolvedProductId}-${selectedVariant.id}`;
    const images = getCurrentImages();

    if (images.length === 0) {
      return;
    }

    const image = images[0];
    addToCart({
      key,
      productId: resolvedProductId,
      name: `${product.name} ${selectedSize ? `- ${selectedSize}` : ""}`.trim(),
      color: selectedVariant.color,
      size: selectedVariant.size,
      price: product.price,
      image,
      quantity,
    });
    navigate("/cart");
  };

  const ratingDistribution = [
    { stars: 5, count: 856, percentage: 67 },
    { stars: 4, count: 257, percentage: 20 },
    { stars: 3, count: 103, percentage: 8 },
    { stars: 2, count: 39, percentage: 3 },
    { stars: 1, count: 29, percentage: 2 },
  ];

  const handleBack = () => {
    if (onBackToList) return onBackToList();
    navigate("/products");
  };

  const isOutOfStock = selectedVariant?.stock_quantity === 0;
  const isLowStock =
    selectedVariant &&
    selectedVariant.stock_quantity > 0 &&
    selectedVariant.stock_quantity <= 5;

  const randomProducts = useMemo(() => {
    if (!allProducts || allProducts.length < 4 || !resolvedProductId) {
      return allProducts || [];
    }

    const filteredProducts = allProducts.filter(
      (product) => product.id !== resolvedProductId
    );

    const shuffled = [...filteredProducts].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 4);
  }, [allProducts, resolvedProductId]);

  if (!product.id) {
    return <div>{t("product_detail_page.loading.product_detail")}</div>;
  }

  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      <Content style={{ padding: "0 50px" }}>
        <Breadcrumb style={{ margin: "16px 0" }}>
          <Breadcrumb.Item>
            <a onClick={handleBack} style={{ cursor: "pointer" }}>
              {t("product_detail_page.home")}
            </a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <a onClick={handleBack} style={{ cursor: "pointer" }}>
              {t("product_detail_page.products")}
            </a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{product.category_name}</Breadcrumb.Item>
          <Breadcrumb.Item>{product.name}</Breadcrumb.Item>
        </Breadcrumb>

        <Row gutter={[24, 24]}>
          <Col xs={24} md={10}>
            <Card style={{ padding: 16 }}>
              <div
                style={{
                  marginBottom: 16,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  src={getCurrentImages()[selectedImage]}
                  alt={product.name}
                  style={{ width: "100%", height: 400, objectFit: "cover" }}
                />
              </div>
              <Row gutter={[8, 8]}>
                {getCurrentImages().map((image: string, index: number) => (
                  <Col span={6} key={index}>
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      style={{
                        width: "100%",
                        height: 80,
                        objectFit: "cover",
                        cursor: "pointer",
                        border:
                          selectedImage === index
                            ? "2px solid #1890ff"
                            : "1px solid #d9d9d9",
                        borderRadius: 4,
                      }}
                      onClick={() => setSelectedImage(index)}
                    />
                  </Col>
                ))}
              </Row>
            </Card>
          </Col>

          <Col xs={24} md={14}>
            <Card>
              <Space
                direction="vertical"
                size="middle"
                style={{ width: "100%" }}
              >
                <div>
                  <Title level={2} style={{ marginBottom: 8 }}>
                    {product.name}
                    {selectedSize && ` ${selectedSize}`}
                  </Title>
                  <Space>
                    <Text type="secondary">
                      {t("product_detail_page.sold")}{" "}
                      {Math.floor(Math.random() * 100)}
                    </Text>
                  </Space>
                </div>

                <div>
                  <Text strong style={{ marginBottom: 12, display: "block" }}>
                    {t("product_detail_page.color")}: {selectedColor}
                  </Text>
                  <Space wrap>
                    {uniqueColors.map((color) => {
                      const totalStock = product.variants
                        ? product.variants
                            .filter((v) => v.color === color)
                            .reduce((sum, v) => sum + v.stock_quantity, 0)
                        : 0;

                      return (
                        <div key={color} style={{ position: "relative" }}>
                          <Button
                            type={
                              selectedColor === color ? "primary" : "default"
                            }
                            style={{
                              height: 50,
                              minWidth: 120,
                              border:
                                selectedColor === color
                                  ? "2px solid #1890ff"
                                  : "1px solid #d9d9d9",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexDirection: "column",
                              opacity: totalStock === 0 ? 0.5 : 1,
                            }}
                            onClick={() =>
                              totalStock > 0 && setSelectedColor(color)
                            }
                            disabled={totalStock === 0}
                          >
                            <Text strong>{color}</Text>
                          </Button>
                          {totalStock === 0 && (
                            <div
                              style={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                backgroundColor: "rgba(0,0,0,0.5)",
                                color: "white",
                                padding: "2px 6px",
                                borderRadius: 4,
                                fontSize: 10,
                              }}
                            >
                              {t("product_detail_page.out_of_stock")}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </Space>
                </div>

                {selectedColor && (
                  <div>
                    <Text strong style={{ marginBottom: 12, display: "block" }}>
                      {t("product_detail_page.size")}:
                    </Text>
                    <Space wrap>
                      {getSizeOptions().map((size) => {
                        const variant = product.variants.find(
                          (v) => v.color === selectedColor && v.size === size
                        );
                        const isSelected = selectedSize === size;
                        const stockEmpty = variant?.stock_quantity === 0;

                        return (
                          <div key={size} style={{ position: "relative" }}>
                            <Button
                              type={isSelected ? "primary" : "default"}
                              style={{
                                height: 50,
                                minWidth: 120,
                                border: isSelected
                                  ? "2px solid #1890ff"
                                  : "1px solid #d9d9d9",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexDirection: "column",
                                opacity: stockEmpty ? 0.5 : 1,
                              }}
                              onClick={() =>
                                !stockEmpty && setSelectedSize(size)
                              }
                              disabled={stockEmpty}
                            >
                              <Text strong>{size}</Text>
                            </Button>
                            {stockEmpty && (
                              <div
                                style={{
                                  position: "absolute",
                                  top: "50%",
                                  left: "50%",
                                  transform: "translate(-50%, -50%)",
                                  backgroundColor: "rgba(0,0,0,0.5)",
                                  color: "white",
                                  padding: "2px 6px",
                                  borderRadius: 4,
                                  fontSize: 10,
                                }}
                              >
                                {t("product_detail_page.out_of_stock")}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </Space>
                  </div>
                )}

                {selectedVariant && (
                  <div
                    style={{
                      backgroundColor: "#fafafa",
                      padding: 16,
                      borderRadius: 6,
                    }}
                  >
                    <Space align="baseline">
                      <Title level={2} style={{ color: "#ff4d4f", margin: 0 }}>
                        {formatPrice(product.price)}
                      </Title>
                      {product.original_price && (
                        <>
                          <Text
                            delete
                            type="secondary"
                            style={{ fontSize: 16 }}
                          >
                            {formatPrice(product.original_price)}
                          </Text>
                          <Badge
                            count={`-${Math.round(
                              (1 - product.price / product.original_price) * 100
                            )}%`}
                            style={{ backgroundColor: "#ff4d4f" }}
                          />
                        </>
                      )}
                    </Space>
                  </div>
                )}

                {selectedVariant && (
                  <div>
                    {isOutOfStock && (
                      <Alert
                        message={t("product_detail_page.product_out_of_stock")}
                        description={t(
                          "product_detail_page.out_of_stock_message"
                        )}
                        type="error"
                        showIcon
                        icon={<WarningOutlined />}
                      />
                    )}

                    {!isOutOfStock && (
                      <>
                        <div style={{ marginBottom: 16 }}>
                          <Text>
                            {t("product_detail_page.stock_quantity")}:{" "}
                          </Text>
                          <Text
                            strong
                            style={{
                              color: isLowStock ? "#faad14" : "#52c41a",
                            }}
                          >
                            {selectedVariant.stock_quantity}{" "}
                            {t("product_detail_page.product")}
                          </Text>
                          {isLowStock && (
                            <Tag color="orange" style={{ marginLeft: 8 }}>
                              {t("product_detail_page.low_stock")}
                            </Tag>
                          )}
                        </div>

                        <div>
                          <Text style={{ marginRight: 16 }}>
                            {t("product_detail_page.quantity")}:
                          </Text>
                          <Space>
                            <Button
                              icon={<MinusOutlined />}
                              size="small"
                              onClick={() => handleQuantityChange(quantity - 1)}
                              disabled={quantity <= 1}
                            />
                            <InputNumber
                              min={1}
                              max={selectedVariant.stock_quantity}
                              value={quantity}
                              onChange={handleQuantityChange}
                              style={{ width: 80 }}
                            />
                            <Button
                              icon={<PlusOutlined />}
                              size="small"
                              onClick={() => handleQuantityChange(quantity + 1)}
                              disabled={
                                quantity >= selectedVariant.stock_quantity
                              }
                            />
                          </Space>
                        </div>
                      </>
                    )}
                  </div>
                )}

                <Space size="large" style={{ width: "100%" }}>
                  <Button
                    type="primary"
                    size="large"
                    icon={<ShoppingCartOutlined />}
                    onClick={handleAddToCart}
                    style={{ flex: 1, height: 50 }}
                    disabled={isOutOfStock || !selectedVariant}
                  >
                    {t("product_detail_page.add_to_cart")}
                  </Button>
                  <Button
                    type="primary"
                    danger
                    size="large"
                    onClick={handleBuyNow}
                    style={{ flex: 1, height: 50 }}
                    disabled={isOutOfStock || !selectedVariant}
                  >
                    {t("product_detail_page.buy_now")}
                  </Button>
                </Space>

                <Card size="small" style={{ backgroundColor: "#f6ffed" }}>
                  <Space
                    direction="vertical"
                    size="small"
                    style={{ width: "100%" }}
                  >
                    <Space>
                      <TruckOutlined style={{ color: "#52c41a" }} />
                      <Text>{t("product_detail_page.free_shipping")}</Text>
                    </Space>
                    <Space>
                      <ReloadOutlined style={{ color: "#52c41a" }} />
                      <Text>{t("product_detail_page.free_return")}</Text>
                    </Space>
                  </Space>
                </Card>
              </Space>
            </Card>
          </Col>
        </Row>

        <Row style={{ marginTop: 24 }}>
          <Col span={24}>
            <Card>
              <Tabs defaultActiveKey="1">
                <TabPane tab={t("product_detail_page.description")} key="1">
                  <div>
                    <Title level={4}>
                      {t("product_detail_page.introduction")}
                    </Title>
                    <Paragraph>{product.description}</Paragraph>
                  </div>
                </TabPane>

                <TabPane
                  tab={t("product_detail_page.reviews", {
                    count: 2,
                  })}
                  key="3"
                >
                  <Row gutter={[24, 24]}>
                    <Col xs={24} md={8}>
                      <Card>
                        <div style={{ textAlign: "center" }}>
                          <Rate disabled value={2} allowHalf />
                          <div style={{ marginTop: 8 }}>
                            <Text type="secondary">2 đánh giá</Text>
                          </div>
                        </div>

                        <Divider />

                        <div>
                          {ratingDistribution.map((item) => (
                            <div
                              key={item.stars}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                marginBottom: 8,
                              }}
                            >
                              <Text style={{ width: 20 }}>{item.stars}</Text>
                              <StarOutlined
                                style={{ color: "#faad14", marginRight: 8 }}
                              />
                              <Progress
                                percent={item.percentage}
                                showInfo={false}
                                style={{ flex: 1, marginRight: 8 }}
                              />
                              <Text type="secondary" style={{ width: 40 }}>
                                {item.count}
                              </Text>
                            </div>
                          ))}
                        </div>
                      </Card>
                    </Col>

                    <Col xs={24} md={16}>
                      <List
                        dataSource={reviews}
                        renderItem={(review) => (
                          <List.Item>
                            <Card style={{ width: "100%" }}>
                              <List.Item.Meta
                                avatar={
                                  <Avatar
                                    src={`https://ui-avatars.com/api/?name=${review.userName}&background=random`}
                                  />
                                }
                                title={
                                  <Space>
                                    <Text strong>{review.userName}</Text>
                                    {review.verified && (
                                      <Badge
                                        count="Đã mua hàng"
                                        style={{
                                          backgroundColor: "#52c41a",
                                          fontSize: "10px",
                                        }}
                                      />
                                    )}
                                  </Space>
                                }
                                description={
                                  <Space direction="vertical" size="small">
                                    <Space>
                                      <Rate
                                        disabled
                                        value={review.rating}
                                        style={{ fontSize: 14 }}
                                      />
                                      <Text
                                        type="secondary"
                                        style={{ fontSize: 12 }}
                                      >
                                        {review.date}
                                      </Text>
                                    </Space>
                                    <Text>{review.comment}</Text>
                                  </Space>
                                }
                              />
                            </Card>
                          </List.Item>
                        )}
                      />

                      <div style={{ textAlign: "center", marginTop: 16 }}>
                        <Button>Xem thêm đánh giá</Button>
                      </div>
                    </Col>
                  </Row>
                </TabPane>
              </Tabs>
            </Card>
          </Col>
        </Row>

        <Row style={{ marginTop: 24 }}>
          <Col span={24}>
            <Card>
              <Title level={3}>
                {t("product_detail_page.related_products")}
              </Title>
              <Row gutter={[16, 16]}>
                {randomProducts.map((product: Product, index: number) => (
                  <Col key={index} xs={12} sm={8} md={6}>
                    <Card
                      hoverable
                      cover={
                        <img
                          alt={product.name}
                          src={product.image_url[0]}
                          style={{ height: 200, objectFit: "cover" }}
                        />
                      }
                      onClick={() => navigate(`/products/${product.id}`)}
                    >
                      <Card.Meta
                        title={product.name}
                        description={
                          <div>
                            <Text strong style={{ color: "#ff4d4f" }}>
                              {formatPrice(product.price)}
                            </Text>
                          </div>
                        }
                      />
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default ProductDetailPage;
