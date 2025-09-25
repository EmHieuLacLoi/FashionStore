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
  BellOutlined,
  TrophyOutlined,
  RiseOutlined,
  DesktopOutlined,
} from "@ant-design/icons";

const { Header, Sider, Content } = Layout;
const { Text, Title } = Typography;

const DashboardPage = () => {
  return (
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
              value={1}
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
              value={1}
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
              value={1}
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
              value={1}
              valueStyle={{ color: "white", fontWeight: "bold" }}
              suffix={<TrophyOutlined className="stat-icon" />}
            />
            <Text className="stat-description">5 new this week</Text>
          </Card>
        </Col>
      </Row>

      <Card className="quick-actions-card" title="Quick Actions">
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
};

export default DashboardPage;
