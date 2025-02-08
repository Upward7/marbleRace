import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { RigidBody, useRapier } from "@react-three/rapier";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three"
import useGames from "./stores/useGames";

export default function Player() {
    const body = useRef();

    // A function to subscribe to key changes (useful to know when the jump key has been pressed)
    // A function to get the current states of the keys
    const [subscribeKeys, getKeys] = useKeyboardControls();

    const {rapier, world} = useRapier();
    const rapierWorld = world.raw(); // 原生rapier的世界对象

    const [smoothedCameraPosition] = useState(()=> new THREE.Vector3(10, 10, 10));
    const [smoothedCameraTarget] = useState(()=> new THREE.Vector3());

    const start = useGames(state => state.start);
    const end = useGames(state => state.end);
    const blockCount = useGames(state => state.blockCount);
    const restart = useGames(state => state.restart);

    const jump = () => {
        const origin = body.current.translation();
        origin.y -= 0.31; // because the sphere radius is 0.3
        const direction = {x: 0, y: -1, z: 0};
        const ray = new rapier.Ray(origin, direction);
        const hit = rapierWorld.castRay(ray, 10, true); // true:将所有物体视为固体

        if (hit.toi < 0.15) // 防止一直按跳跃键跳得越来越高
        body.current.applyImpulse({x: 0, y: 0.5, z: 0})
        
    }

    const reset = () => {
        body.current.setTranslation({x: 0, y: 1, z: 0});
        // to remove any translation force
        body.current.setLinvel({x: 0, y: 0, z: 0});
        // to remove any angular force
        body.current.setAngvel({x: 0, y: 0, z: 0});
    }

    // We want to subscribe to the event only once
    useEffect(() => {
        const unsubscribeReset = useGames.subscribe(
            (state) => state.phase,
            (value) => {
                if (value == "ready")
                    reset();
            }
        )
        const unsubscribeJump = subscribeKeys(
            state => state.jump, 
            value => {
            if (value)
                jump();
        });
        const unsubscribeAny = subscribeKeys(
            () => {
                start();
            }
        )
        // when the component is being disposed
        return () => {
            unsubscribeReset();
            unsubscribeJump();
            unsubscribeAny();
        }
    }, [])

    useFrame((state, delta) => {
        /* 
        Controls
        */
        const { forward, backward, leftward, rightward } = getKeys();

        // 冲量和扭矩
        const impulse = { x: 0, y: 0, z: 0 };
        const torque = { x: 0, y: 0, z: 0 };
        const impulseStrength = 0.6 * delta;
        const torqueStrength = 0.2 * delta;

        if (forward) {
            impulse.z -= impulseStrength;
            torque.x -= torqueStrength;
        }

        if (backward) {
            impulse.z += impulseStrength;
            torque.x += torqueStrength;
        }

        if (leftward) 
        {
            impulse.x -= impulseStrength;
            torque.z += torqueStrength;
        }

        if (rightward)
        {
            impulse.x += impulseStrength;
            torque.z -= torqueStrength;
        }

        body.current.applyImpulse(impulse);
        body.current.applyTorqueImpulse(torque);

        /* 
        Camera
        */
       const bodyPosition = body.current.translation();
       const cameraPosition = new THREE.Vector3();
       cameraPosition.copy(bodyPosition);
       cameraPosition.z += 2.25;
       cameraPosition.y += 0.65

       const cameraTarget = new THREE.Vector3();
       cameraTarget.copy(bodyPosition);
       cameraTarget.y += 0.25;

       smoothedCameraPosition.lerp(cameraPosition, 5 * delta);
       smoothedCameraTarget.lerp(cameraTarget, 5 * delta);
       
       state.camera.position.copy(smoothedCameraPosition);
       state.camera.lookAt(smoothedCameraTarget);

       /* 
       Phases
       */
      if (bodyPosition.z < - (blockCount * 4 + 2))
      {
        end();
      }

      if (bodyPosition.y < -4)
      {
        restart();
      }

    })
    return <>
        {/* apply the damping for the translation and the rotation */}
        <RigidBody 
            ref={body} 
            colliders="ball" 
            restitution={0.2} 
            friction={1}
            linearDamping={0.5}
            angularDamping={0.5} 
            position={[0, 1, 0]}
        >
            <mesh castShadow>
                {/* 二十面体 */}
                <icosahedronGeometry args={[0.3, 1]} />
                {/* flatShading: want the player to be able to notice that rotation */}
                <meshStandardMaterial flatShading color="mediumpurple" />
            </mesh>
        </RigidBody>
    </>
}