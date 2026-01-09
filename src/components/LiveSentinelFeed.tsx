import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Info, Shield, Zap } from 'lucide-react';
import { supabase, SecurityEvent } from '../lib/supabaseClient';

interface LiveSentinelFeedProps {
    onEventClick: (event: SecurityEvent) => void;
}

export function LiveSentinelFeed({ onEventClick }: LiveSentinelFeedProps) {
    const [events, setEvents] = useState<SecurityEvent[]>([]);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        // Fetch initial events
        const fetchEvents = async () => {
            const { data, error } = await supabase
                .from('security_events')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(20);

            if (!error && data) {
                setEvents(data);
            }
        };

        fetchEvents();

        // Subscribe to real-time updates
        const channel = supabase
            .channel('security_events_changes')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'security_events'
                },
                (payload) => {
                    const newEvent = payload.new as SecurityEvent;
                    setEvents((prev) => [newEvent, ...prev.slice(0, 19)]);
                }
            )
            .subscribe((status) => {
                setIsConnected(status === 'SUBSCRIBED');
            });

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const getSeverityIcon = (severity: SecurityEvent['severity']) => {
        switch (severity) {
            case 'critical':
                return <AlertTriangle size={16} className="severity-critical" />;
            case 'high':
                return <Zap size={16} className="severity-high" />;
            case 'medium':
                return <Shield size={16} className="severity-medium" />;
            default:
                return <Info size={16} className="severity-low" />;
        }
    };

    const formatTime = (timestamp: string) => {
        return new Date(timestamp).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    return (
        <div className="live-feed-container">
            <div className="feed-header">
                <h2>
                    <Shield size={20} />
                    Live Sentinel Feed
                </h2>
                <div className={`connection-status ${isConnected ? 'connected' : ''}`}>
                    <span className="status-dot" />
                    {isConnected ? 'LIVE' : 'CONNECTING...'}
                </div>
            </div>

            <div className="feed-list">
                <AnimatePresence mode="popLayout">
                    {events.length === 0 ? (
                        <motion.div
                            className="no-events"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <Shield size={48} />
                            <p>No security events detected. Systems nominal.</p>
                        </motion.div>
                    ) : (
                        events.map((event, index) => (
                            <motion.div
                                key={event.id}
                                className={`feed-item severity-${event.severity}`}
                                initial={{ opacity: 0, x: -20, height: 0 }}
                                animate={{ opacity: 1, x: 0, height: 'auto' }}
                                exit={{ opacity: 0, x: 20, height: 0 }}
                                transition={{ delay: index * 0.05 }}
                                layout
                            >
                                <div className="event-icon">
                                    {getSeverityIcon(event.severity)}
                                </div>
                                <div className="event-details">
                                    <div className="event-header">
                                        <span className="event-type">{event.event_type}</span>
                                        <span className="event-time">{formatTime(event.created_at)}</span>
                                    </div>
                                    <p className="event-description">{event.description}</p>
                                    <span className="event-agent">Agent: {event.agent_id}</span>
                                </div>
                                <motion.button
                                    className="ai-insight-btn"
                                    onClick={() => onEventClick(event)}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <Zap size={14} />
                                    AI Insight
                                </motion.button>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
