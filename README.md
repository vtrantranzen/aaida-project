# AAIDA — Acupuncture AI Diagnosis Assistant

**Free · Multilingual · Open Educational Tool for TCM**

🌐 **Live app:** https://aaida-tcm.netlify.app

---

## What is AAIDA?

AAIDA is a free, multilingual clinical decision-support tool 
for Traditional Chinese Medicine practitioners and students.

A practitioner enters a patient's chief complaint, tongue 
findings, pulse qualities, and lifestyle information. AAIDA 
scores these against a curated database of TCM patterns and 
suggests ranked pattern diagnoses and acupuncture point 
prescriptions for the practitioner to review and apply 
their own clinical judgment.

**AAIDA assists. The practitioner decides.**

---

## Features

- 🌍 **Four languages** — English · Tiếng Việt · Français · 中文简体
- 🧠 **Language-agnostic matching** — type your complaint 
  in any language, AAIDA finds the right patterns
- 📋 **111 TCM patterns** with full multilingual names
- 🔍 **715 symptomatic patterns** with acupuncture points
- 📄 **PDF clinical report** — multilingual, printable
- 🔒 **100% local** — no account, no server, no data sent anywhere
- 📱 **Works on all devices** — mobile, tablet, desktop
- ⚡ **No installation** — runs directly in the browser

---

## How to Use

**Option 1 — Use the live app:**
Simply visit https://aaida-tcm.netlify.app

**Option 2 — Run locally:**
Download `AAIDA_MVP06_2026-06-15.html` and open it 
in any modern browser. That's it.

---

## Clinical Database

| Content | Count |
|---|---|
| TCM Patterns | 111 |
| Clinical Findings | 182 |
| Symptomatic Patterns | 715 |
| Languages | 4 (EN/VN/FR/ZH) |
| Treatment Principles | 80 patterns covered |

All content reviewed against classical TCM sources.

---

## For Developers

The companion `AAIDA_MVP06_2026-06-15.jsx` file contains 
the full readable source code.

**Architecture highlights:**
- React PWA, single self-contained HTML file
- DisplayName principle — clinical entities identified 
  by stable numeric IDs, display names translate freely
- Three-tier data model (Core DB / Institutional / Personal)
- Multilingual free-text matching via S_DB DisplayName

See `AAIDA_Transfer_Document_MVP06.docx` for complete 
architecture documentation and custodianship guidelines.

---

## Disclaimer

AAIDA is intended strictly for educational purposes and as 
a clinical decision-support aid for licensed TCM practitioners 
and supervised students. It does not constitute medical advice. 
The practitioner bears sole responsibility for all clinical 
decisions.

---

## License

MIT License — free to use, modify, and distribute with attribution.

**Created by:** Viet Tran · 2026  
**Contact:** via GitHub Issues  
**Deployment:** https://aaida-tcm.netlify.app
