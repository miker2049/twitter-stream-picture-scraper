import ILogObject from './ILogObject'

export default function(data: any, tag: string): ILogObject | undefined{
    let output: ILogObject | undefined = undefined
    try {
        const parsed= JSON.parse(data)
        if(parsed.includes && parsed.includes.media[0].url != undefined ){
            if (!( parsed.matching_rules.find((v)=>v.tag===tag)===undefined )) {
                // console.log(parsed)
                output = {url: parsed.includes.media[0].url, text:parsed.data.text, authorid: parsed.data.author_id, created_at: parsed.data.created_at}
            }
        }
    } catch (err) {
        output = undefined;
        // Do something
    }
    return output
}
