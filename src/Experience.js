import { Physics, Debug } from "@react-three/rapier";
import Lights from "./Lights.js"
import {Level} from "./Level.js";
import Player from "./Player.js";
import Effects from "./Effects.js";
import useGames from "./stores/useGames.js";

export default function Experience()
{
    const blockCount = useGames((state) => state.blockCount);
    const blockSeed = useGames((state) => state.blockSeed);

    return <>
        <Physics>
            {/* <Debug></Debug> */}
            <Lights />
            <Level count={blockCount} seed={blockSeed}/>
            <Player />
        </Physics>
        {/* <Effects /> */}
    </>
}