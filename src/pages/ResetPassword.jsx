import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from "../store/slices/authSlice";
import { LogIn, Lock, Loader2, CheckCircle, XCircle } from "lucide-react";

const ResetPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { isLoading } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetStatus, setResetStatus] = useState(null); // null, 'success', 'error'
  const [errorMessage, setErrorMessage] = useState("");

  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setResetStatus('error');
      setErrorMessage("Invalid reset link. No token provided.");
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords don't match");
      setResetStatus('error');
      return;
    }

    if (formData.password.length < 8) {
      setErrorMessage("Password must be at least 8 characters");
      setResetStatus('error');
      return;
    }

    try {
      const result = await dispatch(resetPassword({
        token,
        newPassword: formData.password,
      }));

      if (resetPassword.fulfilled.match(result)) {
        setResetStatus('success');
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        setResetStatus('error');
        setErrorMessage("Failed to reset password. The link may be expired.");
      }
    } catch (error) {
      setResetStatus('error');
      setErrorMessage("Failed to reset password. Please try again.");
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (resetStatus === 'error') {
      setResetStatus(null);
      setErrorMessage("");
    }
  };

  if (resetStatus === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-slate-950">
        <div className="relative w-full max-w-sm">
          <div className="rounded-2xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl p-8 text-center">
            <div className="mb-6">
              <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
              <h1 className="text-2xl font-semibold text-white mb-2">
                Password Reset Successful!
              </h1>
              <p className="text-white/60">
                Your password has been reset successfully. You can now login with your new password.
              </p>
            </div>
            <p className="text-sm text-white/50">
              Redirecting to login page in a few seconds...
            </p>
            <button
              onClick={() => navigate("/login")}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-500/20 transition hover:bg-primary-400"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-slate-950">
      <div className="relative w-full max-w-sm">
        <div className="rounded-2xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl">
          {/* Header */}
          <div className="px-6 pt-6 pb-4">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary-500/15 ring-1 ring-primary-500/20">
                <LogIn className="h-5 w-5 text-primary-200" />
              </div>
              <div className="leading-tight">
                <h1 className="text-lg font-semibold text-white">
                  Reset Password
                </h1>
                <p className="text-xs text-white/60">
                  Enter your new password
                </p>
              </div>
            </div>

            {resetStatus === 'error' && (
              <div className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
                {errorMessage}
              </div>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-3">
            {/* New Password */}
            <div>
              <label className="mb-1 block text-xs font-medium text-white/70">
                New Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-10 py-2.5 pr-20 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-primary-400/40 focus:ring-2 focus:ring-primary-500/20"
                  required
                  minLength="8"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs font-medium text-white/60 hover:text-white transition"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="mb-1 block text-xs font-medium text-white/70">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-10 py-2.5 pr-20 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-primary-400/40 focus:ring-2 focus:ring-primary-500/20"
                  required
                  minLength="8"
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((s) => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs font-medium text-white/60 hover:text-white transition"
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading || !formData.password || !formData.confirmPassword}
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-500/20 transition hover:bg-primary-400 disabled:opacity-50 disabled:hover:bg-primary-500"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Resetting...
                </>
              ) : (
                "Reset Password"
              )}
            </button>

            <div className="pt-1 text-center space-y-2">
              <p className="text-xs text-white/50">
                Remember your password?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="font-medium text-primary-200/90 hover:text-primary-200 transition"
                >
                  Back to login
                </button>
              </p>
              <div className="text-xs text-white/40 space-y-1">
                <p>Password requirements:</p>
                <ul className="list-disc list-inside text-left">
                  <li>At least 8 characters</li>
                  <li>Passwords must match</li>
                </ul>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
