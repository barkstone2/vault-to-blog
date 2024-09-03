import {App, normalizePath, Notice, PluginSettingTab, SearchComponent, Setting, TFolder} from "obsidian";
import Awesomplete from "awesomplete";
import VTBPlugin, {VaultToBlogSettings} from "../../main";
import {Paths} from "../store/paths";
import {GitUtils} from "../utils/gitUtils";
import {FileUtils} from "../utils/fileUtils";

export class VTBSettingTab extends PluginSettingTab {
	plugin: VTBPlugin;
	paths: Paths;
	settings: VaultToBlogSettings;
	gitUtils: GitUtils;
	fileUtils: FileUtils;

	constructor(app: App, plugin: VTBPlugin, settings: VaultToBlogSettings, paths: Paths, gitUtils: GitUtils, fileUtils: FileUtils) {
		super(app, plugin);
		this.plugin = plugin;
		this.settings = settings;
		this.paths = paths;
		this.gitUtils = gitUtils;
		this.fileUtils = fileUtils;
	}

	display(): void {
		const {containerEl} = this;
		containerEl.empty();
		containerEl.addClass('vtb-setting-container')

		const propertiesContainer = containerEl.createDiv()
		this.createSourceDirSetting(propertiesContainer)
		this.createRepositoryUrlSetting(propertiesContainer);
		containerEl.append(propertiesContainer)

		const buttonContainer = containerEl.createDiv()
		this.createButton(buttonContainer);
		containerEl.append(buttonContainer);
	}

	private createSourceDirSetting(containerEl: HTMLElement) {
		let inputEl: HTMLInputElement;
		const desc = new DocumentFragment();
		desc.createDiv({text: 'Select a directory to publish to GitHub Pages.'});
		desc.createDiv({text: 'This must be selected before activating.', cls: 'vtb-warning'});
		const setting = new Setting(containerEl)
			.setName('Source Dir')
			.setDesc(desc)
			.setTooltip('Select a directory that contains markdown files, images or other files for publishing to GitHub Pages.')
			.addSearch((cb) => {
				inputEl = cb.inputEl;
				this.renderAwesomplete(cb);
				cb.setPlaceholder('Enter a directory path');
				cb.setValue(this.settings.sourceDir);
			})
			.addButton((cb) => {
				cb.setButtonText("Save")
				cb.onClick(() => this.saveSourceDirSetting(inputEl));
			});
		this.addDefaultSettingClass(setting)
		containerEl.createDiv({cls: 'vtb-current-value', text: 'Source Dir : ' + this.settings.sourceDir});
	}

	private renderAwesomplete(cb: SearchComponent) {
		const directories = this.app.vault.getAllFolders(true)
			.map((it: TFolder) => normalizePath(it.path));
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

		cb.inputEl.addEventListener('click', () => awesomplete.evaluate());
		cb.inputEl.addEventListener('focus', () => awesomplete.evaluate());
		cb.clearButtonEl.addEventListener('click', () => awesomplete.close());
	}

	private async saveSourceDirSetting(inputEl: HTMLInputElement) {
		if (!this.isValidSourceDir(inputEl?.value)) {
			new Notice('Invalid directory path.', 3000)
			inputEl.value = this.settings.sourceDir;
			return;
		}

		this.settings.sourceDir = inputEl?.value;
		await this.plugin.saveSettings();
		this.display()
		new Notice('Setting saved.');
	}

	private isValidSourceDir(sourceDir: string) {
		const directories = this.app.vault.getAllFolders(true)
			.map((it: TFolder) => normalizePath(it.path));
		return directories.includes(sourceDir);
	}

	private addDefaultSettingClass(setting: Setting) {
		setting.settingEl.addClass('vtb-setting')
		setting.controlEl.addClass('vtb-control')
		setting.nameEl.addClass('vtb-name')
		setting.descEl.addClass('vtb-desc')
		setting.infoEl.addClass('vtb-info')
	}

	private createRepositoryUrlSetting(containerEl: HTMLElement) {
		let inputEl: HTMLInputElement;
		const desc = new DocumentFragment();
		desc.createDiv({text: 'Enter a GitHub Pages repository URL.'});
		desc.createDiv({text: 'This must be entered before activating.', cls: 'vtb-warning'});
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
				cb.onClick(() => this.saveRepositoryUrlSetting(inputEl))
			});
		this.addDefaultSettingClass(setting)
		containerEl.createDiv({cls: 'vtb-current-value', text: 'Repository URL : ' + this.settings.repositoryUrl});
	}

	private async saveRepositoryUrlSetting(inputEl: HTMLInputElement) {
		if (await this.gitUtils.isRemoteValid(inputEl.value)) {
			this.settings.repositoryUrl = inputEl.value;
			await this.plugin.saveSettings();
			new Notice('Settings saved.');
			this.display()
		} else {
			new Notice(`Invalid repository URL.`)
			inputEl.value = this.settings.repositoryUrl;
		}
	}

	private createButton(containerEl: HTMLDivElement) {
		const setting = new Setting(containerEl)
			.addButton((cb) => {
				cb.setButtonText('Activate')
				cb.setClass('vtb-activate-button')
				cb.setCta()
				cb.onClick(() => this.activate())
			})
			.addButton((cb) => {
				cb.setButtonText('Inactivate')
				cb.setClass('vtb-inactivate-button')
				cb.onClick(() => this.inactivate())
			})
		const settingEl = setting.settingEl;
		settingEl.addClass('vtb-button-row')
		settingEl.addClass(this.settings.isActivated ? 'vtb-active' : 'vtb-inactive')
		return setting;
	}

	private async activate() {
		if (this.isValidSourceDir(this.settings.sourceDir) && await this.gitUtils.isRemoteValid(this.settings.repositoryUrl)) {
			await this.doActivate()
			await this.plugin.saveSettings();
			this.display()
		} else {
			new Notice('Invalid directory path or invalid repository URL.')
		}
	}

	private async inactivate() {
		await this.plugin.doInactivate()
		await this.plugin.saveSettings();
		this.display()
	}

	private async doActivate() {
		const options = {cwd: this.paths.reactPath()};
		const noticeDuration = 5000;
		if (!this.fileUtils.existReactApp()) {
			await this.fileUtils.downloadReactApp(noticeDuration);
			await this.fileUtils.unzipReactApp(noticeDuration)
			await this.fileUtils.restoreGitDirectory(noticeDuration);
			await this.gitUtils.initializeGit(options, noticeDuration);
			await this.gitUtils.addRemote(options, noticeDuration);
			await this.gitUtils.stageReactApp(options, noticeDuration);
			await this.gitUtils.commitChanges(options, noticeDuration, `Initialize react-app version ${this.plugin.manifest.version}`)
			await this.gitUtils.pushToRemote(options, noticeDuration);
		} else {
			await this.gitUtils.initializeGit(options, noticeDuration);
			await this.gitUtils.addRemote(options, noticeDuration);
		}
		await this.fileUtils.backupGitDirectory(noticeDuration);
		this.settings.isActivated = true;
		await this.plugin.renderStatusBar();
		new Notice('Activate Succeed.', noticeDuration)
	}
}
