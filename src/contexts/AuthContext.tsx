import { createContext } from "react";
import type { StringFormDataEntry } from "../types";

export const AuthContext = createContext({
  userEmail: "",
  handleUserEmail: (userEmail: StringFormDataEntry) => {},
});
