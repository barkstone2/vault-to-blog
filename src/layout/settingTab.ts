import {App, normalizePath, Notice, PluginSettingTab, Setting, TFolder} from "obsidian";
import Awesomplete from "awesomplete";
import OTBPlugin, {ObsidianToBlogSettings} from "../../main";
import {spawn} from "child_process";

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

		const buttonContainer = containerEl.createDiv({cls: 'button-container'})
		this.createButton(buttonContainer);
		containerEl.append(buttonContainer);
	}

	private createSourceDirSetting(containerEl: HTMLElement) {
		let inputEl: HTMLInputElement;
		const directories = this.app.vault.getAllFolders(true)
			.map((it: TFolder) => normalizePath(it.path));
		const desc = new DocumentFragment();
		desc.createDiv({text: 'Select a directory to publish to GitHub Pages.'});
		desc.createDiv({text: 'This must be selected before activating.', cls: 'warning'});
		const setting = new Setting(containerEl)
			.setName('Source Dir')
			.setDesc(desc)
			.setTooltip('Select a directory that contains markdown files, images or other files for publishing to GitHub Pages.')
			.addSearch((cb) => {
				inputEl = cb.inputEl;
				const awesomplete = new Awesomplete(cb.inputEl, {
					list: directories,
					minChars: 0,
					maxItems: Number.MAX_VALUE,
					autoFirst: true,
				});

				setTimeout(() => {
					const dropdown = awesomplete.ul;
					if (dropdown) {
						dropdown.removeAttribute('aria-label');
					}
				}, 0);

				cb.inputEl.addEventListener('click', () => {
					awesomplete.evaluate();
				});

				cb.inputEl.addEventListener('focus', () => {
					awesomplete.evaluate();
				});

				cb.clearButtonEl.addEventListener('click', () => {
					awesomplete.close();
				});

				cb
					.setPlaceholder('Enter a directory path')
					.setValue(this.settings.sourceDir)
			})
			.addButton((cb) => {
				cb.setButtonText("Save")
				cb.onClick(async () => {
					if (!directories.includes(inputEl?.value)) {
						new Notice('Invalid directory path.', 3000)
						inputEl.value = this.settings.sourceDir;
						return;
					}

					this.settings.sourceDir = inputEl?.value;
					await this.plugin.saveSettings();
					this.display()
					new Notice('Setting saved.');
				})
			});
		this.addDefaultSettingClass(setting)
		containerEl.createDiv({cls: 'current-value', text: 'Source Dir : ' + this.settings.sourceDir});
	}

	private createRepositoryUrlSetting(containerEl: HTMLElement) {
		let inputEl: HTMLInputElement;
		const desc = new DocumentFragment();
		desc.createDiv({text: 'Enter a GitHub Pages repository URL.'});
		desc.createDiv({text: 'This must be entered before activating.', cls: 'warning'});
		const setting = new Setting(containerEl)
			.setName('Repository URL')
			.setDesc(desc)
			.setTooltip('Enter a valid GitHub Pages repository URL.')
			.addText((cb) => {
				inputEl = cb.inputEl;
				cb.setPlaceholder('Enter a repository URL.')
				cb.setValue(this.settings.repositoryUrl)
			})
			.addButton((cb) => {
				cb.setButtonText("Save")
				cb.onClick(async () => {
					const child = spawn('git',['ls-remote', inputEl.value]);
					child.on('error', (error) => {
						new Notice('Failed to start remote validation. Check your network.')
					})
					child.on('close', async (code) => {
						if (code === 0) {
							this.settings.repositoryUrl = inputEl.value;
							await this.plugin.saveSettings();
							new Notice('Settings saved.');
							this.display()
						} else {
							new Notice(`Invalid repository URL.`)
							inputEl.value = this.settings.repositoryUrl;
						}
					})
				})
			});
		this.addDefaultSettingClass(setting)
		containerEl.createDiv({cls: 'current-value', text: 'Repository URL : ' + this.settings.repositoryUrl});
	}

	private createButton(containerEl: HTMLDivElement) {
		const setting = new Setting(containerEl)
			.addButton((cb) => {
				cb.setButtonText('Activate')
				cb.setClass('activate-button')
				cb.setCta()
			})
			.addButton((cb) => {
				cb.setButtonText('Inactivate')
				cb.setClass('inactivate-button')
			})
		const settingEl = setting.settingEl;
		settingEl.addClass('button-row')
		settingEl.addClass(this.settings.isActivated ? 'active' : 'inactive')
		return setting;
	}

	private addDefaultSettingClass(setting: Setting) {
		setting.settingEl.addClass('setting')
		setting.controlEl.addClass('control')
		setting.nameEl.addClass('name')
		setting.descEl.addClass('desc')
		setting.infoEl.addClass('info')
	}
}
