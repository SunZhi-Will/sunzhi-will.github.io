'use client'

import { useEffect, useState, memo } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

const ParticlesBackground = memo(() => {
    const [init, setInit] = useState(false);

    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
        }).then(() => {
            setInit(true);
        });
    }, []); // 只在組件首次掛載時執行

    return (
        <>
            {init && <Particles
                id="tsparticles"
                options={{
                    fpsLimit: 120,
                    interactivity: {
                        events: {
                            onHover: {
                                enable: true,
                                mode: "grab",
                            },
                            resize: {
                                enable: true,
                            },
                        },
                        modes: {
                            grab: {
                                distance: 180,
                                links: {
                                    opacity: 0.8,
                                },
                            },
                        },
                    },
                    particles: {
                        color: {
                            value: ["#3b82f6", "#60a5fa", "#93c5fd"],
                        },
                        links: {
                            color: "#3b82f6",
                            distance: 180,
                            enable: true,
                            opacity: 0.3,
                            width: 1.5,
                        },
                        collisions: {
                            enable: false,
                        },
                        move: {
                            enable: true,
                            speed: 0.8,
                            direction: "none",
                            random: true,
                            straight: false,
                            outModes: {
                                default: "bounce",
                            },
                            attract: {
                                enable: true,
                                rotate: {
                                    x: 500,
                                    y: 500
                                }
                            },
                        },
                        number: {
                            density: {
                                enable: true,
                                height: 800,
                                width: 800
                            },
                            value: 48,
                        },
                        opacity: {
                            value: 0.5,
                            animation: {
                                enable: true,
                                speed: 0.3,
                                count: 0,
                                decay: 0,
                                delay: 0,
                                sync: false,
                            },
                        },
                        shape: {
                            type: "circle",
                        },
                        size: {
                            value: { min: 1.5, max: 3 },
                            animation: {
                                enable: true,
                                speed: 0.3,
                                count: 0,
                                decay: 0,
                                delay: 0,
                                sync: false,
                            },
                        },
                    },
                    detectRetina: true,
                    background: {
                        color: "transparent",
                    },
                }}
                className="absolute inset-0 -z-10"
            />}
        </>
    );
});

ParticlesBackground.displayName = 'ParticlesBackground';

export default ParticlesBackground; 