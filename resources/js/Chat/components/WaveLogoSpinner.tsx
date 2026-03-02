import React from 'react';

const WaveLogoSpinner = ({ size = 110 }) => {
    const imageSize = 70;
    const x = (110 - imageSize) / 2;
    const y = (110 - imageSize) / 2;

    return (
        <div
            className="relative flex items-center justify-center p-4"
            style={{ width: size, height: size }}
        >
            <svg
                width={size}
                height={size}
                viewBox="0 0 110 110"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="relative"
            >
                {/* Base circle with gradient */}
                <circle cx="55" cy="55" r="55" fill="url(#paint0_linear_1189_60)" />

                {/* Animated wave overlay */}
                <circle
                    cx="55"
                    cy="55"
                    r="55"
                    fill="url(#waveGradient)"
                />

                {/* Logo Image */}
                <image
                    href="/spontaine-mark-logo.png"
                    x={x}
                    y={y}
                    width={imageSize}
                    height={imageSize}
                />

                <defs>
                    {/* Original gradient */}
                    <linearGradient id="paint0_linear_1189_60" x1="55" y1="0" x2="55" y2="110" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#00CE93" />
                        <stop offset="0.447115" stopColor="#AECD99" />
                        <stop offset="1" stopColor="#0794A4" />
                    </linearGradient>

                    {/* Animated wave gradient */}
                    <linearGradient id="waveGradient" x1="0" y1="0" x2="110" y2="110" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="transparent">
                            <animate
                                attributeName="offset"
                                values="-0.5;1.5;-0.5"
                                dur="2.5s"
                                repeatCount="indefinite"
                            />
                        </stop>
                        <stop offset="30%" stopColor="rgba(255, 255, 255, 0.4)">
                            <animate
                                attributeName="offset"
                                values="-0.2;1.8;-0.2"
                                dur="2.5s"
                                repeatCount="indefinite"
                            />
                        </stop>
                        <stop offset="50%" stopColor="rgba(255, 255, 255, 0.6)">
                            <animate
                                attributeName="offset"
                                values="0;2;0"
                                dur="2.5s"
                                repeatCount="indefinite"
                            />
                        </stop>
                        <stop offset="70%" stopColor="rgba(255, 255, 255, 0.4)">
                            <animate
                                attributeName="offset"
                                values="0.2;2.2;0.2"
                                dur="2.5s"
                                repeatCount="indefinite"
                            />
                        </stop>
                        <stop offset="100%" stopColor="transparent">
                            <animate
                                attributeName="offset"
                                values="0.5;2.5;0.5"
                                dur="2.5s"
                                repeatCount="indefinite"
                            />
                        </stop>
                    </linearGradient>
                </defs>
            </svg>
        </div>
    );
};

export default WaveLogoSpinner;
