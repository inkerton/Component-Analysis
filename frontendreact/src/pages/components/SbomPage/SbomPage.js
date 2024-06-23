import React from "react";
import TreeSBOM from "./VisualizeSbom/Tree/TreeSBOM";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "./reactTabs.css";
import TableSBOM from "./VisualizeSbom/Table/TableSBOM";
import { Icon } from "../../../components/Component";
import { TreeIcon } from "./pageicons/TreeIcon";
import { TableIcon } from "./pageicons/TableIcon";
import SbomTree from "./VisualizeSbom/Tree/react-d3-tree";
import { useGetSbomByIdQuery } from "../../../redux/services/api/SbomApi";

export const SbomPage = ({ sbomId }) => {
  const { isLoading, isSuccess, data } = useGetSbomByIdQuery(sbomId);
  return (
    <>
      {!isLoading && isSuccess ? (
        <Tabs>
          <div className="sbomBox bg-white shadow">
            <div className="tabsHeader flex justify-between " style={{borderBottom: '2px solid #798bff'}}>
              <TabList>
                <Tab>
                  <div className="flex ">
                    <TableIcon width="34px" height="24px" />
                    <span>Tabular</span>
                  </div>
                </Tab>
                <Tab>
                  <div className="flex">
                    <TreeIcon width="34px" height="24px" />
                    <span>Direct dep tree</span>
                  </div>
                </Tab>
              </TabList>
            </div>
            <div className="content_container">
              <TabPanel>
                <TableSBOM data={data} />
              </TabPanel>
              <TabPanel>
                {/* <TreeSBOM /> */}
                <SbomTree data={data} />
              </TabPanel>
            </div>
          </div>
        </Tabs>
      ) : null}
    </>
  );
};
