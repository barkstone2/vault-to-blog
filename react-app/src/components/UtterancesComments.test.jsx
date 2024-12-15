import {expect, it, vi} from "vitest";
import {cleanup, render} from "@testing-library/react";
import UtterancesComments from "./UtterancesComments.jsx";
import data from '../stores/data.json'

describe('UtterancesComments 컴포넌트 렌더링 시', () => {
  beforeAll(() => {
    vi.mock('../stores/data.json', () => ({
      default: {
        isEnableComments: false,
        repo: 'example/repo',
        theme: 'github-light'
      }
    }))
  })
  
  afterEach(() => {
    cleanup();
  });
  
  it('코멘트가 비활성화된 상태면 스크립트 태그가 렌더링되지 않는다.', () => {
    data.isEnableComments = false;
    const { container } = render(<UtterancesComments />);
    expect(container.querySelector('script')).toBeNull();
  });
  
  it('코멘트가 활성화된 상태면 스크립트 태그가 렌더링 된다.', () => {
    data.isEnableComments = true;

    const { container } = render(<UtterancesComments />);
    const script = container.querySelector('script');
    
    expect(script).not.toBeNull();
    expect(script.src).toBe('https://utteranc.es/client.js');
    expect(script.getAttribute('issue-term')).toBe('pathname');
    expect(script.getAttribute('repo')).toBe('example/repo');
    expect(script.getAttribute('theme')).toBe('github-light');
    expect(script.crossOrigin).toBe('anonymous');
    expect(script.async).toBe(true);
  });
  
  it('컴포넌트가 언마운트될 때 스크립트 태그가 제거된다.', () => {
    data.isEnableComments = true;
    const { container, unmount } = render(<UtterancesComments />);
    const commentsDiv = container.querySelector('div');
    
    expect(commentsDiv).not.toBeNull();
    expect(commentsDiv.innerHTML).not.toBe('');
    
    unmount();
    
    expect(commentsDiv.innerHTML).toBe('');
  });
});