# Security Best Practices

## ✅ Đã Thực Hiện

### 1. Loại Bỏ Thông Tin Nhạy Cảm
- ✅ Xóa hardcoded passwords khỏi source code
- ✅ Sử dụng environment variables cho tất cả thông tin nhạy cảm
- ✅ File `.env` đã được thêm vào `.gitignore`
- ✅ Tạo `.env.example` để hướng dẫn cấu hình

### 2. Bảo Mật Database
- ✅ Supabase credentials chỉ lưu trong environment variables
- ✅ Service role key không bao giờ được commit lên GitHub
- ✅ Database file (SQLite) chỉ dùng cho local development

### 3. Bảo Mật User Authentication
- ✅ Passwords được hash bằng bcrypt (10 rounds)
- ✅ Không có default passwords trong production
- ✅ Default users chỉ được tạo khi có `DEFAULT_ADMIN_PASSWORD` env var

### 4. CI/CD Security
- ✅ GitHub Secrets để lưu Vercel tokens
- ✅ Environment variables riêng biệt cho từng môi trường
- ✅ Không log sensitive information

## 🔒 Checklist Trước Khi Deploy

### Trên Local Machine
- [ ] File `server/.env` chứa credentials thực của bạn
- [ ] File `server/.env` KHÔNG được commit lên Git
- [ ] Database file `portfolio.db` KHÔNG được commit lên Git

### Trên GitHub
- [ ] Repository KHÔNG chứa file `.env`
- [ ] Repository KHÔNG chứa file `.db`
- [ ] GitHub Secrets đã được thiết lập:
  - [ ] `VERCEL_TOKEN`
  - [ ] `VERCEL_ORG_ID`
  - [ ] `VERCEL_PROJECT_ID`

### Trên Vercel
- [ ] Environment Variables đã được thiết lập:
  - [ ] `SUPABASE_URL`
  - [ ] `SUPABASE_KEY`
  - [ ] `NODE_ENV=production`
- [ ] KHÔNG thiết lập `DEFAULT_ADMIN_PASSWORD` (security risk!)

### Trên Supabase
- [ ] Service role key được giữ bí mật
- [ ] Row Level Security (RLS) được cân nhắc cho production
- [ ] Database backups được kích hoạt

## 🚨 Những Gì KHÔNG NÊN LÀM

### ❌ KHÔNG BAO GIỜ:
1. Commit file `.env` lên GitHub
2. Hardcode passwords trong source code
3. Share Supabase service role key công khai
4. Commit database files (`.db`, `.sqlite`) lên Git
5. Log sensitive information (passwords, tokens, keys)
6. Sử dụng default passwords trong production
7. Commit Vercel tokens lên Git

## 🔐 Quản Lý Credentials

### Local Development
```bash
# File: server/.env (KHÔNG commit)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
DEFAULT_ADMIN_PASSWORD=your-local-dev-password
```

### Production (Vercel)
- Thiết lập qua Vercel Dashboard
- Mỗi environment variable riêng biệt
- KHÔNG bao gồm `DEFAULT_ADMIN_PASSWORD`

## 📝 Tạo Admin User Đầu Tiên

### Cách 1: Qua Supabase Dashboard
1. Vào Supabase Dashboard
2. Chọn Table Editor → users
3. Insert row:
   ```
   username: admin
   password: [bcrypt hash của password]
   role: admin
   isActive: true
   ```

### Cách 2: Qua SQL Editor
```sql
-- Tạo hash password trước (sử dụng bcrypt online tool hoặc script)
INSERT INTO users (username, password, role, isActive)
VALUES ('admin', '$2a$10$...your-bcrypt-hash...', 'admin', true);
```

### Cách 3: Qua Registration API (Recommended)
1. Deploy application lên Vercel
2. Sử dụng API endpoint `/api/register`
3. Admin kích hoạt user qua dashboard

## 🔄 Rotate Credentials

Nếu credentials bị lộ:

1. **Supabase Key**:
   - Tạo service role key mới trên Supabase
   - Cập nhật trong Vercel Environment Variables
   - Redeploy application

2. **Vercel Token**:
   - Revoke token cũ trên Vercel
   - Tạo token mới
   - Cập nhật GitHub Secrets

3. **User Passwords**:
   - Reset password qua Supabase dashboard
   - Thông báo cho user

## 📚 Tài Liệu Tham Khảo

- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Supabase Security Best Practices](https://supabase.com/docs/guides/platform/security)
- [GitHub Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [OWASP Security Guidelines](https://owasp.org/www-project-top-ten/)
