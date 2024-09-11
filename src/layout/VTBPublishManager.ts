import {App, ButtonComponent, Modal, Notice} from "obsidian";
import {GitUtils} from "../utils/gitUtils";
import {Paths} from "../store/paths";
import {FileUtils} from "../utils/fileUtils";
import {FileTreeElement} from "./FileTreeElement";

enum VTBPublishManagerMode {
    Publish, Unpublish
}

export class VTBPublishManager extends Modal {
    private gitUtils: GitUtils;
    private paths: Paths;
    private fileUtils: FileUtils;
    private options = {cwd: ''};
    private noticeDuration = 5000;
    private mode : VTBPublishManagerMode = VTBPublishManagerMode.Publish

    constructor(app: App, gitUtils: GitUtils, paths: Paths, fileUtils: FileUtils) {
        super(app);
        this.gitUtils = gitUtils;
        this.paths = paths;
        this.fileUtils = fileUtils;
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
        const publishButton = new ButtonComponent(buttonContainer);
        publishButton.setButtonText('Publish')
        publishButton.setCta()
        publishButton.buttonEl.addClasses(['vtb-publish-manager-elements', 'vtb-publish-manager-publish-elements'])
        publishButton.onClick(async () => {
            const paths = this.getSelectedFilePaths();
            if (paths.length > 0) {
                const commitMessage = this.getCommitMessage();
                await this.gitUtils.stageChanges(paths, this.options, this.noticeDuration)
                await this.gitUtils.commitChanges(this.options, this.noticeDuration, commitMessage)
                this.gitUtils.pushToRemote(this.options, this.noticeDuration).then(() => {
                    new Notice('Published successfully');
                    this.close();
                });
            }
        })
    }

    private getSelectedFilePaths = (): string[] => {
        const result: string[] = []
        const trees = document.getElementsByClassName('vtb-publish-manager-tree');
        for (let i = 0; i < trees.length; i++) {
            const tree = trees[i];
            const checkboxes = tree.querySelectorAll('input[type=checkbox]');
            checkboxes.forEach((it: HTMLInputElement) => {
                if (it.getAttr('vtb-data-type') == 'file' && it.checked) {
                    result.push(it.value);
                }
            })
        }
        return result;
    };

    private getCommitMessage = (): string | undefined => {
        // @ts-ignore
        const commitMessageEditor: HTMLInputElement = document.querySelector('.vtb-publish-manager-commit-message-editor');
        const commitMessage = commitMessageEditor.value;
        return commitMessage.length == 0 ? undefined : commitMessage;
    }

    private createUnpublishButton = (buttonContainer: HTMLDivElement) => {
        const unpublishButton = new ButtonComponent(buttonContainer);
        unpublishButton.setButtonText('Unpublish')
        unpublishButton.setWarning()
        unpublishButton.buttonEl.addClasses(['vtb-publish-manager-elements', 'vtb-publish-manager-unpublish-elements'])

        unpublishButton.onClick(async () => {
            if (confirm('Are you sure you want to unpublish selected posts?')) {
                const paths = this.getSelectedFilePaths();
                if (paths.length > 0) {
                    const commitMessage = this.getCommitMessage();
                    await this.gitUtils.removeFiles(paths, this.options, this.noticeDuration)
                    await this.gitUtils.commitChanges(this.options, this.noticeDuration, commitMessage)
                    this.gitUtils.pushToRemote(this.options, this.noticeDuration).then(() => {
                        new Notice('Unpublished successfully');
                        this.close();
                    });
                }
            }
        })
    }

    private createClearButton = (buttonContainer: HTMLDivElement) => {
        const clearButton = new ButtonComponent(buttonContainer);
        clearButton.setButtonText('Clear')
        clearButton.onClick(this.clearSelection)
    }

    async onOpen() {
        await this.prepareManager();
        this.reloadPublishTree();
        this.reloadUnpublishTree();
    }

    private prepareManager = async () => {
        this.options = {cwd: this.paths.reactPath()};
        await this.fileUtils.syncSourceToDest(this.noticeDuration);
        await this.fileUtils.copyTypesJson(this.noticeDuration);
    }

    private reloadPublishTree = async () => {
        const publishTreeEl = this.getFreshTreeElOfTab('publish');
        const changeFileNames = await this.gitUtils.getChangedFileNames(this.options);
        if (changeFileNames.length > 0) {
            this.createFileTree(changeFileNames, publishTreeEl, 'Changed Posts');
        }

        const newFileNames = await this.gitUtils.getNotTrackedFileNames(this.options);
        if (newFileNames.length > 0) {
            this.createFileTree(newFileNames, publishTreeEl, 'New Posts');
        }
    }

    private getFreshTreeElOfTab(tabName: string): HTMLElement {
        const tabContent = document.getElementsByClassName(`vtb-${tabName}-tab`)[0];
        tabContent.replaceChildren()
        return tabContent.createDiv({cls: ['vtb-publish-manager-tree', 'vtb-publish-manager-elements', `vtb-publish-manager-${tabName}-elements`]});
    }

    private reloadUnpublishTree = async () => {
        const unpublishTreeEl = this.getFreshTreeElOfTab('unpublish')
        const publishedFileNames = await this.gitUtils.getAllTrackedFileNames(this.options);
        if (publishedFileNames.length > 0) {
            this.createFileTree(publishedFileNames, unpublishTreeEl, 'Published Posts');
        }
    }

    private createFileTree = async (fileNames: string[], treeContainerEl: HTMLElement, rootName: string) => {
        const root = FileTreeElement.parseFileNamesToTree(fileNames, rootName);
        root.renderFileTree(treeContainerEl, this.setSelectedCount);
    }

    private setSelectedCount = () => {
        const selectedCountSpan = document.getElementsByClassName('vtb-publish-manager-selected-counts')[0];
        let selectedCount = 0;
        const trees = document.getElementsByClassName('vtb-publish-manager-tree');
        for (let i = 0; i < trees.length; i++) {
            const tree = trees[i];
            const checkboxes = tree.querySelectorAll('input[type=checkbox]');
            checkboxes.forEach((it: HTMLInputElement) => {
                if (it.getAttr('vtb-data-type') == 'file' && it.checked) {
                    selectedCount++;
                }
            })
        }
        selectedCountSpan.setText(selectedCount.toString());
    }
}