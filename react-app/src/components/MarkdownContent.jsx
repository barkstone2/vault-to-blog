import {useParams} from "react-router-dom";
import useBacklinkNavigation from "../utils/hooks/useBacklinkNavigation.js";
import {useEffect, useState} from "react";
import '../styles/content.css'
import {Helmet} from "react-helmet-async";

function MarkdownContent() {
  const {'*': filePath} = useParams();
  const [innerHtml, setInnerHtml] = useState({});
  useEffect(() => {
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
    };
    fetchHtml()
  }, [filePath]);
  useBacklinkNavigation(innerHtml.content);
  
  return (
    <div className="workspace-split mod-vertical mod-root">
      <Helmet>
        <title>{innerHtml.title}</title>
      </Helmet>
      <hr className="workspace-leaf-resize-handle"/>
      <div className="workspace-tabs mod-top">
        <div className="workspace-tab-header-container"></div>
        <div className="workspace-tab-container">
          <div className="workspace-leaf">
            <hr className="workspace-leaf-resize-handle"/>
            <div className="workspace-leaf-content" datatype="markdown" datamode="preview">
              <div className="view-header">
              </div>
              <div className="view-content">
                <div className="markdown-reading-view" style={{width: '100%', height: '100%'}}>
                  <div
                    className="markdown-preview-view markdown-rendered node-insert-event is-readable-line-width allow-fold-headings show-indentation-guide allow-fold-lists show-properties"
                    tabIndex="-1" style={{tabSize: 4}}>
                    <div className="markdown-preview-sizer markdown-preview-section"
                         style={{paddingBottom: '336px', minHeight: '1054px'}}>
                      <div className="markdown-preview-pusher"
                           style={{width: '1px', height: '0.1px', marginBottom: '0px'}}></div>
                      <div className="mod-header">
                        <div className="inline-title">{innerHtml.title}</div>
                        <div className="metadata-container" tabIndex="-1" data-property-count="3">
                          <div className="metadata-properties-heading" tabIndex="0"></div>
                        </div>
                      </div>
                      <div dangerouslySetInnerHTML={{__html: innerHtml.content}}/>
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