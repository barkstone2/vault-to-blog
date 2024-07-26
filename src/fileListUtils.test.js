import {describe, expect, it, vi, beforeAll, afterAll} from 'vitest';
import createFileMapToJson from "./fileListUtils.js";
import fs from 'fs';

const markdownPath = 'public/markdown';
const jsonFilePath = 'public/markdown-files.json'
const options = { encoding: 'utf-8' };
const jsonOf = (expectedFileList) => {return JSON.stringify(expectedFileList, null, 2)};
vi.mock('fs');

let mockFiles;
let expectedFileMap;

beforeAll(() => {
  fs.readdirSync.mockImplementation((dir) => {
    return mockFiles[dir] || [];
  });
  
  fs.statSync.mockImplementation((filePath) => ({
    isDirectory: () => mockFiles[filePath] !== undefined,
  }));
  
  fs.writeFileSync.mockImplementation(() => {
  });
});

afterAll(() => {
  vi.restoreAllMocks();
});

describe('파일 목록 JSON 생성 함수 호출 시', () => {
  it('md 확장자를 가진 파일만 목록에 포함된다.', () => {
    // given
    mockFiles = {
      [markdownPath] : ['file1.md', 'file2.txt', 'file3.png', 'file4.mdmd', 'file5.md6'],
    };
    expectedFileMap = {
      'file1' : ['file1.md']
    };
    
    // when
    createFileMapToJson();
    
    // then
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      jsonFilePath,
      jsonOf(expectedFileMap),
      options
    );
  });
  
  it('재귀적으로 파일을 탐색해 목록에 포함한다.', () => {
    // given
    mockFiles = {
      [markdownPath]: ['file1.md', 'dir1'],
      [markdownPath + '/dir1']: ['file2.md', 'dir2'],
      [markdownPath + '/dir1/dir2']: ['file3.md', 'dir3'],
      [markdownPath + '/dir1/dir2/dir3']: ['file4.md'],
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
      jsonFilePath,
      jsonOf(expectedFileMap),
      options
    );
  });
  
  it('파일명이 중복되면 엔트리의 리스트에 삽입된다.', () => {
    // given
    mockFiles = {
      [markdownPath]: ['file1.md', 'dir1'],
      [markdownPath + '/dir1']: ['file1.md'],
    };
    expectedFileMap = {
      'file1' : ['file1.md', 'dir1/file1.md'],
      'dir1/file1' : ['dir1/file1.md'],
    };
    
    // when
    createFileMapToJson();
    
    // then
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      jsonFilePath,
      jsonOf(expectedFileMap),
      options
    );
  });
});