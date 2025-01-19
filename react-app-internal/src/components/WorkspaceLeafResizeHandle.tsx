import {CSSProperties} from "react";

interface WorkspaceLeafResizeHandleProps {
    style?: CSSProperties;
}
export function WorkspaceLeafResizeHandle({style}: WorkspaceLeafResizeHandleProps) {
    return (
        <hr className="workspace-leaf-resize-handle" style={style}/>
    )
}