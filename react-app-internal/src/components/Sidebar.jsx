import '../styles/sidebar.css';
import TreeContainer from "./TreeContainer.jsx";
import TabHeaderContainer from "./sidebar/TabHeaderContainer.jsx";
import SidebarEmptyState from "./sidebar/SidebarEmptyState.jsx";

const Sidebar = () => {
  return (
    <div className="workspace-split mod-horizontal mod-sidedock mod-left-split" style={{width: '298.503px'}}>
      {/* TODO 사이드바 크기 조절 기능 추가 후 주석 해제 */}
      {/*<hr className="workspace-leaf-resize-handle" style={{opacity: 1}}/>*/}
      <SidebarEmptyState/>
      <div className="workspace-tabs mod-top mod-top-left-space">
        <hr className="workspace-leaf-resize-handle"/>
        <TabHeaderContainer></TabHeaderContainer>
        <div className="workspace-tab-container">
          <TreeContainer datatype="file-explorer"/>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;