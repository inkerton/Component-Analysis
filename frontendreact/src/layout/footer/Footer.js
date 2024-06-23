import React from "react";
// import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="nk-footer" style={{ backgroundColor: "white", borderTop: 0 }}>
      <div className="container-fluid">
        <div className="nk-footer-wrap">
          <div className="nk-footer-copyright italic"> &copy; {new Date().getFullYear()} SecureCompose</div>
          <div className="nk-footer-links"></div>
        </div>
      </div>
    </div>
  );
};
export default Footer;
