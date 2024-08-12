import {fireEvent, renderHook} from "@testing-library/react";
import {afterAll, beforeAll, describe, expect, it, vi} from "vitest";
import useBacklinkNavigation from "./useBacklinkNavigation.js";
import {MemoryRouter, useNavigate} from "react-router-dom";

const navigate = vi.fn();
beforeAll(() => {
  vi.mock('react-router-dom', async (importOriginal) => {
    return {
      ...(await importOriginal()),
      useNavigate: vi.fn(),
    }
  });
  useNavigate.mockReturnValue(navigate);
})

afterAll(() => {
  vi.clearAllMocks();
})

describe('백링크 네비게이션 훅 동작 시', () => {
  const setup = (content) => {
    const wrapper = ({children}) => (
    <MemoryRouter>
      {children}
    </MemoryRouter>
    );
    return renderHook(() => useBacklinkNavigation(content), {wrapper});
  };
  
  it('backlink 클래스 클릭 시 목적지로 이동하고 스크롤이 상단으로 이동한다.', () => {
    const href = "/test-path";
    document.body.innerHTML = `<div class="markdown-preview-view"><a href="${href}" class="internal-link">Test Link</a></div>`;
    const content = ''
    setup(content)
    
    const link = document.querySelector('.internal-link');
    const markdownView = document.querySelector('.markdown-preview-view');
    markdownView.scrollTo = vi.fn();
    
    fireEvent.click(link);
    
    expect(markdownView.scrollTo).toHaveBeenCalledWith(0, 0);
    expect(navigate).toHaveBeenCalledWith(href);
  });
  
  it('훅 클린업 동작 시 이벤트 리스너가 제거된다.', () => {
    const href = "/test-path";
    document.body.innerHTML = `<a href="${href}" class="internal-link">Test Link</a>`;
    const content = ''
    const { unmount } = setup(content);
    
    const link = document.querySelector('.internal-link');
    const removeEventListenerSpy = vi.spyOn(link, 'removeEventListener');
    
    unmount();
    
    expect(removeEventListenerSpy).toHaveBeenCalledWith('click', expect.any(Function));
  });
});