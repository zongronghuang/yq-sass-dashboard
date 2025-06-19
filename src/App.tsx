import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import DataPageLayout from "./layouts/DataPageLayout";
import LoginPage from "./pages/LoginPage";
import ActiveUsersPage from "./pages/ActiveUsersPage";
import DailyStoreSectionPage from "./pages/DailyStoreSectionPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthContext } from "./contexts/AuthContext";
import { TOKEN_KEY, TOKEN_PREFIX } from "./constants";
import type { StringFormDataEntry } from "./types";
import "./App.css";

function App() {
  const [userEmail, setUserEmail] = useState<StringFormDataEntry>("");

  function logIn(userEmail: StringFormDataEntry) {
    setUserEmail(userEmail);
    localStorage.setItem(TOKEN_KEY, TOKEN_PREFIX + Date.now());
  }

  function logOut() {
    setUserEmail("");
    localStorage.removeItem(TOKEN_KEY);
  }

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
                path="data/daily-store-section"
                element={<DailyStoreSectionPage />}
              />
            </Route>
          </Route>
        </Routes>
      </AuthContext>
    </BrowserRouter>
  );
}

export default App;
