🌐 GLOBAL OPEN ACCESS STATEMENT / TUYÊN BỐ TIẾP CẬN TOÀN CẦU

🇺🇸 English
AAIDA — Acupuncture AI Diagnosis Assistant is a 100% free, open-source project released under the MIT License (pp. 1-2).
•	Global Non-Exclusive Use: This platform is intended for free, worldwide use. Any medical institution, university, or individual developer is entirely free to adopt, modify, teach, and deploy this system without commercial restrictions or exclusivity.
•	Legacy & Collaboration: This project is built as a non-conditional gift to the global traditional medicine community. The author remains fully committed to providing technical guidance and remote mentorship for implementation and future advancements for as long as health and time permit (p. 3).

🇫🇷 Français
AAIDA — Assistant de Diagnostic par l'IA en Acupuncture est un projet 100% gratuit et open-source, publié sous licence MIT (pp. 1-2).
•	Utilisation Mondiale Non Exclusive: Cette plateforme est conçue pour une utilisation libre à l'échelle internationale. Toute institution médicale, université hoặc développeur indépendant est pleinement autorisé à adopter, modifier, enseigner et déployer ce système, sans aucune restriction commerciale ni exclusivité.
•	Héritage et Collaboration: Ce projet est offert comme un don inconditionnel à la communauté mondiale de la médecine traditionnelle. L'auteur s'engage pleinement à fournir des conseils techniques et un accompagnement à distance pour l'intégration et les développements futurs, tant que la santé et le temps le permettront (p. 3).

🇻🇳 Tiếng Việt
AAIDA — Trợ lý Chẩn đoán AI Châm cứu là dự án mã nguồn mở hoàn toàn miễn phí, được phát hành theo giấy phép MIT (pp. 1-2).
•	Quyền Sử dụng Phi Độc quyền Toàn cầu: Nền tảng này được thiết kế để sử dụng tự do trên toàn thế giới. Mọi bệnh viện, trường đại học hoặc nhà phát triển cá nhân đều có toàn quyền tiếp nhận, chỉnh sửa, giảng dạy và triển khai hệ thống mà không chịu bất kỳ ràng buộc thương mại hay giới hạn độc quyền nào.
•	Di sản & Hợp tác nhân văn: Dự án là món quà không điều kiện gửi tặng cộng đồng Đông y toàn cầu. Trong giới hạn quỹ thời gian và điều kiện sức khỏe cho phép, tác giả luôn sẵn lòng hỗ trợ, cố vấn kỹ thuật trực tuyến để chuyển giao công nghệ và định hướng các nâng cấp chuyên sâu (p. 3).

🇨🇳 简体中文 (Simplified Chinese)
AAIDA — 针灸 AI 辅助诊断系统是一个根据 MIT 许可证发布的 100% 免费开源项目 (pp. 1-2)。
全球非排他性使用： 本平台旨在供全球免费使用。任何医疗机构、大学或个人开发者均可完全自由地采用、修改、教学和部署本系统，不受任何商业限制或独家排他性约束。
传承与合作： 本项目作为无条件奉献给全球传统医学界的礼物而诞生。在健康和时间允许的范围内，作者将全力提供技术指导和远程协助，以支持系统的落地应用与未来升级 (p. 3)

---

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
