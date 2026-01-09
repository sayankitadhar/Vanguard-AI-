import { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Monitor, Lock, RotateCcw } from 'lucide-react';
import { HeartbeatPulse } from './HeartbeatPulse';
import { triggerGlobalPurge } from '../lib/supabaseClient';

export type SectorType = 'clinic' | 'classroom' | 'csc';
export type DeviceStatus = 'healthy' | 'threat' | 'offline';

interface DeviceCardProps {
    id: string;
    agentId: string;
    index: number;
    sector: SectorType;
    status: DeviceStatus;
    isLockdown: boolean;
    onPurge?: (agentId: string) => void;
}

export function DeviceCard({
    id,
    agentId,
    index,
    sector,
    status,
    isLockdown,
    onPurge
}: DeviceCardProps) {
    const [isPurging, setIsPurging] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    // Mouse tracking for 3D tilt effect
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useSpring(useTransform(y, [-100, 100], [8, -8]), { stiffness: 300, damping: 25 });
    const rotateY = useSpring(useTransform(x, [-100, 100], [-8, 8]), { stiffness: 300, damping: 25 });

    // Get label based on sector
    const getLabel = () => {
        switch (sector) {
            case 'clinic':
                return 'Clinic Station';
            case 'classroom':
                return 'Classroom PC';
            case 'csc':
                return 'CSC Kiosk';
        }
    };

    // Floating animation with staggered delay
    const floatVariants = {
        animate: {
            y: [-10, 10, -10],
            transition: {
                duration: 4 + (index % 3) * 0.5, // Varied timing
                ease: 'easeInOut',
                repeat: Infinity,
                delay: index * 0.3 // Staggered start
            }
        }
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (isLockdown) return;
        const rect = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - rect.left - rect.width / 2);
        y.set(e.clientY - rect.top - rect.height / 2);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
        setIsHovered(false);
    };

    const handlePurge = async () => {
        setIsPurging(true);
        try {
            const result = await triggerGlobalPurge(agentId);
            if (onPurge) onPurge(agentId);
            console.log('Purge result:', result);
        } catch (err) {
            console.error('Purge failed:', err);
        } finally {
            setIsPurging(false);
        }
    };

    return (
        <motion.div
            className="device-card-wrapper"
            variants={floatVariants}
            animate="animate"
            style={{ perspective: 1000 }}
        >
            <motion.div
                className={`device-card ${isLockdown ? 'lockdown' : ''} ${status === 'threat' ? 'threat-active' : ''}`}
                style={{
                    rotateX: isLockdown ? 0 : rotateX,
                    rotateY: isLockdown ? 0 : rotateY,
                    transformStyle: 'preserve-3d'
                }}
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={handleMouseLeave}
                whileHover={isLockdown ? {} : { scale: 1.02 }}
            >
                {/* Card Header */}
                <div className="device-card-header">
                    <div className="device-icon">
                        {isLockdown ? (
                            <Lock size={32} className="lock-icon" />
                        ) : (
                            <Monitor size={32} />
                        )}
                    </div>
                    <div className="device-info">
                        <h3 className="device-label">{getLabel()}</h3>
                        <span className="device-id">{id}</span>
                    </div>
                </div>

                {/* Card Body */}
                <div className="device-card-body">
                    <div className="agent-id">
                        <span className="label">Agent ID</span>
                        <span className="value">{agentId}</span>
                    </div>

                    {/* Status Badge */}
                    <div className={`status-badge ${status}`}>
                        {status === 'healthy' && '● Online'}
                        {status === 'threat' && '◉ THREAT DETECTED'}
                        {status === 'offline' && '○ Syncing...'}
                    </div>
                </div>

                {/* Global Purge Button */}
                <motion.button
                    className="purge-button"
                    onClick={handlePurge}
                    disabled={isPurging || isLockdown}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <RotateCcw size={16} className={isPurging ? 'spinning' : ''} />
                    {isPurging ? 'Purging...' : 'Global Purge'}
                </motion.button>

                {/* Heartbeat Pulse */}
                <HeartbeatPulse status={status} />

                {/* Lockdown Overlay */}
                {isLockdown && (
                    <motion.div
                        className="lockdown-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Lock size={48} />
                        <span>LOCKED</span>
                    </motion.div>
                )}

                {/* Hover Glow Effect */}
                <motion.div
                    className="card-glow"
                    animate={{
                        opacity: isHovered && !isLockdown ? 0.6 : 0,
                        boxShadow: isHovered && !isLockdown
                            ? '0 0 40px rgba(0, 242, 255, 0.4), inset 0 0 20px rgba(0, 242, 255, 0.1)'
                            : 'none'
                    }}
                    transition={{ duration: 0.3 }}
                />
            </motion.div>
        </motion.div>
    );
}
