import {ReactNode, useState} from "react";
import {WorkspaceSplitContainer} from "./WorkspaceSplitContainer";
import TreeContainer from "../components/TreeContainer";
import {WorkspaceTabs} from "../components/tab-header/WorkspaceTabs";
import {WorkspaceTabHeaderContainer} from "./WorkspaceTabHeaderContainer";
import FileExplorerTabHeader from "../components/sidebar/FileExplorerTabHeader";
import {WorkspaceTabHeader} from "../components/tab-header/WorkspaceTabHeader";
import {LucideList} from "lucide-react";
import {useParams} from "react-router-dom";
import {getTocMap} from "../utils/file/fileUtils";
import {TocHeaders} from "../components/tab-header/TocHeaders";
import {SidebarRightToggleSvg} from "../components/svg/SidebarRightToggleSvg";
import {SidebarToggleButton} from "../components/SidebarToggleButton";
import {SidebarLeftToggleSvg} from "../components/svg/SidebarLeftToggleSvg";
import {HeaderOfToc} from "../types/HeaderOfToc";

const leftSideDockOpenedClassName = 'is-left-sidedock-open';
const rightSideDockOpenedClassName = 'is-right-sidedock-open';

export function WorkspaceContainer({children}: {children: ReactNode}) {
    const {'*': filePath } = useParams();
    const tocMap: {[key: string]: HeaderOfToc} = getTocMap();
    const tocOfFile: HeaderOfToc = tocMap[filePath ?? ''];

    const [isLeftSideDockOpened, setIsLeftSideDockOpened] = useState(true);
    const [isRightSideDockOpened, setIsRightSideDockOpened] = useState(true);
    let workspaceClassName = 'workspace';
    if (isLeftSideDockOpened) {
        workspaceClassName += ' ' + leftSideDockOpenedClassName;
    }

    if (isRightSideDockOpened) {
        workspaceClassName += ' ' + rightSideDockOpenedClassName;
    }

    return (
        <div className={workspaceClassName}>
            <WorkspaceSplitContainer modOrientation={'mod-horizontal'}
                                     isSideDock={true}
                                     isSideDockCollapse={!isLeftSideDockOpened}
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
                        <FileExplorerTabHeader/>
                        {/* TODO left sidebar에 다른 탭 추가될 때 주석 해제 */}
                        {/*<OutlineTabHeader title=""/>*/}
                        {/*<TagsTabHeader/>*/}
                    </WorkspaceTabHeaderContainer>
                    <div className="workspace-tab-container">
                        <TreeContainer datatype="file-explorer"/>
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
                                            {children}
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
                                    <TocHeaders headers={tocOfFile.children}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </WorkspaceTabs>
            </WorkspaceSplitContainer>
        </div>
    )
}