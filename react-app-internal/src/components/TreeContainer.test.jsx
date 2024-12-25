import {render} from "@testing-library/react";
import TreeContainer from "./TreeContainer.jsx";
import {initTree, markUsedPaths, renderTree} from "../utils/treeUtils.jsx";
import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";
import {MemoryRouter} from "react-router-dom";

let tree = {
  children: {}
};
describe('트리 컨테이너 컴포넌트 렌더링 시', () => {
  beforeEach(() => {
    vi.mock('../utils/treeUtils.jsx', () => {
      return {
        initTree: vi.fn(() => tree),
        renderTree: vi.fn(),
        markUsedPaths: vi.fn()
      }
    })
  })
  
  afterEach(() => {
    vi.clearAllMocks();
  })
  
  it('트리 초기화 로직이 호출된다.', () => {
    render(<MemoryRouter><TreeContainer/></MemoryRouter>)
    expect(initTree).toHaveBeenCalled();
  });
  
  it('초기화한 트리 정보를 사용해 renderTree 함수가 호출된다.', () => {
    tree = {
      children: {
        a: { children: {}}
      }
    }
    
    render(<MemoryRouter><TreeContainer/></MemoryRouter>)
    
    expect(renderTree).toHaveBeenCalled()
    expect(renderTree.mock.calls[0][0]).toStrictEqual(tree.children);
  });
  
  it('markUsedPaths가 호출된다', () => {
    render(<MemoryRouter><TreeContainer/></MemoryRouter>)
    expect(markUsedPaths).toHaveBeenCalled();
  });
});