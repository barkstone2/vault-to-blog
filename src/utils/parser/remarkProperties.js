import {visit} from "unist-util-visit";

const remarkProperties = () => {
  return (tree) => {
    visit(tree, 'yaml', (node, index, parent) => {
      const newNodes = [];
      const properties = node.value.split("\n");
      newNodes.push({
        type: 'html',
        value: '<div class="property-container">'
      });
      
      for (const property of properties) {
        const pInfo = property.split(": ")
        const title = pInfo[0];
        const value = pInfo[1];
        newNodes.push({
          type: 'html',
          value: `<div class="property-title" title="${title}">`
        })
        newNodes.push({
          type: 'text',
          value: `${title}`
        })
        newNodes.push({
          type: 'html',
          value: `</div>`
        })
        newNodes.push({
          type: 'html',
          value: `<div class="property-value" title="${value}">`
        })
        newNodes.push({
          type: 'text',
          value: `${value}`
        })
        newNodes.push({
          type: 'html',
          value: `</div>`
        })
      }
      
      newNodes.push({
        type: 'html',
        value: `</div>`
      })
      
      parent.children.splice(index, 1, ...newNodes);
    })
  }
}

export default remarkProperties