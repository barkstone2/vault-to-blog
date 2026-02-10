import {LucideSearch} from "lucide-react";

const SearchTabHeader = ({isActive = false, onSelectTab = () => {}}) => {
  const activeClassName = isActive ? ' is-active mod-active' : '';

  return (
    <div className={`workspace-tab-header tappable${activeClassName}`}
         aria-label="Search"
         data-tooltip-delay="300"
         datatype="search"
         onClick={() => onSelectTab('search')}>
      <div className="workspace-tab-header-inner">
        <div className="workspace-tab-header-inner-icon">
          <LucideSearch className={'svg-icon'}/>
        </div>
        <div className="workspace-tab-header-inner-title">Search</div>
      </div>
    </div>
  );
};

export default SearchTabHeader;
