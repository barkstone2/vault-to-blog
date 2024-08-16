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
    addMarkdownPreviewPusher(newNodes);
    addNewTag(newNodes,
      `<div class="mod-header">`, `</div>`,
      () => {
        addInlineTitle(newNodes, options.title);
        if (hasProperties(tree)) {
          addPropertiesContainer(newNodes, tree);
          removePropertiesMetadata(tree);
        }
      })
    tree.children.unshift(...newNodes);
  }
}

function addMarkdownPreviewPusher(newNodes) {
  newNodes.push({
    type: 'html',
    value: `<div class="markdown-preview-pusher" style="width: 1px; height: 0.1px; margin-bottom: 0;"></div>`
  })
}

function addInlineTitle(newNodes, title) {
  newNodes.push({
    type: 'html',
    value: `<div class="inline-title" tabindex="-1">${title}</div>`
  })
}

function hasProperties(tree) {
  return tree.children[0]?.type === 'yaml';
}

function addPropertiesContainer(newNodes, tree) {
  addNewTag(newNodes,
    '<div class="metadata-container" tabindex="-1">', '</div>',
    () => {
      addPropertiesHeading(newNodes);
      addPropertyContent(newNodes, tree);
    })
}

function addPropertiesHeading(newNodes) {
  // TODO 프로퍼티 헤더 토글 기능 추가 후 주석 해제
  // const collapseIconTag =
  //   '<div class="collapse-indicator collapse-icon">' +
  //   '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon right-triangle">' +
  //   '<path d="M3 8L12 17L21 8"></path>' +
  //   '</svg>' +
  //   '</div>';
  const collapseIconTag = '';
  const propertiesTitleTag = '<div class="metadata-properties-title">Properties</div>';
  const propertiesHeading = '<div class="metadata-properties-heading" tabindex="-1">' + collapseIconTag + propertiesTitleTag + '</div>'
  newNodes.push({
    type: 'html',
    value: propertiesHeading
  })
}

function addPropertyContent(newNodes, tree) {
  addNewTag(newNodes,
    '<div class="metadata-content">', '</div>',
    () => {
      addNewTag(newNodes,
        '<div class="metadata-properties">', '</div>',
        () => {
          const yaml = tree.children[0];
          const properties = yaml.value.split('\n');
          for (let index = 0; index < properties.length; index++) {
            const {key, value} = parseKeyAndValue(properties[index])
            const type = getPropertyType(key);
            index = addProperty(newNodes, key, type, index, properties, value);
          }
        });
    })
}

function addProperty(newNodes, key, type, index, properties, value) {
  addNewTag(
    newNodes,
    `<div class="metadata-property" data-property-key="${key}" data-property-type="${type}">`, '</div>',
    () => {
      addPropertyKey(newNodes, key, type);
      if (type === 'multitext' || type === 'tags') {
        index = addMultiPropertyValue(newNodes, type, properties, index);
      } else {
        addPropertyValue(newNodes, value, type);
      }
    })
  return index;
}

function removePropertiesMetadata(tree) {
  tree.children.splice(0, 1);
}

export default remarkProperties