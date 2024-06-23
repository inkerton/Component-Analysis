require("dotenv").config();
const FormData = require("form-data");
const config = require("config");
const axios = require("axios");
const fs = require("fs");
const { execSync } = require("child_process");
const SbomJsonModel = require("../../sbom/models/SbomJson.model");
const SbomModel = require("../../sbom/models/Sbom.model");
const AppError = require("../../utils/appError");
const path = require("path");
const { UpdateVulneradbilityModel } = require("../../sbom/models/UpdatedVulnerabilitesModel");

const processSbom = async (packageLockFile, packageJsonFile, userId) => {
  // const json = JSON.parse(fileContent);
  // const components = await parseSbom(json);
  const packageDir = path.dirname(packageLockFile.path);
  try {
    const fileBuffer = fs.readFileSync(packageLockFile.path);

    const reportFilePath = path.join(
      packageDir,
      `reports_${packageLockFile.filename}.json`
    );
    const auditCommand = `npm audit --json --package-lock-only --package ${packageLockFile.path} > reports_${packageLockFile.filename}.json`;
    try {
      execSync(auditCommand, { cwd: packageDir, stdio: "inherit" });
    } catch (error) {}
    const reportFileBuffer = fs.readFileSync(reportFilePath);
    const form = new FormData();
    form.append("package_lock", fileBuffer, packageLockFile.originalname);
    form.append("package_audit", reportFileBuffer, "reports.json");
    const boundary = form.getBoundary();
    const axiosConfig = {
      headers: {
        "Content-Type": `multipart/form-data; boundary=${boundary}`,
      },
    };

    const axiosInst = axios.create(axiosConfig);

    const { status, data } = await axiosInst.post(
      `${config.get("parserServer")}/js/npm-parser`,
      form
    );

    if ((status + "")[0] === "4") {
      throw new AppError("Something wrong in generating the sbom");
    }

    const stringifiedSbom = data;
    const sbomJson = await storeSbom({
      json: stringifiedSbom,
    });

    sbomJson.save();
    const sbom = sbomJson.toObject();
    const payload = {
      name: packageLockFile.filename,
      format: "custom",
      language: "javascript",
      sbom: sbom._id,
      user: userId,
    };

    const finalSbom = await storeGeneratedSbomWithRefUser(payload);
    // Delete file after parsing
    // fs.unlinkSync(packageFile.path);
    // fs.unlinkSync(reportFilePath);
    return finalSbom;
  } catch (error) {
    throw error;
  } finally {
    fs.rmSync(packageDir, { recursive: true });
  }
};

const storeSbom = async (sbomJson) => {
  const storedSbom = await SbomJsonModel.create(sbomJson);
  return storedSbom;
};

const storeGeneratedSbomWithRefUser = async (payload) => {
  const sbomGenerated = await SbomModel.create(payload);
  sbomGenerated.save();
  return sbomGenerated.toObject();
};

const generateAudit = async (packageLockFile, packageJsonFile) => {
  const packageDir = path.dirname(packageLockFile.path);

  try {
    const reportFilePath = path.join(
      packageDir,
      `reports_${packageLockFile.filename}.json`
    );
    const auditCommand = `npm audit --json --package-lock-only --package ${packageLockFile.path} > reports_${packageLockFile.filename}.json`;
    try {
      execSync(auditCommand, { cwd: packageDir, stdio: "inherit" });
    } catch (error) {}

    const reportFileBuffer = fs.readFileSync(reportFilePath);
    const report = JSON.parse(reportFileBuffer);

    return report;
  } catch (error) {
    throw error;
  } finally {
    execSync(`rm -rf ${packageDir}`);
  }
};

const getLatestPackageManager = async (parsedSbomData,userId,sbomId) => {

  const directDeps = [...parsedSbomData[0]?.dependencies?.[0]?.dependencies];

  let packagedNames = directDeps?.map((item) => {
    return {
      name: item?.name,
      olderVersion: item?.version,
      purl: item?.purl,
      newerVersion: ""
    };
  });

  for (let pkg of packagedNames) {
    try {
      const response = await fetch(`https://registry.npmjs.org/${pkg.name}`);
      const data = await response.json();
      pkg.newerVersion = data['dist-tags'].latest;
      const updatedValues=await UpdateVulneradbilityModel.create(  {user: userId,
      sbom: sbomId,
      data: pkg
    });
      updatedValues.save()
    } catch (error) {
      console.log(error);
    }
  }

}

module.exports = { processSbom, generateAudit,getLatestPackageManager };

// const parseSbom = async (pkgJson) => {
//   const components = [];

//   const application = {
//     type: "application",
//     name: pkgJson.name,
//     version: pkgJson.version,
//     purl: `pkg:npm/${pkgJson.name}@${pkgJson.version}`,
//     dependencies: [],
//   };

//   components.push(application);

//   function addComponent(name, version, purl, dependencies = []) {
//     const component = {
//       type: "library",
//       name,
//       version,
//       purl,
//       dependencies,
//     };
//     return component;
//   }

//   function processDeps(deps, parent) {
//     if (!deps) return;

//     Object.keys(deps).forEach((name) => {
//       const version = deps?.[name]?.version || "unknown";
//       let purl = "unknown";
//       if (name && version) {
//         purl = `pkg:npm/${name}@${version}`;
//       }

//       const component = addComponent(name, version, purl);

//       if (parent) {
//         parent.dependencies.push(component);
//       }

//       processDeps(deps[name].dependencies, component);
//     });
//   }

//   processDeps(pkgJson.packages, components[0]);

//   //   const outPath = `${process.cwd()}/components.json`;
//   //   fs.writeFileSync(outPath, JSON.stringify(components, null, 2));

//   return components;
// };



