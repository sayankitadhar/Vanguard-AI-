import { motion } from 'framer-motion';

type PulseStatus = 'healthy' | 'threat' | 'offline';

interface HeartbeatPulseProps {
    status: PulseStatus;
}

export function HeartbeatPulse({ status }: HeartbeatPulseProps) {
    const getColors = () => {
        switch (status) {
            case 'healthy':
                return {
                    primary: '#00ff00',
                    glow: 'rgba(0, 255, 0, 0.6)',
                    bgGlow: 'rgba(0, 255, 0, 0.1)'
                };
            case 'threat':
                return {
                    primary: '#ff0000',
                    glow: 'rgba(255, 0, 0, 0.8)',
                    bgGlow: 'rgba(255, 0, 0, 0.2)'
                };
            case 'offline':
                return {
                    primary: '#ff8c00',
                    glow: 'rgba(255, 140, 0, 0.6)',
                    bgGlow: 'rgba(255, 140, 0, 0.1)'
                };
        }
    };

    const colors = getColors();

    // Animation variants based on status
    const pulseVariants = {
        healthy: {
            scaleX: [1, 1.2, 1],
            opacity: [0.8, 1, 0.8],
            transition: {
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut'
            }
        },
        threat: {
            scaleX: [1, 1.5, 0.8, 1.3, 1],
            opacity: [1, 0.6, 1, 0.6, 1],
            transition: {
                duration: 0.5,
                repeat: Infinity,
                ease: 'easeInOut'
            }
        },
        offline: {
            scaleX: [1, 1.1, 1],
            opacity: [0.6, 1, 0.6],
            transition: {
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut'
            }
        }
    };

    // SVG path for heartbeat line
    const heartbeatPath = status === 'threat'
        ? 'M0,25 L15,25 L20,5 L25,45 L30,10 L35,40 L40,25 L55,25 L60,5 L65,45 L70,25 L100,25'
        : 'M0,25 L30,25 L35,10 L40,40 L45,25 L100,25';

    return (
        <div
            className="heartbeat-container"
            style={{
                background: colors.bgGlow,
                borderTop: `1px solid ${colors.primary}`
            }}
        >
            <motion.svg
                width="100%"
                height="30"
                viewBox="0 0 100 50"
                preserveAspectRatio="none"
                style={{ filter: `drop-shadow(0 0 4px ${colors.glow})` }}
            >
                <motion.path
                    d={heartbeatPath}
                    fill="none"
                    stroke={colors.primary}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    variants={pulseVariants}
                    animate={status}
                />
            </motion.svg>

            {/* Status indicator dot */}
            <motion.div
                className="status-dot"
                style={{ backgroundColor: colors.primary }}
                animate={{
                    boxShadow: [
                        `0 0 5px ${colors.glow}`,
                        `0 0 15px ${colors.glow}`,
                        `0 0 5px ${colors.glow}`
                    ]
                }}
                transition={{ duration: status === 'threat' ? 0.3 : 1.5, repeat: Infinity }}
            />

            {/* Status label */}
            <span className="status-label" style={{ color: colors.primary }}>
                {status === 'healthy' && 'SECURE'}
                {status === 'threat' && 'SOS ALERT'}
                {status === 'offline' && 'OFFLINE-SYNC'}
            </span>
        </div>
    );
}
