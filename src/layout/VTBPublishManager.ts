import {App, ButtonComponent, Modal} from "obsidian";

enum VTBPublishManagerMode {
    Publish, Unpublish
}

export class VTBPublishManager extends Modal {
    private mode : VTBPublishManagerMode = VTBPublishManagerMode.Publish

    constructor(app: App) {
        super(app);
        this.renderManager();
    }

    private renderManager = () => {
        const {contentEl, titleEl} = this;
        contentEl.addClass(this.mode == VTBPublishManagerMode.Publish ? 'vtb-publish-mode' : 'vtb-unpublish-mode')
        titleEl.setText('VTB Publish Manager')

        const tabContainer = contentEl.createDiv({cls: ['vtb-publish-manager-tab-container']});
        const tabHeaders = tabContainer.createDiv({cls: ['vtb-publish-manager-tab-headers']});

        const publishTab = this.createPublishTab(tabHeaders, tabContainer);
        const unpublishTab = this.createUnpublishTab(tabHeaders, tabContainer);
        this.createSelectedCountContainer(tabContainer);
        this.bindTabClickEvent(publishTab, unpublishTab, contentEl);
        this.createCommitMessageEditor(contentEl);

        const buttonContainer = contentEl.createDiv({cls: ['vtb-publish-manager-button-container']});
        this.createPublishButton(buttonContainer);
        this.createUnpublishButton(buttonContainer);
        this.createClearButton(buttonContainer);
    }

    private createSelectedCountContainer = (tabContainer: HTMLDivElement) => {
        const selectedCountContainer = tabContainer.createDiv({cls: ['vtb-publish-manager-selected-counts-container']});
        selectedCountContainer.createSpan({text: '0', cls: ['vtb-publish-manager-selected-counts']})
        selectedCountContainer.createSpan({text: ' selected'})
    }

    private createPublishTab = (tabHeaders: HTMLElement, tabContainer: HTMLElement) => {
        const publishTab = tabHeaders.createDiv({cls: ['vtb-publish-manager-tab']});
        publishTab.createDiv({cls: ['vtb-publish-manager-tab-title', 'vtb-publish-manager-publish-tab-title'], text: 'Publish'})
        tabContainer.createDiv({cls: ['vtb-publish-manager-tab-content', 'vtb-publish-tab']});
        return publishTab;
    }

    private createUnpublishTab = (tabHeaders: HTMLElement, tabContainer: HTMLElement) => {
        const unpublishTab = tabHeaders.createDiv({cls: ['vtb-publish-manager-tab']});
        unpublishTab.createDiv({cls: ['vtb-publish-manager-tab-title', 'vtb-publish-manager-unpublish-tab-title'], text: 'Unpublish'})
        tabContainer.createDiv({cls: ['vtb-publish-manager-tab-content', 'vtb-unpublish-tab']});
        return unpublishTab;
    }

    private bindTabClickEvent = (publishTab: HTMLElement, unpublishTab: HTMLElement, contentEl: HTMLElement) => {
        publishTab.onclick = () => {
            this.clearSelection();
            contentEl.removeClass('vtb-unpublish-mode')
            contentEl.addClass('vtb-publish-mode')
            this.mode = VTBPublishManagerMode.Publish
        }

        unpublishTab.onclick = () => {
            this.clearSelection();
            contentEl.removeClass('vtb-publish-mode')
            contentEl.addClass('vtb-unpublish-mode')
            this.mode = VTBPublishManagerMode.Unpublish
        }
    }

    private clearSelection = () => {
        document.getElementsByClassName('vtb-publish-manager-selected-counts')[0].setText('0');
        const trees = document.getElementsByClassName('vtb-publish-manager-tree');
        for (let i = 0; i < trees.length; i++) {
            const tree = trees[i];
            const checkboxes = tree.querySelectorAll('input[type=checkbox]');
            checkboxes.forEach((it: HTMLInputElement) => {
                it.checked = false;
                it.indeterminate = false;
            })
        }
    }

    private createCommitMessageEditor = (contentEl: HTMLElement) => {
        const commitMessageContainer = contentEl.createDiv({cls: ['vtb-publish-manager-commit-message-container']});
        commitMessageContainer.createEl('textarea', {
            cls: 'vtb-publish-manager-commit-message-editor',
            attr: {placeholder: 'Blog published by VTB'}
        });
    }

    private createPublishButton = (buttonContainer: HTMLDivElement) => {
        const persistButton = new ButtonComponent(buttonContainer);
        persistButton.setButtonText('Publish')
        persistButton.setCta()
        persistButton.buttonEl.addClasses(['vtb-publish-manager-elements', 'vtb-publish-manager-publish-elements'])
    }

    private createUnpublishButton = (buttonContainer: HTMLDivElement) => {
        const unpublishButton = new ButtonComponent(buttonContainer);
        unpublishButton.setButtonText('Unpublish')
        unpublishButton.setWarning()
        unpublishButton.buttonEl.addClasses(['vtb-publish-manager-elements', 'vtb-publish-manager-unpublish-elements'])

        unpublishButton.onClick(() => {
            if (confirm('Are you sure you want to unpublish selected posts?')) {

            }
        })
    }

    private createClearButton = (buttonContainer: HTMLDivElement) => {
        const clearButton = new ButtonComponent(buttonContainer);
        clearButton.setButtonText('Clear')
        clearButton.onClick(this.clearSelection)
    }
}