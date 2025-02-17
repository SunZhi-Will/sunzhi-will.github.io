'use client'

import { useCallback } from "react";
import type { Engine } from "tsparticles-engine";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

export default function ParticlesBackground() {
    const particlesInit = useCallback(async (engine: Engine) => {
        await loadSlim(engine);
    }, []);

    return (
        <Particles
            id="tsparticles"
            init={particlesInit}
            options={{
                fpsLimit: 120,
                interactivity: {
                    events: {
                        onHover: {
                            enable: true,
                            mode: "grab",
                        },
                        resize: true,
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
                            rotateX: 500,
                            rotateY: 500,
                        },
                    },
                    number: {
                        density: {
                            enable: true,
                            area: 800,
                        },
                        value: 48,
                    },
                    opacity: {
                        value: 0.5,
                        random: {
                            enable: true,
                            minimumValue: 0.3,
                        },
                        animation: {
                            enable: true,
                            speed: 0.3,
                            minimumValue: 0.3,
                            sync: false,
                        },
                    },
                    shape: {
                        type: "circle",
                    },
                    size: {
                        value: { min: 1.5, max: 3 },
                        random: {
                            enable: true,
                            minimumValue: 1,
                        },
                        animation: {
                            enable: true,
                            speed: 0.3,
                            minimumValue: 1,
                            sync: false,
                        },
                    },
                },
                detectRetina: true,
                background: {
                    color: "transparent",
                },
            }}
            className="absolute inset-0"
        />
    );
} 