// import React, { useRef, useState } from "react";

// // Images
// import Logi from "../../../Assets/img/Login/Frame 1261158478.png";
// import Arro from "../../../Assets/img/Login/Vector (1).svg";

// // Common

// // Third party libraries
// import { Link, NavLink } from "react-router-dom";
// import { useForm } from "react-hook-form";
// import { useNavigate } from "react-router-dom";
// import { Bounce, toast } from "react-toastify";
// import { postData } from "../../../../services/apiService";
// import { BsArrowLeft } from "react-icons/bs";

// const Forgot = () => {
//   const navigate = useNavigate();
//   const inputRefs = useRef([]);

//   const {
//     register,
//     watch,
//     handleSubmit,
//     setValue,
//     clearErrors,
//     formState: { errors },
//   } = useForm();

//   const [isOtpSent, setIsOtpSent] = useState(false);
//   const [isOtpVerified, setIsOtpVerified] = useState(false);
//   const [storedEmail, setStoredEmail] = useState("");

//   // 🔹 Send OTP on Email blur
//   const handleEmailVerify = async (email) => {
//     const payload = {
//       email: email?.email,
//     };
//     console.log("payload:email========= ", payload);
//     try {
//       const response = await postData("forgotPassword", payload);
//       toast.success(response.message || "OTP sent successfully!", {
//         position: "top-right",
//         autoClose: 3000,
//         theme: "light",
//         transition: Bounce,
//       });
//       setStoredEmail(email);
//       setIsOtpSent(true);
//     } catch (error) {
//       toast.error(error.message || "Failed to send OTP!", {
//         position: "top-right",
//         autoClose: 3000,
//         theme: "dark",
//         transition: Bounce,
//       });
//       setIsOtpSent(false);
//     }
//   };

//   // 🔹 Form Submit handler (OTP Verify or Set New Password)
//   // const onSubmit = async (data) => {
//   //   // const payload = {
//   //   //   otp: data.otp,
//   //   // };
//   //   const otp = `${data.otp1}${data.otp2}${data.otp3}${data.otp4}${data.otp5}${data.otp6}`;
//   //   try {
//   //     if (!isOtpVerified) {
//   //       // 🔐 OTP verification step
//   //       const payload = { otp };
//   //       const verifyRes = await postData("verifyOtp", payload);

//   //       toast.success(verifyRes.message || "OTP verified!", {
//   //         position: "top-right",
//   //         autoClose: 3000,
//   //         theme: "light",
//   //         transition: Bounce,
//   //       });
//   //       setIsOtpVerified(true);
//   //     } else {
//   //       // 🔐 Password reset step
//   //       const payload = {
//   //         otp,
//   //         newPassword: data.newPassword,
//   //       };
//   //       const resetRes = await postData("resetPassword", payload);

//   //       toast.success(resetRes.message || "Password updated!", {
//   //         position: "top-right",
//   //         autoClose: 3000,
//   //         theme: "light",
//   //         transition: Bounce,
//   //       });

//   //       setTimeout(() => navigate("/login"), 1000);
//   //     }
//   //   } catch (error) {
//   //     toast.error(error.message || "Something went wrong!", {
//   //       position: "top-right",
//   //       autoClose: 3000,
//   //       theme: "light",
//   //       transition: Bounce,
//   //     });
//   //   }
//   // };

//   const onSubmit = async (data) => {
//     const otp = `${data.otp1}${data.otp2}${data.otp3}${data.otp4}${data.otp5}${data.otp6}`;

//     if (!otp || otp.length !== 6) {
//       toast.error("OTP must be 6 digits.");
//       return;
//     }

//     try {
//       if (!isOtpVerified) {
//         const payload = { otp };
//         const verifyRes = await postData("verifyOtp", payload);

//         toast.success(verifyRes.message || "OTP verified!", {
//           position: "top-right",
//           autoClose: 3000,
//           theme: "light",
//           transition: Bounce,
//         });
//         setIsOtpVerified(true);
//       } else {
//         const payload = {
//           otp,
//           newPassword: data.newPassword,
//         };
//         const resetRes = await postData("resetPassword", payload);

//         toast.success(resetRes.message || "Password updated!", {
//           position: "top-right",
//           autoClose: 3000,
//           theme: "light",
//           transition: Bounce,
//         });

