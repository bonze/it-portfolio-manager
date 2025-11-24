import { supabase } from './supabase.js';

console.log('Testing Supabase connection...');

async function testConnection() {
    try {
        // Try a simple query
        console.log('\n1. Testing simple select from users:');
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .limit(1);

        if (error) {
            console.error('Error:', error);
        } else {
            console.log('Success! Data:', data);
        }

        // Try to get table info
        console.log('\n2. Testing table existence via RPC:');
        const { data: tables, error: rpcError } = await supabase
            .rpc('get_tables');

        if (rpcError) {
            console.error('RPC Error (expected if function not exists):', rpcError.message);
        } else {
            console.log('Tables:', tables);
        }

    } catch (e) {
        console.error('Connection failed:', e);
    }
}

testConnection();
