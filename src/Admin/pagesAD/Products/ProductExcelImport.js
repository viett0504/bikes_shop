// src/Admin/pagesAD/Products/ProductExcelImport.js
import React, { useState } from "react";
import * as XLSX from "xlsx";
import { FiUpload } from "react-icons/fi";
import { createProduct, getAllProduct } from "./FetchApi";

export default function ProductExcelImport({
  categories = [],
  bikeTypes = [],
  onAfterImport, // hàm callback từ AddProductModal (refresh + close)
}) {
  const [excelFile, setExcelFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);

  const handleExcelChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      setExcelFile(null);
      return;
    }

    if (!file.name.match(/\.(xlsx|xls)$/i)) {
      alert("Vui lòng chọn file Excel (.xlsx hoặc .xls)");
      e.target.value = "";
      setExcelFile(null);
      return;
    }

    setExcelFile(file);
  };


  const handleExcelImport = () => {
    if (!excelFile) {
      alert("Không có file Excel nào được chọn.");
      return;
    }

    const reader = new FileReader();

    reader.onload = async (evt) => {
      try {
        const workbook = XLSX.read(evt.target.result, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

        if (!rows.length) {
          alert("File Excel không có dữ liệu.");
          return;
        }

        const ok = window.confirm(
          `Bạn có chắc muốn nhập ${rows.length} sản phẩm từ file Excel?`
        );
        if (!ok) return;

        setLoading(true);

        // ĐẾM SỐ SP IMPORT THÀNH CÔNG / THẤT BẠI
        let successCount = 0;
        let failCount = 0;

        for (const row of rows) {
          const nameRow =
            row["Tên sản phẩm"] ||
            row["Ten san pham"] ||
            row["Ten SP"] ||
            "";

          // Nếu không có tên sản phẩm thì bỏ qua dòng này
          if (!nameRow) continue;

          // Nếu mô tả trống -> gán mặc định để không bị fail
          const descRow =
            row["Mô tả"] || row["Mo ta"] || "Không có mô tả";

          const stockRow = Number(
            row["Tồn kho"] || row["Ton kho"] || 0
          );
          const priceRow = Number(
            row["Giá tiền"] || row["Gia tien"] || 0
          );
          const offerRow = Number(
            row["Ưu đãi (%)"] || row["Uu dai"] || 0
          );

          const brandName =
            row["Thương hiệu"] ||
            row["Thuong hieu"] ||
            row["Brand"] ||
            "";

          const typeName =
            row["Loại xe"] ||
            row["Loai xe"] ||
            row["Type"] ||
            "";

          // Map thương hiệu -> category id
          let categoryId = "";
          if (brandName && Array.isArray(categories) && categories.length) {
            const found = categories.find((c) => c.cName === brandName);
            if (found) categoryId = found._id;
          }

          // Nếu vẫn không map được -> gán tạm category đầu tiên (để không bị lỗi)
          if (!categoryId && Array.isArray(categories) && categories.length) {
            categoryId = categories[0]._id;
          }

          // Map loại xe -> bikeType id
          let bikeTypeId = "";
          if (typeName && Array.isArray(bikeTypes) && bikeTypes.length) {
            const foundType = bikeTypes.find((t) => t.tName === typeName);
            if (foundType) bikeTypeId = foundType._id;
          }

          // Nếu vẫn không map được -> gán tạm loại xe đầu tiên
          if (!bikeTypeId && Array.isArray(bikeTypes) && bikeTypes.length) {
            bikeTypeId = bikeTypes[0]._id;
          }

          const statusRaw =
            row["Trạng thái"] ||
            row["Trang thai"] ||
            row["Status"] ||
            "Active";
          const statusRow = statusRaw === "Inactive" ? "Inactive" : "Active";

          try {
            const res = await createProduct({
              name: nameRow,
              desc: descRow,
              image: null, // Excel không có ảnh
              status: statusRow,
              category: categoryId,
              stock: stockRow,
              price: priceRow,
              offer: offerRow,
              type: bikeTypeId,
            });

            // Kiểm tra BE trả về
            if (res && res.success) {
              successCount++;
            } else {
              failCount++;
              console.warn(
                "❌ Không import được dòng:",
                row,
                "Lý do:",
                res?.error
              );
            }
          } catch (err) {
            failCount++;
            console.error("❌ Lỗi khi gọi createProduct:", err, row);
          }
        }

        // Sau khi tạo xong -> load lại sản phẩm
        if (successCount === 0) {
          alert(
            "❌ Không có sản phẩm nào được import. Vui lòng kiểm tra lại file Excel (Tên, Thương hiệu, Loại xe...)."
          );
        } else {
            alert(
                `✅ Đã nhập thành công ${successCount} sản phẩm từ Excel.` +
                (failCount
                    ? ` (${failCount} sản phẩm bị bỏ qua do lỗi.)`
                    : "")
            );

            const list = await getAllProduct();
            onAfterImport?.(list?.Products || list?.products || []);
            setExcelFile(null);
            }
        } catch (err) {
            console.error("❌ Lỗi import Excel:", err);
            alert("❌ Có lỗi xảy ra khi đọc file Excel hoặc tạo sản phẩm.");
        } finally {
            setLoading(false);
        }
    };

    reader.readAsBinaryString(excelFile);
  };


  const handleExportExcel = async () => {
    try {
      setExporting(true);

      const res = await getAllProduct();
      const productsList = res?.Products || [];

      if (!productsList.length) {
        alert("Không có sản phẩm nào để xuất.");
        return;
      }

      const rows = productsList.map((p, index) => ({
        STT: index + 1,
        "Tên sản phẩm": p.pName || "",
        "Mô tả": p.pDescription || "",
        "Tồn kho": p.pQuantity ?? 0,
        "Đã bán": p.pSold ?? 0,
        "Giá tiền": p.pPrice ?? 0,
        "Ưu đãi (%)": p.pOffer ?? 0,
        "Trạng thái": p.pStatus || "",
        "Thương hiệu": p.pCategory?.cName || "",
        "Loại xe": p.pBiketype?.tName || "",
    
        "Ảnh (URL)": Array.isArray(p.pImages) ? p.pImages[0] || "" : "",
        "Ngày tạo": p.createdAt || "",
        "Ngày cập nhật": p.updatedAt || "",
        "_id": p._id || "",
      }));

      const worksheet = XLSX.utils.json_to_sheet(rows);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Products");

      XLSX.writeFile(workbook, "Bike_products.xlsx");
    } catch (error) {
      console.error("❌ Lỗi xuất Excel:", error);
      alert("Có lỗi xảy ra khi xuất Excel.");
    } finally {
      setExporting(false);
    }
  };


  return (
    <div
      className="ad-panel"
      style={{ marginBottom: 16, padding: 12, borderRadius: 8 }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>
            Nhập sản phẩm từ Excel
          </div>
          <div className="ad-muted">
            File Excel có các cột:{" "}
            <b>
              Tên sản phẩm, Mô tả, Tồn kho, Thương hiệu, Loại xe, Giá tiền, Ưu
              đãi (%), Trạng thái
            </b>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          <label
            className="ad-btn secondary"
            style={{
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <FiUpload />
            Chọn file Excel
            <input
              type="file"
              hidden
              accept=".xlsx,.xls"
              onChange={handleExcelChange}
            />
          </label>

          <button
            type="button"
            className="ad-btn primary"
            onClick={handleExcelImport}
            disabled={loading}
          >
            {loading ? "Đang nhập..." : "Nhập dữ liệu Excel"}
          </button>

          <button
            type="button"
            className="ad-btn success"
            style={{ marginLeft: 8, whiteSpace: "nowrap" }}
            onClick={handleExportExcel}
            disabled={exporting}
          >
            {exporting ? "Đang xuất..." : "Xuất Excel sản phẩm"}
          </button>

        </div>
      </div>

      {excelFile && (
        <div style={{ marginTop: 8, fontSize: 12 }}>
          File đã chọn: <b>{excelFile.name}</b>
        </div>
      )}
    </div>
  );
}
