import {afterAll, beforeAll, beforeEach, describe, expect, it, vi} from "vitest";
import {
  createFileMapToJson,
  createImageMapToJson,
  createMarkdownSearchMapToJson,
  getImageFileMap,
  getIndexFilePath,
  getMarkdownFileMap,
  getMarkdownSearchMap,
  initImageFileMap,
  initMarkdownFileMap,
  initMarkdownSearchMap,
  normalizeIndexFilePath,
} from "./fileUtils.js";
import fs from "fs";

const sourceDir = 'public/sources';
const imageJsonFilePath = 'image-files.json';
const markdownJsonFilePath = 'markdown-files.json'
const markdownSearchJsonFilePath = 'markdown-search.json'

const options = { encoding: 'utf-8' };
const jsonOf = (expectedFileList) => {return JSON.stringify(expectedFileList, null, 2)};

let mockFiles;
let expectedFileMap;

const createDirent = (name, {directory = false, symbolicLink = false} = {}) => ({
  name,
  isDirectory: () => directory,
  isSymbolicLink: () => symbolicLink,
});

beforeAll(() => {
  vi.mock('fs')
  vi.mock('fetch')
  fs.readdirSync.mockImplementation((dir) => {
    return mockFiles[dir] || [];
  })
  fs.statSync.mockImplementation((filePath) => ({
    isDirectory: () => mockFiles[filePath] !== undefined,
  }));
  fs.writeFileSync.mockImplementation(() => {});
  fs.readFileSync.mockImplementation(() => {});
})

afterAll(() => {
  vi.clearAllMocks();
})

describe('이미지 맵 JSON 생성 요청 시', () => {
  
  it('이미지 타입의 파일만 맵에 포함된다.', () => {
    // given
    mockFiles = {
      [sourceDir] : ['file1.png', 'file2.txt', 'file3.md', 'file4.pngpng', 'file5.avi'],
    };
    expectedFileMap = {
      'file1.png' : ['file1.png']
    };
    
    // when
    createImageMapToJson();
    
    // then
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      'public/' + imageJsonFilePath,
      jsonOf(expectedFileMap),
      options
    );
  });
  
  it('재귀적으로 이미지를 탐색해 맵에 담는다.', () => {
    // given
    mockFiles = {
      [sourceDir] : ['file1.png', 'dir1'],
      [sourceDir + '/dir1']: ['file2.png', 'dir2'],
      [sourceDir + '/dir1/dir2']: ['file3.jpeg', 'dir3'],
      [sourceDir + '/dir1/dir2/dir3']: ['file4.gif'],
    };
    expectedFileMap = {
      'file1.png': ['file1.png'],
      'file2.png' : ['dir1/file2.png'],
      'dir1/file2.png': ['dir1/file2.png'],
      'file3.jpeg': ['dir1/dir2/file3.jpeg'],
      'dir1/dir2/file3.jpeg': ['dir1/dir2/file3.jpeg'],
      'file4.gif': ['dir1/dir2/dir3/file4.gif'],
      'dir1/dir2/dir3/file4.gif': ['dir1/dir2/dir3/file4.gif'],
    };
    
    // when
    createImageMapToJson()
    
    // then
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      'public/' + imageJsonFilePath,
      jsonOf(expectedFileMap),
      options
    );
  });
  
  it('파일명이 중복되면 엔트리의 리스트에 삽입된다.', () => {
    // given
    mockFiles = {
      [sourceDir]: ['file1.png', 'dir1'],
      [sourceDir + '/dir1']: ['file1.png'],
    };
    expectedFileMap = {
      'file1.png' : ['file1.png', 'dir1/file1.png'],
      'dir1/file1.png' : ['dir1/file1.png'],
    };
    
    // when
    createImageMapToJson();
    
    // then
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      'public/' + imageJsonFilePath,
      jsonOf(expectedFileMap),
      options
    );
  });
  it('이미지 맵을 업데이트한다.', () => {
    mockFiles = {
      [sourceDir] : ['file1.png'],
    };
    expectedFileMap = {
      'file1.png' : ['file1.png']
    };
    
    createImageMapToJson();
    
    expect(getImageFileMap()).toStrictEqual(expectedFileMap);
  });
})

