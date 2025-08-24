import React from "react";
import { Typography } from "antd";
import { Link } from "react-router";

const { Title } = Typography;

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <Title level={1} className="text-6xl font-bold text-red-500">
        404
      </Title>
      <p className="text-xl mt-4">Oops! Trang bạn tìm không tồn tại.</p>
      <Link
        to="/"
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Quay lại Trang chủ
      </Link>
    </div>
  );
};

export default NotFound;
