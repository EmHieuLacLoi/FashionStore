import { HashRouter as Router, Routes, Route } from "react-router";
import { Suspense } from "react";
import { routes } from "@routes/index";
import { GlobalProvider } from "./GlobalContext";
import ErrorBoundary from "@components/ErrorBoundary/ErrorBoundary";
import { ConfigProvider } from "antd";
import LoadingOverlay from "@components/LoadingSpinner";

const App = () => {
  return (
    <>
      <ConfigProvider input={{ autoComplete: "off" }}>
        <Router>
          <ErrorBoundary>
            <GlobalProvider>
              <Suspense fallback={<LoadingOverlay />}>
                <Routes>
                  {routes.map((route, index) => (
                    <Route
                      key={index}
                      path={route.path}
                      element={route.element}
                    >
                      {route.children &&
                        route.children.map((child, childIndex) => (
                          <Route
                            key={childIndex}
                            index={child.index}
                            path={child.path}
                            element={child.element}
                          />
                        ))}
                    </Route>
                  ))}
                </Routes>
              </Suspense>
            </GlobalProvider>
          </ErrorBoundary>
        </Router>
      </ConfigProvider>
    </>
  );
};

export default App;
