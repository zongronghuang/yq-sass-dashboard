import { useState, useRef, type ReactNode } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "./AuthContext";
import type { StringFormDataEntry } from "../types";
import { TOKEN_KEY, TOKEN_PREFIX, EMAIL_KEY } from "../constants";

export default function AuthContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [userEmail, setUserEmail] = useState<StringFormDataEntry>("");
  const navigateRef = useRef(useNavigate());

  function logIn(userEmail: StringFormDataEntry) {
    setUserEmail(userEmail);
    localStorage.setItem(EMAIL_KEY, userEmail);
    localStorage.setItem(TOKEN_KEY, TOKEN_PREFIX + Date.now());
  }

  const logOut = () => {
    setUserEmail("");
    localStorage.removeItem(EMAIL_KEY);
    localStorage.removeItem(TOKEN_KEY);
    navigateRef.current("/login");
  };

  return (
    <AuthContext.Provider value={{ userEmail, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
}
