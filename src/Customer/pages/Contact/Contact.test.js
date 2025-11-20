// src/Customer/pages/Contact/Contact.test.js
import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Contact from "./Contact";

// Mock TeamCard để test đơn giản, không phụ thuộc component con
jest.mock("../../components/Contact/TeamCard", () => (props) => {
  // Nếu truyền member thì hiển thị tên member, nếu không thì hiển thị title
  const { member, title, children } = props;
  return (
    <div data-testid="team-card">
      {member && <div>{member.name}</div>}
      {title && <h3>{title}</h3>}
      {children}
    </div>
  );
});

describe("Contact page", () => {
  test("hiển thị heading và các thành viên team", () => {
    render(<Contact />);

    // Heading chính
    expect(
      screen.getByRole("heading", { name: /liên hệ với chúng tôi/i })
    ).toBeInTheDocument();

    // 3 thành viên team trong file Contact.js :contentReference[oaicite:0]{index=0}
    expect(screen.getByText("Nguyễn Gia Huy")).toBeInTheDocument();
    expect(screen.getByText("Nguyễn Hoàng Việt")).toBeInTheDocument();
    expect(screen.getByText("Văn Tiến Nam")).toBeInTheDocument();
  });

  test("hiển thị block 'Thông Tin Cửa Hàng' và các mục con", () => {
    render(<Contact />);

    // Tiêu đề block info :contentReference[oaicite:1]{index=1}
    expect(
      screen.getByRole("heading", { name: /thông tin cửa hàng/i })
    ).toBeInTheDocument();

    // Các card info (Địa Chỉ, Giờ Mở Cửa, Kết Nối, Thanh Toán)
    expect(screen.getByText(/địa chỉ/i)).toBeInTheDocument();
    expect(screen.getByText(/giờ mở cửa/i)).toBeInTheDocument();
    expect(screen.getByText(/kết nối/i)).toBeInTheDocument();
    expect(screen.getByText(/thanh toán/i)).toBeInTheDocument();
  });
});
