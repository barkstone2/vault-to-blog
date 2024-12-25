import {App, FileSystemAdapter} from "obsidian";
import {VaultToBlogSettings} from "../../main";

export class Paths {
	app: App;
	configDir;
	vaultPath;
	pluginPath;
	gitBackupPath;
	typeJsonSourcePath;
	reactRootPath;
	reactVersionPath;
	reactPath;
	reactZipPath;
	gitPath
	sourceDestPath;
	sourcePublicPath;
	typeJsonDestPath;
	dataJsonSourcePath;
	dataJsonDestDirPath;
	dataJsonDestPath;

	constructor(app: App, settings: VaultToBlogSettings) {
		this.app = app;
		this.configDir = () => app.vault.configDir
		this.vaultPath = () => this.getVaultPath();
		this.pluginPath = () => `${this.vaultPath()}/${this.configDir()}/plugins/vault-to-blog`;
		this.gitBackupPath = () => `${this.pluginPath()}/.git-backup`
		this.typeJsonSourcePath = () => `${this.vaultPath()}/${this.configDir()}/types.json`;

		this.reactRootPath = () => `${this.pluginPath()}/react-app`
		this.reactVersionPath = () => `${this.reactRootPath()}/${settings.version}`
		this.reactPath = () => `${this.reactVersionPath()}/react-app`;
		this.reactZipPath = () => `${this.reactVersionPath()}/react-app.zip`
		this.gitPath = () => `${this.reactPath()}/.git`;
		this.sourceDestPath = () => `${this.reactPath()}/public/sources`;
		this.sourcePublicPath = () => `${this.reactPath()}/public`;
		this.typeJsonDestPath = () => `${this.sourcePublicPath()}/types.json`;

		this.dataJsonSourcePath = () => `${this.pluginPath()}/data.json`;
		this.dataJsonDestDirPath = () => `${this.reactPath()}/src/stores`;
		this.dataJsonDestPath = () => `${this.dataJsonDestDirPath()}/data.json`;
	}

	private getVaultPath() {
		const adapter = this.app.vault.adapter;
		if (adapter instanceof FileSystemAdapter) {
			return adapter.getBasePath();
		}
		return '/';
	}
}
