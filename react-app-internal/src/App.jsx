import './App.css'
import {initImageFileMap, initMarkdownFileMap, initMarkdownSearchMap, initTocMap} from "./utils/file/fileUtils.js";
import {useEffect, useState} from "react";
import MarkdownContent from "./components/MarkdownContent.jsx";
import {Route, Routes} from "react-router-dom";
import LoadingScreen from "./components/LoadingScreen.jsx";
import {WorkspaceContainer} from "./containers/WorkspaceContainer";

function App() {
  const [isInitialized, setIsInitialized] = useState(false);
  useEffect(() => {
    async function initialize() {
      await initMarkdownFileMap();
      await initMarkdownSearchMap();
      await initImageFileMap();
      await initTocMap();
      setIsInitialized(true);
    }
    initialize();
  }, []);
  
  if (!isInitialized) {
    return (<LoadingScreen dataTestId="init-loading-screen"/>);
  }
  
  return (
    <div className="horizontal-main-container">
        <Routes>
          <Route path={"/*"}
            element={
              <WorkspaceContainer>
                <MarkdownContent/>
              </WorkspaceContainer>
            }
          >
          </Route>
        </Routes>
    </div>
  );
}

export default App;
