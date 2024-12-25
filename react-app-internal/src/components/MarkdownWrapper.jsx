import '../styles/content.css'

function MarkdownWrapper({children}) {
  return (
    <div className="workspace-split mod-vertical mod-root">
      <hr className="workspace-leaf-resize-handle"/>
      <div className="workspace-tabs mod-top">
        <div className="workspace-tab-header-container"></div>
        <div className="workspace-tab-container">
          {/* TODO 탭 전환 기능 추가 시 leaf 단위로 처리가 필요 */}
          <div className="workspace-leaf">
            <hr className="workspace-leaf-resize-handle"/>
            <div className="workspace-leaf-content" datatype="markdown" datamode="preview">
              {/* TODO 요청 path 기준으로 렌더링 가능 */}
              <div className="view-header">
              </div>
              <div className="view-content">
                <div className="markdown-reading-view" style={{width: '100%', height: '100%'}}>
                  <div
                    className="markdown-preview-view markdown-rendered node-insert-event is-readable-line-width allow-fold-headings show-indentation-guide allow-fold-lists show-properties"
                    tabIndex="-1" style={{tabSize: 4}}>
                    {children}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MarkdownWrapper;