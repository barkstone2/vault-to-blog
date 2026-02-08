import {describe, expect, it} from "vitest";
import {resolveEffectiveMarkdownPath, resolveTocHeaders} from "./WorkspaceContainer";

describe('WorkspaceContainer helpers', () => {
    it('홈 경로이고 index 파일이 있으면 index 파일 경로를 사용한다.', () => {
        const resolved = resolveEffectiveMarkdownPath('', 'index.md');
        expect(resolved).toBe('index.md');
    });

    it('toc 맵에 키가 없으면 빈 배열을 반환한다.', () => {
        const headers = resolveTocHeaders({}, '', 'index.md');
        expect(headers).toStrictEqual([]);
    });
});
