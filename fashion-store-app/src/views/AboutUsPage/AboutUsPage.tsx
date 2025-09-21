import React from "react";
import { Row, Col, Card, Typography, Space, Avatar, Button, Timeline, Tag } from "antd";
import { CheckCircleTwoTone, TeamOutlined, ShopOutlined, RocketOutlined, HeartTwoTone } from "@ant-design/icons";
import "./AboutUsPage.scss";

const { Title, Text, Paragraph } = Typography;

const values = [
  { icon: <HeartTwoTone twoToneColor="#eb2f96" />, title: "Khách hàng là trọng tâm", desc: "Lắng nghe và phục vụ với toàn bộ trái tim." },
  { icon: <RocketOutlined />, title: "Đổi mới không ngừng", desc: "Thử nghiệm, học hỏi và cải tiến mỗi ngày." },
  { icon: <TeamOutlined />, title: "Hợp tác bền vững", desc: "Cùng nhau tạo ra nhiều giá trị hơn." },
];

const team = [
  { name: "Nguyen Van A", role: "Founder & CEO" },
  { name: "Tran Thi B", role: "Head of Design" },
  { name: "Le Van C", role: "Engineering Lead" },
  { name: "Pham Thi D", role: "Operations" },
];

const AboutUsPage: React.FC = () => {
  return (
    <div className="about-page">
      <div className="container">
        {/* Hero */}
        <section className="hero">
          <div>
            <Title level={2} style={{ marginBottom: 8 }}>Về Fashion Store</Title>
            <Paragraph type="secondary" style={{ marginBottom: 0 }}>
              Chúng tôi mang đến trải nghiệm mua sắm thời trang hiện đại, cá nhân hóa và bền vững.
            </Paragraph>
          </div>
          <div className="metrics">
            <div className="metric">
              <div className="number">500K+</div>
              <div className="label">Khách hàng</div>
            </div>
            <div className="metric">
              <div className="number">10K+</div>
              <div className="label">Sản phẩm</div>
            </div>
            <div className="metric">
              <div className="number">1,200+</div>
              <div className="label">Đối tác</div>
            </div>
            <div className="metric">
              <div className="number">2019</div>
              <div className="label">Năm thành lập</div>
            </div>
          </div>
        </section>

        {/* Sứ mệnh & Giá trị */}
        <section className="section">
          <Row gutter={[24, 24]}>
            <Col xs={24} md={10}>
              <Card className="value-card">
                <Space direction="vertical" size="small">
                  <Tag color="blue">Sứ mệnh</Tag>
                  <Title level={4} style={{ margin: 0 }}>Tôn vinh phong cách cá nhân của bạn</Title>
                  <Paragraph>
                    Chúng tôi tin rằng thời trang là cách thể hiện con người. Nhiệm vụ của chúng tôi là giúp bạn dễ dàng khám phá, tùy biến và sở hữu phong cách của riêng mình.
                  </Paragraph>
                  <Space>
                    <CheckCircleTwoTone twoToneColor="#52c41a" />
                    <Text>Chất lượng đảm bảo</Text>
                  </Space>
                  <Space>
                    <CheckCircleTwoTone twoToneColor="#52c41a" />
                    <Text>Giao hàng nhanh chóng</Text>
                  </Space>
                  <Space>
                    <CheckCircleTwoTone twoToneColor="#52c41a" />
                    <Text>Hỗ trợ tận tâm</Text>
                  </Space>
                </Space>
              </Card>
            </Col>
            <Col xs={24} md={14}>
              <div className="cards">
                {values.map((v) => (
                  <Card key={v.title} className="value-card">
                    <Space direction="vertical" size="small">
                      <Title level={5} style={{ margin: 0 }}>{v.icon} {v.title}</Title>
                      <Text type="secondary">{v.desc}</Text>
                    </Space>
                  </Card>
                ))}
              </div>
            </Col>
          </Row>
        </section>

        {/* Hành trình */}
        <section className="section">
          <Title level={4}>Hành trình của chúng tôi</Title>
          <div>
            <div className="timeline-item">
              <div className="time">2019</div>
              <div>
                <Title level={5} style={{ margin: 0 }}>Bắt đầu</Title>
                <Text type="secondary">Ra mắt cửa hàng online đầu tiên, phục vụ 1,000 khách hàng trong tháng đầu.</Text>
              </div>
            </div>
            <div className="timeline-item">
              <div className="time">2021</div>
              <div>
                <Title level={5} style={{ margin: 0 }}>Mở rộng</Title>
                <Text type="secondary">Hệ thống kho bãi và đối tác logistics toàn quốc, nâng cao tốc độ giao hàng.</Text>
              </div>
            </div>
            <div className="timeline-item">
              <div className="time">2024</div>
              <div>
                <Title level={5} style={{ margin: 0 }}>Cá nhân hóa</Title>
                <Text type="secondary">Ra mắt tính năng thiết kế áo 2D/3D, cho phép khách hàng tùy biến sản phẩm.</Text>
              </div>
            </div>
          </div>
        </section>

        {/* Đội ngũ */}
        <section className="section">
          <Title level={4}>Đội ngũ</Title>
          <div className="team-grid">
            {team.map((m) => (
              <div key={m.name} className="member">
                <Avatar size={72} style={{ background: "#e6f4ff", color: "#1677ff" }}>
                  {m.name.split(" ").map((n) => n[0]).join("")}
                </Avatar>
                <Title level={5} style={{ marginTop: 12 }}>{m.name}</Title>
                <Text type="secondary">{m.role}</Text>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="section">
          <div className="cta">
            <Title level={3} style={{ color: "#fff", marginBottom: 8 }}>Cùng chúng tôi tạo nên điều khác biệt</Title>
            <Text style={{ color: "#ffffffd9" }}>Khám phá bộ sưu tập mới và tùy biến sản phẩm theo phong cách của bạn.</Text>
            <div style={{ marginTop: 16 }}>
              <Space>
                <Button type="primary" size="large" onClick={() => (window.location.href = "/products")}>Mua sắm ngay</Button>
                <Button size="large" onClick={() => (window.location.href = "/design")}>Thiết kế áo</Button>
              </Space>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutUsPage;

