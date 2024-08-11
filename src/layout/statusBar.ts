import ObsidianToBlog from "../../main";
import {Notice} from "obsidian";

export class StatusBar {
	private iconSrc = 'https://raw.githubusercontent.com/barkstone2/obsidian-to-blog/main/react-app/public/favicon.ico'
	constructor(private statusBarEl: HTMLElement, private readonly plugin: ObsidianToBlog) {
		statusBarEl.createEl('img', {cls: 'status-bar-icon', attr: {src: this.iconSrc}})
		statusBarEl.addClass('mod-clickable')
		statusBarEl.ariaLabel = 'Publish to GitHub Page.';
		statusBarEl.setAttribute("data-tooltip-position", "top");
		statusBarEl.onClickEvent(async () => {
			if (this.plugin.settings.isActivated) {
				this.plugin.publishBlog();
			} else {
				new Notice("Activate before publishing.")
			}
		})
	}

	activate() {
		this.statusBarEl.removeClass('grayscale')
	}

	inactivate() {
		this.statusBarEl.addClass('grayscale')
	}
}