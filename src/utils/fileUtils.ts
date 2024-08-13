import {spawn} from "child_process";
import {Notice} from "obsidian";
import {Paths} from "../store/paths";
import {ObsidianToBlogSettings} from "../../main";

export class FileUtils {
	paths: Paths;
	settings: ObsidianToBlogSettings;
	constructor(paths: Paths, settings: ObsidianToBlogSettings) {
		this.paths = paths;
		this.settings = settings;
	}

	async syncSourceToDest(noticeDuration: number) {
		await this.cleanSourceDest(noticeDuration);
		await this.copySourceToDest(noticeDuration);
	}

	async copySourceToDest(noticeDuration: number) {
		const sourcePath = `${this.paths.vaultPath}/${this.settings.sourceDir}`
		return new Promise(resolve => {
			let child;
			if (process.platform === 'win32') {
				child = spawn('xcopy', [sourcePath, this.paths.sourceDestPath, '/e', '/i']);
			} else {
				child = spawn('cp', ['-r', sourcePath, this.paths.sourceDestPath]);
			}
			child.on('error', (error) => {
				const message = `Failed to start the process of copying source to destination.\n${error.message}`;
				new Notice(message, noticeDuration)
				console.log(message)
			})
			child.on('close', (code) => {
				if (code === 0) {
					resolve(true);
					new Notice('Succeeded in copying source to destination.', noticeDuration)
				} else {
					new Notice('Failed to copy source to destination.')
				}
			})
		});
	}

	async cleanGitDirectory(noticeDuration: number) {
		return new Promise(resolve => {
			let child;
			if (process.platform === 'win32') {
				child = spawn('rd', ['/s', '/q', this.paths.gitPath]);
			} else {
				child = spawn('rm', ['-rf', this.paths.gitPath]);
			}
			child.on('error', (error) => {
				const message = `Failed to start the process of cleaning Git directory.\n${error.message}`;
				new Notice(message, noticeDuration)
				console.log(message)
			})
			child.on('close', (code) => {
				if (code === 0) {
					resolve(true);
					new Notice('Succeeded in cleaning Git directory.', noticeDuration)
				} else {
					new Notice('Failed to clean Git directory.', noticeDuration)
				}
			})
		});
	}

	async cleanSourceDest(noticeDuration: number) {
		return new Promise(resolve => {
			let child;
			if (process.platform === 'win32') {
				child = spawn('rd', ['/s', '/q', this.paths.sourceDestPath]);
			} else {
				child = spawn('rm', ['-rf', this.paths.sourceDestPath]);
			}
			child.on('error', (error) => {
				const message = `Failed to start the process of cleaning source destination.\n${error.message}`;
				new Notice(message, noticeDuration)
				console.log(message)
			})
			child.on('close', (code) => {
				if (code === 0) {
					resolve(true);
					new Notice('Succeeded in cleaning source destination.', noticeDuration)
				} else {
					new Notice('Failed to clean source destination.', noticeDuration)
				}
			})
		});
	}

	async copyTypesJson(noticeDuration: number) {
		const sourcePath = `${this.paths.vaultPath}/.obsidian/types.json`
		return new Promise(resolve => {
			let child;
			if (process.platform === 'win32') {
				child = spawn('xcopy', [sourcePath, this.paths.sourcePublicPath, '/e', '/i']);
			} else {
				child = spawn('cp', ['-r', sourcePath, this.paths.sourcePublicPath]);
			}
			child.on('error', (error) => {
				const message = `Failed to start the process of copying types.json file.\n${error.message}`;
				new Notice(message, noticeDuration)
				console.log(message)
			})
			child.on('close', (code) => {
				if (code === 0) {
					resolve(true);
					new Notice('Succeeded in copying types.json file.', noticeDuration)
				} else {
					new Notice('Failed to copy types.json file.')
				}
			})
		});
	}
}