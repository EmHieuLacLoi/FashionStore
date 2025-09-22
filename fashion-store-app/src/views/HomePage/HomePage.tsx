import React, { useMemo } from "react";
import { Carousel, Row, Col, Card, Typography, Button } from "antd";
import thumb1 from "@assets/images/thumb_1.png";
import thumb2 from "@assets/images/thumb_2.jpg";
import thumb3 from "@assets/images/thumb_3.jpg";
import "./HomePage.scss";
import { useTranslation } from "react-i18next";
import { useGlobalContext } from "../../GlobalContext";

const { Title, Paragraph } = Typography;
import { useNavigate } from "react-router";
import { formatPrice } from "@utils/formatPrice";

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const { allProducts } = useGlobalContext();

  const randomProducts = useMemo(() => {
    if (!allProducts || allProducts.length < 4) {
      return allProducts || [];
    }

    const shuffled = [...allProducts].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 4);
  }, [allProducts]);

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
          {t("common.hot")}
        </Title>
        <Row gutter={[16, 16]}>
          {(() => {
            return randomProducts.map((product, idx) => (
              <Col span={6} key={idx}>
                <Card
                  hoverable
                  className="product-card"
                  cover={
                    <div className="product-image-container">
                      <img
                        alt="product"
                        src={product.image_url[0]}
                        className="product-image"
                      />
                    </div>
                  }
                  onClick={() => navigate(`/products/${product.id}`)}
                >
                  <Card.Meta
                    title={<div className="product-title">{product.name}</div>}
                    description={
                      <div className="product-price">
                        {formatPrice(product.price)}
                      </div>
                    }
                  />
                </Card>
              </Col>
            ));
          })()}
        </Row>
      </section>

      <section style={{ margin: "40px 0" }}>
        <Title level={2} style={{ textAlign: "center" }}>
          X-Collections
        </Title>
        <Row gutter={[16, 16]}>
          {(() => {
            const collections = [
              {
                title: t("common.premium"),
                img: allProducts[allProducts.length - 1]?.image_url[0],
                productId: allProducts[allProducts.length - 1]?.id,
              },
              {
                title: t("common.trending"),
                img: allProducts[allProducts.length - 2]?.image_url[0],
                productId: allProducts[allProducts.length - 2]?.id,
              },
              {
                title: t("common.limited"),
                img: allProducts[allProducts.length - 3]?.image_url[0],
                productId: allProducts[allProducts.length - 3]?.id,
              },
            ];
            return collections.map((c) => (
              <Col span={8} key={c.title}>
                <Card
                  className="collection-card"
                  cover={
                    <div className="collection-image-container">
                      <img
                        src={c.img}
                        alt={c.title}
                        className="collection-image"
                      />
                    </div>
                  }
                  hoverable
                  onClick={() => navigate(`/products/${c.productId}`)}
                >
                  <Card.Meta title={c.title} />
                </Card>
              </Col>
            ));
          })()}
        </Row>
      </section>
    </div>
  );
};

export default HomePage;
