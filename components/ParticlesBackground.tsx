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
                            value: ["#FDB813", "#FFE5B4", "#FF9D00"],
                        },
                        links: {
                            color: "#FDB813",
                            distance: 180,
                            enable: true,
                            opacity: 0.15,
                            width: 1,
                        },
                        collisions: {
                            enable: false,
                        },
                        move: {
                            enable: true,
                            speed: 0.5,
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
                            value: 36,
                        },
                        opacity: {
                            value: 0.3,
                            animation: {
                                enable: true,
                                speed: 0.2,
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