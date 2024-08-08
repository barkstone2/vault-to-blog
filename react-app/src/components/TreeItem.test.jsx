import {describe, expect, it, vi} from "vitest";
import {fireEvent, render} from "@testing-library/react";
import TreeItem from "./TreeItem.jsx";

const directoryIconId = 'DirectoryIcon';
const directoryCloseClass = 'is-collapsed';

describe("트리 아이템 렌더링 시", () => {
  it('디렉토리 타입이면 디렉토리 클래스가 추가된다.', () => {
    const {container} = render(<TreeItem title="title" isDirectory={true}/>);
    expect(container.querySelector('.nav-directory')).toBeInTheDocument()
  });
  
  it('디렉토리 타입일 때 타이틀과 아이콘이 제대로 렌더링된다.', () => {
    const title = 'test-title';
    const {getByText, getByTestId} = render(<TreeItem title={title} isDirectory={true}/>);
    expect(getByText(title)).toBeInTheDocument()
    expect(getByTestId(directoryIconId)).toBeInTheDocument()
  });
  
  it('디렉토리 타입이 아니면 디렉토리 클래스가 추가되지 않는다.', () => {
    const {container} = render(<TreeItem title="title" isDirectory={false}/>);
    expect(container.querySelector('.nav-directory')).not.toBeInTheDocument()
  });
  
  it('디렉토리 타입이 아닐 때 타이틀이 렌더링되고 아이콘이 렌더링되지 않는다.', () => {
    const title = 'test-title';
    const {getByText, getByTestId, queryByTestId} = render(<TreeItem title={title}/>);
    expect(getByText(title)).toBeInTheDocument()
    expect(queryByTestId(directoryIconId)).not.toBeInTheDocument()
  });
})

describe('트리 아이템 클릭 시', () => {
  it('디렉토리 타입이라면 디렉토리 아이콘의 is-collapsed 클래스가 제거된다.', () => {
    const {container, getByTestId} = render(<TreeItem title="title" isDirectory={true}/>);
    const parentDiv = container.querySelector('.nav-directory');
    const navItem = container.querySelector('.nav-item');
    expect(getByTestId(directoryIconId)).toBeInTheDocument();
    expect(parentDiv).not.toHaveClass('open');
    
    fireEvent.click(navItem)
    
    expect(getByTestId(directoryIconId)).not.toHaveClass(directoryCloseClass);
    expect(parentDiv).toHaveClass('open');
  });
  
  it('디렉토리 타입이 아니라면 열림 상태 토글이 발생하지 않는다.', () => {
    const {container} = render(<TreeItem title="title"/>);
    const navItem = container.querySelector('.nav-item');
    
    fireEvent.click(navItem)
    
    expect(container.querySelector('.open')).not.toBeInTheDocument();
    expect(container.querySelector('.nav-directory')).not.toBeInTheDocument();
  });
  
  it('디렉토리 타입이 아니면 바인딩된 이벤트가 호출된다.', () => {
    const clickEvent = vi.fn()
    const {container} = render(<TreeItem title="title" onClick={clickEvent}/>);
    const navItem = container.querySelector('.nav-item');
    
    fireEvent.click(navItem)
    
    expect(clickEvent).toHaveBeenCalledTimes(1)
  });
  
  it('디렉토리 타입 클릭 시에도 바인딩된 함수가 호출된다.', () => {
    const clickEvent = vi.fn()
    const {container} = render(<TreeItem title="title" isDirectory={true} onClick={clickEvent}/>);
    const navItem = container.querySelector('.nav-item');
    
    fireEvent.click(navItem)
    
    expect(clickEvent).toHaveBeenCalledTimes(1)
  });
});