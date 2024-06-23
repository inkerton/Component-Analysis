import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Icon, UserAvatar } from "../../../components/Component";
import { findUpper } from "../../../utils/Utils";
import { DropdownItem, UncontrolledDropdown, DropdownMenu, DropdownToggle } from "reactstrap";
import { useSelector } from "react-redux";
import { getUser } from "../../../redux/features/Auth/AuthSlice";
import { getSboms } from "../../../redux/features/sbom/sbomSlice";
import { useGetSbomsQuery } from "../../../redux/services/api/SbomApi";

const UserProfileAside = ({ updateSm, sm }) => {
  useGetSbomsQuery();
  const [profileName, setProfileName] = useState("Abu Bin Ishtiak");
  const user = useSelector(getUser);
  const sboms = useSelector(getSboms);

  useEffect(() => {
    sm ? document.body.classList.add("toggle-shown") : document.body.classList.remove("toggle-shown");
  }, [sm]);

  return (
    <div className="card-inner-group">
      <div className="card-inner">
        <div className="user-card">
          <UserAvatar text={user?.username[0]} theme="primary" />
          <div className="user-info">
            <span className="lead-text">{user?.username}</span>
            <span className="sub-text">{user?.email}</span>
          </div>
        </div>
      </div>
      <div className="card-inner">
        <div className="user-account-info py-0">
          <h6 className="overline-title-alt">Demo Account</h6>
          <div className="user-balance">
            {sboms?.length || 0}
            <small className="currency currency-btc"> SBOMS</small>
          </div>
          <div className="user-balance-sub">
            <span>Software bill of materials</span>
          </div>
        </div>
      </div>
      <div className="card-inner p-0">
        <ul className="link-list-menu">
          <li onClick={() => updateSm(false)}>
            <Link
              to={`${process.env.PUBLIC_URL}/profile`}
              className={window.location.pathname === `${process.env.PUBLIC_URL}/user-profile-regular` ? "active" : ""}
            >
              <Icon name="user-fill-c"></Icon>
              <span>Personal Information</span>
            </Link>
          </li>
          {/* <li onClick={() => updateSm(false)}>
            <Link
              to={`${process.env.PUBLIC_URL}/account-activity`}
              className={window.location.pathname === `${process.env.PUBLIC_URL}/user-profile-activity` ? "active" : ""}
            >
              <Icon name="activity-round-fill"></Icon>
              <span>Account Activity</span>
            </Link>
          </li> */}
          <li onClick={() => updateSm(false)}>
            <Link
              to={`${process.env.PUBLIC_URL}/account-setting`}
              className={window.location.pathname === `${process.env.PUBLIC_URL}/user-profile-setting` ? "active" : ""}
            >
              <Icon name="lock-alt-fill"></Icon>
              <span>Security Setting</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default UserProfileAside;
