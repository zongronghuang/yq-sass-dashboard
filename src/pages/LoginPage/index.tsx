import { useState, use } from "react";
import { useFormStatus } from "react-dom";
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
  const { handleUserEmail } = use(AuthContext);

  async function loginAction(formData: FormData) {
    try {
      const email = formData.get("email") as StringFormDataEntry;
      const password = formData.get("password") as StringFormDataEntry;

      setHasError(false);
      if (!validateEmail(email) || !validatePassword(password))
        return setHasError(true);

      await new Promise((resolve) => setTimeout(resolve, 3000));

      const params = { email, password };
      const res = await fetchData(params);
      if (!res?.ok)
        throw new Error(`Request status: ${res?.status} | ${res?.statusText}`);
      const data = await res?.json();
      console.log({ res, data });

      //
      handleUserEmail(email);
    } catch (error: any) {
      console.log(`[Login: ${error.name}] ${error.message}`);
      setHasError(true);
    }
  }

  return (
    <div className="min-h-screen flex justify-center items-center px-2">
      <form
        action={loginAction}
        autoComplete="off"
        className="border border-black rounded-xl p-4 w-xs"
      >
        <fieldset className="flex flex-col justify-between gap-10 mb-5">
          <legend className="text-center mb-5 font-semibold text-2xl">
            Log In
          </legend>

          <FormControl required className="w-full">
            <InputLabel htmlFor="email" className="translate-x-[-14px]">
              <MailOutlineIcon /> Email
            </InputLabel>
            <Input type="email" id="email" name="email" autoComplete="off" />
          </FormControl>

          <Tooltip title="Only 0-9, a-z, and A-Z are accepted">
            <FormControl required className="w-full">
              <InputLabel htmlFor="password" className="translate-x-[-14px]">
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
                        <VisibilityOffIcon />
                      ) : (
                        <VisibilityIcon />
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
      className="w-3/5 h-[30px] flex justify-center items-center rounded-2xl bg-blue-500 disabled:opacity-50 mx-auto"
    >
      {pending ? "Submitting..." : "Log in"}
    </button>
  );
}
