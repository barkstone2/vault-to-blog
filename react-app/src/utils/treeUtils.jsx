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

export const renderTree = (nodes, basePath = '', compareFn = () => {}, navigate) => {
  const sortedNodes = Object.entries(nodes).sort(compareFn)
  return sortedNodes.map(([key, value]) => {
    const path = `${basePath}/${key}`;
    const handleNavigate = () => {
      navigate(path);
    }
    return (
      <React.Fragment key={path}>
        {!value.isFile ? (
          <TreeItem title={key + " (" + value.count + ")"} isDirectory={true}>
            <div className="nav-children">
              {renderTree(value.children, path, compareFn, navigate)}
            </div>
          </TreeItem>
        ) : (
          <TreeItem onClick={handleNavigate} title={key}/>
        )}
      </React.Fragment>
    );
  })
};