import {u} from "unist-builder";
import {afterAll, beforeAll, describe, expect, it, vi} from "vitest";
import remarkImage from "./remarkImage.js";

beforeAll(() => {
  vi.mock('../file/fileUtils', () => {
    const imageMap = { 'image.png': ['image.png'] };
    return {
      getImageFileMap: vi.fn(() => imageMap)
    }
  })
});
afterAll(() => {
  vi.clearAllMocks();
});

let inputAst;
let expectedAst;

describe("이미지 파싱 플러그인 동작 시", () => {
  it("![[]]으로 감싸진 텍스트를 image 태그로 변환한다.", () => {
    inputAst = u('root', [
      u('paragraph', [
        u('text', '![[image.png]]')
      ])
    ]);
    expectedAst = u('root', [
      u('paragraph', [
        u('html', `<img src="/sources/image.png" alt="image" title="image"/>`)
      ])
    ]);
    
    remarkImage()(inputAst)
    
    expect(inputAst).toEqual(expectedAst)
  });
  
  it("![[]]으로 감싸진 텍스트가 imageMap에 없으면 이미지 태그로 변환하지 않는다", () => {
    inputAst = u('root', [
      u('paragraph', [
        u('text', '![[image2.png]]')
      ])
    ]);
    expectedAst = u('root', [
      u('paragraph', [
        u('text', '![[image2.png]]')
      ])
    ]);
    
    remarkImage()(inputAst)
    
    expect(inputAst).toEqual(expectedAst)
  });
  
  it("![[]]으로 감싸진 텍스트에 `|` 기호로 구분된 크기값이 있으면 크기 정보가 추가된다.", () => {
    inputAst = u('root', [
      u('paragraph', [
        u('text', '![[image.png|300]]')
      ])
    ]);
    expectedAst = u('root', [
      u('paragraph', [
        u('html', `<img src="/sources/image.png" alt="image" title="image" style="width: 300px;"/>`)
      ])
    ]);
    
    remarkImage()(inputAst)
    
    expect(inputAst).toEqual(expectedAst)
  });
})