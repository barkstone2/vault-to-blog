import {Notice} from "obsidian";
import {Paths} from "../store/paths";
import {VaultToBlogSettings} from "../../main";
import fs from "fs";
import {Urls} from "../store/urls";
import AdmZip from 'adm-zip';
import {copyFile, copyFiles, removeDir, writeStreamAsync} from "./fsUtils";
import {httpGetAsync} from "./httpUtils";

export class FileUtils {
	paths: Paths;
	urls: Urls;
	settings: VaultToBlogSettings;
	constructor(paths: Paths, urls: Urls, settings: VaultToBlogSettings) {
		this.paths = paths;
		this.urls = urls;
		this.settings = settings;
	}

	async syncSourceToDest(noticeDuration: number) {
		await this.cleanSourceDest(noticeDuration);
		await this.copySourceToDest(noticeDuration);
	}

	async copySourceToDest(noticeDuration: number) {
		const sourcePath = `${this.paths.vaultPath()}/${this.settings.sourceDir}`
		try {
			await copyFiles(sourcePath, this.paths.sourceDestPath())
			new Notice('Succeeded in copying source to destination.', noticeDuration)
		} catch (error) {
			const message = `Failed to copy source to destination.\n${error.message}`;
			new Notice(message, noticeDuration)
			throw new Error(message);
		}
	}

	async cleanGitDirectory(noticeDuration: number) {
		try {
			await removeDir(this.paths.gitPath());
			new Notice('Succeeded in cleaning Git directory.', noticeDuration)
		} catch (error) {
			const message = `'Failed to clean Git directory.'\n${error.message}`;
			new Notice(message, noticeDuration)
			throw new Error(message);
		}
	}

	async cleanSourceDest(noticeDuration: number) {
		try {
			await removeDir(this.paths.sourceDestPath());
			new Notice('Succeeded in cleaning source destination.', noticeDuration)
		} catch (error) {
			const message = `Failed to clean source destination.\n${error.message}`;
			new Notice(message, noticeDuration)
			throw new Error(message);
		}
	}

	async copyTypesJson(noticeDuration: number) {
		try {
			await copyFile(this.paths.typeJsonSourcePath(), this.paths.typeJsonDestPath())
			new Notice('Succeeded in copying types.json file.', noticeDuration)
		} catch (error) {
			const message = `Failed to copy types.json file.\n${error.message}`;
			new Notice(message, noticeDuration)
			throw new Error(message);
		}
	}

	async backupGitDirectory(noticeDuration: number) {
		if (fs.existsSync(this.paths.gitPath())) {
			if (fs.existsSync(this.paths.gitBackupPath())) {
				await this.cleanGitBackupDirectory(noticeDuration);
			}
			try {
				await copyFiles(this.paths.gitPath(), this.paths.gitBackupPath())
				new Notice('Succeeded in backing up Git directory.', noticeDuration)
			} catch (error) {
				const message = `Failed to backup Git directory.\n${error.message}`;
				new Notice(message, noticeDuration)
				throw new Error(message);
			}
		}
	}

	private async cleanGitBackupDirectory(noticeDuration: number) {
		try {
			await removeDir(this.paths.gitBackupPath())
			new Notice('Succeeded in cleaning Git backup directory.', noticeDuration)
		} catch (error) {
			const message = `Failed to clean Git backup directory.\n${error.message}`;
			new Notice(message, noticeDuration)
			throw new Error(message);
		}
	}

	async restoreGitDirectory(noticeDuration: number) {
		if (fs.existsSync(this.paths.gitBackupPath())) {
			if (fs.existsSync(this.paths.gitPath())) {
				await this.cleanGitDirectory(noticeDuration);
			}
			try {
				await copyFiles(this.paths.gitBackupPath(), this.paths.gitPath())
				new Notice('Succeeded in restoring Git directory.', noticeDuration)
			} catch (error) {
				const message = `Failed to restore Git directory.\n${error.message}`;
				new Notice(message, noticeDuration)
				throw new Error(message);
			}
		}
	}

	async unzipReactApp(noticeDuration: number) {
		if (fs.existsSync(this.paths.reactZipPath())) {
			const zip = new AdmZip(this.paths.reactZipPath());
			zip.extractAllTo(this.paths.reactVersionPath(), true)
			new Notice('Succeeded in unzipping react-app.', noticeDuration)
		} else {
			new Notice('Something went wrong while unzipping react-app. Please try again.', noticeDuration)
		}
	}

	existReactApp() {
		return fs.existsSync(this.paths.reactPath())
	}

	async downloadReactApp(noticeDuration: number) {
		if (!fs.existsSync(this.paths.reactVersionPath())) {
			fs.mkdirSync(this.paths.reactVersionPath(), {recursive: true})
		}
		if (!fs.existsSync(this.paths.reactZipPath())) {
			new Notice('Started to download react-app.', noticeDuration)
			await this.doDownloadReactApp(this.urls.reactAppUrl(), noticeDuration);
		}
	}

	private async doDownloadReactApp(url: string, noticeDuration: number) {
		try {
			const response = await httpGetAsync(url)
			if (response.statusCode === 302 || response.statusCode === 301) {
				await this.doDownloadReactApp(response.headers.location as string, noticeDuration);
			} else if (response.statusCode === 200) {
				await writeStreamAsync(response, this.paths.reactZipPath());
				new Notice(`Succeeded in downloading react-app.`, noticeDuration)
			}
		} catch (error) {
			const message = `Failed to download react-app.`;
			new Notice(message, noticeDuration);
			console.error(message, error);
		}
	}
}