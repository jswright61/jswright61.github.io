# Bag Tags

A static luggage tag designer. Open `index.html` in a browser, or upload this folder to any static web host. No Node.js, npm installation, build step, backend, or external service is needed to run it. All runtime dependencies are included under `vendor/`.

## Use

Pick a **template** and **tag data**; applying the tag data to the template gives a personalized tag. A template holds the physical design: shape, dimensions, margins, font size, QR toggle, and print sheet settings. Tag data holds everything printed on the tag: the header message and one person's contact details. Choose **New** in either selector to start over (new tag data keeps the default header), then use **Save template** or **Save tag data**. Saving under an existing name replaces that entry; renaming a template and saving creates a copy. The × button deletes the selected entry. Adjust dimensions and margins in inches. Inputs accept decimals and fractions such as `4 3/8`. Use **vCard fields** to decide which lines are encoded by the optional QR code. Name, email, mobile phone, other phone, website, note, or no vCard field are available. Add or remove up to 12 lines; blank lines are omitted. The vCard field is inferred from each tag data key (`name`, `email`, `tel1`/`phone…`, `url`, `note`); other keys, including `header`, are left out of the QR code unless you choose a field. A `header` key is bold by default.

The engine uses one fitted font size across all lines, distributes them vertically, and scales the QR code proportionally with a four-module quiet zone. The header is bold by default. The preview guides are never exported. PDF output uses vector text and QR modules.

All tags on a sheet share edges. Auto orientation selects portrait if it fits; otherwise landscape if it fits. Print downloaded PDFs at **100% / Actual Size**; disable Fit to page. Trim rectangles first, then angled corners, then punch the marked holes. A physical print-and-scan check is recommended after changing dimensions.

Templates and tag data are stored as JSON arrays in this browser's localStorage under `bag-tags-templates` and `bag-tags-tag-data`; `bag-tags-selection` remembers the last selection. When a key is missing, it is seeded with the defaults from `core.js`: the **Shacke** (angled) and **Smoafy** (rectangular) templates and the **A. Traveler** tag data. Edits are not saved until you press a Save button. Contact information is not sent to a backend.

Tag data is flat JSON, so it can hold any set of lines:

```json
{"header":"REWARD & THANKS FOR RETURN","name":"A. Traveler","email":"ATRAVELER@EXAMPLE.COM","tel1":"+1 404-555-1001","tel2":"+1 404-555-1002"}
```

A value can also be `{"text": "…", "field": "note", "bold": true}` when a line needs a vCard field or bold setting other than the inferred one. Export writes every template and all tag data to one JSON file; Import merges a file by name.

## Files

- `index.html`: app structure
- `style.css`: responsive interface
- `app.js`: editing, previews, browser storage, import/export
- `core.js`: default templates and tag data, validation, vCard encoding, layout, PDF drawing
- `vendor/`: locally bundled jsPDF 3.0.3 and qrcode-generator 1.4.4, MIT licenses included

To change the seeded defaults, edit `seeds` in `core.js`. They only apply to browsers that don't have the storage keys yet. Layout dimensions are converted to PDF points (72 per inch). The current PDF font supports Western European text; other scripts need an embedded font. The tag outline supports rectangles and a symmetric angled right end with a vertically centered punch hole.

The hosting platform may require authentication for the private hosted copy. Authentication is not an application dependency when self-hosting these files.
