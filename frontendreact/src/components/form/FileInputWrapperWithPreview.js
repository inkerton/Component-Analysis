import React from "react";
import { Col, Input, InputGroup, Row } from "reactstrap";
import CustomFIleInput from "./CustomFIleInput";
import ImagePreview from "./ImagePreview";

const FileInputWrapperWithPreview = ({
  fieldName,
  fieldType,
  values,
  setFieldValue,
  setFieldError,
  mediaType,
  showPreviewImage,
  errors,
  touched,
  prevUploadFiles,
  handleFileChange,
  setPrevUploadedFiles,
  updating,
  handleBlur,
  placeholder,
}) => {
  return (
    <Row className="align-items-stretch gy-2">
      <Col sm={`${showPreviewImage(fieldType) ? "6" : "12"}`}>
        {showPreviewImage(fieldType) ? (
          <CustomFIleInput
            values={values}
            field={fieldName}
            changeHandler={handleFileChange}
            setFieldValue={setFieldValue}
            setFieldError={setFieldError}
            mediaType={mediaType}
            name={placeholder}
            previousUploadFiles={prevUploadFiles}
            setPrevUploadedFiles={setPrevUploadedFiles}
          />
        ) : (
          <InputGroup>
            <Input
              accept={
                mediaType === "image"
                  ? "image/*"
                  : mediaType === "video"
                  ? "video/mp4"
                  : mediaType === "mix"
                  ? "video/mp4, image/*"
                  : ""
              }
              className={errors[fieldName] && touched[fieldName] ? "inputInvalid" : ""}
              onChange={(e) =>
                handleFileChange(values, fieldName, e.target.files[0], setFieldValue, mediaType, setFieldError, e)
              }
              onBlur={handleBlur}
              id={fieldName}
              placeholder={placeholder || ""}
              type="file"
            />
          </InputGroup>
        )}
      </Col>
      <Col sm="6">{updating && <ImagePreview fieldName={fieldName} file={values} mediaType={mediaType} />}</Col>
    </Row>
  );
};

export default FileInputWrapperWithPreview;

// This was for normal fields

// This was for array fields:
// <Row className="align-items-stretch gy-2">
//   <Col
//     sm={`${
//       showPreviewImage(arrayFields?.[arrayFieldName]?.[key]?.type)
//         ? "6"
//         : "12"
//     }`}
//   >
//     {showPreviewImage(arrayFields?.[arrayFieldName]?.[key]?.type) ? (
//       <CustomFileInput
//         changeHandler={handleFileChange}
//         values={values[arrayFieldName][index][key]}
//         field={`${arrayFieldName}.${index}.${key}`}
//         setFieldError={setFieldError}
//         setFieldValue={setFieldValue}
//         mediaType={arrayFields?.[arrayFieldName]?.[key]?.mediaType}
//         name={arrayFields?.[arrayFieldName]?.[key]?.placeholder}
//         previousUploadFiles={previousFile}
//         setPrevUploadedFiles={setPrevUploadedFiles}
//         savePrevFiles={savePrevFiles}
//       />
//     ) : (
//       <Input
//         accept={
//           arrayFields?.[arrayFieldName]?.[key]?.mediaType === "image"
//             ? "image/*"
//             : arrayFields?.[arrayFieldName]?.[key]?.mediaType ===
//               "video"
//             ? "video/mp4"
//             : arrayFields?.[arrayFieldName]?.[key]?.mediaType === "mix"
//             ? "video/mp4, image/*"
//             : ""
//         }
//         className={
//           errors?.[arrayFieldName]?.[index]?.[key] &&
//           touched?.[arrayFieldName]?.[index]?.[key]
//             ? "inputInvalid"
//             : ""
//         }
//         onChange={(e) =>
//           handleFileChange(
//             values[arrayFieldName][index][key],
//             `${arrayFieldName}.${index}.${key}`,
//             e.target.files[0],
//             setFieldValue,
//             arrayFields?.[arrayFieldName]?.[key]?.mediaType,
//             setFieldError,
//             e
//           )
//         }
//         onBlur={handleBlur}
//         id={`${arrayFieldName}.${index}.${key}`}
//         placeholder={
//           arrayFields?.[arrayFieldName]?.[key]?.placeholder || ""
//         }
//         type="file"
//       />
//     )}
//   </Col>

//   <Col sm="6">
//     {updating && (
//       <ImagePreview
//         file={values[arrayFieldName][index][key]}
//         mediaType={arrayFields?.[arrayFieldName]?.[key]?.mediaType}
//       />
//     )}
//   </Col>
// </Row>
