import {LucideFolderClosed} from "lucide-react";

const FileExplorerTabHeader = ({isActive = true, onSelectTab = () => {}}) => {
  const activeClassName = isActive ? ' is-active mod-active' : '';
  return (
    <div className={`workspace-tab-header tappable${activeClassName}`} aria-label="Files"
         data-tooltip-delay="300" datatype="file-explorer"
         onClick={() => onSelectTab('file-explorer')}>
      <div className="workspace-tab-header-inner">
        <div className="workspace-tab-header-inner-icon">
          <LucideFolderClosed className={'svg-icon'}/>
        </div>
        <div className="workspace-tab-header-inner-title">Files</div>
      </div>
    </div>
  );
};
export default FileExplorerTabHeader;
