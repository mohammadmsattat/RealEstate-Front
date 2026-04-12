import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoginForm from "./common/login-form";
import Social from "./common/social";
import useDarkMode from "@/hooks/useDarkMode";
import { toast } from "react-toastify";

import LogoWhite from "@/assets/images/logo/logo-white.svg";
import Logo from "@/assets/images/logo/logo.svg";
import Illustration from "@/assets/images/auth/ils1.svg";
import { useLoginUserMutation } from "@/store/api/auth/authApiSlice";

const Login = () => {
  const [isDark] = useDarkMode();
  const navigate = useNavigate();

  const [loginUser, { isLoading }] = useLoginUserMutation();
  const [loginError, setLoginError] = useState("");

  // 🔵 state موجود في الأب
  const [form, setForm] = useState({
    username: "",
    password: "",
    remember: false,
  });

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLogin = async () => {
    try {
      setLoginError("");

      const result = await loginUser({
        email: form.username,
        password: form.password,
      }).unwrap();
      console.log(result);

      localStorage.setItem("token", result.token);
      localStorage.setItem("user", JSON.stringify(result.data));

      toast.success(result.message || "Login successful");

      navigate("/offers");
    } catch (err) {
      const message = err?.data?.message || "Login failed";
      setLoginError(message);
      toast.error(message);
    }
  };

  return (
    <div className="loginwrapper">
      <div className="lg-inner-column">
        {/* LEFT SIDE */}
        <div className="left-column relative z-1">
          <div className="max-w-[520px] pt-20 ltr:pl-20 rtl:pr-20">
            <Link to="/">
              <img src={isDark ? LogoWhite : Logo} alt="" className="mb-10" />
            </Link>

            <h4>
              Unlock your Project
              <span className="text-slate-800 dark:text-slate-400 font-bold">
                performance
              </span>
            </h4>
          </div>

          <div className="absolute left-0 2xl:bottom-[-160px] bottom-[-130px] h-full w-full z-[-1]">
            <img src={Illustration} className="h-full w-full object-contain" />
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="right-column relative">
          <div className="inner-content h-full flex flex-col bg-white dark:bg-slate-800">
            <div className="auth-box h-full flex flex-col justify-center">
              <div className="text-center 2xl:mb-10 mb-4">
                <h4 className="font-medium">Sign in</h4>
                <div className="text-slate-500 text-base">
                  Sign in to your account
                </div>
              </div>

              {/* 🔵 FORM */}
              <LoginForm
                form={form}
                onChange={handleChange}
                onSubmit={handleLogin}
                loading={isLoading}
              />

              {loginError && (
                <div className="text-danger-500 text-center mt-3">
                  {loginError}
                </div>
              )}

              <div className="max-w-[242px] mx-auto mt-8 w-full">
                <Social />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
