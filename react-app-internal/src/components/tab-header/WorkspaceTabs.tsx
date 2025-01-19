import {WorkspaceLeafResizeHandle} from "../WorkspaceLeafResizeHandle";

interface WorkspaceTabsProps {
    spaceDirection?: 'mod-top-left-space' | 'mod-top-right-space';
    children?: React.ReactNode;
}
export function WorkspaceTabs({spaceDirection, children}: WorkspaceTabsProps) {
    return (
        <div className={`workspace-tabs mod-top ${spaceDirection}`}>
            <WorkspaceLeafResizeHandle/>
            {children}
        </div>
    );
}