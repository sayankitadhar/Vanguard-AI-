import { motion } from 'framer-motion';
import { Building2, GraduationCap, Landmark } from 'lucide-react';
import type { SectorType } from './DeviceCard';

interface SectorSelectorProps {
    value: SectorType;
    onChange: (sector: SectorType) => void;
}

const sectors: { value: SectorType; label: string; icon: React.ReactNode }[] = [
    { value: 'clinic', label: 'Clinic Station', icon: <Building2 size={18} /> },
    { value: 'classroom', label: 'Classroom PC', icon: <GraduationCap size={18} /> },
    { value: 'csc', label: 'CSC Kiosk', icon: <Landmark size={18} /> }
];

export function SectorSelector({ value, onChange }: SectorSelectorProps) {
    return (
        <div className="sector-selector">
            <span className="sector-label">Sector:</span>
            <div className="sector-options">
                {sectors.map((sector) => (
                    <motion.button
                        key={sector.value}
                        className={`sector-option ${value === sector.value ? 'active' : ''}`}
                        onClick={() => onChange(sector.value)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {sector.icon}
                        <span>{sector.label}</span>
                        {value === sector.value && (
                            <motion.div
                                className="active-indicator"
                                layoutId="sectorIndicator"
                                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            />
                        )}
                    </motion.button>
                ))}
            </div>
        </div>
    );
}
