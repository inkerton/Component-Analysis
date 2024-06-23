// import React, { useEffect, useRef, useState } from "react";

// import mitchTree from "d3-mitch-tree";

// import "./d3-mitch-tree.min.css";
// import "./d3-mitch-tree-theme-def.min.css";
// import { ExpandIcon } from "../../pageicons/ExpandIcon";
// import { data } from "./testingdata";

// const TreeSBOM = () => {
//   const elRef = useRef(null);
//   const generatedSbom = data;

//   const [sbomData, setSbomData] = useState();
//   const [currentTree, setCurrentTree] = useState(null);

//   const expandAllNodes = () => {
//     if (currentTree) {
//       let nodes = currentTree.getNodes();
//       nodes.forEach((node, index, arr) => currentTree.expand(node));
//       currentTree.update(currentTree.getRoot());
//     }
//   };

//   const parseSbomData = (sbom) => {
//     const idCounter = { value: 1 };

//     function getId() {
//       return idCounter.value++;
//     }

//     const flatNodes = [];
//     function parseComponent(parentId, component) {
//       const node = {
//         id: getId(),
//         parentId,
//         name: component.name + " v" + component.version,
//         type: component.type,
//         description: component.purl,
//       };

//       if (component.dependencies) {
//         component.dependencies.forEach((dep) => {
//           parseComponent(node.id, dep);
//         });
//       }

//       flatNodes.push(node);
//     }

//     sbom.components.forEach((comp) => {
//       parseComponent(null, comp);
//     });

//     return flatNodes;
//   };

//   useEffect(() => {
//     setSbomData(parseSbomData(generatedSbom));
//   }, []);

//   useEffect(() => {
//     if (sbomData?.length > 0) {
//       const treePlugin = new mitchTree.boxedTree()
//         .setIsFlatData(true)
//         .setData(sbomData)
//         .setElement(elRef.current)
//         .setIdAccessor(function (data) {
//           return data.id;
//         })
//         .setParentIdAccessor(function (data) {
//           return data.parentId;
//         })
//         .setBodyDisplayTextAccessor(function (data) {
//           return data.description;
//         });

//       console.log(treePlugin);
//       treePlugin.setVirtualizing(true);
//       treePlugin.initialize();
//       // Expand all nodes
//       let nodes = treePlugin.getNodes();
//       nodes.forEach((node, index, arr) => treePlugin.expand(node));
//       treePlugin.update(treePlugin.getRoot());
//       setCurrentTree(treePlugin);
//     }
//   }, [sbomData?.length]);

//   return (
//     <div>
//       <div style={{ border: "1px solid black", width: "100%", height: "600px", position: "relative" }}>
//         <span style={{ position: "absolute", right: "10px", top: "10px", cursor: "pointer" }} onClick={expandAllNodes}>
//           <ExpandIcon width="24px" height="24px" />
//         </span>
//         <div ref={elRef} style={{ height: "100%", width: "100%" }} />
//       </div>
//     </div>
//   );
// };

// export default TreeSBOM;
