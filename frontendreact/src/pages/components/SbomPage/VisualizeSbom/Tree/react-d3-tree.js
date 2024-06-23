import React, { useEffect, useState } from "react";
import Tree from "react-d3-tree";
import { useCenteredTree } from "./helpers";
import "./styles.css";
import { data } from "./testingdata";
import { Icon } from "../../../../../components/Component";
import { useSelector } from "react-redux";
import { getSbom } from "../../../../../redux/features/sbom/sbomSlice";

const containerStyles = {
  width: "100%",
  height: "600px",
  border: "1px solid ",
};

// Here we're using `renderCustomNodeElement` render a component that uses
// both SVG and HTML tags side-by-side.
// This is made possible by `foreignObject`, which wraps the HTML tags to
// allow for them to be injected into the SVG namespace.
const renderForeignObjectNode = ({ nodeDatum, toggleNode, foreignObjectProps }) => {
  console.log(nodeDatum);
  console.log(foreignObjectProps);
  return (
    <>
      {nodeDatum && nodeDatum?.name ? (
        <NodeBox nodeDatum={nodeDatum} toggleNode={toggleNode} foreignObjectProps={foreignObjectProps} />
      ) : null}
    </>
  );
};

const NodeBox = ({ nodeDatum, foreignObjectProps, toggleNode }) => {
  const [showDetails, setShowDetails] = useState(false);
  console.log(nodeDatum, "In node box");
  return (
    <>
      <g>
        <foreignObject {...foreignObjectProps}>
          <div style={{ backgroundColor: "white" }}>
            <h3
              style={{
                display: showDetails ? "none" : "flex",
                textAlign: "center",
                border: "0.5px solid gray",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 10px",
              }}
            >
              <span>{nodeDatum.name}</span>
              <Icon name="chevron-down" onClick={() => setShowDetails((prev) => !prev)}></Icon>
            </h3>
            {showDetails && (
              <div
                style={{ padding: "10px", borderRadius: "8px", backgroundColor: "white", border: "0.3px solid gray" }}
              >
                <h3 style={{ textAlign: "center" }}>{nodeDatum.name}</h3>
                <p>
                  <b>Version</b> {nodeDatum.attributes.version}
                </p>
                <p>
                  <b>Type</b> {nodeDatum.attributes.type}
                </p>
                <p>
                  <b>Purl</b> {nodeDatum.attributes.purl}
                </p>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button
                    onClick={() => setShowDetails(false)}
                    style={{
                      border: "0",
                      padding: "3px 10px",
                      color: "white",
                      backgroundColor: "#EF4040",
                      borderRadius: "4px",
                    }}
                  >
                    close
                  </button>
                </div>
                <p></p>
                {/* {nodeDatum.children && (
            <button style={{ width: "100%" }} onClick={toggleNode}>
              {nodeDatum.__rd3t.collapsed ? "Expand" : "Collapse"}
            </button>
          )} */}
              </div>
            )}
          </div>
        </foreignObject>
        <circle r={15} onClick={toggleNode}></circle>
      </g>
    </>
  );
};

export default function SbomTree({ data }) {
  const [translate, containerRef] = useCenteredTree();
  const nodeSize = { x: 300, y: 400 };
  const foreignObjectProps = { width: nodeSize.x, height: nodeSize.y, x: -140, y: 30 };

  const currentSbom = data;
  const generatedSbom = JSON.parse(currentSbom?.sbom?.json);
  const [treeData, setTreeData] = useState({});

  const parseSbomData = (sbom) => {
    const parentNode = {
      name: sbom.name,
      attributes: {
        type: sbom.type,
        version: sbom.version,
        purl: sbom.purl,
      },
      children: [],
    };

    function parseComponent(parentNode, dep) {
      const node = {
        name: dep.name + " v " + dep.version,
        attributes: {
          type: dep.type || "unkown",
          version: dep.version || "unknown",
          purl: dep.purl || "unknown",
        },
        children: [],
      };

      if (dep.dependencies) {
        dep.dependencies.forEach((dep) => {
          let child = parseComponent(node.id, dep);
          node.children.push(child);
        });
      }
      return node;
    }

    sbom.dependencies.forEach((dep, i) => {
      if (i === 0) {
        const node = parseComponent(parentNode, dep);
        parentNode.children.push(node);
      }

      if (currentSbom?.language === "python") {
        const node = parseComponent(parentNode, dep);
        parentNode.children.push(node);
      }
    });

    debugger;
    console.log(parentNode);

    return parentNode;
  };

  useEffect(() => {
    debugger;
    setTreeData(parseSbomData(generatedSbom[0]));
  }, []);

  return (
    <div style={containerStyles} ref={containerRef}>
      <Tree
        initialDepth={1}
        data={treeData}
        translate={translate}
        nodeSize={nodeSize}
        pathFunc={"diagonal"}
        separation={{ siblings: 1 }}
        depthFactor={400}
        renderCustomNodeElement={(rd3tProps) => renderForeignObjectNode({ ...rd3tProps, foreignObjectProps })}
        orientation="vertical"
      />
    </div>
  );
}
