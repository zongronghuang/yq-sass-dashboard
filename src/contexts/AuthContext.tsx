import { createContext } from "react";
import type { StringFormDataEntry } from "../types";

export const AuthContext = createContext({
  userEmail: "",
  // underscored unused params escape TypeScript's check
  // void unused params escape ESLint's check
  logIn: (_userEmail: StringFormDataEntry) => {
    void _userEmail;
  },
  logOut: () => {},
});
