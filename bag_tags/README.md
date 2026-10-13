# Tag Studio

A static luggage tag designer. Open `index.html` in a browser, or upload this folder to any static web host. No Node.js, npm installation, build step, backend, or external service is needed to run it. All runtime dependencies are included under `vendor/`.

## Use

Choose an angled or rectangular preset, edit the lines, and adjust dimensions and margins in inches. Inputs accept decimals and fractions such as `4 3/8`. Use **vCard fields** to decide which lines are encoded by the optional QR code. Name, email, mobile phone, other phone, website, note, or no vCard field are available. Add or remove up to 12 lines; blank lines are omitted. Both phone lines in the included presets are mobile numbers.

The engine uses one fitted font size across all lines, distributes them vertically, and scales the QR code proportionally with a four-module quiet zone. The header is bold by default. The preview guides are never exported. PDF output uses vector text and QR modules.

All tags on a sheet share edges. Auto orientation selects portrait if it fits; otherwise landscape if it fits. Print downloaded PDFs at **100% / Actual Size**; disable Fit to page. Trim rectangles first, then angled corners, then punch the marked holes. A physical print-and-scan check is recommended after changing dimensions.

Settings save to this browser's localStorage when available. Export/import JSON to back up a design or move it to another device. Loading a preset replaces the current design. Contact information is not sent to a backend. Presets contain the supplied contact details, including `TRAVELER@EXAMPLE.COM`; edit them as needed before publishing your own copy.

## Files

- `index.html`: app structure
- `style.css`: responsive interface
- `app.js`: editing, previews, browser storage, import/export
- `core.js`: presets, validation, vCard encoding, layout, PDF drawing
- `vendor/`: locally bundled jsPDF 3.0.3 and qrcode-generator 1.4.4, MIT licenses included

To add a preset, edit `presets` in `core.js` and the preset options in `index.html`. Layout dimensions are converted to PDF points (72 per inch). The current PDF font supports Western European text; other scripts need an embedded font. The tag outline supports rectangles and a symmetric angled right end with a vertically centered punch hole.

The hosting platform may require authentication for the private hosted copy. Authentication is not an application dependency when self-hosting these files.
