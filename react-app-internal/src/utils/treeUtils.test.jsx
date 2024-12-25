import {afterAll, beforeAll, describe, expect, it, vi} from "vitest";
import {initTree, markUsedPaths, renderTree} from "./treeUtils.jsx";
import {render, screen} from "@testing-library/react";
import {MemoryRouter} from "react-router-dom";

let fileSet;
let expectedTree;
beforeAll(() => {
  vi.mock('./file/fileUtils.js', () => {
    return {
      getMarkdownFileSet: () => fileSet
    }
  })
  vi.mock('../components/TreeItem', () => ({
    default: ({title, children}) => <div><div>{title}</div><div>{children}</div></div>}))
});

afterAll(() => {
  vi.clearAllMocks();
})

describe('initTree 호출 시', () => {
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
  it('인자로 넘겨진 트리 노드가 컴포넌트로 렌더링된다.', () => {
    const nodeTitle1 = 'file1';
    const nodeTitle2 = 'file2';
    inputTree = {
      [nodeTitle1] : {children: {}, count: 1, isFile: true},
      [nodeTitle2] : {children: {}, count: 1, isFile: true},
    }
    render(<MemoryRouter>{renderTree(inputTree)}</MemoryRouter>)
    expect(screen.getByText(nodeTitle1)).toBeInTheDocument();
    expect(screen.getByText(nodeTitle2)).toBeInTheDocument();
  });
  
  it('트리 노드가 파일 노드가 아니면 자식의 수가 타이틀에 표시된다.', () => {
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
  
  
  it('트리 노드가 파일 노드가 아니면 재귀적으로 렌더링된다.', () => {
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
    const dir1Children = screen.getByText('dir1 (1)').nextSibling;
    const file1 = screen.getByText('file1');
    const dir2 = screen.getByText('dir2 (1)');
    const dir2Children = dir2.nextSibling;
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
    render(<MemoryRouter data-testid='container'>{renderTree(inputTree, '', ([k1], [k2]) => {
      return k2.localeCompare(k1);
    })}</MemoryRouter>)
    const el1 = screen.getByText('1');
    const el2 = screen.getByText('2');
    const el1Parent = el1.parentElement;
    const el2Parent = el2.parentElement;
    const ancestor = el1Parent.parentElement;
    expect(ancestor.children[1]).toBe(el2Parent)
    expect(ancestor.children[2]).toBe(el1Parent)
  });
});

describe('markUsedPaths 호출 시', () => {
  it('현재 경로가 비어있다면 빈 오브젝트를 반환한다', () => {
    const result = markUsedPaths('');
    expect(result).toStrictEqual({})
  });
  
  it('현재 경로가 비어있지 않다면 모든 서브 경로를 담은 오브젝트를 반환한다', () => {
    const path = '/A/B/C';
    const expectedObject = {
      '/A': true,
      '/A/B': true,
      '/A/B/C': true
    }
    const result = markUsedPaths(path);
    expect(result).toStrictEqual(expectedObject)
  });
});