import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "@lang/index.ts";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { routes } from "@routes/index";
import { createBrowserRouter } from "react-router";
import ErrorBoundary from "@components/ErrorBoundary/ErrorBoundary";
import { GlobalProvider } from "./GlobalContext";
import { RouterProvider } from "react-router";
import { ConfigProvider, App as AntdApp } from "antd";
import StaticAntdProvider from "./StaticAntdProvider";

const queryClient = new QueryClient();
const router = createBrowserRouter(routes);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ConfigProvider input={{ autoComplete: "off" }}>
        <AntdApp>
          <ErrorBoundary>
            <GlobalProvider>
              <StaticAntdProvider>
                <RouterProvider router={router} />
              </StaticAntdProvider>
            </GlobalProvider>
          </ErrorBoundary>
        </AntdApp>
      </ConfigProvider>
    </QueryClientProvider>
  </StrictMode>
);
