import {afterAll, afterEach, beforeAll, describe, expect, it, vi} from "vitest";
import {createImageMapToJson, imageFileMap} from "./fileMapUtils";
import fs from "fs";

const sourceDir = 'public/sources';
const imageJsonFilePath = 'public/image-files.json';
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
  vi.mock('fileMapUtils', () => {
    return {
      imageFileMap: {}
    }
  })
})
afterEach(() => {
  Object.keys(imageFileMap).forEach(key => delete imageFileMap[key]);
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