import React from 'react'
import {getIndexFilePath, getMarkdownFileSet, getMarkdownSearchMap} from "./file/fileUtils.js";
import TreeItem from "../components/TreeItem.jsx";

export const MIN_SEARCH_KEYWORD_LENGTH = 2;

const TAG_QUERY_PATTERN = /^tag:(#?\S+)$/i;

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

const normalizeTagValue = (tagValue = '') => {
  return tagValue
    .normalize('NFC')
    .trim()
    .replace(/^#/, '')
    .replace(/^['"]|['"]$/g, '')
    .toLowerCase();
}

const parseSearchQuery = (keyword = '') => {
  const normalizedQuery = keyword.normalize('NFC').trim();
  if (!normalizedQuery) {
    return {
      keyword: '',
      tags: [],
    };
  }

  const keywordTokens = [];
  const tagSet = new Set();
  const tokens = normalizedQuery.split(/\s+/);
  for (const token of tokens) {
    const matchedTag = token.match(TAG_QUERY_PATTERN);
    if (matchedTag) {
      const normalizedTag = normalizeTagValue(matchedTag[1]);
      if (normalizedTag) {
        tagSet.add(normalizedTag);
      }
      continue;
    }
    keywordTokens.push(token);
  }

  return {
    keyword: keywordTokens.join(' ').trim(),
    tags: [...tagSet],
  };
}

const addInlineTags = (rawTagValue, tagSet) => {
  if (!rawTagValue) {
    return;
  }

  const normalizedRawTagValue = rawTagValue.trim();
  if (!normalizedRawTagValue) {
    return;
  }

  const values = normalizedRawTagValue
    .replace(/^\[/, '')
    .replace(/\]$/, '')
    .split(',');

  values.forEach((tag) => {
    const normalizedTag = normalizeTagValue(tag);
    if (normalizedTag) {
      tagSet.add(normalizedTag);
    }
  });
}

const addListTags = (rawTagValue, tagSet) => {
  if (!rawTagValue) {
    return;
  }

  const listTagPattern = /-\s*(\S+)/g;
  let match = listTagPattern.exec(rawTagValue);
  while (match) {
    const normalizedTag = normalizeTagValue(match[1]);
    if (normalizedTag) {
      tagSet.add(normalizedTag);
    }
    match = listTagPattern.exec(rawTagValue);
  }
}

const extractFrontmatterContent = (markdown = '') => {
  const normalizedMarkdown = markdown.normalize('NFC').trim();
  const multilineFrontmatter = normalizedMarkdown.match(/^---\s*\r?\n([\s\S]*?)\r?\n---/);
  if (multilineFrontmatter) {
    return multilineFrontmatter[1];
  }

  const collapsedFrontmatter = normalizedMarkdown.match(/^---\s*([\s\S]*?)\s*---/);
  if (collapsedFrontmatter) {
    return collapsedFrontmatter[1];
  }

  return '';
}

const extractTagsFromCollapsedFrontmatter = (frontmatterContent, tagSet) => {
  const inlineMatch = frontmatterContent.match(/(?:^|\s)tags?\s*:\s*\[([^\]]*)\]/i);
  if (inlineMatch) {
    addInlineTags(inlineMatch[1], tagSet);
    return;
  }

  const listMatch = frontmatterContent.match(/(?:^|\s)tags?\s*:\s*((?:-\s*\S+\s*)+)/i);
  if (listMatch) {
    addListTags(listMatch[1], tagSet);
    return;
  }

  const scalarMatch = frontmatterContent.match(/(?:^|\s)tags?\s*:\s*(\S+)/i);
  if (scalarMatch) {
    const normalizedTag = normalizeTagValue(scalarMatch[1]);
    if (normalizedTag) {
      tagSet.add(normalizedTag);
    }
  }
}

const extractFrontmatterTags = (markdown = '') => {
  const frontmatterContent = extractFrontmatterContent(markdown);
  if (!frontmatterContent) {
    return new Set();
  }

  const tagSet = new Set();
  if (!frontmatterContent.includes('\n')) {
    extractTagsFromCollapsedFrontmatter(frontmatterContent, tagSet);
    return tagSet;
  }

  const lines = frontmatterContent.split('\n');
  for (let index = 0; index < lines.length; index++) {
    const line = lines[index];
    const match = line.match(/^\s*tags?\s*:\s*(.*)$/i);
    if (!match) {
      continue;
    }

    addInlineTags(match[1], tagSet);
    while (index + 1 < lines.length) {
      const childTagMatch = lines[index + 1].match(/^\s*-\s*(\S+)\s*$/);
      if (!childTagMatch) {
        break;
      }
      const normalizedTag = normalizeTagValue(childTagMatch[1]);
      if (normalizedTag) {
        tagSet.add(normalizedTag);
      }
      index++;
    }
  }

  return tagSet;
}

export const filterPathsByKeyword = (paths, keyword = '') => {
  const {keyword: parsedKeyword, tags: requiredTags} = parseSearchQuery(keyword);
  const normalizedKeyword = parsedKeyword.normalize('NFC').trim().toLowerCase();
  const hasTagQuery = requiredTags.length > 0;
  if (!normalizedKeyword && !hasTagQuery) {
    return new Set(paths);
  }

  if (!hasTagQuery && normalizedKeyword.length < MIN_SEARCH_KEYWORD_LENGTH) {
    return new Set();
  }

  const markdownSearchMap = getMarkdownSearchMap() || {};
  const result = new Set();
  for (const path of paths) {
    const normalizedPath = path.normalize('NFC').toLowerCase();
    const markdownSource = markdownSearchMap[path] || '';
    const markdownContent = markdownSource.normalize('NFC').toLowerCase();
    const isKeywordMatched = !normalizedKeyword || normalizedPath.includes(normalizedKeyword) || markdownContent.includes(normalizedKeyword);
    if (!isKeywordMatched) {
      continue;
    }

    if (hasTagQuery) {
      const markdownTags = extractFrontmatterTags(markdownSource);
      const isTagMatched = requiredTags.every((tag) => markdownTags.has(tag));
      if (!isTagMatched) {
        continue;
      }
    }

    result.add(path);
  }
  return result;
}

export const initTree = (indexMarkdownPath = getIndexFilePath(), searchKeyword = '') => {
  const fileSet = new Set(getMarkdownFileSet());
  const indexFilePath = (indexMarkdownPath || '').normalize('NFC');
  if (indexFilePath) {
    fileSet.delete(indexFilePath);
  }

  const filteredPaths = filterPathsByKeyword(fileSet, searchKeyword);
  return buildTree(filteredPaths)
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
