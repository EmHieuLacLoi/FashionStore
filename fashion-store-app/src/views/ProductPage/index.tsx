import React, { useState, useMemo } from "react";
import {
  Layout,
  Card,
  Row,
  Col,
  Pagination,
  Select,
  Input,
  Button,
  Rate,
  Tag,
  Typography,
  Breadcrumb,
  Space,
  Slider,
  Checkbox,
  Divider,
  Badge,
} from "antd";
import {
  SearchOutlined,
  ShoppingCartOutlined,
  HeartOutlined,
  FilterOutlined,
  AppstoreOutlined,
  BarsOutlined,
} from "@ant-design/icons";

const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;
const { Search } = Input;

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  category: string;
  brand: string;
  tags: string[];
  discount?: number;
  inStock: boolean;
}

const EcommerceProductPage: React.FC = () => {
  // Mock data
  const allProducts: Product[] = Array.from({ length: 120 }, (_, i) => ({
    id: i + 1,
    name: `Sản phẩm ${i + 1} - ${
      [
        "iPhone 15",
        "Samsung Galaxy",
        "Laptop Dell",
        "Áo thun",
        "Giày Nike",
        "Tai nghe Sony",
      ][i % 6]
    }`,
    price: Math.floor(Math.random() * 10000000) + 500000,
    originalPrice:
      Math.random() > 0.5
        ? Math.floor(Math.random() * 15000000) + 1000000
        : undefined,
    image: `https://picsum.photos/300/300?random=${i + 1}`,
    rating: Math.floor(Math.random() * 5) + 1,
    reviews: Math.floor(Math.random() * 1000) + 10,
    category: ["Điện thoại", "Laptop", "Thời trang", "Giày dép", "Phụ kiện"][
      i % 5
    ],
    brand: ["Apple", "Samsung", "Dell", "Nike", "Sony", "Adidas"][i % 6],
    tags: ["Bán chạy", "Giảm giá", "Mới", "Hot"].slice(
      0,
      Math.floor(Math.random() * 3) + 1
    ),
    discount:
      Math.random() > 0.6 ? Math.floor(Math.random() * 50) + 5 : undefined,
    inStock: Math.random() > 0.1,
  }));

  // States
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [sortBy, setSortBy] = useState("default");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 20000000]);
  const [minRating, setMinRating] = useState(0);

  // Categories and brands for filters
  const categories = [
    "Điện thoại",
    "Laptop",
    "Thời trang",
    "Giày dép",
    "Phụ kiện",
  ];
  const brands = ["Apple", "Samsung", "Dell", "Nike", "Sony", "Adidas"];

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = allProducts.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory.length === 0 ||
        selectedCategory.includes(product.category);
      const matchesBrand =
        selectedBrand.length === 0 || selectedBrand.includes(product.brand);
      const matchesPrice =
        product.price >= priceRange[0] && product.price <= priceRange[1];
      const matchesRating = product.rating >= minRating;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesBrand &&
        matchesPrice &&
        matchesRating
      );
    });

    // Sort products
    switch (sortBy) {
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    return filtered;
  }, [
    allProducts,
    searchTerm,
    selectedCategory,
    selectedBrand,
    priceRange,
    minRating,
    sortBy,
  ]);

  // Paginated products
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredProducts.slice(startIndex, startIndex + pageSize);
  }, [filteredProducts, currentPage, pageSize]);

  const formatPrice = (price: number) => {
    return price.toLocaleString("vi-VN") + "đ";
  };

  const renderProductCard = (product: Product) => {
    const discount = product.originalPrice
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) *
            100
        )
      : product.discount;

    return (
      <Card
        key={product.id}
        hoverable
        cover={
          <div style={{ position: "relative" }}>
            <img
              alt={product.name}
              src={product.image}
              style={{ width: "100%", height: 200, objectFit: "cover" }}
            />
            {discount && <Badge.Ribbon text={`-${discount}%`} color="red" />}
            <div
              style={{
                position: "absolute",
                top: 8,
                right: 8,
                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}
            >
              <Button
                type="text"
                icon={<HeartOutlined />}
                style={{ backgroundColor: "rgba(255, 255, 255, 0.8)" }}
              />
            </div>
          </div>
        }
        actions={[
          <Button
            key="cart"
            type="primary"
            icon={<ShoppingCartOutlined />}
            disabled={!product.inStock}
          >
            {product.inStock ? "Thêm giỏ hàng" : "Hết hàng"}
          </Button>,
        ]}
        style={{ height: "100%" }}
      >
        <Card.Meta
          title={
            <div>
              <Text strong ellipsis={{ tooltip: product.name }}>
                {product.name}
              </Text>
              <div style={{ marginTop: 4 }}>
                {product.tags.map((tag) => (
                  <Tag key={tag} color="blue">
                    {tag}
                  </Tag>
                ))}
              </div>
            </div>
          }
          description={
            <div>
              <div style={{ marginBottom: 8 }}>
                <Rate
                  disabled
                  defaultValue={product.rating}
                  style={{ fontSize: 14 }}
                />
                <Text type="secondary" style={{ marginLeft: 8, fontSize: 12 }}>
                  ({product.reviews})
                </Text>
              </div>
              <div>
                <Text strong style={{ color: "#ff4d4f", fontSize: 16 }}>
                  {formatPrice(product.price)}
                </Text>
                {product.originalPrice && (
                  <Text
                    delete
                    type="secondary"
                    style={{ marginLeft: 8, fontSize: 14 }}
                  >
                    {formatPrice(product.originalPrice)}
                  </Text>
                )}
              </div>
              <Text type="secondary" style={{ fontSize: 12 }}>
                {product.brand}
              </Text>
            </div>
          }
        />
      </Card>
    );
  };

  const renderProductList = (product: Product) => {
    const discount = product.originalPrice
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) *
            100
        )
      : product.discount;

    return (
      <Card key={product.id} style={{ marginBottom: 16 }}>
        <Row gutter={16} align="middle">
          <Col span={6}>
            <div style={{ position: "relative" }}>
              <img
                alt={product.name}
                src={product.image}
                style={{ width: "100%", height: 150, objectFit: "cover" }}
              />
              {discount && <Badge.Ribbon text={`-${discount}%`} color="red" />}
            </div>
          </Col>
          <Col span={12}>
            <Title level={4} ellipsis={{ rows: 2 }}>
              {product.name}
            </Title>
            <div style={{ marginBottom: 8 }}>
              {product.tags.map((tag) => (
                <Tag key={tag} color="blue">
                  {tag}
                </Tag>
              ))}
            </div>
            <div style={{ marginBottom: 8 }}>
              <Rate disabled defaultValue={product.rating} />
              <Text type="secondary" style={{ marginLeft: 8 }}>
                ({product.reviews} đánh giá)
              </Text>
            </div>
            <Text type="secondary">
              {product.brand} - {product.category}
            </Text>
          </Col>
          <Col span={6} style={{ textAlign: "right" }}>
            <div style={{ marginBottom: 16 }}>
              <Text strong style={{ color: "#ff4d4f", fontSize: 18 }}>
                {formatPrice(product.price)}
              </Text>
              {product.originalPrice && (
                <div>
                  <Text delete type="secondary">
                    {formatPrice(product.originalPrice)}
                  </Text>
                </div>
              )}
            </div>
            <Space>
              <Button icon={<HeartOutlined />} />
              <Button
                type="primary"
                icon={<ShoppingCartOutlined />}
                disabled={!product.inStock}
              >
                {product.inStock ? "Thêm giỏ hàng" : "Hết hàng"}
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>
    );
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          backgroundColor: "#fff",
          padding: "0 24px",
          borderBottom: "1px solid #f0f0f0",
        }}
      >
        <Row align="middle" justify="space-between">
          <Col>
            <Title level={3} style={{ margin: 0, color: "#1890ff" }}>
              ShopVN
            </Title>
          </Col>
          <Col flex="auto" style={{ maxWidth: 600, margin: "0 24px" }}>
            <Search
              placeholder="Tìm kiếm sản phẩm..."
              allowClear
              enterButton={<SearchOutlined />}
              size="large"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Col>
          <Col>
            <Space>
              <Button icon={<HeartOutlined />}>Yêu thích</Button>
              <Badge count={5}>
                <Button icon={<ShoppingCartOutlined />}>Giỏ hàng</Button>
              </Badge>
            </Space>
          </Col>
        </Row>
      </Header>

      <Layout>
        <Sider
          width={300}
          style={{ backgroundColor: "#fff", padding: "24px 16px" }}
        >
          <Space direction="vertical" style={{ width: "100%" }} size="large">
            <div>
              <Title level={5}>
                <FilterOutlined /> Bộ lọc
              </Title>
            </div>

            <div>
              <Text strong>Danh mục</Text>
              <Checkbox.Group
                options={categories}
                value={selectedCategory}
                onChange={setSelectedCategory}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginTop: 8,
                }}
              />
            </div>

            <Divider />

            <div>
              <Text strong>Thương hiệu</Text>
              <Checkbox.Group
                options={brands}
                value={selectedBrand}
                onChange={setSelectedBrand}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginTop: 8,
                }}
              />
            </div>

            <Divider />

            <div>
              <Text strong>Khoảng giá</Text>
              <Slider
                range
                min={0}
                max={20000000}
                step={100000}
                value={priceRange}
                onChange={(value) => setPriceRange(value as [number, number])}
                tooltip={{
                  formatter: (value) => formatPrice(value || 0),
                }}
                style={{ marginTop: 16 }}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: 8,
                }}
              >
                <Text type="secondary">{formatPrice(priceRange[0])}</Text>
                <Text type="secondary">{formatPrice(priceRange[1])}</Text>
              </div>
            </div>

            <Divider />

            <div>
              <Text strong>Đánh giá tối thiểu</Text>
              <div style={{ marginTop: 8 }}>
                <Rate value={minRating} onChange={setMinRating} allowClear />
              </div>
            </div>

            <Button
              onClick={() => {
                setSelectedCategory([]);
                setSelectedBrand([]);
                setPriceRange([0, 20000000]);
                setMinRating(0);
                setSearchTerm("");
              }}
            >
              Xóa bộ lọc
            </Button>
          </Space>
        </Sider>

        <Layout style={{ padding: "0 24px 24px" }}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item>Trang chủ</Breadcrumb.Item>
            <Breadcrumb.Item>Sản phẩm</Breadcrumb.Item>
          </Breadcrumb>

          <div
            style={{
              marginBottom: 24,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <Text>
                Hiển thị {(currentPage - 1) * pageSize + 1}-
                {Math.min(currentPage * pageSize, filteredProducts.length)} của{" "}
                {filteredProducts.length} sản phẩm
              </Text>
            </div>

            <Space>
              <Text>Sắp xếp theo:</Text>
              <Select
                value={sortBy}
                onChange={setSortBy}
                style={{ width: 150 }}
              >
                <Option value="default">Mặc định</Option>
                <Option value="name">Tên A-Z</Option>
                <Option value="price-asc">Giá thấp đến cao</Option>
                <Option value="price-desc">Giá cao đến thấp</Option>
                <Option value="rating">Đánh giá cao nhất</Option>
              </Select>

              <Text>Hiển thị:</Text>
              <Select
                value={pageSize}
                onChange={setPageSize}
                style={{ width: 80 }}
              >
                <Option value={12}>12</Option>
                <Option value={24}>24</Option>
                <Option value={48}>48</Option>
              </Select>

              <Button.Group>
                <Button
                  type={viewMode === "grid" ? "primary" : "default"}
                  icon={<AppstoreOutlined />}
                  onClick={() => setViewMode("grid")}
                />
                <Button
                  type={viewMode === "list" ? "primary" : "default"}
                  icon={<BarsOutlined />}
                  onClick={() => setViewMode("list")}
                />
              </Button.Group>
            </Space>
          </div>

          <Content>
            {viewMode === "grid" ? (
              <Row gutter={[16, 16]}>
                {paginatedProducts.map((product) => (
                  <Col key={product.id} xs={24} sm={12} md={8} lg={6} xl={6}>
                    {renderProductCard(product)}
                  </Col>
                ))}
              </Row>
            ) : (
              <div>
                {paginatedProducts.map((product) => renderProductList(product))}
              </div>
            )}

            {paginatedProducts.length === 0 && (
              <div style={{ textAlign: "center", padding: "50px 0" }}>
                <Text type="secondary">Không tìm thấy sản phẩm nào</Text>
              </div>
            )}

            {filteredProducts.length > 0 && (
              <div style={{ textAlign: "center", marginTop: 32 }}>
                <Pagination
                  current={currentPage}
                  total={filteredProducts.length}
                  pageSize={pageSize}
                  onChange={setCurrentPage}
                  showSizeChanger={false}
                  showQuickJumper
                  showTotal={(total, range) =>
                    `${range[0]}-${range[1]} của ${total} sản phẩm`
                  }
                />
              </div>
            )}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default EcommerceProductPage;
