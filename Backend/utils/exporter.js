
import ExcelJS from "exceljs";


export async function exportData(data, baseName, res,keys) {
  if (!Array.isArray(data) || data.length === 0) {
    return res.status(400).json({ message: "No data to export" });
  }
  const headers = keys || Object.keys(data[0]);

  const isCsv = data.length > 1000;
  const ext = isCsv ? "csv" : "xlsx";
  const mime = isCsv
    ? "text/csv"
    : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

  const fileName = `${baseName}_${new Date()
    .toISOString()
    .slice(0, 19)
    .replace(/:/g, "-")}.${ext}`;


  res.setHeader("Content-Type", mime);
  res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

  if (isCsv) {
    await streamCsv(data,headers, res);
  } else {
    await streamExcel(data,headers, res);
  }
}


async function streamCsv(data, headers,res) {



  res.write(headers.join(",") + "\r\n");

  for (const row of data) {
    const values = headers.map((h) => {
      let val = row[h] ?? "";
      if (typeof val !== "string") val = String(val);

      if (val.includes(",") || val.includes('"') || val.includes("\n") || val.includes("\r")) {
        val = '"' + val.replace(/"/g, '""') + '"';
      }
      return val;
    });
    res.write(values.join(",") + "\r\n");
  }

  res.end();
}


async function streamExcel(data, headers,res) {
  const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({ stream: res });

  const worksheet = workbook.addWorksheet("Sheet1");
  worksheet.properties.defaultColWidth = 15;

  if (data.length > 0) {

    const headerRow = worksheet.addRow(headers);
    headerRow.font = { bold: true };
    headerRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFD9EAD3" },
    };

    data.forEach((row) => {
      worksheet.addRow(headers.map((h) => row[h]));
    });
  }



  await workbook.commit();
}