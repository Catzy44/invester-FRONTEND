import s from "./App.module.scss";

import {useEffect, useState} from "react";
import {Article, MarketEvent, MarketEventType } from "./App.types.tsx";
import {formatDate, formatTimeLeft, marketColor, parseDate, starsFromNum} from "./App.utils.tsx";
import { fet } from "./Utils.tsx";


function App() {
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
            const sorted = mapped.sort((a: Article,b: Article)=>{
                return a.timestamp.getTime() - b.timestamp.getTime()
            })
            setArticles(sorted)
        })
    },[dumbState])

    return <table className={s.main}>
        <tbody>
        {articles.reverse().map((article,index) => <ArticleRowTr index={index} key={article.id} article={article}/>)}
        </tbody>
    </table>
}

function ArticleRowTr({ article, index }: { article: Article,index: number }) {
    const [dumbState,setDumbState] = useState<number>(0)
    useEffect(()=>{
        const x = setInterval(()=>{
            setDumbState(s=>s+1)
        },1000*60)
        return ()=>{
            clearInterval(x)
        }
    },[])

    const [marketEvents, setMarketEvents] = useState<MarketEvent[]>([])
    useEffect(()=>{
        if(index > 50) {
            //return
        }
        if(marketEvents.length > 0){
            return
        }
        setTimeout(()=>{
            fet(`articles/${article.id}/marketEvents`).then(res=>{
                setMarketEvents(res.map((marketEvent: MarketEvent)=>{
                    return {
                        ...marketEvent,
                        startTimestamp: parseDate(marketEvent.startTimestamp),
                        endTimestamp: parseDate(marketEvent.endTimestamp)
                    }
                }))
            })
        },index*100)
    },[dumbState])


    return <>
        <tr>
            <th colSpan={5}>{article.title}</th>
            <td>{formatDate(article.timestamp)}</td>
            <td>WIEK:{formatTimeLeft(article.timestamp,new Date())}</td>
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
        {marketEvents.map(marketEvent =><MarketEventRow marketEvent={marketEvent} key={marketEvent.id}/>)}
        <tr className={s.spacer}></tr>
    </>
}

function MarketEventRow({marketEvent}: {marketEvent: MarketEvent}) {

    const color = marketColor(marketEvent)

    return <tr key={marketEvent.id} className={marketEvent.type == MarketEventType.Pozytywny ? s.positive : s.negative} style={{backgroundColor:color.hexColor}}>
        <td>{starsFromNum(marketEvent.impactChance/10)}</td>
        <td>{
            marketEvent.type == MarketEventType.Pozytywny
                ? "Pozytywny ▲"
                : "Negatywny ▼"
        }</td>

        <td>{marketEvent.impactPrc} %</td>
        <td>{marketEvent.scream}</td>

        <td>{formatDate(marketEvent.startTimestamp)}</td>
        <td>{formatDate(marketEvent.endTimestamp)}</td>
        <td>{formatTimeLeft(new Date(),marketEvent.endTimestamp)}</td>
    </tr>
}

export default App