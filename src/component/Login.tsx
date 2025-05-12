import { useState } from "react";
import { loginUser, signupUser } from "../script/checkToken.js";
import { Input } from "antd";
import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";

export default function Login() {
  const navigate = useNavigate();
  const [saveEmail, setSaveEmail] = useState<string>(
    () => localStorage.getItem("save_email") || ""
  );

  useEffect(() => {
    if (saveEmail != localStorage.getItem("save_email")) {
      localStorage.setItem("save_email", saveEmail);
    }
  }, [saveEmail]);

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
      const res = await loginUser({
        email: FormData.get("email") as string,
        password: FormData.get("password") as string,
      });

      if (res) {
        navigate({ to: "/dashboard", replace: true });
      }
    } catch (error) {
      alert(error);
    }
  }

  return (
    <form className="login-container" action={getData}>
      <h1>Login</h1>
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
      <button type="submit">Login</button>
      <p>
        Don't have an account?{" "}
        <span onClick={() => navigate({ to: "/signup", replace: true })}>
          Signup
        </span>
      </p>
    </form>
  );
}
