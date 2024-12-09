import './App.css'
import {initImageFileMap, initMarkdownFileMap} from "./utils/file/fileUtils.js";
import Sidebar from "./components/Sidebar.jsx";
import {useEffect, useState} from "react";
import MarkdownContent from "./components/MarkdownContent.jsx";
import {Route, Routes} from "react-router-dom";
import LoadingScreen from "./components/LoadingScreen.jsx";
import MarkdownWrapper from "./components/MarkdownWrapper.jsx";

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
    return (<LoadingScreen dataTestId="init-loading-screen"/>);
  }
  
  return (
    <div className="horizontal-main-container">
      <div className="workspace is-left-sidedock-open is-right-sidedock-open">
        <Sidebar/>
        <MarkdownWrapper>
          <Routes>
            <Route path={"/*"} element={<MarkdownContent/>}/>
          </Routes>
        </MarkdownWrapper>
      </div>
    </div>
  );
}

export default App;