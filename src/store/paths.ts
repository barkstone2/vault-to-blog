import {App, FileSystemAdapter} from "obsidian";
import {ObsidianToBlogSettings} from "../../main";

export class Paths {
	app: App;
	vaultPath: string;
	pluginPath: string;
	gitBackupPath: string;
	typeJsonSourcePath: string;
	reactVersionPath;
	reactPath;
	reactZipPath;
	gitPath
	sourceDestPath;
	sourcePublicPath;
	typeJsonDestPath;

	constructor(app: App, settings: ObsidianToBlogSettings) {
		this.app = app;
		this.vaultPath = this.getVaultPath();
		this.pluginPath = `${this.vaultPath}/.obsidian/plugins/obsidian-to-blog`;
		this.gitBackupPath = `${this.pluginPath}/.git-backup`
		this.typeJsonSourcePath = `${this.vaultPath}/.obsidian/types.json`;

		this.reactVersionPath = () => `${this.pluginPath}/react-app/${settings.version}`
		this.reactPath = () => `${this.reactVersionPath()}/react-app`;
		this.reactZipPath = () => `${this.reactVersionPath()}/react-app.zip`
		this.gitPath = () => `${this.reactPath()}/.git`;
		this.sourceDestPath = () => `${this.reactPath()}/public/sources`;
		this.sourcePublicPath = () => `${this.reactPath()}/public`;
		this.typeJsonDestPath = () => `${this.sourcePublicPath()}/types.json`;
	}

	private getVaultPath() {
		const adapter = this.app.vault.adapter;
		if (adapter instanceof FileSystemAdapter) {
			return adapter.getBasePath();
		}
		return '/';
	}
}