describe('파일 목록 JSON 생성 요청 시', () => {
  it('md 확장자를 가진 파일만 목록에 포함된다.', () => {
    // given
    mockFiles = {
      [sourceDir] : ['file1.md', 'file2.txt', 'file3.png', 'file4.mdmd', 'file5.md6'],
    };
    expectedFileMap = {
      'file1' : ['file1.md']
    };
    
    // when
    createFileMapToJson();
    
    // then
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      'public/' + markdownJsonFilePath,
      jsonOf(expectedFileMap),
      options
    );
  });
  
  it('재귀적으로 파일을 탐색해 목록에 포함한다.', () => {
    // given
    mockFiles = {
      [sourceDir]: ['file1.md', 'dir1'],
      [sourceDir + '/dir1']: ['file2.md', 'dir2'],
      [sourceDir + '/dir1/dir2']: ['file3.md', 'dir3'],
      [sourceDir + '/dir1/dir2/dir3']: ['file4.md'],
    };
    expectedFileMap = {
      'file1' : ['file1.md'],
      'file2' : ['dir1/file2.md'],
      'dir1/file2' : ['dir1/file2.md'],
      'file3' : ['dir1/dir2/file3.md'],
      'dir1/dir2/file3' : ['dir1/dir2/file3.md'],
      'file4' : ['dir1/dir2/dir3/file4.md'],
      'dir1/dir2/dir3/file4' : ['dir1/dir2/dir3/file4.md'],
    };
    
    // when
    createFileMapToJson();
    
    // then
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      'public/' + markdownJsonFilePath,
      jsonOf(expectedFileMap),
      options
    );
  });
  
  it('파일명이 중복되면 엔트리의 리스트에 삽입된다.', () => {
    // given
    mockFiles = {
      [sourceDir]: ['file1.md', 'dir1'],
      [sourceDir + '/dir1']: ['file1.md'],
    };
    expectedFileMap = {
      'file1' : ['file1.md', 'dir1/file1.md'],
      'dir1/file1' : ['dir1/file1.md'],
    };
    
    // when
    createFileMapToJson();
    
    // then
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      'public/' + markdownJsonFilePath,
      jsonOf(expectedFileMap),
      options
    );
  });
  it('마크다운 맵을 업데이트한다.', () => {
    mockFiles = {
      [sourceDir] : ['file1.md'],
    };
    expectedFileMap = {
      'file1' : ['file1.md']
    };
    
    createFileMapToJson();
    
    expect(getMarkdownFileMap()).toStrictEqual(expectedFileMap);
  });

  it('심볼릭 링크 디렉토리도 재귀 탐색해 목록에 포함한다.', () => {
    mockFiles = {
      [sourceDir]: [createDirent('linked', {symbolicLink: true})],
      [sourceDir + '/linked']: [createDirent('file1.md')],
    };
    expectedFileMap = {
      file1: ['linked/file1.md'],
      'linked/file1': ['linked/file1.md'],
    };

    createFileMapToJson();

    expect(fs.writeFileSync).toHaveBeenCalledWith(
      'public/' + markdownJsonFilePath,
      jsonOf(expectedFileMap),
      options,
    );
  });
});

describe('파일 맵 초기화 요청 시', () => {
  beforeEach(() => {
    global.fetch = vi.fn(() => {
      return Promise.resolve({
          json: () => Promise.resolve(expectedFileMap)
        });
      }
    )
  })
  
  it('fetch를 통해 마크다운 JSON 파일을 로드한다.', async () => {
    expectedFileMap = {'file1': 'file1'};
    await initMarkdownFileMap()
    expect(fetch).toHaveBeenCalledWith('/' + markdownJsonFilePath)
  });
  
  it('fetch에 성공하면 내부 객체를 업데이트한다.', async () => {
    expectedFileMap = {'file2': 'file2'};
    await initMarkdownFileMap()
    const markdownFileMap = getMarkdownFileMap()
    expect(markdownFileMap).toEqual(expectedFileMap)
  });
  
  it('fetch에 실패하면 내부 객체를 업데이트하지 않는다.', async () => {
    expectedFileMap = {'file3': 'file3'};
    global.fetch = vi.fn(() => Promise.reject(new Error('Fetch error')));
    await initMarkdownFileMap()
    const markdownFileMap = getMarkdownFileMap()
    expect(markdownFileMap).not.toBe(expectedFileMap)
  });
});

describe('검색 맵 초기화 요청 시', () => {
  beforeEach(() => {
    global.fetch = vi.fn((url) => {
      if (url === '/' + markdownSearchJsonFilePath) {
        return Promise.resolve({
          json: () => Promise.resolve({'doc.md': 'cached index'})
        });
      }
      if (url === '/doc.md') {
        return Promise.resolve({
          text: () => Promise.resolve('apple and 안녕하세요')
        });
      }
      return Promise.resolve({
        json: () => Promise.resolve(expectedFileMap),
        text: () => Promise.resolve(''),
      });
    });
  });

  it('검색 맵 JSON fetch 성공 시 내부 검색 맵을 업데이트한다.', async () => {
    await initMarkdownSearchMap();
    expect(getMarkdownSearchMap()).toEqual({'doc.md': 'cached index'});
  });

  it('검색 맵 JSON fetch 실패 시 마크다운 파일 본문 fetch로 검색 맵을 구성한다.', async () => {
    vi.resetModules();
    global.fetch = vi.fn((url) => {
      if (url === '/' + markdownSearchJsonFilePath) {
        return Promise.reject(new Error('missing index'));
      }
      if (url === '/' + markdownJsonFilePath) {
        return Promise.resolve({
          json: () => Promise.resolve({doc: ['doc.md']})
        });
      }
      if (url === '/sources/doc.md') {
        return Promise.resolve({
          text: () => Promise.resolve('apple and 안녕하세요')
        });
      }
      return Promise.resolve({
        json: () => Promise.resolve({}),
        text: () => Promise.resolve(''),
      });
    });

    const {initMarkdownFileMap, initMarkdownSearchMap, getMarkdownSearchMap} = await import('./fileUtils.js');
    await initMarkdownFileMap();
    await initMarkdownSearchMap();

    expect(getMarkdownSearchMap()).toEqual({'doc.md': 'apple and 안녕하세요'});
  });
});

