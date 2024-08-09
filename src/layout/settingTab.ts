import {App, PluginSettingTab} from "obsidian";
import OTBPlugin, {ObsidianToBlogSettings} from "../../main";

export class OTBSettingTab extends PluginSettingTab {
	plugin: OTBPlugin;
	settings: ObsidianToBlogSettings;

	constructor(app: App, plugin: OTBPlugin, settings: ObsidianToBlogSettings,) {
		super(app, plugin);
		this.plugin = plugin;
		this.settings = settings;
	}

	display(): void {
		const {containerEl} = this;
		containerEl.empty();
	}
}
