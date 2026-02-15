import {beforeAll, vi, describe, it, expect, afterAll} from "vitest";
import generateHtmlFiles, {
  buildMetaDescription,
  buildRobotsTxt,
  buildSitemapXml,
  convertInternalLinksForSeo,
  normalizeRepositoryUrlToSiteBase,
} from "./generateHtml.js";
import fs from "fs";

const htmlPath = 'public/html/md.html'
let markdown;
let expectedHtml;
let repositoryUrl;
beforeAll(() => {
  vi.mock('fs')
  vi.mock('./utils/file/fileUtils', () => {
    return {
      getMarkdownFileSet: vi.fn(() => new Set(['md.md'])),
      getMarkdownFileMap: vi.fn(() => {}),
      getImageFileMap: vi.fn(() => {}),
    }
  })
  fs.readFileSync.mockImplementation((filePath) => {
    if (filePath === 'src/stores/data.json') {
      return JSON.stringify({repositoryUrl});
    }
    return markdown;
  });
  fs.existsSync.mockImplementation(() => {
  });
  fs.writeFileSync.mockImplementation(() => {
  });
})

afterAll(() => {
  vi.clearAllMocks();
});

describe("html 생성 요청 시", () => {
  beforeEach(() => {
    repositoryUrl = 'https://github.com/octocat/octocat.github.io.git';
  });

  it("마크다운이 HTML로 변환된다", async () => {
    // given
    markdown = '# H1';
    expectedHtml =
`<div class="markdown-preview-pusher" style="width: 1px; height: 0.1px; margin-bottom: 0;"></div>
<div class="mod-header">
<div class="inline-title" tabindex="-1">md</div>
</div>
<h1 id="h1">H1</h1>`;
    
    // when
    await generateHtmlFiles()

    // then
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      htmlPath,
      expectedHtml,
      'utf-8'
    );
  });
  
  it("줄바꿈이 처리된다", async () => {
    // given
    markdown = '줄바꿈이\n처리된다';
    expectedHtml =
      `<div class="markdown-preview-pusher" style="width: 1px; height: 0.1px; margin-bottom: 0;"></div>
<div class="mod-header">
<div class="inline-title" tabindex="-1">md</div>
</div>
<p>줄바꿈이<br>
처리된다</p>`;
    
    // when
    await generateHtmlFiles()
    
    // then
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      htmlPath,
      expectedHtml,
      'utf-8'
    );
  });
  
  it("표가 파싱된다.", async () => {
    // given
    markdown = '| 왼쪽 정렬 | 가운데 정렬 | 오른쪽 정렬 |\n' +
      '| :---- | :----: | -----: |\n' +
      '| 내용    |   내용   |     내용 |';
    expectedHtml =
`<div class="markdown-preview-pusher" style="width: 1px; height: 0.1px; margin-bottom: 0;"></div>
<div class="mod-header">
<div class="inline-title" tabindex="-1">md</div>
</div>
<table>
<thead>
<tr>
<th align="left">왼쪽 정렬</th>
<th align="center">가운데 정렬</th>
<th align="right">오른쪽 정렬</th>
</tr>
</thead>
<tbody>
<tr>
<td align="left">내용</td>
<td align="center">내용</td>
<td align="right">내용</td>
</tr>
</tbody>
</table>`;
    
    // when
    await generateHtmlFiles()
    
    // then
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      htmlPath,
      expectedHtml,
      'utf-8'
    );
  });

});

describe("SEO 유틸리티", () => {
  it("GitHub repository URL을 사이트 base URL로 변환한다", () => {
    expect(normalizeRepositoryUrlToSiteBase('https://github.com/octocat/octocat.github.io.git')).toBe('https://octocat.github.io');
    expect(normalizeRepositoryUrlToSiteBase('git@github.com:octocat/octocat.github.io.git')).toBe('https://octocat.github.io');
    expect(normalizeRepositoryUrlToSiteBase('https://example.com')).toBe('');
  });

  it("메타 설명을 마크다운 본문에서 생성한다", () => {
    const markdown = '# 제목\n\n본문 **강조** [링크](https://example.com)';
    expect(buildMetaDescription(markdown, '제목')).toContain('제목 본문 강조 링크');
  });

  it("SEO 페이지용 내부 링크를 .html 경로로 변환한다", () => {
    const html = '<a href="/docs/path.md" class="internal-link" data-href="/docs/path.md">문서</a>';
    expect(convertInternalLinksForSeo(html)).toContain('href="/posts/docs/path.html"');
  });

  it("robots.txt와 sitemap.xml을 생성한다", () => {
    expect(buildRobotsTxt('https://octocat.github.io')).toContain('Sitemap: https://octocat.github.io/sitemap.xml');
    expect(buildSitemapXml(['https://octocat.github.io/', 'https://octocat.github.io/posts/a.html'])).toContain('<loc>https://octocat.github.io/posts/a.html</loc>');
  });
});
