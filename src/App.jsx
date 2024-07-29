import './App.css'
import {initImageFileMap, initMarkdownFileMap} from "./utils/file/fileUtils.js";
import Sidebar from "./components/Sidebar.jsx";
import {useEffect, useState} from "react";

function App() {
  const [isInitialized, setIsInitialized] = useState(false);
  useEffect(() => {
    async function initialize() {
      await initMarkdownFileMap();
      await initImageFileMap();
      setIsInitialized(true);
    }
    initialize();
  }, []);
  
  if (!isInitialized) {
    return <div className="loading-layer">로딩중...</div>;
  }
  
  return (
    <>
      <Sidebar/>
    </>
  )
}

export default App;