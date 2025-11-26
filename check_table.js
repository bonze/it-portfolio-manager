import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing SUPABASE_URL or SUPABASE_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTable() {
    console.log('Checking if user_project_access table exists...');

    try {
        const { data, error } = await supabase
            .from('user_project_access')
            .select('*')
            .limit(1);

        if (error) {
            console.error('Error querying table:', error.message);
            if (error.code === '42P01') { // undefined_table
                console.log('Table does NOT exist.');
            }
        } else {
            console.log('Table exists!');
        }
    } catch (e) {
        console.error('Unexpected error:', e);
    }
}

checkTable();
