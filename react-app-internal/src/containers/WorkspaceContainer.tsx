import {cloneElement, isValidElement, MouseEvent as ReactMouseEvent, ReactElement, ReactNode, useCallback, useEffect, useState} from "react";
import {WorkspaceSplitContainer} from "./WorkspaceSplitContainer";
import TreeContainer from "../components/TreeContainer";
import {WorkspaceTabs} from "../components/tab-header/WorkspaceTabs";
import {WorkspaceTabHeaderContainer} from "./WorkspaceTabHeaderContainer";
import FileExplorerTabHeader from "../components/sidebar/FileExplorerTabHeader";
import SearchTabHeader from "../components/sidebar/SearchTabHeader";
import HomeTabHeader from "../components/sidebar/HomeTabHeader";
import {WorkspaceTabHeader} from "../components/tab-header/WorkspaceTabHeader";
import {LucideList} from "lucide-react";
import {useParams} from "react-router-dom";
import {getIndexFilePath, getTocMap} from "../utils/file/fileUtils";
import {TocHeaders} from "../components/tab-header/TocHeaders";
import {SidebarRightToggleSvg} from "../components/svg/SidebarRightToggleSvg";
import {SidebarToggleButton} from "../components/SidebarToggleButton";
import {SidebarLeftToggleSvg} from "../components/svg/SidebarLeftToggleSvg";
import {HeaderOfToc} from "../types/HeaderOfToc";

export function resolveEffectiveMarkdownPath(filePath: string | undefined, indexFilePath: string): string {
    if (filePath && filePath !== '') {
        return filePath;
    }
    return indexFilePath || '';
}

export function resolveTocHeaders(
    tocMap: {[key: string]: HeaderOfToc},
    filePath: string | undefined,
    indexFilePath: string,
): HeaderOfToc[] {
    const resolvedPath = resolveEffectiveMarkdownPath(filePath, indexFilePath);
    const tocOfFile = tocMap[resolvedPath];
    return tocOfFile?.children ?? [];
}

