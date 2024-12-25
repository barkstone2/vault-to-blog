import { visit } from 'unist-util-visit';

const remarkHighlight = () => {
  return (tree) => {
    visit(tree, 'text', (node, index, parent) => {
      const highlightRegex = /==([^=\s]+[^=]*[^=\s]+|[^=\s]+=[^=\s]+|[^=\s]+)==/g;
      const matches = [...node.value.matchAll(highlightRegex)];
      if (matches.length > 0) {
        const newNodes = [];
        let lastIndex = 0;
        matches.forEach((match) => {
          const [fullMatch, highlight] = match;
          if (match.index > lastIndex) {
            newNodes.push({
              type: 'text',
              value: node.value.slice(lastIndex, match.index),
            });
          }
          
          newNodes.push({
            type: 'html',
            value: `<mark>${highlight}</mark>`,
          });
          
          lastIndex = match.index + fullMatch.length;
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

export default remarkHighlight;