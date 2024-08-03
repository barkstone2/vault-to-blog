import {describe, expect, it} from "vitest";
import TreeItemIcon from "./TreeItemIcon.jsx";
import {render} from "@testing-library/react";
import '@testing-library/jest-dom';

describe('트리 아이템 아이콘 컴포넌트 렌더링 시', () => {
  it('디렉토리이면서 열려있으면 FolderOpenIcon이 반환된다.', () => {
    const {getByTestId} = render(<TreeItemIcon isDirectory={true} isOpen={true}/>);
    expect(getByTestId('FolderOpenIcon')).toBeInTheDocument()
  });
  
  it('디렉토리이면서 닫혀 있으면 FolderIcon이 반환된다.', () => {
    const {getByTestId} = render(<TreeItemIcon isDirectory={true} isOpen={false}/>);
    expect(getByTestId('FolderIcon')).toBeInTheDocument()
  });
  
  it('디렉토리가 아니면 DescriptionIcon이 반환된다.', () => {
    const {getByTestId} = render(<TreeItemIcon isDirectory={false} isOpen={false}/>);
    expect(getByTestId('DescriptionIcon')).toBeInTheDocument()
  });
});