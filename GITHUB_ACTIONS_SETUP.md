# GitHub Actions & Vercel Deployment Setup

Dự án này sử dụng GitHub Actions để tự động deploy lên Vercel mỗi khi bạn push code lên GitHub.

## Bước 1: Chuẩn bị Vercel

1. Đăng nhập vào [Vercel](https://vercel.com)
2. Vào **Settings** → **Tokens**
3. Tạo một **Access Token** mới và lưu lại (đây là `VERCEL_TOKEN`)

## Bước 2: Lấy Vercel Project ID và Org ID

### Cách 1: Từ Vercel Dashboard
1. Vào project của bạn trên Vercel
2. Vào **Settings** → **General**
3. Tìm **Project ID** (ví dụ: `prj_xxxxxxxxxxxxx`)
4. Tìm **Team ID** hoặc **Org ID** (ví dụ: `team_xxxxxxxxxxxxx`)

### Cách 2: Từ file .vercel/project.json (nếu đã deploy qua CLI)
```json
{
  "orgId": "team_xxxxxxxxxxxxx",
  "projectId": "prj_xxxxxxxxxxxxx"
}
```

## Bước 3: Thiết lập GitHub Secrets

1. Vào repository GitHub của bạn
2. Vào **Settings** → **Secrets and variables** → **Actions**
3. Thêm các secrets sau:

   - `VERCEL_TOKEN`: Token bạn đã tạo ở Bước 1
   - `VERCEL_ORG_ID`: Org ID từ Bước 2
   - `VERCEL_PROJECT_ID`: Project ID từ Bước 2

## Bước 4: Thiết lập Environment Variables trên Vercel

1. Vào project Vercel của bạn
2. Vào **Settings** → **Environment Variables**
3. Thêm các biến sau:

   - `SUPABASE_URL`: URL của Supabase project
   - `SUPABASE_KEY`: Service role key của Supabase
   - `NODE_ENV`: `production`

   **LƯU Ý**: KHÔNG thêm `DEFAULT_ADMIN_PASSWORD` vào Vercel (rủi ro bảo mật)

## Bước 5: Push code lên GitHub

Sau khi thiết lập xong, mỗi khi bạn push code lên branch `main` hoặc `master`:

```bash
git add .
git commit -m "Your commit message"
git push origin main
```

GitHub Actions sẽ tự động:
1. Build project
2. Deploy lên Vercel
3. Thông báo kết quả trong tab **Actions** của repository

## Kiểm tra deployment

- Xem quá trình deployment tại: `https://github.com/[username]/[repo]/actions`
- Xem kết quả trên Vercel Dashboard
- Truy cập ứng dụng tại URL Vercel của bạn

## Troubleshooting

### Lỗi "VERCEL_TOKEN not found"
- Kiểm tra lại bạn đã thêm đúng tên secret trong GitHub

### Lỗi "Project not found"
- Kiểm tra lại `VERCEL_PROJECT_ID` và `VERCEL_ORG_ID`

### Build failed
- Kiểm tra logs trong GitHub Actions
- Đảm bảo code build thành công local: `npm run build`

## Tắt tính năng tự động deploy

Nếu bạn muốn tạm thời tắt auto-deploy:
1. Vào `.github/workflows/deploy.yml`
2. Comment hoặc xóa file này
3. Push lên GitHub
