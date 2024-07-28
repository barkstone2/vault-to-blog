import {afterAll, beforeAll, describe, expect, it, vi} from "vitest";
import {createFileMapToJson, createImageMapToJson} from "./fileUtils.js";
import fs from "fs";

const sourceDir = 'public/sources';
const imageJsonFilePath = 'public/image-files.json';
const markdownJsonFilePath = 'public/markdown-files.json'

const options = { encoding: 'utf-8' };
const jsonOf = (expectedFileList) => {return JSON.stringify(expectedFileList, null, 2)};

let mockFiles;
let expectedFileMap;

beforeAll(() => {
  vi.mock('fs')
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
      imageJsonFilePath,
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
      imageJsonFilePath,
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
      imageJsonFilePath,
      jsonOf(expectedFileMap),
      options
    );
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
      markdownJsonFilePath,
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
      markdownJsonFilePath,
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
      markdownJsonFilePath,
      jsonOf(expectedFileMap),
      options
    );
  });
});

describe('모듈 초기화 시', () => {
  it('이미지 맵 JSON 파일의 내용을 읽어 변수에 할당한다.', () => {
    expect(fs.readFileSync).toHaveBeenCalledWith(
      imageJsonFilePath,
      'utf-8'
    )
  });
  it('파일 맵 JSON 파일의 내용을 읽어 변수에 할당한다.', () => {
    expect(fs.readFileSync).toHaveBeenCalledWith(
      markdownJsonFilePath,
      'utf-8'
    )
  });
});