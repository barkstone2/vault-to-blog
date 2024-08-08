import {describe, expect, it, vi} from "vitest";
import {fireEvent, render} from "@testing-library/react";
import TreeItem from "./TreeItem.jsx";

const directoryIconId = 'DirectoryIcon';
const directoryCloseClass = 'is-collapsed';

describe("트리 아이템 렌더링 시", () => {
  it('디렉토리면 nav-folder 클래스가 추가된다.', () => {
    const {container} = render(<TreeItem title="title" isDirectory={true}/>);
    expect(container.querySelector('.tree-item')).toHaveClass('nav-folder');
  });
  
  it('디렉토리가 아니면 nav-file 클래스가 추가된다.', () => {
    const {container} = render(<TreeItem title="title" isDirectory={false}/>);
    expect(container.querySelector('.tree-item')).not.toHaveClass('nav-folder');
    expect(container.querySelector('.tree-item')).toHaveClass('nav-file');
  });
  
  it('디렉토리면서 닫힌 상태면 is-collapsed 클래스가 추가된다.', () => {
    const {container} = render(<TreeItem title="title" isDirectory={true}/>);
    expect(container.querySelector('.tree-item')).toHaveClass('is-collapsed');
  });
  
  it('디렉토리면서 열린 상태면 is-collapsed 클래스가 추가되지 않는다.', () => {
    const {container} = render(<TreeItem title="title" isDirectory={true}/>);
    const clickable = container.querySelector('.tree-item-self');
    fireEvent.click(clickable)
    expect(container.querySelector('.tree-item')).not.toHaveClass('is-collapsed');
  });
  
  it('디렉토리가 닫힌 상태면 자식 목록 태그에 d-none 클래스가 추가된다.', () => {
    const {container} = render(<TreeItem title="title" isDirectory={true}/>);
    expect(container.querySelector('.tree-item-children ')).toHaveClass('d-none');
  });
  
  
  it('디렉토리면서 열린 상태면 자식 목록 태그에 d-none 클래스가 제거된다.', () => {
    const {container} = render(<TreeItem title="title" isDirectory={true}/>);
    const clickable = container.querySelector('.tree-item-self');
    fireEvent.click(clickable)
    expect(container.querySelector('.tree-item-children')).not.toHaveClass('d-none');
  });
})

describe('트리 아이템 클릭 시', () => {
  it('디렉토리 타입이라면 is-collapsed 클래스가 제거된다.', () => {
    const {container, getByTestId} = render(<TreeItem title="title" isDirectory={true}/>);
    const treeItem = container.querySelector('.tree-item');
    const treeItemSelf = container.querySelector('.tree-item-self');
    expect(getByTestId(directoryIconId)).toBeInTheDocument();
    expect(treeItem).toHaveClass('is-collapsed');
    
    fireEvent.click(treeItemSelf)
    
    expect(getByTestId(directoryIconId)).not.toHaveClass(directoryCloseClass);
    expect(treeItem).not.toHaveClass('is-collapsed');
  });
  
  it('디렉토리 타입이 아니라면 클래스가 변경되지 않는다.', () => {
    const {container} = render(<TreeItem title="title"/>);
    const treeItem = container.querySelector('.tree-item');
    const treeItemSelf = container.querySelector('.tree-item-self');
    expect(treeItem).not.toHaveClass('is-collapsed');
    
    fireEvent.click(treeItemSelf)
    
    expect(treeItem).not.toHaveClass('is-collapsed');
  });
  
  it('디렉토리 타입이 아니면 바인딩된 이벤트가 호출된다.', () => {
    const clickEvent = vi.fn()
    const {container} = render(<TreeItem title="title" onClick={clickEvent}/>);
    const treeItemSelf = container.querySelector('.tree-item-self');
    
    fireEvent.click(treeItemSelf)
    
    expect(clickEvent).toHaveBeenCalledTimes(1)
  });
  
  it('디렉토리 타입 클릭 시에도 바인딩된 함수가 호출된다.', () => {
    const clickEvent = vi.fn()
    const {container} = render(<TreeItem title="title" isDirectory={true} onClick={clickEvent}/>);
    const treeItemSelf = container.querySelector('.tree-item-self');
    
    fireEvent.click(treeItemSelf)
    
    expect(clickEvent).toHaveBeenCalledTimes(1)
  });
});