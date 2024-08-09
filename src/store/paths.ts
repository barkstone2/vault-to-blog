import {App, FileSystemAdapter} from "obsidian";

export class Paths {
	app: App;
	vaultPath: string;
	reactPath: string;
	gitPath: string
	sourceDestPath: string;
	constructor(app: App) {
		this.app = app;
		this.vaultPath = this.getVaultPath();
		this.reactPath = `${this.vaultPath}/.obsidian/plugins/obsidian-to-blog/react-app`;
		this.gitPath = `${this.reactPath}/.git`;
		this.sourceDestPath = `${this.reactPath}/public/sources`;
	}

	private getVaultPath() {
		const adapter = this.app.vault.adapter;
		if (adapter instanceof FileSystemAdapter) {
			return adapter.getBasePath();
		}
		return '/';
	}
}
