import s from "./App.module.scss";

import { AllEventsTable } from "../MarketEventsPresenter/AllEventsTable.tsx";
import { MarketInfluenceSummary } from "../MarketInfluenceSummary/MarketInfluenceSummary.tsx";
import { ProcStats } from "../ProcessorStatistics/ProcStats.tsx";
import {useEffect} from "react";
import {MarketIncluenceChart} from "../MarketInfluenceChart/MarketIncluenceChart.tsx";


function App() {

    useEffect(()=>{
        setTimeout(()=>{
            this.location.href = this.location.href
        },1000 * 60 * 60)
    },[])

    return <div className={s.main}>
        <div>
            <AllEventsTable/>


        </div>
        <div>
            <ProcStats/>
            <MarketInfluenceSummary/>
            <MarketIncluenceChart/>
        </div>
    </div>
}

export default App