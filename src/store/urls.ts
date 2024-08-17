import {VaultToBlogSettings} from "../../main";

export class Urls {
    vtbRepositoryURL = 'https://github.com/barkstone2/vault-to-blog'
    reactAppUrl;
    constructor(settings: VaultToBlogSettings) {
        this.reactAppUrl = () => `${this.vtbRepositoryURL}/releases/download/${settings.version}/react-app.zip`;
    }
}