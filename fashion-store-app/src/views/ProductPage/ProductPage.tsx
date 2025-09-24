import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router";

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
  message,
} from "antd";

import {
  SearchOutlined,
  ShoppingCartOutlined,
  HeartOutlined,
  FilterOutlined,
  AppstoreOutlined,
  BarsOutlined,
  SkinOutlined,
} from "@ant-design/icons";
import { useGlobalContext } from "../../GlobalContext";
import { useTranslation } from "react-i18next";
import { useGetCategoryList } from "@hooks/CategoryHooks";
import { useGetProductList } from "@hooks/ProductHooks";
import type { Category } from "@models/category.interface";
import type { Product } from "@models/product.interface";
import { formatPrice } from "@utils/formatPrice";

const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;
const { Search } = Input;

interface ProductPageProps {
  onProductClick?: (productId: number) => void;
}

const ProductPage: React.FC<ProductPageProps> = ({ onProductClick }) => {
  const navigate = useNavigate();
  const { addToCart, allProducts } = useGlobalContext();
  const { t } = useTranslation();

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [sortBy, setSortBy] = useState("default");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);

  const [categories, setCategories] = useState<Category[]>([]);
  const { data: categoryData } = useGetCategoryList(
    {
      size: 999999999,
    },
    {
      enabled: true,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      onError: (error: any) => {
        console.log(error);
        message.error(t("product_page.error.category_list"));
      },
    }
  );

  useEffect(() => {
    setCategories(categoryData?.data?.content);
  }, [categoryData]);

  const filteredProducts = useMemo(() => {
    let filtered = (allProducts ?? []).filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory.length === 0 ||
        selectedCategory.includes(product.category_id);
      const matchesPrice =
        product.price >= priceRange[0] && product.price <= priceRange[1];

      return matchesSearch && matchesCategory && matchesPrice;
    });

    switch (sortBy) {
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    return filtered;
  }, [allProducts, searchTerm, selectedCategory, priceRange, sortBy]);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredProducts.slice(startIndex, startIndex + pageSize);
  }, [filteredProducts, currentPage, pageSize]);

  const handleProductClick = (productId: number) => {
    if (onProductClick) {
      onProductClick(productId);
      return;
    }
    navigate(`/products/${productId}`);
  };

  const handleAddCart = (e: any, product: any) => {
    e.stopPropagation();
    navigate(`/products/${product.id}`);
  };

  const showOption = [
    { value: 12, label: "12" },
    { value: 24, label: "24" },
    { value: 48, label: "48" },
  ];
  const renderProductCard = (product: Product) => {
    const discount = product.original_price
      ? Math.round(
          ((product.original_price - product.price) / product.original_price) *
            100
        )
      : 0;

    return (
      <Card
        key={product.id}
        hoverable
        onClick={() => handleProductClick(product.id)}
        style={{ cursor: "pointer" }}
        cover={
          <div style={{ position: "relative" }}>
            <img
              alt={product.name}
              src={product.image_url?.[0]}
              style={{ width: "100%", height: 200, objectFit: "cover" }}
            />
            {discount > 0 && (
              <Badge.Ribbon text={`-${discount}%`} color="red" />
            )}
          </div>
        }
        actions={[
          <Button
            key="cart"
            type="primary"
            icon={<SkinOutlined />}
            disabled={!product.stock_quantity}
            onClick={(e) => {
              handleAddCart(e, product);
            }}
          >
            {product.stock_quantity
              ? t("product_page.add_to_cart")
              : t("product_page.out_of_stock")}
          </Button>,
        ]}
      >
        <Card.Meta
          title={
            <div>
              <Text strong ellipsis={{ tooltip: product.name }}>
                {product.name}
              </Text>
            </div>
          }
          description={
            <div>
              <div>
                <Text strong style={{ color: "#ff4d4f", fontSize: 16 }}>
                  {formatPrice(product.price)}
                </Text>
                {product.original_price && (
                  <Text
                    delete
                    type="secondary"
                    style={{ marginLeft: 8, fontSize: 14 }}
                  >
                    {formatPrice(product.original_price)}
                  </Text>
                )}
              </div>
            </div>
          }
        />
      </Card>
    );
  };

  const renderProductList = (product: Product) => {
    const discount = product.original_price
      ? Math.round(
          ((product.original_price - product.price) / product.original_price) *
            100
        )
      : 0;

    return (
      <Card
        key={product.id}
        style={{ marginBottom: 16, cursor: "pointer" }}
        hoverable
        onClick={() => handleProductClick(product.id)}
      >
        <Row gutter={16} align="middle">
          <Col span={6}>
            <div style={{ position: "relative" }}>
              <img
                alt={product.name}
                src={product.image_url?.[0]}
                style={{ width: "100%", height: 150, objectFit: "cover" }}
              />
              {discount && <Badge.Ribbon text={`-${discount}%`} color="red" />}
            </div>
          </Col>
          <Col span={12}>
            <Title level={4} ellipsis={{ rows: 2 }}>
              {product.name}
            </Title>
          </Col>
          <Col span={6} style={{ textAlign: "right" }}>
            <div style={{ marginBottom: 16 }}>
              <Text strong style={{ color: "#ff4d4f", fontSize: 18 }}>
                {formatPrice(product.price)}
              </Text>
              {product.original_price && (
                <div>
                  <Text delete type="secondary">
                    {formatPrice(product.original_price)}
                  </Text>
                </div>
              )}
            </div>
            <Space>
              <Button
                icon={<HeartOutlined />}
                onClick={(e) => e.stopPropagation()}
              />
              <Button
                type="primary"
                icon={<SkinOutlined />}
                disabled={!product.stock_quantity}
                onClick={(e) => {
                  handleAddCart(e, product);
                }}
              >
                {product.stock_quantity
                  ? t("product_page.add_to_cart")
                  : t("product_page.out_of_stock")}
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>
    );
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout>
        <Sider
          width={300}
          style={{ backgroundColor: "#fff", padding: "24px 16px" }}
        >
          <Space direction="vertical" style={{ width: "100%" }} size="large">
            <div>
              <Title level={5}>
                <FilterOutlined /> {t("product_page.filter")}
              </Title>
            </div>

            <div>
              <Text strong>{t("product_page.search_product")}</Text>
              <Input.Search
                placeholder={t("product_page.search_placeholder")}
                allowClear
                enterButton
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ marginTop: 8 }}
              />
            </div>

            <div>
              <Text strong>{t("product_page.category")}</Text>
              <Checkbox.Group
                options={(categories || []).map((category) => ({
                  label: category.name,
                  value: category.id,
                }))}
                value={selectedCategory}
                onChange={setSelectedCategory}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginTop: 8,
                }}
              />
            </div>

            <div>
              <Text strong>{t("product_page.price_range")}</Text>
              <Slider
                range
                min={0}
                max={1000000}
                step={10000}
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

            <Button
              onClick={() => {
                setSelectedCategory([]);
                setPriceRange([0, 1000000]);
                setSearchTerm("");
              }}
            >
              {t("product_page.clear_filter")}
            </Button>
          </Space>
        </Sider>

        <Layout style={{ padding: "0 24px 24px" }}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item>
              <a style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
                {t("product_page.home")}
              </a>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{t("product_page.products")}</Breadcrumb.Item>
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
                {t("product_page.show")} {(currentPage - 1) * pageSize + 1}-
                {Math.min(currentPage * pageSize, filteredProducts.length)}{" "}
                {t("product_page.of")} {filteredProducts.length}{" "}
                {t("product_page.products")}
              </Text>
            </div>

            <Space>
              <Text>{t("product_page.sort_by")}</Text>
              <Select
                value={sortBy}
                onChange={setSortBy}
                style={{ width: 150 }}
              >
                <Option value="default">{t("product_page.default")}</Option>
                <Option value="name">{t("product_page.name_asc")}</Option>
                <Option value="price-asc">{t("product_page.price_asc")}</Option>
                <Option value="price-desc">
                  {t("product_page.price_desc")}
                </Option>
              </Select>

              <Text>{t("product_page.show")}:</Text>
              <Select
                value={pageSize}
                onChange={setPageSize}
                style={{ width: 80 }}
              >
                {showOption.map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>

              <Space.Compact>
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
              </Space.Compact>
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
                <Text type="secondary">
                  {t("product_page.not_found_product")}
                </Text>
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
                  showTotal={(total, range) =>
                    `${range[0]}-${range[1]} ${t(
                      "product_page.of"
                    )} ${total} ${t("product_page.products")}`
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

export default ProductPage;
