import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoginForm from "./common/login-form";
import Social from "./common/social";
import useDarkMode from "@/hooks/useDarkMode";
import { toast } from "react-toastify";

// image import
import LogoWhite from "@/assets/images/logo/logo-white.svg";
import Logo from "@/assets/images/logo/logo.svg";
import Illustration from "@/assets/images/auth/ils1.svg";
import { useLoginUserMutation } from "@/store/api/auth/authApiSlice";

const Login = () => {
  const [isDark] = useDarkMode();
  const navigate = useNavigate();

  const [loginUser, { isLoading }] = useLoginUserMutation();
  const [loginError, setLoginError] = useState("");

  const handleLogin = async (data) => {
    try {
      setLoginError("");

      const result = await loginUser({
        username: data.username,
        password: data.password,
      }).unwrap();

      console.log("LOGIN RESULT", result);

      localStorage.setItem("token", result.token);

      localStorage.setItem("user", JSON.stringify(result.user));

      toast.success(result.message || "Login successful");

      console.log("before navigate");
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);

      const message = err?.data?.message || "Login failed";

      setLoginError(message);
      toast.error(message);
    }
  };

  return (
    <div className="loginwrapper">
      <div className="lg-inner-column">
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
            <img
              src={Illustration}
              alt=""
              className="h-full w-full object-contain"
            />
          </div>
        </div>

        <div className="right-column relative">
          <div className="inner-content h-full flex flex-col bg-white dark:bg-slate-800">
            <div className="auth-box h-full flex flex-col justify-center">
              <div className="mobile-logo text-center mb-6 lg:hidden block">
                <Link to="/">
                  <img
                    src={isDark ? LogoWhite : Logo}
                    alt=""
                    className="mx-auto"
                  />
                </Link>
              </div>

              <div className="text-center 2xl:mb-10 mb-4">
                <h4 className="font-medium">Sign in</h4>
                <div className="text-slate-500 text-base">
                  Sign in to your account to start using Dashcode++
                </div>
              </div>

              <LoginForm onSubmit={handleLogin} loading={isLoading} />

              {loginError && (
                <div className="text-danger-500 text-center mt-3">
                  {loginError}
                </div>
              )}

              <div className="relative border-b-[#9AA2AF]/15 border-b pt-6">
                <div className="absolute inline-block bg-white dark:bg-slate-800 dark:text-slate-400 left-1/2 top-1/2 transform -translate-x-1/2 px-4 min-w-max text-sm text-slate-500 font-normal">
                  Or continue with
                </div>
              </div>

              <div className="max-w-[242px] mx-auto mt-8 w-full">
                <Social />
              </div>

              <div className="md:max-w-[345px] mx-auto font-normal text-slate-500 dark:text-slate-400 mt-12 uppercase text-sm">
                Don’t have an account?{" "}
                <Link
                  to="/register"
                  className="text-slate-900 dark:text-white font-medium hover:underline"
                >
                  Sign up
                </Link>
              </div>
            </div>

            <div className="auth-footer text-center">
              Copyright 2021, Dashcode All Rights Reserved.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
