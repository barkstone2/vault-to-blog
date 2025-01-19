interface SidebarToggleButtonProps {
    direction: 'mod-left' | 'mod-right';
    toggleIcon: React.ReactNode;
    tooltipPosition: 'left' | 'right';
    onClick?: () => void;
}
export function SidebarToggleButton({direction, toggleIcon, tooltipPosition, onClick}: SidebarToggleButtonProps) {
    return (
        <div className={`sidebar-toggle-button ${direction}`} aria-label="" data-tooltip-position={tooltipPosition} onClick={onClick}>
            <div className="clickable-icon">
                {toggleIcon}
            </div>
        </div>
    );
}