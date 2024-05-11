import inquirer from "inquirer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import shell from "shelljs";
import semver from "semver";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const questions = [
  {
    name: 'Init',
    message: 'What do you want to do?',
    type: 'list',
    choices: ['Generate Docs', 'Build', 'Release', 'Run Storybook'],
  },
  {
    name: "ReleaseType",
    message: "Please choose a release type",
    type: "list",
    choices: [
      'not-release',
      "manual",
      "major",
      "minor",
      "patch",
      "premajor",
      "preminor",
      "prepatch",
      "prerelease",
    ],
    when: (answers) => answers["Init"] === "Release",
  },
  {
    name: "InputVersion",
    message: "Enter new version release:",
    type: "input",
    when: (answers) => answers["ReleaseType"] === "manual",
  },
];

const releaseAction = (answers) => {
  if (answers["ReleaseType"] === "not-release") {
    console.log("No release will be made");
    process.exit(0);
  }
  if (answers["ReleaseType"] === "manual") {
    const packageJSONPath = path.join(__dirname, "package.json");
    const packageJSON = JSON.parse(fs.readFileSync(packageJSONPath, "utf8"));
    packageJSON.version = answers["InputVersion"];
    fs.writeFileSync(packageJSONPath, JSON.stringify(packageJSON, null, 2));
  }
  console.log(answers["ReleaseType"])
  if (answers["ReleaseType"] !== "manual") {

    const __dirname = path.dirname(fileURLToPath(import.meta.url));

    // Read package.json
    const buildJsonPath = path.join(__dirname, "package.json");
    const buildJson = JSON.parse(fs.readFileSync(buildJsonPath, "utf8"));
    if (answers["ReleaseType"].includes("pre")) {
      buildJson.version = semver.inc(
        buildJson.version,
        answers["ReleaseType"],
        'beta',
        0
      );
    }
    // Update version using semantic versioning
    buildJson.version = semver.inc(buildJson.version, answers["ReleaseType"]); // increment patch version

    // Write back to build.json
    fs.writeFileSync(buildJsonPath, JSON.stringify(buildJson, null, 2));
  }
  shell.exec("npm publish --access public");
}
inquirer.prompt([...questions]).then(async (answers) => {
  if (answers["Init"] === "Release") {
    releaseAction(answers);
  }
  if (answers["Init"] === "Build") {
    shell.exec("yarn build");
  }
  if (answers["Init"] === "Generate Docs") {
    shell.exec("yarn generate-md");
  }
  if (answers["Init"] === "Run Storybook") {
    shell.exec("yarn storybook");
  }
});
