import {describe, expect, it} from "vitest";
import DirectoryIcon from "./DirectoryIcon.jsx";
import {render} from "@testing-library/react";
import '@testing-library/jest-dom';

describe('트리 아이템 아이콘 컴포넌트 렌더링 시', () => {
  it('디렉토리가 아니면 렌더링 되지 않는다.', () => {
    const {queryByTestId} = render(<DirectoryIcon isDirectory={false} isOpen={true}/>);
    expect(queryByTestId('DirectoryIcon')).not.toBeInTheDocument()
  });
  
  it('디렉토리면 렌더링 된다.', () => {
    const {getByTestId} = render(<DirectoryIcon isDirectory={true} isOpen={true}/>);
    expect(getByTestId('DirectoryIcon')).toBeInTheDocument()
  });
  
  it('디렉토리면서 닫혀 있으면 is-collapsed 클래스가 부여되어 렌더링된다.', () => {
    const {getByTestId} = render(<DirectoryIcon isDirectory={true} isOpen={false}/>);
    expect(getByTestId('DirectoryIcon')).toHaveClass('is-collapsed');
  });
  
  it('디렉토리면서 열려있으면 is-collapsed 클래스가 부여되지 않는다.', () => {
    const {getByTestId} = render(<DirectoryIcon isDirectory={true} isOpen={true}/>);
    expect(getByTestId('DirectoryIcon')).not.toHaveClass('is-collapsed');
  });
});