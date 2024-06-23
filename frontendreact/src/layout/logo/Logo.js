import React from "react";
// import MainLogo from "../../images/mainLogo.png";
import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link to={`${process.env.PUBLIC_URL}/`} className="logo-link">
      SBOM
    </Link>
  );
};

export default Logo;
