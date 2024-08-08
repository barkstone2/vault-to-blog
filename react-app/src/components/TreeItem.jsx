import {useState} from "react";
import PropTypes from "prop-types";
import DirectoryIcon from "./DirectoryIcon.jsx";

const TreeItem = ({title, onClick = () => {}, isDirectory = false, children = null}) => {
  const [isOpen, setIsOpen] = useState(false);
  let className = 'tree-item';
  let type = 'nav-file'
  if (isDirectory) {
    type = 'nav-folder';
    if (!isOpen) className += ' is-collapsed';
  }
  className += ` ${type}`;
  const doOnClick = () => {
    if (isDirectory) {
      setIsOpen(!isOpen);
    }
    onClick();
  }
  return (
    <div className={className}>
      <div className={`tree-item-self is-clickable mod-collapsible ${type}-title`} onClick={doOnClick} style={{ marginInlineStart: "0px", paddingInlineStart: "24px"}}>
        <DirectoryIcon isDirectory={isDirectory} isOpen={isOpen}/>
        <div className={`tree-item-inner ${type}-title-content`}>{title}</div>
      </div>
      <div className={`tree-item-children ${type}-children ${!isOpen ? 'd-none' : ''}`}>
        {children}
      </div>
    </div>
  )
}

TreeItem.propTypes = {
  title: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  isDirectory: PropTypes.bool,
  children: PropTypes.node,
}

export default TreeItem