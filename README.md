# Dynamic Form Management System - Backend API

Chào mừng bạn đến với Backend của hệ thống **Dynamic Form Management**. Hệ thống này được thiết kế và xây dựng dựa trên nguyên tắc **Clean Architecture**, mang lại một cấu trúc code rõ ràng, dễ bảo trì và khả năng mở rộng tuyệt vời.

## 🚀 Công nghệ sử dụng (Tech Stack)

- **Framework:** NestJS (Node.js)
- **Ngôn ngữ:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma ORM
- **Authentication:** JWT (JSON Web Token) & Passport
- **Mật khẩu:** bcrypt

## 🛠 Kiến trúc Hệ Thống

Hệ thống tuân thủ chặt chẽ **Clean Architecture**, chia thành 3 layer chính để tách biệt hoàn toàn business logic khỏi các công nghệ database hay framework bên ngoài:

1. **Core (Domain & Use Cases):** Chứa các thực thể (Entities), interface của repository, logic nghiệp vụ (Use Cases) và pattern thiết kế (như Strategy pattern cho Validation). Nó không phụ thuộc vào bất kỳ framework hay thư viện bên ngoài nào.
2. **Infrastructure:** Nơi giao tiếp với thế giới bên ngoài, chịu trách nhiệm triển khai (implement) các interface từ Core (ví dụ: Prisma Repositories kết nối tới PostgreSQL).
3. **Presentation:** Layer giao tiếp HTTP, chứa các Controllers, DTOs (Data Transfer Objects), Guards (xác thực & phân quyền JWT), Filters và Interceptors.

## 📦 Hướng dẫn cài đặt và chạy hệ thống

### 1. Yêu cầu môi trường

- **Node.js**: v18.x hoặc cao hơn.
- **PostgreSQL**: Đã cài đặt và đang chạy một database trống.

### 2. Cài đặt Dependencies

Mở terminal tại thư mục gốc của project (backend) và chạy:

```bash
npm install
```

### 3. Cấu hình biến môi trường

Tạo file `.env` ở thư mục gốc (ngang hàng với `package.json`) và điền các thông số kết nối Database và JWT:

```env
# Chuỗi kết nối tới PostgreSQL của bạn (Sửa lại user, password và db_name cho phù hợp)
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/dynamic_form_db?schema=public"

# Chuỗi bí mật dùng để mã hóa JWT (Có thể điền bất kỳ)
JWT_SECRET="super-secret-jwt-key"
```

### 4. Khởi tạo Database và Dữ liệu mẫu (Migration)

Để giúp quá trình test dễ dàng nhất, hệ thống đã được cấu hình sẵn Prisma Migrate tích hợp Dữ liệu mẫu (Seed Data). Bạn chỉ cần chạy **duy nhất một lệnh sau**:

```bash
npx prisma migrate dev
```

_(Lệnh này sẽ tự động tạo cấu trúc toàn bộ các bảng trong database và tự động insert tài khoản Admin, các Role, Permission cơ bản)._

**Tài khoản Admin mặc định để test:**

- **Tên đăng nhập:** `admin`
- **Mật khẩu:** `123456`

### 5. Chạy Application

Sau khi đã cài đặt xong, bạn khởi động server bằng lệnh:

```bash
npm run start:dev
```

Server backend sẽ chạy tại: `http://localhost:3000`
- **Tài liệu API (Swagger UI Docs)**: `http://localhost:3000/api/docs`

---

## 🗄 Thiết Kế Cơ Sở Dữ Liệu (Database Schema)

Hệ thống được thiết kế với chuẩn RBAC (Role-Based Access Control) để quản lý phân quyền và các bảng độc lập cho form động.

### 1. Khối Phân Quyền & Người Dùng (RBAC)

- **`users`**: Lưu trữ thông tin người dùng (`id`, `username`, `email`, `password_hash`, `is_active`).
- **`roles`**: Lưu trữ các vai trò trong hệ thống (VD: `admin`, `employee`).
- **`permissions`**: Bảng danh sách các quyền hạn thao tác cụ thể (VD: `CREATE_FORM`, `SUBMIT_FORM`, `VIEW_SUBMISSIONS`).
- **`user_roles`**: Bảng trung gian n-n nối User và Role.
- **`role_permissions`**: Bảng trung gian n-n nối Role và Permission.

### 2. Khối Quản Lý Form Động (Dynamic Forms)

- **`forms`**: Lưu trữ thông tin chung của biểu mẫu.
  - `title`, `description`, `order`, `status` (active/draft).
  - Liên kết 1-n với `fields` và `submissions`.
- **`fields`**: Lưu trữ các trường câu hỏi linh hoạt bên trong 1 form.
  - `type`: Định dạng câu hỏi (text, number, date, color, select).
  - `options`: Lưu (dưới dạng JSON) danh sách option nếu type là `select`.
  - `validation`: Lưu (dưới dạng JSON) các ràng buộc động (ví dụ: `min`, `max`, `minLength`, `maxLength`, `minDate`, `maxDate`).
  - `is_required`, `order`: Thứ tự và ràng buộc bắt buộc.
- **`submissions`**: Lưu trữ lịch sử điền form của nhân viên.
  - `answers`: Lưu toàn bộ câu trả lời dưới dạng JSON, giúp tối ưu hóa việc query và lưu trữ dữ liệu động (schema-less) một cách linh hoạt.

## 💡 Điểm Nổi Bật (Highlights)

