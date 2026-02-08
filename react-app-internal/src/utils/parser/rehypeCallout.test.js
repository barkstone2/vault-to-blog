import {u} from "unist-builder";
import {visit} from 'unist-util-visit'
import {afterAll, beforeAll, describe, expect, it, vi} from "vitest";
import rehypeCallout from "./rehypeCallout.js";
import {calloutSvgPath, loadCalloutSVGSync} from "../svg/svgUtils.js";

beforeAll(() => {
  vi.mock('../svg/svgUtils.js', () => ({
    loadCalloutSVGSync: vi.fn(),
    calloutSvgPath: vi.fn((iconName) => {
      return `path${iconName}`
    })
  }))
})

afterAll(() => {
  vi.clearAllMocks();
})

let inputAst;
let expectedAst;

describe('rehypeCallout 동작 시', () => {
  it('blockquote 태그가 아니면 rehype 되지 않는다.', () => {
    inputAst = u('root', [
      {
        type: 'element',
        tagName: 'p',
        children: [
          { type: 'text', value: '\n' },
        ],
      }
    ]);
    expectedAst = u('root', [
      {
        type: 'element',
        tagName: 'p',
        children: [
          { type: 'text', value: '\n' },
        ],
      }
    ]);
    
    rehypeCallout()(inputAst)
    
    expect(inputAst).toEqual(expectedAst)
  });
  
  it('콜아웃 지시자가 없는 blockquote 태그의 경우 rehype 되지 않는다.', () => {
    inputAst = u('root', [
      {
        type: 'element',
        tagName: 'blockquote',
        children: [
          { type: 'text', value: '\n' },
          {
            type: 'element',
            tagName: 'p',
            children: [
              { type: 'text', value: 'text' },
            ]
          }
        ],
      }
    ]);
    expectedAst = u('root', [
      {
        type: 'element',
        tagName: 'blockquote',
        children: [
          { type: 'text', value: '\n' },
          {
            type: 'element',
            tagName: 'p',
            children: [
              { type: 'text', value: 'text' },
            ]
          }
        ],
      }
    ]);
    
    rehypeCallout()(inputAst)
    
    expect(inputAst).toEqual(expectedAst)
  });

  it('indicator의 첫 자식이 text 노드가 아니어도 에러 없이 통과한다.', () => {
    inputAst = u('root', [
      {
        type: 'element',
        tagName: 'blockquote',
        children: [
          { type: 'text', value: '\n' },
          {
            type: 'element',
            tagName: 'p',
            children: [
              {
                type: 'element',
                tagName: 'strong',
                children: [{ type: 'text', value: '[!info]' }],
              },
              { type: 'text', value: '내용' },
            ],
          },
        ],
      }
    ]);
    expectedAst = structuredClone(inputAst);

    expect(() => rehypeCallout()(inputAst)).not.toThrow();
    expect(inputAst).toEqual(expectedAst);
  });

  it('콜아웃 지시자가 있는 blockquote 태그의 경우 rehype 된다.', () => {
    inputAst = u('root', [
      {
        type: 'element',
        tagName: 'blockquote',
        children: [
          { type: 'text', value: '\n' },
          {
            type: 'element',
            tagName: 'p',
            children: [
              { type: 'text', value: '[!info]' },
              { type: 'text', value: '내용' }
            ],
          }
        ],
      }
    ]);
    expectedAst = u('root',
      [
        {
          type: 'element',
          tagName: 'div',
          children: [
            {
              type: 'element',
              tagName: 'div',
              properties: {
                'dataCalloutMetadata': '',
                'dataCalloutFold': '',
                'dataCallout': 'info',
                className: ['callout'],
              },
              children: [
                {
                  type: 'element',
                  tagName: 'div',
                  properties: {
                    className: ['callout-title'],
                    dir: 'auto'
                  },
                  children: [
                    {
                      type: 'element',
                      tagName: 'div',
                      properties: {
                        className: ['callout-icon'],
                      },
                      children: []
                    },
                    {
                      type: 'element',
                      tagName: 'div',
                      properties: {
                        className: ['callout-title-inner'],
                      },
                      children: [
                        {
                          type: 'text',
                          value: 'Info'
                        }
                      ]
                    },
                    {
                      type: 'element',
                      tagName: 'div',
                      properties: {
                        className: ['callout-fold'],
                      },
                      children: []
                    }
                  ]
                },
                {
                  type: 'element',
                  tagName: 'div',
                  properties: {
                    className: ['callout-content'],
                  },
                  children: [
                    {
                      type: 'element',
                      tagName: 'p',
                      children: []
                    }
                  ]
                }
              ]
            }
          ]
        },
      ]);
    
    rehypeCallout()(inputAst)
    expect(inputAst).toStrictEqual(expectedAst)
  });
  
  it('콜아웃 타입에 맞는 SVG를 로드한다.', () => {
    const calloutType = 'info';
    inputAst = u('root', [
      {
        type: 'element',
        tagName: 'blockquote',
        children: [
          { type: 'text', value: '\n' },
          {
            type: 'element',
            tagName: 'p',
            children: [
              { type: 'text', value: `[!${calloutType}]` },
              { type: 'text', value: '내용' }
            ],
          }
        ],
      }
    ]);

    rehypeCallout()(inputAst)
    
    expect(calloutSvgPath).toBeCalledWith(calloutType)
    expect(loadCalloutSVGSync).toBeCalledWith(`path${calloutType}`)
  });
  
  it('콜아웃 제목이 없는 경우 타입의 첫 글자를 대문자로 바꿔 제목으로 사용한다.', () => {
    const calloutType = 'info';
    inputAst = u('root', [
      {
        type: 'element',
        tagName: 'blockquote',
        children: [
          { type: 'text', value: '\n' },
          {
            type: 'element',
            tagName: 'p',
            children: [
              { type: 'text', value: `[!${calloutType}]` },
              { type: 'text', value: '내용' }
            ],
          }
        ],
      }
    ]);
    
    const expectedTitle = calloutType.charAt(0).toUpperCase() + calloutType.slice(1);
    
    rehypeCallout()(inputAst)
    
    expect(hasExpectedTitle(expectedTitle)).true
  });
  
  function hasExpectedTitle(expectedTitle) {
    let found = false;
    visit(inputAst, 'element', (node) => {
      if (node.tagName === 'div' &&
        node.properties &&
        node.properties.className &&
        node.properties.className.includes('callout-title-inner')) {
        const textNode = node.children.find(child => child.type === 'text');
        if (textNode && textNode.value === expectedTitle) {
          found = true;
          return false;
        }
      }
    })
    return found;
  }
  
  it('콜아웃 제목이 있는 경우 해당 제목이 표시된다.', () => {
    const title = `제목`;
    inputAst = u('root', [
      {
        type: 'element',
        tagName: 'blockquote',
        children: [
          { type: 'text', value: '\n' },
          {
            type: 'element',
            tagName: 'p',
            children: [
              { type: 'text', value: `[!info] ${title}` },
              { type: 'text', value: '내용' }
            ],
          }
        ],
      }
    ]);
    
    rehypeCallout()(inputAst)
    
    expect(hasExpectedTitle(title)).true
  });
  
  it('+ foldable 지시자가 있는 경우 관련 정보가 추가된다.', () => {
    inputAst = u('root', [
      {
        type: 'element',
        tagName: 'blockquote',
        children: [
          { type: 'text', value: '\n' },
          {
            type: 'element',
            tagName: 'p',
            children: [
              { type: 'text', value: `[!info]+` },
              { type: 'text', value: '내용' }
            ],
          }
        ],
      }
    ]);
    
    rehypeCallout()(inputAst)
    
    let found = false;
    visit(inputAst, 'element', (node) => {
      if (node.tagName === 'div' &&
        node.properties &&
        node.properties.className &&
        node.properties.className.includes('callout')) {
        if (node.properties.dataCalloutFold === '+'
          && node.properties.className.includes('is-collapsible')) {
          found = true;
          return false;
        }
      }
    })
    
    expect(found).true
  });
  
  it('- foldable 지시자가 있는 경우 관련 정보가 추가된다.', () => {
    inputAst = u('root', [
      {
        type: 'element',
        tagName: 'blockquote',
        children: [
          { type: 'text', value: '\n' },
          {
            type: 'element',
            tagName: 'p',
            children: [
              { type: 'text', value: `[!info]-` },
              { type: 'text', value: '내용' }
            ],
          }
        ],
      }
    ]);
    
    rehypeCallout()(inputAst)
    
    let found = false;
    visit(inputAst, 'element', (node) => {
      if (node.tagName === 'div' &&
        node.properties &&
        node.properties.className &&
        node.properties.className.includes('callout')) {
        if (node.properties.dataCalloutFold === '-'
          && node.properties.className.includes('is-collapsible')
        && node.properties.className.includes('is-collapsed')) {
          found = true;
          return false;
        }
      }
    })
    
    expect(found).true
  });
});
