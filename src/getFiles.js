import fs from 'fs';

const jsFilesExtensions = ['js']

export default function getJavaScriptFiles(dir) {
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
