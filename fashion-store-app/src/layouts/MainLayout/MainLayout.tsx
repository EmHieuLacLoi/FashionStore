import { useState } from "react";
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
} from "@ant-design/icons";
import { Outlet, useNavigate } from "react-router";
import "./MainLayout.scss";
import logoBlack from "@assets/images/shirt-outline.svg";

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

const MainLayout = () => {
  const [lang, setLang] = useState("vi");
  const [showTopBar, setShowTopBar] = useState(true);
  const navigate = useNavigate();

  const handleChangeLang = (value: string) => {
    setLang(value);
    // Nếu dùng i18next:
    // i18n.changeLanguage(value);
  };

  const closeTopBar = () => {
    setShowTopBar(false);
  };

  const handleMenuClick = (key: string) => {
    // Handle menu navigation
    switch (key) {
      case "sale":
        navigate("/sale");
        break;
      case "products":
        navigate("/products");
        break;
      case "socks":
        navigate("/socks");
        break;
      case "underwear":
        navigate("/underwear");
        break;
      case "blog":
        navigate("/blog");
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
          <Row justify="space-between" align="middle">
            <Col>
              <span className="top-bar-text">
                SỈ LẺ TOÀN QUỐC – MIỄN PHÍ VẬN CHUYỂN CHO ĐƒN HÀNG TỪ 299K
              </span>
            </Col>
            <Col className="top-bar-right">
              <span className="hotline-text">
                Hotline: 0522-582-475 (8h30–22h00)
              </span>
              <Button
                type="text"
                size="small"
                icon={<CloseOutlined />}
                onClick={closeTopBar}
                className="close-top-bar"
                title="Đóng thanh thông báo"
              />
            </Col>
          </Row>
        </Header>
      )}

      <Header className="main-header">
        <Row justify="space-between" align="middle" className="header-content">
          <Col>
            <Title level={3} className="logo" onClick={() => navigate("/")}>
              <img src={logoBlack} alt="logo" className="logo-img" />
              <span>Fashion Store</span>
            </Title>
          </Col>

          <Col flex="auto">
            <Menu
              mode="horizontal"
              selectable={false}
              className="main-menu"
              onClick={({ key }) => handleMenuClick(key)}
            >
              <Menu.Item key="sale" className="menu-sale">
                SALE
              </Menu.Item>
              <Menu.Item key="products">SẢN PHẨM</Menu.Item>
              <Menu.Item key="socks">TẤT VỚ</Menu.Item>
              <Menu.Item key="underwear">ĐỒ LÓT</Menu.Item>
              <Menu.Item key="blog">BLOG</Menu.Item>
              <Menu.Item key="about">GIỚI THIỆU</Menu.Item>
            </Menu>
          </Col>

          <Col>
            <Select
              value={lang}
              className="lang-select"
              onChange={handleChangeLang}
              options={[
                { value: "vi", label: "🇻🇳 Tiếng Việt" },
                { value: "en", label: "🇬🇧 English" },
              ]}
            />
          </Col>

          <Col>
            <div className="auth-cart-section">
              <Button
                type="text"
                icon={<LoginOutlined />}
                className="login-btn"
                onClick={() => navigate("/login")}
              >
                Đăng nhập
              </Button>
              <Button
                type="primary"
                className="register-btn"
                onClick={() => navigate("/register")}
              >
                Đăng ký
              </Button>
              <Button
                type="text"
                icon={<ShoppingCartOutlined />}
                className="cart-btn"
                onClick={() => navigate("/cart")}
                title="Giỏ hàng"
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
                Liên hệ
              </Title>
              <div className="footer-info">
                <p>
                  <strong>Địa chỉ:</strong> Văn Quang, Xã Nghĩa Hương, Huyện
                  Quốc Oai, Hà Nội
                </p>
                <p>
                  <strong>Điện thoại:</strong>
                  <a href="tel:0972282702">0972-282-702</a>
                </p>
                <p>
                  <strong>Email:</strong>
                  <a href="mailto:info.simplex.vn@gmail.com">
                    info.simplex.vn@gmail.com
                  </a>
                </p>
              </div>
            </Col>

            <Col xs={24} md={8}>
              <Title level={5} className="footer-title">
                Chính sách
              </Title>
              <ul className="footer-links">
                <li>
                  <a href="/search">Tìm kiếm</a>
                </li>
                <li>
                  <a href="/return-policy">Chính sách đổi trả</a>
                </li>
                <li>
                  <a href="/privacy-policy">Chính sách bảo mật</a>
                </li>
                <li>
                  <a href="/shipping-policy">Chính sách vận chuyển</a>
                </li>
                <li>
                  <a href="/contact">Liên hệ</a>
                </li>
              </ul>
            </Col>

            <Col xs={24} md={8}>
              <Title level={5} className="footer-title">
                Đăng ký nhận tin
              </Title>
              <Input.Search
                placeholder="Nhập email của bạn"
                enterButton="Đăng ký"
                className="newsletter-input"
                onSearch={(value) => {
                  if (value) {
                    console.log("Newsletter subscription:", value);
                  }
                }}
              />
              <p style={{ fontSize: "12px", color: "#999", marginTop: "8px" }}>
                Nhận thông tin khuyến mãi và sản phẩm mới nhất
              </p>
            </Col>
          </Row>

          <Row justify="center" className="footer-copyright">
            <Col>
              <p>
                © {new Date().getFullYear()} Bản quyền thuộc về SimpleX. All
                rights reserved.
              </p>
            </Col>
          </Row>
        </div>
      </Footer>
    </Layout>
  );
};

export default MainLayout;
