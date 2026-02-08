import {beforeEach, describe, expect, it, vi} from "vitest";
import {render, waitFor} from "@testing-library/react";
import {MemoryRouter, Route, Routes} from "react-router-dom";
import {HelmetProvider} from "react-helmet-async";

vi.mock('../stores/data.json', () => ({
  default: {
    indexFilePath: 'index.md',
    isEnableComments: false,
    repo: '',
    theme: '',
  }
}));

import MarkdownContent from "./MarkdownContent.jsx";

describe('index file path 설정 시', () => {
  beforeEach(() => {
    global.fetch = vi.fn(() => Promise.resolve({
      text: () => Promise.resolve('<div>index</div>')
    }));
  });

  it('루트 경로 요청은 index.md html을 반환한다.', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <HelmetProvider>
          <Routes>
            <Route path="*" element={<MarkdownContent/>}/>
          </Routes>
        </HelmetProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/html/index.html');
    });
  });
});