//         setTimeout(() => navigate("/login"), 1000);
//       }
//     } catch (error) {
//       toast.error(error.message || "Something went wrong!", {
//         position: "top-right",
//         autoClose: 3000,
//         theme: "light",
//         transition: Bounce,
//       });
//     }
//   };

//   const handleInput = (e, index) => {
//     const val = e.target.value;

//     if (/^\d$/.test(val)) {
//       setValue(`code${index + 1}`, val, {
//         shouldValidate: true,
//         shouldDirty: true,
//       });
//       clearErrors(`code${index + 1}`);
//       if (index < 5) {
//         inputRefs.current[index + 1]?.focus();
//       }
//     } else if (val === "") {
//       setValue(`code${index + 1}`, "");
//     } else {
//       e.target.value = "";
//     }
//   };

//   const handleKeyDown = (e, index) => {
//     if (e.key === "Backspace" && !e.target.value && index > 0) {
//       inputRefs.current[index - 1]?.focus();
//     }
//   };

//   return (
//     <>
//       <section className="background-color-light-grayish-yellow d-flex justify-content-center align-items-center min-vh-100">
//         <div className="container py-2">
//           <div className="login-modal-shadow rounded position-relative">
//             <div className="position-absolute top-0 end-0">
//               <img src={Arro} alt="Loading" className="img-fluid" />
//             </div>
//             <div className="row">
//               <div className="col-lg-5 col-sm-12 d-flex">
//                 <img src={Logi} alt="Loading" className="img-fluid" />
//               </div>
//               <div className="col-lg-6 col-sm-12 px-5 pb-5">
//                 <div className="text-start josefin-sans-font-family-600 font-size-30 py-3 heading-text text-color-dark-grayish-blue pt-4">
//                   Forgot Password?
//                 </div>
//                 <p className="inter-font-family-400 font-size-16 text-color-dark-grayish-blue">
//                   No Worries, We help you set a new password <br />
//                   Enter your registered E-mail ID/ Mobile no and we will <br />{" "}
//                   send you a verification code
//                 </p>
//                 <form onSubmit={handleSubmit(onSubmit)}>
//                   <span className="form-resignation">
//                     <div className="row gap-2">
//                       <div className="pt-3 col-lg-8 col-sm-12">
//                         <label className="inter-font-family-400 font-size-14 login-text py-2 d-block">
//                           E-mail
//                         </label>
//                         <input
//                           type="email"
//                           {...register("email", {
//                             required: "Email is required",
//                             pattern: {
//                               value: /^\S+@\S+$/i,
//                               message: "Enter a valid email",
//                             },
//                           })}
//                           className="input-style"
//                           onChange={(e) => {
//                             const value = e.target.value;
//                             setValue("email", value);
//                             if (/^\S+@\S+\.\S+$/.test(value)) {
//                               handleEmailVerify({ email: value });
//                             }
//                           }}
//                         />
//                         {errors.email && (
//                           <p className="text-danger">{errors.email.message}</p>
//                         )}
//                       </div>

//                       {!isOtpVerified && (
//                         <>
//                           {/* OTP Inputs */}
//                           <div className="py-2 col-lg-8 col-sm-12">
//                             <label className="inter-font-family-400 font-size-14 login-text py-2 d-block">
//                               Verification Code
//                             </label>
//                             <div className="d-flex justify-content-between">
//                               {Array(6)
//                                 .fill(0)
//                                 .map((_, i) => (
//                                   <input
//                                     key={i}
//                                     type="text"
//                                     maxLength="1"
//                                     className="otp-input"
//                                     {...register(`otp${i + 1}`, {
//                                       required: true,
//                                     })}
//                                     ref={(el) => (inputRefs.current[i] = el)}
//                                     onChange={(e) => handleInput(e, i)}
//                                     onKeyDown={(e) => handleKeyDown(e, i)}
//                                   />
//                                 ))}
//                             </div>
//                             {errors.otp && (
//                               <p className="text-danger">
//                                 OTP must be 6 digits
//                               </p>
//                             )}
//                           </div>
//                         </>
//                       )}

