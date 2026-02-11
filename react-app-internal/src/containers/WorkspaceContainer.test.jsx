import {describe, expect, it} from "vitest";
import {appendTagQuery, createTagQuery, resolveEffectiveMarkdownPath, resolveTocHeaders} from "./WorkspaceContainer";

describe('WorkspaceContainer helpers', () => {
    it('홈 경로이고 index 파일이 있으면 index 파일 경로를 사용한다.', () => {
        const resolved = resolveEffectiveMarkdownPath('', 'index.md');
        expect(resolved).toBe('index.md');
    });

    it('toc 맵에 키가 없으면 빈 배열을 반환한다.', () => {
        const headers = resolveTocHeaders({}, '', 'index.md');
        expect(headers).toStrictEqual([]);
    });

    it('태그 검색어를 생성할 때 # 접두사를 제거하고 소문자로 정규화한다.', () => {
        const query = createTagQuery('#React');
        expect(query).toBe('tag:react');
    });

    it('기존 검색어가 비어있으면 태그 검색어만 반환한다.', () => {
        const query = appendTagQuery('', 'React');
        expect(query).toBe('tag:react');
    });

    it('기존 검색어가 있으면 태그 검색어를 뒤에 추가한다.', () => {
        const query = appendTagQuery('state management', 'React');
        expect(query).toBe('state management tag:react');
    });

    it('동일한 태그 검색어가 이미 있으면 중복으로 추가하지 않는다.', () => {
        const query = appendTagQuery('state tag:react', '#React');
        expect(query).toBe('state tag:react');
    });
});
