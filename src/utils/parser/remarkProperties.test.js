import {beforeAll, describe, expect, it, vi} from "vitest";
import remarkProperties from "./remarkProperties.js";
import remarkFrontmatter from "remark-frontmatter";
import remarkParseFrontmatter from "remark-parse-frontmatter";
import {u} from "unist-builder";

let inputAst;
let expectedAst;

beforeAll(() => {
  vi.mock('remark-frontmatter', () => ({
    default: vi.fn(() => (tree) => tree)
  }));
  vi.mock('remark-parse-frontmatter', () => ({
    default: vi.fn(() => (tree) => tree)
  }));
})

describe('프로퍼티 파싱 요청 시', () => {
  it('remarkFrontmatter, remarkParseFrontmatter 플러그인이 먼저 호출된다.', () => {
    inputAst = u('root', []);
    remarkProperties()(inputAst)
    
    expect(remarkFrontmatter).toHaveBeenCalled()
    expect(remarkParseFrontmatter).toHaveBeenCalled()
  });
  
  it('yaml 타입 노드를 HTML 태그로 파싱한다.', () => {
    inputAst = u('root', [
      u('yaml', "a: A")
    ]);
    expectedAst = u('root', [
      u('html', '<div class="property-container">'),
      u('html', '<div class="property-title">'),
      u('text', 'a'),
      u('html', '</div>'),
      u('html', '<div class="property-value">'),
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
      u('html', '<div class="property-title">'),
      u('text', 'a'),
      u('html', '</div>'),
      u('html', '<div class="property-value">'),
      u('text', 'A'),
      u('html', '</div>'),
      u('html', '<div class="property-title">'),
      u('text', 'b'),
      u('html', '</div>'),
      u('html', '<div class="property-value">'),
      u('text', 'B'),
      u('html', '</div>'),
      u('html', '</div>'),
    ])
    
    remarkProperties()(inputAst)
    
    expect(inputAst).toEqual(expectedAst)
  });
})
