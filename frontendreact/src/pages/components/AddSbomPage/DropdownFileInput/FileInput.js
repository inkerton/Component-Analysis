import * as React from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const StyledButton = styled(Button)({
  backgroundColor: "#798BFF",
  "&:hover": {
    backgroundColor: "#5461B2",
  },
});

const FileDetails = styled("div")({
  marginTop: "8px",
});

export default function InputFileUpload({ file, setUploadedFile }) {
  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  };

  return (
    <>
      <StyledButton
        component="label"
        variant="contained"
        startIcon={<CloudUploadIcon />}
      >
        {file ? "Change" : "Upload File"}
        <VisuallyHiddenInput type="file" onChange={(e) => setUploadedFile(e.target.files[0])} />
      </StyledButton>
      {file && (
        <FileDetails>
          <p className="mb-[0.5px]">
            <span className="font-semibold italic pl-2">File name: </span>
            {file.name}
          </p>
          <p className="mb-[0.5px]">
            <span className="font-semibold italic pl-2">File size: </span>
            {formatBytes(file.size)}
          </p>
        </FileDetails>
      )}
    </>
  );
}
  