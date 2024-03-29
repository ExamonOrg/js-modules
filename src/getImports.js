import fs from 'fs';
import path from 'path';
import parser from '@babel/parser';

export default function getImports(file) {
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