- **Strategy Pattern Validation**: Toàn bộ logic kiểm tra tính hợp lệ của câu trả lời (Validation rules) được tách bạch hoàn toàn ra khỏi Controller hay Use Case thông qua `ValidationFactory` và các `Validator` riêng lẻ (như `NumberValidator`, `DateValidator`,...). Điều này cho phép mở rộng vô hạn các loại field mới trong tương lai mà không cần chạm vào code cũ (Open/Closed Principle).
- **Hoàn toàn động (Fully Dynamic)**: Mọi điều kiện về UI/UX và Validation (ngày nhỏ nhất/lớn nhất, giá trị max/min) được truyền mượt mà từ DB thông qua API xuống Frontend HTML5 Validation một cách đồng nhất.

## 📊 Định Dạng Phản Hồi API (API Response Formats)

Hệ thống thống nhất cấu trúc phản hồi dữ liệu cho mọi API để Frontend dễ dàng tích hợp và xử lý lỗi tập trung:

### 1. Phản Hồi Thành Công Đơn Lẻ (Success Response)
```json
{
  "success": true,
  "statusCode": 200,
  "timestamp": "2026-07-14T13:03:30.000Z",
  "message": "Thành công",
  "data": {
    "id": "uuid-cua-doi-tuong"
  }
}
```

### 2. Phản Hồi Thành Công Phân Trang (Paginated Response)
```json
{
  "success": true,
  "statusCode": 200,
  "timestamp": "2026-07-14T13:03:31.000Z",
  "message": "Lấy danh sách thành công",
  "data": [],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

### 3. Phản Hồi Lỗi Hệ Thống & Nghiệp Vụ (Error Response)
Được xử lý tập trung bởi bộ lọc exception toàn cục (`AllExceptionsFilter`):
```json
{
  "success": false,
  "statusCode": 400,
  "timestamp": "2026-07-14T13:03:33.000Z",
  "errorCode": "VALIDATION_ERROR",
  "message": "Thứ tự (order) trong danh sách không được trùng lặp",
  "errors": [
    "Thứ tự (order) trong danh sách không được trùng lặp"
  ]
}
```
- **`errorCode`**: Định danh mã lỗi dạng chuỗi (ví dụ: `VALIDATION_ERROR`, `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `INTERNAL_SERVER_ERROR`).
- **`errors`**: Mảng chi tiết chứa tất cả các lỗi nếu có (đặc biệt hữu ích khi validate nhiều trường ở DTO).

---

## 🔄 Định Hướng Phát Triển & Khả Năng Thích Ứng (Developer Mindset & Adaptability)

### 💡 Tuyên bố kỹ thuật (Technical Statement)
Tôi có định hướng làm **NodeJS** vì đây là mảng công nghệ tôi tự tin và có nền tảng vững chắc nhất. Tuy nhiên, nếu được tham gia vào công ty, với kiến thức chuyên sâu về **Clean Architecture**, **Dependency Injection (DI)**, và **Tư duy hướng đối tượng (OOP)** sẵn có của mình (được thể hiện rõ qua cấu trúc của dự án NestJS này), tôi hoàn toàn sẵn sàng học và làm chủ nhanh chóng framework **PHP Laravel** của công ty một cách nhanh nhẹn và hiệu quả nhất.

### 🗺 Bảng ánh xạ kiến trúc NestJS sang PHP Laravel

Để minh họa cho khả năng chuyển đổi tư duy, dưới đây là cách ánh xạ các thành phần kiến trúc từ dự án NestJS hiện tại sang Laravel tương đương:

| NestJS (Dự án hiện tại) | Laravel (Tương đương) | Vai trò & Cách triển khai trong Laravel |
| :--- | :--- | :--- |
| **Controller** (`FormController`) | **Controller** (`FormController`) | HTTP Request Handlers. Định nghĩa route tại `routes/api.php` thay vì decorator. |
| **DTO / Validation** (`CreateFormRequestDto`) | **Form Request** (`StoreFormRequest`) | Quản lý validation tập trung thông qua hàm `rules()`. |
| **Use Case** (`CreateFormUseCase`) | **Service / Action** (`CreateFormAction`) | Class đơn nhiệm xử lý logic nghiệp vụ cụ thể. |
| **Repository (Interface + Prisma)** | **Eloquent ORM + Repository** | Sử dụng Model Eloquent (Active Record) để tương tác DB và bind qua Service Provider. |
| **NestJS Module** (`FormModule`) | **Service Provider** (`FormServiceProvider`) | Nơi quản lý Dependency Injection (DI) & Binding Interface. |
| **Guard & Decorator** (`JwtAuthGuard`) | **Middleware** (`auth:sanctum`, `permission`) | Chốt chặn phân quyền & bảo mật HTTP request. |

### 🛠 Các điểm tương đồng kỹ thuật nổi bật
- **JSON Column Casting**: Cột `answers` và `validation` trong PostgreSQL (dạng JSON) tương thích với Eloquent qua `protected $casts = ['validation' => 'array'];`.
- **Database Transaction**: Tính năng cập nhật hàng loạt thứ tự (batch update orders) sử dụng `DB::transaction()` của Laravel để đảm bảo tính toàn vẹn dữ liệu.
- **Dependency Injection (DI)**: Laravel tự động phân giải (auto-wiring) các dependencies khai báo ở Constructor của Controller/Action thông qua Service Container tương tự NestJS.
