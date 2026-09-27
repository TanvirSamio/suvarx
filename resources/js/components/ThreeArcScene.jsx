import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { Image as DreiImage, useGLTF, Environment } from '@react-three/drei';
import * as THREE from 'three';

// Fallback 2D Image rendered in 3D Space
const FallbackImage = ({ url, opacity }) => {
    return (
        <DreiImage
            url={url}
            transparent={true}
            opacity={opacity}
            scale={[3, 4, 1]} // Aspect ratio 3:4 roughly matching product photos
        />
    );
};

// 3D Model Loader with Fallback
const ProductModel = ({ drop, opacity }) => {
    const hasModel = !!drop.model_3d;
    
    // We only call useGLTF if the URL exists, but React hooks can't be called conditionally.
    // However, useGLTF uses suspense, so we can wrap it or just provide a dummy string if missing.
    // A cleaner way is a sub-component that mounts only when hasModel is true.
    return hasModel ? (
        <Real3DModel 
            url={drop.model_3d} 
            opacity={opacity}
            scale={drop.model_scale ?? 2.0}
            posX={drop.model_pos_x ?? 0}
            posY={drop.model_pos_y ?? 0}
            posZ={drop.model_pos_z ?? 0}
            rotX={drop.model_rot_x ?? 0}
            rotY={drop.model_rot_y ?? 0}
            rotZ={drop.model_rot_z ?? 0}
        />
    ) : (
        <FallbackImage url={drop.image} opacity={opacity} />
    );
};

const Real3DModel = ({ url, opacity, scale, posX, posY, posZ, rotX, rotY, rotZ }) => {
    const { scene } = useGLTF(url);
    // Since useGLTF returns a cached scene, we need to clone it if rendering multiple of same model,
    // or just render it directly if they are unique per item.
    return (
        <primitive 
            object={scene.clone()} 
            scale={scale} 
            position={[posX, posY, posZ]}
            rotation={[rotX, rotY, rotZ]}
        />
    );
};

// Single Item in the Arc
const ArcItem = ({ drop, index, activeIndex, isReducedMotion }) => {
    const groupRef = useRef();
    const navigate = useNavigate();

    // Calculate distance from center (0 = center, -1 = left, 1 = right)
    const dist = index - activeIndex;

    // Target values based on distance
    const targetScale = dist === 0 ? 1.2 : 0.8;
    const targetOpacity = dist === 0 ? 1 : 0.4;
    
    // Position on a circular arc
    const radius = 6;
    const angle = dist * 0.4; // 0.4 radians separation
    const targetX = Math.sin(angle) * radius;
    const targetZ = Math.cos(angle) * radius - radius;
    const targetY = dist === 0 ? 0 : -0.5;

    // Rotation tilting away from camera
    const targetRotY = -angle * 0.8; 

    // Initial random offset for floating idle loop so they don't move in sync
    const [timeOffset] = useState(() => Math.random() * Math.PI * 2);

    useFrame((state, delta) => {
        if (!groupRef.current) return;

        // 1. Smoothly interpolate Position, Rotation, Scale (500-700ms feel)
        const dampFactor = isReducedMotion ? 15 : 6;
        
        groupRef.current.position.x = THREE.MathUtils.damp(groupRef.current.position.x, targetX, dampFactor, delta);
        groupRef.current.position.z = THREE.MathUtils.damp(groupRef.current.position.z, targetZ, dampFactor, delta);
        groupRef.current.position.y = THREE.MathUtils.damp(groupRef.current.position.y, targetY, dampFactor, delta);
        
        groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, targetRotY, dampFactor, delta);
        
        groupRef.current.scale.setScalar(
            THREE.MathUtils.damp(groupRef.current.scale.x, targetScale, dampFactor, delta)
        );

        // 2. Add gentle idle floating animation if not reduced motion
        if (!isReducedMotion) {
            const floatY = Math.sin(state.clock.elapsedTime * 1.5 + timeOffset) * 0.1;
            // Add float on top of targetY
            groupRef.current.position.y += floatY * delta; // slightly accumulative or direct assignment
        }
    });

    return (
        <group 
            ref={groupRef} 
            onClick={(e) => {
                e.stopPropagation();
                // If it's the center item, clicking takes you to detail
                // If it's not the center item, we could just do the same, or center it first
                navigate(`/product/${drop.slug}`);
            }}
            onPointerOver={(e) => {
                e.stopPropagation();
                document.body.style.cursor = 'pointer';
            }}
            onPointerOut={(e) => {
                e.stopPropagation();
                document.body.style.cursor = 'auto';
            }}
        >
            {/* The tilt applied to the object itself to face up slightly */}
            <group rotation={[dist === 0 ? -0.1 : 0, 0, 0]}>
                <ProductModel drop={drop} opacity={targetOpacity} />
            </group>
        </group>
    );
};

export const ThreeArcScene = ({ drops, activeIndex }) => {
    const [isReducedMotion, setIsReducedMotion] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setIsReducedMotion(mediaQuery.matches);
        const handler = (e) => setIsReducedMotion(e.matches);
        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
    }, []);

    return (
        <div className="absolute inset-0 z-0 pointer-events-auto">
            <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
                {/* Lighting */}
                <ambientLight intensity={0.5} />
                <spotLight 
                    position={[0, 5, -5]} 
                    angle={0.6} 
                    penumbra={1} 
                    intensity={2} 
                    color="#FF1F7D" 
                />
                
                {/* Arc Lineup */}
                <group position={[0, -0.5, 0]}>
                    {drops.map((drop, idx) => (
                        <ArcItem 
                            key={drop.id} 
                            drop={drop} 
                            index={idx} 
                            activeIndex={activeIndex} 
                            isReducedMotion={isReducedMotion} 
                        />
                    ))}
                </group>
                
                {/* Optional Environment for metallic reflections on future .glb models */}
                <Environment preset="city" />
            </Canvas>
        </div>
    );
};
