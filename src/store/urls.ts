export class Urls {
    repositoryUrl: string
    reactAppUrl: string;
    constructor(repositoryUrl: string, version: string) {
        this.repositoryUrl = repositoryUrl;
        this.reactAppUrl = `${repositoryUrl}/releases/download/${version}/react-app.zip`;
    }
}