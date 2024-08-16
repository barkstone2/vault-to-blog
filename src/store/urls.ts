import {ObsidianToBlogSettings} from "../../main";

export class Urls {
    otbRepositoryURL = 'https://github.com/barkstone2/obsidian-to-blog'
    reactAppUrl;
    constructor(settings: ObsidianToBlogSettings) {
        this.reactAppUrl = () => `${this.otbRepositoryURL}/releases/download/${settings.version}/react-app.zip`;
    }
}