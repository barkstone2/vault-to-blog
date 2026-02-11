import {render, screen, waitFor} from '@testing-library/react';
import {expect, vi} from 'vitest';
import App from './App';
import {initImageFileMap, initMarkdownFileMap, initMarkdownSearchMap, initTocMap} from './utils/file/fileUtils';
import {MemoryRouter} from "react-router-dom";

beforeAll(() => {
  vi.stubGlobal('fetch', vi.fn(async () => ({
    text: async () => '',
  })));
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(() => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  });

  vi.mock('./utils/file/fileUtils', () => ({
    initMarkdownFileMap: vi.fn(),
    initMarkdownSearchMap: vi.fn(),
    initImageFileMap: vi.fn(),
    initTocMap: vi.fn(),
    getTocMap: vi.fn(() => ({})),
    getIndexFilePath: vi.fn(() => ''),
    getMarkdownFileSet: vi.fn(() => new Set()),
  }));
})

afterAll(() => {
  vi.unstubAllGlobals();
  vi.clearAllMocks();
})

describe('App 컴포넌트 렌더링 시', () => {
  it('초기화 메서드가 호출된다.', async () => {
    render(<MemoryRouter initialEntries={['/file.md']}><App /></MemoryRouter>);
    
    await waitFor(() => {
      expect(initMarkdownFileMap).toHaveBeenCalled();
      expect(initMarkdownSearchMap).toHaveBeenCalled();
      expect(initImageFileMap).toHaveBeenCalled();
      expect(initTocMap).toHaveBeenCalled();
    });
  });
  
  it('아직 초기화 되지 않았을 때는 로딩 컴포넌트가 렌더링된다.', () => {
    render(<MemoryRouter initialEntries={['/file.md']}><App /></MemoryRouter>);
    
    expect(screen.getByTestId('init-loading-screen')).toBeInTheDocument();
  });
  
  it('초기화가 완료되면 App이 렌더링 된다.', async () => {
    render(<MemoryRouter initialEntries={['/file.md']}><App /></MemoryRouter>);

    await waitFor(() => {
      expect(screen.queryByTestId('init-loading-screen')).not.toBeInTheDocument();
    });
  });
});
