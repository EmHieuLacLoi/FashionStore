import React from "react";
import { Carousel, Row, Col, Card, Typography, Button } from "antd";
import thumb1 from "@assets/images/thumb_1.png";
import thumb2 from "@assets/images/thumb_2.jpg";
import thumb3 from "@assets/images/thumb_3.jpg";
import "./HomePage.scss";
import { useTranslation } from "react-i18next";

const { Title, Paragraph } = Typography;
import { useNavigate } from "react-router";

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const slides = [
    {
      id: 1,
      title: t("common.banner.slide_1.title"),
      description: t("common.banner.slide_1.description"),
      buttonText: t("common.banner.slide_1.button_text"),
      image: thumb1,
    },
    {
      id: 2,
      title: t("common.banner.slide_2.title"),
      description: t("common.banner.slide_2.description"),
      buttonText: t("common.banner.slide_2.button_text"),
      image: thumb2,
    },
    {
      id: 3,
      title: t("common.banner.slide_3.title"),
      description: t("common.banner.slide_3.description"),
      buttonText: t("common.banner.slide_3.button_text"),
      image: thumb3,
    },
  ];

  const handleButtonClick = () => {
    navigate("/products");
  };

  return (
    <div>
      <div className="hero-banner">
        <Carousel
          autoplay
          effect="fade"
          dots={true}
          dotPosition="bottom"
          autoplaySpeed={5000}
        >
          {slides.map((slide) => (
            <div key={slide.id}>
              <div
                className="main-slide"
                style={{
                  backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${slide.image})`,
                }}
              >
                <div className="slide-content">
                  <Title level={1} className="slide-title">
                    {slide.title}
                  </Title>
                  <Paragraph className="slide-description">
                    {slide.description}
                  </Paragraph>
                  <Button
                    type="primary"
                    size="large"
                    className="cta-button"
                    onClick={handleButtonClick}
                  >
                    {slide.buttonText}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </Carousel>
      </div>

      <section style={{ margin: "40px 0" }}>
        <Title level={2} style={{ textAlign: "center" }}>
          Sản phẩm siêu hot
        </Title>
        <Row gutter={[16, 16]}>
          {Array.from({ length: 4 }).map((_, idx) => (
            <Col span={6} key={idx}>
              <Card
                hoverable
                cover={
                  <img
                    alt="product"
                    src={`https://via.placeholder.com/300x200?text=Product+${
                      idx + 1
                    }`}
                  />
                }
              >
                <Card.Meta
                  title={`Sản phẩm ${idx + 1}`}
                  description="Giá: 199.000₫"
                />
              </Card>
            </Col>
          ))}
        </Row>
      </section>

      <section style={{ margin: "40px 0" }}>
        <Title level={2} style={{ textAlign: "center" }}>
          X-Collections
        </Title>
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Card
              cover={
                <img
                  src="https://via.placeholder.com/400x250?text=Best+Sale"
                  alt="Best Sale"
                />
              }
            >
              <Card.Meta title="Best Sale" />
            </Card>
          </Col>
          <Col span={8}>
            <Card
              cover={
                <img
                  src="https://via.placeholder.com/400x250?text=X-Socks"
                  alt="X-Socks"
                />
              }
            >
              <Card.Meta title="X-Socks" />
            </Card>
          </Col>
          <Col span={8}>
            <Card
              cover={
                <img
                  src="https://via.placeholder.com/400x250?text=X-Underwear"
                  alt="X-Underwear"
                />
              }
            >
              <Card.Meta title="X-Underwear" />
            </Card>
          </Col>
        </Row>
      </section>

      <section style={{ margin: "40px 0" }}>
        <Title level={2} style={{ textAlign: "center" }}>
          Tin tức mới nhất
        </Title>
        <Row gutter={[16, 16]}>
          {Array.from({ length: 3 }).map((_, idx) => (
            <Col span={8} key={idx}>
              <Card
                hoverable
                cover={
                  <img
                    alt="blog"
                    src={`https://via.placeholder.com/350x200?text=Blog+${
                      idx + 1
                    }`}
                  />
                }
              >
                <Card.Meta
                  title={`Bài viết ${idx + 1}`}
                  description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                />
              </Card>
            </Col>
          ))}
        </Row>
        <Row justify="center" style={{ marginTop: 24 }}>
          <Button type="primary">Xem thêm</Button>
        </Row>
      </section>
    </div>
  );
};

export default HomePage;
