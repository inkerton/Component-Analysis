import React, { useEffect, useState } from "react";
import { Container, Row } from "reactstrap";
import PreviewSkeleton from "./PreviewSkeleton";

const ImagePreview = ({ file, mediaType, fieldName }) => {
  const [mediaUrl, setMediaUrl] = useState();
  const [isImage, setIsImage] = useState(true); // Assume it's an image by default
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (mediaType === "mix") {
      if (file instanceof File) {
        setIsImage(file.type.startsWith("image/"));
      } else if (typeof file === "string") {
        const extension = file.split(".").pop();
        setIsImage(extension === "jpg" || extension === "jpeg" || extension === "png" || extension === "gif");
      }
    } else if (mediaType === "image") {
      setIsImage(true);
    } else if (mediaType === "video") {
      setIsImage(false);
    }

    if (file instanceof File) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.addEventListener("load", (e) => {
        setMediaUrl(e.target.result);
        setIsLoading(false);
        setIsError(false);
      });
    } else if (typeof file === "string") {
      setMediaUrl(file);
      setIsLoading(false);
    }
  }, [file, mediaType]);

  const fileError = () => {
    setIsError(true);
  };

  const fileLoad = () => {
    setIsError(false);
  };

  // Render a shimmer UI when mediaUrl is loading
  if (isLoading || !mediaUrl) {
    return <PreviewSkeleton fieldName={fieldName} text={"Add image to preview"} />;
  }

  if (isError) {
    return <PreviewSkeleton fieldName={fieldName} text={"Failed to load the file"} />;
  }

  return (
    <Container className="d-flex justify-content-center align-items-center h-100">
      <Row style={{ maxWidth: "300px", borderRadius: "20px" }}>
        {isImage ? (
          fieldName === "image" ? (
            <img
              alt="Preview"
              src={mediaUrl}
              style={{ width: "200px", height: "200px", borderRadius: "50%", objectFit: "cover" }}
              onLoad={fileLoad}
              onError={fileError}
            />
          ) : (
            <img alt="Preview" src={mediaUrl} style={{ maxHeight: "150px" }} onLoad={fileLoad} onError={fileError} />
          )
        ) : (
          <video controls src={mediaUrl} style={{ maxHeight: "150px" }} onLoad={fileLoad} onError={fileError} />
        )}
      </Row>
    </Container>
  );
};

export default ImagePreview;
