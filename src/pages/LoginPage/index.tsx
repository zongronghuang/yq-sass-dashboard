import { useState, use } from "react";
import { useFormStatus } from "react-dom";
import { useNavigate } from "react-router";
import clsx from "clsx";
import {
  FormControl,
  Input,
  InputLabel,
  FormHelperText,
  InputAdornment,
  IconButton,
  Tooltip,
} from "@mui/material";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import PasswordIcon from "@mui/icons-material/Password";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { AuthContext } from "../../contexts/AuthContext";
import type { StringFormDataEntry } from "../../types";
import { fetchData } from "../../apis";
import { validateEmail, validatePassword } from "../../utils";

export default function LoginPage() {
  const [isPwdVisible, setIsPwdVisible] = useState(false);
  const [hasError, setHasError] = useState(false);
  const { logIn } = use(AuthContext);
  const navigate = useNavigate();

  async function loginAction(formData: FormData) {
    try {
      setHasError(false);

      // validation
      const email = formData.get("email") as StringFormDataEntry;
      const password = formData.get("password") as StringFormDataEntry;
      if (!validateEmail(email) || !validatePassword(password))
        return setHasError(true);

      // send data to server
      const params = { email, password };
      const res = await fetchData(params);
      if (!res?.ok)
        throw new Error(`Request status: ${res?.status} | ${res?.statusText}`);
      const data = await res?.json();

      if (data) {
        logIn(email);
        navigate("/data/active-users");
      }
    } catch (error: any) {
      console.error(`[Login: ${error.name}] ${error.message}`);
      setHasError(true);
    }
  }

  return (
    <div className="min-h-screen flex justify-center items-center px-2 bg-gradient-to-br from-blue-500 to-purple-700">
      <form
        action={loginAction}
        autoComplete="off"
        className="p-4 w-xs sm:w-xl sm:p-8 bg-white/90 backdrop-blur-md shadow-lg rounded-xl"
      >
        <fieldset className="flex flex-col justify-between gap-10 mb-5">
          <legend className="text-center mb-5 font-semibold text-2xl sm:text-4xl sm:mb-8">
            Sign In To App!
          </legend>

          <FormControl required className="w-full">
            <InputLabel
              htmlFor="email"
              className="translate-x-[-14px] sm:!text-xl"
            >
              <MailOutlineIcon /> Email
            </InputLabel>
            <Input type="email" id="email" name="email" autoComplete="off" />
          </FormControl>

          <Tooltip
            className="sm:!text-2xl"
            title="Only 0-9, a-z, and A-Z are accepted"
          >
            <FormControl required className="w-full">
              <InputLabel
                htmlFor="password"
                className="translate-x-[-14px] sm:!text-xl"
              >
                <PasswordIcon /> Password
              </InputLabel>
              <Input
                type={isPwdVisible ? "text" : "password"}
                id="password"
                name="password"
                autoComplete="off"
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setIsPwdVisible(!isPwdVisible)}
                      edge="end"
                    >
                      {isPwdVisible ? (
                        <VisibilityOffIcon className="sm:scale-125" />
                      ) : (
                        <VisibilityIcon className="sm:scale-125" />
                      )}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
          </Tooltip>

          <FormHelperText className={clsx(hasError ? "visible" : "invisible")}>
            <ErrorOutlineIcon className="text-red-600" />{" "}
            <span className="text-red-600">Incorrect email or password</span>
          </FormHelperText>
        </fieldset>

        <SubmitButton />
      </form>
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-3/5 h-[30px] flex justify-center text-white font-semibold sm:text-2xl sm:h-12 items-center rounded-2xl sm:rounded-xl bg-blue-500 disabled:opacity-50 mx-auto"
    >
      {pending ? "Submitting..." : "Log in"}
    </button>
  );
}
