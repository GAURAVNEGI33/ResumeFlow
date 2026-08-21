# Feature Specification: Multi-Format Export Engine (PDF & DOCX)

## 1. Overview
The Export Engine converts rich HTML resume structures into standard downloadable formats:
1. **High-Fidelity PDF**: Rendered server-side using the WebKit rendering engine via `wkhtmltopdf` for selectable text, high resolution, and ATS scanner compatibility.
2. **Editable DOCX**: Word document generation using `html-to-docx` for applicants needing to submit editable `.docx` files.

---

## 2. Architecture & Export Pipeline

```mermaid
graph TD
    subgraph Client [Angular Frontend]
        EditorUI[Editor Component] -->|Collects Sections, Typography & Styles| Builder[buildResumeHtml / buildDocxHtml]
        Builder -->|Structured HTML + CSS| ExportService[ExportService]
    end

    subgraph Server [Express Backend]
        ExportService -->|POST /api/export/pdf| PDFRoute[PDF Export Handler]
        ExportService -->|POST /api/export/docx| DOCXRoute[DOCX Export Handler]

        PDFRoute -->|wkhtmltopdf binary stream| EngineWebKit[WebKit Engine A4 Formatter]
        DOCXRoute -->|html-to-docx buffer| EngineDocx[OpenXML Word Document Builder]

        EngineWebKit -->|Content-Type: application/pdf| ClientStream[Stream PDF Attachment]
        EngineDocx -->|Content-Type: application/vnd.openxmlformats...| ClientBuffer[Buffer DOCX Attachment]
    end

    ClientStream -->|Blob| Downloader[Browser Auto-Download Trigger]
    ClientBuffer -->|Blob| Downloader
```

### Export Execution Flow

```mermaid
sequenceDiagram
    autonumber
    actor User as Candidate
    participant Editor as Editor Component
    participant Service as ExportService
    participant API as atsTailorExportController
    participant Wkhtml as wkhtmltopdf Process
    participant Docx as html-to-docx Library

    User->>Editor: Clicks "Download PDF" / "Download DOCX"
    Editor->>Editor: Compile HTML string with CSS tokens & typography
    
    alt PDF Export
        Editor->>Service: exportPdf(documentId, htmlContent)
        Service->>API: POST /api/export/pdf (Headers: Auth Bearer)
        API->>API: Verify document ownership
        API->>Wkhtml: Pipe HTML with { pageSize: 'A4', margins: 10mm }
        Wkhtml-->>API: Binary PDF Stream
        API-->>Service: Blob (application/pdf)
        Service->>Editor: downloadFile(blob, 'resume.pdf')
        Editor->>User: Browser downloads resume.pdf
    else DOCX Export
        Editor->>Service: exportDocx(documentId, htmlContent)
        Service->>API: POST /api/export/docx (Headers: Auth Bearer)
        API->>API: Verify document ownership
        API->>Docx: Convert HTML to OpenXML docx buffer
        Docx-->>API: DOCX Buffer
        API-->>Service: Blob (application/vnd.openxmlformats...)
        Service->>Editor: downloadFile(blob, 'resume.docx')
        Editor->>User: Browser downloads resume.docx
    end
```

---

## 3. Implementation Details

### A. Frontend Layer
- **ExportService** (`src/app/workspace/services/export.service.ts`):
  - `exportPdf(documentId, htmlContent)`: Sends payload to backend and expects `responseType: 'blob'`.
  - `exportDocx(documentId, htmlContent)`: Sends payload to backend and expects `responseType: 'blob'`.
  - `downloadFile(blob, filename)`: Utility method utilizing `URL.createObjectURL(blob)` and an invisible anchor tag trigger for seamless browser downloading.
- **HTML Compilers in EditorComponent**:
  - `buildResumeHtml()`: Assembles clean semantic HTML with CSS styling, accent colors, header metadata, and bullet list hierarchies for PDF rendering.
  - `buildDocxHtml()`: Generates structured HTML compatible with OpenXML Word parser specifications.

### B. Backend Layer
- **atsTailorExportController** (`controllers/atsTailorExportController.js`):
  - `exportPdf`: Invokes `wkhtmltopdf` with specific A4 page dimensions, margins, and UTF-8 encoding options, piping the binary stream directly into the HTTP response.
  - `exportDocx`: Calls `html-to-docx` to construct an in-memory document buffer and sets corresponding OpenXML mime-type headers.
- **ExportRoutes** (`routes/exportRoutes.js`):
  - `POST /api/export/pdf` (Protected by `auth` middleware).
  - `POST /api/export/docx` (Protected by `auth` middleware).

---

## 4. Configuration & Environment Requirements
- **Server Dependency**: `wkhtmltopdf` must be installed on the host system:
  - Windows: Installed at `C:\Program Files\wkhtmltopdf\bin\wkhtmltopdf.exe` or available on system PATH.
  - Linux/Production: `apt-get install wkhtmltopdf`.
- **Payload Limit**: Express JSON parser limit set to `2mb` in `app.js` (`app.use(express.json({ limit: "2mb" }))`) to comfortably accept large HTML resume payloads.
