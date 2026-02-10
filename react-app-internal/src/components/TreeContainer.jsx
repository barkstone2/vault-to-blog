import {createContext, useMemo, useRef} from 'react';
import {initTree, markUsedPaths, renderTree} from "../utils/treeUtils.jsx";

export const TreeContainerContext = createContext({});

const directoryFirstFn = ([key1, value1], [key2, value2]) => {
  if (value1.isFile !== value2.isFile) {
    return value1.isFile ? 1 : -1;
  }
  return key1.localeCompare(key2);
};

const TreeContainer = ({
  datatype,
  searchKeyword = '',
  forceExpandDirectories = false,
  showSearchInput = false,
  onSearchKeywordChange = (_nextKeyword) => {},
}) => {
  const tree = useMemo(() => initTree(undefined, searchKeyword), [searchKeyword]);
  const shouldRenderTree = !showSearchInput || searchKeyword.trim().length > 0;
  const usedPaths = useRef(markUsedPaths());
  return (
    <TreeContainerContext.Provider value={{usedPaths, forceOpenDirectories: forceExpandDirectories}}>
    <div className="workspace-leaf">
      <hr className="workspace-leaf-resize-handle"/>
      <div className="workspace-leaf-content" datatype={datatype}>
        {showSearchInput && (
          <div style={{padding: '8px 12px'}}>
            <input
              aria-label="Search query"
              type="text"
              placeholder="Search pages"
              value={searchKeyword}
              onChange={(event) => onSearchKeywordChange(event.target.value)}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '6px 8px',
              }}
            />
          </div>
        )}
        <div className="nav-files-container node-insert-event" style={{position: "relative"}}>
          <div>
            {shouldRenderTree ? renderTree(tree.children, '', directoryFirstFn) : null}
          </div>
        </div>
      </div>
    </div>
    </TreeContainerContext.Provider>
  );
};

export default TreeContainer;
