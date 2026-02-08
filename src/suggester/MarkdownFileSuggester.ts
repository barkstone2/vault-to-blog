import {AbstractInputSuggest, App, normalizePath, TFile} from "obsidian";

export class MarkdownFileSuggester extends AbstractInputSuggest<string> {
	private readonly sourceDir: string;

	constructor(app: App, inputEl: HTMLInputElement, sourceDir: string) {
		super(app, inputEl);
		this.sourceDir = sourceDir;
	}

	getSuggestions(query: string): string[] | Promise<string[]> {
		return this.app.vault.getMarkdownFiles()
			.map((it: TFile) => normalizePath(it.path))
			.filter((it) => it.startsWith(`${this.sourceDir}/`))
			.filter((it) => it.contains(query));
	}

	renderSuggestion(value: string, el: HTMLElement): void {
		el.setText(value);
	}

	selectSuggestion(value: string): void {
		this.setValue(value);
		this.close();
	}
}
