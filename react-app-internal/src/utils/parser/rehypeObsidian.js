import rehypeCallout from "./rehypeCallout.js";

const rehypeObsidian = (options = {}) => {
  return (tree) => {
    rehypeCallout()(tree)
  }
}

export default rehypeObsidian;