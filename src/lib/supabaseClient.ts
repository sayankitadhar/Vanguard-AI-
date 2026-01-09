import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types for TypeScript
export interface UserRole {
    id: string;
    user_id: string;
    role: 'clinic_admin' | 'receptionist' | 'technician';
    created_at: string;
}

export interface SecurityLog {
    id: string;
    agent_id: string;
    status: 'active' | 'blocked' | 'pending';
    threat_status: 'none' | 'pending' | 'resolved';
    event_type: 'normal' | 'honey_pot' | 'offline_sync';
    message: string;
    created_at: string;
}

export interface SecurityEvent {
    id: string;
    agent_id: string;
    event_type: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    created_at: string;
}

export interface Snapshot {
    id: string;
    agent_id: string;
    snapshot_data: Record<string, unknown>;
    created_at: string;
}

// Helper function to get user role
export async function getUserRole(userId: string): Promise<string | null> {
    const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

    if (error || !data) {
        console.error('Error fetching user role:', error);
        return null;
    }

    return data.role;
}

// Trigger global purge via Edge Function
export async function triggerGlobalPurge(agentId: string): Promise<{ success: boolean; message: string }> {
    try {
        const { data, error } = await supabase.functions.invoke('global-purge', {
            body: { agent_id: agentId }
        });

        if (error) {
            throw error;
        }

        return data;
    } catch (err) {
        console.error('Global purge failed:', err);
        return { success: false, message: 'Failed to initiate recovery' };
    }
}
