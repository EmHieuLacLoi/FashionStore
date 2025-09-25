import { useState, useEffect } from "react";
import {
  Layout,
  Menu,
  Row,
  Col,
  Typography,
  Button,
  Input,
  Select,
  Dropdown,
  Badge,
  message,
} from "antd";
import {
  ShoppingCartOutlined,
  LoginOutlined,
  CloseOutlined,
  UserOutlined,
  UserAddOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Outlet, useNavigate } from "react-router";
import "./MainLayout.scss";
import { useTranslation } from "react-i18next";
import logoBlack from "@assets/images/Logo_black.svg";
import logoGreen from "@assets/images/Logo_green.svg";
import logoRed from "@assets/images/Logo_red.svg";
import { useGlobalContext } from "../../GlobalContext";
import { getToken, removeToken } from "@utils/auth";
import { useSendEmail } from "@hooks/EmailHook";

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

const MainLayout = () => {
  const { lang, setLang } = useGlobalContext();
  const [showTopBar, setShowTopBar] = useState(true);
  const [currentLogo, setCurrentLogo] = useState(logoBlack);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const token = getToken();
  const { cartItems } = useGlobalContext();
  const totalCartQty = cartItems.reduce((sum, i) => sum + i.quantity, 0);
  const sendEmailMutation = useSendEmail();

  useEffect(() => {
    const randomNum = Math.floor(Math.random() * 3) + 1;
    if (randomNum === 1) setCurrentLogo(logoBlack);
    else if (randomNum === 2) setCurrentLogo(logoGreen);
    else setCurrentLogo(logoRed);

    const lang = localStorage.getItem("language") || "vi";
    setLang(lang);
    i18n.changeLanguage(lang);
  }, []);

  const handleChangeLang = (value: string) => {
    setLang(value);
    localStorage.setItem("language", value);
    i18n.changeLanguage(value);
  };

  const closeTopBar = () => {
    setShowTopBar(false);
  };

  const handleMenuClick = (key: string) => {
    switch (key) {
      case "sale":
        navigate("/sale");
        break;
      case "products":
        navigate("/products");
        break;
      case "design":
        navigate("/design");
        break;
      case "about":
        navigate("/about");
        break;
      default:
        break;
    }
  };

  const menuUser = token ? (
    <Menu
      items={[
        {
          key: "profile",
          label: t("common.auth.profile"),
          icon: <UserOutlined />,
          onClick: () => navigate("/profile"),
        },
        {
          type: "divider",
        },
        {
          key: "logout",
          label: t("common.auth.logout"),
          icon: <LogoutOutlined />,
          danger: true,
          onClick: () => {
            removeToken();
            message.success(
              t("common.message.success", { value: t("auth.logout") })
            );
            navigate("/");
          },
        },
      ]}
    />
  ) : (
    <Menu
      items={[
        {
          key: "login",
          label: t("common.auth.login"),
          icon: <LoginOutlined />,
          onClick: () => navigate("/login"),
        },
        {
          key: "register",
          label: t("common.auth.register"),
          icon: <UserAddOutlined />,
          onClick: () => navigate("/register"),
        },
      ]}
    />
  );

  const [loading, setLoading] = useState(false);
  const handleSubscribe = async (value: string) => {
    if (value && value.trim() !== "" && value.includes("@")) {
      try {
        setLoading(true);
        const result = await sendEmailMutation.mutateAsync({ email: value });

        if (result && result?.data == 1) {
          message.success(t("common.message.subscribe_success"));
        } else {
          message.error(t("common.message.subscribe_error"));
        }
      } catch (error) {
        message.error(t("common.message.subscribe_error"));
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Layout className="main-layout">
      {showTopBar && (
        <Header className="top-bar">
          <div className="top-bar-flex">
            <span className="top-bar-text">{t("common.slogan")}</span>
            <Button
              type="text"
              size="small"
              icon={<CloseOutlined />}
              onClick={closeTopBar}
              className="close-top-bar"
              title={t("common.button.close-top-bar")}
            />
          </div>
        </Header>
      )}

      <Header className="main-header">
        <div className="header-container">
          <div className="logo-section">
            <Title level={3} className="logo" onClick={() => navigate("/")}>
              <img src={currentLogo} alt="logo" className="logo-img" />
            </Title>
          </div>

          <div className="menu-section">
            <Menu
              mode="horizontal"
              selectable={false}
              selectedKeys={[]}
              className="main-menu"
              onClick={({ key }) => handleMenuClick(key)}
            >
              <Menu.Item key="products" className="menu-item">
                {t("common.toolbar.products")}
              </Menu.Item>
              <Menu.Item key="design" className="menu-item">
                {t("common.toolbar.design")}
              </Menu.Item>
              <Menu.Item key="about" className="menu-item">
                {t("common.toolbar.about")}
              </Menu.Item>
            </Menu>
          </div>

          <div className="controls-section">
            <Select
              value={lang}
              className="lang-select"
              onChange={handleChangeLang}
              options={[
                { value: "vi", label: t("common.lang.vi") },
                { value: "en", label: t("common.lang.en") },
              ]}
            />

            <div className="auth-cart-section">
              <Dropdown
                overlay={menuUser}
                trigger={["hover"]}
                placement="bottomCenter"
                arrow={{ pointAtCenter: true }}
                overlayClassName="user-dropdown-overlay"
              >
                <Button
                  type="text"
                  className="user-btn"
                  icon={<UserOutlined />}
                />
              </Dropdown>

              <Badge count={totalCartQty} size="small">
                <Button
                  type="text"
                  icon={<ShoppingCartOutlined />}
                  onClick={() => navigate("/cart")}
                  className="cart-btn"
                />
              </Badge>
            </div>
          </div>
        </div>
      </Header>

      <Content className="main-content">
        <div className="content-wrapper">
          <Outlet />
        </div>
      </Content>

      <Footer className="main-footer">
        <div className="footer-content">
          <Row gutter={[32, 24]}>
            <Col xs={24} md={10}>
              <Title level={5} className="footer-title">
                {t("common.footer.contact")}
              </Title>
              <div className="footer-info">
                <p>
                  <strong>{t("common.footer.address")}: </strong>{" "}
                  <a
                    target="_blank"
                    href="https://maps.app.goo.gl/ujaxK7dAk55Vy9YB8"
                  >
                    Chu Trần, Tiến Thịnh, Mê Linh, Hà Nội
                  </a>
                </p>
                <p>
                  <strong>{t("common.footer.phone")}: </strong>
                  <a>0945941389</a>
                </p>
                <p>
                  <strong>{t("common.footer.email")}: </strong>
                  <a href="mailto:vohieu972003@gmail.com">
                    vohieu972003@gmail.com
                  </a>
                </p>
                <p>
                  <strong>{t("common.footer.github")}: </strong>
                  <a target="_blank" href="https://github.com/EmHieuLacLoi">
                    EmHieuLacLoi
                  </a>
                </p>
              </div>
            </Col>

            <Col xs={24} md={6}>
              <Title level={5} className="footer-title">
                {t("common.footer.policy")}
              </Title>
              <ul className="footer-links">
                <li>
                  <a href="/about">{t("common.toolbar.about")}</a>
                </li>
                <li>
                  <a href="/products">{t("common.toolbar.products")}</a>
                </li>
                <li>
                  <a href="/design">{t("common.toolbar.design")}</a>
                </li>
              </ul>
            </Col>

            <Col xs={24} md={8}>
              <Title level={5} className="footer-title">
                {t("common.footer.newsletter")}
              </Title>
              <Input.Search
                placeholder={t("common.footer.email_placeholder")}
                enterButton={t("common.button.subscribe")}
                className="newsletter-input"
                loading={loading}
                onSearch={(value) => {
                  handleSubscribe(value);
                }}
              />
              <p style={{ fontSize: "12px", color: "#999", marginTop: "8px" }}>
                {t("common.footer.get_news")}
              </p>
            </Col>
          </Row>

          <Row justify="center" className="footer-copyright">
            <Col>
              <p>
                © {new Date().getFullYear()} {t("common.footer.copyright")}
              </p>
            </Col>
          </Row>
        </div>
      </Footer>
    </Layout>
  );
};

export default MainLayout;
