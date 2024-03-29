const fs = require("fs");
const path = require("path");
const parser = require("@babel/parser");
const jsFilesExtensions = ['js']

function getJavaScriptFiles(dir) {
        let results = [];
    const list = fs.readdirSync(dir);
  
    list.forEach(function (file) {
      file = path.join(dir, file);
      const stat = fs.statSync(file);
  
      if (stat && stat.isDirectory()) {
        results = results.concat(getJavaScriptFiles(file));
      } else {
        if (jsFilesExtensions.includes(path.extname(file))) {
          results.push(file);
        }
      }
    });
  
    return results;
}
  
function getImports(file) {
    const code = fs.readFileSync(file, "utf-8");
    const ast = parser.parse(code, { sourceType: "module", plugins: ["jsx", "flow"] });
  
    const imports = ast.program.body
      .filter((node) => node.type === "ImportDeclaration")
      .map((node) => ({
        source: node.source.value,
        specifiers: node.specifiers.map((specifier) => ({
          localName: specifier.local.name,
          importedName:
            specifier.type === "ImportDefaultSpecifier"
              ? "default"
              : specifier.type === "ImportSpecifier"
              ? specifier.imported.name
              : "*",
        })),
      }))
      .filter(({ specifiers }) => specifiers.some(({ localName }) => /^[A-Z]/.test(localName)));
  
    return imports;
}
  
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