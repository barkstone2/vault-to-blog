import {useState} from "react";
import TreeItemIcon from "./TreeItemIcon.jsx";
import PropTypes from "prop-types";

const TreeItem = ({title, onClick = () => {}, isDirectory = false, children = null}) => {
  const [isOpen, setIsOpen] = useState(false);
  let className;
  if (isDirectory) {
    className = 'nav-directory'
    if (isOpen) className += ' open';
  }
  const doOnClick = () => {
    if (isDirectory) {
      setIsOpen(!isOpen);
    }
    onClick();
  }
  return (
    <div className={className}>
      <div className="nav-item" onClick={doOnClick}>
        <TreeItemIcon isDirectory={isDirectory} isOpen={isOpen}/>
        <span className="nav-item-title">{title}</span>
      </div>
      {children}
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