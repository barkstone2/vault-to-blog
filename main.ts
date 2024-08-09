import {Plugin} from 'obsidian';

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
	async onload() {
		await this.loadSettings();
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}