//                       {isOtpVerified && (
//                         <>
//                           <div className="pt-3 col-lg-8">
//                             <label className="inter-font-family-400 font-size-14 login-text py-2 d-block">
//                               New Password
//                             </label>
//                             <input
//                               type="password"
//                               {...register("newPassword", {
//                                 required: "Enter new password",
//                                 minLength: {
//                                   value: 6,
//                                   message: "Min 6 characters required",
//                                 },
//                               })}
//                               className="input-style"
//                             />
//                             {errors.password && (
//                               <p className="text-danger">
//                                 {errors.password.message}
//                               </p>
//                             )}
//                           </div>

//                           <div className="pt-3 col-lg-8">
//                             <label className="inter-font-family-400 font-size-14 login-text py-2 d-block">
//                               Confirm Password
//                             </label>
//                             <input
//                               type="password"
//                               {...register("confirmPassword", {
//                                 required: "Confirm password",
//                                 validate: (value) =>
//                                   value === watch("newPassword") ||
//                                   "Passwords do not match",
//                               })}
//                               className="input-style"
//                               // placeholder="Confirm Password"
//                             />
//                             <p className="text-danger">
//                               {errors.confirmPassword?.message}
//                             </p>
//                           </div>
//                         </>
//                       )}
//                       <div className="py-3 col-lg-8">
//                         <button
//                           type="submit"
//                           className="background-color-terracotta text-color-white py-2 inter-font-family-500 font-size-16 rounded border-0"
//                         >
//                           {isOtpVerified ? "Set New Password" : "Verify OTP"}
//                         </button>
//                       </div>
//                     </div>
//                   </span>
//                 </form>

//                 <div className="mt-3 col-lg-8">
//                   <NavLink
//                     to="/login"
//                     className="text-decoration-none text-dark d-flex align-items-center"
//                   >
//                     <BsArrowLeft className="me-2" />
//                     Back to Login
//                   </NavLink>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//     </>
//   );
// };

// export default Forgot;




import React, { useRef, useState } from "react";

// Images
import Logi from "../../../Assets/img/Login/Frame 1261158478.png";
import Arro from "../../../Assets/img/Login/Vector (1).svg";

// Third party libraries
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Bounce, toast } from "react-toastify";
import { postData } from "../../../../services/apiService";
import { BsArrowLeft } from "react-icons/bs";

