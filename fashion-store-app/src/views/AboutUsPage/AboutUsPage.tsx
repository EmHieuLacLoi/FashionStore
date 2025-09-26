import React from "react";
import {
  Row,
  Col,
  Card,
  Typography,
  Space,
  Avatar,
  Button,
  Timeline,
  Tag,
} from "antd";
import {
  CheckCircleTwoTone,
  TeamOutlined,
  ShopOutlined,
  RocketOutlined,
  HeartTwoTone,
} from "@ant-design/icons";
import "./AboutUsPage.scss";
import { useTranslation } from "react-i18next";

const { Title, Text, Paragraph } = Typography;

const AboutUsPage: React.FC = () => {
  const { t } = useTranslation();

  const values = [
    {
      icon: <HeartTwoTone twoToneColor="#eb2f96" />,
      title: t("dashboard.about_us.customer"),
      desc: t("dashboard.about_us.customer_des"),
    },
    {
      icon: <RocketOutlined />,
      title: t("dashboard.about_us.new"),
      desc: t("dashboard.about_us.new_des"),
    },
    {
      icon: <TeamOutlined />,
      title: t("dashboard.about_us.team_connect"),
      desc: t("dashboard.about_us.team_connect_des"),
    },
  ];

  const team = [{ name: "Võ Trung Hiếu", role: t("dashboard.about_us.dev") }];

  return (
    <div className="about-page">
      <div className="container">
        <section className="hero">
          <div>
            <Title level={2} style={{ marginBottom: 8 }}>
              {t("dashboard.about_us.title")}
            </Title>
            <Paragraph type="secondary" style={{ marginBottom: 0 }}>
              {t("dashboard.about_us.des")}
            </Paragraph>
          </div>
        </section>

        <section className="section">
          <Row gutter={[24, 24]}>
            <Col xs={24} md={10}>
              <Card className="value-card">
                <Space direction="vertical" size="small">
                  <Tag color="blue">{t("dashboard.about_us.mission")}</Tag>
                  <Title level={4} style={{ margin: 0 }}>
                    {t("dashboard.about_us.personal")}
                  </Title>
                  <Paragraph>{t("dashboard.about_us.personal_des")}</Paragraph>
                  <Space>
                    <CheckCircleTwoTone twoToneColor="#52c41a" />
                    <Text>{t("dashboard.about_us.quality")}</Text>
                  </Space>
                  <Space>
                    <CheckCircleTwoTone twoToneColor="#52c41a" />
                    <Text>{t("dashboard.about_us.fast")}</Text>
                  </Space>
                  <Space>
                    <CheckCircleTwoTone twoToneColor="#52c41a" />
                    <Text>{t("dashboard.about_us.support")}</Text>
                  </Space>
                </Space>
              </Card>
            </Col>
            <Col xs={24} md={14}>
              <div className="cards">
                {values.map((v) => (
                  <Card key={v.title} className="value-card">
                    <Space direction="vertical" size="small">
                      <Title level={5} style={{ margin: 0 }}>
                        {v.icon} {v.title}
                      </Title>
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
          <Title level={4}>{t("dashboard.about_us.journey")}</Title>
          <div>
            <div className="timeline-item">
              <div className="time">08-2025</div>
              <div>
                <Title level={5} style={{ margin: 0 }}>
                  {t("dashboard.about_us.journey_start")}
                </Title>
                <Text type="secondary">
                  {t("dashboard.about_us.journey_start_des")}
                </Text>
              </div>
            </div>
            <div className="timeline-item">
              <div className="time">09-2025</div>
              <div>
                <Title level={5} style={{ margin: 0 }}>
                  {t("dashboard.about_us.journey_1")}
                </Title>
                <Text type="secondary">
                  {t("dashboard.about_us.journey_1_des")}
                </Text>
              </div>
            </div>
          </div>
        </section>

        {/* Đội ngũ */}
        <section className="section">
          <Title level={4}>{t("dashboard.about_us.team")}</Title>
          <div className="team-grid">
            {team.map((m) => (
              <div key={m.name} className="member">
                <Avatar
                  size={72}
                  style={{ background: "#e6f4ff", color: "#1677ff" }}
                >
                  {m.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </Avatar>
                <Title level={5} style={{ marginTop: 12 }}>
                  {m.name}
                </Title>
                <Text type="secondary">{m.role}</Text>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="section">
          <div className="cta">
            <Title level={3} style={{ color: "#fff", marginBottom: 8 }}>
              {t("dashboard.about_us.CTA")}
            </Title>
            <Text style={{ color: "#ffffffd9" }}>
              {t("dashboard.about_us.CTA_des")}
            </Text>
            <div style={{ marginTop: 16 }}>
              <Space>
                <Button
                  type="primary"
                  size="large"
                  onClick={() => (window.location.href = "/products")}
                >
                  {t("dashboard.about_us.buy_now")}
                </Button>
                <Button
                  size="large"
                  onClick={() => (window.location.href = "/design")}
                >
                  {t("dashboard.about_us.design")}
                </Button>
              </Space>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutUsPage;
