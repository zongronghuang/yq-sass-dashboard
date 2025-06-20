import { use, useEffect, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import DataPageLayout from "./layouts/DataPageLayout";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import GeneralSkeleton from "./components/GeneralSkeleton";
import { AuthContext } from "./contexts/AuthContext";
import AuthContextProvider from "./contexts/AuthContextProvider";
import { APP_BASENAME } from "./constants";
import { getToken } from "./utils";
import "./App.css";

const ActiveUsersPage = lazy(() => import("./pages/ActiveUsersPage"));
const DailyStoreSectionPage = lazy(
  () => import("./pages/DailyStoreSectionPage")
);

function App() {
  const { logOut } = use(AuthContext);

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    const maxInterval = 3 * 24 * 60 * 60 * 1000; // 3 days
    const lastLoginTime = parseInt(token);

    const shouldForceLogout = Date.now() - lastLoginTime > maxInterval;
    if (shouldForceLogout) {
      logOut();
    }
  }, [logOut]);

  return (
    <BrowserRouter basename={APP_BASENAME}>
      <AuthContextProvider>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/data" element={<DataPageLayout />}>
              <Route
                path="active-users"
                element={
                  <Suspense fallback={<GeneralSkeleton />}>
                    <ActiveUsersPage />
                  </Suspense>
                }
              />
              <Route
                path="daily-store-sections"
                element={
                  <Suspense fallback={<GeneralSkeleton />}>
                    <DailyStoreSectionPage />
                  </Suspense>
                }
              />
            </Route>
          </Route>
          <Route
            path="*"
            element={
              <Navigate
                to={getToken() ? "/data/active-users" : "/login"}
                replace
              />
            }
          />
        </Routes>
      </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;
