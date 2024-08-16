# Obsidian To Blog
A Community Plugin for [Obsidian.md](https://obsidian.md/) to publish your vault or directory to GitHub Pages Blog.   
> This plugin is currently in beta, so it only offers a limited set of features at the moment.

## Prerequisites
- Create a GitHub Repository   
  - You need to first create a GitHub repository that will be used for GitHub Pages.
- Set GitHub Pages to Use GitHub Actions   
  - In the repository’s settings, go to Pages and set the Build and deployment source to GitHub Actions.   
  - For more detailed information, please refer to [GitHub Pages Docs](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site#publishing-with-a-custom-github-actions-workflow).
- Public Repository Required   
  - The repository used for GitHub Pages must be set to public.
  - Private repositories are not currently supported.
- No Custom Domain Support   
  - Custom domains are not supported at this time. 
  - Please use the default GitHub Pages URL provided by GitHub.

## Usage
1. Enable plugin in the settings menu.
2. Select the directory you want to publish as a blog from the list, then click the Save button.
   - Only the contents of the selected folder will be published; the folder itself will not be displayed on the blog.
3. Input the URL of the GitHub repository that will be used for GitHub Pages. After entering the URL, click the Save button.
4. Click the Activate button to enable the plugin.
5. Once the plugin is activated, click the icon in the status bar. Your directory will now be published as a blog!

## Features
- Obsidian-style Layout
  - Left Sidebar
    - Files explorer only
- Markdown View
  - Basic Markdown support
  - Internal Links
    - Block references are not supported
    - Heading references are not supported
    - Display names are supported
  - External Links
    - Escaped characters are not supported
    - Display names are supported
  - Callouts
  - Properties
    - Aliases are not supported
  - Embedded Images
    - Display names are supported
    - Width adjustments are supported
  - Footnotes
    - Inline footnotes are not supported
    - Links in footnotes are not supported
  - Math
    - Math blocks are supported
    - Inline math expressions are supported
## Bug Report
To report a bug, simply go to the [Issues](https://github.com/barkstone2/obsidian-to-blog/issues) tab and use the provided template to submit your bug report.

## Support
If you like this plugin and would like to support its development, you can support me on Buy me a coffee.

<a href="https://www.buymeacoffee.com/barkstone2" rel="nofollow">
  <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="width: 120px; max-width: 100%;">
</a>