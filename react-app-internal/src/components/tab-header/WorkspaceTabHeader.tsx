interface  WorkspaceTabHeaderProps {
    title: string;
    dataType: string;
    innerIcon: React.ReactNode;
    activeClass?: string;
}
export function WorkspaceTabHeader({title, dataType, innerIcon, activeClass}: WorkspaceTabHeaderProps) {
    return (
        <div className={`workspace-tab-header tappable ${activeClass}`} aria-label={title}
             data-tooltip-delay="300" datatype={dataType}>
            <div className="workspace-tab-header-inner">
                <div className="workspace-tab-header-inner-icon">
                    {innerIcon}
                </div>
                <div className="workspace-tab-header-inner-title">{title}</div>
            </div>
        </div>
    );
}