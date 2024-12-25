import useBacklinkNavigation from "../utils/hooks/useBacklinkNavigation.js";
import '../styles/content.css'
import {Helmet} from "react-helmet-async";
import LoadingScreen from "./LoadingScreen.jsx";
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import UtterancesComments from "./UtterancesComments.jsx";

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
      { filePath !== '' && <UtterancesComments /> }
    </>
  );
}

export default MarkdownContent;