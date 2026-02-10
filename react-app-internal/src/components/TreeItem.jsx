import {useContext, useEffect, useState} from "react";
import PropTypes from "prop-types";
import DirectoryIcon from "./DirectoryIcon.jsx";
import {useLocation, useNavigate} from "react-router-dom";
import {TreeContainerContext} from "./TreeContainer.jsx";

function determineTypeAndClassName(isDirectory, isOpen) {
  let className = 'tree-item';
  let type = 'nav-file'
  if (isDirectory) {
    type = 'nav-folder';
    if (!isOpen) className += ' is-collapsed';
  }
  className += ` ${type}`;
  return {className, type};
}

const createOnClickHandler = (isDirectory, setIsOpen, isOpen, navigate, path) => {
  return () => {
    if (isDirectory) {
      setIsOpen(!isOpen);
    } else {
      navigate(path);
      const scrollTarget = document.querySelector('.markdown-preview-view');
      scrollTarget.scrollTop = 0;
      scrollTarget.scrollLeft = 0;
    }
  }
}

const TreeItem = ({title, isDirectory = false, path = '', children = null}) => {
  const {usedPaths, forceOpenDirectories = false} = useContext(TreeContainerContext);
  const [isOpen, setIsOpen] = useState(forceOpenDirectories || usedPaths.current[path]);
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = decodeURIComponent(location.pathname) === path;
  const {className, type} = determineTypeAndClassName(isDirectory, isOpen);
  const onClickHandler = createOnClickHandler(isDirectory, setIsOpen, isOpen, navigate, path);

  useEffect(() => {
    if (isDirectory && forceOpenDirectories) {
      setIsOpen(true);
    }
  }, [forceOpenDirectories, isDirectory]);

  return (
    <div className={className}>
      <div className={`tree-item-self is-clickable mod-collapsible ${type}-title ${isActive ? 'is-active' : ''}`}
           onClick={onClickHandler} style={{marginInlineStart: "0px", paddingInlineStart: "24px"}}>
        <DirectoryIcon isDirectory={isDirectory} isOpen={isOpen}/>
        <div className={`tree-item-inner ${type}-title-content`}>{title}</div>
      </div>
      <div className={`tree-item-children ${type}-children ${!isOpen ? 'd-none' : ''}`}>
        {children}
      </div>
    </div>
  )
};

TreeItem.propTypes = {
  title: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  isDirectory: PropTypes.bool,
  path: PropTypes.string,
  children: PropTypes.node,
};

export default TreeItem
