import {LucideFolderClosed} from "lucide-react";

const FileExplorerTabHeader = () => {
  return (
    <div className="workspace-tab-header tappable is-active mod-active" aria-label="Files"
         data-tooltip-delay="300" datatype="file-explorer">
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