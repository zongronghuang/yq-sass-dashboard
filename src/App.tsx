import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import LoginPage from "./pages/LoginPage";
import DataPage from "./pages/DataPage";
import { AuthContext } from "./contexts/AuthContext";
import { TOKEN_KEY, TOKEN_PREFIX } from "./constants";
import type { StringFormDataEntry } from "./types";
import "./App.css";

function App() {
  const [userEmail, setUserEmail] = useState<StringFormDataEntry>("");

  function handleUserEmail(userEmail: StringFormDataEntry) {
    setUserEmail(userEmail);
    localStorage.setItem(TOKEN_KEY, TOKEN_PREFIX + Date.now());
  }

  return (
    <BrowserRouter>
      <AuthContext
        value={{
          userEmail,
          handleUserEmail,
        }}
      >
        <Routes>
          <Route index element={<LoginPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="data" element={<DataPage />} />
          <Route path="*" element={<LoginPage />} />
        </Routes>
      </AuthContext>
    </BrowserRouter>
  );
}

export default App;
