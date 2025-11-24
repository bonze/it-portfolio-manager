import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

// Disable SSL verification
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

console.log('Testing direct REST API...');
console.log('URL:', SUPABASE_URL);
console.log('Key:', SUPABASE_KEY ? 'exists' : 'missing');

async function testRestAPI() {
    try {
        const url = `${SUPABASE_URL}/rest/v1/users?select=*`;
        console.log('\nFetching:', url);

        const response = await fetch(url, {
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            }
        });

        console.log('Status:', response.status);
        console.log('Status Text:', response.statusText);

        const text = await response.text();
        console.log('Response:', text);

        if (response.ok) {
            const data = JSON.parse(text);
            console.log('Parsed data:', data);
        }

    } catch (e) {
        console.error('Error:', e);
    }
}

testRestAPI();
