import React, { Suspense, useState } from "react";
import { Layout, Menu, Button, Avatar, Dropdown, Typography } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ShoppingOutlined,
  AppstoreOutlined,
  ShoppingCartOutlined,
  CreditCardOutlined,
  UserOutlined,
  LogoutOutlined,
  DesktopOutlined,
  TranslationOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation, Outlet } from "react-router";
import "./AdminLayout.scss";
import { useTranslation } from "react-i18next";
import { removeToken } from "@utils/auth";
import LoadingSpinner from "@components/LoadingSpinner";
import { useGlobalContext } from "../../GlobalContext";

const { Sider, Content } = Layout;
const { Text, Title } = Typography;

const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const { lang, setLang, currentUser } = useGlobalContext();

  const menuItems = [
    {
      key: "/admin",
      icon: <DesktopOutlined />,
      label: t("admin.menu.dashboard"),
      description: t("admin.description.dashboard"),
    },
    {
      key: "/admin/categories",
      icon: <AppstoreOutlined />,
      label: t("admin.menu.categories"),
      description: t("admin.description.categories"),
    },
    {
      key: "/admin/products",
      icon: <ShoppingOutlined />,
      label: t("admin.menu.products"),
      description: t("admin.description.products"),
    },

    {
      key: "/admin/orders",
      icon: <ShoppingCartOutlined />,
      label: t("admin.menu.orders"),
      description: t("admin.description.orders"),
    },
    {
      key: "/admin/payments",
      icon: <CreditCardOutlined />,
      label: t("admin.menu.payments"),
      description: t("admin.description.payments"),
    },
    {
      key: "/admin/users",
      icon: <UserOutlined />,
      label: t("admin.menu.users"),
      description: t("admin.description.users"),
    },
  ];

  const userMenuItems = [
    {
      key: "language",
      label: t("common.change_language"),
      icon: <TranslationOutlined />,
      onClick: () => {
        if (lang === "vi") {
          localStorage.setItem("lang", "en");
          i18n.changeLanguage("en");
          setLang("en");
        } else {
          localStorage.setItem("lang", "vi");
          i18n.changeLanguage("vi");
          setLang("vi");
        }
      },
    },
    {
      key: "logout",
      label: t("common.logout"),
      icon: <LogoutOutlined />,
      danger: true,
      onClick: handleLogout,
    },
  ];

  function handleLogout() {
    removeToken();
    navigate("/login");
  }

  const getSelectedKey = () => {
    const currentPath = location.pathname;
    return menuItems.find((item) => currentPath === item.key)?.key;
  };

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

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
          </div>
          {!collapsed && (
            <div className="menu-item-description">{item.description}</div>
          )}
        </div>
      ),
    }));
  };

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
        <div className="admin-logo">
          {!collapsed ? (
            <div className={`logo-expanded ${collapsed ? "collapsed" : ""}`}>
              <Title level={3} className="logo-title">
                {t("admin.title")}
              </Title>
              <Text className="logo-subtitle">{t("admin.subtitle")}</Text>
            </div>
          ) : null}
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className="collapse-button"
          />
        </div>

        <Menu
          mode="inline"
          selectedKeys={[getSelectedKey() || "/admin"]}
          items={renderMenuItems()}
          onClick={handleMenuClick}
          className="modern-admin-menu"
        />

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
                    {currentUser?.full_name || t("common.user")}
                  </Text>
                  <Text className="user-role">
                    {currentUser?.role == "ROLE_ADMIN"
                      ? t("common.constant.ADMIN")
                      : t("common.constant.USER")}
                  </Text>
                </div>
              </div>
            </div>
          </Dropdown>
        )}
      </Sider>

      <Layout className="modern-admin-main">
        <Content className="modern-admin-content">
          <div className="content-inner">
            <Suspense fallback={<LoadingSpinner />}>
              <Outlet />
            </Suspense>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
