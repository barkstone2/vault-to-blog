import {useRef} from 'react';
import {initTree, renderTree} from "../utils/treeUtils.jsx";
import {useNavigate} from "react-router-dom";

const directoryFirstFn = ([key1, value1], [key2, value2]) => {
  if (value1.isFile !== value2.isFile) {
    return value1.isFile ? 1 : -1;
  }
  return key1.localeCompare(key2);
};

const TreeContainer = () => {
  const tree = useRef(initTree());
  const navigate = useNavigate()
  return (
    <div className="tree-container">
      {renderTree(tree.current.children, '', directoryFirstFn, navigate)}
    </div>)
};

export default TreeContainer;