const SidebarToggleButton = () => {
  return (
    <div className="sidebar-toggle-button mod-left" aria-label="" data-tooltip-position="right">
      <div className="clickable-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
             className="svg-icon sidebar-left">
          <path
            d="M21 3H3C1.89543 3 1 3.89543 1 5V19C1 20.1046 1.89543 21 3 21H21C22.1046 21 23 20.1046 23 19V5C23 3.89543 22.1046 3 21 3Z"></path>
          <path d="M10 4V20"></path>
          <path d="M4 7H7"></path>
          <path d="M4 10H7"></path>
          <path d="M4 13H7"></path>
        </svg>
      </div>
    </div>
  );
};

export default SidebarToggleButton;