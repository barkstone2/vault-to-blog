import {spawn} from "child_process";
import {Notice} from "obsidian";
import OTBPlugin, {ObsidianToBlogSettings} from "../../main";

export class GitUtils {
	plugin: OTBPlugin;
	settings: ObsidianToBlogSettings;
	constructor(plugin: OTBPlugin, settings: ObsidianToBlogSettings) {
		this.plugin = plugin;
		this.settings = settings;
	}

	async initializeGit(options: { cwd: string }, noticeDuration: number) {
		return new Promise(resolve => {
			const child = spawn('git', ['init'], options);
			child.on('error', (error) => {
				const message = `Failed to start the process of Git initialization.\n${error.message}`;
				new Notice(message, noticeDuration)
				console.log(message)
			})
			child.on('close', (code) => {
				if (code === 0) {
					resolve(true);
					new Notice('Succeeded in initializing Git.', noticeDuration)
				} else {
					new Notice('Failed to initialize Git.', noticeDuration)
				}
			})
		});
	}

	async addRemote(options: { cwd: string }, noticeDuration: number) {
		return new Promise(resolve => {
			const child = spawn('git', ['remote', 'add', 'blog', this.settings.repositoryUrl], options);
			child.on('error', (error) => {
				const message = `Failed to start the process of adding the remote.\n ${error.message}`;
				new Notice(message, noticeDuration);
				console.log(message)
			})
			child.on('close', (code) => {
				if (code === 0) {
					resolve(true);
					new Notice('Succeeded in adding remote.', noticeDuration)
				} else {
					new Notice("Failed to add remote. Make sure a remote named 'blog' is available.", noticeDuration)
				}
			})
		});
	}

	async removeRemote(options: { cwd: string }, noticeDuration: number) {
		return new Promise(resolve => {
			const child = spawn('git', ['remote', 'remove', 'blog'], options);
			child.on('error', (error) => {
				const message = `Failed to start the process of removing the remote.\n ${error.message}`;
				new Notice(message, noticeDuration);
				console.log(message)
			})
			child.on('close', (code) => {
				if (code === 0) {
					resolve(true);
					new Notice('Succeeded in removing remote.', noticeDuration)
				} else {
					new Notice("Failed to remove remote.", noticeDuration)
				}
			})
		});
	}

	async stageAllChanges(options: { cwd: string }, noticeDuration: number) {
		return new Promise(resolve => {
			const child = spawn('git', ['add', '.'], options);
			child.on('error', (error) => {
				const message = `Failed to start the process of staging.\n${error.message}`;
				new Notice(message, noticeDuration);
				console.log(message)
			})
			child.on('close', (code) => {
				if (code === 0) {
					resolve(true);
					new Notice('Succeeded in staging all changes.', noticeDuration)
				} else {
					new Notice('Failed to stage all changes.', noticeDuration)
				}
			})
		});
	}

	async commitChanges(options: {cwd: string}, noticeDuration: number) {
		return new Promise(resolve => {
			const child = spawn('git', ['commit', '-m', 'Blog published by OTB'], options);
			child.on('error', (error) => {
				const message = `Failed to start the process of committing.\n ${error.message}`;
				new Notice(message, noticeDuration)
				console.log(message)
			});
			child.on('close', (code) => {
				if (code == 0) {
					resolve(true);
					new Notice('Succeeded in committing changes.', noticeDuration)
				} else {
					new Notice('Failed to commit changes. There might be no changes to commit.', noticeDuration)
				}
			})
		});
	}

	async pushToRemote(options: { cwd: string }, noticeDuration: number) {
		return new Promise(resolve => {
			const child = spawn('git', ['push', 'blog', 'main', '-f'], options);
			child.on('error', (error) => {
				const message = `Failed to start the process of pushing.\n${error.message}`;
				new Notice(message, noticeDuration)
				console.log(message)
			});
			child.on('close', (code) => {
				if (code == 0) {
					resolve(true);
					new Notice('Succeeded in pushing to remote.', noticeDuration)
				} else {
					new Notice('Failed to pushing to remote. There might be no changes to push.', noticeDuration)
				}
			})
		});
	}
}
