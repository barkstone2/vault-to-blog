import PropTypes from "prop-types";

const DirectoryIcon = ({isDirectory, isOpen}) => {
  const className = `tree-item-icon collapse-icon nav-folder-collapse-indicator ${!isOpen ? ' is-collapsed' : ''}`;
  return isDirectory && (
    <div className={className} data-testid="DirectoryIcon">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
           className="svg-icon right-triangle">
        <path d="M3 8L12 17L21 8"></path>
      </svg>
    </div>
  );
};

DirectoryIcon.propTypes = {
  isDirectory: PropTypes.bool,
  isOpen: PropTypes.bool,
}

export default DirectoryIcon;