import React from "react";
import { Carousel, Row, Col, Card, Typography, Button } from "antd";

const { Title, Paragraph } = Typography;

const HomePage: React.FC = () => {
  return (
    <div>
      {/* Hero Banner */}
      <Carousel autoplay>
        <div>
          <img
            src="https://via.placeholder.com/1200x400?text=Banner+1"
            alt="banner1"
            style={{ width: "100%", borderRadius: 8 }}
          />
        </div>
        <div>
          <img
            src="https://via.placeholder.com/1200x400?text=Banner+2"
            alt="banner2"
            style={{ width: "100%", borderRadius: 8 }}
          />
        </div>
      </Carousel>

      {/* Hot Products */}
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

      {/* Collections */}
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

      {/* Blog Section */}
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
