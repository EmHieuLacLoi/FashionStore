import React from "react";
import "./ErrorBoundary.scss";

interface ErrorBoundaryState {
  hasError: boolean;
  errorInfo: string | null;
}

export default class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: any) {
    super(props);
    this.state = {
      hasError: false,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, errorInfo: error.message };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Lỗi được bắt bởi ErrorBoundary:", error, errorInfo);
    window.onerror = function (error) {
      console.error("Lỗi ngoài ErrorBoundary:", error);
    };
  }

  render() {
    const lang = localStorage.getItem("language") || "vi";

    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h1 className="error-boundary__title">
            ⚠️{" "}
            {lang == "vi"
              ? "Đã xảy ra lỗi trong ứng dụng!"
              : "An error occurred in the application!"}
          </h1>
          <p className="error-boundary__description">
            {lang == "vi"
              ? "Xin lỗi vì sự bất tiện. Vui lòng thử mở lại ứng dụng hoặc liên hệ hỗ trợ nếu sự cố vẫn tiếp diễn."
              : "Sorry for the inconvenience. Please try opening the application again or contact support if the issue persists."}
          </p>
          <details className="error-boundary__details">
            <summary className="error-boundary__summary">
              {lang == "vi" ? "Chi tiết lỗi" : "Error details"}
            </summary>
            <pre className="error-boundary__pre">{this.state.errorInfo}</pre>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}
