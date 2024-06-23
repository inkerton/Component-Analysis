import React from "react";
import { useSelector } from "react-redux";
import { getLoggedIn, setLoggedIn } from "../../redux/features/Auth/AuthSlice";
import { useLocation, useNavigate } from "react-router";
import { useRevalidateQuery, useValidateTokenQuery } from "../../redux/services/api/AuthApi";
import { useDispatch } from "react-redux";
import { useEffect } from "react";

const AuthGuard = ({ children }) => {
  const isLoggedIn = useSelector(getLoggedIn);
  const location = useLocation();
  const { isSuccess, isLoading, isError } = useRevalidateQuery();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSuccess && !isLoading) {
      dispatch(setLoggedIn(true));
    }

    if (isError && !isLoading) {
      dispatch(setLoggedIn(false));
      if (location.pathname.startsWith("/auth")) navigate(location.pathname);
      else navigate("/auth-login");
    }
  }, [isSuccess, isLoading, dispatch, isError, navigate, location.pathname]);

  if (isLoggedIn) {
    return <>{children}</>;
  } else {
    return null; // Or render an error message
  }
};

export default AuthGuard;
