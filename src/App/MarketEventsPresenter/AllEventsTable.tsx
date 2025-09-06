import {useEffect, useMemo, useState} from "react";
import {Article, MarketEvent, MarketEventType} from "../App/App.types.tsx";
import {fet} from "../App/Utils.tsx";
import {formatDate, formatTimeLeft, marketColor, parseDate} from "../App/App.Utils.tsx";
import s from "./AllEventsTable.module.scss";
import { starsFromNum } from "./AllEventsTable.Utils.tsx";

export function AllEventsTable({settings}) {
    const [dumbState,setDumbState] = useState<number>(0)
    useEffect(()=>{
        const x = setInterval(()=>{
            setDumbState(s=>s+1)
        },1000*60*3)
        return ()=>{
            clearInterval(x)
        }
    },[])

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
            setArticles(mapped)
        })
    },[dumbState])

    const articlesFiltered = useMemo(()=>{
        const sorted = articles.sort((a: Article,b: Article) => b.timestamp.getTime() - a.timestamp.getTime())
        const filtered = sorted.filter(article=>{
            if(!settings.maxArticleAge.enabled) return true

            const maxAllowedAgeMillis = settings.maxArticleAge.value * 60 * 60 * 1000
            const articleAgeMillis = article.timestamp.getTime()
            const currentTimeMillis = new Date().getTime()

            return articleAgeMillis > currentTimeMillis - maxAllowedAgeMillis
        })
        return filtered
    },[articles, settings])

    return <table className={s.main}>
        <tbody>
        {articlesFiltered.map((article,index) => <ArticleRowTr settings={settings} index={index} key={article.id} article={article}/>)}
        </tbody>
    </table>
}

function ArticleRowTr({ article, index, settings }: { article: Article,index: number,settings:any }) {

    const [marketEvents, setMarketEvents] = useState<MarketEvent[]>([])
    const downloadMarketEvents = ()=>{
        fet(`articles/${article.id}/marketEvents`).then(res=>{
            setMarketEvents(res.map((marketEvent: MarketEvent)=>{
                return {
                    ...marketEvent,
                    startTimestamp: parseDate(marketEvent.startTimestamp),
                    endTimestamp: parseDate(marketEvent.endTimestamp)
                }
            }))
        })
    }

    const eventsFiltered = useMemo(()=>{
        let filtered = marketEvents.filter(event=>{
            if(!settings.minArticleChance.enabled) return true
            return event.impactChance >= settings.minArticleChance.value
        })
        filtered = filtered.filter(event=>{
            if(!settings.minArticleInfluence.enabled) return true
            return event.impactPrc >= settings.minArticleInfluence.value
        })
        return filtered
    }, [marketEvents, settings])

    //FIRST LOAD
    useEffect(() => {
        if(marketEvents.length > 0){
            return
        }
        if(index > 100) {
            return
        }
        setTimeout(downloadMarketEvents,index*100)
    }, [])

    //AUTO REFRESHING
    useEffect(() => {
        if(marketEvents.length > 0){
            return
        }
        if(index > 50) {
            return
        }
        const delayMillis = 1000*60*3
        let interval = null
        let timeout = setTimeout(()=>{
            interval = setInterval(downloadMarketEvents,delayMillis)
        },delayMillis)
        return () => {
            if(interval)
            clearInterval(interval)
            if(timeout)
            clearInterval(timeout)
        }
    }, [])

    if(eventsFiltered.length == 0){
        return null
    }

    return <>
        <tr>
            <th colSpan={5}><a href={article.url}>{article.title}</a></th>
            <td>{formatDate(article.timestamp)}</td>
            <td>Wiek: {formatTimeLeft(article.timestamp,new Date())}</td>
        </tr>
        <tr className={s.titleRow}>
            <th>celność</th>
            <th>typ</th>

            <th>wpływ na rynek</th>
            <th>tekst</th>

            <th>początek wpływu</th>
            <th>koniec wpływu</th>
            <th>czas do końca wpływu</th>
        </tr>
        {eventsFiltered.map(marketEvent =><MarketEventRow marketEvent={marketEvent} key={marketEvent.id}/>)}
        <tr className={s.spacer}></tr>
    </>
}

export function MarketEventRow({marketEvent}: {marketEvent: MarketEvent}) {

    const color = marketColor(marketEvent)

    return <tr key={marketEvent.id} className={marketEvent.type == MarketEventType.Pozytywny ? s.positive : s.negative} style={{backgroundColor:color.hexColor}}>
        <td>{starsFromNum(marketEvent.impactChance/10)}</td>
        <td>{
            marketEvent.type == MarketEventType.Pozytywny
                ? "▲"
                : "▼"
        }</td>

        <td>{marketEvent.impactPrc} %</td>
        <td>{marketEvent.scream}</td>

        <td>{formatDate(marketEvent.startTimestamp)}</td>
        <td>{formatDate(marketEvent.endTimestamp)}</td>
        <td>{formatTimeLeft(new Date(),marketEvent.endTimestamp)}</td>
    </tr>
}