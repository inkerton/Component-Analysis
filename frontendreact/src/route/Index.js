import React, { useLayoutEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Login from "../pages/Login/Login";

import Layout from "../layout/Index";
import AuthGuard from "../pages/AuthGuard/AuthGuard";
import { Suspense } from "react";
import ListSbom from "../pages/ListSbom/ListSbom";
import { Sbom } from "../pages/Sbom/Sbom";
import RegisterModal from "../pages/components/RegisterPage/RegisterModal";
import { AddSbom } from "../pages/addSbom/AddSbom";
import { UserProfile } from "../pages/UserProfile/UserProfile";
import UserProfileActivityPage from "../pages/components/UserProfilePage/UserProfileActivity";
import { UserAccountSetting } from "../pages/UserProfile/UserAccountSetting";
import { UserActivity } from "../pages/UserProfile/UserActivity";
import NotFound from "../pages/NotFound/NotFound"; // Import your 404 component

const WithAuthGuard = ({ children }) => <AuthGuard>{children}</AuthGuard>;

// Route configuration
const routeConfigs = [
  { path: "", element: <ListSbom /> },
  { path: "/generateSbom", element: <AddSbom /> },
  { path: "sbom/:id", element: <Sbom /> },
  { path: "/profile", element: <UserProfile /> },
  // { path: "/account-activity", element: <UserActivity /> },
  { path: "/account-setting", element: <UserAccountSetting /> },
];

const Router = () => {
  const location = useLocation();
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <Routes>
      <Route
        path={`${process.env.PUBLIC_URL}`}
        element={
          <WithAuthGuard>
            <Layout title="SBOM" />
          </WithAuthGuard>
        }
      >
        {routeConfigs.map((config, index) => (
          <Route key={index} path={config.path} element={<Suspense>{config.element}</Suspense>} />
        ))}
      </Route>
      <Route path="*" element={<NotFound />} />
      <Route path="auth-login" element={<Login />}></Route>
      <Route path="auth-signup" element={<RegisterModal />} />
    </Routes>
  );
};
export default Router;

