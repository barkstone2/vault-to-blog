import {App, FileSystemAdapter} from "obsidian";

export class Paths {
	app: App;
	vaultPath: string;
	pluginPath: string;
	reactVersionPath: string;
	reactPath: string;
	reactZipPath: string;
	gitPath: string
	gitBackupPath: string;
	sourceDestPath: string;
	sourcePublicPath: string;
	typeJsonSourcePath: string;
	typeJsonDestPath: string;

	constructor(app: App, version: string) {
		this.app = app;
		this.vaultPath = this.getVaultPath();
		this.pluginPath = `${this.vaultPath}/.obsidian/plugins/obsidian-to-blog`;

		this.reactVersionPath = `${this.pluginPath}/react-app/${version}`
		this.reactPath = `${this.reactVersionPath}/react-app`;
		this.reactZipPath = `${this.reactVersionPath}/react-app.zip`

		this.gitPath = `${this.reactPath}/.git`;
		this.gitBackupPath = `${this.pluginPath}/.git-backup`

		this.sourceDestPath = `${this.reactPath}/public/sources`;
		this.sourcePublicPath = `${this.reactPath}/public`;

		this.typeJsonSourcePath = `${this.vaultPath}/.obsidian/types.json`;
		this.typeJsonDestPath = `${this.sourcePublicPath}/types.json`;
	}

	private getVaultPath() {
		const adapter = this.app.vault.adapter;
		if (adapter instanceof FileSystemAdapter) {
			return adapter.getBasePath();
		}
		return '/';
	}
}
