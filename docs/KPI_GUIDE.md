# Hướng Dẫn Sử Dụng KPI (Key Performance Indicators)

## File Mẫu KPI

Tôi đã tạo file **`kpi_sample.xlsx`** trong thư mục `public/` với 3 sheets:

### 1. **KPI Examples** - Các ví dụ KPI thực tế
Chứa 17 ví dụ KPI cho các loại entity khác nhau trong dự án IT:

#### KPI cấp Project (Dự án)
- **Overall Project Completion**: Tiến độ hoàn thành tổng thể (Target: 100%, Actual: 75%)
- **Budget Utilization**: Tỷ lệ sử dụng ngân sách (Target: 90%, Actual: 85%)
- **Schedule Performance Index (SPI)**: Chỉ số hiệu suất tiến độ (Target: 1.0, Actual: 0.95)
- **Cost Performance Index (CPI)**: Chỉ số hiệu suất chi phí (Target: 1.0, Actual: 1.05)
- **Defect Density**: Mật độ lỗi (Target: 5 defects/KLOC, Actual: 3)
- **Team Productivity**: Năng suất nhóm (Target: 80 points/sprint, Actual: 85)

#### KPI cấp Final Product (Sản phẩm cuối)
- **User Adoption Rate**: Tỷ lệ người dùng chấp nhận (Target: 80%, Actual: 65%)
- **System Uptime**: Thời gian hoạt động hệ thống (Target: 99.9%, Actual: 99.95%)
- **Response Time**: Thời gian phản hồi (Target: 2s, Actual: 1.5s)

#### KPI cấp Phase (Giai đoạn)
- **Phase Completion**: Hoàn thành giai đoạn (Target: 100%, Actual: 90%)
- **Code Coverage**: Độ phủ code test (Target: 80%, Actual: 85%)
- **Test Pass Rate**: Tỷ lệ test pass (Target: 95%, Actual: 92%)

#### KPI cấp Deliverable (Đầu ra)
- **Quality Score**: Điểm chất lượng (Target: 90%, Actual: 88%)
- **Customer Satisfaction**: Sự hài lòng khách hàng (Target: 4.5/5, Actual: 4.7/5)
- **Bug Resolution Time**: Thời gian giải quyết bug (Target: 48h, Actual: 36h)

#### KPI cấp Work Package (Gói công việc)
- **Task Completion Rate**: Tỷ lệ hoàn thành task (Target: 100%, Actual: 95%)
- **Velocity**: Vận tốc (Target: 40 points, Actual: 42 points)

### 2. **Instructions** - Hướng dẫn các trường dữ liệu
Giải thích chi tiết từng cột trong file KPI:
- **Entity Type**: Loại entity (project, final_product, phase, deliverable, work_package)
- **Entity ID**: ID của entity (phải khớp với ID trong hệ thống)
- **KPI Name**: Tên chỉ số KPI
- **Target**: Giá trị mục tiêu
- **Actual**: Giá trị thực tế hiện tại
- **Unit**: Đơn vị đo (%, ratio, hours, points, etc.)
- **Status**: Trạng thái (On Track, At Risk, Ahead, Behind)

### 3. **Common IT KPIs** - Danh sách KPI phổ biến
Tham khảo 17 KPI thường dùng trong dự án IT, phân theo 5 nhóm:

#### Project Management (Quản lý dự án)
- Schedule Performance Index (SPI)
- Cost Performance Index (CPI)
- Budget Variance
- Schedule Variance

#### Quality (Chất lượng)
- Defect Density
- Code Coverage
- Test Pass Rate
- Bug Resolution Time

#### Performance (Hiệu năng)
- System Uptime
- Response Time
- Throughput

#### User Adoption (Chấp nhận người dùng)
- User Adoption Rate
- Customer Satisfaction
- Net Promoter Score (NPS)

#### Team Productivity (Năng suất nhóm)
- Velocity
- Sprint Burndown
- Team Utilization

## Cách Sử Dụng

### Bước 1: Tải file mẫu
File đã được tạo tại: `public/kpi_sample.xlsx`

### Bước 2: Chuẩn bị dữ liệu
1. Mở file Excel
2. Xem sheet "KPI Examples" để tham khảo format
3. Xem sheet "Common IT KPIs" để chọn KPI phù hợp với dự án
4. Thay đổi **Entity ID** để khớp với ID thực tế trong hệ thống của bạn

### Bước 3: Nhập KPI vào hệ thống
Hiện tại có 2 cách:

#### Cách 1: Qua API (Thủ công)
```javascript
// POST /api/kpis
{
  "id": "kpi-uuid",
  "entityType": "project",
  "entityId": "project-001",
  "name": "Code Coverage",
  "target": 80,
  "actual": 85,
  "unit": "%",
  "status": "Ahead"
}
```

#### Cách 2: Import Excel (Cần phát triển thêm)
*Chức năng import KPI từ Excel chưa được implement, cần phát triển thêm tương tự như import project data.*

## Ý Nghĩa Các Chỉ Số Status

- **Ahead** (Vượt trội): Actual > Target (cho KPI càng cao càng tốt) hoặc Actual < Target (cho KPI càng thấp càng tốt)
- **On Track** (Đúng tiến độ): Actual gần bằng Target (trong khoảng ±5%)
- **At Risk** (Có rủi ro): Actual lệch khỏi Target 5-15%
- **Behind** (Chậm tiến độ): Actual lệch khỏi Target > 15%

## Công Thức Tính Một Số KPI Quan Trọng

### Schedule Performance Index (SPI)
```
SPI = Earned Value (EV) / Planned Value (PV)
- SPI > 1.0: Ahead of schedule
- SPI = 1.0: On schedule
- SPI < 1.0: Behind schedule
```

### Cost Performance Index (CPI)
```
CPI = Earned Value (EV) / Actual Cost (AC)
- CPI > 1.0: Under budget
- CPI = 1.0: On budget
- CPI < 1.0: Over budget
```

### Defect Density
```
Defect Density = Total Defects / (Lines of Code / 1000)
Đơn vị: defects per KLOC (thousand lines of code)
```

### Code Coverage
```
Code Coverage = (Lines Covered by Tests / Total Lines of Code) × 100%
```

## Lưu Ý Khi Sử Dụng

1. **Entity ID phải tồn tại**: Đảm bảo Entity ID trong file KPI khớp với ID thực tế trong database
2. **Đơn vị đo phù hợp**: Chọn unit phù hợp với từng KPI (%, ratio, hours, points, etc.)
3. **Cập nhật thường xuyên**: KPI nên được cập nhật định kỳ (hàng tuần/tháng) để theo dõi tiến độ
4. **Chọn KPI phù hợp**: Không cần track tất cả KPI, chỉ chọn những KPI quan trọng với dự án

## Ví Dụ Thực Tế

### Dự án: Xây dựng hệ thống ERP
```
Project KPIs:
- Overall Completion: 65% (Target: 100%)
- Budget Utilization: 70% (Target: 90%)
- Team Velocity: 45 points/sprint (Target: 40)

Final Product KPIs:
- System Uptime: 99.8% (Target: 99.5%)
- User Adoption: 75% (Target: 80%)

Phase KPIs (Development Phase):
- Code Coverage: 82% (Target: 80%)
- Test Pass Rate: 94% (Target: 95%)
```

## Tích Hợp Với Analytics Dashboard

Các KPI này sẽ được hiển thị trong Analytics Dashboard để:
- Theo dõi hiệu suất dự án real-time
- So sánh Target vs Actual
- Cảnh báo các KPI At Risk hoặc Behind
- Tạo báo cáo tổng hợp cho stakeholders
