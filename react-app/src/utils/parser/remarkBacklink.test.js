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
  it("[[]]으로 감싸진 텍스트를 html 노드로 변환한다.", () => {
    inputAst = u('root', [
      u('paragraph', [
        u('text', '[[md]]')
      ])
    ]);
    expectedAst = u('root', [
      u('paragraph', [
        u('html', '<a href="/md.md" class="backlink">md</a>')
      ])
    ]);
    remarkBacklink()(inputAst)
    expect(inputAst).toEqual(expectedAst)
  });
  
  it("[[]]으로 감싸진 텍스트가 fileMap에 없으면 html 노드로 변환하지 않는다", () => {
    inputAst = u('root', [
      u('paragraph', [
        u('text', '[[md.png]]')
      ])
    ]);
    expectedAst = u('root', [
      u('paragraph', [
        u('text', '[[md.png]]')
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
        u('html', '<a href="/md.md" class="backlink">display</a>')
      ])
    ]);
    remarkBacklink()(inputAst)
    expect(inputAst).toEqual(expectedAst)
  });
})