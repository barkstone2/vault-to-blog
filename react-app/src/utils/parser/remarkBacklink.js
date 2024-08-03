import { visit } from 'unist-util-visit';
import {getMarkdownFileMap} from "../file/fileUtils.js";

const remarkBacklink = () => {
  const fileMap = getMarkdownFileMap()
  return (tree) => {
    visit(tree, ['text'], (node, index, parent) => {
      const linkRegex = /\[\[([^\]]+)]]/g;
      const matches = [...node.value.matchAll(linkRegex)];
      if (matches.length > 0) {
        const newNodes = [];
        let lastIndex = 0;
        
        matches.forEach((match) => {
          const [fullMatch, linkText] = match;
          const linkParts = linkText.split('|');
          const targetName = linkParts[0];
          const display = linkParts[1] ? linkParts[1] : linkParts[0];
          let targetPath;
          if (fileMap[targetName]) {
            targetPath = fileMap[targetName][0];
          }
          
          if (targetPath) {
            if (match.index > lastIndex) {
              newNodes.push({
                type: 'text',
                value: node.value.slice(lastIndex, match.index),
              });
            }
            
            const url = `/${targetPath}`;
            newNodes.push({
              type: 'html',
              value: `<a href="${url}" class="backlink">${display}</a>`,
            });
            
            lastIndex = match.index + fullMatch.length;
          }
        });
        
        if (lastIndex < node.value.length) {
          newNodes.push({
            type: 'text',
            value: node.value.slice(lastIndex),
          });
        }
        
        parent.children.splice(index, 1, ...newNodes);
      }
    });
  }
}

export default remarkBacklink;