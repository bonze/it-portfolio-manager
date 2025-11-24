import { supabase } from './supabase.js';
import bcrypt from 'bcryptjs';

console.log('Testing direct SQL insert...');

async function testInsert() {
    try {
        // Hash passwords
        const adminPass = await bcrypt.hash('admin123', 10);
        const opPass = await bcrypt.hash('op123', 10);
        const userPass = await bcrypt.hash('user123', 10);

        console.log('Hashed passwords generated');
        console.log('Admin hash:', adminPass);

        // Try insert using query builder
        console.log('\nAttempting insert...');
        const { data, error } = await supabase
            .from('users')
            .insert([
                { username: 'admin', password: adminPass, role: 'admin' },
                { username: 'operator', password: opPass, role: 'operator' },
                { username: 'user', password: userPass, role: 'user' }
            ])
            .select();

        if (error) {
            console.error('Insert error:', error);
        } else {
            console.log('Insert success! Data:', data);
        }

        // Verify
        console.log('\nVerifying insert...');
        const { data: users, error: selectError } = await supabase
            .from('users')
            .select('*');

        if (selectError) {
            console.error('Select error:', selectError);
        } else {
            console.log('Users in database:', users);
        }

    } catch (e) {
        console.error('Exception:', e);
    }
}

testInsert();
