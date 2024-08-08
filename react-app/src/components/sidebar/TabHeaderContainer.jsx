import FileExplorerTabHeader from "./FileExplorerTabHeader.jsx";
import OutlineTabHeader from "./OutlineTabHeader.jsx";
import TagsTabHeader from "./TagsTabHeader.jsx";
import SidebarToggleButton from "./SidebarToggleButton.jsx";

const TabHeaderContainer = () => {
  return (
    <div className="workspace-tab-header-container">
      <div className="workspace-tab-header-container-inner" style={{"--animation-dur": "250ms"}}>
        <FileExplorerTabHeader/>
        <OutlineTabHeader title=""/>
        <TagsTabHeader/>
      </div>
      <div className="workspace-tab-header-spacer"></div>
      <SidebarToggleButton/>
    </div>
  )
};

export default TabHeaderContainer;