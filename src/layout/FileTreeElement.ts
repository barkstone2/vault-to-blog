export class FileTreeElement {
    displayName: string
    path: string
    isFile: boolean
    isRoot = false
    children: Map<string, FileTreeElement> = new Map()
    parent: FileTreeElement
    element: HTMLInputElement

    constructor(name: string, path: string, isFile = false, isRoot = false) {
        this.displayName = name;
        this.path = path;
        this.isFile = isFile;
        this.isRoot = isRoot
    }

    public renderFileTree = (treeContainerEl: HTMLElement, inputOnclick: () => void): number => {
        let result = this.isFile ? 1 : 0;
        const part = createDiv({cls: 'vtb-publish-manager-tree-part'})
        const row = part.createDiv({cls: ['vtb-publish-manager-tree-row', this.isFile ? 'vtb-publish-manager-tree-file-row' : '']})
        const collapseIcon = this.createCollapseIcon(row);
        collapseIcon.onclick = () => {
            part.toggleClass('vtb-publish-manager-tree-part-collapsed', !part.hasClass('vtb-publish-manager-tree-part-collapsed'));
            collapseIcon.toggleClass('is-collapsed', !collapseIcon.hasClass('is-collapsed'));
        }

        const htmlInputElement = row.createEl('input');
        htmlInputElement.type = 'checkbox';
        htmlInputElement.value = this.path;
        htmlInputElement.addClass('vtb-publish-manager-tree-checkbox')
        htmlInputElement.setAttribute('vtb-data-type', this.isFile ? 'file' : 'directory');
        this.element = htmlInputElement;
        htmlInputElement.onclick = () => {
            if (!this.isFile) {
                this.checkChildren()
            }
            inputOnclick()
            this.checkParent();
        }

        this.children.forEach(ftp => {
            result += ftp.renderFileTree(part, inputOnclick)
        })

        const displayName = row.createSpan({text: this.displayName, cls: this.isRoot ? 'vtb-publish-manager-tree-part-root-title' : 'vtb-publish-manager-tree-part-title'});
        if (!this.isFile) {
            displayName.createSpan({text: `${result} files`, cls: 'vtb-publish-manager-tree-file-count'})
        }

        treeContainerEl.append(part)
        return result;
    }

    private createCollapseIcon = (row: HTMLElement) => {
        const collapseIcon = row.createDiv({cls: ['collapse-icon', 'vtb-publish-manager-tree-part-collapse-icon']});
        const svg = collapseIcon.createSvg('svg', {
            cls: ['svg-icon', 'right-triangle'],
            attr: {
                xmlns: 'http://www.w3.org/2000/svg',
                width: '24',
                height: '24',
                viewBox: '0 0 24 24',
                fill: 'none',
                stroke: 'currentColor',
                'stroke-width': '2',
                'stroke-linecap': 'round',
                'stroke-linejoin': "round"
            }
        });
        svg.createSvg('path', {attr: {'d': 'M3 8L12 17L21 8'}})
        return collapseIcon;
    }

    public checkChildren = () => {
        this.children.forEach((value) => {
            value.element.checked = this.element.checked;
            if (this.element.checked) {
                value.element.indeterminate = false;
            }
            value.checkChildren();
        })
    }

    public checkParent = async () => {
        const parent = this?.parent;
        if (!parent) return;
        let checkedCount = 0;
        let indeterminateCount = 0;
        parent.children.forEach((value) => {
            if (value.element.checked) checkedCount++;
            if (value.element.indeterminate) indeterminateCount++;
        })
        if (checkedCount == 0 && indeterminateCount == 0) {
            parent.element.checked = false;
            parent.element.indeterminate = false;
        } else if (checkedCount == parent.children.size) {
            parent.element.checked = true
            parent.element.indeterminate = false;
        } else {
            parent.element.checked = false;
            parent.element.indeterminate = true;
        }
        parent.checkParent();
    }

    public static parseFileNamesToTree = (fileNames: string[], rootName: string): FileTreeElement => {
        const rootPath = 'public/sources/'
        const root = new FileTreeElement(rootName, rootPath, false, true);
        fileNames.forEach((fileName) => {
            const shortPath = fileName.replace(rootPath, '');
            const split = shortPath.split('/')
            let currentDirectory = root;
            let path = rootPath.slice(0, -1);
            for (let i = 0; i < split.length; i++) {
                const partName = split[i];
                path += `/${partName}`;
                const isFile = i == split.length - 1;
                const child = currentDirectory.children.get(partName) ?? new FileTreeElement(partName, path, isFile);
                child.parent = currentDirectory;
                if (isFile) {
                    currentDirectory.children.set(partName, child)
                } else {
                    if (!currentDirectory.children.has(partName)) {
                        currentDirectory.children.set(partName, child)
                    }
                    currentDirectory = child;
                }
            }
        })
        return root;
    }
}