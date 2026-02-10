import {fireEvent, render, screen} from "@testing-library/react";
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

  it('검색어가 주어지면 트리 초기화 시 검색어를 함께 전달한다.', () => {
    render(<MemoryRouter><TreeContainer searchKeyword="react"/></MemoryRouter>)
    expect(initTree).toHaveBeenCalledWith(undefined, 'react');
  });

  it('검색 탭 모드면 검색 input이 트리 컨테이너 내부 상단에 렌더링된다.', () => {
    render(<MemoryRouter><TreeContainer showSearchInput={true} searchKeyword=""/></MemoryRouter>);
    expect(screen.getByLabelText('Search query')).toBeInTheDocument();
  });

  it('검색 input 값 변경 시 콜백이 호출된다.', () => {
    const onSearchKeywordChange = vi.fn();
    render(
      <MemoryRouter>
        <TreeContainer showSearchInput={true} searchKeyword="" onSearchKeywordChange={onSearchKeywordChange}/>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText('Search query'), {target: {value: 'react'}});
    expect(onSearchKeywordChange).toHaveBeenCalledWith('react');
  });

  it('검색 탭에서 검색어가 비어있으면 트리를 렌더링하지 않는다.', () => {
    render(<MemoryRouter><TreeContainer showSearchInput={true} searchKeyword=""/></MemoryRouter>);
    expect(renderTree).not.toHaveBeenCalled();
  });
});
