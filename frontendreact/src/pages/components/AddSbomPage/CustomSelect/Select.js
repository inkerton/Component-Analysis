import React from "react";

import { FormControl, MenuItem, Select, styled } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const CustomSelectDesign = styled(Select)({
  "& .MuiSelect-select": {
    padding: "5px 5px",
  },
  minWidth: "200px",
  background: "white",
  color: "#374151",
  borderColor: "#d4d4d8",
  borderStyle: "solid",
  borderRadius: "4px",
  paddingLeft: "14px",
  "&:hover": {
    borderColor: "#9ca3af",
  },
  "&:focus": {
    borderRadius: "4px",
    background: "white",
    borderColor: "#3b82f6",
  },
});

const CustomExpandIcon = styled(ExpandMoreIcon)({
  color: "#6b7280",
  right: 12,
  position: "absolute",
  userSelect: "none",
  pointerEvents: "none",
});

const CustomSelect = ({ label = "", languageOptions, selectedLanguage, setSelectedLanguage, ...props }) => {
  const handleChange = (event) => {
    setSelectedLanguage(event.target.value);
  };

  const iconComponent = (props) => {
    return <CustomExpandIcon />;
  };

  return (
    <FormControl>
      <CustomSelectDesign
        {...props}
        disableUnderline
        labelId="inputLabel"
        IconComponent={iconComponent}
        // MenuProps={menuProps}
        value={selectedLanguage}
        onChange={handleChange}
      >
        {languageOptions?.map((item, i) => {
          return (
            <MenuItem value={item.value} key={i}>
              {item.label}
            </MenuItem>
          );
        })}
      </CustomSelectDesign>
    </FormControl>
  );
};

export default CustomSelect;
