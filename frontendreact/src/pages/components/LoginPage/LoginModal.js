import React, { useState } from "react";
// import Logo from "../../../images/Logo - Large.png";
// import LogoDark from "../../../images/Logo - Large.png";
// import Logo from "../../../images/logo512.png";
import Head from "../../../layout/head/Head";
// import ImageGif from '../../../../public/security.png'
import logoHeading from "../../../../src/assets/images/logo-full.png";
// import animated from '../../../../src/assets/gif/animated.gif'

import {
  Block,
  BlockContent,
  BlockDes,
  BlockHead,
  BlockTitle,
  Button,
  Icon,
  PreviewCard,
} from "../../../components/Component";
import { Form, Spinner, Alert } from "reactstrap";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { getLoggedIn } from "../../../redux/features/Auth/AuthSlice";
import { useLoginMutation, useRevalidateQuery } from "../../../redux/services/api/AuthApi";

import styles from "./Login.module.css";
import { toast } from "react-toastify";

const LoginModal = () => {
  const { isSuccess: tokenSuccess, isLoading: tokenLoading } = useRevalidateQuery();
  const isLoggedIn = useSelector(getLoggedIn);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) navigate("/");
    if (tokenSuccess && !tokenLoading) {
      navigate("/");
    }
  }, [isLoggedIn, navigate, tokenLoading, tokenSuccess]);

  const [loading, setLoading] = useState(false);
  const [passState, setPassState] = useState(false);
  const [errorVal, setError] = useState("");
  const [login, { isError, isSuccess, isLoading, error }] = useLoginMutation();

  const onFormSubmit = async (formData) => {
    const payLoad = {
      email: formData.email,
      password: formData.passcode,
    };

    setLoading(true);
    try {
      console.log(payLoad);
      await login(payLoad);
    } catch (error) {
      console.log(error);
      setError("Cannot login with credentials");
      setLoading(false);
    }

    navigate("/");
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onTouched",
  });

  useEffect(() => {
    if (isSuccess && !isLoading) {
      navigate("/");
    }

    if (isError && !isLoading) {
      // debugger;
      console.log(error);
      if (error?.status === "FETCH_ERROR") {
        setError("Server Down");
        toast.error("Server down");
      } else {
        setError(error?.data?.message);
        toast.error(error?.data?.message || "Error occured during logging in");
      }
    }
  }, [isSuccess, isLoading, isError, error, navigate]);

  return (
    <>
      <Head title="Login" />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex flex-wrap items-center">
          <div className="hidden w-full xl:block xl:w-1/2">
            <div className="py-17.5 px-26 text-center flex flex-col items-center">
              <div className="mb-5.5 inline-block " href="/">
                <div className="flex justify-center items-center">
                  <img src={logoHeading} alt="Heading" className="pl-10 pr-10 p-2 w-3/4 justify-center" />
                </div>
                <p className="2xl:px-20  text-purple-700 font-bold">Elevating Software Supply Chain Security</p>
                <div className="flex justify-center items-center">
                  <img
                    className=""
                    src="https://www.ccds.ws/wp-content/uploads/2022/06/101492-blue-security.gif"
                    alt="Logo"
                    width={400}
                  />
                </div>
              </div>

              <span className="mt-15 inline-block"></span>
            </div>
          </div>

          <div className="w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2">
            <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
              <span className="mb-1.5 block font-medium">Start for free</span>
              <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
                Sign In to Secure Compose
              </h2>

              <form onSubmit={handleSubmit(onFormSubmit)}>
                <div className="mb-4 relative">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">Email</label>
                  <div className="relative">
                    <input
                      name="email"
                      placeholder="Enter your email "
                      className="form-control-lg form-control"
                      id="email"
                      {...register("email", {
                        required: "Email is required",
                        validate: {
                          maxLength: (v) => v.length <= 50 || "The email should have at most 50 characters",
                          matchPattern: (v) =>
                            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
                            "Email address must be a valid address",
                        },
                      })}
                    />
                    {errors.email?.message && (
                      <span className="absolute text-red-500 text-xs mt-0.5 italic">{errors.email.message}</span>
                    )}
                    <span className=" form-icon lg form-icon-right ">
                      <svg
                        className="fill-current"
                        width="22"
                        height="22"
                        viewBox="0 0 22 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g opacity="0.5">
                          <path
                            d="M19.2516 3.30005H2.75156C1.58281 3.30005 0.585938 4.26255 0.585938 5.46567V16.6032C0.585938 17.7719 1.54844 18.7688 2.75156 18.7688H19.2516C20.4203 18.7688 21.4172 17.8063 21.4172 16.6032V5.4313C21.4172 4.26255 20.4203 3.30005 19.2516 3.30005ZM19.2516 4.84692C19.2859 4.84692 19.3203 4.84692 19.3547 4.84692L11.0016 10.2094L2.64844 4.84692C2.68281 4.84692 2.71719 4.84692 2.75156 4.84692H19.2516ZM19.2516 17.1532H2.75156C2.40781 17.1532 2.13281 16.8782 2.13281 16.5344V6.35942L10.1766 11.5157C10.4172 11.6875 10.6922 11.7563 10.9672 11.7563C11.2422 11.7563 11.5172 11.6875 11.7578 11.5157L19.8016 6.35942V16.5688C19.8703 16.9125 19.5953 17.1532 19.2516 17.1532Z"
                            fill=""
                          />
                        </g>
                      </svg>
                    </span>
                  </div>
                </div>

                <div className="mb-6 relative">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">Password</label>
                  <div className="relative">
                    <a
                      href="#password"
                      onClick={(ev) => {
                        ev.preventDefault();
                        setPassState(!passState);
                      }}
                      className={`form-icon lg form-icon-right passcode-switch ${passState ? "is-hidden" : "is-shown"}`}
                    >
                      <Icon name="eye" className="passcode-icon icon-show"></Icon>

                      <Icon name="eye-off" className="passcode-icon icon-hide"></Icon>
                    </a>
                    <input
                      type={passState ? "text" : "password"}
                      id="password"
                      {...register("passcode", { required: "This field is required" })}
                      placeholder="Enter your passcode"
                      className={`form-control-lg form-control ${passState ? "is-hidden" : "is-shown"}`}
                    />
                    {errors.passcode && (
                      <span className="absolute text-red-500 text-xs mt-.5 italic">{errors.passcode.message}</span>
                    )}
                  </div>
                </div>
                <div className="mb-4 pt-2">
                  <Button
                    size="lg"
                    className="btn-block bg-primary text-white hover:bg-primary-dark focus:outline-none focus:ring focus:border-primary-dark"
                    type="submit"
                    color="white"
                    disabled={isLoading}
                  >
                    {isLoading ? <Spinner size="sm" color="light" /> : "Sign in"}
                  </Button>
                </div>

                <div className="mt-6 text-center">
                  <span>
                    Don’t have any account?{" "}
                    <Link to="/auth-signup" className="text-primary cursor-pointer">
                      Sign up
                    </Link>{" "}
                  </span>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginModal;
