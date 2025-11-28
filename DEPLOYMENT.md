# 🚀 Deployment - Vercel CI/CD

## ✅ Đã Thiết Lập Sẵn

Dự án này đã được kết nối với Vercel qua GitHub integration. 

**Vercel tự động:**
- ✅ Phát hiện `vite.config.js`
- ✅ Build project khi có push mới
- ✅ Deploy lên production
- ✅ Tạo preview deployments cho pull requests

## 🔄 Workflow Hiện Tại

```
Sửa code → git push origin main
              ↓
        Vercel tự động phát hiện
              ↓
        Build & Deploy
              ✅
```

**Không cần GitHub Actions!** Vercel đã làm tất cả.

## 🔐 Environment Variables

Đảm bảo các biến môi trường đã được thiết lập trên Vercel:

### Vào: Vercel Dashboard → Project Settings → Environment Variables

**Required:**
- ✅ `SUPABASE_URL` - URL của Supabase project
- ✅ `SUPABASE_KEY` - Service role key của Supabase
- ✅ `NODE_ENV` - Set to `production`

**NOT Required:**
- ❌ `DEFAULT_ADMIN_PASSWORD` - Chỉ dùng local, KHÔNG set trên Vercel!

## 📊 Kiểm Tra Deployment

### 1. Xem Deployment History
```
Vercel Dashboard → Deployments
https://vercel.com/bonze/it-portfolio-manager/deployments
```

### 2. Xem Logs
```
Click vào deployment → View Function Logs
```

### 3. Test Deployment
```bash
# Tạo thay đổi nhỏ
echo "# Updated" >> README.md
git add README.md
git commit -m "test: verify auto-deployment"
git push origin main

# Vercel sẽ tự động deploy trong vài giây!
```

## 🎯 Production URL

Sau khi deploy thành công, truy cập:
```
https://it-portfolio-manager.vercel.app
```

Hoặc custom domain nếu bạn đã thiết lập.

## 🔧 Vercel Configuration

File `vercel.json` đã được cấu hình:
```json
{
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

Điều này đảm bảo:
- API routes hoạt động đúng
- SPA routing hoạt động (React Router)

## ⚡ Build Settings

Vercel tự động phát hiện từ `package.json`:

**Build Command:**
```bash
npm run build
```

**Output Directory:**
```
dist
```

**Install Command:**
```bash
npm install
```

## 🆘 Troubleshooting

### Deployment Failed?

1. **Kiểm tra Build Logs:**
   - Vào Vercel Dashboard → Deployments
   - Click vào deployment failed
   - Xem "Build Logs"

2. **Kiểm tra Environment Variables:**
   - Settings → Environment Variables
   - Đảm bảo `SUPABASE_URL` và `SUPABASE_KEY` đã được set

3. **Kiểm tra Function Logs:**
   - Nếu build thành công nhưng API lỗi
   - Xem "Function Logs" để debug

### API Returns 500 Error?

```
Nguyên nhân thường gặp:
- Environment variables chưa được set
- Supabase connection failed
- Database schema chưa được tạo
```

**Giải pháp:**
1. Kiểm tra Vercel Environment Variables
2. Chạy SQL schema trên Supabase: `server/supabase-setup.sql`
3. Kiểm tra Supabase connection string

## 📝 Lưu Ý

### Vercel vs Local

| Môi trường | Database | Environment Variables |
|-----------|----------|----------------------|
| **Local** | SQLite (`portfolio.db`) | `server/.env` |
| **Vercel** | Supabase (PostgreSQL) | Vercel Dashboard |

### Không Cần GitHub Actions

Vercel đã có sẵn CI/CD integration với GitHub:
- ✅ Tự động deploy khi push
- ✅ Preview deployments cho PRs
- ✅ Rollback dễ dàng
- ✅ Environment variables per branch

## 🎉 Hoàn Thành!

Bạn chỉ cần:
1. ✅ Push code lên GitHub
2. ✅ Vercel tự động deploy
3. ✅ Không cần setup gì thêm!

**Đơn giản hơn nhiều so với GitHub Actions!** 🚀
