import {App, FileSystemAdapter} from "obsidian";
import {VaultToBlogSettings} from "../../main";

export class Paths {
	app: App;
	configDir;
	vaultPath;
	pluginPath;
	gitBackupPath;
	typeJsonSourcePath;
	reactVersionPath;
	reactPath;
	reactZipPath;
	gitPath
	sourceDestPath;
	sourcePublicPath;
	typeJsonDestPath;
	dataJsonSourcePath;
	dataJsonDestPath;

	constructor(app: App, settings: VaultToBlogSettings) {
		this.app = app;
		this.configDir = () => app.vault.configDir
		this.vaultPath = () => this.getVaultPath();
		this.pluginPath = () => `${this.vaultPath()}/${this.configDir()}/plugins/vault-to-blog`;
		this.gitBackupPath = () => `${this.pluginPath()}/.git-backup`
		this.typeJsonSourcePath = () => `${this.vaultPath()}/${this.configDir()}/types.json`;

		this.reactVersionPath = () => `${this.pluginPath()}/react-app/${settings.version}`
		this.reactPath = () => `${this.reactVersionPath()}/react-app`;
		this.reactZipPath = () => `${this.reactVersionPath()}/react-app.zip`
		this.gitPath = () => `${this.reactPath()}/.git`;
		this.sourceDestPath = () => `${this.reactPath()}/public/sources`;
		this.sourcePublicPath = () => `${this.reactPath()}/public`;
		this.typeJsonDestPath = () => `${this.sourcePublicPath()}/types.json`;

		this.dataJsonSourcePath = () => `${this.pluginPath()}/data.json`;
		this.dataJsonDestPath = () => `${this.reactPath()}/src/stores/data.json`;
	}

	private getVaultPath() {
		const adapter = this.app.vault.adapter;
		if (adapter instanceof FileSystemAdapter) {
			return adapter.getBasePath();
		}
		return '/';
	}
}
