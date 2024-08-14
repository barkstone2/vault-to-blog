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
				child = spawn('xcopy', [sourcePath, this.paths.sourceDestPath(), '/e', '/i']);
			} else {
				child = spawn('cp', ['-r', sourcePath, this.paths.sourceDestPath()]);
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
				child = spawn('rd', ['/s', '/q', this.paths.gitPath()]);
			} else {
				child = spawn('rm', ['-rf', this.paths.gitPath()]);
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
				child = spawn('rd', ['/s', '/q', this.paths.sourceDestPath()]);
			} else {
				child = spawn('rm', ['-rf', this.paths.sourceDestPath()]);
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
		return new Promise(resolve => {
			let child;
			if (process.platform === 'win32') {
				child = spawn('xcopy', [this.paths.typeJsonSourcePath, this.paths.typeJsonDestPath(), '/e', '/i']);
			} else {
				child = spawn('cp', ['-r', this.paths.typeJsonSourcePath, this.paths.typeJsonDestPath()]);
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

	async backupGitDirectory(noticeDuration: number) {
		if (fs.existsSync(this.paths.gitPath())) {
			if (fs.existsSync(this.paths.gitBackupPath)) {
				await this.cleanGitBackupDirectory(noticeDuration);
			}
			return new Promise(resolve => {
				let child;
				if (process.platform === 'win32') {
					child = spawn('xcopy', [this.paths.gitPath(), this.paths.gitBackupPath, '/e', '/i']);
				} else {
					child = spawn('cp', ['-r', this.paths.gitPath(), this.paths.gitBackupPath]);
				}
				child.on('error', (error) => {
					const message = `Failed to start the process of backing up Git directory.\n${error.message}`;
					new Notice(message, noticeDuration)
					console.log(message)
				})
				child.on('close', (code) => {
					if (code === 0) {
						resolve(true);
						new Notice('Succeeded in backing up Git directory.', noticeDuration)
					} else {
						new Notice('Failed to backup Git directory.')
					}
				})
			});
		}
	}

	private async cleanGitBackupDirectory(noticeDuration: number) {
		return new Promise(resolve => {
			let child;
			if (process.platform === 'win32') {
				child = spawn('rd', ['/s', '/q', this.paths.gitBackupPath]);
			} else {
				child = spawn('rm', ['-rf', this.paths.gitBackupPath]);
			}
			child.on('error', (error) => {
				const message = `Failed to start the process of cleaning Git backup directory.\n${error.message}`;
				new Notice(message, noticeDuration)
				console.log(message)
			})
			child.on('close', (code) => {
				if (code === 0) {
					resolve(true);
					new Notice('Succeeded in cleaning Git backup directory.', noticeDuration)
				} else {
					new Notice('Failed to clean Git backup directory.', noticeDuration)
				}
			})
		});
	}

	async restoreGitDirectory(noticeDuration: number) {
		if (fs.existsSync(this.paths.gitBackupPath)) {
			if (fs.existsSync(this.paths.gitPath())) {
				await this.cleanGitDirectory(noticeDuration);
			}
			return new Promise(resolve => {
				let child;
				if (process.platform === 'win32') {
					child = spawn('xcopy', [this.paths.gitBackupPath, this.paths.gitPath(), '/e', '/i']);
				} else {
					child = spawn('cp', ['-r', this.paths.gitBackupPath, this.paths.gitPath()]);
				}
				child.on('error', (error) => {
					const message = `Failed to start the process of restoring Git directory.\n${error.message}`;
					new Notice(message, noticeDuration)
					console.log(message)
				})
				child.on('close', (code) => {
					if (code === 0) {
						resolve(true);
						new Notice('Succeeded in restoring Git directory.', noticeDuration)
					} else {
						new Notice('Failed to restore Git directory.')
					}
				})
			});
		} else {
			return new Promise(resolve => { resolve(true) })
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
		return new Promise(resolve => {
			https.get(url, async (response) => {
				if (response.statusCode === 302 || response.statusCode === 301) {
					// @ts-ignore
					await this.doDownloadReactApp(response.headers.location);
					resolve(true)
				} else if (response.statusCode === 200) {
					const fileStream = fs.createWriteStream(this.paths.reactZipPath());
					response.pipe(fileStream);
					fileStream.on('finish', () => {
						fileStream.close();
						resolve(true)
						new Notice(`Succeeded in downloading react-app.`, noticeDuration)
					});
				}
			}).on('error', (err) => {
				const message = `Failed to download react-app.`;
				new Notice(message, noticeDuration);
				console.error(message, err);
			});
		})
	}
}