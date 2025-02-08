import create from "zustand"
import { subscribeWithSelector } from "zustand/middleware"

// subscribeWithSelector: we need to subscribe to the changes on the store
export default create(subscribeWithSelector((set) => {
    return {
        blockCount: 3,
        blockSeed: 0, // 生成新的关卡

        /* 
        Time
        */
       startTime: 0,
       endTime: 0,

        /* 
        Phases
        */
        phase: "ready",

        start: () => {            
            set((state) => {
                if (state.phase == "ready")
                    return { phase: "playing", startTime: Date.now() }
                return {}
            })
        },

        restart: () => {
            set((state) => {
                if (state.phase == "playing" || state.phase == "ended")
                    return { phase: "ready", blockSeed: Math.random() }
                return {}
            })
        },

        end: () => {
            set((state) => {
                if (state.phase == "playing")
                    return { phase: "ended", endTime: Date.now() }
                return {}
            })
        },
    }
}))