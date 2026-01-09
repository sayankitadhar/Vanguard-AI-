import { motion } from 'framer-motion';
import { Activity, Shield, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function BigGreenHeart() {
    return (
        <div className="big-green-heart-container">
            {/* Background */}
            <div className="bgh-background">
                <motion.div className="bg-nebula" />
                <motion.div className="bg-grid" />
            </div>

            {/* Content */}
            <div className="bgh-content">
                {/* Large Pulsing Heart */}
                <motion.div
                    className="giant-heart"
                    animate={{
                        scale: [1, 1.15, 1],
                        filter: [
                            'drop-shadow(0 0 20px rgba(0, 255, 0, 0.4))',
                            'drop-shadow(0 0 60px rgba(0, 255, 0, 0.8))',
                            'drop-shadow(0 0 20px rgba(0, 255, 0, 0.4))'
                        ]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut'
                    }}
                >
                    <Activity size={200} color="#00ff00" strokeWidth={1.5} />
                </motion.div>

                {/* Status Text */}
                <motion.div
                    className="status-text"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <h1>All Systems Operational</h1>
                    <p>Your station is protected by Vanguard AI</p>
                </motion.div>

                {/* Station Info Card */}
                <motion.div
                    className="station-card"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                >
                    <div className="station-header">
                        <Shield size={24} />
                        <h2>Station Status</h2>
                    </div>

                    <div className="station-stats">
                        <div className="stat">
                            <span className="stat-value">99.9%</span>
                            <span className="stat-label">Uptime</span>
                        </div>
                        <div className="stat">
                            <span className="stat-value">0</span>
                            <span className="stat-label">Threats</span>
                        </div>
                        <div className="stat">
                            <span className="stat-value healthy">SECURE</span>
                            <span className="stat-label">Status</span>
                        </div>
                    </div>

                    <div className="station-footer">
                        <span className="last-scan">Last scan: Just now</span>
                        <motion.div
                            className="scan-indicator"
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <span className="pulse-dot" />
                            Monitoring Active
                        </motion.div>
                    </div>
                </motion.div>

                {/* Navigation hint for admins */}
                <motion.div
                    className="admin-hint"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                >
                    <Link to="/admin" className="admin-link">
                        <span>Admin Dashboard</span>
                        <ArrowRight size={16} />
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}
