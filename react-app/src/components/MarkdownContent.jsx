import useBacklinkNavigation from "../utils/hooks/useBacklinkNavigation.js";
import '../styles/content.css'
import {Helmet} from "react-helmet-async";
import LoadingScreen from "./LoadingScreen.jsx";
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";

function MarkdownContent() {
  const {'*': filePath} = useParams();
  const [innerHtml, setInnerHtml] = useState({});
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    setIsLoading(true);
    const fetchHtml = async () => {
      const path = filePath ? `/html/${filePath.replace('.md', '.html')}` : `/default/home.html`;
      const response = await fetch(`${path}`);
      const content = await response.text();
      const title = filePath.split('/').pop().replace('.md', '');
      const newInnerHtml = {
        title: title,
        content: content
      };
      setInnerHtml(newInnerHtml)
      setIsLoading(false);
    };
    fetchHtml()
  }, [filePath]);
  useBacklinkNavigation(innerHtml.content);
  
  if (isLoading) {
    return <LoadingScreen />
  }
  
  return (
    <div className="workspace-split mod-vertical mod-root">
      <Helmet>
        <title>{innerHtml.title}</title>
      </Helmet>
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
                    <div className="markdown-preview-sizer markdown-preview-section" dangerouslySetInnerHTML={{__html: innerHtml.content}}>
                    </div>
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

export default MarkdownContent;