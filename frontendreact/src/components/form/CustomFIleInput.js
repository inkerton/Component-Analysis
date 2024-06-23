import React from "react";
import { useDropzone } from "react-dropzone";
import { Icon } from "../Component";
import { useState } from "react";

const baseStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  position: "relative",
  alignItems: "center",
  padding: "20px",
  borderWidth: 2,
  borderRadius: 2,
  borderColor: "#6774F0",
  borderStyle: "dashed",
  backgroundColor: "#fff",
  color: "#bdbdbd",
  outline: "none",
  transition: "border .24s ease-in-out",
};

function CustomFIleInput({
  changeHandler,
  values,
  field,
  setFieldValue,
  setFieldError,
  mediaType,
  name,
  setPrevUploadedFiles,
}) {
  const [selectedFile, setSelectedFile] = useState("");
  const [previousFile, setPreviousFile] = useState("");
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    onDrop: (files, fileRejected, event) => {
      console.log(event.target);
      const closestInput = event.target.closest("input");
      //  Here find the closest input ancestor where drop ooccured if its already not input

      console.log(closestInput);
      previousFileSetter(values);
      setSelectedFile(files[0]);
      changeHandler(values, field, files[0], setFieldValue, mediaType, setFieldError, closestInput);
    },
  });

  const previousFileSetter = (file) => {
    if (typeof file === "string" && file.startsWith("https")) {
      setPreviousFile(file);
      setPrevUploadedFiles((prev) => {
        console.log(prev);
        let updatedPrev;
        if (prev.hasOwnProperty(field)) {
          // Create a copy of the previous object without the field
          updatedPrev = { ...prev };
          delete updatedPrev[field];

          return updatedPrev;
        } else {
          updatedPrev = { ...prev };
          updatedPrev[field] = values;

          return updatedPrev;
        }
      });
    }
  };

  const undoImageHandler = () => {
    let prevFile = "";
    if (previousFile) {
      console.log(field);

      console.log("1", previousFile);
      prevFile = previousFile;
      setPreviousFile("");
      setPrevUploadedFiles((prev) => {
        console.log(prev);
        let updatedPrev;
        if (prev.hasOwnProperty(field)) {
          prevFile = prev[field];
          // Create a copy of the previous object without the field
          updatedPrev = { ...prev };
          delete updatedPrev[field];
          return updatedPrev;
        }
      });
    } else {
      console.log("2", previousFile);
      console.log(values);
      if (typeof values === "string" && values.startsWith("https")) {
        setPrevUploadedFiles((prev) => {
          console.log(prev);
          let updatedPrev;
          if (prev.hasOwnProperty(field)) {
            // Create a copy of the previous object without the field
            updatedPrev = { ...prev };
            delete updatedPrev[field];

            return updatedPrev;
          } else {
            updatedPrev = { ...prev };
            updatedPrev[field] = values;

            return updatedPrev;
          }
        });
      }
      setPreviousFile(values);
    }
    // setSelectedFile("");
    // setFieldValue(field, prevFile);

    // setPrevUploadedFiles((prev) => {
    //   console.log(prev);
    //   let updatedPrev;
    //   if (prev.hasOwnProperty(field)) {
    //     prevFile = prev[field];
    //     // Create a copy of the previous object without the field
    //     updatedPrev = { ...prev };
    //     delete updatedPrev[field];
    //     setPrevFile("");
    //     return updatedPrev;
    //   } else {
    //     updatedPrev = { ...prev };
    //     updatedPrev[field] = values;
    //     setPrevFile(values);
    //     return updatedPrev;
    //   }
    // });
    setSelectedFile((prev) => "");
    setFieldValue(field, prevFile);
  };

  function formatFileSize(bytes) {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  return (
    <section className="container" style={baseStyle}>
      <span
        onClick={undoImageHandler}
        style={{
          position: "absolute",
          top: "-2px",
          paddingLeft: "6px",
          paddingRight: "3px",
          paddingBottom: "2px",
          right: "-2px",
          fontSize: "14px",
          zIndex: "1000",
          color: "white",
          backgroundColor: "#6774F0",
          cursor: "pointer",
          borderBottomLeftRadius: "5px",
        }}
      >
        {previousFile ? "RESET" : "REMOVE"}
      </span>
      <div
        {...getRootProps({
          className: "dropzone",
        })}
      >
        <input
          {...getInputProps()}
          accept={
            mediaType === "image"
              ? "image/*"
              : mediaType === "video"
              ? "video/mp4"
              : mediaType === "mix"
              ? "video/mp4, image/*"
              : ""
          }
          onChange={(e) => {
            previousFileSetter(values);
            setSelectedFile(e.target.files[0]);
            changeHandler(values, field, e.target.files[0], setFieldValue, mediaType, setFieldError, e.target);
          }}
        />
        <span
          style={{
            fontSize: "50px",
            display: "inline-block",
            width: "100%",
            textAlign: "center",
            color: "#6774F0",
          }}
        >
          <Icon name="upload-cloud" />
        </span>
        <p> {name}</p>
        <p>
          {selectedFile && (
            <span key={selectedFile?.name}>
              {selectedFile?.name} - {formatFileSize(selectedFile?.size)}
            </span>
          )}
        </p>
      </div>
    </section>
  );
}

export default CustomFIleInput;
