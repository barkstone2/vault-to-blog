import {LucideHouse} from "lucide-react";
import {useNavigate} from "react-router-dom";

const HomeTabHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="workspace-tab-header tappable"
         aria-label="Home"
         data-tooltip-delay="300"
         datatype="home"
         onClick={() => navigate("/")}>
      <div className="workspace-tab-header-inner">
        <div className="workspace-tab-header-inner-icon">
          <LucideHouse className={'svg-icon'}/>
        </div>
      </div>
    </div>
  );
};

export default HomeTabHeader;
