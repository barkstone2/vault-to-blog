import {Notice, Plugin} from 'obsidian';
import {Paths} from "./src/store/paths";
import {StatusBar} from "./src/layout/statusBar";
import {VTBSettingTab} from './src/layout/settingTab';
import {FileUtils} from "./src/utils/fileUtils";
import {GitUtils} from "./src/utils/gitUtils";
import {Urls} from "./src/store/urls";
import {VTBPublishManager} from "./src/layout/VTBPublishManager";

export interface VaultToBlogSettings {
	sourceDir: string;
	indexFilePath: string;
	repositoryUrl: string;
	isActivated: boolean;
	version: string;
	isEnableComments: boolean;
	repo: string;
	theme: string;
}

const DEFAULT_SETTINGS: VaultToBlogSettings = {
	sourceDir: '',
	indexFilePath: '',
	repositoryUrl: '',
	isActivated: false,
	version: '0.0.1',
	isEnableComments: false,
	repo: '',
	theme: ''
};

export default class VaultToBlog extends Plugin {
	settings: VaultToBlogSettings;
	statusBar: StatusBar;
	paths: Paths;
	urls: Urls;
	gitUtils: GitUtils;
	fileUtils: FileUtils;

	async onload() {
		await this.loadSettings();
		await this.loadPaths();
		await this.loadUrls();
		await this.loadUtils();
		this.statusBar = new StatusBar(this.addStatusBarItem(), this);
		await this.renderStatusBar()
		this.addSettingTab(new VTBSettingTab(this.app, this, this.settings, this.paths, this.gitUtils, this.fileUtils));
		await this.checkVersion();
		this.registerSourceDirectoryRenameEvent();
	}

	private async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	private async loadPaths() {
		this.paths = new Paths(this.app, this.settings);
	}

	private async loadUrls() {
		this.urls = new Urls(this.settings);
	}

	private async loadUtils() {
		this.gitUtils = new GitUtils(this.paths, this.settings);
		this.fileUtils = new FileUtils(this.paths, this.urls, this.settings);
	}

	async renderStatusBar() {
		if (this.settings.isActivated) {
			this.statusBar.activate()
		} else {
			this.statusBar.deactivate()
		}
	}

	private async checkVersion() {
		if (this.settings.version !== this.manifest.version) {
			if (this.settings.isActivated) {
				new Notice('VTB plugin is deactivated due to detection of changing version. Please reactivate.', 5000)
				await this.doDeactivate();
				await this.saveSettings();
			} else {
				this.settings.version = this.manifest.version;
				await this.saveSettings();
			}

			await this.fileUtils.cleanOldReactApps();
		}
	}

	private registerSourceDirectoryRenameEvent() {
		// Don't need to release event listener when using registerEvent
		this.registerEvent(this.app.vault.on('rename', async (file, oldPath) => {
			if (oldPath == this.settings.sourceDir) {
				this.settings.sourceDir = file.path;
				await this.saveSettings();
			}
		}))
	}

	async doDeactivate() {
		const options = {cwd: this.paths.reactPath()};
		const noticeDuration = 5000;
		await this.gitUtils.removeRemote(options, noticeDuration);
		await this.fileUtils.cleanSourceDest(noticeDuration);
		await this.fileUtils.backupGitDirectory(noticeDuration);
		this.settings.version = this.manifest.version;
		this.settings.isActivated = false;
		await this.renderStatusBar();
		new Notice('Deactivate Succeed.', noticeDuration)
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}


	async openPublishManager() {
		new VTBPublishManager(this.app, this.gitUtils, this.paths, this.fileUtils).open()
	}
}