describe('검색 맵 JSON 생성 요청 시', () => {
  it('재귀적으로 마크다운 파일 본문을 탐색해 검색 맵 JSON을 생성한다.', () => {
    mockFiles = {
      [sourceDir]: ['doc.md'],
    };
    fs.readFileSync.mockImplementation((filePath) => {
      if (filePath === sourceDir + '/doc.md') {
        return '  apple\n\n안녕하세요  ';
      }
      return '';
    });

    createMarkdownSearchMapToJson();

    expect(fs.writeFileSync).toHaveBeenCalledWith(
      'public/' + markdownSearchJsonFilePath,
      jsonOf({'doc.md': 'apple 안녕하세요'}),
      options,
    );
  });
});

describe('이미지 맵 초기화 요청 시', () => {
  let expectedImageMap = {'default': 'default'};
  beforeEach(() => {
    global.fetch = vi.fn(() => {
        return Promise.resolve({
          json: () => Promise.resolve(expectedImageMap)
        });
      }
    )
  })
  
  it('fetch를 통해 이미지 JSON 파일을 로드한다.', async () => {
    expectedImageMap = {'image1': 'image1'};
    await initImageFileMap()
    expect(fetch).toHaveBeenCalledWith('/' + imageJsonFilePath)
  });
  
  it('fetch에 성공하면 내부 객체를 업데이트한다.', async () => {
    expectedImageMap = {'image2': 'image2'};
    await initImageFileMap()
    const imageFileMap = getImageFileMap()
    expect(imageFileMap).toEqual(expectedImageMap)
  });
  
  it('fetch에 실패하면 내부 객체를 업데이트하지 않는다.', async () => {
    expectedImageMap = {'image3': 'image3'};
    global.fetch = vi.fn(() => Promise.reject(new Error('Fetch error')));
    await initImageFileMap()
    const imageFileMap = getImageFileMap()
    expect(imageFileMap).not.toBe(expectedFileMap)
  });
});

describe('파일 셋 조회 요청 시', () => {
  beforeEach(() => {
    vi.resetModules();
    global.fetch = vi.fn(() => {
        return Promise.resolve({
          json: () => Promise.resolve(expectedFileMap)
        });
      }
    )
  })
  
  let expectedFileSet;
  it('파일 셋이 초기화되지 않은 경우 파일 맵을 전체 순회하며 파일 셋에 담는다.', async () => {
    const { getMarkdownFileSet, initMarkdownFileMap } = await import('./fileUtils.js')
    expectedFileMap = {'file1': ['file1', 'dir/file1'], 'dir/file1': ['dir/file1']}
    expectedFileSet = new Set(['file1', 'dir/file1'])
    await initMarkdownFileMap()
    
    const resultSet = getMarkdownFileSet()
    
    expect(resultSet).toStrictEqual(expectedFileSet);
  });
  
  it('파일 셋이 초기화된 경우 캐시된 파일 셋을 반환한다.', async () => {
    const { getMarkdownFileSet, initMarkdownFileMap } = await import('./fileUtils.js')
    expectedFileMap = {}
    await initMarkdownFileMap()
    const initSet = getMarkdownFileSet()

    expectedFileMap = {'file2': ['file2', 'dir/file2'], 'dir/file2': ['dir/file2']}
    expectedFileSet = new Set(['file2', 'dir/file2'])
    await initMarkdownFileMap()
    
    const cachedSet = getMarkdownFileSet()
    
    expect(cachedSet).not.toStrictEqual(expectedFileSet);
    expect(cachedSet).toStrictEqual(initSet);
  });
});

describe('index 파일 경로 정규화 요청 시', () => {
  it('sourceDir를 포함한 index 경로를 source 기준 상대 경로로 정규화한다.', () => {
    const normalized = normalizeIndexFilePath('!new-blog/index.md', '!new-blog');
    expect(normalized).toBe('index.md');
  });

  it('이미 source 기준 상대 경로면 그대로 반환한다.', () => {
    const normalized = normalizeIndexFilePath('index.md', '!new-blog');
    expect(normalized).toBe('index.md');
  });

  it('설정 데이터에 index 경로가 없으면 빈 값을 반환한다.', () => {
    expect(getIndexFilePath()).toBe('');
  });
});
