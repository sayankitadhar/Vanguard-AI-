import { motion } from 'framer-motion';
import { ShieldAlert, ShieldCheck } from 'lucide-react';

interface GlobalLockdownToggleProps {
    isActive: boolean;
    onToggle: () => void;
}

export function GlobalLockdownToggle({ isActive, onToggle }: GlobalLockdownToggleProps) {
    return (
        <motion.div
            className={`global-lockdown-container ${isActive ? 'active' : ''}`}
            animate={{
                backgroundColor: isActive ? 'rgba(255, 0, 0, 0.2)' : 'rgba(30, 0, 50, 0.7)'
            }}
        >
            <div className="lockdown-info">
                <motion.div
                    animate={isActive ? {
                        scale: [1, 1.2, 1],
                        transition: { duration: 0.5, repeat: Infinity }
                    } : {}}
                >
                    {isActive ? (
                        <ShieldAlert size={32} className="lockdown-icon active" />
                    ) : (
                        <ShieldCheck size={32} className="lockdown-icon" />
                    )}
                </motion.div>
                <div className="lockdown-text">
                    <h3>{isActive ? 'GLOBAL LOCKDOWN ACTIVE' : 'Global Shield'}</h3>
                    <p>{isActive ? 'All devices are locked. Click to release.' : 'Click to engage emergency lockdown.'}</p>
                </div>
            </div>

            <motion.button
                className={`lockdown-toggle ${isActive ? 'active' : ''}`}
                onClick={onToggle}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <motion.div
                    className="toggle-slider"
                    animate={{
                        x: isActive ? 32 : 0,
                        backgroundColor: isActive ? '#ff3333' : '#00ff00'
                    }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
            </motion.button>

            {/* Alert Pulse Animation when active */}
            {isActive && (
                <motion.div
                    className="lockdown-pulse"
                    animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 0, 0.5]
                    }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                />
            )}
        </motion.div>
    );
}
