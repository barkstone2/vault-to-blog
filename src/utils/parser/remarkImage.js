import { visit } from 'unist-util-visit';
import {getImageFileMap} from "../file/fileUtils.js";

const remarkImage = () => {
  const imageMap = getImageFileMap();
  return (tree) => {
    visit(tree, 'text', (node, index, parent) => {
      const imageRegex = /!\[\[([^\]]+)\]\]/g;
      const imageMatches = [...node.value.matchAll(imageRegex)];
      
      if (imageMatches.length > 0) {
        const newImageNodes = [];
        let imageLastIndex = 0;
        
        imageMatches.forEach((match) => {
          const [fullMatch, imageText] = match;
          const parts = imageText.split('|');
          const imageNameWithType = parts[0];
          const fileName = imageNameWithType.split("/").pop();
          const imageName = fileName.split(".").slice(0, -1).join('.');
          const imageSize = parts[1];
          let targetPath;
          if (imageMap[imageNameWithType]) {
            targetPath = imageMap[imageNameWithType][0];
          }
          
          if (targetPath) {
            if (match.index > imageLastIndex) {
              newImageNodes.push({
                type: 'text',
                value: node.value.slice(imageLastIndex, match.index),
              });
            }
            newImageNodes.push({
              type: 'html',
              value: `<img src="/sources/${encodeURI(targetPath)}" alt="${imageName}" title="${imageName}"${imageSize ? ` style="width: ${imageSize}px;"/>` : '/>'}`,
            });
            
            imageLastIndex = match.index + fullMatch.length;
          }
        });
        
        if (imageLastIndex < node.value.length) {
          newImageNodes.push({
            type: 'text',
            value: node.value.slice(imageLastIndex),
          });
        }
        
        parent.children.splice(index, 1, ...newImageNodes);
      }
    });
  };
}

export default remarkImage;