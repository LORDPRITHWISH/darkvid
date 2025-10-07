import { useForm } from "react-hook-form";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { useUserStore } from "../../store/userStore";

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

  const setUser = useUserStore((s) => s.setUser);
  const userId = useUserStore((s) => s.userId);

  useEffect(() => {
    if (userId) {
      navigate("/");
    }
  }, [userId, navigate]);

  const onSubmit = async (data: LoginFormInputs) => {
    setLoading(true);
    setApiError("");
    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/api/v1/users/login",
        {
          identity: data.identity,
          password: data.password,
        },
        {
          withCredentials: true,
        }
      );

      const res = response.data;
      console.log("Logged in user:", res);
      
      // useUserStore.getState().setUser(res.data._id, res.data.profilePhoto);

      setUser(res.data.user.username, res.data.user.profilepic);

      navigate("/"); // Redirect to home or dashboard after successful login

      // TODO: Save token (localStorage/cookie), redirect, etc.
    } catch (err: any) {
      if (err.response) {
        setApiError(err.response.data.message || "Login failed");
      } else {
        setApiError("Server not reachable");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-900">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-gray-800 p-8 rounded-xl w-full max-w-md shadow-lg">
        <h2 className="text-white text-2xl font-bold mb-6">Login</h2>

        {apiError && <p className="text-red-500 text-sm mb-4">{apiError}</p>}

        <div className="mb-4">
          <label className="block text-white mb-1">Email or Username</label>
          <input
            type="text" defaultValue="dead"
            {...register("identity", { required: "Email or Username is required" })}
            className="w-full px-3 py-2 rounded bg-gray-700 text-white focus:outline-none"
          />
          {errors.identity && <p className="text-red-500 text-sm mt-1">{errors.identity.message}</p>}
        </div>

        <div className="mb-6">
          <label className="block text-white mb-1">Password</label>
          <input type="password" defaultValue="LORD995X" {...register("password", { required: "Password is required" })} className="w-full px-3 py-2 rounded bg-gray-700 text-white focus:outline-none" />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
        </div>

        <button type="submit" className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded disabled:opacity-50" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
