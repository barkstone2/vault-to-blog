import remarkHighlight from "../../remarkHighlight.js";
import remarkProperties from "./remarkProperties.js";
import remarkBacklink from "./remarkBacklink.js";
import remarkImage from "./remarkImage.js";

const remarkObsidian = () => {
  return (tree) => {
    remarkProperties()(tree)
    remarkBacklink()(tree)
    remarkImage()(tree)
    remarkHighlight()(tree)
  }
}

export default remarkObsidian;