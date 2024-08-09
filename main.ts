import {Plugin} from 'obsidian';
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
	async onload() {
		await this.loadSettings();
		this.statusBar = new StatusBar(this.addStatusBarItem(), this);
		await this.renderStatusBar()
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	async renderStatusBar() {
		if (this.settings.isActivated) {
			this.statusBar.activate()
		} else {
			this.statusBar.inactivate()
		}
	}
}