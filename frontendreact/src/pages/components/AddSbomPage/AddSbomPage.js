import React, { useEffect, useState } from "react";
import CustomSelect from "./CustomSelect/Select";
import InputFileUpload from "./DropdownFileInput/FileInput";
import { usePostSbomMutation } from "../../../redux/services/api/SbomApi";
import { toast } from "react-toastify";
import { Accordion, AccordionSummary, Button, Typography, styled,CardContent , Card } from "@mui/material";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { setIsParsing } from "../../../redux/features/Loading/LoadingSlice";
import comingSoon from '../../../../src/assets/images/coming-soon_6304514.png'

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

const DisabledCard = styled(Accordion)({
  width: "100%",
  margin: "auto",
  marginTop: "10px",
});

const AddSbomPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [postSbom, { isLoading, isSuccess, isError, error }] = usePostSbomMutation();

  const [languageOptions, setLanguageOptions] = useState([
    {
      label: "Javascript",
      value: "javascript",
    },
    {
      label: "Python",
      value: "python",
    },
    {
      label:"Java",
      value:"java"
    },
    ,{
      label:"PHP",
      value:"php"
    },
    {
      label:"Rust",
      value:"cargo"
    }
  ]);

  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [uploadedFiles, setUploadedFiles] = useState({
    packagedLock: null,
    packageJson: null,
    requirement: null,
    zip: null,
    pom:null,
    composerFile:null
  });

  const handleSubmit = async (e) => {
    dispatch(setIsParsing(true));
    e.preventDefault();
    try {
      const payload = {
        language: selectedLanguage,
        files: uploadedFiles,
      };
      const response = await postSbom(payload);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  // Handle navigation or error after submission
  useEffect(() => {
    if (isSuccess && !isLoading) {
      toast.success("Sbom generated successfully");
      navigate("/");
    }

    if (isError && !isLoading) {
      console.log(error);
      toast.error(error.message || error?.data?.message);
    }
  }, [isSuccess, isLoading, isError, error, navigate]);

  return (
    <>
      <div className="flex gap-6">
        <Card className="p-4 " sx={{ boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", width: "48.5%" }}>
          <div className="flex flex-col">
            <div className="font-semibold text-xl mb-4">
              Generate SBOM by <span className="text-indigo-400 font-bold ml-1">File</span>
            </div>
            <form className="flex flex-col" onSubmit={handleSubmit}>
              <div className="mb-4 flex gap-3 ">
                <label
                  htmlFor="language"
                  className="flex  items-center text-sm font-medium text-gray-600mr-1"
                >
                  Select language
                </label>
                <CustomSelect
                  languageOptions={languageOptions}
                  selectedLanguage={selectedLanguage}
                  setSelectedLanguage={setSelectedLanguage}
                  name="language"
                  id="language"
                  label={"Select a language"}
                  // sx={{display: 'flex', justify-content: 'center'}}
                />
              </div>
              {selectedLanguage === "javascript" && (
                <div className="flex  flex-col md:flex-row space-y-4 md:space-x-4 md:space-y-0">
                  <div className="">
                    <label htmlFor="packageLock" className="flex items-center text-sm font-medium text-gray-600">
                      Package Lock Upload:
                    </label>
                    <InputFileUpload
                      file={uploadedFiles.packagedLock}
                      setUploadedFile={(file) => {
                        setUploadedFiles((prev) => ({
                          ...prev,
                          ...prev,
                          pom:null,
                          composerFile:null,
                        requirement:null,
                                 packageJson:null,
                                   zip:null,
                                   requirement: null,
                          packagedLock: file,
                        }));
                      }}
                    />
                  </div>
                  <div className="">
                    <label htmlFor="packageJson" className="block text-sm font-medium text-gray-600">
                      Package Json Upload: 
                    </label>
                    <InputFileUpload
                      file={uploadedFiles.packageJson}
                      setUploadedFile={(file) => {
                        setUploadedFiles((prev) => ({
                          ...prev,
                          packageJson: file,
                        }));
                      }}
                    />
                  </div>
                </div>
              )}
              {selectedLanguage === "python" && (
                <div className="mb-4">
                  <label htmlFor="requirements" className="block text-sm font-medium text-gray-600">
                    requirements.txt
                  </label>
                  <InputFileUpload
                    file={uploadedFiles.requirement}
                    setUploadedFile={(file) => {
                      setUploadedFiles((prev) => ({
                        ...prev,
               pom:null,
                      packagedLock:null,
                      packageJson:null,
                        zip:null,
                        composerFile:null,
                        requirement: file,
                      }));
                    }}
                  />
                </div>
              )}
               {selectedLanguage === "java" && (
                <div className="mb-4">
                  <label htmlFor="requirements" className="block text-sm font-medium text-gray-600">
                    pom.xml
                  </label>
                  <InputFileUpload
                    file={uploadedFiles.pom}
                    setUploadedFile={(file) => {
                      setUploadedFiles((prev) => ({
                        ...prev,
                        requirement:null,
                      packagedLock:null,
                      packageJson:null,
                        zip:null,
                        composerFile:null,
                        pom: file,
                      }));
                    }}
                  />
                </div>
              )}
              {selectedLanguage === "php" && (
                <div className="mb-4">
                  <label htmlFor="requirements" className="block text-sm font-medium text-gray-600">
                    composer file
                  </label>
                  <InputFileUpload
                    file={uploadedFiles.composerFile}
                    setUploadedFile={(file) => {
                      setUploadedFiles((prev) => ({
                        ...prev,
                        requirement:null,
                      packagedLock:null,
                      packageJson:null,
                      composerFile:file,
                        zip:null,
                        pom: null,
                      }));
                    }}
                  />
                </div>
              )}
              <Button
                type="submit"
                sx={{
                  width: "150px",
                  mt: "20px",
                  bgcolor: "#798BFF",
                  "&:hover": {
                    bgcolor: "#5461B2",
                  },
                  color: "white",
                }}
              >
                Submit
              </Button>
            </form>
          </div>
        </Card>

        <Card className="p-4  " sx={{ boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", width: "48.5%" }}>
          <div className="flex flex-col">
            <div className="font-semibold text-xl mb-4">
              Generate SBOM by <span className="text-indigo-400 font-bold pl-13 pl-1">Zip</span>
            </div>
            <form className="flex flex-col" onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="zip" className="block text-sm font-medium text-gray-600">
                  Add a zip file of your application
                </label>
              </div>
              <div className="mb-4 flex items-center">
                <label htmlFor="zipFile" className="block text-sm font-medium text-gray-600 pr-3">
                  Zip File : 
                </label>
                <InputFileUpload
                  file={uploadedFiles.zip}
                  setUploadedFile={(file) => {
                    setUploadedFiles((prev) => ({
                      ...prev,
                      zip: file,
                    }));
                  }}
                />
              </div>
              <Button
                type="submit"
                sx={{
                  width: "150px",
                  // mt: "10px",
                  bgcolor: "#798BFF",
                  "&:hover": {
                    bgcolor: "#5461B2",
                  },
                  color: "white",
                  marginTop: '0.5rem'
                }}
              >
                Submit
              </Button>
            </form>
          </div>
        </Card>

        <Card className="p-4  " sx={{ boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", width: "48.5%" }}>
          <div className="flex flex-col">
            <div className="font-semibold text-xl mb-4">
              Generate SBOM by <span className="text-indigo-400 font-bold pl-13 pl-1">EXE</span>
            </div>
            <form className="flex flex-col" onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="zip" className="block text-sm font-medium text-gray-600">
                  Add a exe file of your application
                </label>
              </div>
              <div className="mb-4 flex items-center">
                <label htmlFor="zipFile" className="block text-sm font-medium text-gray-600 pr-3">
                  exe File :
                </label>
                <InputFileUpload
                  file={uploadedFiles.exe}
                  setUploadedFile={(file) => {
                    setUploadedFiles((prev) => ({
                      ...prev,
                      exe: file,
                    }));
                  }}
                />
              </div>
              <Button
                type="submit"
                sx={{
                  width: "150px",
                  // mt: "10px",
                  bgcolor: "#798BFF",
                  "&:hover": {
                    bgcolor: "#5461B2",
                  },
                  color: "white",
                  marginTop: '0.5rem'
                }}
              >
                Submit
              </Button>
            </form>
          </div>
        </Card>
      </div>

      <div className="pt-2">
        <DisabledCard disabled>
          <CardContent className="flex items-center p-1">
            <div>
              <Typography sx={{ fontWeight: 400, fontFamily: "sans-serif", fontSize: "18px" }}>
                Generate SBOM by Git
              </Typography>
            </div>

            <img src={comingSoon} alt="coming soon" style={{ width: "40px", marginLeft: "8px" }} />
          </CardContent>
        </DisabledCard>

        <DisabledCard disabled>
          <CardContent className="flex items-center p-1">
            <div>
              <Typography sx={{ fontWeight: 400, fontFamily: "sans-serif", fontSize: "18px" }}>
                Generate SBOM by Docker
              </Typography>
            </div>

            <img src={comingSoon} alt="coming soon" style={{ width: "40px", marginLeft: "8px" }} />
          </CardContent>
        </DisabledCard>
      </div>
    </>
  );
};

export default AddSbomPage