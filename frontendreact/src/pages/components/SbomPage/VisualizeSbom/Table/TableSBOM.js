import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { getSbom, setSbom } from "../../../../../redux/features/sbom/sbomSlice";
import { MRT_FilterCheckbox, MRT_FilterTextField, MRT_GlobalFilterTextField, MRT_ShowHideColumnsButton, MaterialReactTable, useMaterialReactTable } from "material-react-table";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import SummarizeIcon from "@mui/icons-material/Summarize";
import { Box, Typography, Button, Chip } from "@mui/material";
import { Modal } from "reactstrap";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";

import "./InnerTabs.css";
import { stringiefiedSbomData } from "../Tree/testingdata";
import { useGenerateReportMutation, useGetUpdateNotificationsQuery } from "../../../../../redux/services/api/SbomApi";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { getUser } from "../../../../../redux/features/Auth/AuthSlice";

const TableSBOM = ({ data }) => {
  const [severities, setSeverities] = useState({
    low: {
      value: 0,
      borderColor: "#c6f0c9",
    },
    moderate: {
      value: 0,
      borderColor: "#f9e27f",
    },
    high: {
      value: 0,
      borderColor: "#f7c89b",
    },
    critical: {
      value: 0,
      borderColor: "#e74c3c",
    },
  });



  const sbomCurrent=useSelector(getSbom);
  const user=useSelector(getUser)
 const sbomId=sbomCurrent?.sbom?._id;
 const userId=user?._id;
 const payload={
  userId,
  sbomId
 }

  useGetUpdateNotificationsQuery(payload,{ refetchOnMountOrArgChange: true })




// Api call to message to generate report:
const [generateReport,{isLoading:reportGenerationLoading,isError,isSuccess}]=useGenerateReportMutation()

useEffect(()=>{
  if(isSuccess && !reportGenerationLoading){
    toast.success("Report generated successfully")
  }
  if(isError && !reportGenerationLoading){
    toast.error("Error in generating Report")
  }
},[isSuccess,reportGenerationLoading,isError])


  // const sbomData = stringiefiedSbomData;
  const sbomJson = JSON.parse(data?.sbom?.json);
  // console.log('testing', sbomJson[0]);
  // const sbomJson = JSON.parse(sbomData);

  // const currentSbom = sbomJson[0];
  const [currentSbom, setCurrentSbom] = useState(sbomJson[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTableData, setSelectedTableData] = useState({});

  const [tableData, setTableData] = useState([]);

  const dispatch=useDispatch();

  useEffect(()=>{
    dispatch(setSbom(data))
  },[])


  function getSeverity(cvss) {
    if (cvss >= 0 && cvss < 2) {
      return "low";
    }

    if (cvss >= 2 && cvss < 4) {
      return "moderate";
    }

    if (cvss >= 4 && cvss < 7) {
      return "high";
    }

    if (cvss >= 7) {
      return "critical";
    }
  }



  function getScoreRange(severity) {

    if (severity === "low") {
      return "0 - 1.9";
    }
  
    if (severity === "moderate") {
      return "2 - 3.9";
    }
  
    if (severity === "high") { 
      return "4 - 6.9";
    }
  
    if (severity === "critical") {
      return "7 - 10";  
    } 
    
  }


  const getDirectDeps=(sbomArray)=>{
    if(sbomArray.language==="javascript"){
      let obj={
        language:sbomArray.language,
        name:sbomArray.name,
        purl:sbomArray.purl,
        type:sbomArray?.type,
        version:sbomArray.version,
        dependencies:[...sbomArray?.dependencies?.[0].dependencies]
      }
      return obj;
    }
    else return sbomArray
  }


  const severitiesRef = useRef({
    low: {
      value: 0,
      borderColor: "#c6f0c9",
    },
    moderate: {
      value: 0,
      borderColor: "#f9e27f",
    },
    high: {
      value: 0,
      borderColor: "#f7c89b",
    },
    critical: {
      value: 0,
      borderColor: "#e74c3c",
    },
  });

  const increseSeverityCount = (severityType, count, severitiesRef) => {
    if (severitiesRef) {
      severitiesRef[severityType].value += count;
    }
  };

  const downloadJson = () => {
    let json = JSON.stringify(sbomJson, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sbom.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const reportGenerationHandler=async ()=>{
    try{
      // dispatch(setIsLoading(true))
      let jsonSbomReport={
        name:'Software Bill of materials',
        author:"anas",
        format:"cyclonDX",
        components:sbomJson?.map((item)=>getDirectDeps(item))
      }
  
      const res = await fetch("http://127.0.0.1:5000/get_pdf", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "data": jsonSbomReport }),
      });

      if (res.ok) {
        toast.success("Report generated")
        const blob = await res.blob();

        // Create a blob URL for the PDF file
        const pdfUrl = URL.createObjectURL(blob);

        // Open the PDF file in a new tab
        window.open(pdfUrl, '_blank');
      } else {
        // Handle error if the response is not okay
        console.error('Error fetching PDF:', res.statusText);
      }
      // const iframe = document.getElementById("my_iframe");
      // iframe.src = pdfUrl;
  
      // iframe.onload = function() {
          
      //   URL.revokeObjectURL(pdfUrl);
        
      //   this.style.display = "block";
      //   this.focus(); 
  
      //   let link = document.createElement('a');
      //   link.href = this.src;  
      //   link.target="_blank";
      //   link.download = "report.pdf";
      //   document.body.appendChild(link);
      //   link.click(); 
      //   link.remove();
      // console.log(blob);
      // }
    }catch(error){
      // toast.error("Error occured during while generating report")
      console.error(error);
      // dispatch(setIsLoading(true))
    }
    finally{
      // dispatch(setIsLoading(true))
    }
  
  }

  const parseSbomForTable = (sbom) => {
    // initialize ref

    let flatStructure = [];
    const root = {
      type: sbom.type,
      name: sbom.name,
      version: sbom.version,
      purl: sbom.purl,
      vulnerabilities: [],
    };
    flatStructure.push(root);

    const recursivelyGenerateRow = (sbomDep, parent) => {
      const node = {
        type: sbomDep?.type || "unknown",
        version: sbomDep?.version || "unkown",
        purl: sbomDep?.purl || "unknown",
        name: sbomDep?.name || "unkown",
        parent: parent?.name === "unkown" ? "application" : parent?.name,
        vulnerabilities: sbomDep?.vulnerabilities,
      };

      if (sbomDep?.vulnerabilities?.length > 0) {
        sbomDep?.vulnerabilities?.forEach((item) => {
          let severity;
          if (data?.language === "python"||data?.language === "java" || currentSbom?.language === "python"|| currentSbom?.language === "java") {
            severity = getSeverity(item?.cvss_score || 0);
          } else severity = item?.severity;
          if (data?.language === "python"||data?.language === "java" || currentSbom?.language === "python"|| currentSbom?.language === "java") {
            increseSeverityCount(severity, 1, severitiesRef.current);
          } else increseSeverityCount(severity, item?.via?.length, severitiesRef.current);
        });
      }
      flatStructure.push(node);

      if (sbomDep?.dependencies?.length > 0) {
        sbomDep?.dependencies?.forEach((dep, i) => {
          recursivelyGenerateRow(dep, node);
        });
      }

      return;
    };

    sbom?.dependencies?.forEach((dep, i) => {
      recursivelyGenerateRow(dep, root);
    });

    return flatStructure;
  };

  useEffect(() => {
    // console.log("use effect ran again");
    setIsLoading(true);

    severitiesRef.current = {
      low: {
        value: 0,
        borderColor: "#c6f0c9",
      },
      moderate: {
        value: 0,
        borderColor: "#f9e27f",
      },
      high: {
        value: 0,
        borderColor: "#f7c89b",
      },
      critical: {
        value: 0,
        borderColor: "#e74c3c",
      },
    };
    const flatStruct = parseSbomForTable(currentSbom);
    setTableData(flatStruct);
    setIsLoading(false);
  }, [currentSbom]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "type",
        header: "Type",
        size: 150,
      },
      {
        accessorKey: "name",
        header: "Name",
        size: 150,
      },
      {
        accessorKey: "version",
        header: "Version",
        size: 200,
      },
      {
        accessorKey: "purl",
        header: "Purl",
        size: 200,
      },
      {
        accessorKey: "parent",
        header: "Belongs to",
        size: 200,
      },
      {
        accessorKey: "vulnerabilities",
        header: "Vulnerabilities",
        Cell: ({ cell }) => {
          const vul = cell.getValue();
          const colors = {
            high: "error",
            critical: "error",
            medium: "warning",
            moderate: "warning",
            low: "success",
          };

          return (
            <>
              {vul && vul?.length > 0 ? (
                <div className="flex gap-2 max-w-full items-center">
                  {vul?.map((item, index) => {
                    if (index > 3) {
                      return null;
                    }

                    if (index > 2) {
                      return (
                        <Chip
                          key={vul.id}
                          clickable={true}
                          onClick={() => {
                            setIsModalOpen(true);
                          }}
                          color="primary"
                          label="See more"
                          sx={{
                            cursor: "pointer",
                            "&:hover": {
                              backgroundColor: "blue",
                            },
                          }}
                        />
                      );
                    }

                    if (data.language === "javascript" || currentSbom?.language === "javascript") {
                      if (item?.via && item?.via?.length > 0) {
                        return item?.via?.map((viaItem) => {
                          return (
                            <Chip
                              key={index}
                              label={typeof viaItem === "string" ? viaItem : viaItem?.name}
                              sx={{
                                minWidth: "50px",
                                pointerEvents: "none",
                                backgroundColor: severities[item?.severity]?.borderColor,
                              }}
                              size="small"
                              // color={colors[item?.severity]}
                            />
                          );
                        });
                      }
                    } else if (data.language === "python" || currentSbom?.language === "python"||data.language === "java" || currentSbom?.language === "java") {
                      if (index > 2) {
                        return (
                          <Chip
                            clickable={true}
                            onClick={() => {
                              setIsModalOpen(true);
                            }}
                            color="primary"
                            label="See more"
                            sx={{
                              cursor: "pointer",
                              "&:hover": {
                                backgroundColor: "blue",
                              },
                            }}
                          />
                        );
                      }
                      return (
                        <Chip
                          key={index}
                          label={typeof item === "string" ? item : item?.id}
                          sx={{
                            minWidth: "50px",
                            pointerEvents: "none",
                            backgroundColor: severities[getSeverity(item?.cvss_score)]?.borderColor,
                          }}
                          size="small"
                          // color={colors[item?.severity]}
                        />
                      );
                    }
                  })}
                </div>
              ) : (
                <span className="text-xs">No vulnerabilities</span>
              )}
            </>
          );
        },
        size: 200,
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: tableData,
    muiTableProps: {
      stripedRows: true,
      sx: {
        borderCollapse: 'collapse',
        width: '100%',
        border: '1px solid #ddd',
        borderRadius: 4,
        boxShadow: '0px 2px 10px #ddd',
        marginTop: '10px',
  
        // Header styling
        '& .MuiTableCell-head': {
          backgroundColor: '#798bff',
          color: 'white',
          fontWeight: 'bold',
          border: '1px solid #ddd',
          padding: '8px',
        },
  
        // Cell styling
        '& .MuiTableCell-body': {
          border: '1px solid #ddd',
          padding: '8px',
        },
  
        // Hover effect for rows
        '& .MuiTableRow-root:hover': {
          backgroundColor: '#e5e5e5',
        },
  
        // Alternating row colors
        '& .MuiTableRow-root:nth-child(odd)': {
          backgroundColor: '#f9f9f9 !important',
        },
      },
    },
    enableDensityToggle: false,
    muiTableBodyRowProps: ({ row }) => ({
      onClick: (event) => {
        setSelectedTableData(row.original);
        setIsModalOpen(true);
      },
      sx: {
        cursor: 'pointer',
      },
    }),
    enableFullScreenToggle: false,
    state: {
      isLoading: isLoading || !tableData?.length,
    },
    renderTopToolbarCustomActions: ({ table }) => (
      <Box sx={{ display: "flex", gap: "1rem", p: "4px" }}>
        <Button
          startIcon={<LocalPrintshopIcon />}
          sx={{
            backgroundColor: "#5949E0",
            "&:hover": {
              backgroundColor: "#5949E0",
            },
          }}
          onClick={() => {
            reportGenerationHandler()
          }}
          variant="contained"
        >
          Generate Report
        </Button>
        <Button
          startIcon={<SummarizeIcon />}
          sx={{
            backgroundColor: "#5949E0",
            "&:hover": {
              backgroundColor: "#5949E0",
            },
          }}
          onClick={() => {
            downloadJson();
          }}
          variant="contained"
        >
          Download as JSON
        </Button>
      </Box>
    ),
  });

  return (
    <>
      <iframe id="my_iframe" style={{ display: "none" }} title="download"></iframe>
      <Tabs>
        <div className="flex justify-between p-1" >
          <TabList className="react-tabs__tab-list innerTabs flex items-center font-bold mb-0" style={{marginBottom: 'auto'}}>
            {sbomJson && sbomJson?.length > 0
              ? sbomJson?.map((component, index) => {
                  return (
                    <Tab
                      key={index}
                      className="react-tabs__tab innerTabs uppercase text-lg"
                      onClick={() => setCurrentSbom(sbomJson[index])}
                      style={{marginBottom: 'auto !important'}}
                    >
                      {component?.name || "Unkonwn component"}
                    </Tab>
                  );
                })
              : null}
          </TabList>
          
          <div className="flex inner_severity_container items-center">
              {Object.keys(severitiesRef?.current)?.map((key, index) => {
                const borderColor = severitiesRef?.current?.[key].borderColor;
                const value = severitiesRef?.current?.[key].value;
                return (
                  <>
            
                  <div className="flex flex-col" key={index}>
                    <div
                      className="relative rounded-full border-5 p-2 mr-5 self-baseline w-[50px] h-[50px] text-center"
                      style={{ borderColor }}
                    >
                      <span className="w-full absolute left-0">{value}</span>
                    </div>
                    <span className="text-center w-[50px] capitalize mt-1">{key}</span>
                  </div>
                  </>
                );
              })}
          </div>
        </div>
        {sbomJson && sbomJson?.length > 0
          ? sbomJson?.map((component, index) => {
              return (
                <TabPanel key={index}>

                  <div className="table_container">
                    {tableData?.length > 0 && <MaterialReactTable table={table} />}
                    
                    {(data.language === "javascript" || currentSbom?.language === "javascript") ? (
                      <Modal
                        isOpen={isModalOpen}
                        className="modal-dialog-centered"
                        size="lg"
                        toggle={() => setIsModalOpen(false)}
                      >
                        <div className="p-4">
                          <h2 className="mb-4">{selectedTableData.original}</h2>

                          <div className="mb-3">
                            <label className="font-bold mr-2">Name:</label>
                            <span>{selectedTableData.name}</span>
                          </div>

                          <div className="mb-3">
                            <label className="font-bold mr-2">Version:</label>
                            <span>{selectedTableData.version}</span>
                          </div>

                          <div className="mb-3">
                          <label className="font-bold mr-2">Severity:</label>
                          {selectedTableData.vulnerabilities && selectedTableData.vulnerabilities.length > 0 ? (
                            
                            selectedTableData.vulnerabilities.map((vulnerability, index) => { 
                              return (
                              <Chip
                                key={index}
                                label={getSeverity(vulnerability.cvss_score)}
                                sx={{
                                  minWidth: "50px",
                                  pointerEvents: "none",
                                  backgroundColor: severities[vulnerability?.cvss_score?getSeverity(vulnerability.cvss_score):vulnerability?.severity].borderColor
                                }}
                                size="small"
                              />
                            )})
                          ) : (
                            <span>No vulnerabilities</span>
                          )}
                        </div>

                          <table className="table modal-table">
                            <thead>
                              <tr>
                                <th>ID/Name</th>
                                <th>CVSS Score</th>
                                {data.language === "javascript" || currentSbom?.language === "javascript"?null:<th>Description</th>}
                                
                              </tr>
                            </thead>
                            <tbody>
                              {/* Map through vulnerabilities and render rows */}
                              {selectedTableData?.vulnerabilities?.map((vulnerability, index) => {
                                return (
                                <tr key={index}>
                                  <td>{vulnerability.id || vulnerability?.name}</td>
                                  <td>{vulnerability.cvss_score || vulnerability?.severity? getScoreRange(vulnerability?.severity):"NAN"}</td>
                                  {vulnerability?.description?<td>{vulnerability.description}</td>:null}
                                  
                                </tr>
                              )})}
                            </tbody>
                            <style jsx>{`
                              .modal-table {
                                width: 100%;
                                border-collapse: collapse;
                                margin-top: 10px;
                              }

                              .modal-table th,
                              .modal-table td {
                                border: 1px solid #ddd;
                                padding: 8px;
                                text-align: left;
                              }

                              .modal-table th {
                                background-color: #f2f2f2;
                              }

                              .modal-table tbody tr:nth-child(even) {
                                background-color: #f9f9f9;
                              }

                              .modal-table tbody tr:hover {
                                background-color: #e5e5e5;
                              }
                            `}</style>
                          </table>
                        </div>
                      </Modal>
                    ) : (data.language === "python" || currentSbom?.language === "python"||data.language === "java" || currentSbom?.language === "java") ? (
                      <Modal
                        isOpen={isModalOpen}
                        className="modal-dialog-centered"
                        size="lg"
                        toggle={() => setIsModalOpen(false)}
                      >
                        <div className="p-4">
                          <h2 className="mb-4">{selectedTableData.original}</h2>

                          <div className="mb-3">
                            <label className="font-bold mr-2">Name:</label>
                            <span>{selectedTableData.name}</span>
                          </div>

                          <div className="mb-3">
                            <label className="font-bold mr-2">Version:</label>
                            <span>{selectedTableData.version}</span>
                          </div>

                          <div className="mb-3">
                          <label className="font-bold mr-2">Severity:</label>
                          {selectedTableData.vulnerabilities && selectedTableData.vulnerabilities.length > 0 ? (
                            selectedTableData.vulnerabilities.map((vulnerability, index) => (
                              <Chip
                                key={index}
                                label={getSeverity(vulnerability.cvss_score)}
                                sx={{
                                  minWidth: "50px",
                                  pointerEvents: "none",
                                  backgroundColor: severities[vulnerability?.cvss_score?getSeverity(vulnerability.cvss_score):vulnerability?.severity].borderColor                        
                                }}
                                size="small"
                              />
                            ))
                          ) : (
                            <span>No vulnerabilities</span>
                          )}
                        </div>

                          <table className="table modal-table">
                            <thead>
                              <tr>
                                <th>ID</th>
                                <th>CVSS Score</th>
                                <th>Description</th>
                              </tr>
                            </thead>
                            <tbody>
                              {/* Map through vulnerabilities and render rows */}
                              {selectedTableData?.vulnerabilities?.map((vulnerability, index) => (
                                <tr key={index}>
                                  <td>{vulnerability.id}</td>
                                  <td>{vulnerability.cvss_score}</td>
                                  <td>{vulnerability.description}</td>
                                </tr>
                              ))}
                            </tbody>
                            <style jsx>{`
                              .modal-table {
                                width: 100%;
                                border-collapse: collapse;
                                margin-top: 10px;
                              }

                              .modal-table th,
                              .modal-table td {
                                border: 1px solid #ddd;
                                padding: 8px;
                                text-align: left;
                              }

                              .modal-table th {
                                background-color: #f2f2f2;
                              }

                              .modal-table tbody tr:nth-child(even) {
                                background-color: #f9f9f9;
                              }

                              .modal-table tbody tr:hover {
                                background-color: #e5e5e5;
                              }
                            `}</style>
                          </table>
                        </div>
                      </Modal>
                    ) : null}
                  </div>
                </TabPanel>
              );
            })
          : null}
      </Tabs>
    </>
  );
};

export default TableSBOM;
