import {render} from "@testing-library/react";
import TreeContainer from "./TreeContainer.jsx";
import {initTree, renderTree} from "../utils/treeUtils.jsx";
import {afterAll, beforeAll, describe, expect, it, vi} from "vitest";
import {MemoryRouter} from "react-router-dom";

let tree = {};
describe('트리 컨테이너 컴포넌트 렌더링 시', () => {
  beforeAll(() => {
    vi.mock('../utils/treeUtils.jsx', () => {
      return {
        initTree: vi.fn(() => tree),
        renderTree: vi.fn()
      }
    })
  })
  
  afterAll(() => {
    vi.clearAllMocks();
  })
  
  it('트리 초기화 로직이 호출된다.', () => {
    tree = {
      children: {}
    }
    
    render(<MemoryRouter><TreeContainer/></MemoryRouter>)
    
    expect(initTree).toHaveBeenCalled();
  });
  
  it('초기화한 트리 정보를 사용해 renderTree 함수가 호출된다.', () => {
    tree = {
      children: {}
    }
    
    render(<MemoryRouter><TreeContainer/></MemoryRouter>)
    
    expect(renderTree).toHaveBeenCalled()
    const calls = renderTree.mock.calls;
    calls.forEach(call => {
      expect(call[0]).toStrictEqual(tree.children);
    });
  });
});