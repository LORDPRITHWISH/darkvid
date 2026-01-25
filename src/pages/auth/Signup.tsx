import { useForm } from "react-hook-form";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";

import { Button } from "@/components/ui/button";
import { useUserStore } from "../../store/userStore";
import ImageDropzone from "@/components/ImageDropzone";
import { FaUserSecret } from "react-icons/fa6";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { User, Mail, Lock, IdCard } from "lucide-react";
import DarkIcon from "@/components/DarkIcon";
import { Eye, EyeOff, Check, X, Loader2 } from "lucide-react";
import debounce from "lodash/debounce";
import { availUsername, loginUser, registerUser } from "@/services/auth.service";
// import { Check, X,  } from "lucide-react";

type SignupFormInputs = {
  fullname: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  profilepic: FileList;
  coverimage: FileList;
};

export default function SignupForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormInputs>();

  const password = watch("password", "");
  const confirmPassword = watch("confirmPassword", "");

  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const [profilePic, setProfilePic] = useState<File | null>(null);
  // const [coverImage, setCoverImage] = useState<File | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const navigate = useNavigate();
  const setUser = useUserStore((s) => s.setUser);

  const getPasswordStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    return score; // 0–4
  };

  const strength = getPasswordStrength(password);

  const strengthLabel = ["Very Weak", "Weak", "Okay", "Strong", "Very Strong"][strength];

  const strengthColor = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-500", "bg-emerald-500"][strength];

  const onSubmit = async (data: SignupFormInputs) => {
    if (usernameStatus === "taken") {
      setApiError("Please choose a different username");
      return;
    }

    setLoading(true);
    setApiError("");

    // console.log("The profile Pic",profilePic)

    if (!profilePic) {
      setApiError("Please upload a profile picture");
      setLoading(false);
      return;
    }

    try {
      const response = await registerUser({
        fullname: data.fullname,
        email: data.email,
        username: data.username,
        password: data.password,
        profilePic: profilePic ?? undefined,
      });

      console.log("Responce", response);

      if (!response || !response.data) {
        setApiError("Invalid response from server");
        return;
      }

      const resusername = response.data.username;

      try {
        const loginResponse = await loginUser({ identity: resusername, password: data.password });

        if (!loginResponse || !loginResponse.data || !loginResponse.data.user) {
          setApiError("Invalid response from server during login");
          return;
        }

        setUser(loginResponse.data.user._id, loginResponse.data.user.name, loginResponse.data.user.profilepic, loginResponse.data.user.email);
        navigate("/"); // Redirect to home or dashboard after successful signup
      } catch (e) {
        console.error("Error setting user in store:", e);
      }

      // setUser(res.data.user._id, res.data.user.name, res.data.user.profilepic, res.data.user.email);

      // navigate("/");
    } catch (err: any) {
      if (err.response) {
        setApiError(err.response.data.message || "Signup failed");
      } else {
        setApiError("Server not reachable");
      }
    } finally {
      setLoading(false);
    }
  };

  const [usernameStatus, setUsernameStatus] = useState<"idle" | "checking" | "available" | "taken" | "small" | "error">("idle");

  // const usernameValue = watch("username", "");

  const debouncedCheckUsername = useRef(
    debounce(async (username: string) => {
      if (!username || username.length < 3) {
        setUsernameStatus("small");
        return;
      }

      setUsernameStatus("checking");

      try {
        const res = await availUsername(username);

        console.log("The responce", res);

        if (!res || !res.data) {
          setUsernameStatus("error");
          return;
        }

        setUsernameStatus(res.data.available ? "available" : "taken");
      } catch {
        setUsernameStatus("error");
      }
    }, 600),
  ).current;

  useEffect(() => {
    return () => {
      debouncedCheckUsername.cancel();
    };
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-4xl">
        <Card className="bg-slate-950/80 border-slate-800 shadow-xl">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2 text-2xl">
              <DarkIcon />
              Create Account
            </CardTitle>
          </CardHeader>

          <CardContent>
            {apiError && <p className="text-red-500 text-sm mb-4">{apiError}</p>}

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {/* Profile Picture */}
              <div className="md:col-span-2">
                {/* <Label className="text-white mb-2 block">Profile Picture</Label> */}
                <ImageDropzone aspect={1} onFileSelect={setProfilePic}>
                  <div className="text-center text-muted-foreground aspect-square flex flex-col justify-center">
                    <FaUserSecret className="mx-auto text-7xl" />
                    <span className="mt-2 text-sm">Upload profile picture</span>
                  </div>
                </ImageDropzone>
              </div>

              {/* Identity + Credentials */}
              <div className="md:col-span-3 my-auto space-y-6">
                {/* Username */}
                <div>
                  <Label htmlFor="username" className="mb-2">
                    Username
                  </Label>

                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

                    <Input
                      id="username"
                      {...register("username", {
                        required: "Username required",
                        minLength: {
                          value: 3,
                          message: "Username must be at least 3 characters",
                        },
                        onChange: (e) => debouncedCheckUsername(e.target.value),
                      })}
                      placeholder="Choose a unique username"
                      autoComplete="username"
                      className="pl-9 pr-10"
                    />

                    {/* Status icon */}
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {usernameStatus === "checking" && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                      {usernameStatus === "available" && <Check className="h-4 w-4 text-green-500" />}
                      {usernameStatus === "taken" && <X className="h-4 w-4 text-red-500" />}
                      {usernameStatus === "small" && <X className="h-4 w-4 text-yellow-500" />}
                      {usernameStatus === "error" && <X className="h-4 w-4 text-red-500" />}
                    </div>
                  </div>

                  {usernameStatus === "taken" && <p className="text-red-500 text-sm mt-1">Username is already taken</p>}

                  {usernameStatus === "available" && <p className="text-green-500 text-sm mt-1">Username is available</p>}

                  {usernameStatus === "small" && <p className="text-yellow-500 text-sm mt-1">Username must be at least 3 characters</p>}

                  {usernameStatus === "error" && <p className="text-red-500 text-sm mt-1">Error checking username</p>}

                  {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>}
                </div>

                {/* Name + Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullname" className="mb-2">
                      Full Name
                    </Label>
                    <div className="relative">
                      <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="fullname" {...register("fullname", { required: "Full name required" })} placeholder="Your full name" autoComplete="name" className="pl-9" />
                    </div>
                    {errors.fullname && <p className="text-red-500 text-sm mt-1">{errors.fullname.message}</p>}
                  </div>

                  <div>
                    <Label htmlFor="email" className="mb-2">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="email" type="email" {...register("email", { required: "Email required" })} placeholder="you@example.com" autoComplete="email" className="pl-9" />
                    </div>
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                  </div>
                </div>

                {/* Password */}
                <div className="w-3/4">
                  <Label htmlFor="password" className="mb-2">
                    Password
                  </Label>

                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      {...register("password", {
                        required: "Password is required",
                        minLength: {
                          value: 8,
                          message: "Password must be at least 8 characters",
                        },
                      })}
                      placeholder="Create a strong password"
                      autoComplete="new-password"
                      className="pl-9 pr-10"
                    />

                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>

                  {/* Strength meter */}
                  {password && (
                    <div className="mt-2">
                      <div className="h-2 w-full bg-slate-800 rounded">
                        <div className={`h-1 rounded transition-all ${strengthColor}`} style={{ width: `${(strength / 4) * 100}%` }} />
                      </div>
                      <p className="text-xs mt-0.5 text-muted-foreground">
                        Strength: <span className="font-semibold">{strengthLabel}</span>
                      </p>
                    </div>
                  )}

                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                </div>

                {/* Confirm Password */}
                <div className="w-3/4">
                  <Label htmlFor="confirmPassword" className="mb-2">
                    Confirm Password
                  </Label>

                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

                    <Input
                      id="confirmPassword"
                      type={showConfirm ? "text" : "password"}
                      {...register("confirmPassword", {
                        required: "Please confirm your password",
                        validate: (value) => value === password || "Passwords do not match",
                      })}
                      placeholder="Re-enter your password"
                      autoComplete="new-password"
                      className="pl-9 pr-10"
                    />

                    {/* Match indicator */}
                    {confirmPassword && (
                      <span className="absolute right-10 top-1/2 -translate-y-1/2">
                        {confirmPassword === password ? <Check className="text-green-500" size={16} /> : <X className="text-red-500" size={16} />}
                      </span>
                    )}

                    {/* Eye toggle */}
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {!errors.confirmPassword && confirmPassword && (
                    <p className={`${password === confirmPassword ? "text-green-500" : "text-red-500"} text-sm mt-1`}>
                      {password === confirmPassword ? "Passwords match" : "Passwords do not match"}
                    </p>
                  )}
                  {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-2">
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Creating account..." : "Sign Up"}
            </Button>

            <Button type="button" variant="ghost" className="w-full" onClick={() => navigate("/login")}>
              Already have an account?
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
