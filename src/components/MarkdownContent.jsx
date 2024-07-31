import {useParams} from "react-router-dom";
import useBacklinkNavigation from "../utils/hooks/useBacklinkNavigation.js";
import {useEffect, useState} from "react";
import '../styles/content.css'

function MarkdownContent() {
  const { '*': filePath } = useParams();
  const [content, setContent] = useState('');
  useEffect(() => {
    const fetchHtml = async () => {
      const response = await fetch(`/html/${filePath.replace('.md', '.html')}`);
      const text = await response.text();
      setContent(text)
    }
    fetchHtml()
  }, [filePath]);
  useBacklinkNavigation(content);
  
  return (
    <div className="markdown-content" dangerouslySetInnerHTML={{ __html: content }}/>
  );
}

export default MarkdownContent;