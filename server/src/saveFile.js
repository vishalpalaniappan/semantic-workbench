import fs from 'fs/promises';
import path from "node:path";

async function saveFile(fileName, folderPath, data) {
    const filePath = path.join(folderPath, fileName);
    try {
        await fs.writeFile(filePath, data);
        console.log('File saved successfully');
    } catch (err) {
        console.error('Error saving file:', err);
    }
}

export default saveFile;