export function normalizeTagKeyword(tagValue: string): string {
    return tagValue
        .normalize('NFC')
        .trim()
        .replace(/^#/, '')
        .toLowerCase();
}

export function createTagQuery(tagValue: string): string {
    const normalizedTag = normalizeTagKeyword(tagValue);
    return normalizedTag ? `tag:${normalizedTag}` : '';
}

export function appendTagQuery(searchKeyword: string, tagValue: string): string {
    const tagQuery = createTagQuery(tagValue);
    if (!tagQuery) {
        return searchKeyword;
    }

    const normalizedKeyword = (searchKeyword || '').trim();
    if (!normalizedKeyword) {
        return tagQuery;
    }

    const hasTagQuery = normalizedKeyword.split(/\s+/).some((token) => token.toLowerCase() === tagQuery.toLowerCase());
    if (hasTagQuery) {
        return normalizedKeyword;
    }

    return `${normalizedKeyword} ${tagQuery}`;
}

const leftSideDockOpenedClassName = 'is-left-sidedock-open';
const rightSideDockOpenedClassName = 'is-right-sidedock-open';
const defaultLeftSideDockWidth = 300;
const minLeftSideDockWidth = 220;
const maxLeftSideDockWidth = 560;

export function WorkspaceContainer({children}: {children: ReactNode}) {
    const {'*': filePath } = useParams();
    const tocMap = getTocMap() as {[key: string]: HeaderOfToc};
    const tocHeaders = resolveTocHeaders(tocMap, filePath, getIndexFilePath());

    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const mediaQuery = window.matchMedia('(max-width: 900px)');
        setIsMobile(mediaQuery.matches);

        const handleChange = (e: MediaQueryListEvent) => {
            setIsMobile(e.matches);
        };
        mediaQuery.addEventListener('change', handleChange);

        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    const [isLeftSideDockOpened, setIsLeftSideDockOpened] = useState(!isMobile);
    const [isRightSideDockOpened, setIsRightSideDockOpened] = useState(!isMobile);
    const [leftSideDockWidth, setLeftSideDockWidth] = useState(defaultLeftSideDockWidth);
    const [leftSidebarTab, setLeftSidebarTab] = useState<'file-explorer' | 'search'>('file-explorer');
    const [searchKeyword, setSearchKeyword] = useState('');
    const hasActiveSearch = searchKeyword.trim().length > 0;

    const handleTagSelected = useCallback((tagValue: string) => {
        setSearchKeyword((prevKeyword) => appendTagQuery(prevKeyword, tagValue));
        setLeftSidebarTab('search');
        if (isMobile) {
            setIsLeftSideDockOpened(true);
        }
    }, [isMobile]);

    const renderedChildren = isValidElement(children)
        ? cloneElement(children as ReactElement<{onTagSelected?: (tagValue: string) => void}>, {onTagSelected: handleTagSelected})
        : children;

    useEffect(() => {
        setIsLeftSideDockOpened(!isMobile)
        setIsRightSideDockOpened(!isMobile)
    }, [isMobile]);

    let workspaceClassName = 'workspace';
    if (isLeftSideDockOpened) {
        workspaceClassName += ' ' + leftSideDockOpenedClassName;
    }

    if (isRightSideDockOpened) {
        workspaceClassName += ' ' + rightSideDockOpenedClassName;
    }

    const handleLeftSidebarResizeMouseDown = useCallback((event: ReactMouseEvent<HTMLHRElement>) => {
        if (isMobile || !isLeftSideDockOpened) {
            return;
        }

        event.preventDefault();
        const startX = event.clientX;
        const startWidth = leftSideDockWidth;

        const handleMouseMove = (moveEvent: MouseEvent) => {
            const nextWidth = Math.min(
                maxLeftSideDockWidth,
                Math.max(minLeftSideDockWidth, startWidth + (moveEvent.clientX - startX)),
            );
            setLeftSideDockWidth(nextWidth);
        };

        const handleMouseUp = () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    }, [isLeftSideDockOpened, isMobile, leftSideDockWidth]);

    return (
        <div className={workspaceClassName}>
            <WorkspaceSplitContainer modOrientation={'mod-horizontal'}
                                     isSideDock={true}
                                     isSideDockCollapse={!isLeftSideDockOpened}
                                     width={leftSideDockWidth}
                                     onResizeMouseDown={handleLeftSidebarResizeMouseDown}
                                     modSplitDirection={'mod-left-split'}>
                <WorkspaceTabs spaceDirection={'mod-top-left-space'}>
                    <WorkspaceTabHeaderContainer
                        hasLeftDockToggleButtonOnRight={isLeftSideDockOpened}
                        leftToggleButtonIcon={
                            <SidebarToggleButton
                                direction={'mod-left'}
                                tooltipPosition={'right'}
                                toggleIcon={<SidebarLeftToggleSvg/>}
                                onClick={() => setIsLeftSideDockOpened(!isLeftSideDockOpened)}
                            />
                        }
                    >
                        <HomeTabHeader/>
                        <FileExplorerTabHeader
                            isActive={leftSidebarTab === 'file-explorer'}
                            onSelectTab={() => setLeftSidebarTab('file-explorer')}
                        />
                        <SearchTabHeader
                            isActive={leftSidebarTab === 'search'}
                            onSelectTab={() => setLeftSidebarTab('search')}
                        />
                        {/* TODO left sidebar에 다른 탭 추가될 때 주석 해제 */}
                        {/*<OutlineTabHeader title=""/>*/}
                        {/*<TagsTabHeader/>*/}
                    </WorkspaceTabHeaderContainer>
                    <div className="workspace-tab-container">
                        <div style={{display: leftSidebarTab === 'file-explorer' ? 'block' : 'none'}}>
                            <TreeContainer
                                datatype="file-explorer"
                            />
                        </div>
                        <div style={{display: leftSidebarTab === 'search' ? 'block' : 'none'}}>
                            <TreeContainer
                                datatype="search"
                                searchKeyword={searchKeyword}
                                forceExpandDirectories={hasActiveSearch}
                                showSearchInput={true}
                                onSearchKeywordChange={setSearchKeyword}
                            />
                        </div>
                    </div>
                </WorkspaceTabs>
            </WorkspaceSplitContainer>
            <WorkspaceSplitContainer modOrientation={"mod-vertical"} isSideDock={false}>
                <WorkspaceTabs>
                    <WorkspaceTabHeaderContainer
                        hasLeftDockToggleButtonOnLeft={!isLeftSideDockOpened}
                        hasRightDockToggleButtonOnRight={!isRightSideDockOpened}
                        leftToggleButtonIcon={
                            <SidebarToggleButton
                                direction={'mod-left'}
                                tooltipPosition={'right'}
                                toggleIcon={<SidebarLeftToggleSvg/>}
                                onClick={() => setIsLeftSideDockOpened(!isLeftSideDockOpened)}
                            />
                        }
                        rightToggleButtonIcon={
                            <SidebarToggleButton
                                direction={'mod-right'}
                                tooltipPosition={'left'}
                                toggleIcon={<SidebarRightToggleSvg/>}
                                onClick={() => setIsRightSideDockOpened(!isRightSideDockOpened)}
                            />
                        }
                    />
                    <div className="workspace-tab-container">
                        {/* TODO 탭 전환 기능 추가 시 leaf 단위로 처리가 필요 */}
                        <div className="workspace-leaf">
                            <hr className="workspace-leaf-resize-handle"/>
                            <div className="workspace-leaf-content" data-type="markdown" data-mode="preview">
                                {/* TODO 요청 path 기준으로 렌더링 가능 */}
                                <div className="view-header">
                                </div>
                                <div className="view-content">
                                    <div className="markdown-reading-view" style={{width: '100%', height: '100%'}}>
                                        <div
                                            className="markdown-preview-view markdown-rendered node-insert-event is-readable-line-width allow-fold-headings show-indentation-guide allow-fold-lists show-properties"
                                            tabIndex={-1} style={{tabSize: 4}}>
                                            {renderedChildren}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </WorkspaceTabs>
            </WorkspaceSplitContainer>
            <WorkspaceSplitContainer modOrientation={'mod-horizontal'} isSideDock={true}
                                     isSideDockCollapse={!isRightSideDockOpened}
                                     modSplitDirection={'mod-right-split'}>
                <WorkspaceTabs spaceDirection={'mod-top-left-space'}>
                    <WorkspaceTabHeaderContainer
                        hasRightDockToggleButtonOnLeft={isRightSideDockOpened}
                        rightToggleButtonIcon={
                            <SidebarToggleButton
                                direction={'mod-right'}
                                tooltipPosition={'left'}
                                toggleIcon={<SidebarRightToggleSvg/>}
                                onClick={() => setIsRightSideDockOpened(!isRightSideDockOpened)}
                            />
                        }
                    >
                        <WorkspaceTabHeader
                            title={`Outline of {pathname}`}
                            dataType={'outline'}
                            innerIcon={<LucideList/>}
                            activeClass={'is-active mod-active'}
                        />
                    </WorkspaceTabHeaderContainer>
                    <div className="workspace-tab-container">
                        <div className="workspace-leaf">
                            <hr className="workspace-leaf-resize-handle"/>
                            <div className="workspace-leaf-content" data-type={'outline'}>

                                <div className="view-content node-insert-event" style={{position: 'relative'}}>
                                    <TocHeaders headers={tocHeaders}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </WorkspaceTabs>
            </WorkspaceSplitContainer>
        </div>
    )
}
