import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import LoginPage from "./Login";

// ✅ dùng tên bắt đầu bằng "mock" để Jest cho phép trong jest.mock
const mockNavigate = jest.fn();

// Mock react-router-dom: giữ nguyên mọi thứ, chỉ override useNavigate
jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// mock global fetch
global.fetch = jest.fn();

const mockFetchSuccess = (role) => {
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({
      token: "fake-token",
      user: { role },
    }),
  });
};

const mockFetchFail = () => {
  fetch.mockResolvedValueOnce({
    ok: false,
    json: async () => ({ message: "Sai tài khoản hoặc mật khẩu" }),
  });
};

// hàm gõ sẵn tài khoản/mật khẩu
const typeCredentials = () => {
  fireEvent.change(screen.getByPlaceholderText(/email/i), {
    target: { value: "nam@gmail.com" },
  });
  fireEvent.change(screen.getByPlaceholderText(/mật khẩu/i), {
    target: { value: "12345678" },
  });
};

const renderWithRouter = () =>
  render(
    <MemoryRouter>
      <LoginPage />
    </MemoryRouter>
  );

beforeEach(() => {
  jest.clearAllMocks();
  mockNavigate.mockReset();
});

describe("LoginPage", () => {
  test("đăng nhập thành công với role = 0 thì chuyển về '/'", async () => {
    mockFetchSuccess(0); // role khách hàng

    renderWithRouter();
    typeCredentials();
    fireEvent.click(screen.getByRole("button", { name: /đăng nhập/i }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  test("đăng nhập thành công với role != 0 thì chuyển về '/admin'", async () => {
    mockFetchSuccess(1); // role admin / nhân viên

    renderWithRouter();
    typeCredentials();
    fireEvent.click(screen.getByRole("button", { name: /đăng nhập/i }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith("/admin");
    });
  });

  test("bỏ trống email/mật khẩu thì không gọi API", async () => {
    renderWithRouter();

    // không nhập gì, click Đăng nhập luôn
    fireEvent.click(screen.getByRole("button", { name: /đăng nhập/i }));

    await waitFor(() => {
      expect(fetch).not.toHaveBeenCalled();
    });

    // Nếu Login.js có hiển thị message lỗi:
    // expect(screen.getByText(/vui lòng/i)).toBeInTheDocument();
  });

  test("API trả lỗi thì hiển thị thông báo lỗi (nếu có)", async () => {
    mockFetchFail();

    renderWithRouter();
    typeCredentials();
    fireEvent.click(screen.getByRole("button", { name: /đăng nhập/i }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
    });

    // Nếu trong Login.js có state error hiển thị ra, có thể assert thêm:
    // expect(screen.getByText(/sai tài khoản|mật khẩu/i)).toBeInTheDocument();
  });
});
beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterAll(() => {
  console.error.mockRestore();
});