const Forgot = () => {
  const navigate = useNavigate();
  const inputRefs = useRef([]);

  const {
    register,
    watch,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm();

  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [storedEmail, setStoredEmail] = useState("");

  // 🔹 Send OTP on Email blur
  const handleEmailVerify = async (email) => {
    const payload = {
      email: email?.email,
    };
    try {
      const response = await postData("forgotPassword", payload);
      toast.success(response.message || "OTP sent successfully!", {
        position: "top-right",
        autoClose: 3000,
        theme: "light",
        transition: Bounce,
      });
      setStoredEmail(email);
      setIsOtpSent(true);
    } catch (error) {
      toast.error(error.message || "Failed to send OTP!", {
        position: "top-right",
        autoClose: 3000,
        theme: "dark",
        transition: Bounce,
      });
      setIsOtpSent(false);
    }
  };

  // 🔹 Form Submit handler
  const onSubmit = async (data) => {
    const otp = `${data.otp1}${data.otp2}${data.otp3}${data.otp4}${data.otp5}${data.otp6}`;

    if (!otp || otp.length !== 6) {
      toast.error("OTP must be 6 digits.");
      return;
    }

    try {
      if (!isOtpVerified) {
        const payload = { otp };
        const verifyRes = await postData("verifyOtp", payload);

        toast.success(verifyRes.message || "OTP verified!", {
          position: "top-right",
          autoClose: 3000,
          theme: "light",
          transition: Bounce,
        });
        setIsOtpVerified(true);
      } else {
        const payload = {
          otp,
          newPassword: data.newPassword,
        };
        const resetRes = await postData("resetPassword", payload);

        toast.success(resetRes.message || "Password updated!", {
          position: "top-right",
          autoClose: 3000,
          theme: "light",
          transition: Bounce,
        });

        setTimeout(() => navigate("/login"), 1000);
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong!", {
        position: "top-right",
        autoClose: 3000,
        theme: "light",
        transition: Bounce,
      });
    }
  };

  const handleInput = (e, index) => {
    const val = e.target.value;

    if (/^\d$/.test(val)) {
      setValue(`otp${index + 1}`, val, {
        shouldValidate: true,
        shouldDirty: true,
      });
      clearErrors(`otp${index + 1}`);
      if (index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    } else if (val === "") {
      setValue(`otp${index + 1}`, "");
    } else {
      e.target.value = "";
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <section className="background-color-light-grayish-yellow d-flex justify-content-center align-items-center min-vh-100">
      <div className="container py-2">
        <div className="login-modal-shadow rounded position-relative">
          <div className="position-absolute top-0 end-0">
            <img src={Arro} alt="Back" className="img-fluid" />
          </div>
          <div className="row">
            <div className="col-lg-6 col-sm-12 d-flex">
              <img src={Logi} alt="Visual" className="img-fluid" />
            </div>
            <div className="col-lg-6 col-sm-12 px-5 pb-2">
              <div className="text-start josefin-sans-font-family-600 font-size-30  heading-text text-color-dark-grayish-blue pt-4">
                Forgot Password?
              </div>
              <p className="mb-0 inter-font-family-400 font-size-16 text-color-dark-grayish-blue">
                No Worries, We help you set a new password <br />
                Enter your registered E-mail ID/ Mobile no and we will <br />
                send you a verification code
              </p>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row gap-2 form-resignation">
                  <div className="pt-3 col-lg-8 col-sm-12">
                    <label className="inter-font-family-400 font-size-14 login-text py-1 d-block">
                      E-mail
                    </label>
                    <input
                      type="email"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^\S+@\S+$/i,
                          message: "Enter a valid email",
                        },
                      })}
                      disabled={isOtpSent}
                      className="input-style"
                      onChange={(e) => {
                        const value = e.target.value;
                        setValue("email", value);
                        if (/^\S+@\S+\.\S+$/.test(value)) {
                          handleEmailVerify({ email: value });
                        }
                      }}
                    />
                    {errors.email && (
                      <p className="text-danger">{errors.email.message}</p>
                    )}
                  </div>

                  {!isOtpVerified && (
                    <div className="py-2 col-lg-8 col-sm-12">
                      <label className="inter-font-family-400 font-size-14 login-text py-1 d-block">
                        Verification Code
                      </label>
                      <div className="d-flex justify-content-between">
                        {Array(6)
                          .fill(0)
                          .map((_, i) => (
                            <input
                              key={i}
                              type="text"
                              maxLength="1"
                              className="otp-input"
                              {...register(`otp${i + 1}`, {
                                required: true,
                              })}
                              ref={(el) => (inputRefs.current[i] = el)}
                              onChange={(e) => handleInput(e, i)}
                              onKeyDown={(e) => handleKeyDown(e, i)}
                            />
                          ))}
                      </div>
                    </div>
                  )}

                  {isOtpVerified && (
                    <>
                      <div className="col-lg-8">
                        <label className="inter-font-family-400 font-size-14 login-text py-2 d-block">
                          New Password
                        </label>
                        <input
                          type="password"
                          {...register("newPassword", {
                            required: "Enter new password",
                            minLength: {
                              value: 6,
                              message: "Min 6 characters required",
                            },
                          })}
                          className="input-style"
                        />
                        {errors.newPassword && (
                          <p className="text-danger">
                            {errors.newPassword.message}
                          </p>
                        )}
                      </div>

                      <div className="col-lg-8">
                        <label className="inter-font-family-400 font-size-14 login-text py-2 d-block">
                          Confirm Password
                        </label>
                        <input
                          type="password"
                          {...register("confirmPassword", {
                            required: "Confirm password",
                            validate: (value) =>
                              value === watch("newPassword") ||
                              "Passwords do not match",
                          })}
                          className="input-style"
                        />
                        {errors.confirmPassword && (
                          <p className="text-danger">
                            {errors.confirmPassword.message}
                          </p>
                        )}
                      </div>
                    </>
                  )}

                  <div className="pt-3 col-lg-8">
                    <button
                      type="submit"
                      className="background-color-terracotta text-color-white py-2 inter-font-family-500 font-size-16 rounded border-0"
                    >
                      {isOtpVerified ? "Set New Password" : "Verify OTP"}
                    </button>
                  </div>
                </div>
              </form>

              <div className="mt-3 col-lg-8">
                <NavLink
                  to="/login"
                  className="text-decoration-none text-dark pb-3 d-flex align-items-center"
                >
                  <BsArrowLeft className="me-2" />
                  Back to Login
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Forgot;
