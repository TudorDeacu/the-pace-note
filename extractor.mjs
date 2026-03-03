import fs from 'fs';
import path from 'path';

function findFiles(dir, fileList = []) {
    fs.readdirSync(dir).forEach(file => {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            findFiles(filePath, fileList);
        } else if (filePath.endsWith('.tsx')) {
            fileList.push(filePath);
        }
    });
    return fileList;
}

const files = [...findFiles('./app'), ...findFiles('./components')];
const matches = new Set();
// Also match <T>Text</T> including whitespace
const regex = /<T>\s*([\s\S]*?)\s*<\/T>/g;

files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    let match;
    while ((match = regex.exec(content)) !== null) {
        matches.add(match[1]);
    }
});

console.log(JSON.stringify(Array.from(matches), null, 2));
