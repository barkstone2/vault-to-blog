import {promises as fsPromises} from "fs";
import path from "path";

class FsUtils {
    async findFiles(dir: string, excludeDir: string): Promise<string[]> {
        let results: string[] = [];
        const files = await fsPromises.readdir(dir);

        for (const file of files) {
            const fullPath = path.join(dir, file);
            const stat = await fsPromises.stat(fullPath);

            if (stat.isDirectory()) {
                if (fullPath.includes(excludeDir)) continue;
                const subResults = await this.findFiles(fullPath, excludeDir);
                results = results.concat(subResults);
            } else {
                results.push(fullPath);
            }
        }
        return results;
    }
}

export default new FsUtils();
