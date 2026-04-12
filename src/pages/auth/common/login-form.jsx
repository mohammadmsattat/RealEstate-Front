import React from "react";
import Textinput from "@/components/ui/Textinput";
import Checkbox from "@/components/ui/Checkbox";
import Button from "@/components/ui/Button";
import { Link } from "react-router-dom";

const LoginForm = ({ form, onChange, onSubmit, loading }) => {
  return (
    <div className="space-y-4">

      {/* Username */}
      <Textinput
        label="Username"
        type="text"
        value={form.username}
        onChange={(e) => onChange("username", e.target.value)}
        className="h-[48px]"
      />

      {/* Password */}
      <Textinput
        label="Password"
        type="password"
        value={form.password}
        onChange={(e) => onChange("password", e.target.value)}
        className="h-[48px]"
      />

      {/* Remember */}
      <div className="flex justify-between">
        <Checkbox
          value={form.remember}
          onChange={() => onChange("remember", !form.remember)}
          label="Keep me signed in"
        />

        <Link
          to="/forgot-password"
          className="text-sm text-slate-800 dark:text-slate-400"
        >
          Forgot Password?
        </Link>
      </div>

      {/* Submit */}
      <Button
        text="Sign in"
        className="btn btn-dark w-full"
        isLoading={loading}
        onClick={onSubmit}
      />
    </div>
  );
};

export default LoginForm;