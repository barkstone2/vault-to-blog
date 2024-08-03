import {describe, expect, it} from "vitest";
import remarkProperties from "./remarkProperties.js";
import {u} from "unist-builder";

let inputAst;
let expectedAst;

describe('프로퍼티 파싱 요청 시', () => {
  it('yaml 타입 노드를 HTML 태그로 파싱한다.', () => {
    inputAst = u('root', [
      u('yaml', "a: A")
    ]);
    expectedAst = u('root', [
      u('html', '<div class="property-container">'),
      u('html', '<div class="property-title" title="a">'),
      u('text', 'a'),
      u('html', '</div>'),
      u('html', '<div class="property-value" title="A">'),
      u('text', 'A'),
      u('html', '</div>'),
      u('html', '</div>'),
    ])

    remarkProperties()(inputAst)
    
    expect(inputAst).toEqual(expectedAst)
  });
  
  it('프로퍼티가 여러개라도 모두 파싱된다.', () => {
    inputAst = u('root', [
      u('yaml', "a: A\nb: B")
    ]);
    expectedAst = u('root', [
      u('html', '<div class="property-container">'),
      u('html', '<div class="property-title" title="a">'),
      u('text', 'a'),
      u('html', '</div>'),
      u('html', '<div class="property-value" title="A">'),
      u('text', 'A'),
      u('html', '</div>'),
      u('html', '<div class="property-title" title="b">'),
      u('text', 'b'),
      u('html', '</div>'),
      u('html', '<div class="property-value" title="B">'),
      u('text', 'B'),
      u('html', '</div>'),
      u('html', '</div>'),
    ])
    
    remarkProperties()(inputAst)
    
    expect(inputAst).toEqual(expectedAst)
  });
})
