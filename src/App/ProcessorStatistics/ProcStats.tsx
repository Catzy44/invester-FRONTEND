import {useEffect, useState} from "react";
import {Article} from "../App/App.types.tsx";
import {fet} from "../App/Utils.tsx";
import {parseDate} from "../App/App.Utils.tsx";
import s from "./ProcStats.module.scss";

export function ProcStats() {
    const [articles,setArticles] = useState<Array<Article>>([])
    useEffect(() => {
        fet(`articles`).then(res=>{
            const mapped = res.map((article: Article)=> {
                return {
                    ...article,
                    timestamp: parseDate(article.timestamp),
                    processedTimestamp: parseDate(article.processedTimestamp)
                }
            })
            const sorted = mapped.sort((a: Article,b: Article)=>{
                return a.timestamp.getTime() - b.timestamp.getTime()
            })
            setArticles(sorted)
        })
    },[])

    const ago = new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
    const processedThisDat = articles.filter((article: Article) => article.timestamp.getTime() < ago.getTime()).length

    return <div className={s.main}>
        <span>Przetwarzanie: AMD RADEON RX6700XT 12GB</span>
        <span>LLM Model: DeepSeek R1 14B</span>
        <span>Artykuły przetworzone w ciągu ostatniej doby: {processedThisDat}</span>
    </div>
}