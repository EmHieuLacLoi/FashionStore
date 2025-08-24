import { Spin } from "antd";

const LoadingOverlay = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
      <Spin size="large" tip="Loading..." />
    </div>
  );
};

export default LoadingOverlay;
