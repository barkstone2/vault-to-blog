import FileExplorerTabHeader from "./FileExplorerTabHeader.jsx";
// TODO left sidebar에 다른 탭 추가될 때 주석 해제
// import OutlineTabHeader from "./OutlineTabHeader.jsx";
// import TagsTabHeader from "./TagsTabHeader.jsx";
// TODO left sidebar 토글 기능 추가 후 주석 해제
// import SidebarToggleButton from "./SidebarToggleButton.jsx";

const TabHeaderContainer = () => {
  return (
    <div className="workspace-tab-header-container">
      <div className="workspace-tab-header-container-inner" style={{"--animation-dur": "250ms"}}>
        <FileExplorerTabHeader/>
        {/* TODO left sidebar에 다른 탭 추가될 때 주석 해제 */}
        {/*<OutlineTabHeader title=""/>*/}
        {/*<TagsTabHeader/>*/}
      </div>
      <div className="workspace-tab-header-spacer"></div>
      {/* TODO left sidebar 토글 기능 추가 후 주석 해제 */}
      {/*<SidebarToggleButton/>*/}
    </div>
  )
};

export default TabHeaderContainer;