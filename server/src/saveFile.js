import fs from 'fs/promises';
import path from "node:path";
import {DALEngine} from "dal-engine-core-js-lib-dev";
import getMapping from './getMapping.js';

async function saveFile(fileName, folderPath, data) {
    const filePath = path.join(folderPath, fileName);

    const engine = new DALEngine({
        name: "default",
        description: "Default engine",
    });

    engine.deserialize(data);

    const pythonFiles = engine.getFiles().filter(file => file.name.endsWith(".py"));

    await Promise.all(
        pythonFiles.map(async (file) => {
            const mapping = await getMapping(file.updatedContent);
            file.mapping = mapping;
        })
    );

    engine.getFiles().forEach((file) => {
        file.content = file.updatedContent;
    });

    const serializedEngine = engine.serialize();
    await fs.writeFile(filePath, serializedEngine);

    return {
        files: engine.getFiles()
    };
}
export default saveFile;