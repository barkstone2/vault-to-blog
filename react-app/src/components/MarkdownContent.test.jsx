import {beforeAll, beforeEach, expect, it, vi} from "vitest";
import {render, screen, waitFor} from "@testing-library/react";
import {MemoryRouter, Route, Routes} from "react-router-dom";
import MarkdownContent from "./MarkdownContent.jsx";

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
    render(
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="*" element={<MarkdownContent/>}>
          </Route>
        </Routes>
      </MemoryRouter>
    );
    
    expect(fetch).toHaveBeenCalledWith('/home.html');
  })
  
  it('요청 경로의 md 확장자를 html로 변경한 뒤 fetch 요청한다.', async () => {
    const path = '/path/to/file.md';
    render(
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="*" element={<MarkdownContent/>}>
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(fetch).toHaveBeenCalledWith('/html' + path.replace('.md', '.html'));
  });
  
  it('읽어온 HTML로 렌더링한다.', async () => {
    const path = '/path/to/file.md';
    const htmlText = 'result html'
    expectedHtml = `<div>${htmlText}</div>`
    render(
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="*" element={<MarkdownContent/>}>
          </Route>
        </Routes>
      </MemoryRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText(htmlText)).toBeInTheDocument()
    });
  });
});