import { describe, it, expect } from 'vitest';
import {writeFile} from "fs/promises"
import loadDir from '../src/loadDir';
import {resolve} from "path"
import path from "node:path";

describe('load workspace', () => {
    it('loads workspace', async () => {
        const workspacePath = path.join(process.cwd(), 'workspace');
        const result = await loadDir(workspacePath, workspacePath);
        const tree = {
            "tree": result
        } 
        
        const filePath2 = resolve(__dirname, "./temp/workspace_sample.json")
        await writeFile(filePath2, JSON.stringify(tree));
    });
});