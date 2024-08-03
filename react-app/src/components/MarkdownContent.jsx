import {useParams} from "react-router-dom";
import useBacklinkNavigation from "../utils/hooks/useBacklinkNavigation.js";
import {useEffect, useState} from "react";
import '../styles/content.css'
import {Helmet} from "react-helmet-async";

function MarkdownContent() {
  const { '*': filePath } = useParams();
  const [innerHtml, setInnerHtml] = useState({});
  useEffect(() => {
    const fetchHtml = async () => {
      const path = filePath ? `/html/${filePath.replace('.md', '.html')}` : `/default/home.html`;
      const response = await fetch(`${path}`);
      const content = await response.text();
      const title = filePath.split('/').pop().replace('.md', '');
      const newInnerHtml = {
        title: title,
        content: `<div class="content-title">${title}</div>` + content
      };
      setInnerHtml(newInnerHtml)
    };
    fetchHtml()
  }, [filePath]);
  useBacklinkNavigation(innerHtml.content);
  
  return (
    <div className="content-container">
      <Helmet>
        <title>{innerHtml.title}</title>
      </Helmet>
      <div className="markdown-content" dangerouslySetInnerHTML={{__html: innerHtml.content}}/>
    </div>
  );
}

export default MarkdownContent;