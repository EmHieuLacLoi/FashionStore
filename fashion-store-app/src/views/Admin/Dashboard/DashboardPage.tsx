import {
  Layout,
  Menu,
  Button,
  Avatar,
  Dropdown,
  Typography,
  Badge,
  Space,
  Card,
  Row,
  Col,
  Statistic,
  Spin,
} from "antd";
import {
  ShoppingCartOutlined,
  UserOutlined,
  TrophyOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from "@ant-design/icons";
import { Line, Bar } from "@ant-design/charts";
import { useEffect, useState } from "react";
import "./DashboardPage.scss";
import { useGetDashboardData } from "@hooks/DashboardHooks";
import { useTranslation } from "react-i18next";

const { Text, Title } = Typography;

const DashboardPage = () => {
  const [data, setData] = useState<any>(null);
  const { t } = useTranslation();
  const { data: dashboardData, isLoading } = useGetDashboardData({
    enabled: true,
  });

  useEffect(() => {
    if (dashboardData) {
      setData(dashboardData?.data);
    }
  }, [dashboardData]);

  if (isLoading || !data) {
    return (
      <div style={{ padding: 24, textAlign: "center" }}>
        <Spin size="large" />
      </div>
    );
  }

  const cardStyleBase = {
    color: "black",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    height: "100%",
  };

  const revenueCardStyle = {
    ...cardStyleBase,
    background: "linear-gradient(135deg, #d6bbfb 0%, #b19cd9 100%)",
  };
  const ordersCardStyle = {
    ...cardStyleBase,
    background: "linear-gradient(135deg, #a8d8ea 0%, #81c7e2 100%)",
  };
  const customersCardStyle = {
    ...cardStyleBase,
    background: "linear-gradient(135deg, #b2e2d5 0%, #8ad2c0 100%)",
  };
  const productsCardStyle = {
    ...cardStyleBase,
    background: "linear-gradient(135deg, #fde3c8 0%, #f9c6a0 100%)",
  };

  const cleanedRevenueData = data.revenue_last_7_days.map((item: any) => ({
    ...item,
    totalAmount: Number(item.totalAmount) || 0,
  }));

  const revenueConfig = {
    data: cleanedRevenueData,
    xField: "date",
    yField: "totalAmount",
    point: { size: 5, shape: "diamond" },
    smooth: true,
  };

  const topProductsConfig = {
    data: [...data.top_5_products].sort(
      (a, b) => b.quantitySold - a.quantitySold
    ),
    xField: "quantitySold",
    yField: "productName",
    barStyle: { fill: "l(0) 0:#a8d8ea 1:#81c7e2" },
  };

  const formatGrowthRate = (rate: number) => {
    const isPositive = rate >= 0;
    const color = isPositive ? "#3f8600" : "#cf1322";
    const icon = isPositive ? <ArrowUpOutlined /> : <ArrowDownOutlined />;
    return (
      <span style={{ color, fontSize: 14 }}>
        {icon} {Math.abs(rate).toFixed(1)}
        {t("dashboard.growthRate")}
      </span>
    );
  };

  return (
    <div style={{ padding: 24 }}>
      <div
        style={{
          background: "#fff",
          padding: 12,
          borderRadius: 12,
          marginBottom: 12,
        }}
      >
        <Title level={2} style={{ margin: 0 }}>
          {t("dashboard.title")}
        </Title>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} lg={6}>
          <Card style={revenueCardStyle} bordered={false} className="kpi-card">
            <Statistic
              title={
                <span style={{ color: "black" }}>
                  {t("dashboard.total_revenue")}
                </span>
              }
              value={data.kpis.totalRevenue.value.toLocaleString("vi-VN")}
              valueStyle={{ color: "black", fontWeight: "bold", fontSize: 22 }}
              suffix="VNĐ"
            />
            <Text>{formatGrowthRate(data.kpis.totalRevenue.growthRate)}</Text>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card style={ordersCardStyle} bordered={false} className="kpi-card">
            <Statistic
              title={
                <span style={{ color: "black" }}>
                  {t("dashboard.total_orders")}
                </span>
              }
              value={data.kpis.totalOrders.value}
              valueStyle={{ color: "black", fontWeight: "bold", fontSize: 22 }}
              prefix={<ShoppingCartOutlined />}
            />
            <Text>{formatGrowthRate(data.kpis.totalOrders.growthRate)}</Text>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card
            style={customersCardStyle}
            bordered={false}
            className="kpi-card"
          >
            <Statistic
              title={
                <span style={{ color: "black" }}>
                  {t("dashboard.total_customers")}
                </span>
              }
              value={data.kpis.totalCustomers.value}
              valueStyle={{ color: "black", fontWeight: "bold", fontSize: 22 }}
              prefix={<UserOutlined />}
            />
            <Text>{formatGrowthRate(data.kpis.totalCustomers.growthRate)}</Text>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card style={productsCardStyle} bordered={false} className="kpi-card">
            <Statistic
              title={
                <span style={{ color: "black" }}>
                  {t("dashboard.total_products")}
                </span>
              }
              value={data.kpis.totalProducts.value}
              valueStyle={{ color: "black", fontWeight: "bold", fontSize: 22 }}
              prefix={<TrophyOutlined />}
            />
            <Text style={{ color: "#595959" }}>
              {t("dashboard.sum_products")}
            </Text>
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={16}>
          <Card title={t("dashboard.7_days")} style={{ borderRadius: 12 }}>
            <Line {...revenueConfig} height={350} />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card
            title={t("dashboard.top_products")}
            style={{ borderRadius: 12 }}
          >
            <Bar {...topProductsConfig} height={350} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;
