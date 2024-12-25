const FileExplorerTabHeader = () => {
  return (
    <div className="workspace-tab-header tappable is-active mod-active" aria-label="Files"
         data-tooltip-delay="300" datatype="file-explorer">
      <div className="workspace-tab-header-inner">
        <div className="workspace-tab-header-inner-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
               className="svg-icon lucide-folder-closed">
            <path
              d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"></path>
            <path d="M2 10h20"></path>
          </svg>
        </div>
        <div className="workspace-tab-header-inner-title">Files</div>
      </div>
    </div>
  );
};
export default FileExplorerTabHeader;