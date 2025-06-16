import { useState } from "react";
import LoginPage from "./pages/LoginPage";
import { AuthContext } from "./contexts/AuthContext";
import { TOKEN_PREFIX } from "./mocks";
import type { StringFormDataEntry } from "./types";
import "./App.css";

function App() {
  const [userEmail, setUserEmail] = useState<StringFormDataEntry>("");

  function handleUserEmail(userEmail: StringFormDataEntry) {
    setUserEmail(userEmail);
    localStorage.setItem("yq_user_token", TOKEN_PREFIX + Date.now());
  }

  return (
    <AuthContext
      value={{
        userEmail,
        handleUserEmail,
      }}
    >
      <LoginPage />
    </AuthContext>
  );
}

export default App;
