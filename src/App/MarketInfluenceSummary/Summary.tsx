import {useEffect, useState} from "react";
import {MarketEvent, MarketEventType} from "../App/App.types.tsx";
import {fet} from "../App/Utils.tsx";
import {parseDate} from "../App/App.Utils.tsx";
import s from "./Summary.module.scss";
import {calculateAvg} from "./Summary.Utils.tsx";

export function Summary() {
    const [dumbState,setDumbState] = useState<number>(0)
    useEffect(()=>{
        const x = setInterval(()=>{
            setDumbState(s=>s+1)
        },1000*60*3)
        return ()=>{
            clearInterval(x)
        }
    },[])

    const [events,setEvents] = useState<Array<MarketEvent>>([])
    useEffect(() => {
        fet(`marketEvents/current`).then(res=>{
            setEvents(res.map((marketEvent: MarketEvent)=>{
                return {
                    ...marketEvent,
                    startTimestamp: parseDate(marketEvent.startTimestamp),
                    endTimestamp: parseDate(marketEvent.endTimestamp)
                }
            }))
        })
    },[dumbState])

    const pos = calculateAvg(events.filter(ev=> ev.type == MarketEventType.Pozytywny))
    const neg = calculateAvg(events.filter(ev=> ev.type == MarketEventType.Negatywny))

    const dif = pos-neg

    return <div className={s.main}>
        <span>Średnie wartości wpływu aktywnych wydarzeń rynkowych, ważone ich celnością</span>
        <span>Pozytywna: {pos.toFixed(3)} %</span><br/>
        <span>Negatywna: {neg.toFixed(3)} %</span>
        <span className={`${s.difference} ${dif > 0 ? s.green : s.red}`}>
            Różnica: {dif.toFixed(3)} % {dif > 0 ? "▲" : "▼"}
        </span>
        {/*<table className={s.main}>*/}
        {/*    {events.map((event)=><MarketEventRow key={event.id} marketEvent={event}/>)}*/}
        {/*</table>*/}
    </div>
}