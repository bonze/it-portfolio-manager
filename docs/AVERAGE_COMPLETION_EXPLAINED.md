# Giải Thích: Cách Tính Average Completion (Tỷ Lệ Hoàn Thành Trung Bình)

## Tổng Quan

**Average Completion** là tỷ lệ phần trăm (%) hoàn thành trung bình của toàn bộ portfolio, được tính dựa trên cấu trúc phân cấp từ dưới lên (bottom-up).

## Cấu Trúc Phân Cấp

```
Project (Dự án)
  └── Final Product (Sản phẩm cuối)
       └── Phase (Giai đoạn)
            └── Deliverable (Đầu ra)
                 └── Work Package (Gói công việc)
```

## Nguyên Tắc Tính Toán

### 1. **Work Package** (Cấp thấp nhất)
- Giá trị completion được **nhập trực tiếp** (0-100%)
- Không cần tính toán, lấy giá trị `status` field

### 2. **Deliverable**
- **Nếu có Work Packages**: Lấy trung bình completion của tất cả Work Packages con
- **Nếu không có Work Packages**: Lấy giá trị `status` field của chính Deliverable

**Công thức**:
```
Deliverable Completion = (WP1 + WP2 + ... + WPn) / n
```

### 3. **Phase**
- Lấy trung bình completion của tất cả Deliverables con
- **Nếu không có Deliverables**: Trả về 0%

**Công thức**:
```
Phase Completion = (Del1 + Del2 + ... + Deln) / n
```

### 4. **Final Product**
- Lấy trung bình completion của tất cả Phases con
- **Nếu không có Phases**: Trả về 0%

**Công thức**:
```
Final Product Completion = (Phase1 + Phase2 + ... + Phasen) / n
```

### 5. **Project**
- Lấy trung bình completion của tất cả Final Products con
- **Nếu không có Final Products**: Trả về 0%

**Công thức**:
```
Project Completion = (FP1 + FP2 + ... + FPn) / n
```

### 6. **Portfolio Average Completion**
- Lấy trung bình completion của tất cả Projects
- Hiển thị trong Analytics Dashboard

**Công thức**:
```
Portfolio Avg Completion = (Project1 + Project2 + ... + Projectn) / n
```

## Ví Dụ Cụ Thể

### Ví Dụ 1: Dự Án Đơn Giản

```
Project: "ERP System"
  └── Final Product: "Customer Module"
       └── Phase: "Development"
            └── Deliverable: "User Interface"
                 ├── WP1: "Login Page" → 100%
                 ├── WP2: "Dashboard" → 80%
                 └── WP3: "Reports" → 60%
```

**Tính toán từ dưới lên**:

1. **Deliverable "User Interface"**:
   ```
   = (100 + 80 + 60) / 3
   = 240 / 3
   = 80%
   ```

2. **Phase "Development"** (chỉ có 1 Deliverable):
   ```
   = 80%
   ```

3. **Final Product "Customer Module"** (chỉ có 1 Phase):
   ```
   = 80%
   ```

4. **Project "ERP System"** (chỉ có 1 Final Product):
   ```
   = 80%
   ```

### Ví Dụ 2: Dự Án Phức Tạp

```
Project: "Digital Transformation"
  ├── Final Product 1: "Mobile App"
  │    ├── Phase 1: "Design" → 100%
  │    └── Phase 2: "Development"
  │         ├── Deliverable 1: "Frontend"
  │         │    ├── WP1 → 100%
  │         │    └── WP2 → 80%
  │         └── Deliverable 2: "Backend"
  │              ├── WP3 → 60%
  │              └── WP4 → 40%
  │
  └── Final Product 2: "Web Portal"
       └── Phase 1: "Planning"
            └── Deliverable 1: "Requirements"
                 └── WP5 → 50%
```

**Tính toán từ dưới lên**:

#### Final Product 1: "Mobile App"

**Phase 2 "Development"**:
- Deliverable 1 "Frontend": (100 + 80) / 2 = **90%**
- Deliverable 2 "Backend": (60 + 40) / 2 = **50%**
- Phase 2 Completion: (90 + 50) / 2 = **70%**

**Final Product 1 Completion**:
```
= (Phase 1 + Phase 2) / 2
= (100 + 70) / 2
= 85%
```

#### Final Product 2: "Web Portal"

**Phase 1 "Planning"**:
- Deliverable 1 "Requirements": 50%
- Phase 1 Completion: **50%**

**Final Product 2 Completion**: **50%**

#### Project "Digital Transformation"

```
= (FP1 + FP2) / 2
= (85 + 50) / 2
= 67.5%
≈ 68% (làm tròn)
```

## Trường Hợp Đặc Biệt

### 1. Entity Không Có Con (Empty Children)
```javascript
// Nếu Phase không có Deliverables
Phase Completion = 0%

// Nếu Deliverable không có Work Packages
Deliverable Completion = Deliverable.status (giá trị nhập trực tiếp)
```

