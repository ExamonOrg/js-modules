import getImports from "./getImports";
import getJavaScriptFiles from "./getFiles";

const jsFiles = getJavaScriptFiles(process.argv[2]);

let odImports = [];

jsFiles.forEach((file) => {
  const imports = getImports(file);
  if (imports.length > 0) {
    imports.forEach((importObj) => {
      if (importObj.source === "operation-diameter") {
        let localNames = importObj["specifiers"].map((specifier) => {
          return specifier["localName"];
        });
        odImports.push({ file, localNames });
      }
    });
  }
});

function processImports(odImports) {
  const localNamesSet = new Set();
  odImports.forEach((importObj) => {
    importObj.localNames.forEach((localName) => {
      localNamesSet.add(localName);
    });
  });
  return localNamesSet;
}

// console.log(JSON.stringify(odImports, null, 2));
// console.log(processImports(odImports));