import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Activity } from 'lucide-react';
import { DeviceCard, SectorType, DeviceStatus } from '../components/DeviceCard';
import { SectorSelector } from '../components/SectorSelector';
import { GlobalLockdownToggle } from '../components/GlobalLockdownToggle';
import { LiveSentinelFeed } from '../components/LiveSentinelFeed';
import { AIInsightModal } from '../components/AIInsightModal';
import { supabase, SecurityEvent, SecurityLog } from '../lib/supabaseClient';

// Mock device data - in production, fetch from Supabase
const mockDevices = [
    { id: 'DEV-001', agentId: 'agent-alpha-001' },
    { id: 'DEV-002', agentId: 'agent-beta-002' },
    { id: 'DEV-003', agentId: 'agent-gamma-003' },
    { id: 'DEV-004', agentId: 'agent-delta-004' },
    { id: 'DEV-005', agentId: 'agent-epsilon-005' },
    { id: 'DEV-006', agentId: 'agent-zeta-006' },
    { id: 'DEV-007', agentId: 'agent-eta-007' },
    { id: 'DEV-008', agentId: 'agent-theta-008' },
    { id: 'DEV-009', agentId: 'agent-iota-009' },
];

export function ClinicAdminDashboard() {
    const [sector, setSector] = useState<SectorType>('clinic');
    const [isLockdown, setIsLockdown] = useState(false);
    const [deviceStatuses, setDeviceStatuses] = useState<Record<string, DeviceStatus>>({});
    const [selectedEvent, setSelectedEvent] = useState<SecurityEvent | null>(null);

    // Fetch and subscribe to security logs for device statuses
    useEffect(() => {
        const fetchStatuses = async () => {
            const { data, error } = await supabase
                .from('security_logs')
                .select('*')
                .order('created_at', { ascending: false });

            if (!error && data) {
                const statusMap: Record<string, DeviceStatus> = {};

                data.forEach((log: SecurityLog) => {
                    if (!statusMap[log.agent_id]) {
                        if (log.threat_status === 'pending' || log.event_type === 'honey_pot') {
                            statusMap[log.agent_id] = 'threat';
                        } else if (log.event_type === 'offline_sync') {
                            statusMap[log.agent_id] = 'offline';
                        } else {
                            statusMap[log.agent_id] = 'healthy';
                        }
                    }
                });

                setDeviceStatuses(statusMap);
            }
        };

        fetchStatuses();

        // Real-time subscription
        const channel = supabase
            .channel('security_logs_changes')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'security_logs' },
                (payload) => {
                    const log = payload.new as SecurityLog;
                    setDeviceStatuses((prev) => {
                        let status: DeviceStatus = 'healthy';
                        if (log.threat_status === 'pending' || log.event_type === 'honey_pot') {
                            status = 'threat';
                        } else if (log.event_type === 'offline_sync') {
                            status = 'offline';
                        }
                        return { ...prev, [log.agent_id]: status };
                    });
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const getDeviceStatus = (agentId: string): DeviceStatus => {
        return deviceStatuses[agentId] || 'healthy';
    };

    const handlePurge = (agentId: string) => {
        console.log('Purge initiated for:', agentId);
        // Status will update via real-time subscription
    };

    return (
        <div className={`admin-dashboard ${isLockdown ? 'lockdown-active' : ''}`}>
            {/* Animated Background */}
            <div className="dashboard-bg">
                <motion.div className="bg-nebula" />
                <motion.div className="bg-grid" />
                {isLockdown && <div className="bg-alert-overlay" />}
            </div>

            {/* Header */}
            <header className="dashboard-header">
                <div className="header-brand">
                    <motion.div
                        animate={{
                            scale: [1, 1.1, 1],
                            filter: [
                                'drop-shadow(0 0 5px #00ff00)',
                                'drop-shadow(0 0 15px #00ff00)',
                                'drop-shadow(0 0 5px #00ff00)'
                            ]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <Activity size={32} color="#00ff00" />
                    </motion.div>
                    <h1>Vanguard AI</h1>
                    <span className="header-subtitle">Anti-Gravity Command Center</span>
                </div>

                <SectorSelector value={sector} onChange={setSector} />
            </header>

            {/* Global Lockdown Control */}
            <GlobalLockdownToggle
                isActive={isLockdown}
                onToggle={() => setIsLockdown(!isLockdown)}
            />

            {/* Device Grid */}
            <main className="device-grid-container">
                <div className="grid-header">
                    <Shield size={20} />
                    <h2>Device Grid</h2>
                    <span className="device-count">{mockDevices.length} Devices</span>
                </div>

                <motion.div
                    className="device-grid"
                    layout
                >
                    {mockDevices.map((device, index) => (
                        <DeviceCard
                            key={device.id}
                            id={device.id}
                            agentId={device.agentId}
                            index={index}
                            sector={sector}
                            status={getDeviceStatus(device.agentId)}
                            isLockdown={isLockdown}
                            onPurge={handlePurge}
                        />
                    ))}
                </motion.div>
            </main>

            {/* Live Sentinel Feed */}
            <section className="sentinel-section">
                <LiveSentinelFeed onEventClick={setSelectedEvent} />
            </section>

            {/* AI Insight Modal */}
            <AIInsightModal
                event={selectedEvent}
                onClose={() => setSelectedEvent(null)}
            />
        </div>
    );
}
