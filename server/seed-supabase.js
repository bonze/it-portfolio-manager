import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

// Disable SSL verification for corporate proxy
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function seedUsers() {
    try {
        console.log('Checking existing users...');
        const { data: existingUsers, error: selectError } = await supabase
            .from('users')
            .select('username');

        if (selectError) {
            console.error('Error checking users:', selectError);
            return;
        }

        console.log('Existing users:', existingUsers);

        if (existingUsers && existingUsers.length > 0) {
            console.log('Users already exist. Deleting all...');
            const { error: deleteError } = await supabase
                .from('users')
                .delete()
                .neq('id', 0); // Delete all

            if (deleteError) {
                console.error('Error deleting users:', deleteError);
                return;
            }
        }

        console.log('Hashing passwords...');
        const adminPass = await bcrypt.hash('admin123', 10);
        const opPass = await bcrypt.hash('op123', 10);
        const userPass = await bcrypt.hash('user123', 10);

        console.log('Inserting users...');
        const { data, error } = await supabase
            .from('users')
            .insert([
                { username: 'admin', password: adminPass, role: 'admin' },
                { username: 'operator', password: opPass, role: 'operator' },
                { username: 'user', password: userPass, role: 'user' }
            ])
            .select();

        if (error) {
            console.error('Error inserting users:', error);
        } else {
            console.log('✅ Successfully seeded users:', data);
        }

    } catch (e) {
        console.error('Seeding failed:', e);
    }
}

seedUsers();
