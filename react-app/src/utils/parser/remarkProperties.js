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
    const newNodes = [];
    addNewTag(newNodes, `<div class="markdown-preview-pusher" style="width: 1px; height: 0.1px; margin-bottom: 0;"></div><div class="mod-header">`, `</div>`,
      () => {
        newNodes.push({
          type: 'html',
          value: `<div class="inline-title" tabindex="-1">${options.title}</div>`
        })
        
        if (tree.children[0]?.type === 'yaml') {
          addNewTag(
            newNodes,
            '<div class="metadata-container" tabindex="-1">' +
            '<div class="metadata-properties-heading" tabindex="-1">' +
            '<div class="collapse-indicator collapse-icon">' +
            '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon right-triangle"><path d="M3 8L12 17L21 8"></path></svg>' +
            '</div>' +
            '<div class="metadata-properties-title">Properties</div>' +
            '</div>' +
            '<div class="metadata-content">' +
            '<div class="metadata-properties">',
            '</div>' +
            '</div>' +
            '</div>',
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
        }
      })
    tree.children.splice(0, 1, ...newNodes);
  }
}

export default remarkProperties