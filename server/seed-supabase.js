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
            console.log('Users already exist. Skipping seed...');
            console.log('If you want to reset users, delete them manually in Supabase dashboard first.');
            return;
        }

        // Only seed if DEFAULT_ADMIN_PASSWORD is set
        const defaultPassword = process.env.DEFAULT_ADMIN_PASSWORD;

        if (!defaultPassword) {
            console.error('❌ DEFAULT_ADMIN_PASSWORD environment variable is not set!');
            console.log('Please set DEFAULT_ADMIN_PASSWORD in your .env file before running this script.');
            console.log('Example: DEFAULT_ADMIN_PASSWORD=your_secure_password');
            return;
        }

        console.log('Hashing passwords...');
        const adminPass = await bcrypt.hash(defaultPassword, 10);
        const opPass = await bcrypt.hash(defaultPassword, 10);
        const userPass = await bcrypt.hash(defaultPassword, 10);

        console.log('Inserting users...');
        const { data, error } = await supabase
            .from('users')
            .insert([
                { username: 'admin', password: adminPass, role: 'admin', isActive: true },
                { username: 'operator', password: opPass, role: 'operator', isActive: true },
                { username: 'user', password: userPass, role: 'user', isActive: true }
            ])
            .select();

        if (error) {
            console.error('Error inserting users:', error);
        } else {
            console.log('✅ Successfully seeded users:', data);
            console.log('\n⚠️  SECURITY WARNING:');
            console.log('All users have been created with the same password from DEFAULT_ADMIN_PASSWORD');
            console.log('Please change passwords immediately after first login!');
            console.log('\nDefault usernames: admin, operator, user');
        }

    } catch (e) {
        console.error('Seeding failed:', e);
    }
}

seedUsers();
