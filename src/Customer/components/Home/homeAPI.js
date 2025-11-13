// src/Customer/pages/Home/homeApi.js
const API = process.env.REACT_APP_API_URL; 

async function request(path, opts = {}) {
  const res = await fetch(`${API}${path}`, {
    method: opts.method || "GET",
    headers: { "Content-Type": "application/json", ...(opts.headers || {}) },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
    credentials: "include",
  });

  let data = null;
  try { data = await res.json(); } catch (_) {}
  if (!res.ok) {
    throw new Error(data?.message || `Request failed ${res.status}`);
  }
  return data;
}

// Ghép URL file trong thư mục public
export const buildAssetUrl = (p) => `${API}/${String(p).replace(/^\/+/, "")}`;

/* ======= BANNER (Hero) ======= */
// Lấy danh sách URL ảnh banner từ MongoDB qua BE
export async function getHeroBanners() {
  // BE trả: { Images: [{ slideImage: "1699770000_abc.jpg", ...}, ...] }
  const data = await request("/api/customize/get-slide-image");
  const names = (data?.Images || []).map(x => x?.slideImage).filter(Boolean);
  return names.map(name => buildAssetUrl(`uploads/customize/${name}`));
}

/* ======= SẢN PHẨM ======= */
export async function getProducts({ page = 1, limit = 12, keyword = "", category = "", sort = "-createdAt" } = {}) {
  const qs = new URLSearchParams({
    page: String(page), limit: String(limit),
    ...(keyword ? { keyword } : {}),
    ...(category ? { category } : {}),
    ...(sort ? { sort } : {}),
  }).toString();
  // Tùy router BE của bạn nhận tham số như nào:
  return request(`/api/product?${qs}`);
}

export async function getProductById(id) {
  return request(`/api/product/${id}`);
}

// Nếu BE chỉ trả tên file ảnh sản phẩm:
export const productImageUrl = (fileName) => buildAssetUrl(`uploads/products/${fileName}`);
