import s from "./App.module.scss";

import { AllEventsTable } from "../MarketEventsPresenter/AllEventsTable.tsx";
import { Summary } from "../MarketInfluenceSummary/Summary.tsx";
import { ProcStats } from "../ProcessorStatistics/ProcStats.tsx";
import {useEffect} from "react";


function App() {

    useEffect(()=>{
        setTimeout(()=>{
            this.location.href = this.location.href
        },1000 * 60 * 60)
    },[])

    return <div className={s.main}>
        <ProcStats/>
        <Summary/>
        <AllEventsTable/>
    </div>
}

export default App