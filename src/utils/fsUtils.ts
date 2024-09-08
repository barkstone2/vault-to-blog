import fs, {promises as fsPromises} from "fs";
import { Readable } from 'stream';
import path from "path";

export async function findFiles(dir: string, excludeDir: string): Promise<string[]> {
    let results: string[] = [];
    let files: string[];
    try {
        files = await fsPromises.readdir(dir);
    } catch (error) {
        console.error(`Failed to read directory: ${dir}, Error: ${error.message}`)
        return [];
    }

    for (const file of files) {
        const fullPath = path.join(dir, file);
        let stat;
        try {
            stat = await fsPromises.stat(fullPath);
        } catch (error) {
            console.error(`Failed to get stats for file: ${fullPath}, Error: ${error.message}`);
            return [];
        }

        if (stat.isDirectory()) {
            if (fullPath.includes(excludeDir)) continue;
            const subResults = await findFiles(fullPath, excludeDir);
            results = results.concat(subResults);
        } else {
            results.push(fullPath);
        }
    }
    return results;
}

export async function removeDir(path: string) {
    await fsPromises.rm(path, { recursive: true, force: true });
}

export async function removeFiles(paths: string[]) {
    for (const it of paths) {
        await fsPromises.rm(it);
    }
}

export async function copyFile(src: string, dest: string) {
    await fsPromises.copyFile(src, dest);
}

export async function copyFiles(src: string, dest: string) {
    await fsPromises.mkdir(dest, { recursive: true });
    const entries = await fsPromises.readdir(src, { withFileTypes: true });
    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            await copyFiles(srcPath, destPath);
        } else {
            await fsPromises.copyFile(srcPath, destPath);
        }
    }
}

export async function writeStreamAsync(sourceStream: Readable, filePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const fileStream = fs.createWriteStream(filePath);
        sourceStream.pipe(fileStream)

        fileStream.on('finish', () => {
            fileStream.close();
            resolve();
        });

        fileStream.on('error', (err: Error) => {
            reject(err);
        });

        sourceStream.on('error', (err: Error) => {
            fileStream.close();
            reject(err);
        });
    })
}