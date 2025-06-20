import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import DataPageLayout from "./layouts/DataPageLayout";
import LoginPage from "./pages/LoginPage";
import ActiveUsersPage from "./pages/ActiveUsersPage";
import DailyStoreSectionPage from "./pages/DailyStoreSectionPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthContext } from "./contexts/AuthContext";
import { TOKEN_KEY, TOKEN_PREFIX, EMAIL_KEY } from "./constants";
import { getToken } from "./utils";
import type { StringFormDataEntry } from "./types";
import "./App.css";

function App() {
  const [userEmail, setUserEmail] = useState<StringFormDataEntry>("");

  function logIn(userEmail: StringFormDataEntry) {
    setUserEmail(userEmail);
    localStorage.setItem(EMAIL_KEY, userEmail);
    localStorage.setItem(TOKEN_KEY, TOKEN_PREFIX + Date.now());
  }

  function logOut() {
    setUserEmail("");
    localStorage.remove(EMAIL_KEY);
    localStorage.removeItem(TOKEN_KEY);
  }

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    const maxInterval = 3 * 24 * 60 * 60 * 1000; // 3 days
    const lastLoginTime = parseInt(token);

    const shouldForceLogout = Date.now() - lastLoginTime > maxInterval;
    if (shouldForceLogout) {
      logOut();
    }
  }, []);

  return (
    <BrowserRouter>
      <AuthContext
        value={{
          userEmail,
          logIn,
          logOut,
        }}
      >
        <Routes>
          <Route index element={<LoginPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="/" element={<ProtectedRoute />}>
            <Route element={<DataPageLayout />}>
              <Route path="data/active-users" element={<ActiveUsersPage />} />
              <Route
                path="data/daily-store-sections"
                element={<DailyStoreSectionPage />}
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
      </AuthContext>
    </BrowserRouter>
  );
}

export default App;
