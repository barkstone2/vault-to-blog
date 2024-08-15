import {Notice, Plugin} from 'obsidian';
import {Paths} from "./src/store/paths";
import {StatusBar} from "./src/layout/statusBar";
import {OTBSettingTab} from './src/layout/settingTab';
import {FileUtils} from "./src/utils/fileUtils";
import {GitUtils} from "./src/utils/gitUtils";
import {Urls} from "./src/store/urls";

export interface ObsidianToBlogSettings {
	sourceDir: string;
	repositoryUrl: string;
	isActivated: boolean;
	version: string;
}

const DEFAULT_SETTINGS: ObsidianToBlogSettings = {
	sourceDir: '',
	repositoryUrl: '',
	isActivated: false,
	version: '0.0.1'
};

export default class ObsidianToBlog extends Plugin {
	settings: ObsidianToBlogSettings;
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
		this.addSettingTab(new OTBSettingTab(this.app, this, this.settings, this.paths, this.gitUtils, this.fileUtils));
		await this.checkVersion();
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async checkVersion() {
		if (this.settings.version !== this.manifest.version) {
			if (this.settings.isActivated) {
				new Notice('OTB plugin is inactivated due to detection of changing version. Please reactivate.', 5000)
				await this.doInactivate();
				await this.saveSettings();
			} else {
				this.settings.version = this.manifest.version;
				await this.saveSettings();
			}
		}
	}

	async doInactivate() {
		const options = {cwd: this.paths.reactPath()};
		const noticeDuration = 5000;
		await this.gitUtils.removeRemote(options, noticeDuration);
		await this.fileUtils.cleanSourceDest(noticeDuration);
		await this.fileUtils.backupGitDirectory(noticeDuration);
		this.settings.version = this.manifest.version;
		this.settings.isActivated = false;
		await this.renderStatusBar();
		new Notice('Inactivate Succeed.', noticeDuration)
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	async loadPaths() {
		this.paths = new Paths(this.app, this.settings);
	}

	async loadUrls() {
		this.urls = new Urls(this.settings);
	}

	async renderStatusBar() {
		if (this.settings.isActivated) {
			this.statusBar.activate()
		} else {
			this.statusBar.inactivate()
		}
	}

	async publishBlog() {
		new Notice('Start publishing blog');
		const options = {cwd: this.paths.reactPath()};
		const noticeDuration = 5000
		await this.fileUtils.syncSourceToDest(noticeDuration);
		await this.fileUtils.copyTypesJson(noticeDuration);
		await this.gitUtils.stageAllChanges(options, noticeDuration)
		await this.gitUtils.commitChanges(options, noticeDuration)
		this.gitUtils.pushToRemote(options, noticeDuration).then(() => {
			new Notice('Blog published')
		});
	}

	private async loadUtils() {
		this.gitUtils = new GitUtils(this, this.settings);
		this.fileUtils = new FileUtils(this.paths, this.urls, this.settings);
	}
}