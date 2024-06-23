import React, { useState } from "react";
import UserAvatar from "../../../../components/user/UserAvatar";
import { DropdownToggle, DropdownMenu, Dropdown } from "reactstrap";
import { Icon } from "../../../../components/Component";
import { LinkList } from "../../../../components/links/Links";
import { useSelector } from "react-redux";
import { getUser } from "../../../../redux/features/Auth/AuthSlice";
import { Link } from "react-router-dom";

const User = () => {
  const user = useSelector(getUser);
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen((prevState) => !prevState);

  console.log("Current User", user);

  const handleSignout = () => {
    localStorage.removeItem("accessToken");
  };

  return (
    <Dropdown isOpen={open} className="user-dropdown" toggle={toggle}>
      <DropdownToggle
        tag="a"
        href="#toggle"
        className="dropdown-toggle"
        onClick={(ev) => {
          ev.preventDefault();
        }}
      >
        <div className="user-toggle">
          <UserAvatar icon="user-alt" className="sm" />
          <div className="user-info d-none d-md-block">
            <div className="user-status">Administrator</div>
            <div className="user-name dropdown-indicator">{user?.username || ""}</div>
          </div>
        </div>
      </DropdownToggle>
      <DropdownMenu end className="dropdown-menu-md dropdown-menu-s1">
        <div className="dropdown-inner user-card-wrap bg-lighter  d-md-block">
          <div className="user-card sm">
            <div className="user-avatar">
              <span>{user?.username?.[0]}</span>
            </div>
            <div className="user-info" style={{ display: "block !important" }}>
              <span className="sub-text">{user?.email}</span>
            </div>
          </div>
        </div>
        <div className="dropdown-inner">
          <LinkList>
            <Link to={`/profile`} onClick={() => setOpen(false)}>
              <Icon name="user-alt"></Icon>
              <span>Profile</span>
            </Link>
          </LinkList>
        </div>
        <div className="dropdown-inner">
          <LinkList>
            <a href={`${process.env.PUBLIC_URL}/auth-login`} onClick={handleSignout}>
              <Icon name="signout"></Icon>
              <span>Sign Out</span>
            </a>
          </LinkList>
        </div>
      </DropdownMenu>
    </Dropdown>
  );
};

export default User;
