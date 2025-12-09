# Hướng dẫn demo leak query params nhạy cảm qua Referer, và fix bằng Referrer-Policy: no-referrer.

## Giới thiệu thành viên
1. Nguyễn Hoàng Việt - 22810310336: Xử lý FE và triển khai demo leak query params nhạy cảm qua Referer, và fix bằng Referrer-Policy: no-referrer
2. Đỗ Mạnh Cường - 22810340201: Xử lý BE, tìm hiểu và nêu hướng giải quyết của đề tài demo leak query params nhạy cảm qua Referer, và fix bằng Referrer-Policy: no-referrer

## Chuẩn bị

Hãy thêm 1 file .env có nội dung như sau:
REACT_APP_API_URL=https://be-for-bikes-shop.onrender.com

### Tải các thư viện liên quan
Trước tiên bạn phải tải các thư viện liên quan đến web app bằng cách chạy trên terminal: "npm i"

### Chạy trên local
Sau khi tải các thư viện liên quan ta bắt đầu đi đến bước chạy dự án bằng cách: "npm start"
Giao diện khi ta vừa mới chạy dự án thành công 

<img width="1440" height="788" alt="Screenshot 2025-12-09 at 09 57 37" src="https://github.com/user-attachments/assets/659b7ec2-ece6-4fc7-9274-53fcc328fdf7" />

Vì hiện tại mới leak query params nhạy cảm qua chức năng đăng nhập nên yêu cầu bạn phải đăng nhập nhé.
**Đã có video hướng dẫn**
Tài khoản demo: "viet@gmail.com" "12345678"

Sau đó bạn hãy vào trang "http://localhost:3000/collector" để xem có bị leak ko nhé

Ảnh chụp trước khi chưa fix:

<img width="1440" height="827" alt="Screenshot 2025-12-09 at 10 11 12" src="https://github.com/user-attachments/assets/ab50d00b-46a7-42d7-98af-7c74b3e13263" />

Cách fix:
Tại /public/index.html thêm thẻ "meta name="referrer" content="no-referrer" /"

Ảnh sau khi đã fix:

<img width="1440" height="837" alt="Screenshot 2025-12-09 at 10 01 56" src="https://github.com/user-attachments/assets/ee9cdce2-4e02-474a-b062-2d3c19bc0d74" />
