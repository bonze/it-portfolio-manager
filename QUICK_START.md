# 🚀 Hướng Dẫn Nhanh - Push Code Lên GitHub

## ⚠️ QUAN TRỌNG - ĐỌC TRƯỚC KHI PUSH!

File `server/.env` chứa thông tin nhạy cảm của bạn đã được xóa khỏi Git tracking.
File này vẫn tồn tại trên máy local của bạn (để chạy local nếu cần), nhưng sẽ KHÔNG được push lên GitHub.

## ✅ Các Thay Đổi Đã Thực Hiện

1. ✅ Loại bỏ tất cả hardcoded passwords
2. ✅ Cập nhật .gitignore để bảo vệ thông tin nhạy cảm
3. ✅ Xóa server/.env khỏi Git tracking
4. ✅ Tạo GitHub Actions workflow cho auto-deploy
5. ✅ Tạo tài liệu hướng dẫn đầy đủ

## 📋 Checklist Trước Khi Push

### Bước 1: Kiểm tra Git Status
```bash
git status
```

**Đảm bảo**:
- ❌ `server/.env` KHÔNG xuất hiện trong danh sách
- ❌ `portfolio.db` KHÔNG xuất hiện trong danh sách
- ✅ Chỉ có các file code và tài liệu

### Bước 2: Review Các File Sẽ Commit
```bash
# Xem các file đã thay đổi
git diff

# Xem các file mới
git status
```

### Bước 3: Add và Commit
```bash
# Add tất cả các thay đổi
git add .

# Commit với message rõ ràng
git commit -m "feat: remove sensitive data and setup CI/CD

- Remove hardcoded passwords from all seeding functions
- Add environment variable support for credentials
- Setup GitHub Actions for auto-deploy to Vercel
- Add comprehensive security documentation
- Update .gitignore to protect sensitive files
- Remove server/.env from Git tracking"
```

### Bước 4: Push Lên GitHub
```bash
git push origin main
```

## 🔧 Setup Sau Khi Push

### 1. Setup GitHub Secrets (BẮT BUỘC cho auto-deploy)

Vào: `https://github.com/[username]/[repo]/settings/secrets/actions`

Thêm 3 secrets:

#### a. VERCEL_TOKEN
```
1. Vào https://vercel.com/account/tokens
2. Tạo token mới
3. Copy và paste vào GitHub Secret
```

#### b. VERCEL_ORG_ID và VERCEL_PROJECT_ID
```
Cách 1: Từ Vercel Dashboard
- Vào project → Settings → General
- Copy Project ID và Org ID

Cách 2: Từ file .vercel/project.json (nếu có)
```

**Chi tiết**: Xem file `GITHUB_ACTIONS_SETUP.md`

### 2. Kiểm Tra Vercel Environment Variables

Vào: `https://vercel.com/[username]/[project]/settings/environment-variables`

**Đảm bảo có**:
- ✅ `SUPABASE_URL`
- ✅ `SUPABASE_KEY`
- ✅ `NODE_ENV=production`

**KHÔNG thêm**:
- ❌ `DEFAULT_ADMIN_PASSWORD` (chỉ dùng local!)

### 3. Xem Deployment

Sau khi push:
1. Vào `https://github.com/[username]/[repo]/actions`
2. Xem workflow "Deploy to Vercel" đang chạy
3. Chờ deployment hoàn thành
4. Truy cập app trên Vercel URL

## 🎯 Workflow Từ Giờ Trở Đi

```
1. Sửa code trên local
2. git add .
3. git commit -m "your message"
4. git push origin main
5. GitHub Actions tự động deploy lên Vercel ✨
```

## 🆘 Nếu Gặp Lỗi

### Lỗi: "server/.env" vẫn xuất hiện trong git status
```bash
# Xóa khỏi tracking
git rm --cached server/.env
git commit -m "Remove .env from tracking"
```

### Lỗi: GitHub Actions failed
```bash
# Kiểm tra:
1. GitHub Secrets đã được thiết lập chưa?
2. Vercel Environment Variables đã đủ chưa?
3. Xem logs trong GitHub Actions tab
```

### Lỗi: Deployment failed trên Vercel
```bash
# Kiểm tra:
1. Vercel Environment Variables
2. Vercel deployment logs
3. Build logs trong GitHub Actions
```

## 📚 Tài Liệu Tham Khảo

- `CHANGELOG_SECURITY.md` - Tóm tắt tất cả thay đổi
- `GITHUB_ACTIONS_SETUP.md` - Hướng dẫn setup GitHub Actions chi tiết
- `SECURITY.md` - Best practices bảo mật
- `README.md` - Tài liệu dự án tổng quan

## ✅ Sẵn Sàng Push!

Nếu bạn đã:
- [x] Đọc và hiểu hướng dẫn này
- [x] Kiểm tra `git status` - không có file nhạy cảm
- [x] Review các thay đổi với `git diff`
- [x] Chuẩn bị setup GitHub Secrets sau khi push

Thì bạn có thể push code lên GitHub ngay bây giờ:

```bash
git add .
git commit -m "feat: remove sensitive data and setup CI/CD"
git push origin main
```

🎉 **Chúc mừng! Bạn đã hoàn thành việc bảo mật dự án!**
