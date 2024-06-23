import React, { useState } from "react";
import classNames from "classnames";
import SimpleBar from "simplebar-react";
import Logo from "../logo/Logo";
import Menu from "../menu/Menu";
import Toggle from "./Toggle";
import logo from "../../../src/assets/images/logo.png";
import { NavLink } from "react-router-dom";
import Icon from "../../components/icon/Icon";
import github from "../../../src/assets/svgs/github-142-svgrepo-com.svg";
import about from "../../../src/assets/svgs/about-svgrepo-com.svg";
import settings from "../../../src/assets/svgs/settings-svgrepo-com.svg";
import docs from "../../../src/assets/svgs/doc-svgrepo-com.svg";

import { useTheme, useThemeUpdate } from "../provider/Theme";

const Sidebar = ({ fixed, className, ...props }) => {
  const theme = useTheme();
  const themeUpdate = useThemeUpdate();

  const [mouseEnter, setMouseEnter] = useState(false);

  const handleMouseEnter = () => setMouseEnter(true);
  const handleMouseLeave = () => setMouseEnter(false);

  const SidebarItem = ({ icon, link, text, newTab, isLast, ...props }) => {
    const borderTop = isLast ? "border-t-2 border-gray-500 w-100 pt-2 " : "";

    return (
      <li className={`nk-menu-item ${borderTop} flex items-center`}>
        {newTab ? (
          <a href={link} target="_blank" rel="noopener noreferrer" className="nk-menu-link flex items-center">
            {icon && (
              <img
                src={icon}
                alt={text}
                className="nk-menu-icon pr-2"
                style={{ filter: "invert(1)", width: "25px", maxWidth: "25px", margin: "0 auto", color: "#6574cd" }}
              />
            )}
            <span className="nk-menu-text text-white pl-2">{text}</span>
          </a>
        ) : (
          <NavLink to={link} className="nk-menu-link flex items-center" rel="noopener noreferrer">
            {icon && (
              <img
                src={icon}
                alt={text}
                className="nk-menu-icon  pr-2"
                style={{ filter: "invert(1)", width: "25px", maxWidth: "25px", margin: "0 auto", color: "#6574cd" }}
              />
            )}
            <span className="nk-menu-text text-white  pl-2">{text}</span>
          </NavLink>
        )}
      </li>
    );
  };

  const classes = classNames({
    "nk-sidebar": true,
    "nk-sidebar-fixed": fixed,
    "nk-sidebar-active": theme.sidebarVisibility,
    "nk-sidebar-mobile": theme.sidebarMobile,
    "is-compact": theme.sidebarCompact,
    "has-hover": theme.sidebarCompact && mouseEnter,
    [`is-light`]: theme.sidebar === "white",
    [`is-${theme.sidebar}`]: theme.sidebar !== "white" && theme.sidebar !== "light",
    [`${className}`]: className,
  });

  return (
    <>
      <div className={classes}>
        <div className="nk-sidebar-element nk-sidebar-head">
          <div className="nk-menu-trigger">
            <Toggle
              className="nk-nav-toggle nk-quick-nav-icon d-xl-none me-n2"
              icon="arrow-left"
              click={themeUpdate.sidebarVisibility}
            />
            <Toggle
              className={`nk-nav-compact nk-quick-nav-icon d-none d-xl-inline-flex ${
                theme.sidebarCompact ? "compact-active" : ""
              }`}
              click={themeUpdate.sidebarCompact}
              icon="menu"
            />
          </div>
          <div className="nk-sidebar-brand">
            <img src={logo} alt="Heading" className="w-1/4 " />
          </div>
        </div>
        <div className="nk-sidebar-content" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <SimpleBar className="nk-sidebar-menu">
            {/* Main menu */}
            <Menu />

            {/* Additional menus at the bottom */}
            <ul className="flex flex-col absolute bottom-0 space-y-2 pb-4 w-full items-start">
              <SidebarItem
                icon={about}
                link="/about" // landing page route
                text="About"
              />
              <SidebarItem
                icon={docs}
                link="https://github.com/unreal0901/sihfrontendreact#readme"
                text="Documentation"
              />
              <SidebarItem
                icon={github}
                link="https://github.com/unreal0901/sihfrontendreact"
                text="GitHub"
                newTab={true}
              />
              <SidebarItem icon={settings} link="/account-setting" text="Settings" isLast="true" />
            </ul>
          </SimpleBar>
        </div>
      </div>
      {theme.sidebarVisibility && <div onClick={themeUpdate.sidebarVisibility} className="nk-sidebar-overlay"></div>}
    </>
  );
};
export default React.memo(Sidebar);
