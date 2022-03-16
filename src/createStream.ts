import * as dotenv from 'dotenv';
import fetch from 'node-fetch'
// const fetch = (
//     url: RequestInfo,
//     init?: RequestInit
// ): Promise<Response> => import('node-fetch')
//   .then(({default: fetch}): Promise<Response> => fetch(url, init));

const ENDPOINT = "https://api.twitter.com/"
const STREAM = "2/tweets/search/stream"
const STREAMRULES = ENDPOINT+STREAM + "/rules"
const STREAMEXPANSIONS = "?expansions=attachments.media_keys&media.fields=preview_image_url,url&tweet.fields=attachments,author_id,created_at"
const GETSTREAM = ENDPOINT+STREAM+STREAMEXPANSIONS

dotenv.config()

function getAllRuleIDS(): Promise<string[]>{
    return new Promise((resolve,_rej)=>{
            fetch(STREAMRULES,{
                method: "GET",
                headers: {
                    'Authorization': 'Bearer '+process.env.TWITTER_BEARER_TOKEN,
                    'Content-type': 'application/json'
                }
            }).then(res=>res.json()).then((json: any) =>resolve(json.data ? json.data.map((e)=>e.id): []))
        })
}

function deleteAllRuleIDS(ids: string[]): Promise<any>{
    return new Promise((resolve,_rej)=>{
            fetch(STREAMRULES,{
                method: "POST",
                headers: {
                    'Authorization': 'Bearer '+process.env.TWITTER_BEARER_TOKEN,
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({"delete": {"ids":ids}})
            }).then(res=>resolve(res))
        })
}
/*
 * Takes an array of tuples, where [rule, tag]
 */
export function createRules(query, tag): Promise<any>{
    return new Promise((resolve,_rej)=>{
            fetch(STREAMRULES,{
                method: "POST",
                headers: {
                    'Authorization': 'Bearer '+process.env.TWITTER_BEARER_TOKEN,
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({ add: [ {value: query, tag: tag} ] })
            }).then(res=>{
                console.log(res)
                resolve(res)
            }).catch((err)=>console.log(err))
        })
}

export function createStream(): Promise<[NodeJS.ReadableStream, AbortController]> {
    let abortSig = new AbortController()
    return new Promise( (resolve,_reject) => {
        fetch(GETSTREAM,{
            method: "GET",
            signal: abortSig.signal,
            headers: {
                'Authorization': 'Bearer '+process.env.TWITTER_BEARER_TOKEN,
            }
        }).then(res=>
            {
                resolve( [res.body, abortSig] )
            })
    });

}

export async function deleteAllRules() {
    const ids = await getAllRuleIDS();
    if (ids.length) {
        await deleteAllRuleIDS(ids)
    }
    console.log("rules deleted")
}

