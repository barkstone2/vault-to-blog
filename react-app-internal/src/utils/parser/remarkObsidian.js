import remarkHighlight from "../../remarkHighlight.js";
import remarkProperties from "./remarkProperties.js";
import remarkBacklink from "./remarkBacklink.js";
import remarkImage from "./remarkImage.js";

const remarkObsidian = (options) => {
  return (tree) => {
    remarkProperties(options)(tree)
    remarkBacklink()(tree)
    remarkImage()(tree)
    remarkHighlight()(tree)
  }
}

export default remarkObsidian;