import React from "react";
import { Container } from "reactstrap";
import { Icon } from "../Component";

const PreviewSkeleton = ({ text, fieldName }) => {
  return (
    <Container className="position-relative d-flex justify-content-center align-items-center h-100">
      {/* Your shimmer UI or skeleton component */}

      {fieldName === "image" ? (
        <div
          className="shimmer-effect"
          style={{
            width: "200px",
            height: "200px",
            borderRadius: "50%",
            backgroundColor: "#fafafa",
          }}
        >
          <p
            className="d-flex flex-column align-items-center justify-content-between"
            style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }}
          >
            <span>{text}</span> <Icon name="file-fill" className="ms-1 fs-1" style={{ color: "#6774F0" }}></Icon>
          </p>
        </div>
      ) : (
        <div
          className="shimmer-effect"
          style={{
            width: "300px",
            height: "150px",
            borderRadius: "20px",
            backgroundColor: "#fafafa",
          }}
        >
          <p
            className="d-flex flex-column align-items-center justify-content-between"
            style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }}
          >
            <span>{text}</span> <Icon name="file-fill" className="ms-1 fs-1" style={{ color: "#6774F0" }}></Icon>
          </p>
        </div>
      )}
    </Container>
  );
};

export default PreviewSkeleton;
