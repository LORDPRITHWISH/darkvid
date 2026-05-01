import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { useUserStore } from "../../store/userStore";
import { Button } from "@/components/ui/button";

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { User, Lock } from "lucide-react";
import { loginUser } from "@/services/auth.service";

type LoginFormInputs = {
  identity: string;
  password: string;
};

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const navigate = useNavigate();

  const { userId, setUser } = useUserStore((s) => s);

  useEffect(() => {
    if (userId) {
      navigate("/");
    }
  }, [userId, navigate]);

  const onSubmit = async (data: LoginFormInputs) => {
    setLoading(true);
    setApiError("");
    try {
      const response = await loginUser(data);

      // console.log("The Responce",response)

      if (!response || !response.data || !response.data.user) {
        setApiError("Invalid response from server");
        return;
      }

      const res = response.data;
      console.log("The User:", res.user);

      // useUserStore.getState().setUser(res.data._id, res.data.profilePhoto);

      try {
        setUser(res.user._id, res.user.name, res.user.profilepic, res.user.email);
        navigate("/"); // Redirect to home or dashboard after successful login
      } catch (e) {
        console.error("Error setting user in store:", e);
      }

      // TODO: Save token (localStorage/cookie), redirect, etc.
    } catch (err) {
      console.error("From Catch", err);

      const error = err as { response?: { data?: { message?: string } } };
      if (error.response) {
        setApiError(error.response.data?.message || "Login failed");
      } else {
        setApiError("Server not reachable");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-lg">
        <Card className="bg-slate-950/80 border-slate-800 shadow-xl">
          <CardHeader className="text-center">
            <img src="/darkvid_logo.png" alt="DarkVid Logo" className="w-56 mx-auto mb-4" />

            <h2 className="text-slate-300/80 text-xl font-bold">Welcome Back to</h2>

            <CardTitle className="text-5xl font-bold text-white">
              <span className="text-blue-100">DarK</span>
              <span className="text-blue-500">Vid</span>
            </CardTitle>

            {/* <p className="text-white text-xl font-semibold mt-4">Login</p> */}
          </CardHeader>

          <CardContent>
            {apiError && <p className="text-red-500 text-sm mb-4 text-center">{apiError}</p>}

            {/* Identity */}
            <div className="mb-4">
              <Label htmlFor="identity" className="mb-2">
                Email or Username
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="identity"
                  type="text"
                  placeholder="Enter email or username"
                  autoComplete="username"
                  defaultValue={import.meta.env.VITE_MODE === "development" ? "darkone" : ""}
                  {...register("identity", {
                    required: "Email or Username is required",
                  })}
                  className="pl-9"
                />
              </div>
              {errors.identity && <p className="text-red-500 text-sm mt-1">{errors.identity.message}</p>}
            </div>

            {/* Password */}
            <div className="mb-6">
              <Label htmlFor="password" className="mb-2">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  defaultValue={import.meta.env.VITE_MODE === "development" ? "DARKLORD" : ""}
                  {...register("password", {
                    required: "Password is required",
                  })}
                  className="pl-9"
                />
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-2">
            <Button type="submit" disabled={loading} className="w-full cursor-pointer">
              {loading ? "Logging in..." : "Login"}
            </Button>

            <div className="relative w-full my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-700" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className=" px-4 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full bg-white cursor-pointer hover:bg-slate-200 mb-2"
              onClick={() => {
                window.location.href = `${import.meta.env.VITE_API_URL}/api/v1/auth/google`;
              }}>
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5 mr-2" alt="Google" />
              Sign in with Google
            </Button>

            <Button type="button" variant="ghost" className="w-full cursor-pointer" onClick={() => navigate("/signup")}>
              Create New Account?
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
