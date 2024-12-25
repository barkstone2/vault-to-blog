import {u} from "unist-builder";
import remarkBacklink from "./remarkBacklink.js";
import {afterAll, beforeAll, describe, expect, it, vi} from "vitest";
import {getMarkdownFileMap} from "../file/fileUtils.js";

beforeAll(() => {
  vi.mock('../file/fileUtils', () => {
    const fileMap = { 'md': ['md.md'] };
    return {
      getMarkdownFileMap: vi.fn(() => fileMap)
    }
  })
  getMarkdownFileMap()
});
afterAll(() => {
  vi.clearAllMocks();
});

let inputAst;
let expectedAst;

describe("remarkBacklink 플러그인 동작 시", () => {
  it("[[]]으로 감싸진 텍스트에 대한 매핑 정보가 있으면 internal 링크 노드로 변환한다.", () => {
    inputAst = u('root', [
      u('paragraph', [
        u('text', '[[md]]')
      ])
    ]);
    expectedAst = u('root', [
      u('paragraph', [
        u('html', '<a href="/md.md" class="internal-link" data-href="/md.md" target="_blank" rel="noopener">md</a>')
      ])
    ]);
    remarkBacklink()(inputAst)
    expect(inputAst).toEqual(expectedAst)
  });
  
  it("[[]]으로 감싸진 텍스트에 대한 매핑 정보가 없으면 unresolved 링크 노드로 변환한다.", () => {
    inputAst = u('root', [
      u('paragraph', [
        u('text', '[[unresolved]]')
      ])
    ]);
    expectedAst = u('root', [
      u('paragraph', [
        u('html', `<a href="#" class="internal-link is-unresolved" data-href="unresolved" target="_blank" rel="noopener" tabindex="-1">unresolved</a>`)
      ])
    ]);
    remarkBacklink()(inputAst)
    expect(inputAst).toEqual(expectedAst)
  });
  
  it("![[]]으로 감싸진 텍스트는 링크로 변환하지 않는다.", () => {
    inputAst = u('root', [
      u('paragraph', [
        u('text', '![[image]]')
      ])
    ]);
    expectedAst = u('root', [
      u('paragraph', [
        u('text', '![[image]]')
      ])
    ]);
    remarkBacklink()(inputAst)
    expect(inputAst).toEqual(expectedAst)
  });
  
  it("[[]]으로 감싸진 텍스트 앞뒤에 있는 텍스트가 유지된다.", () => {
    inputAst = u('root', [
      u('paragraph', [
        u('text', 'before[[md]]after')
      ])
    ]);
    expectedAst = u('root', [
      u('paragraph', [
        u('text', 'before'),
        u('html', '<a href="/md.md" class="internal-link" data-href="/md.md" target="_blank" rel="noopener">md</a>'),
        u('text', 'after')
      ])
    ]);
    remarkBacklink()(inputAst)
    expect(inputAst).toEqual(expectedAst)
  });
  
  it("[[]]으로 감싸진 텍스트에 표시용 이름이 있으면 해당 이름으로 표시한다.", () => {
    inputAst = u('root', [
      u('paragraph', [
        u('text', '[[md|display]]')
      ])
    ]);
    expectedAst = u('root', [
      u('paragraph', [
        u('html', '<a href="/md.md" class="internal-link" data-href="/md.md" target="_blank" rel="noopener">display</a>'),
      ])
    ]);
    remarkBacklink()(inputAst)
    expect(inputAst).toEqual(expectedAst)
  });
  
  it("[[]]으로 감싸진 텍스트에 매핑 정보가 없어도 표시용 이름이 있으면 해당 이름으로 표시한다.", () => {
    inputAst = u('root', [
      u('paragraph', [
        u('text', '[[unresolved|display]]')
      ])
    ]);
    expectedAst = u('root', [
      u('paragraph', [
        u('html', '<a href="#" class="internal-link is-unresolved" data-href="unresolved" target="_blank" rel="noopener" tabindex="-1">display</a>'),
      ])
    ]);
    remarkBacklink()(inputAst)
    expect(inputAst).toEqual(expectedAst)
  });
})