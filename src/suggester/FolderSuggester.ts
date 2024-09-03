import {AbstractInputSuggest, normalizePath, TFolder} from "obsidian";

export class FolderSuggester extends AbstractInputSuggest<string> {
    getSuggestions(query: string): string[] | Promise<string[]> {
        return this.app.vault.getAllFolders(true)
            .map((it: TFolder) => normalizePath(it.path))
            .filter(it => it.contains(query))
    }
    renderSuggestion(value: string, el: HTMLElement): void {
        el.setText(value);
    }

    selectSuggestion(value: string, evt: MouseEvent | KeyboardEvent) {
        this.setValue(value);
        this.close();
    }
}