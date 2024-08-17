import './App.css'
import {initImageFileMap, initMarkdownFileMap} from "./utils/file/fileUtils.js";
import Sidebar from "./components/Sidebar.jsx";
import {useEffect, useState} from "react";
import MarkdownContent from "./components/MarkdownContent.jsx";
import {Route, Routes, useLocation} from "react-router-dom";
import LoadingScreen from "./components/LoadingScreen.jsx";

function App() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  useEffect(() => {
    async function initialize() {
      await initMarkdownFileMap();
      await initImageFileMap();
      setIsInitialized(true);
    }
    initialize();
  }, []);
  
  useEffect(() => {
      setIsLoading(true);
  }, [location.pathname]);
  
  const handleLoadComplete = () => setIsLoading(false);
  
  if (!isInitialized) {
    return <LoadingScreen dataTestId="init-loading-screen"/>;
  }
  
  return (
    <div className="horizontal-main-container">
      {isLoading && <LoadingScreen />}
      <div className="workspace is-left-sidedock-open is-right-sidedock-open">
        <Sidebar/>
        <Routes>
          <Route path={"/*"} element={<MarkdownContent onLoadComplete={handleLoadComplete}/>}/>
        </Routes>
      </div>
    </div>
  );
}

export default App;