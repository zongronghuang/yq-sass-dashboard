import { useState } from "react";
import LoginPage from "./pages/LoginPage";
import { AuthContext } from "./contexts/AuthContext";
import type { StringFormDataEntry } from "./types";
import "./App.css";

function App() {
  const [userEmail, setUserEmail] = useState<StringFormDataEntry>("");

  function handleUserEmail(userEmail: StringFormDataEntry) {
    setUserEmail(userEmail);
    localStorage.setItem("yq_user", userEmail);
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
