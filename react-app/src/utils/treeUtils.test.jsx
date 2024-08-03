import {afterAll, beforeAll, describe, expect, it, vi} from "vitest";
import {initTree, renderTree} from "./treeUtils.jsx";
import {render, screen} from "@testing-library/react";
import {MemoryRouter} from "react-router-dom";

let fileSet;
let expectedTree;
describe('initTree 호출 시', () => {
  beforeAll(() => {
    vi.mock('./file/fileUtils.js', () => {
      return {
        getMarkdownFileSet: () => fileSet
      }
    })
  });
  afterAll(() => {
    vi.clearAllMocks();
  })
  it('조회한 파일 셋의 내용으로 트리를 구축한다.', () => {
    fileSet = new Set(['file1']);
    expectedTree = {
      children: {
        'file1' : {children: {}, count: 1, isFile: true},
      },
      count: fileSet.size,
    }
    const tree = initTree();
    expect(tree.count).toBe(fileSet.size);
    expect(tree).toStrictEqual(expectedTree)
  });
  
  it('/를 기준으로 path 정보를 분할해 트리를 구성한다.', () => {
    fileSet = new Set(['dir/file1']);
    expectedTree = {
      children: {
        'dir': {
          children: {
            'file1' : {children: {}, count: 1, isFile: true},
          },
          count: 1,
          isFile: false
        },
      },
      count: fileSet.size,
    }
    const tree = initTree();
    expect(tree.count).toBe(fileSet.size);
    expect(tree).toStrictEqual(expectedTree)
  });
  
  it('트리 노드가 디렉토리면 자식 정보와 자식의 수가 포함된다.', () => {
    fileSet = new Set(['dir/file2', 'dir/file3']);
    expectedTree = {
      children: {
        'dir': {
          children: {
            'file2' : {children: {}, count: 1, isFile: true},
            'file3' : {children: {}, count: 1, isFile: true}
          },
          count: 2,
          isFile: false
        },
      },
      count: fileSet.size,
    }
    const tree = initTree();
    expect(tree.count).toBe(fileSet.size);
    expect(tree).toStrictEqual(expectedTree)
  });
  
  it('자식의 수를 계산할 때 중첩된 자식의 수까지 모두 계산한다.', () => {
    fileSet = new Set([
      'dir1/file1',
      'dir1/dir2/file2',
    ]);
    expectedTree = {
      children: {
        
        'dir1': {
          children: {
            'dir2': {
              children: {
                'file2': {children: {}, count: 1, isFile: true},
              },
              count: 1, isFile: false,
            },
            'file1': {children: {}, count: 1, isFile: true},
          },
          count: 2,
          isFile: false,
        },
      },
      'count': fileSet.size,
    };
    const tree = initTree();
    expect(tree.count).toBe(fileSet.size);
    expect(tree).toStrictEqual(expectedTree)
  });
});

describe('renderTree 호출 시', () => {
  let inputTree;
  it('트리 노드가 컴포넌트로 렌더링된다.', () => {
    const nodeTitle = 'file';
    inputTree = {
      [nodeTitle] : {children: {}, count: 1, isFile: true},
    }
    render(<MemoryRouter>{renderTree(inputTree)}</MemoryRouter>)
    expect(screen.getByText(nodeTitle)).toBeInTheDocument();
  });
  
  it('트리 노드가 디렉토리 노드면 자식의 수가 표시된다.', () => {
    const nodeKey = 'dir'
    const nodeCount = 3;
    inputTree = {
      [nodeKey] : {
        children: {},
        count: nodeCount,
        isFile: false
      },
    }
    const expectedTitle = `${nodeKey} (${nodeCount})`
    render(<MemoryRouter>{renderTree(inputTree)}</MemoryRouter>)
    expect(screen.getByText(expectedTitle)).toBeInTheDocument();
  });
  
  
  it('노드가 디렉토리 노드면 자식 노드가 재귀적으로 렌더링된다.', () => {
    inputTree = {
      'dir1' : {
        children: {
          'dir2': {
            children: {
              'file2': {children: {}, count: 1, isFile: true},
            },
            count: 1,
            isFile: false
          },
          'file1': {children: {}, count: 1, isFile: true},
        },
        count: 1,
        isFile: false
      },
    }
    
    render(<MemoryRouter>{renderTree(inputTree)}</MemoryRouter>)
    const dir1Children = screen.getByText('dir1 (1)').parentElement.nextSibling;
    const file1 = screen.getByText('file1');
    const dir2 = screen.getByText('dir2 (1)');
    const dir2Children = dir2.parentElement.nextSibling;
    const file2 = screen.getByText('file2');
    expect(dir1Children).toContainElement(file1);
    expect(dir1Children).toContainElement(dir2);
    expect(dir1Children).toContainElement(file2);
    expect(dir2Children).toContainElement(file2);
    expect(dir2Children).not.toContainElement(file1);
  });
  
  it('인자로 전달된 정렬 기준으로 정렬된 트리로 렌더링한다.', () => {
    inputTree = {
      '1' : {children: {}, count: 1, isFile: true},
      '2' : {children: {}, count: 1, isFile: true},
    }
    // render(renderTree(inputTree, '', ([k1], [k2]) => {
    //   return k2.localeCompare(k1);
    // }))
    // const el1 = screen.getByText('1');
    // const el2 = screen.getByText('2');
    // expect(el1).toBeInTheDocument();
    // expect(el2).toBeInTheDocument();
    // expect(el1)
  });
});