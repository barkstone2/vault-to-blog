import React from 'react'
import {getMarkdownFileSet} from "./file/fileUtils.js";
import TreeItem from "../components/TreeItem.jsx";

const calculateCounts = (node) => {
  let total = 0;
  Object.values(node).forEach((child) => {
    if (child.children && !child.isFile) {
      child.count += calculateCounts(child.children);
    }
    total += child.count;
  });
  return total;
};

const buildTree = (paths) => {
  const root = {};
  paths.forEach((path) => {
    const parts = path.split('/');
    let current = root;
    parts.forEach((part, index) => {
      if (!current[part]) {
        current[part] = {
          children: {},
          count: 0,
          isFile: index === parts.length - 1,
        };
      }
      if (index === parts.length - 1) {
        current[part].count += 1;
      }
      current = current[part].children;
    });
  });
  
  const tree = {};
  tree.children = root;
  tree.count = calculateCounts(root);
  return tree;
};

export const initTree =  () => {
  const fileSet = getMarkdownFileSet();
  return buildTree(fileSet)
}

export const renderTree = (nodes, basePath = '', compareFn = () => {}) => {
  const sortedNodes = Object.entries(nodes).sort(compareFn)
  return (
    <>
      {/* TODO 아마 크기 조절용인듯? 크기 조절 기능은 나중에 추가*/}
      <div style={{width: '353px', height: '0.1px', marginBottom: '0px'}}></div>
      {
        sortedNodes.map(([key, value]) => {
            const path = `${basePath}/${key}`;
            return (
              <React.Fragment key={path}>
                {!value.isFile ? (
                  <TreeItem title={key + " (" + value.count + ")"} isDirectory={true} path={path}>
                    {renderTree(value.children, path, compareFn)}
                  </TreeItem>
                ) : (
                  <TreeItem title={key.replace('.md', '')} path={path}/>
                )}
              </React.Fragment>
            );
          }
        )
      }
    </>
  )
};

export const markUsedPaths = (path = location.pathname) => {
  const usedPaths = {};
  const currentPath = decodeURIComponent(path);
  if (currentPath) {
    const pathParts = currentPath.split('/').filter(Boolean);
    let subPath = '';
    pathParts.forEach((part) => {
      subPath += `/${part}`;
      usedPaths[subPath] = true;
    });
    return usedPaths
  }
  return usedPaths
}