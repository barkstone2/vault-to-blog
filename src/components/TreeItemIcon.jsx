import FolderIcon from "@mui/icons-material/Folder";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import DescriptionIcon from "@mui/icons-material/Description";
import PropTypes from "prop-types";

const TreeItemIcon = ({isDirectory, isOpen}) => {
  return (
    isDirectory ? isOpen ? <FolderOpenIcon /> : <FolderIcon /> : <DescriptionIcon />
  );
}

TreeItemIcon.propTypes = {
  isDirectory: PropTypes.bool,
  isOpen: PropTypes.bool,
}

export default TreeItemIcon;