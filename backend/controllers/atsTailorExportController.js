const { Document, Export } = require("../models");
const wkhtmltopdf = require("wkhtmltopdf");

// Tell wkhtmltopdf where the binary is installed on Windows
wkhtmltopdf.command = "C:\\Program Files\\wkhtmltopdf\\bin\\wkhtmltopdf.exe";

async function recordExport(documentId, userId, format) {
  return Export.create({
    documentId,
    userId,
    format,
    fileUrl: null,
  });
}

async function exportPdf(req, res) {
  try {
    const { documentId, htmlContent } = req.body;

    // Validate document exists and belongs to user
    const doc = await Document.findByPk(documentId);
    if (!doc || doc.userId !== req.user.id) {
      return res.status(403).send({ success: false, message: "Unauthorized" });
    }

    // Set response headers — browser will download as PDF
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="resume_${documentId}.pdf"`,
    );

    
res.once("finish", () => {
  recordExport(documentId, req.user.id, "pdf").catch((error) => {
    console.log("Error recording PDF export:", error);
  });
});
    // Generate PDF from HTML and stream to response
    wkhtmltopdf(htmlContent, {
      pageSize: "A4",
      marginTop: "10mm",
      marginBottom: "10mm",
      marginLeft: "15mm",
      marginRight: "15mm",
      encoding: "UTF-8",
      disableSmartShrinking: true,
      printMediaType: true,
    }).pipe(res);
  } catch (error) {
    console.log("Error exporting PDF:", error);
    res.status(500).send({ success: false, message: "PDF generation failed" });
  }
}
const HTMLtoDOCX = require("html-to-docx");

async function exportDocx(req, res) {
  try {
    const { documentId, htmlContent } = req.body;

    // Validate document exists and belongs to user
    const doc = await Document.findByPk(documentId);
    if (!doc || doc.userId !== req.user.id) {
      return res.status(403).send({ success: false, message: "Unauthorized" });
    }

    // Convert HTML to DOCX buffer
    const docxBuffer = await HTMLtoDOCX(htmlContent, null, {
      table: { row: { cantSplit: true } },
      footer: false,
      pageNumber: false,
      font: "Arial",
      fontSize: 22, // 11pt (half-points)
    });

    // Set headers for DOCX download
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="resume_${documentId}.docx"`,
    );
res.once("finish", () => {
  recordExport(documentId, req.user.id, "docx").catch((error) => {
    console.log("Error recording DOCX export:", error);
  });
});
    res.send(docxBuffer);
  } catch (error) {
    console.log("Error exporting DOCX:", error);
    res.status(500).send({ success: false, message: "DOCX generation failed" });
  }
}
async function listExports(req, res) {
  try {
    const exports = await Export.findAll({
      where: {
        userId: req.user.id,
      },
      attributes: [
        "id",
        "format",
        "fileUrl",
        "documentId",
        "createdAt",
      ],
      include: [
        {
          model: Document,
          attributes: ["id", "title", "type"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.send({
      success: true,
      exports,
    });
  } catch (error) {
    console.log("Error retrieving exports:", error);

    return res.status(500).send({
      success: false,
      message: "Export history could not be loaded.",
    });
  }
}
module.exports = { exportPdf, exportDocx, listExports };
