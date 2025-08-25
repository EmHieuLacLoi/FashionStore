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
} from "antd";
import {
  ShoppingCartOutlined,
  LoginOutlined,
  CloseOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Outlet, useNavigate } from "react-router";
import "./MainLayout.scss";
import { useTranslation } from "react-i18next";
import logoBlack from "@assets/images/Logo_black.svg";
import logoGreen from "@assets/images/Logo_green.svg";
import logoRed from "@assets/images/Logo_red.svg";

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

const MainLayout = () => {
  const [lang, setLang] = useState("");
  const [showTopBar, setShowTopBar] = useState(true);
  const [currentLogo, setCurrentLogo] = useState(logoBlack);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

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
        <Row justify="space-between" align="middle" className="header-content">
          <Col>
            <Title level={3} className="logo" onClick={() => navigate("/")}>
              <img src={currentLogo} alt="logo" className="logo-img" />
            </Title>
          </Col>

          <Col span={13}>
            <Menu
              mode="horizontal"
              selectable={true}
              className="main-menu"
              onClick={({ key }) => handleMenuClick(key)}
            >
              <Menu.Item key="products">
                {t("common.toolbar.products")}
              </Menu.Item>
              <Menu.Item key="design">{t("common.toolbar.design")}</Menu.Item>
              <Menu.Item key="about">{t("common.toolbar.about")}</Menu.Item>
            </Menu>
          </Col>

          <Col span={2}>
            <Select
              value={lang}
              className="lang-select"
              onChange={handleChangeLang}
              options={[
                { value: "vi", label: t("common.lang.vi") },
                { value: "en", label: t("common.lang.en") },
              ]}
            />
          </Col>

          <Col span={5}>
            <div className="auth-cart-section">
              <Button
                type="text"
                icon={<LoginOutlined />}
                className="login-btn"
                onClick={() => navigate("/login")}
              >
                {t("common.auth.login")}
              </Button>
              <Button
                type="primary"
                icon={<UserOutlined />}
                className="register-btn"
                onClick={() => navigate("/register")}
              >
                {t("common.auth.register")}
              </Button>
              <Button
                type="text"
                icon={<ShoppingCartOutlined />}
                className="cart-btn"
                onClick={() => navigate("/cart")}
                title={t("common.toolbar.cart")}
              />
            </div>
          </Col>
        </Row>
      </Header>

      <Content className="main-content">
        <div className="content-wrapper">
          <Outlet />
        </div>
      </Content>

      <Footer className="main-footer">
        <div className="footer-content">
          <Row gutter={[32, 24]}>
            <Col xs={24} md={8}>
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

            <Col xs={24} md={8}>
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
                onSearch={(value) => {
                  if (value) {
                    console.log("Newsletter subscription:", value);
                  }
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
