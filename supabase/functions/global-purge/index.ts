// Supabase Edge Function: Global Purge
// Deploy this to your Supabase project's edge functions

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PurgeRequest {
    agent_id: string
}

serve(async (req) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            {
                global: {
                    headers: { Authorization: req.headers.get('Authorization')! },
                },
            }
        )

        const { agent_id } = await req.json() as PurgeRequest

        if (!agent_id) {
            return new Response(
                JSON.stringify({ success: false, message: 'agent_id is required' }),
                {
                    status: 400,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                }
            )
        }

        // 1. Fetch the latest snapshot for this agent
        const { data: snapshot, error: snapshotError } = await supabaseClient
            .from('snapshots')
            .select('*')
            .eq('agent_id', agent_id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single()

        if (snapshotError || !snapshot) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: `No snapshot found for agent: ${agent_id}`
                }),
                {
                    status: 404,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                }
            )
        }

        // 2. Create a recovery event log
        const { error: logError } = await supabaseClient
            .from('security_logs')
            .insert({
                agent_id,
                status: 'active',
                threat_status: 'resolved',
                event_type: 'recovery',
                message: `Global purge initiated. Restoring from snapshot ${snapshot.id}`,
            })

        if (logError) {
            console.error('Failed to log recovery event:', logError)
        }

        // 3. Add a security event for the feed
        const { error: eventError } = await supabaseClient
            .from('security_events')
            .insert({
                agent_id,
                event_type: 'RECOVERY_INITIATED',
                severity: 'medium',
                description: `System recovery initiated for ${agent_id}. Snapshot restoration in progress.`,
            })

        if (eventError) {
            console.error('Failed to create security event:', eventError)
        }

        // In production, this is where you would trigger actual recovery mechanisms:
        // - Call external recovery API
        // - Send commands to the agent
        // - Update agent configuration
        // - etc.

        return new Response(
            JSON.stringify({
                success: true,
                message: `Recovery initiated for agent ${agent_id}`,
                snapshot_id: snapshot.id,
                snapshot_created_at: snapshot.created_at
            }),
            {
                status: 200,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
        )

    } catch (error) {
        console.error('Global purge error:', error)
        return new Response(
            JSON.stringify({ success: false, message: 'Internal server error' }),
            {
                status: 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
        )
    }
})
