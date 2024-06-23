import React, { useEffect, useState } from "react";
import { Spinner } from "reactstrap";
import "./styles.css";
import { getIsLoading, getIsParsing } from "../../redux/features/Loading/LoadingSlice";
import { useSelector } from "react-redux";
const FullScreenLoader = () => {
  const LoaderTexts = [
    "Loading your code",
    "Extracting/Parsing",
    "Auditing",
    "Processing",
    "Finalizing",
    "Cleaning Up",
  ];
  const isLoading = useSelector(getIsLoading);
  const isParsing = useSelector(getIsParsing);
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((index) => (index + 1) % LoaderTexts.length);
    }, 2000); // update text every 2 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {isLoading ? (
        <div className="fullScreenLoader">
          <div className="relative flex flex-col justify-center items-center">
            <Spinner style={{ width: "5rem", height: "5rem", borderWidth: "0.6rem" }} />
            {isParsing && (
              <p className="loading_text block text-center mt-2 font-semibold text-white text-lg">
                {LoaderTexts[textIndex]}...
              </p>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
};

export default FullScreenLoader;
