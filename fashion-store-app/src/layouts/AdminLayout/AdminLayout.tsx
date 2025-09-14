import React, { useState } from "react";
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
  Progress,
} from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ShoppingOutlined,
  AppstoreOutlined,
  ShoppingCartOutlined,
  CreditCardOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  BellOutlined,
  DashboardOutlined,
  TrophyOutlined,
  RiseOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router";
import "./AdminLayout.scss";
import { useTranslation } from "react-i18next";
import { removeToken } from "@utils/auth";
import ProtectedRoute from "@routes/guards/ProtectedRoute";

const { Header, Sider, Content } = Layout;
const { Text, Title } = Typography;

const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  // Simulate some data for the dashboard
  const stats = {
    revenue: 125000,
    orders: 1250,
    customers: 850,
    products: 425,
  };

  // Menu items configuration
  const menuItems = [
    {
      key: "/admin/dashboard",
      icon: <DashboardOutlined />,
      label: t("admin.menu.dashboard") || "Dashboard",
      description: "Overview & Analytics",
    },
    {
      key: "/admin/products",
      icon: <ShoppingOutlined />,
      label: t("admin.menu.products") || "Products",
      description: "Manage inventory",
    },
    {
      key: "/admin/categories",
      icon: <AppstoreOutlined />,
      label: t("admin.menu.categories") || "Categories",
      description: "Product categories",
    },
    {
      key: "/admin/orders",
      icon: <ShoppingCartOutlined />,
      label: t("admin.menu.orders") || "Orders",
      badge: { count: 12, color: "#ff4d4f" },
      description: "Customer orders",
    },
    {
      key: "/admin/payments",
      icon: <CreditCardOutlined />,
      label: t("admin.menu.payments") || "Payments",
      description: "Transaction history",
    },
  ];

  // User dropdown menu items
  const userMenuItems = [
    {
      key: "profile",
      label: t("common.auth.profile") || "Profile",
      icon: <UserOutlined />,
      onClick: () => navigate("/admin/profile"),
    },
    {
      key: "settings",
      label: t("admin.settings") || "Settings",
      icon: <SettingOutlined />,
      onClick: () => navigate("/admin/settings"),
    },
    {
      type: "divider" as const,
    },
    {
      key: "logout",
      label: t("common.auth.logout") || "Logout",
      icon: <LogoutOutlined />,
      danger: true,
      onClick: handleLogout,
    },
  ];

  // Handle logout
  function handleLogout() {
    removeToken();
    navigate("/login");
  }

  // Get current selected menu key
  const getSelectedKey = () => {
    const currentPath = location.pathname;
    return (
      menuItems.find((item) => currentPath.startsWith(item.key))?.key ||
      menuItems[0].key
    );
  };

  // Handle menu click
  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  // Breadcrumb removed

  // Render enhanced menu items
  const renderMenuItems = () => {
    return menuItems.map((item) => ({
      key: item.key,
      icon: React.cloneElement(item.icon, {
        className: "menu-icon",
      }),
      label: (
        <div className="menu-item-content">
          <div className="menu-item-main">
            <span className="menu-label">{item.label}</span>
            {item.badge && (
              <Badge
                count={item.badge.count}
                size="small"
                className="menu-badge"
                style={{
                  backgroundColor: item.badge.color,
                }}
              />
            )}
          </div>
          {!collapsed && (
            <div className="menu-item-description">{item.description}</div>
          )}
        </div>
      ),
    }));
  };

  // Dashboard content
  const renderDashboardContent = () => (
    <div className="dashboard-content">
      <div className="welcome-banner">
        <div className="banner-content">
          <Title level={2} className="welcome-title">
            Welcome back, Admin! 👋
          </Title>
          <Text className="welcome-subtitle">
            Here's what's happening with your business today.
          </Text>
        </div>
        <div className="banner-decoration" />
      </div>

      <Row gutter={[24, 24]} className="stats-row">
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card stat-card-revenue">
            <Statistic
              title={<span className="stat-title">Total Revenue</span>}
              value={stats.revenue}
              precision={0}
              valueStyle={{ color: "white", fontWeight: "bold" }}
              prefix="$"
              suffix={<RiseOutlined className="stat-suffix" />}
            />
            <Progress
              percent={85}
              showInfo={false}
              strokeColor="rgba(255,255,255,0.8)"
              trailColor="rgba(255,255,255,0.2)"
              className="stat-progress"
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card stat-card-orders">
            <Statistic
              title={<span className="stat-title">Orders</span>}
              value={stats.orders}
              valueStyle={{ color: "white", fontWeight: "bold" }}
              suffix={<ShoppingCartOutlined className="stat-icon" />}
            />
            <Text className="stat-description">+12% from last month</Text>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card stat-card-customers">
            <Statistic
              title={<span className="stat-title">Customers</span>}
              value={stats.customers}
              valueStyle={{ color: "white", fontWeight: "bold" }}
              suffix={<UserOutlined className="stat-icon" />}
            />
            <Text className="stat-description">+8% growth rate</Text>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card stat-card-products">
            <Statistic
              title={<span className="stat-title">Products</span>}
              value={stats.products}
              valueStyle={{ color: "white", fontWeight: "bold" }}
              suffix={<TrophyOutlined className="stat-icon" />}
            />
            <Text className="stat-description">5 new this week</Text>
          </Card>
        </Col>
      </Row>

      <Card
        className="quick-actions-card"
        title="Quick Actions"
        extra={
          <Button type="primary" className="view-all-btn">
            View All
          </Button>
        }
      >
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Button size="large" className="quick-action-btn quick-action-add">
              Add Product
            </Button>
          </Col>
          <Col span={8}>
            <Button
              size="large"
              className="quick-action-btn quick-action-orders"
            >
              View Orders
            </Button>
          </Col>
          <Col span={8}>
            <Button
              size="large"
              className="quick-action-btn quick-action-analytics"
            >
              Analytics
            </Button>
          </Col>
        </Row>
      </Card>
    </div>
  );

  return (
    <Layout className="modern-admin-layout">
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        className="modern-admin-sider"
        width={280}
        collapsedWidth={80}
      >
        {/* Decorative background elements */}
        <div className="sider-decoration-1" />
        <div className="sider-decoration-2" />

        <div className="admin-logo">
          {!collapsed ? (
            <div className="logo-expanded">
              <Title level={3} className="logo-title">
                ⚡ AdminPro
              </Title>
              <Text className="logo-subtitle">Management System</Text>
            </div>
          ) : (
            <Text className="logo-collapsed">⚡</Text>
          )}
        </div>

        <Menu
          mode="inline"
          selectedKeys={[getSelectedKey()]}
          items={renderMenuItems()}
          onClick={handleMenuClick}
          className="modern-admin-menu"
        />

        {/* User info at bottom with dropdown */}
        {!collapsed && (
          <Dropdown
            menu={{ items: userMenuItems }}
            trigger={["hover", "click"]}
            placement="top"
          >
            <div className="user-info-panel" style={{ cursor: "pointer" }}>
              <div className="user-info-content">
                <Avatar
                  size={40}
                  icon={<UserOutlined />}
                  className="user-avatar"
                />
                <div className="user-details">
                  <Text strong className="user-name">
                    Admin User
                  </Text>
                  <Text className="user-role">System Administrator</Text>
                </div>
              </div>
            </div>
          </Dropdown>
        )}
      </Sider>

      <Layout className="modern-admin-main">
        <Header className="modern-admin-header">
          <div className="header-left">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              className="collapse-button"
            />
          </div>

          <div className="header-right">
            <Space size="middle">
              <Badge count={3} size="small">
                <Button
                  type="text"
                  icon={<BellOutlined />}
                  className="notification-button"
                />
              </Badge>
            </Space>
          </div>
        </Header>

        <Content className="modern-admin-content">
          <div className="content-wrapper">
            <div className="content-decoration-1" />

            <div className="content-inner">
              {location.pathname === "/admin/dashboard" ? (
                renderDashboardContent()
              ) : (
                <ProtectedRoute />
              )}
            </div>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
