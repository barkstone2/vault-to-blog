import {
  addMultiPropertyValue,
  addPropertyKey,
  addPropertyValue,
  getPropertyType,
  parseKeyAndValue
} from "../propertyRemarkUtils.js";
import {addNewTag} from "../remarkUtils.js";

const remarkProperties = (options = {}) => {
  return (tree) => {
    if (tree.children[0]?.type === 'yaml') {
      const newNodes = [];
      addNewTag(
        newNodes,
        '<div class="metadata-container" tabindex="-1"><div class="metadata-properties">',
        '</div></div>',
        () => {
        const yaml = tree.children[0];
        const properties = yaml.value.split('\n');
        for (let index = 0; index < properties.length; index++) {
          const property = properties[index];
          const {key, value} = parseKeyAndValue(property)
          const type = getPropertyType(key);
          addNewTag(
            newNodes,
            `<div class="metadata-property" data-property-key="${key}" data-property-type="${type}">`,
            '</div>',
            () => {
              addPropertyKey(newNodes, key, type);
              if (type === 'multitext' || type === 'tags') {
                index = addMultiPropertyValue(newNodes, type, properties, index);
              } else {
                addPropertyValue(newNodes, value, type);
              }
            })
        }
      });
      
      tree.children.splice(0, 1, ...newNodes);
    }
  }
}

export default remarkProperties