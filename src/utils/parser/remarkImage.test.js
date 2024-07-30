import {u} from "unist-builder";
import {afterAll, beforeAll, describe, expect, it, vi} from "vitest";
import remarkImage from "./remarkImage.js";

let imageMap = { 'image.png': ['image.png'] };
beforeAll(() => {
  vi.mock('../file/fileUtils', () => {
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
  
  it('alt와 title에는 순수한 이미지 이름을 사용한다.', () => {
    imageMap = {'path/to/image.png': ['path/to/image.png']}
    inputAst = u('root', [
      u('paragraph', [
        u('text', '![[path/to/image.png|300]]')
      ])
    ]);
    expectedAst = u('root', [
      u('paragraph', [
        u('html', `<img src="/sources/path/to/image.png" alt="image" title="image" style="width: 300px;"/>`)
      ])
    ]);
    
    remarkImage()(inputAst)
    
    expect(inputAst).toEqual(expectedAst)
  });
  
  it('이미지 이름에 포함된 .이 파싱된다.', () => {
    imageMap = {'i.m.a.g.e.png': ['i.m.a.g.e.png']}
    inputAst = u('root', [
      u('paragraph', [
        u('text', '![[i.m.a.g.e.png|300]]')
      ])
    ]);
    expectedAst = u('root', [
      u('paragraph', [
        u('html', `<img src="/sources/i.m.a.g.e.png" alt="i.m.a.g.e" title="i.m.a.g.e" style="width: 300px;"/>`)
      ])
    ]);
    
    remarkImage()(inputAst)
    
    expect(inputAst).toEqual(expectedAst)
  });
  
  it('이미지 src가 인코딩 된다.', () => {
    imageMap = {'이미지.png': ['이미지.png']}
    inputAst = u('root', [
      u('paragraph', [
        u('text', '![[이미지.png]]')
      ])
    ]);
    expectedAst = u('root', [
      u('paragraph', [
        u('html', `<img src="/sources/${encodeURI("이미지")}.png" alt="이미지" title="이미지"/>`)
      ])
    ]);
    
    remarkImage()(inputAst)
    
    expect(inputAst).toEqual(expectedAst)
  });
})