import {App, PluginSettingTab, Setting} from "obsidian";
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
		containerEl.addClass('setting-container')

		const propertiesContainer = containerEl.createDiv({cls: 'property-container'})
		this.createSourceDirSetting(propertiesContainer)
		this.createRepositoryUrlSetting(propertiesContainer);
		containerEl.append(propertiesContainer)
	}

	private createSourceDirSetting(containerEl: HTMLElement) {
		const desc = new DocumentFragment();
		desc.createDiv({text: 'Select a directory to publish to GitHub Pages.'});
		desc.createDiv({text: 'This must be selected before activating.', cls: 'warning'});
		const setting = new Setting(containerEl)
			.setName('Source Dir')
			.setDesc(desc)
			.setTooltip('Select a directory that contains markdown files, images or other files for publishing to GitHub Pages.')
			.addSearch((cb) => {
				cb
					.setPlaceholder('Enter a directory path')
					.setValue(this.settings.sourceDir)
			})
			.addButton((cb) => {
				cb.setButtonText("Save")
			});
		this.addDefaultSettingClass(setting)
		containerEl.createDiv({cls: 'current-value', text: 'Source Dir : ' + this.settings.sourceDir});
	}

	private createRepositoryUrlSetting(containerEl: HTMLElement) {
		const desc = new DocumentFragment();
		desc.createDiv({text: 'Enter a GitHub Pages repository URL.'});
		desc.createDiv({text: 'This must be entered before activating.', cls: 'warning'});
		const setting = new Setting(containerEl)
			.setName('Repository URL')
			.setDesc(desc)
			.setTooltip('Enter a valid GitHub Pages repository URL.')
			.addText((cb) => {
				cb.setPlaceholder('Enter a repository URL.')
				cb.setValue(this.settings.repositoryUrl)
			})
			.addButton((cb) => {
				cb.setButtonText("Save")
			});
		this.addDefaultSettingClass(setting)
		containerEl.createDiv({cls: 'current-value', text: 'Repository URL : ' + this.settings.repositoryUrl});
	}

	private addDefaultSettingClass(setting: Setting) {
		setting.settingEl.addClass('setting')
		setting.controlEl.addClass('control')
		setting.nameEl.addClass('name')
		setting.descEl.addClass('desc')
		setting.infoEl.addClass('info')
	}
}
