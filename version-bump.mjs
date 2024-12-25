import { readFileSync, writeFileSync } from "fs";

const targetVersion = process.env.npm_package_version;

// read minAppVersion from manifest.json and bump version to target version
let manifest = JSON.parse(readFileSync("manifest.json", "utf8"));
const { minAppVersion } = manifest;
manifest.version = targetVersion;
writeFileSync("manifest.json", JSON.stringify(manifest, null, "\t"));

// update versions.json with target version and minAppVersion from manifest.json
let versions = JSON.parse(readFileSync("versions.json", "utf8"));
versions[targetVersion] = minAppVersion;
writeFileSync("versions.json", JSON.stringify(versions, null, "\t"));

// update package.json of react-app-internal with target version to target version
let packageOfReactApp = JSON.parse(readFileSync("./react-app-internal/package.json", "utf8"));
packageOfReactApp.version = targetVersion;
writeFileSync("./react-app-internal/package.json", JSON.stringify(packageOfReactApp, null, "\t"));

// update package-lock.json of react-app-internal with target version to target version
let packageLockOfReactApp = JSON.parse(readFileSync("./react-app-internal/package-lock.json", "utf8"));
packageLockOfReactApp.version = targetVersion;
packageLockOfReactApp.packages[""].version = targetVersion;
writeFileSync("./react-app-internal/package-lock.json", JSON.stringify(packageLockOfReactApp, null, "\t"));