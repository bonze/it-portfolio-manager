import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

async function testTables() {
    try {
        // Test users table
        console.log('Testing users table...');
        let response = await fetch(`${SUPABASE_URL}/rest/v1/users?select=*`, {
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
            }
        });
        console.log('Users table - Status:', response.status);
        console.log('Users table - Response:', await response.text());

        // Test test_table
        console.log('\nTesting test_table...');
        response = await fetch(`${SUPABASE_URL}/rest/v1/test_table?select=*`, {
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
            }
        });
        console.log('Test table - Status:', response.status);
        console.log('Test table - Response:', await response.text());

    } catch (e) {
        console.error('Error:', e);
    }
}

testTables();
