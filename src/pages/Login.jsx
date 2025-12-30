import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { login, forgotPassword } from "../store/slices/authSlice";
import { LogIn, Mail, Lock, Loader2, ArrowLeft } from "lucide-react";

/* -------------------- Validation -------------------- */
const LoginSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
});

/* -------------------- Component -------------------- */
const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoading, error } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [isForgotPasswordLoading, setIsForgotPasswordLoading] = useState(false);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!forgotPasswordEmail.trim()) return;

    setIsForgotPasswordLoading(true);
    try {
      const result = await dispatch(forgotPassword(forgotPasswordEmail.trim()));
      if (forgotPassword.fulfilled.match(result)) {
        setShowForgotPassword(false);
        setForgotPasswordEmail("");
      }
    } finally {
      setIsForgotPasswordLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-slate-950">
      <div className="relative w-full max-w-sm">
        <div className="rounded-2xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl">
          {/* Header */}
          <div className="px-6 pt-8 pb-4 text-center">
            {/* Center Logo */}
            <div className="mx-auto mb-4 flex  items-center justify-center overflow-hidden">
              <img
                src="/logo.svg" // put in public/logo.svg
                alt="EWPM Logo"
                className="h-14 w-auto object-contain rounded-lg select-none"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>

            <h1 className="text-lg font-semibold text-white">
              Welcome to EWPM
            </h1>
            <p className="mt-1 text-xs text-white/60">
              Enterprise Workforce &amp; Project Management
            </p>

            {error && (
              <div className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
                {String(error)}
              </div>
            )}
          </div>

          {/* -------------------- Formik Form -------------------- */}
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={LoginSchema}
            onSubmit={async (values) => {
              const result = await dispatch(login(values));
              if (login.fulfilled.match(result)) {
                navigate("/dashboard");
              }
            }}
          >
            {({ errors, touched, isValid }) => {
              const canSubmit = isValid && !isLoading;

              return (
                <Form className="px-6 pb-6 space-y-3">
                  {/* Email */}
                  <div>
                    <label className="mb-1 block text-xs font-medium text-white/70">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                      <Field
                        name="email"
                        type="email"
                        placeholder="name@company.com"
                        autoComplete="email"
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-10 py-2.5 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-primary-400/40 focus:ring-2 focus:ring-primary-500/20"
                      />
                    </div>
                    {touched.email && errors.email && (
                      <p className="mt-1 text-xs text-rose-400">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Password */}
                  <div>
                    <label className="mb-1 block text-xs font-medium text-white/70">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                      <Field
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        autoComplete="current-password"
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-10 py-2.5 pr-20 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-primary-400/40 focus:ring-2 focus:ring-primary-500/20"
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword((s) => !s)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs font-medium text-white/60 hover:text-white transition"
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                    {touched.password && errors.password && (
                      <p className="mt-1 text-xs text-rose-400">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  {/* Forgot */}
                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-xs font-medium text-primary-200/90 hover:text-primary-200 transition"
                    >
                      Forgot password?
                    </button>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={!canSubmit}
                    className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-500/20 transition hover:bg-primary-400 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Logging in...
                      </>
                    ) : (
                      "Login"
                    )}
                  </button>

                  <p className="pt-1 text-center text-xs text-white/50">
                    Tip: Use a strong password and keep your account secure.
                  </p>
                </Form>
              );
            }}
          </Formik>
        </div>
      </div>

      {/* Forgot Password Modal (unchanged) */}
      {showForgotPassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowForgotPassword(false)}
          />
          <div className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl">
            {/* Header */}
            <div className="px-6 pt-6 pb-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowForgotPassword(false)}
                  className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 ring-1 ring-white/20 transition hover:bg-white/20"
                >
                  <ArrowLeft className="h-5 w-5 text-white" />
                </button>
                <div className="leading-tight">
                  <h1 className="text-lg font-semibold text-white">
                    Reset Password
                  </h1>
                  <p className="text-xs text-white/60">
                    Enter your email to receive reset instructions
                  </p>
                </div>
              </div>
            </div>

            <form
              onSubmit={handleForgotPassword}
              className="px-6 pb-6 space-y-4"
            >
              <div>
                <label className="mb-1 block text-xs font-medium text-white/70">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                  <input
                    type="email"
                    value={forgotPasswordEmail}
                    onChange={(e) => setForgotPasswordEmail(e.target.value)}
                    placeholder="name@company.com"
                    autoComplete="email"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-10 py-2.5 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-primary-400/40 focus:ring-2 focus:ring-primary-500/20"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={
                  isForgotPasswordLoading || !forgotPasswordEmail.trim()
                }
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-500/20 transition hover:bg-primary-400 disabled:opacity-50"
              >
                {isForgotPasswordLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
// import { useMemo, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { Formik, Form, Field } from "formik";
// import * as Yup from "yup";
// import { login, forgotPassword } from "../store/slices/authSlice";
// import { LogIn, Mail, Lock, Loader2, ArrowLeft } from "lucide-react";

// /* -------------------- Validation -------------------- */
// const LoginSchema = Yup.object({
//   email: Yup.string()
//     .email("Invalid email address")
//     .required("Email is required"),
//   password: Yup.string().required("Password is required"),
// });

// /* -------------------- Component -------------------- */
// const Login = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const { isLoading, error } = useSelector((state) => state.auth);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showForgotPassword, setShowForgotPassword] = useState(false);
//   const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
//   const [isForgotPasswordLoading, setIsForgotPasswordLoading] = useState(false);

//   const handleForgotPassword = async (e) => {
//     e.preventDefault();

//     if (!forgotPasswordEmail.trim()) {
//       return;
//     }

//     setIsForgotPasswordLoading(true);
//     try {
//       const result = await dispatch(forgotPassword(forgotPasswordEmail.trim()));
//       if (forgotPassword.fulfilled.match(result)) {
//         setShowForgotPassword(false);
//         setForgotPasswordEmail("");
//       }
//       // Error is handled by the Redux action
//     } finally {
//       setIsForgotPasswordLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-slate-950">
//       <div className="relative w-full max-w-sm">
//         <div className="rounded-2xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl">
//           {/* Header */}
//           <div className="px-6 pt-6 pb-4">
//             <div className="flex items-center gap-3">
//               <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary-500/15 ring-1 ring-primary-500/20">
//                 <LogIn className="h-5 w-5 text-primary-200" />
//               </div>
//               <div className="leading-tight">
//                 <h1 className="text-lg font-semibold text-white">
//                   Welcome to EWPM
//                 </h1>
//                 <p className="text-xs text-white/60">
//                   Enterprise Workforce &amp; Project Management
//                 </p>
//               </div>
//             </div>

//             {error && (
//               <div className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
//                 {String(error)}
//               </div>
//             )}
//           </div>

//           {/* -------------------- Formik Form -------------------- */}
//           <Formik
//             initialValues={{ email: "", password: "" }}
//             validationSchema={LoginSchema}
//             onSubmit={async (values) => {
//               const result = await dispatch(login(values));
//               if (login.fulfilled.match(result)) {
//                 navigate("/dashboard");
//               }
//             }}
//           >
//             {({ errors, touched, isValid }) => {
//               const canSubmit = isValid && !isLoading;

//               return (
//                 <Form className="px-6 pb-6 space-y-3">
//                   {/* Email */}
//                   <div>
//                     <label className="mb-1 block text-xs font-medium text-white/70">
//                       Email
//                     </label>
//                     <div className="relative">
//                       <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
//                       <Field
//                         name="email"
//                         type="email"
//                         placeholder="name@company.com"
//                         autoComplete="email"
//                         className="w-full rounded-xl border border-white/10 bg-white/5 px-10 py-2.5 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-primary-400/40 focus:ring-2 focus:ring-primary-500/20"
//                       />
//                     </div>
//                     {touched.email && errors.email && (
//                       <p className="mt-1 text-xs text-rose-400">
//                         {errors.email}
//                       </p>
//                     )}
//                   </div>

//                   {/* Password */}
//                   <div>
//                     <label className="mb-1 block text-xs font-medium text-white/70">
//                       Password
//                     </label>
//                     <div className="relative">
//                       <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
//                       <Field
//                         name="password"
//                         type={showPassword ? "text" : "password"}
//                         placeholder="••••••••"
//                         autoComplete="current-password"
//                         className="w-full rounded-xl border border-white/10 bg-white/5 px-10 py-2.5 pr-20 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-primary-400/40 focus:ring-2 focus:ring-primary-500/20"
//                       />

//                       <button
//                         type="button"
//                         onClick={() => setShowPassword((s) => !s)}
//                         className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs font-medium text-white/60 hover:text-white transition"
//                       >
//                         {showPassword ? "Hide" : "Show"}
//                       </button>
//                     </div>
//                     {touched.password && errors.password && (
//                       <p className="mt-1 text-xs text-rose-400">
//                         {errors.password}
//                       </p>
//                     )}
//                   </div>

//                   {/* Actions */}
//                   <div className="flex items-center justify-between pt-1">
//                     <button
//                       type="button"
//                       onClick={() => setShowForgotPassword(true)}
//                       className="text-xs font-medium text-primary-200/90 hover:text-primary-200 transition"
//                     >
//                       Forgot password?
//                     </button>
//                   </div>

//                   {/* Submit */}
//                   <button
//                     type="submit"
//                     disabled={!canSubmit}
//                     className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-500/20 transition hover:bg-primary-400 disabled:opacity-50 disabled:hover:bg-primary-500"
//                   >
//                     {isLoading ? (
//                       <>
//                         <Loader2 className="h-4 w-4 animate-spin" />
//                         Logging in...
//                       </>
//                     ) : (
//                       "Login"
//                     )}
//                   </button>

//                   <p className="pt-1 text-center text-xs text-white/50">
//                     Tip: Use a strong password and keep your account secure.
//                   </p>
//                 </Form>
//               );
//             }}
//           </Formik>
//         </div>
//       </div>

//       {/* Forgot Password Modal */}
//       {showForgotPassword && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//           <div
//             className="absolute inset-0 bg-black/60 backdrop-blur-sm"
//             onClick={() => setShowForgotPassword(false)}
//           />
//           <div className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl">
//             {/* Header */}
//             <div className="px-6 pt-6 pb-4">
//               <div className="flex items-center gap-3">
//                 <button
//                   onClick={() => setShowForgotPassword(false)}
//                   className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 ring-1 ring-white/20 transition hover:bg-white/20"
//                 >
//                   <ArrowLeft className="h-5 w-5 text-white" />
//                 </button>
//                 <div className="leading-tight">
//                   <h1 className="text-lg font-semibold text-white">
//                     Reset Password
//                   </h1>
//                   <p className="text-xs text-white/60">
//                     Enter your email to receive reset instructions
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Form */}
//             <form
//               onSubmit={handleForgotPassword}
//               className="px-6 pb-6 space-y-4"
//             >
//               <div>
//                 <label className="mb-1 block text-xs font-medium text-white/70">
//                   Email Address
//                 </label>
//                 <div className="relative">
//                   <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
//                   <input
//                     type="email"
//                     value={forgotPasswordEmail}
//                     onChange={(e) => setForgotPasswordEmail(e.target.value)}
//                     placeholder="name@company.com"
//                     autoComplete="email"
//                     className="w-full rounded-xl border border-white/10 bg-white/5 px-10 py-2.5 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-primary-400/40 focus:ring-2 focus:ring-primary-500/20"
//                     required
//                   />
//                 </div>
//               </div>

//               <button
//                 type="submit"
//                 disabled={
//                   isForgotPasswordLoading || !forgotPasswordEmail.trim()
//                 }
//                 className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-500/20 transition hover:bg-primary-400 disabled:opacity-50 disabled:hover:bg-primary-500"
//               >
//                 {isForgotPasswordLoading ? (
//                   <>
//                     <Loader2 className="h-4 w-4 animate-spin" />
//                     Sending...
//                   </>
//                 ) : (
//                   "Send Reset Link"
//                 )}
//               </button>

//               <p className="pt-1 text-center text-xs text-white/50">
//                 Remember your password?{" "}
//                 <button
//                   type="button"
//                   onClick={() => setShowForgotPassword(false)}
//                   className="font-medium text-primary-200/90 hover:text-primary-200 transition"
//                 >
//                   Back to login
//                 </button>
//               </p>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Login;
