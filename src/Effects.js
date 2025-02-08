import { DepthOfField, EffectComposer } from "@react-three/postprocessing";

export default function Effects() {
    return <EffectComposer>
        {/* focusDistance属性通常用于设置焦点的距离，
        focalLength属性用于控制镜头的焦距，
        而bokehScale属性则可能用于调整模糊的形状和强度 */}
        <DepthOfField focusDistance={0.01} focalLength={0.2} bokehScale={3} />
    </EffectComposer>
}