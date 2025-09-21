import React from "react";
import { Typography } from "antd";
import { Link } from "react-router";
import "./NotFoundPage.scss";

const { Title, Text } = Typography;

const NotFound: React.FC = () => {
  return (
    <div className="not-found-page">
      <Title level={1} className="status-code">
        404
      </Title>
      <Title level={3} className="message-title">
        Oops! Không tìm thấy trang
      </Title>
      <Text className="message-description">
        Rất tiếc, trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
      </Text>
      <Link to="/" className="back-home-btn">
        Quay lại Trang chủ
      </Link>
    </div>
  );
};

export default NotFound;
