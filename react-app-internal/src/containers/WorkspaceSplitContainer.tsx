import {WorkspaceLeafResizeHandle} from "../components/WorkspaceLeafResizeHandle";
import {CSSProperties} from "react";

interface WorkspaceSplitContainerProps {
    modOrientation: "mod-vertical" | "mod-horizontal";
    isSideDock: boolean;
    modSplitDirection?: "mod-left-split" | "mod-right-split";
    isSideDockCollapse?: boolean;
    children?: React.ReactNode;
}

export function WorkspaceSplitContainer({modOrientation, isSideDock, modSplitDirection, isSideDockCollapse, children}: WorkspaceSplitContainerProps) {
    const collapsedClass = isSideDockCollapse && "is-sidedock-collapsed";
    let styles: CSSProperties = isSideDock ? {width: '300px'} : {}
    styles = isSideDockCollapse ? {width: 0, display: 'none'} : styles;
    return (
        <div
            className={`workspace-split ${modOrientation} ${isSideDock ? 'mod-sidedock' : 'mod-root'} ${modSplitDirection} ${collapsedClass}`}
            style={styles}>
            <WorkspaceLeafResizeHandle style={(isSideDock && !isSideDockCollapse) ? {opacity: 1} : {opacity: 0}}/>
            {children}
        </div>
    )
}