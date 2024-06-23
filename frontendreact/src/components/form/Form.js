import { ErrorMessage, Field, FieldArray, Formik } from "formik";
import React, { useState } from "react";
import { Button, Col, FormGroup, Input, Label, Row } from "reactstrap";

import "./form.css";
import { OverlineTitle, PreviewCard } from "../Component";
import { toast } from "react-toastify";
import FileInputWrapperWithPreview from "./FileInputWrapperWithPreview";
import useFileFunction from "./useFileFunction";

const Form = ({ fields, arrayFields, initialValues, arrayValues, onSubmit, sectionTitles, updating }) => {
  console.log(initialValues);

  const [prevUploadFiles, setPrevUploadedFiles] = useState({});
  const { deleteFile } = useFileFunction();

  const savePrevFiles = (fieldName, file) => {
    setPrevUploadedFiles((prev) => {
      return {
        ...prev,
        [fieldName]: file,
      };
    });
  };

  const formSubmitHandler = (values, other) => {
    debugger;
    Promise.all(
      Object.values(prevUploadFiles).map(async (url) => {
        try {
          const parts = url.split("/");
          const fileName = parts[parts.length - 1];
          await deleteFile(fileName);
        } catch (error) {
          console.log(error);
        }
      })
    );
    onSubmit(values, other);
  };

  const handleFileChange = async (prevFile, fieldName, file, setFieldValue, mediaType, setFieldError, inputRef) => {
    try {
      console.log(inputRef);
      console.log(file);
      // Determine the valid file types based on the 'mediaType'
      let validFileTypes = [];
      if (mediaType === "image") {
        validFileTypes = ["image/png", "image/jpeg", "image/jpg", "image/gif"];
      } else if (mediaType === "video") {
        validFileTypes = ["video/mp4"];
      } else if ((mediaType = "mix")) {
        validFileTypes = ["image/png", "image/jpeg", "image/jpg", "image/gif", "video/mp4"];
      }

      // Check if the file size is greater than 10MB (10 * 1024 * 1024 bytes)
      if (file.size > 10 * 1024 * 1024) {
        setFieldError(fieldName, "File size exceeds 10MB");
        toast.error("File size exceeds 10MB");
        inputRef.value = "";
        return false;
      }

      // Check if the file type is valid
      if (!validFileTypes.includes(file.type)) {
        setFieldError(fieldName, "Invalid File type");
        toast.error("Invalid file type");
        inputRef.value = "";
        return;
      }

      if (updating && typeof prevFile === "string") {
        if (typeof prevFile === "string" && prevFile.startsWith("https")) savePrevFiles(fieldName, prevFile);
      }
      //   // await deleteFile(prevFileName);
      // }

      // Set the field value with the new file
      setFieldValue(fieldName, file);
    } catch (error) {
      toast.error("Error in uploading/deleting file");
    }
  };

  const showPreviewImage = (type) => {
    if (type === "file") return true;
    else return false;
  };

  return (
    <>
      <Formik enableReinitialize initialValues={initialValues} onSubmit={formSubmitHandler}>
        {({
          handleSubmit,
          handleChange,
          handleBlur,
          values,
          errors,
          touched,
          isSubmitting,
          setFieldValue,
          setFieldError,
        }) => (
          <form onSubmit={handleSubmit}>
            <PreviewCard>
              {sectionTitles?.length > 0 ? <OverlineTitle>{sectionTitles[0]}</OverlineTitle> : null}
              <Row className="gy-5">
                {fields.map((field, i) => {
                  if (field.type === "group") {
                    return (
                      <React.Fragment key={`grpFragmentIndex-${i}`}>
                        <OverlineTitle style={{ marginBottom: "-20px" }}>{field.heading}</OverlineTitle>
                        {Object.keys(values[field.name])?.map((key, index) => {
                          return (
                            <Col sm="6" key={`groupmain-${index}`}>
                              <div className="form-group">
                                <Label htmlFor="program_name" className="form-label">
                                  {field[key]?.label}
                                </Label>
                                <div className="form-control-wrap">
                                  <Field
                                    name={`${field.name}.${key}`}
                                    validate={(value) => {
                                      let error;
                                      if (field.required && !value) error = `${field.label} is required`;
                                      return error;
                                    }}
                                  >
                                    {() => {
                                      return (
                                        <Input
                                          className={
                                            errors[field.name]?.key && touched[field.name]?.key ? "inputInvalid" : ""
                                          }
                                          name={`${field.name}.${key}`}
                                          // value={values[field.name]?.key}
                                          value={values[field.name]?.[key]}
                                          onChange={handleChange}
                                          onBlur={handleBlur}
                                          id={`${field.name}.${key}`}
                                          placeholder={field[key]?.placeholder || ""}
                                          type={field?.key?.type || "text"}
                                        />
                                      );
                                    }}
                                  </Field>
                                  <ErrorMessage name={field.name}>
                                    {(msg) => <p className="err_msg">{msg}</p>}
                                  </ErrorMessage>
                                </div>
                              </div>
                            </Col>
                          );
                        })}
                      </React.Fragment>
                    );
                  } else {
                    return (
                      <Col sm={field.type === "textarea" || showPreviewImage(field.type) ? "12" : "6"} key={i}>
                        <div className="form-group">
                          <Label htmlFor="program_name" className="form-label">
                            {field.label}
                          </Label>
                          <div className="form-control-wrap">
                            <Field
                              name={field.name}
                              validate={(value) => {
                                let error;
                                if (field.required && !value) error = `${field.label} is required`;
                                return error;
                              }}
                            >
                              {() => {
                                if (field.type === "select") {
                                  return (
                                    <Input
                                      name={field.name}
                                      className={errors[field.name] && touched[field.name] ? "inputInvalid" : ""}
                                      value={values[field.name]}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      id={field.name}
                                      type={field.type}
                                    >
                                      <option value="">Choose</option>
                                      {field.options.map((option) => (
                                        <option key={option.value} value={option.value}>
                                          {option.label}
                                        </option>
                                      ))}
                                    </Input>
                                  );
                                } else if (field.type === "switch") {
                                  return (
                                    <FormGroup switch>
                                      <Input
                                        width="30px"
                                        checked={values[field.name]}
                                        className={errors[field.name] && touched[field.name] ? "inputInvalid" : ""}
                                        value={values[field.name]}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        id={field.name}
                                        placeholder={field.placeholder || ""}
                                        type={field.type || "text"}
                                        role="switch"
                                      />
                                      <Label check>{values[field.name] ? "Yes" : "No"}</Label>
                                    </FormGroup>
                                  );
                                } else if (field.type === "file") {
                                  return (
                                    <FileInputWrapperWithPreview
                                      fieldName={field.name}
                                      fieldType={field.type}
                                      values={values[field.name]}
                                      setFieldError={setFieldError}
                                      setFieldValue={setFieldValue}
                                      mediaType={field.mediaType}
                                      showPreviewImage={showPreviewImage}
                                      errors={errors}
                                      touched={touched}
                                      prevUploadFiles={prevUploadFiles}
                                      setPrevUploadedFiles={setPrevUploadedFiles}
                                      handleFileChange={handleFileChange}
                                      updating={true}
                                      handleBlur={handleBlur}
                                      placeholder={field.placeholder}
                                    />
                                  );
                                } else {
                                  return (
                                    <Input
                                      className={errors[field.name] && touched[field.name] ? "inputInvalid" : ""}
                                      value={values[field.name]}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      id={field.name}
                                      placeholder={field.placeholder || ""}
                                      type={field.type || "text"}
                                    />
                                  );
                                }
                              }}
                            </Field>
                            <ErrorMessage name={field.name}>{(msg) => <p className="err_msg">{msg}</p>}</ErrorMessage>
                          </div>
                        </div>
                      </Col>
                    );
                  }
                })}
              </Row>

              {/* Array values */}
              {arrayValues &&
                Object.keys(arrayValues)?.map((arrayFieldName, i) => (
                  <React.Fragment key={arrayFieldName}>
                    <hr className="program_form_divider" />

                    {sectionTitles?.[i + 1] ? (
                      <OverlineTitle tag="span" className="preview-title-lg">
                        {sectionTitles[i + 1]}
                      </OverlineTitle>
                    ) : null}

                    <FieldArray name={arrayFieldName}>
                      {({ insert, remove, push }) => (
                        <Row id={arrayFieldName} className="gy-4 ">
                          {values[arrayFieldName]?.map((item, index) => (
                            <Row key={index} className="gy-3 mb-3">
                              {Object.keys(item)
                                .filter((key) => key !== "_id")
                                .map((key, i, arr) => (
                                  <Col
                                    sm={`${showPreviewImage(arrayFields?.[arrayFieldName]?.[key]?.type) ? "12" : "6"}`}
                                    key={key}
                                    className={arr.length > 2 ? "mb-2" : ""}
                                  >
                                    <div className="form-group">
                                      <Label htmlFor={`${arrayFieldName}.${index}.${key}`} className="form-label">
                                        {`${arrayFields?.[arrayFieldName]?.[key]?.type}` === "file" && updating
                                          ? `Replace Previous ${arrayFields?.[arrayFieldName]?.[key]?.mediaType}`
                                          : `${arrayFields?.[arrayFieldName]?.[key]?.label} ${index + 1}`}
                                      </Label>
                                      <div className="form-control-wrap">
                                        <Field
                                          name={`${arrayFieldName}.${index}.${key}`}
                                          validate={(value) => {
                                            const required = arrayFields?.[arrayFieldName]?.[key]?.required;
                                            let showError =
                                              `${arrayFields?.[arrayFieldName]?.[key]?.type}` === "file" && updating;
                                            let error;
                                            if (!value && !showError && required) {
                                              error = `${key} is required`;
                                            }
                                            return error;
                                          }}
                                        >
                                          {(field) => {
                                            if (arrayFields?.[arrayFieldName]?.[key]?.type === "file") {
                                              return (
                                                <FileInputWrapperWithPreview
                                                  values={values[arrayFieldName][index][key]}
                                                  fieldName={`${arrayFieldName}.${index}.${key}`}
                                                  fieldType={arrayFields?.[arrayFieldName]?.[key]?.type}
                                                  mediaType={arrayFields?.[arrayFieldName]?.[key]?.mediaType}
                                                  showPreviewImage={showPreviewImage}
                                                  placeholder={arrayFields?.[arrayFieldName]?.[key]?.placeholder || ""}
                                                  setFieldError={setFieldError}
                                                  setFieldValue={setFieldValue}
                                                  errors={errors}
                                                  touched={touched}
                                                  prevUploadFiles={prevUploadFiles}
                                                  setPrevUploadedFiles={setPrevUploadedFiles}
                                                  handleFileChange={handleFileChange}
                                                  updating={true}
                                                  handleBlur={handleBlur}
                                                />

                                                // <FileInputWrapperWithPreview field={field} />
                                              );
                                            } else if (arrayFields?.[arrayFieldName]?.[key]?.type === "select") {
                                              return (
                                                <Input
                                                  value={values[arrayFieldName][index]?.[key]}
                                                  className={
                                                    errors?.[arrayFieldName]?.[index]?.[key] &&
                                                    touched?.[arrayFieldName]?.[index]?.[key]
                                                      ? "inputInvalid"
                                                      : ""
                                                  }
                                                  onChange={handleChange}
                                                  onBlur={handleBlur}
                                                  id={`${arrayFieldName}.${index}.${key}`}
                                                  placeholder={arrayFields?.[arrayFieldName]?.[key]?.placeholder || ""}
                                                  type={arrayFields?.[arrayFieldName]?.[key]?.type || "text"}
                                                >
                                                  {arrayFields?.[arrayFieldName]?.[key]?.options?.map((option) => (
                                                    <option key={option.value} value={option.value}>
                                                      {option.label}
                                                    </option>
                                                  ))}
                                                </Input>
                                              );
                                            } else {
                                              return (
                                                <Input
                                                  value={values[arrayFieldName][index]?.[key]}
                                                  className={
                                                    errors?.[arrayFieldName]?.[index]?.[key] &&
                                                    touched?.[arrayFieldName]?.[index]?.[key]
                                                      ? "inputInvalid"
                                                      : ""
                                                  }
                                                  onChange={handleChange}
                                                  onBlur={handleBlur}
                                                  id={`${arrayFieldName}.${index}.${key}`}
                                                  placeholder={arrayFields?.[arrayFieldName]?.[key]?.placeholder || ""}
                                                  type={arrayFields?.[arrayFieldName]?.[key]?.type || "text"}
                                                />
                                              );
                                            }
                                          }}
                                        </Field>
                                        <ErrorMessage name={`${arrayFieldName}.${index}.${key}`}>
                                          {(msg) => (
                                            <p
                                              style={{
                                                display:
                                                  `${arrayFields?.[arrayFieldName]?.[key]?.type}` === "file" && updating
                                                    ? "none"
                                                    : "block",
                                              }}
                                              className="err_msg"
                                            >
                                              {msg}
                                            </p>
                                          )}
                                        </ErrorMessage>
                                      </div>
                                    </div>
                                  </Col>
                                ))}

                              <Col sm={Object.keys(item).length > 2 ? "12" : "2"} className="align-self-end ">
                                {index > 0 && (
                                  <Button color="danger" outline onClick={() => remove(index)} className="mt-2">
                                    Delete
                                  </Button>
                                )}
                              </Col>
                            </Row>
                          ))}
                          <div className="btnContainer mt-5">
                            <Button onClick={() => push({ ...arrayValues[arrayFieldName][0] })}>Add</Button>
                          </div>
                        </Row>
                      )}
                    </FieldArray>
                  </React.Fragment>
                ))}
              <div style={{ paddingTop: "1rem" }}>
                <Button disabled={isSubmitting} type="submit" style={{ float: "right" }}>
                  {updating ? "Update" : "Submit"}
                </Button>
              </div>
            </PreviewCard>
          </form>
        )}
      </Formik>
    </>
  );

  //   return <div>Form</div>;
};

export default Form;
