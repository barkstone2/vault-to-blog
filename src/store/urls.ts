import {ObsidianToBlogSettings} from "../../main";

export class Urls {
    reactAppUrl;
    constructor(settings: ObsidianToBlogSettings) {
        this.reactAppUrl = () => `${settings.repositoryUrl}/releases/download/${settings.version}/react-app.zip`;
    }
}