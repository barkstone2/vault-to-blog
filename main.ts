import {Plugin} from 'obsidian';
import {Paths} from "./src/store/paths";
import {StatusBar} from "./src/layout/statusBar";
import {OTBSettingTab} from './src/layout/settingTab';
import {FileUtils} from "./src/utils/fileUtils";
import {GitUtils} from "./src/utils/gitUtils";

export interface ObsidianToBlogSettings {
 sourceDir: string;
 repositoryUrl: string;
 isActivated: boolean;
}

const DEFAULT_SETTINGS: ObsidianToBlogSettings = {
 sourceDir: '',
 repositoryUrl: '',
 isActivated: false,
}

export default class ObsidianToBlog extends Plugin {
	settings: ObsidianToBlogSettings;
	statusBar: StatusBar;
	paths: Paths;
	gitUtils: GitUtils;
	fileUtils: FileUtils;

	async onload() {
		await this.loadSettings();
		await this.loadPaths();
		await this.loadUtils();
		this.statusBar = new StatusBar(this.addStatusBarItem(), this);
		await this.renderStatusBar()
		this.addSettingTab(new OTBSettingTab(this.app, this, this.settings, this.paths, this.gitUtils, this.fileUtils));
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	async loadPaths() {
		this.paths = new Paths(this.app);
	}

	async renderStatusBar() {
		if (this.settings.isActivated) {
			this.statusBar.activate()
		} else {
			this.statusBar.inactivate()
		}
	}

	private async loadUtils() {
		this.gitUtils = new GitUtils(this, this.settings);
		this.fileUtils = new FileUtils(this.paths, this.settings);
	}
}