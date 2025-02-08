import { useKeyboardControls } from "@react-three/drei";
import useGames from "./stores/useGames";
import { useEffect, useRef } from "react";
import { addEffect } from "@react-three/fiber"; 

export default function Interface()
{
    const time = useRef();
    const restart = useGames(state => state.restart);
    const phase = useGames(state => state.phase);

    const forward = useKeyboardControls(state => state.forward);
    const backward = useKeyboardControls(state => state.backward);
    const leftward = useKeyboardControls(state => state.leftward);
    const rightward = useKeyboardControls(state => state.rightward);
    const jump = useKeyboardControls(state => state.jump);

    /*  
    Interface.js is not in canvas
    useFrame can only be used in <Canvas>
    but addEffect can be available outside of the canvas 
    and it will be called right after the useFrame is being called
    */
    // we only want to call addEffect once
    useEffect(() => {
        const unsubscribeEffect = addEffect(() => {
            const state = useGames.getState();
            
            let elapsedTime = 0;
            if (state.phase == "playing")
            {
                elapsedTime = Date.now() - state.startTime;
            }
            else if (state.phase == "ended")
            {
                elapsedTime = state.endTime - state.startTime;
            }
            elapsedTime /= 1000;
            elapsedTime = elapsedTime.toFixed(2);
            
            if (time.current)
                time.current.textContent = elapsedTime;
        })

        return () => {
            unsubscribeEffect()
        }
    }, [])

    return <div className="interface">
        {/* Time */}
        <div ref={time} className="time">0.00</div>

        {/* Restart */}
        { phase == "ended" && <div className="restart" onClick={restart}> restart </div>}
        
        {/* Controls */}
        <div className="controls">
            <div className="raw">
                <div className={`key ${forward ? "active" : ""}`}></div>
            </div>
            <div className="raw">
                <div className={`key ${leftward ? "active" : ""}`}></div>
                <div className={`key ${backward ? "active" : ""}`}></div>
                <div className={`key ${rightward ? "active" : ""}`}></div>
            </div>
            <div className="raw">
                <div className={`key large ${jump ? "active" : ""}`}></div>
            </div>
        </div>
    </div>
}