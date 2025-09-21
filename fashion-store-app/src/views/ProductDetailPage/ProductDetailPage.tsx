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

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

interface ProductVariant {
  id: string;
  color: string;
  colorCode: string;
  storage?: string;
  stockQuantity: number;
  price: number;
  originalPrice?: number;
  sku: string;
}

interface Product {
  id: number;
  name: string;
  basePrice: number;
  images: { [key: string]: string[] }; // images by color
  rating: number;
  totalReviews: number;
  category: string;
  brand: string;
  tags: string[];
  discount?: number;
  description: string;
  specifications: { [key: string]: string };
  features: string[];
  warranty: string;
  variants: ProductVariant[];
  seller: {
    name: string;
    rating: number;
    totalSales: number;
  };
}

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
  const { addToCart } = useGlobalContext();
  const resolvedProductId = (productId ?? Number(params.id)) || 1;
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedStorage, setSelectedStorage] = useState<string>("");
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null
  );

  // Mock product data với variants (memoized to avoid re-creation on each render)
  const product: Product = useMemo(
    (): Product => ({
      id: resolvedProductId,
      name: `iPhone 15 Pro Max - Chính hãng VN/A`,
      basePrice: 29990000,
      images: {
        "Titan Tự Nhiên": [
          `https://picsum.photos/600/600?random=${resolvedProductId}`,
          `https://picsum.photos/600/600?random=${resolvedProductId + 1}`,
          `https://picsum.photos/600/600?random=${resolvedProductId + 2}`,
        ],
        "Titan Xanh": [
          `https://picsum.photos/600/600?random=${resolvedProductId + 10}`,
          `https://picsum.photos/600/600?random=${resolvedProductId + 11}`,
          `https://picsum.photos/600/600?random=${resolvedProductId + 12}`,
        ],
        "Titan Trắng": [
          `https://picsum.photos/600/600?random=${resolvedProductId + 20}`,
          `https://picsum.photos/600/600?random=${resolvedProductId + 21}`,
          `https://picsum.photos/600/600?random=${resolvedProductId + 22}`,
        ],
        "Titan Đen": [
          `https://picsum.photos/600/600?random=${resolvedProductId + 30}`,
          `https://picsum.photos/600/600?random=${resolvedProductId + 31}`,
          `https://picsum.photos/600/600?random=${resolvedProductId + 32}`,
        ],
      },
      rating: 4.5,
      totalReviews: 1284,
      category: "Điện thoại",
      brand: "Apple",
      tags: ["Chính hãng", "Bảo hành 12 tháng", "Freeship"],
      discount: 9,
      description: `iPhone 15 Pro Max là chiếc điện thoại cao cấp nhất trong dòng iPhone 15 series với nhiều tính năng đột phá. 
    Máy sở hữu chip A17 Pro mạnh mẽ, camera chuyên nghiệp với zoom quang học 5x, và thiết kế titanium cao cấp.`,
      specifications: {
        "Màn hình": "6.7 inch, Super Retina XDR OLED",
        Chip: "Apple A17 Pro 6-core",
        RAM: "8GB",
        "Camera sau": "48MP chính + 12MP telephoto + 12MP ultrawide",
        "Camera trước": "12MP TrueDepth",
        Pin: "4441 mAh",
        "Hệ điều hành": "iOS 17",
        "Kết nối": "5G, Wi-Fi 6E, Bluetooth 5.3",
        "Chất liệu": "Khung titanium, mặt lưng kính",
      },
      features: [
        "Chip A17 Pro với GPU 6-core mạnh mẽ",
        "Camera telephoto với zoom quang học 5x",
        "Thiết kế khung titanium siêu nhẹ",
        "Màn hình Always-On Display",
        "Sạc nhanh 27W, sạc không dây MagSafe 15W",
        "Kháng nước IP68",
      ],
      warranty: "12 tháng chính hãng Apple Việt Nam",
      variants: [
        // Titan Tự Nhiên
        {
          id: "natural-256",
          color: "Titan Tự Nhiên",
          colorCode: "#F5F5DC",
          storage: "256GB",
          stockQuantity: 15,
          price: 29990000,
          originalPrice: 32990000,
          sku: "IP15PM-NAT-256",
        },
        {
          id: "natural-512",
          color: "Titan Tự Nhiên",
          colorCode: "#F5F5DC",
          storage: "512GB",
          stockQuantity: 8,
          price: 34990000,
          originalPrice: 37990000,
          sku: "IP15PM-NAT-512",
        },
        {
          id: "natural-1tb",
          color: "Titan Tự Nhiên",
          colorCode: "#F5F5DC",
          storage: "1TB",
          stockQuantity: 3,
          price: 39990000,
          originalPrice: 42990000,
          sku: "IP15PM-NAT-1TB",
        },
        // Titan Xanh
        {
          id: "blue-256",
          color: "Titan Xanh",
          colorCode: "#4682B4",
          storage: "256GB",
          stockQuantity: 12,
          price: 29990000,
          originalPrice: 32990000,
          sku: "IP15PM-BLU-256",
        },
        {
          id: "blue-512",
          color: "Titan Xanh",
          colorCode: "#4682B4",
          storage: "512GB",
          stockQuantity: 0,
          price: 34990000,
          originalPrice: 37990000,
          sku: "IP15PM-BLU-512",
        },
        {
          id: "blue-1tb",
          color: "Titan Xanh",
          colorCode: "#4682B4",
          storage: "1TB",
          stockQuantity: 5,
          price: 39990000,
          originalPrice: 42990000,
          sku: "IP15PM-BLU-1TB",
        },
        // Titan Trắng
        {
          id: "white-256",
          color: "Titan Trắng",
          colorCode: "#FFFFFF",
          storage: "256GB",
          stockQuantity: 20,
          price: 29990000,
          originalPrice: 32990000,
          sku: "IP15PM-WHT-256",
        },
        {
          id: "white-512",
          color: "Titan Trắng",
          colorCode: "#FFFFFF",
          storage: "512GB",
          stockQuantity: 7,
          price: 34990000,
          originalPrice: 37990000,
          sku: "IP15PM-WHT-512",
        },
        {
          id: "white-1tb",
          color: "Titan Trắng",
          colorCode: "#FFFFFF",
          storage: "1TB",
          stockQuantity: 2,
          price: 39990000,
          originalPrice: 42990000,
          sku: "IP15PM-WHT-1TB",
        },
        // Titan Đen
        {
          id: "black-256",
          color: "Titan Đen",
          colorCode: "#2F2F2F",
          storage: "256GB",
          stockQuantity: 25,
          price: 29990000,
          originalPrice: 32990000,
          sku: "IP15PM-BLK-256",
        },
        {
          id: "black-512",
          color: "Titan Đen",
          colorCode: "#2F2F2F",
          storage: "512GB",
          stockQuantity: 6,
          price: 34990000,
          originalPrice: 37990000,
          sku: "IP15PM-BLK-512",
        },
        {
          id: "black-1tb",
          color: "Titan Đen",
          colorCode: "#2F2F2F",
          storage: "1TB",
          stockQuantity: 4,
          price: 39990000,
          originalPrice: 42990000,
          sku: "IP15PM-BLK-1TB",
        },
      ],
      seller: {
        name: "FPT Shop Official",
        rating: 4.8,
        totalSales: 15420,
      },
    }),
    [resolvedProductId]
  );

  // Mock reviews data
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

  // Get unique colors and storages
  const uniqueColors = useMemo(
    () => Array.from(new Set(product.variants.map((v) => v.color))),
    [product]
  );
  const getStorageOptions = (): string[] => {
    if (!selectedColor) return [];
    return Array.from(
      new Set(
        product.variants
          .filter((v) => v.color === selectedColor && v.storage != null)
          .map((v) => v.storage as string)
      )
    );
  };

  // Find current variant
  useEffect(() => {
    if (selectedColor && selectedStorage) {
      const variant = product.variants.find(
        (v) => v.color === selectedColor && v.storage === selectedStorage
      );
      setSelectedVariant(variant || null);
      setQuantity(1); // Reset quantity when variant changes
      setSelectedImage(0); // Reset image selection
    } else {
      setSelectedVariant(null);
    }
  }, [selectedColor, selectedStorage]);

  // Initialize with first available variant
  useEffect(() => {
    if (!selectedColor && uniqueColors.length > 0) {
      setSelectedColor(uniqueColors[0]);
    }
  }, [uniqueColors, selectedColor]);

  useEffect(() => {
    const storageOptions = getStorageOptions();
    if (selectedColor && !selectedStorage && storageOptions.length > 0) {
      setSelectedStorage(storageOptions[0]);
    } else if (
      selectedColor &&
      selectedStorage &&
      !storageOptions.includes(selectedStorage)
    ) {
      setSelectedStorage(storageOptions[0] || "");
    }
  }, [selectedColor, selectedStorage]);

  const getCurrentImages = () => {
    if (selectedColor && product.images[selectedColor]) {
      return product.images[selectedColor];
    }
    return product.images[uniqueColors[0]] || [];
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString("vi-VN") + "đ";
  };

  const handleQuantityChange = (value: number | null) => {
    if (
      value &&
      value > 0 &&
      selectedVariant &&
      value <= selectedVariant.stockQuantity
    ) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    if (!selectedVariant) {
      alert("Vui lòng chọn màu và dung lượng");
      return;
    }
    const key = `${resolvedProductId}-${selectedVariant.sku}`;
    const image = getCurrentImages()[0];
    addToCart({
      key,
      productId: resolvedProductId,
      name: `${product.name} ${
        selectedStorage ? `- ${selectedStorage}` : ""
      }`.trim(),
      sku: selectedVariant.sku,
      color: selectedVariant.color,
      storage: selectedVariant.storage,
      price: selectedVariant.price,
      image,
      quantity,
    });
    message.success("Đã thêm vào giỏ hàng");
  };

  const handleBuyNow = () => {
    if (!selectedVariant) {
      alert("Vui lòng chọn màu và dung lượng");
      return;
    }
    const key = `${resolvedProductId}-${selectedVariant.sku}`;
    const image = getCurrentImages()[0];
    addToCart({
      key,
      productId: resolvedProductId,
      name: `${product.name} ${
        selectedStorage ? `- ${selectedStorage}` : ""
      }`.trim(),
      sku: selectedVariant.sku,
      color: selectedVariant.color,
      storage: selectedVariant.storage,
      price: selectedVariant.price,
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

  const isOutOfStock = selectedVariant?.stockQuantity === 0;
  const isLowStock =
    selectedVariant &&
    selectedVariant.stockQuantity > 0 &&
    selectedVariant.stockQuantity <= 5;

  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      <Content style={{ padding: "0 50px" }}>
        <Breadcrumb style={{ margin: "16px 0" }}>
          <Breadcrumb.Item>
            <a onClick={handleBack} style={{ cursor: "pointer" }}>
              Trang chủ
            </a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <a onClick={handleBack} style={{ cursor: "pointer" }}>
              Sản phẩm
            </a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{product.category}</Breadcrumb.Item>
          <Breadcrumb.Item>{product.name}</Breadcrumb.Item>
        </Breadcrumb>

        <Row gutter={[24, 24]}>
          {/* Product Images */}
          <Col xs={24} md={10}>
            <Card style={{ padding: 16 }}>
              <div style={{ marginBottom: 16 }}>
                <Image
                  src={getCurrentImages()[selectedImage]}
                  alt={product.name}
                  style={{ width: "100%", height: 400, objectFit: "cover" }}
                />
              </div>
              <Row gutter={[8, 8]}>
                {getCurrentImages().map((image, index) => (
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

          {/* Product Info */}
          <Col xs={24} md={14}>
            <Card>
              <Space
                direction="vertical"
                size="middle"
                style={{ width: "100%" }}
              >
                {/* Title and Rating */}
                <div>
                  <Title level={2} style={{ marginBottom: 8 }}>
                    {product.name}
                    {selectedStorage && ` ${selectedStorage}`}
                  </Title>
                  <Space>
                    <Rate disabled value={product.rating} allowHalf />
                    <Text>({product.totalReviews} đánh giá)</Text>
                    <Divider type="vertical" />
                    <Text type="secondary">Đã bán 2.5k</Text>
                  </Space>
                  <div style={{ marginTop: 8 }}>
                    {product.tags.map((tag) => (
                      <Tag key={tag} color="blue">
                        {tag}
                      </Tag>
                    ))}
                  </div>
                </div>

                <Divider />

                {/* Color Selection */}
                <div>
                  <Text strong style={{ marginBottom: 12, display: "block" }}>
                    Màu sắc: {selectedColor}
                  </Text>
                  <Space wrap>
                    {uniqueColors.map((color) => {
                      const colorVariant = product.variants.find(
                        (v) => v.color === color
                      );
                      const totalStock = product.variants
                        .filter((v) => v.color === color)
                        .reduce((sum, v) => sum + v.stockQuantity, 0);

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
                              Hết hàng
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </Space>
                </div>

                {/* Storage Selection */}
                {selectedColor && (
                  <div>
                    <Text strong style={{ marginBottom: 12, display: "block" }}>
                      Dung lượng:
                    </Text>
                    <Space wrap>
                      {getStorageOptions().map((storage) => {
                        const variant = product.variants.find(
                          (v) =>
                            v.color === selectedColor && v.storage === storage
                        );
                        const isSelected = selectedStorage === storage;
                        const stockEmpty = variant?.stockQuantity === 0;

                        return (
                          <div key={storage} style={{ position: "relative" }}>
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
                                !stockEmpty && setSelectedStorage(storage)
                              }
                              disabled={stockEmpty}
                            >
                              <Text strong>{storage}</Text>
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
                                Hết hàng
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </Space>
                  </div>
                )}

                <Divider />

                {/* Price */}
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
                        {formatPrice(selectedVariant.price)}
                      </Title>
                      {selectedVariant.originalPrice && (
                        <>
                          <Text
                            delete
                            type="secondary"
                            style={{ fontSize: 16 }}
                          >
                            {formatPrice(selectedVariant.originalPrice)}
                          </Text>
                          <Badge
                            count={`-${Math.round(
                              (1 -
                                selectedVariant.price /
                                  selectedVariant.originalPrice) *
                                100
                            )}%`}
                            style={{ backgroundColor: "#ff4d4f" }}
                          />
                        </>
                      )}
                    </Space>
                    <div style={{ marginTop: 8 }}>
                      <Text type="secondary">SKU: {selectedVariant.sku}</Text>
                    </div>
                  </div>
                )}

                {/* Stock Status */}
                {selectedVariant && (
                  <div>
                    {isOutOfStock && (
                      <Alert
                        message="Sản phẩm tạm hết hàng"
                        description="Sản phẩm này hiện đã hết hàng. Vui lòng chọn màu/dung lượng khác hoặc liên hệ để được tư vấn."
                        type="error"
                        showIcon
                        icon={<WarningOutlined />}
                      />
                    )}

                    {!isOutOfStock && (
                      <>
                        <div style={{ marginBottom: 16 }}>
                          <Text>Số lượng còn lại: </Text>
                          <Text
                            strong
                            style={{
                              color: isLowStock ? "#faad14" : "#52c41a",
                            }}
                          >
                            {selectedVariant.stockQuantity} sản phẩm
                          </Text>
                          {isLowStock && (
                            <Tag color="orange" style={{ marginLeft: 8 }}>
                              Sắp hết hàng
                            </Tag>
                          )}
                        </div>

                        <div>
                          <Text style={{ marginRight: 16 }}>Số lượng:</Text>
                          <Space>
                            <Button
                              icon={<MinusOutlined />}
                              size="small"
                              onClick={() => handleQuantityChange(quantity - 1)}
                              disabled={quantity <= 1}
                            />
                            <InputNumber
                              min={1}
                              max={selectedVariant.stockQuantity}
                              value={quantity}
                              onChange={handleQuantityChange}
                              style={{ width: 80 }}
                            />
                            <Button
                              icon={<PlusOutlined />}
                              size="small"
                              onClick={() => handleQuantityChange(quantity + 1)}
                              disabled={
                                quantity >= selectedVariant.stockQuantity
                              }
                            />
                          </Space>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <Space size="large" style={{ width: "100%" }}>
                  <Button
                    type="primary"
                    size="large"
                    icon={<ShoppingCartOutlined />}
                    onClick={handleAddToCart}
                    style={{ flex: 1, height: 50 }}
                    disabled={isOutOfStock || !selectedVariant}
                  >
                    Thêm vào giỏ hàng
                  </Button>
                  <Button
                    type="primary"
                    danger
                    size="large"
                    onClick={handleBuyNow}
                    style={{ flex: 1, height: 50 }}
                    disabled={isOutOfStock || !selectedVariant}
                  >
                    Mua ngay
                  </Button>
                  <Button
                    size="large"
                    icon={<HeartOutlined />}
                    style={{ height: 50 }}
                  />
                  <Button
                    size="large"
                    icon={<ShareAltOutlined />}
                    style={{ height: 50 }}
                  />
                </Space>

                {/* Shipping and Warranty Info */}
                <Card size="small" style={{ backgroundColor: "#f6ffed" }}>
                  <Space
                    direction="vertical"
                    size="small"
                    style={{ width: "100%" }}
                  >
                    <Space>
                      <TruckOutlined style={{ color: "#52c41a" }} />
                      <Text>Miễn phí vận chuyển cho đơn hàng từ 500.000đ</Text>
                    </Space>
                    <Space>
                      <SafetyOutlined style={{ color: "#52c41a" }} />
                      <Text>{product.warranty}</Text>
                    </Space>
                    <Space>
                      <ReloadOutlined style={{ color: "#52c41a" }} />
                      <Text>Đổi trả miễn phí trong 7 ngày</Text>
                    </Space>
                  </Space>
                </Card>
              </Space>
            </Card>
          </Col>
        </Row>

        {/* Product Details Tabs */}
        <Row style={{ marginTop: 24 }}>
          <Col span={24}>
            <Card>
              <Tabs defaultActiveKey="1">
                <TabPane tab="Mô tả sản phẩm" key="1">
                  <div>
                    <Title level={4}>Giới thiệu về {product.name}</Title>
                    <Paragraph>{product.description}</Paragraph>

                    <Title level={4}>Tính năng nổi bật</Title>
                    <List
                      dataSource={product.features}
                      renderItem={(feature) => (
                        <List.Item>
                          <Space>
                            <CheckCircleOutlined style={{ color: "#52c41a" }} />
                            <Text>{feature}</Text>
                          </Space>
                        </List.Item>
                      )}
                    />
                  </div>
                </TabPane>

                <TabPane tab="Thông số kỹ thuật" key="2">
                  <Row gutter={[16, 16]}>
                    {Object.entries(product.specifications).map(
                      ([key, value]) => (
                        <Col span={12} key={key}>
                          <Card size="small">
                            <Row>
                              <Col span={8}>
                                <Text strong>{key}:</Text>
                              </Col>
                              <Col span={16}>
                                <Text>{value}</Text>
                              </Col>
                            </Row>
                          </Card>
                        </Col>
                      )
                    )}
                  </Row>
                </TabPane>

                <TabPane tab={`Đánh giá (${product.totalReviews})`} key="3">
                  <Row gutter={[24, 24]}>
                    <Col xs={24} md={8}>
                      <Card>
                        <div style={{ textAlign: "center" }}>
                          <Title
                            level={2}
                            style={{ color: "#faad14", marginBottom: 8 }}
                          >
                            {product.rating}/5
                          </Title>
                          <Rate disabled value={product.rating} allowHalf />
                          <div style={{ marginTop: 8 }}>
                            <Text type="secondary">
                              {product.totalReviews} đánh giá
                            </Text>
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

        {/* Related Products */}
        <Row style={{ marginTop: 24 }}>
          <Col span={24}>
            <Card>
              <Title level={3}>Sản phẩm liên quan</Title>
              <Row gutter={[16, 16]}>
                {Array.from({ length: 4 }, (_, i) => (
                  <Col key={i} xs={12} sm={8} md={6}>
                    <Card
                      hoverable
                      cover={
                        <img
                          alt={`Related product ${i + 1}`}
                          src={`https://picsum.photos/200/200?random=${
                            resolvedProductId + i + 10
                          }`}
                          style={{ height: 200, objectFit: "cover" }}
                        />
                      }
                    >
                      <Card.Meta
                        title={`Sản phẩm liên quan ${i + 1}`}
                        description={
                          <div>
                            <Text strong style={{ color: "#ff4d4f" }}>
                              {formatPrice(
                                Math.floor(Math.random() * 5000000) + 1000000
                              )}
                            </Text>
                            <div style={{ marginTop: 4 }}>
                              <Rate
                                disabled
                                value={4 + Math.random()}
                                style={{ fontSize: 12 }}
                              />
                            </div>
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
