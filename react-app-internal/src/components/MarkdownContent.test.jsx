import {beforeAll, beforeEach, expect, it, vi} from "vitest";
import {render, screen, waitFor} from "@testing-library/react";
import {MemoryRouter, Route, Routes} from "react-router-dom";
import MarkdownContent from "./MarkdownContent.jsx";
import {HelmetProvider} from "react-helmet-async";

beforeAll(() => {
  vi.mock('fetch')
})

afterAll(() => {
  vi.clearAllMocks();
})

let expectedHtml
describe('마크다운 콘텐츠 컴포넌트 렌더링 시', () => {
  beforeEach(() => {
    global.fetch = vi.fn(() => {
        return Promise.resolve({
          text: () => Promise.resolve(expectedHtml)
        });
      }
    )
  })
  
  it('루트 경로가 요청되면 home.html이 반환된다.', () => {
    const path = '';
    renderWithWrapper(path);
    
    expect(fetch).toHaveBeenCalledWith('/default/home.html');
  })
  
  it('요청 경로의 md 확장자를 html로 변경한 뒤 fetch 요청한다.', async () => {
    const path = '/path/to/file.md';
    renderWithWrapper(path);

    expect(fetch).toHaveBeenCalledWith('/html' + path.replace('.md', '.html'));
  });
  
  it('읽어온 HTML로 렌더링한다.', async () => {
    const path = '/path/to/file.md';
    const htmlText = 'result html'
    expectedHtml = `<div>${htmlText}</div>`
    renderWithWrapper(path);
    
    await waitFor(() => {
      expect(screen.getByText(htmlText)).toBeInTheDocument()
    });
  });
  
  it('페이지 타이틀이 파일명이 된다', async () => {
    const fileName = 'file';
    const path = '/path/to/file.md';
    const htmlText = 'result html'
    expectedHtml = `<div>${htmlText}</div>`
    renderWithWrapper(path);
    
    await waitFor(() => {
      expect(document.title).toBe(fileName);
    });
  });
  
  it('홈페이지에서는 댓글 레이아웃이 렌더링되지 않는다.', async () => {
    vi.mock('../stores/data.json', () => ({
      default: {
        isEnableComments: true,
        repo: 'example/repo',
        theme: 'github-light'
      }
    }))
    const path = '';
    const htmlText = 'result html'
    expectedHtml = `<div>${htmlText}</div>`
    const {container} = renderWithWrapper(path);
    await waitFor(() => {
      const script = container.querySelector('script');
      expect(script).toBeNull()
    });
  });
  
  it('홈페이지가 아니면 댓글 레이아웃이 렌더링된다.', async () => {
    vi.mock('../stores/data.json', () => ({
      default: {
        isEnableComments: true,
        repo: 'example/repo',
        theme: 'github-light'
      }
    }))
    const path = '/path/to/file.md';
    const htmlText = 'result html'
    expectedHtml = `<div>${htmlText}</div>`
    const {container} = renderWithWrapper(path);
    await waitFor(() => {
      const script = container.querySelector('script');
      expect(script).not.toBeNull()
    });
  });
  
  function renderWithWrapper(path) {
    return render((
      <MemoryRouter initialEntries={[path]}>
        <HelmetProvider>
          <Routes>
            <Route path="*" element={<MarkdownContent/>}>
            </Route>
          </Routes>
        </HelmetProvider>
      </MemoryRouter>
    ))
  }
});