import {Notice} from "obsidian";
import OTBPlugin, {ObsidianToBlogSettings} from "../../main";
import {findFiles} from "./fsUtils";
import simpleGit from 'simple-git';

const git = simpleGit();
export class GitUtils {
	plugin: OTBPlugin;
	settings: ObsidianToBlogSettings;
	constructor(plugin: OTBPlugin, settings: ObsidianToBlogSettings) {
		this.plugin = plugin;
		this.settings = settings;
	}

	async initializeGit(options: { cwd: string }, noticeDuration: number) {
		try {
			await git.cwd(options.cwd);
			await git.init()
			new Notice('Succeeded in initializing Git.', noticeDuration)
		} catch (error) {
			const message = `Failed to initialize Git.\n${error.message}`;
			new Notice(message, noticeDuration)
			console.error(message)
		}
	}

	async addRemote(options: { cwd: string }, noticeDuration: number) {
		try {
			await git.cwd(options.cwd);
			await git.addRemote('blog', this.settings.repositoryUrl);
			new Notice('Succeeded in adding remote.', noticeDuration);
		} catch (error) {
			const message = `Failed to add remote. Make sure a remote named 'blog' is available.\n ${error.message}`;
			new Notice(message, noticeDuration);
			console.error(message)
		}
	}

	async removeRemote(options: { cwd: string }, noticeDuration: number) {
		try {
			await git.cwd(options.cwd);
			await git.removeRemote('blog');
			new Notice('Succeeded in removing remote.', noticeDuration)
		} catch (error) {
			const message = `Failed to remove remote.\n${error.message}`;
			new Notice(message, noticeDuration);
			console.error(message)
		}
	}

	async stageAllChanges(options: { cwd: string }, noticeDuration: number) {
		try {
			await git.cwd(options.cwd);
			await git.add('.');
			new Notice('Succeeded in staging all changes.', noticeDuration)
		} catch (error) {
			const message = `Failed to stage all changes.\n${error.message}`;
			new Notice(message, noticeDuration);
			console.error(message)
		}
	}

	async commitChanges(options: {cwd: string}, noticeDuration: number, message = "Blog published by OTB") {
		try {
			await git.cwd(options.cwd);
			await git.commit(message);
			new Notice('Succeeded in committing changes.', noticeDuration)
		} catch (error) {
			const message = `Failed to commit changes. There might be no changes to commit.\n${error.message}`;
			new Notice(message, noticeDuration)
			console.error(message)
		}
	}

	async pushToRemote(options: { cwd: string }, noticeDuration: number) {
		try {
			await git.cwd(options.cwd);
			await git.push('blog', 'main', {'-f' : null});
			new Notice('Succeeded in pushing to remote.', noticeDuration)
		} catch (error) {
			const message = `Failed to pushing to remote. There might be no changes to push.\n${error.message}`;
			new Notice(message, noticeDuration)
			console.error(message)
		}
	}

	async stageReactApp(options: { cwd: string }, noticeDuration: number) {
		try {
			const files = await findFiles(options.cwd, 'public/sources');
			await git.cwd(options.cwd);
			await git.add(files);
			new Notice('Succeeded in staging react-app.', noticeDuration)
		} catch (error) {
			const message = `Failed to stage react-app.\n${error.message}`;
			new Notice(message, noticeDuration);
			console.error(message)
		}
	}

	async isRemoteValid(remoteURL:string) {
		try {
			await git.listRemote({[remoteURL]: null})
			return true;
		} catch {
			return false;
		}
	}
}
