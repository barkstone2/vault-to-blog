import {describe, expect, it, vi} from "vitest";
import {fireEvent, render} from "@testing-library/react";
import TreeItem from "./TreeItem.jsx";
import {TreeContainerContext} from "./TreeContainer.jsx";
import {MemoryRouter} from "react-router-dom";

const directoryIconId = 'DirectoryIcon';
const directoryCloseClass = 'is-collapsed';
let usedPaths = {current: {}};
let forceOpenDirectories = false;
let currentPath = ''
let mockNavigate;

beforeEach(() => {
  vi.mock('react-router-dom', async (importOriginal) => {
    return {
      ...(await importOriginal()),
      useLocation: vi.fn(() => {return {pathname: `${currentPath}`}}),
      useNavigate: vi.fn(() => {
        return mockNavigate = vi.fn();
      })
    }
  })
})

afterEach(() => {
  vi.clearAllMocks();
  forceOpenDirectories = false;
})

const renderWithWrapper = (component) => {
  return render(
    <MemoryRouter>
      <TreeContainerContext.Provider value={{usedPaths, forceOpenDirectories}}>
        <div className='markdown-preview-view'>
          {component}
        </div>
      </TreeContainerContext.Provider>
    </MemoryRouter>
  )
};

describe("트리 아이템 렌더링 시", () => {
  it('디렉토리면 nav-folder 클래스가 추가된다.', () => {
    const {container} = renderWithWrapper(<TreeItem title="title" isDirectory={true}/>);
    expect(container.querySelector('.tree-item')).toHaveClass('nav-folder');
  });
  
  it('디렉토리가 아니면 nav-file 클래스가 추가된다.', () => {
    const {container} = renderWithWrapper(<TreeItem title="title" isDirectory={false}/>);
    expect(container.querySelector('.tree-item')).not.toHaveClass('nav-folder');
    expect(container.querySelector('.tree-item')).toHaveClass('nav-file');
  });
  
  it('디렉토리면서 닫힌 상태면 is-collapsed 클래스가 추가된다.', () => {
    const {container} = renderWithWrapper(<TreeItem title="title" isDirectory={true}/>);
    expect(container.querySelector('.tree-item')).toHaveClass('is-collapsed');
  });
  
  it('디렉토리면서 열린 상태면 is-collapsed 클래스가 추가되지 않는다.', () => {
    const {container} = renderWithWrapper(<TreeItem title="title" isDirectory={true}/>);
    const clickable = container.querySelector('.tree-item-self');
    fireEvent.click(clickable)
    expect(container.querySelector('.tree-item')).not.toHaveClass('is-collapsed');
  });

  it('검색 결과 강제 확장 모드면 디렉토리가 기본으로 열린다.', () => {
    forceOpenDirectories = true;
    const {container} = renderWithWrapper(<TreeItem title="title" isDirectory={true}/>);
    expect(container.querySelector('.tree-item')).not.toHaveClass('is-collapsed');
    expect(container.querySelector('.tree-item-children')).not.toHaveClass('d-none');
  });
  
  it('디렉토리가 닫힌 상태면 자식 목록 태그에 d-none 클래스가 추가된다.', () => {
    const {container} = renderWithWrapper(<TreeItem title="title" isDirectory={true}/>);
    expect(container.querySelector('.tree-item-children ')).toHaveClass('d-none');
  });
  
  
  it('디렉토리면서 열린 상태면 자식 목록 태그에 d-none 클래스가 제거된다.', () => {
    const {container} = renderWithWrapper(<TreeItem title="title" isDirectory={true}/>);
    const clickable = container.querySelector('.tree-item-self');
    fireEvent.click(clickable)
    expect(container.querySelector('.tree-item-children')).not.toHaveClass('d-none');
  });
  
  it('현재 경로와 트리 아이템 경로가 같으면 is-active 클래스가 추가된다.', () => {
    currentPath = '/current/path/file.md'
    const {container} = renderWithWrapper(<TreeItem title="title" isDirectory={true} path={currentPath}/>);
    expect(container.querySelector('.tree-item-self')).toHaveClass('is-active');
  });
  
  it('현재 경로와 트리 아이템 경로가 다르면 is-active 클래스가 추가되지 않는다.', () => {
    currentPath = '/current/path/file.md'
    const {container} = renderWithWrapper(<TreeItem title="title" isDirectory={true} path='/other/path/file.md'/>);
    expect(container.querySelector('.tree-item-self')).not.toHaveClass('is-active');
  });
})

describe('트리 아이템 클릭 시', () => {
  it('디렉토리 타입이라면 is-collapsed 클래스가 제거된다.', () => {
    const {container, getByTestId} = renderWithWrapper(<TreeItem title="title" isDirectory={true}/>);
    const treeItem = container.querySelector('.tree-item');
    const treeItemSelf = container.querySelector('.tree-item-self');
    expect(getByTestId(directoryIconId)).toBeInTheDocument();
    expect(treeItem).toHaveClass('is-collapsed');
    
    fireEvent.click(treeItemSelf)
    
    expect(getByTestId(directoryIconId)).not.toHaveClass(directoryCloseClass);
    expect(treeItem).not.toHaveClass('is-collapsed');
  });
  
  it('디렉토리 타입이 아니라면 클래스가 변경되지 않는다.', () => {
    const {container} = renderWithWrapper(<TreeItem title="title"/>);
    const treeItem = container.querySelector('.tree-item');
    const treeItemSelf = container.querySelector('.tree-item-self');
    expect(treeItem).not.toHaveClass('is-collapsed');
    
    fireEvent.click(treeItemSelf)
    
    expect(treeItem).not.toHaveClass('is-collapsed');
  });
  
  it('파일 타입이라면 인자로 넘어온 path에 대해 navigate가 호출된다.', () => {
    const path = '/path/file.md'
    const {container} = renderWithWrapper(<TreeItem title="title" path={path}/>);
    const treeItemSelf = container.querySelector('.tree-item-self');
    
    fireEvent.click(treeItemSelf)
    
    expect(mockNavigate).toHaveBeenCalledWith(path);
  });
  
  it('파일 타입이라면 markdown-preview-view div의 스크롤 위치가 초기화 된다.', () => {
    const {container} = renderWithWrapper(<TreeItem title="title"/>);
    const treeItemSelf = container.querySelector('.tree-item-self');
    const scrollTarget = container.querySelector('.markdown-preview-view');
    scrollTarget.scrollTop = 100;
    scrollTarget.scrollLeft = 100;
    
    fireEvent.click(treeItemSelf)
    expect(scrollTarget.scrollTop).toBe(0)
    expect(scrollTarget.scrollLeft).toBe(0)
  });
});
