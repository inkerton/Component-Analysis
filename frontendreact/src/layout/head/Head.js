import React from "react";
import { Helmet } from "react-helmet";

const Head = ({ ...props }) => {
  const titlevalue = props?.title;
  return (
    <Helmet>
      <title> {titlevalue ? `Sbom | ${props.title}` : ""} </title>
    </Helmet>
  );
};
export default Head;
