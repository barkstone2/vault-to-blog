import {spawn} from "child_process";
import {Notice} from "obsidian";
import {Paths} from "../store/paths";
import {ObsidianToBlogSettings} from "../../main";
import fs from "fs";
import * as https from "https";
import {Urls} from "../store/urls";
import AdmZip from 'adm-zip';

export class FileUtils {
	paths: Paths;
	urls: Urls;
	settings: ObsidianToBlogSettings;
	constructor(paths: Paths, urls: Urls, settings: ObsidianToBlogSettings) {
		this.paths = paths;
		this.urls = urls;
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

	async unzipTest() {
		if (fs.existsSync(this.paths.reactZipPath)) {
			const zip = new AdmZip(this.paths.reactZipPath);
			zip.extractAllTo(this.paths.reactVersionPath, true)
			new Notice('Succeeded in unzipping react-app.')
		} else {
			new Notice('Something went wrong while unzipping react-app. Please try again.')
		}
	}

	async downloadReactApp() {
		if (!fs.existsSync(this.paths.reactVersionPath)) {
			fs.mkdirSync(this.paths.reactVersionPath, {recursive: true})
		}
		if (!fs.existsSync(this.paths.reactZipPath)) {
			new Notice('Started to download react-app.')
			await this.doDownloadReactApp(this.urls.reactAppUrl);
		}
	}

	private async doDownloadReactApp(url: string) {
		return new Promise(resolve => {
			https.get(url, async (response) => {
				if (response.statusCode === 302 || response.statusCode === 301) {
					// @ts-ignore
					await this.doDownloadReactApp(response.headers.location);
					resolve(true)
				} else if (response.statusCode === 200) {
					const fileStream = fs.createWriteStream(this.paths.reactZipPath);
					response.pipe(fileStream);
					fileStream.on('finish', () => {
						fileStream.close();
						resolve(true)
						new Notice(`Succeeded in downloading react-app.`)
					});
				}
			}).on('error', (err) => {
				const message = `Failed to download react-app.`;
				new Notice(message);
				console.error(message, err);
			});
		})
	}
}