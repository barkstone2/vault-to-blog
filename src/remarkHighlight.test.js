import {u} from "unist-builder";
import remarkHighlight from "./remarkHighlight.js";
import {describe, expect, it} from "vitest";

let inputAst;
let expectedAst;

describe("remarkHighlight 플러그인 동작 시", () => {
  it("== ==으로 감싸진 텍스트를 mark 태그로 변환한다.", () => {
    inputAst = u('root', [
      u('paragraph', [
        u('text', '==highlight==')
      ])
    ]);
    expectedAst = u('root', [
      u('paragraph', [
        u('html', '<mark>highlight</mark>')
      ])
    ]);
    remarkHighlight()(inputAst)
    expect(inputAst).toEqual(expectedAst)
  });
  
  it("문자열 중간에 있는 == ==으로 감싸진 텍스트를 mark 태그로 변환한다.", () => {
    inputAst = u('root', [
      u('paragraph', [
        u('text', '텍스트==highlight==텍스트')
      ])
    ]);
    expectedAst = u('root', [
      u('paragraph', [
        u('text', '텍스트'),
        u('html', '<mark>highlight</mark>'),
        u('text', '텍스트'),
      ])
    ]);
    remarkHighlight()(inputAst)
    expect(inputAst).toEqual(expectedAst)
  });
  
  it("문자열 앞에 있는 == ==으로 감싸진 텍스트를 mark 태그로 변환한다.", () => {
    inputAst = u('root', [
      u('paragraph', [
        u('text', '==highlight==텍스트')
      ])
    ]);
    expectedAst = u('root', [
      u('paragraph', [
        u('html', '<mark>highlight</mark>'),
        u('text', '텍스트'),
      ])
    ]);
    remarkHighlight()(inputAst)
    expect(inputAst).toEqual(expectedAst)
  });
  
  it("문자열 끝에 있는 == ==으로 감싸진 텍스트를 mark 태그로 변환한다.", () => {
    inputAst = u('root', [
      u('paragraph', [
        u('text', '텍스트==highlight==')
      ])
    ]);
    expectedAst = u('root', [
      u('paragraph', [
        u('text', '텍스트'),
        u('html', '<mark>highlight</mark>'),
      ])
    ]);
    remarkHighlight()(inputAst)
    expect(inputAst).toEqual(expectedAst)
  });
  
  it('== 시작 표시 뒤에 공백이 있는 경우 하이라이팅 되지 않는다.', () => {
    inputAst = u('root', [
      u('paragraph', [
        u('text', '== not highlight==')
      ])
    ]);
    expectedAst = u('root', [
      u('paragraph', [
        u('text', '== not highlight=='),
      ])
    ]);
    
    remarkHighlight()(inputAst)
    
    expect(inputAst).toEqual(expectedAst)
  });
  
  it('== == 표시 안 텍스트에 공백이 있는 경우 하이라이팅 된다.', () => {
    inputAst = u('root', [
      u('paragraph', [
        u('text', '==should highlight==')
      ])
    ]);
    expectedAst = u('root', [
      u('paragraph', [
        u('html', '<mark>should highlight</mark>'),
      ])
    ]);
    
    remarkHighlight()(inputAst)
    
    expect(inputAst).toEqual(expectedAst)
  });
  
  it('== 끝 표시 앞에 공백이 있는 경우 하이라이팅 되지 않는다.', () => {
    inputAst = u('root', [
      u('paragraph', [
        u('text', '==not highlight ==')
      ])
    ]);
    expectedAst = u('root', [
      u('paragraph', [
        u('text', '==not highlight =='),
      ])
    ]);
    
    remarkHighlight()(inputAst)
    
    expect(inputAst).toEqual(expectedAst)
  });
  
  it('연속으로 == == 구문이 나올 경우에 모두 하이라이팅 된다.', () => {
    inputAst = u('root', [
      u('paragraph', [
        u('text', '==highlight====highlight====highlight==')
      ])
    ]);
    expectedAst = u('root', [
      u('paragraph', [
        u('html', '<mark>highlight</mark>'),
        u('html', '<mark>highlight</mark>'),
        u('html', '<mark>highlight</mark>'),
      ])
    ]);
    
    remarkHighlight()(inputAst)
    
    expect(inputAst).toEqual(expectedAst)
  });
  
  it('리스트 안에서도 하이라이팅된다', () => {
    inputAst = u('root', [
      u('list',[
        u('listItem', [u('text', '==highlight==')])
      ]),
    ]);
    expectedAst = u('root', [
      u('list',[
        u('listItem', [u('html', '<mark>highlight</mark>')])
      ])
    ]);
    
    remarkHighlight()(inputAst)
    
    expect(inputAst).toEqual(expectedAst)
  })
  
  it('주석 안에서도 하이라이팅된다', () => {
    inputAst = u('root', [
      u('blockquote', [
        u('paragraph', [
          u('text', '==highlight==')
        ])
      ]),
    ]);
    expectedAst = u('root', [
      u('blockquote', [
        u('paragraph', [
        u('html', '<mark>highlight</mark>'),
        ])
      ])
    ]);
    
    remarkHighlight()(inputAst)
    
    expect(inputAst).toEqual(expectedAst)
  })
  
  it('링크 안에서도 하이라이팅된다', () => {
    inputAst = u('root', [
      u('link', {url: 'https://naver.com'}, [
        u('text', '==naver==')
      ])
    ]);
    expectedAst = u('root', [
      u('link', {url: 'https://naver.com'}, [
        u('html', '<mark>naver</mark>'),
      ])
    ]);
    
    remarkHighlight()(inputAst)
    
    expect(inputAst).toEqual(expectedAst)
  });
})
