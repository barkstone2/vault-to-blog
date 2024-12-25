import '../styles/LoadingScreen.css';
import {string} from "prop-types";

const LoadingScreen = ({dataTestId}) => {
  return (
    <div className="loading-screen" data-testid={dataTestId}>
      <div className="spinner"></div>
    </div>
  );
};

LoadingScreen.propTypes = {
  dataTestId: string
}

export default LoadingScreen;