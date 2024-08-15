import https from "https";
import { IncomingMessage } from 'http'

export async function httpGetAsync(url: string): Promise<IncomingMessage> {
    return new Promise((resolve, reject) => {
        https.get(url, (response) => {
            resolve(response)
        }).on('error', (err) => {
            reject(err);
        });
    })
}