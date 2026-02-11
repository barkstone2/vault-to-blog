import useBacklinkNavigation from "../utils/hooks/useBacklinkNavigation.js";
import '../styles/content.css'
import {Helmet} from "react-helmet-async";
import LoadingScreen from "./LoadingScreen.jsx";
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import UtterancesComments from "./UtterancesComments.jsx";
import {getIndexFilePath} from "../utils/file/fileUtils.js";

export function resolveMarkdownFilePath(filePath, indexFilePath) {
  if (filePath && filePath !== '') {
    return filePath;
  }
  return indexFilePath || '';
}

function resolveTitle(filePath) {
  return filePath ? filePath.split('/').pop().replace('.md', '') : 'Home';
}

function MarkdownContent({onTagSelected = (_tagValue) => {}}) {
  const {'*': filePath} = useParams();
  const indexFilePath = getIndexFilePath();
  const [innerHtml, setInnerHtml] = useState({});
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    setIsLoading(true);
    const fetchHtml = async () => {
      const resolvedFilePath = resolveMarkdownFilePath(filePath, indexFilePath);
      const path = resolvedFilePath ? `/html/${resolvedFilePath.replace('.md', '.html')}` : `/default/home.html`;
      const response = await fetch(`${path}`);
      const content = await response.text();
      const title = resolveTitle(resolvedFilePath);
      const newInnerHtml = {
        title: title,
        content: content
      };
      setInnerHtml(newInnerHtml)
      setIsLoading(false);
    };
    fetchHtml()
  }, [filePath, indexFilePath]);
  useBacklinkNavigation(innerHtml.content, onTagSelected);
  
  if (isLoading) {
    return <LoadingScreen/>
  }
  
  return (
    <>
      <Helmet>
        <title>{innerHtml.title}</title>
      </Helmet>
      <div className="markdown-preview-sizer markdown-preview-section"
           dangerouslySetInnerHTML={{__html: innerHtml.content}}>
      </div>
      { resolveMarkdownFilePath(filePath, indexFilePath) !== '' && <UtterancesComments /> }
    </>
  );
}

export default MarkdownContent;
