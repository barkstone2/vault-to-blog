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