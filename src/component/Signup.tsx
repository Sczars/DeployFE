import { useState } from "react";
import { loginUser, signupUser } from "../script/checkToken.js";
import { Input } from "antd";
import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";

export default function Signup() {
  const navigate = useNavigate();
  const [saveUsername, setSaveUsername] = useState<string>(
    () => localStorage.getItem("save_username") || ""
  );
  const [saveEmail, setSaveEmail] = useState<string>(
    () => localStorage.getItem("save_email") || ""
  );

  useEffect(() => {
    if (saveEmail != localStorage.getItem("save_email")) {
      localStorage.setItem("save_email", saveEmail);
    }
    if (saveUsername != localStorage.getItem("save_username")) {
      localStorage.setItem("save_username", saveUsername);
    }
  }, [saveEmail, saveUsername]);

  function emailValidation(email: string): boolean {
    if (email.length > 255) {
      return false;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  async function getData(FormData: FormData): Promise<void> {
    try {
      if (!emailValidation(FormData.get("email") as string))
        throw new Error("Wrong email format");

      if (FormData.get("confirm-password") !== FormData.get("password"))
        throw new Error("Wrong confirm password");

      const res = await signupUser({
        username: FormData.get("username") as string,
        password: FormData.get("password") as string,
        email: FormData.get("email") as string,
      });

      if (res) navigate({ to: "/dashboard", replace: true });
      else throw new Error("Cannot sign up");
    } catch (error) {
      alert(error);
    }
  }

  return (
    <form className="login-container" action={getData}>
      <h1>Signup</h1>
      <label>Email:</label>
      <Input
        type="text"
        name="email"
        value={saveEmail}
        allowClear
        required
        onChange={(e) => {
          setSaveEmail(e.target.value);
        }}
      />
      <label>Password:</label>
      <Input type="password" name="password" required allowClear />
      <label>Confirm Password:</label>
      <Input type="password" name="confirm-password" required allowClear />
      <label>Username:</label>
      <Input
        type="text"
        name="username"
        value={saveUsername}
        allowClear
        required
        onChange={(e) => {
          setSaveUsername(e.target.value);
        }}
      />
      <button>Signup</button>
      <p>
        Already have an account?{" "}
        <span onClick={() => navigate({to: "/login", replace: true})}>Login</span>
      </p>
    </form>
  );
}