### 2. Một Số Con Có 0% Completion
```
Phase có 3 Deliverables:
- Del1: 100%
- Del2: 50%
- Del3: 0%

Phase Completion = (100 + 50 + 0) / 3 = 50%
```

### 3. Tất Cả Con Đều 0%
```
Phase có 2 Deliverables:
- Del1: 0%
- Del2: 0%

Phase Completion = (0 + 0) / 2 = 0%
```

## Code Implementation

Hàm `calculateCompletion` trong `StoreContext.jsx`:

```javascript
const calculateCompletion = (entityId, type, customData = null) => {
    const parseStatus = (val) => {
        const num = parseInt(val, 10);
        return isNaN(num) ? 0 : num;
    };

    const dataSource = customData || state;

    try {
        // Work Package: Lấy trực tiếp status
        if (type === 'work-package') {
            const wp = dataSource.workPackages.find(w => w.id === entityId);
            return wp ? parseStatus(wp.status) : 0;
        }
        
        // Deliverable: Trung bình Work Packages hoặc status trực tiếp
        if (type === 'deliverable') {
            const relatedWPs = dataSource.workPackages.filter(wp => wp.deliverableId === entityId);
            if (relatedWPs.length === 0) {
                const d = dataSource.deliverables.find(i => i.id === entityId);
                return d ? parseStatus(d.status) : 0;
            }
            const total = relatedWPs.reduce((sum, wp) => sum + parseStatus(wp.status), 0);
            return Math.round(total / relatedWPs.length);
        }
        
        // Phase: Trung bình Deliverables
        if (type === 'phase') {
            const relatedDeliverables = dataSource.deliverables.filter(d => d.phaseId === entityId);
            if (relatedDeliverables.length === 0) return 0;
            const total = relatedDeliverables.reduce((sum, d) => 
                sum + calculateCompletion(d.id, 'deliverable', dataSource), 0);
            return Math.round(total / relatedDeliverables.length);
        }
        
        // Final Product: Trung bình Phases
        if (type === 'final-product') {
            const relatedPhases = dataSource.phases.filter(p => p.finalProductId === entityId);
            if (relatedPhases.length === 0) return 0;
            const total = relatedPhases.reduce((sum, p) => 
                sum + calculateCompletion(p.id, 'phase', dataSource), 0);
            return Math.round(total / relatedPhases.length);
        }
        
        // Project: Trung bình Final Products
        if (type === 'project') {
            const relatedFPs = dataSource.finalProducts.filter(fp => fp.projectId === entityId);
            if (relatedFPs.length === 0) return 0;
            const total = relatedFPs.reduce((sum, fp) => 
                sum + calculateCompletion(fp.id, 'final-product', dataSource), 0);
            return Math.round(total / relatedFPs.length);
        }
    } catch (e) {
        console.error("Error in calculateCompletion:", e);
        return 0;
    }
    return 0;
};
```

## Lưu Ý Quan Trọng

1. **Tính toán đệ quy**: Hàm gọi chính nó để tính completion của các cấp con
2. **Làm tròn**: Kết quả được làm tròn bằng `Math.round()`
3. **Xử lý lỗi**: Nếu có lỗi, trả về 0% thay vì crash
4. **Parse an toàn**: Sử dụng `parseInt()` và kiểm tra `isNaN()` để tránh lỗi
5. **Bottom-up**: Luôn tính từ cấp thấp nhất (Work Package) lên cấp cao nhất (Project)

## Ứng Dụng Trong Analytics Dashboard

Trong Analytics Dashboard, **Average Completion** được tính như sau:

```javascript
const portfolioMetrics = calculatePortfolioMetrics(projects, ...);

// Trong calculatePortfolioMetrics:
averageCompletion: projects.length > 0
    ? Math.round(projects.reduce((sum, p) => sum + (p.completion || 0), 0) / projects.length)
    : 0
```

Giá trị `p.completion` của mỗi project đã được tính sẵn bởi hàm `calculateCompletion` và lưu trong state.

## Biểu Đồ "Average Completion by Status"

Biểu đồ này nhóm các projects theo status và tính trung bình completion cho mỗi nhóm:

```javascript
const completionTrend = getCompletionTrend(projects);

// Kết quả:
[
  { status: "In Progress", avgCompletion: 65, projectCount: 5 },
  { status: "Planning", avgCompletion: 20, projectCount: 3 },
  { status: "Completed", avgCompletion: 100, projectCount: 2 },
  { status: "On Hold", avgCompletion: 45, projectCount: 1 }
]
```

## Tóm Tắt

- **Work Package**: Giá trị nhập trực tiếp (0-100%)
- **Deliverable**: Trung bình Work Packages (hoặc giá trị trực tiếp nếu không có WP)
- **Phase**: Trung bình Deliverables
- **Final Product**: Trung bình Phases
- **Project**: Trung bình Final Products
- **Portfolio**: Trung bình tất cả Projects

Công thức chung: **Completion = Tổng completion của con / Số lượng con**
