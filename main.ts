import {Plugin} from 'obsidian';
import {Paths} from "./src/store/paths";
import {StatusBar} from "./src/layout/statusBar";

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
	async onload() {
		await this.loadSettings();
		await this.loadPaths();
		this.statusBar = new StatusBar(this.addStatusBarItem(), this);
		await this.renderStatusBar()
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
}