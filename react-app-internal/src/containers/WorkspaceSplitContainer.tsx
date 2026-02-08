import {WorkspaceLeafResizeHandle} from "../components/WorkspaceLeafResizeHandle";
import {CSSProperties, MouseEvent, ReactNode} from "react";

interface WorkspaceSplitContainerProps {
    modOrientation: "mod-vertical" | "mod-horizontal";
    isSideDock: boolean;
    modSplitDirection?: "mod-left-split" | "mod-right-split";
    isSideDockCollapse?: boolean;
    width?: number;
    onResizeMouseDown?: (event: MouseEvent<HTMLHRElement>) => void;
    children?: ReactNode;
}

export function WorkspaceSplitContainer({
    modOrientation,
    isSideDock,
    modSplitDirection,
    isSideDockCollapse,
    width,
    onResizeMouseDown,
    children,
}: WorkspaceSplitContainerProps) {
    const collapsedClass = isSideDockCollapse && "is-sidedock-collapsed";
    let styles: CSSProperties = isSideDock ? {width: `${width ?? 300}px`} : {}
    styles = isSideDockCollapse ? {width: 0, display: 'none'} : styles;
    return (
        <div
            className={`workspace-split ${modOrientation} ${isSideDock ? 'mod-sidedock' : 'mod-root'} ${modSplitDirection} ${collapsedClass}`}
            style={styles}>
            <WorkspaceLeafResizeHandle
                style={(isSideDock && !isSideDockCollapse) ? {opacity: 1} : {opacity: 0}}
                onMouseDown={onResizeMouseDown}
            />
            {children}
        </div>
    )
}
