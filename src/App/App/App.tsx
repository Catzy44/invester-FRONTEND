import s from "./App.module.scss";

import { AllEventsTable } from "../MarketEventsPresenter/AllEventsTable.tsx";
import { MarketInfluenceSummary } from "../MarketInfluenceSummary/MarketInfluenceSummary.tsx";
import { ProcStats } from "../ProcessorStatistics/ProcStats.tsx";
import {useEffect, useState} from "react";
import {MarketIncluenceChart} from "../MarketInfluenceChart/MarketIncluenceChart.tsx";
import { Settings } from "../Settings/Settings.tsx";
import {getCookie, setCookie} from "./Utils.tsx";


function App() {
    const [settings,setSettings] = useState({
        maxArticleAge: {
            enabled: (getCookie("maxArticleAge.enabled") ?? "true") == "true",
            value: parseInt(getCookie("maxArticleAge.value") ?? "24"),
        },
        minArticleChance: {
            enabled: (getCookie("minArticleChance.enabled") ?? "true") == "true",
            value: parseInt(getCookie("minArticleChance.value") ?? "85"),
        },
        minArticleInfluence: {
            enabled: (getCookie("minArticleInfluence.enabled") ?? "false") == "true",
            value: parseInt(getCookie("minArticleInfluence.value") ?? "0"),
        }
    })
    useEffect(() => {
        setCookie("maxArticleAge.enabled", settings.maxArticleAge.enabled ? "true" : "false", 365)
        setCookie("maxArticleAge.value", settings.maxArticleAge.value, 365)
    }, [settings])

    const pass = {settings, setSettings}

    useEffect(()=>{
        setTimeout(()=>{
            window.location.href = window.location.href
        },1000 * 60 * 60)
    },[])

    return <div className={s.main}>
        <div>
            <Settings {...pass}/>
            <AllEventsTable {...pass}/>
        </div>
        <div>
            <ProcStats/>
            <MarketInfluenceSummary {...pass}/>
            <MarketIncluenceChart {...pass}/>
        </div>
    </div>
}

export default App