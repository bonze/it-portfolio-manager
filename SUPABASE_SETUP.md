# Hướng dẫn cập nhật Supabase Database

## Bước 1: Chạy SQL Schema trên Supabase

1. Truy cập Supabase Dashboard: https://supabase.com/dashboard
2. Chọn project: **wrpkxusjrvbffgccrjqf**
3. Vào **SQL Editor** (menu bên trái)
4. Copy toàn bộ nội dung file `server/supabase-setup.sql`
5. Paste vào SQL Editor
6. Click **Run** để thực thi

**File SQL:** [supabase-setup.sql](file:///c:/Users/dungvt1/.gemini/antigravity/scratch/it-portfolio-manager/server/supabase-setup.sql)

## Bước 2: Seed dữ liệu Users

Sau khi chạy SQL schema, chạy script để tạo users mặc định:

```bash
cd server
node seed-supabase.js
```

Script này sẽ tạo 3 users:
- **admin** / admin123 (role: admin, active: true)
- **operator** / op123 (role: operator, active: true)  
- **user** / user123 (role: user, active: true)

## Bước 3: Kiểm tra trên Supabase

1. Vào **Table Editor** trên Supabase
2. Kiểm tra các tables đã được tạo:
   - ✅ users
   - ✅ projects
   - ✅ goals
   - ✅ scopes
   - ✅ deliverables
   - ✅ user_project_access

3. Kiểm tra table `users` có 3 records

## Bước 4: Test trên Vercel

Sau khi Vercel deploy xong:
1. Truy cập https://it-portfolio-manager.vercel.app/
2. Login với admin/admin123
3. Tạo projects, goals, scopes, deliverables
4. Dữ liệu sẽ được lưu trên Supabase

## Lưu ý quan trọng

> [!IMPORTANT]
> - Schema SQL đã bao gồm RLS (Row Level Security) policies
> - Tất cả tables cho phép full access (phù hợp cho demo)
> - Dữ liệu projects/goals/scopes/deliverables sẽ trống ban đầu
> - Users có thể tạo dữ liệu mới qua UI sau khi login

## Nếu cần reset database

Uncomment các dòng DROP TABLE trong file `supabase-setup.sql`:

```sql
DROP TABLE IF EXISTS deliverables CASCADE;
DROP TABLE IF EXISTS scopes CASCADE;
DROP TABLE IF EXISTS goals CASCADE;
DROP TABLE IF EXISTS user_project_access CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS users CASCADE;
```

Sau đó chạy lại toàn bộ SQL script.
