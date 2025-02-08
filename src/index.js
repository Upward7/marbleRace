import "./style.css";
import { createRoot } from "react-dom/client";
import { Canvas } from "@react-three/fiber"
import { KeyboardControls } from "@react-three/drei";
import Experience from "./Experience";
import Interface from "./Interface";

const root = createRoot(document.querySelector("#root"));

root.render(
    // For non-QWERTY keyboard, "w" and "KeyW" would result in different effect
    <KeyboardControls
        map={[
            { name: "forward", keys: ["ArrowUp", "KeyW"] },
            { name: "backward", keys: ["ArrowDown", "KeyS"] },
            { name: "leftward", keys: ["ArrowLeft", "KeyA"] },
            { name: "rightward", keys: ["ArrowRight", "KeyD"] },
            { name: "jump", keys: ["Space"] },
        ]}
    >
        <Canvas
            shadows
            camera={{
                fov: 45,
                near: 0.1,
                far: 200,
                position: [2.5, 4, 6]
            }}
        >
            <Experience />
        </Canvas>
        <Interface />
    </KeyboardControls>
)