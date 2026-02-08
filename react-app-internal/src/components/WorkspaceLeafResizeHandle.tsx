import {CSSProperties, MouseEvent} from "react";

interface WorkspaceLeafResizeHandleProps {
    style?: CSSProperties;
    onMouseDown?: (event: MouseEvent<HTMLHRElement>) => void;
}
export function WorkspaceLeafResizeHandle({style, onMouseDown}: WorkspaceLeafResizeHandleProps) {
    return (
        <hr className="workspace-leaf-resize-handle" style={style} onMouseDown={onMouseDown}/>
    )
}
