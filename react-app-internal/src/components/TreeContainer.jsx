import {createContext, useRef} from 'react';
import {initTree, markUsedPaths, renderTree} from "../utils/treeUtils.jsx";

export const TreeContainerContext = createContext({});

const directoryFirstFn = ([key1, value1], [key2, value2]) => {
  if (value1.isFile !== value2.isFile) {
    return value1.isFile ? 1 : -1;
  }
  return key1.localeCompare(key2);
};

const TreeContainer = ({datatype}) => {
  const tree = useRef(initTree());
  const usedPaths = useRef(markUsedPaths());
  return (
    <TreeContainerContext.Provider value={{usedPaths}}>
    <div className="workspace-leaf">
      <hr className="workspace-leaf-resize-handle"/>
      <div className="workspace-leaf-content" datatype={datatype}>
        <div className="nav-files-container node-insert-event" style={{position: "relative"}}>
          <div>
            {renderTree(tree.current.children, '', directoryFirstFn)}
          </div>
        </div>
      </div>
    </div>
    </TreeContainerContext.Provider>
  );
};

export default TreeContainer;