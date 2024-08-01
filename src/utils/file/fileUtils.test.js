import {afterAll, beforeAll, beforeEach, describe, expect, it, vi} from "vitest";
import {
  createFileMapToJson,
  createImageMapToJson,
  getImageFileMap,
  getMarkdownFileMap,
  initImageFileMap,
  initMarkdownFileMap,
} from "./fileUtils.js";
import fs from "fs";

const sourceDir = 'public/sources';
const imageJsonFilePath = 'image-files.json';
const markdownJsonFilePath = 'markdown-files.json'

const options = { encoding: 'utf-8' };
const jsonOf = (expectedFileList) => {return JSON.stringify(expectedFileList, null, 2)};

let mockFiles;
let expectedFileMap;

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