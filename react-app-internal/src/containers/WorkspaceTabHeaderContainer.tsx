import {WorkspaceTabHeaderSpacer} from "../components/tab-header/WorkspaceTabHeaderSpacer";

interface WorkspaceTabHeaderContainerProps {
    leftToggleButtonIcon?: React.ReactNode;
    hasLeftDockToggleButtonOnLeft?: boolean;
    hasLeftDockToggleButtonOnRight?: boolean;
    rightToggleButtonIcon?: React.ReactNode;
    hasRightDockToggleButtonOnLeft?: boolean;
    hasRightDockToggleButtonOnRight?: boolean;
    children?: React.ReactNode;
}
export function WorkspaceTabHeaderContainer({
                                                leftToggleButtonIcon, hasLeftDockToggleButtonOnLeft, hasLeftDockToggleButtonOnRight,
                                                rightToggleButtonIcon, hasRightDockToggleButtonOnLeft, hasRightDockToggleButtonOnRight,
                                                children}: WorkspaceTabHeaderContainerProps) {
    return (
        <div className="workspace-tab-header-container">
            {hasLeftDockToggleButtonOnLeft && leftToggleButtonIcon}
            {hasRightDockToggleButtonOnLeft && rightToggleButtonIcon}
            <div className="workspace-tab-header-container-inner" style={{"--animation-dur": "250ms"}}>
                {children}
            </div>
            <WorkspaceTabHeaderSpacer/>
            {hasLeftDockToggleButtonOnRight && leftToggleButtonIcon}
            {hasRightDockToggleButtonOnRight && rightToggleButtonIcon}
        </div>
    )
}