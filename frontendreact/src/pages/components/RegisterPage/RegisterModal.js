import React, { useState } from "react";
import Logo from "../../../images/logo.png";
import LogoDark from "../../../images/logo.png";
import Head from "../../../layout/head/Head";
import {
  Block,
  BlockContent,
  BlockDes,
  BlockHead,
  BlockTitle,
  Button,
  Icon,
  PreviewCard,
  Row,
  Col,
} from "../../../components/Component";
import { Spinner } from "reactstrap";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../../../redux/services/api/AuthApi";
import { toast } from "react-toastify";
import logoHeading from "../../../../src/assets/images/logo-full.png";
import Content from "../../../layout/content/Content";

const RegisterModal = () => {
  const [registerUser] = useRegisterMutation();
  const [passState, setPassState] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onTouched",
  });
  const navigate = useNavigate();
  const handleFormSubmit = async (formData) => {
    try {
      const payload = {
        username: formData.username,
        email: formData.email,
        password: formData.passcode,
      };
      const response = await registerUser(payload);
      console.log(response);
      reset();
      toast.success("Registered successfully");
      navigate("/auth-login");
    } catch (error) {
      console.log(error);
      toast.error(`Error in registration ${error.message}`);
    }
  };

  return (
    <>
      <Head title="Register" />
      <Content>
        <Block>
          <Row className="g-gs  items-center h-screen">
            <Col md="12" lg="12" className="flex justify-center w-8/12">
              <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="flex flex-wrap items-center">
                  {/* Left Section - Logo, Heading, and Tagline */}
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

                  {/* Right Section - Registration Form */}
                  <div className="w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2">
                    <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
                      <BlockHead>
                        <BlockContent>
                          <span className="mb-1.5 block font-medium">Start for free</span>
                          <BlockTitle tag="h4">Sign Up to Secure Compose</BlockTitle>
                        </BlockContent>
                      </BlockHead>
                      <form className="is-alter" onSubmit={handleSubmit(handleFormSubmit)}>
                        <div className="mb-4 relative">
                          <label className="mb-2.5 block font-medium text-black dark:text-white">Name</label>
                          <div className="form-control-wrap">
                            <input
                              type="text"
                              id="username"
                              {...register("username", { required: "Username is required" })}
                              placeholder="Enter a username"
                              className="form-control-lg form-control"
                            />
                            {errors.username && (
                              <p className="absolute text-red-500 text-xs mt-0.5 italic">{errors.username.message}</p>
                            )}
                          </div>
                        </div>
                        <div className="form-group">
                          <div className="form-label-group">
                            <label className="form-label" htmlFor="default-01">
                              Email
                            </label>
                          </div>

                          <div className="form-control-wrap">
                            <input
                              type="text"
                              bssize="lg"
                              id="default-01"
                              {...register("email", {
                                required: "Email is required",
                                maxLength: { value: 50, message: "The email should have at most 50 characters" },
                                pattern: {
                                  value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                                  message: "Email address must be a valid address",
                                },
                              })}
                              className="form-control-lg form-control"
                              placeholder="Enter your email address or username"
                            />

                            {errors.email && (
                              <p className="absolute text-red-500 text-xs mt-0.5 italic">{errors.email.message}</p>
                            )}
                          </div>
                        </div>
                        <div className="form-group">
                          <div className="form-label-group">
                            <label className="form-label" htmlFor="password">
                              Passcode
                            </label>
                          </div>
                          <div className="form-control-wrap">
                            <a
                              href="#password"
                              onClick={(ev) => {
                                ev.preventDefault();
                                setPassState(!passState);
                              }}
                              className={`form-icon lg form-icon-right passcode-switch ${
                                passState ? "is-hidden" : "is-shown"
                              }`}
                            >
                              <Icon name="eye" className="passcode-icon icon-show"></Icon>
                              <Icon name="eye-off" className="passcode-icon icon-hide"></Icon>
                            </a>
                            <input
                              name="password"
                              type={passState ? "text" : "password"}
                              id="password"
                              {...register("passcode", { required: "Password is required" })}
                              placeholder="Enter your passcode"
                              className={`form-control-lg form-control ${passState ? "is-hidden" : "is-shown"}`}
                            />

                            {errors.passcode && (
                              <p className="absolute text-red-500 text-xs mt-0.5 italic">{errors.passcode.message}</p>
                            )}
                          </div>
                        </div>

                        <div className="form-group">
                          <Button
                            size="lg"
                            className="btn-block bg-primary text-white hover:bg-primary-dark focus:outline-none focus:ring focus:border-primary-dark mt-2"
                            type="submit"
                            color="white"
                            disabled={loading}
                          >
                            {loading ? <Spinner size="sm" color="light" /> : "Register"}
                          </Button>
                        </div>

                        <div className="form-note-s2 text-center pt-4">
                          {" "}
                          Already have an account?{" "}
                          <Link to={`${process.env.PUBLIC_URL}/auth-login`}>
                            <strong>Log in instead</strong>
                          </Link>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Block>
      </Content>
    </>
  );
};

export default RegisterModal;
