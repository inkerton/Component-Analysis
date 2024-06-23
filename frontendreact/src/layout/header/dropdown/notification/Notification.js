import React, { useEffect, useState } from "react";
import { DropdownToggle, DropdownMenu, UncontrolledDropdown } from "reactstrap";

import Icon from "../../../../components/icon/Icon";
import data from "./NotificationData";
import { useSelector } from "react-redux";
import { getSbom, getUpdateNotifications } from "../../../../redux/features/sbom/sbomSlice";
import { getUser } from "../../../../redux/features/Auth/AuthSlice";
import { useGetUpdateNotificationsQuery } from "../../../../redux/services/api/SbomApi";

const NotificationItem = (props) => {
  const { icon, iconStyle, text, time, id } = props;



  return (
    <div className="nk-notification-item" key={id} id={id}>
      <div className="nk-notification-icon">
        <Icon name={"chevron-right"} className={[`icon-circle ${iconStyle ? " " + iconStyle : ""}`]} />
      </div>
      <div className="nk-notification-content">
        <div className="nk-notification-text">{text}</div>
        <div className="nk-notification-time">{time}</div>
      </div>
    </div>
  );
};

const Notification = () => {
  const notificationData=useSelector(getUpdateNotifications)
  console.log("Notification data",notificationData)
  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
  
  const previous2Days = notificationData?.filter((item) => {
    // debugger;
    const createdAt = new Date(item.createdAt);  
    return createdAt > twoDaysAgo; 
  });




  return (
    <UncontrolledDropdown className="user-dropdown">
      <DropdownToggle tag="a" className="dropdown-toggle nk-quick-nav-icon">
        <div className="icon-status icon-status-info">
          <Icon name="bell" />
        </div>
      </DropdownToggle>
      <DropdownMenu end className="dropdown-menu-xl dropdown-menu-s1">
        <div className="dropdown-head">
          <span className="sub-title nk-dropdown-title">{data.title}</span>
          <a href="#markasread" onClick={(ev) => ev.preventDefault()}>
            Mark All as Read
          </a>
        </div>
        <div className="dropdown-body">
          <div className="nk-notification">
            
            {previous2Days && previous2Days?.map((item) => {
              // debugger;
              return (
                <NotificationItem
                  key={item._id}
                  id={item._id}
                  icon={item.icon}
                  iconStyle={item.iconStyle}
                  text={`New version of ${item?.data?.[0]?.name} is available, ${item?.data?.[0]?.olderVersion} -> ${item?.data?.[0]?.newerVersion}.}`}
                  time={item.time}
                />
              );
            })}
          </div>
        </div>
        <div className="dropdown-foot center">
          {/* <a href="#viewall" onClick={(ev) => ev.preventDefault()}>
            View All
          </a> */}
        </div>
      </DropdownMenu>
    </UncontrolledDropdown>
  );
};

export default Notification;
