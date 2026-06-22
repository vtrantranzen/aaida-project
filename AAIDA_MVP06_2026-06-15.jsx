/**
 * AAIDA — Acupuncture AI Diagnosis Assistant
 * MVP06 — 2026-06-15
 * 
 * Fully multilingual React PWA (EN / VN / FR / ZH)
 * Languages: English, Tiếng Việt, Français, 中文简体
 * 
 * Architecture:
 * - DisplayName matching engine (S_DB multilingual)
 * - FINDING_I18N (182 entries from tblFinding)
 * - PATTERN_I18N + PATTERN_I18N_ID (111 patterns from tblPattern)
 * - PATTERN_PRINCIPLES (80 patterns from tblPatternPrinciple)
 * - S_DB (715 symptomatic patterns from S_Pattern + S_PatternPoint)
 * - VN_TO_EN synonym bridge for free-text matching
 * 
 * Single-file PWA — bundle via esbuild after JSX compilation
 * 
 * © 2026 Viet Tran — Free for educational use
 * aaida-tcm.netlify.app
 */

// ═══════════════════════════════════════════════════════════════════════════
// AAIDA INTERNATIONALIZATION — v1.0
// EN values are plain strings. t() is safe to call any time after this block.
// ═══════════════════════════════════════════════════════════════════════════
const SUPPORTED_LANGS = [
  { code:"EN", flag:"EN", native:"English"    },
  { code:"VN", flag:"🇻🇳", native:"Tiếng Việt" },
  { code:"FR", flag:"🇫🇷", native:"Français"   },
  { code:"ZH", flag:"🇨🇳", native:"中文简体"    },
];
const LANG_KEY = "aaida_lang";
const I18N = {
  appSubtitle:      {EN:"TCM Clinical Assistant",                  VN:"Trợ lý Lâm sàng Đông y",                FR:"Assistant Clinique MTC",                ZH:"中医临床助手"},
  freeStudent:      {EN:"✦ FREE STUDENT VERSION ✦",                VN:"✦ PHIÊN BẢN SINH VIÊN MIỄN PHÍ ✦",      FR:"✦ VERSION ÉTUDIANTE GRATUITE ✦",         ZH:"✦ 免费学生版 ✦"},
  selectLang:       {EN:"Select your language",                    VN:"Chọn ngôn ngữ của bạn",                 FR:"Choisissez votre langue",                ZH:"请选择语言"},
  langSub:          {EN:"You can change this anytime in Settings.",VN:"Bạn có thể thay đổi trong Cài đặt.",    FR:"Vous pouvez changer dans Paramètres.",   ZH:"可随时在设置中更改。"},
  continueBtn:      {EN:"Continue →",                              VN:"Tiếp tục →",                            FR:"Continuer →",                            ZH:"继续 →"},
  navPatients:      {EN:"Patients",                                VN:"Bệnh nhân",                             FR:"Patients",                               ZH:"患者"},
  navAdmin:         {EN:"Admin",                                   VN:"Quản trị",                              FR:"Admin",                                  ZH:"管理"},
  navSettings:      {EN:"Settings",                                VN:"Cài đặt",                               FR:"Paramètres",                             ZH:"设置"},
  searchPts:        {EN:"Search patients…",                        VN:"Tìm bệnh nhân…",                        FR:"Rechercher un patient…",                 ZH:"搜索患者…"},
  newPatient:       {EN:"+ New Patient",                           VN:"+ Bệnh nhân mới",                       FR:"+ Nouveau patient",                      ZH:"+ 新患者"},
  noPatients:       {EN:"No patients yet.",                        VN:"Chưa có bệnh nhân.",                    FR:"Aucun patient pour l'instant.",           ZH:"暂无患者。"},
  tapToAdd:         {EN:"Tap above to add your first patient.",    VN:"Nhấn bên trên để thêm bệnh nhân đầu tiên.",FR:"Appuyez ci-dessus pour ajouter votre premier patient.",ZH:"点击上方添加您的第一位患者。"},
  intakeHistory:    {EN:"Intake History",VN:"Lịch sử khám bệnh",FR:"Historique des entretiens",ZH:"问诊历史"},
  newIntake:        {EN:"New Intake",                              VN:"Khám mới",                              FR:"Nouvelle consultation",                  ZH:"新诊次"},
  noIntakes:        {EN:"No intakes yet.",                         VN:"Chưa có lần khám nào.",                 FR:"Aucune consultation.",                   ZH:"暂无就诊记录。"},
  notAssessed:      {EN:"Not assessed",                            VN:"Chưa đánh giá",                         FR:"Non évalué",                             ZH:"未评估"},
  editingIntake:    {EN:"Editing intake",                          VN:"Đang chỉnh sửa khám",                   FR:"Modification de la consultation",        ZH:"编辑诊次"},
  visitInfo:        {EN:"Visit Information",                       VN:"Thông tin khám",                        FR:"Informations de visite",                 ZH:"就诊信息"},
  chiefComplaint:   {EN:"Chief Complaint *",VN:"Lý do khám bệnh",FR:"Plainte principale",ZH:"主诉"},
  otherConcern1:    {EN:"Other Concern 1",VN:"Vấn đề khác 1",FR:"Autre préoccupation 1",ZH:"其他顾虑 1"},
  otherConcern2:    {EN:"Other Concern 2",VN:"Vấn đề khác 2",FR:"Autre préoccupation 2",ZH:"其他顾虑 2"},
  addlConcern:      {EN:"Additional concern…",                     VN:"Vấn đề bổ sung…",                       FR:"Autre motif…",                           ZH:"补充主诉…"},
  illnessSince:     {EN:"Duration of Illness",VN:"Khi nào bắt đầu",FR:"Depuis quand ?",ZH:"何时开始"},
  energyLevel:      {EN:"Energy Level",VN:"Mức năng lượng",FR:"Niveau d’énergie",ZH:"能量水平"},
  appetite:         {EN:"Appetite",VN:"Thèm ăn",FR:"appétit",ZH:"食欲"},
  sleepQuality:     {EN:"Sleep Quality",VN:"Chất lượng giấc ngủ",FR:"Qualité du sommeil",ZH:"睡眠质量"},
  thirst:           {EN:"Thirst",VN:"Khát nước",FR:"Soif",ZH:"口渴"},
  sweating:         {EN:"Sweating",VN:"Đổ mồ hôi",FR:"Transpirer",ZH:"出汗"},
  grpSleep:         {EN:"Sleep & Mind",                            VN:"Giấc ngủ & Tâm thần",                   FR:"Sommeil & Esprit",                       ZH:"睡眠与心神"},
  grpPain:          {EN:"Pain",                                    VN:"Đau",                                   FR:"Douleur",                                ZH:"痛"},
  grpDigestion:     {EN:"Digestion",                               VN:"Tiêu hóa",                              FR:"Digestion",                              ZH:"消化"},
  grpUrinary:       {EN:"Urinary",                                 VN:"Tiểu tiện",                             FR:"Urinaire",                               ZH:"泌尿"},
  grpEnergy:        {EN:"Energy & Fatigue",                        VN:"Năng lượng & Mệt mỏi",                  FR:"Énergie & Fatigue",                      ZH:"精力与疲劳"},
  grpHead:          {EN:"Head & Senses",                           VN:"Đầu & Giác quan",                       FR:"Tête & Sens",                            ZH:"头部与感官"},
  grpSkin:          {EN:"Skin & Body",                             VN:"Da & Cơ thể",                           FR:"Peau & Corps",                           ZH:"皮肤与躯体"},
  grpEmotional:     {EN:"Emotional",                               VN:"Cảm xúc",                               FR:"Émotionnel",                             ZH:"情志"},
  grpSweating:      {EN:"Sweating & Temperature",                  VN:"Mồ hôi & Nhiệt độ",                     FR:"Transpiration & Température",            ZH:"汗液与体温"},
  grpRespiratory:   {EN:"Respiratory",                             VN:"Hô hấp",                                FR:"Respiratoire",                           ZH:"呼吸"},
  grpWomens:        {EN:"Women's Health",                          VN:"Sức khỏe phụ nữ",                       FR:"Santé féminine",                         ZH:"妇科"},
  grpMens:          {EN:"Men's Health",                            VN:"Sức khỏe nam giới",                     FR:"Santé masculine",                        ZH:"男科"},
  grpCirculatory:   {EN:"Circulatory",                             VN:"Tuần hoàn",                             FR:"Circulatoire",                           ZH:"循环"},
  tongueBodyColor:  {EN:"Body Color",VN:"Màu lưỡi",FR:"Couleur de la langue",ZH:"舌色"},
  tongueCoating:    {EN:"Coating Color",                           VN:"Màu rêu lưỡi",                          FR:"Couleur de l'enduit",                    ZH:"苔色"},
  tongueMoisture:   {EN:"Moisture",VN:"Độ ẩm lưỡi",FR:"Humidité de la langue",ZH:"舌头湿润"},
  tongueNotes:      {EN:"Tongue Notes",                            VN:"Ghi chú lưỡi",                          FR:"Notes sur la langue",                    ZH:"舌象备注"},
  addTongueSigns:   {EN:"Additional Tongue Signs",                 VN:"Dấu hiệu lưỡi thêm",                    FR:"Signes supplémentaires",                 ZH:"其他舌象"},
  pulseQualities:   {EN:"Overall Pulse Qualities",                 VN:"Chất lượng mạch",                       FR:"Qualités du pouls",                      ZH:"脉象"},
  pulseStrengthR:   {EN:"Right Overall Strength",                  VN:"Sức mạch phải",                         FR:"Force droite globale",                   ZH:"右脉力度"},
  pulseStrengthL:   {EN:"Left Overall Strength",                   VN:"Sức mạch trái",                         FR:"Force gauche globale",                   ZH:"左脉力度"},
  pulseNotes:       {EN:"Pulse Notes",                             VN:"Ghi chú mạch",                          FR:"Notes sur le pouls",                     ZH:"脉象备注"},
  lifestyle:        {EN:"Lifestyle Factors",VN:"Lối sống",FR:"Mode de vie",ZH:"生活方式"},
  medHistory:       {EN:"Medical History / Medications",VN:"Bệnh sử",FR:"Anamnèse",ZH:"病史"},
  practNotes:       {EN:"Practitioner Notes & Rationale",          VN:"Ghi chú của thầy thuốc",                FR:"Notes du praticien",                     ZH:"医师备注"},
  activeFindings:   {EN:"Active Findings",                         VN:"Bệnh trạng",                    FR:"Constatations actives",                   ZH:"活跃的发现"},
  searchFindings:   {EN:"Search findings…",                        VN:"Tìm phát hiện…",                        FR:"Rechercher des observations…",           ZH:"搜索发现…"},
  noFindingsMatch:  {EN:"No findings matched. Try different words.",VN:"Không tìm thấy. Thử từ khác.",         FR:"Aucun résultat. Essayez d'autres mots.",  ZH:"未找到结果，请尝试其他词。"},
  noFindingsSel:    {EN:"No findings selected — go back to intake.",VN:"Chưa chọn phát hiện — quay lại khám.",FR:"Aucune observation — retournez à la saisie.",ZH:"未选择任何发现，请返回诊次。"},
  btnNext:          {EN:"Next →",                                  VN:"Tiếp →",                                FR:"Suivant →",                              ZH:"下一步 →"},
  btnSaveAssess:    {EN:"Save & Assess →",                         VN:"Lưu & Đánh giá →",                      FR:"Enregistrer & Évaluer →",                ZH:"保存并评估 →"},
  btnUpdateAssess:  {EN:"Update & Re-assess →",                    VN:"Cập nhật & Đánh giá lại →",             FR:"Mettre à jour & Réévaluer →",            ZH:"更新并重新评估 →"},
  btnClearData:     {EN:"🗑 Clear All Patient Data",               VN:"🗑 Xóa tất cả dữ liệu bệnh nhân",       FR:"🗑 Effacer toutes les données",           ZH:"🗑 清除所有患者数据"},
  patternAssessment:{EN:"Pattern Assessment",                      VN:"Đánh giá Chứng bệnh",                   FR:"Évaluation des syndromes",               ZH:"证型评估"},
  patternScores:    {EN:"Pattern Scores",                          VN:"Điểm số chứng bệnh",                    FR:"Scores des syndromes",                   ZH:"证型评分"},
  patternSelection: {EN:"Pattern Selection",                       VN:"Chọn chứng bệnh",                       FR:"Sélection du syndrome",                  ZH:"证型选择"},
  treatmentSummary: {EN:"Treatment Summary",VN:"TÓM TẮT ĐIỀU TRỊ",FR:"RÉSUMÉ DU TRAITEMENT",ZH:"治疗总结"},
  finalPlanSaved:   {EN:"Final plan saved",                        VN:"Đã lưu phác đồ cuối",                   FR:"Plan final enregistré",                  ZH:"最终方案已保存"},
  acuPoints:        {EN:"Acupuncture Points — Final Selection",    VN:"Huyệt đạo — Lựa chọn cuối",            FR:"Points — Sélection finale",              ZH:"针灸穴位——最终选择"},
  addPoint:         {EN:"Add point manually (e.g. LV3)",           VN:"Thêm huyệt thủ công (VD: LV3)",         FR:"Ajouter un point (ex. LV3)",             ZH:"手动添加穴位（如 LV3）"},
  selectOnePoint:   {EN:"Select at least one point to save.",      VN:"Chọn ít nhất một huyệt để lưu.",        FR:"Sélectionnez au moins un point.",        ZH:"请至少选择一个穴位以保存。"},
  aboutAAIDA:       {EN:"About AAIDA",VN:"AAIDA (Trợ lý Chẩn đoán AI Châm cứu) là một công cụ hỗ trợ lâm sàng cho Y học cổ truyền (YHCT). Nó có thể hướng dẫn tư vấn bệnh nhân, thu thập các phát hiện lâm sàng, tiến hành chẩn đoán lưỡi và mạch, chấm điểm phân loại hội chứng YHCT và đưa ra các đề xuất kế hoạch điều trị ba cấp độ, tất cả đều hoàn toàn do bác sĩ quyết định.",FR:"AIDA (Assistant de diagnostic par IA en acupuncture) est un outil d'aide à la décision clinique en médecine traditionnelle chinoise. Il facilite l'accueil du patient, le recueil des données cliniques, l'évaluation de la langue et du pouls, le calcul du score des syndromes de la MTC et génère des suggestions de traitement à trois niveaux, avec possibilité de modification par le praticien. AAIDA (Assistant de diagnostic par IA en acupuncture) est un outil d'aide à la décision clinique en médecine traditionnelle chinoise. Il facilite l'accueil du patient, le recueil des données cliniques, l'évaluation de la langue et du pouls, le calcul du",ZH:"AAIDA（针灸AI诊断助手）是一款中医临床辅助工具。它能够指导患者问诊、临床发现收集、舌诊脉诊、中医辨证评分，并生成三级治疗方案建议，且完全由医师自主决定。"},
  disclaimer:       {EN:"Important Disclaimer",VN:"Tuyên bố miễn trừ trách nhiệm  Lưu ý quan trọng AAIDA chỉ được sử dụng cho mục đích giáo dục và như một công cụ hỗ trợ ra quyết định lâm sàng dành cho các bác sĩ, thầy thuốc Y học Cổ truyền đã được cấp phép hoặc chứng nhận, cũng như sinh viên YHCT đang thực hành lâm sàng dưới sự giám sát trực tiếp của người hành nghề có chuyên môn.  Mọi gợi ý điều trị do AAIDA tạo ra chỉ mang tính chất tham khảo. Người hành nghề chịu trách nhiệm hoàn toàn đối với kế hoạch điều trị cuối cùng và mọi quyết định lâm sàng.  AAIDA không thay thế cho đào tạo chuyên môn, năng lực phán đoán lâm sàng hoặc mối quan hệ trị liệu giữa người hành nghề và bệnh nhân.  Không phải là lời khuyên y tế  Thông tin, đánh giá hội chứng và gợi ý huyệt châm cứu do AAIDA cung cấp không cấu thành lời khuyên y tế và không nên được sử dụng để thay thế cho chẩn đoán hoặc điều trị YHCT chuyên nghiệp.  Cơ sở kiến thức luôn được cập nhật  AAIDA là một công cụ lâm sàng không ngừng phát triển. Cơ sở dữ liệu về các hội chứng, dấu hiệu lâm sàng và phác đồ điều trị phản ánh kiến thức hiện có tại thời điểm công bố và sẽ tiếp tục được cập nhật khi nghiên cứu YHCT và kinh nghiệm lâm sàng tiến triển. Người dùng được khuyến khích vận dụng chuyên môn lâm sàng của mình và tham khảo các tài liệu YHCT hiện hành.   Quyền riêng tư dữ liệu Tất cả dữ liệu bệnh nhân được nhập vào AAIDA chỉ được lưu trữ cục bộ trên thiết bị của bạn. Không có thông tin bệnh nhân nào được truyền đến bất kỳ máy chủ bên ngoài nào. Người dùng có trách nhiệm tuân thủ các luật và quy định về quyền riêng tư của bệnh nhân áp dụng tại khu vực pháp lý của mình.   Ý kiến phản hồi của bạn rất quan trọng  AAIDA cam kết không ngừng cải tiến thông qua trí tuệ tập thể của cộng đồng YHCT.  Các quan sát lâm sàng, chỉnh sửa và đề xuất từ các thầy thuốc và sinh viên đều rất được hoan nghênh và sẽ góp phần hoàn thiện công cụ này vì lợi ích của tất cả người dùng.   Khi sử dụng AAIDA, bạn xác nhận rằng mình là một thầy thuốc YHCT đã được cấp phép hoặc là sinh viên đang thực hành dưới sự giám sát chuyên môn phù hợp, đồng thời bạn hiểu và chấp nhận các điều khoản này.    Phản hồi và đóng góp AAIDA là một công cụ sống động và không ngừng phát triển. Kinh nghiệm lâm sàng của bạn là nguồn lực quý giá nhất của công cụ này.  Nếu bạn nhận thấy điểm nào chưa chính xác, có đề xuất hoặc muốn đóng góp vào cơ sở kiến thức, phản hồi của bạn sẽ được trân trọng ghi nhận và sẽ góp phần định hình các phiên bản trong tương lai.",FR:"Avis de non-responsabilité Avis important AAIDA est conçu uniquement à des fins éducatives et comme outil d’aide à la décision clinique pour les praticiens de médecine traditionnelle chinoise titulaires d’un permis ou d’une certification, ainsi que pour les étudiants en MTC qui effectuent un travail clinique sous la supervision directe d’un praticien qualifié. Toutes les suggestions de traitement générées par AAIDA sont fournies à titre indicatif. Le praticien assume l’entière responsabilité du plan de traitement final et de toutes les décisions cliniques. AAIDA ne remplace ni la formation professionnelle, ni le jugement clinique, ni la relation thérapeutique entre le praticien et le patient. Aucun avis médical Les informations, les évaluations de syndromes et les suggestions de points d’acupuncture fournies par AAIDA ne constituent pas un avis médical et ne doivent pas être utilisées en remplacement d’un diagnostic ou d’un traitement professionnel en MTC. Base de connaissances en évolution AAIDA est un outil clinique en constante évolution. Sa base de données sur les syndromes, les observations cliniques et les protocoles de traitement reflète les connaissances disponibles au moment de la publication et sera mise à jour à mesure que la recherche en MTC et l’expérience clinique progresseront. Les utilisateurs sont encouragés à faire appel à leur propre expertise clinique et à consulter la littérature actuelle en MTC. Confidentialité des données Toutes les données sur les patients saisies dans AAIDA sont stockées uniquement sur votre appareil, en local. Aucune information sur les patients n’est transmise à un serveur externe. Il incombe aux utilisateurs de respecter les lois et règlements applicables en matière de confidentialité des renseignements des patients dans leur territoire de compétence. Votre rétroaction est précieuse AAIDA s’inscrit dans une démarche d’amélioration continue nourrie par l’intelligence collective de la communauté de la MTC. Les observations cliniques, les corrections et les suggestions des praticiens et des étudiants sont grandement appréciées et contribueront à améliorer cet outil au bénéfice de tous les utilisateurs. En utilisant AAIDA, vous confirmez que vous êtes un praticien de MTC dûment autorisé ou un étudiant exerçant sous une supervision qualifiée, et que vous comprenez et acceptez les présentes conditions. Rétroaction et contribution AAIDA est un outil vivant, en constante évolution. Votre expérience clinique constitue sa ressource la plus précieuse. Si vous relevez une inexactitude, avez une suggestion ou souhaitez contribuer à la base de connaissances, votre rétroaction sera accueillie avec reconnaissance et aidera à orienter les versions futures.",ZH:"免责声明 重要提示。 AAIDA 仅用于教育目的，并作为以下人员的临床决策辅助工具： 持有执业资格或认证的中医师；以及在合格执业者直接监督下进行临床工作的中医专业学生。 AAIDA 生成的所有治疗建议仅供参考。执业者对最终治疗方案和所有临床决策承担全部责任。 AAIDA 不能替代专业培训、临床判断或医患之间的治疗关系。 非医疗建议。 AAIDA 提供的资料、证候评估和穴位建议不构成医疗建议，不应作为专业中医诊断或治疗的替代方案。 知识库持续更新。 AAIDA 是一款不断发展的临床工具。其关于证候、临床发现和治疗方案的数据库反映了发布时可获得的知识，并将随着中医研究和临床经验的发展而更新。 建议用户结合自身临床专业能力，并参考最新的中医文献。 数据隐私。 输入 AAIDA 的所有患者数据仅存储在您的本地设备上。不会有任何患者信息传输到外部服务器。用户有责任遵守其所在司法管辖区适用的患者隐私法律和法规。 您的反馈非常重要。 AAIDA 致力于通过中医社区的集体智慧不断改进。 非常欢迎从业者和学生提供临床观察、修正意见和建议，这将有助于完善本工具并使所有用户受益。 使用 AAIDA 即表示您确认自己是持证中医执业者，或是在合格监督下学习的学生，并且您理解并接受这些条款。 反馈与贡献 AAIDA 是一款持续演进的工具。您的临床经验是其最宝贵的资源。 如果您发现不准确之处、有任何建议，或希望为知识库做出贡献，我们将衷心感谢您的反馈；这些意见将帮助塑造未来的版本。"},
  feedback:         {EN:"Feedback & Contributions",                VN:"Phản hồi & Đóng góp",                   FR:"Retours & Contributions",                ZH:"反馈与贡献"},
  patientData:      {EN:"Patient Data",                            VN:"Dữ liệu bệnh nhân",                     FR:"Données patients",                       ZH:"患者数据"},
  backupRestore:    {EN:"Backup & Restore",                        VN:"Sao lưu & Khôi phục",                   FR:"Sauvegarde & Restauration",              ZH:"备份与恢复"},
  exportAnalysis:   {EN:"Export for Analysis",                     VN:"Xuất để phân tích",                     FR:"Exporter pour analyse",                  ZH:"导出供分析"},
  exportJSON:       {EN:"⬇ Export JSON Backup",                    VN:"⬇ Xuất bản sao lưu JSON",               FR:"⬇ Exporter sauvegarde JSON",             ZH:"⬇ 导出 JSON 备份"},
  importJSON:       {EN:"⬆ Import JSON Backup",                    VN:"⬆ Nhập bản sao lưu JSON",               FR:"⬆ Importer sauvegarde JSON",             ZH:"⬆ 导入 JSON 备份"},
  exportExcel:      {EN:"📊 Export to Excel (.xlsx)",              VN:"📊 Xuất ra Excel (.xlsx)",               FR:"📊 Exporter en Excel (.xlsx)",           ZH:"📊 导出到 Excel (.xlsx)"},
  idleWarning:      {EN:"⏱ Returning to home screen in about 1 minute due to inactivity.",VN:"⏱ Sẽ về màn hình chính trong khoảng 1 phút.",FR:"⏱ Retour à l'accueil dans 1 minute (inactivité).",ZH:"⏱ 因无操作，约1分钟后将返回主页面。"},
  stepChief:        {EN:"Chief Complaints",                        VN:"Chủ tố",                                FR:"Motifs principaux",                      ZH:"主诉"},
  stepSymptoms:     {EN:"Symptoms",                                VN:"Triệu chứng",                           FR:"Symptômes",                              ZH:"症状"},
  stepTongue:       {EN:"Tongue & Pulse",                          VN:"Lưỡi & Mạch",                           FR:"Langue & Pouls",                         ZH:"舌象与脉象"},
  male:             {EN:"Male",                         VN:"Nam",                         FR:"Homme",                         ZH:"男"},
  female:           {EN:"Female",                       VN:"Nữ",                          FR:"Femme",                         ZH:"女"},
  genderOther:      {EN:"Other",VN:"Khác",FR:"Autre",ZH:"其他"},
  stool:            {EN:"Stool",                        VN:"Đại tiện",                    FR:"Selles",                        ZH:"大便"},
  stepReview:       {EN:"Review",                                  VN:"Xem lại",                               FR:"Récapitulatif",                          ZH:"核查"},
  tongueExam:{EN:"🫦 Tongue Examination",VN:"🫦 Khám Lưỡi",FR:"🫦 Examen de la Langue",ZH:"🫦 舌诊"},
  tongueAndPulse:{EN:"Tongue & Pulse",VN:"Lưỡi & Mạch",FR:"Langue & Pouls",ZH:"舌象与脉象"},
  tongueCoatingSec:{EN:"Tongue Coating",VN:"Rêu Lưỡi",FR:"Enduit Lingual",ZH:"舌苔"},
  tongueMoistureSec:{EN:"Tongue Moisture",VN:"Độ Ẩm Lưỡi",FR:"Humidité Linguale",ZH:"舌面湿度"},
  tongueNotesSec:{EN:"Tongue Notes",VN:"Ghi Chú Lưỡi",FR:"Notes sur la Langue",ZH:"舌象备注"},
  tongueSigns:{EN:"Tongue Signs (from Symptoms)",VN:"Dấu hiệu Lưỡi (từ Triệu chứng)",FR:"Signes Linguaux (des Symptômes)",ZH:"症状中的舌象"},
  tongueBodyPale:{EN:"Tongue body pale",VN:"Lưỡi nhạt",FR:"Corps lingual pâle",ZH:"舌体淡白"},
  tongueBodyRed:{EN:"Tongue body red",VN:"Lưỡi đỏ",FR:"Corps lingual rouge",ZH:"舌体红"},
  tongueCoatGreasy:{EN:"Tongue coating greasy",VN:"Rêu nhờn",FR:"Enduit graisseux",ZH:"舌苔腻"},
  tonguePrefix:{EN:"Tongue:",VN:"Lưỡi:",FR:"Langue:",ZH:"舌:"},
  pulsePrefix:{EN:"Pulse:",VN:"Mạch:",FR:"Pouls:",ZH:"脉:"},
  pulseQualitiesSec:{EN:"Pulse Qualities",VN:"Chất Lượng Mạch",FR:"Qualités du Pouls",ZH:"脉象"},
  pulseStrengthL:{EN:"Pulse Strength L",VN:"Mạch Trái",FR:"Force du Pouls G",ZH:"左脉力度"},
  pulseStrengthR:{EN:"Pulse Strength R",VN:"Mạch Phải",FR:"Force du Pouls D",ZH:"右脉力度"},
  pulseStrWeak:{EN:"Pulse strength weak",VN:"Mạch yếu",FR:"Pouls faible",ZH:"脉力弱"},
  pulseRelFindings:{EN:"Pulse-Related Findings",VN:"Phát hiện qua Mạch",FR:"Observations du Pouls",ZH:"脉诊相关发现"},
  pulseNotesSec:{EN:"Pulse Notes",VN:"Ghi Chú Mạch",FR:"Notes sur le Pouls",ZH:"脉象备注"},
  palpationSec:{EN:"Palpation & Clinical Observations",VN:"Sờ nắn & Quan sát Lâm sàng",FR:"Palpation & Observations Cliniques",ZH:"触诊与临床观察"},
  skinAndBody:{EN:"Skin & Body",VN:"Da & Cơ thể",FR:"Peau & Corps",ZH:"皮肤与形体"},
  sleepAndMind:{EN:"Sleep & Mind",VN:"Giấc ngủ & Tinh thần",FR:"Sommeil & Esprit",ZH:"睡眠与心神"},
  sweatingTemp:{EN:"Sweating & Temperature",VN:"Đổ mồ hôi & Nhiệt độ",FR:"Transpiration & Température",ZH:"汗出与温度"},
  headAndSenses:{EN:"Head & Senses",VN:"Đầu & Giác quan",FR:"Tête & Sens",ZH:"头部与感官"},
  lifestyleHistory:{EN:"Lifestyle & History",VN:"Lối sống & Tiền sử",FR:"Mode de vie & Antécédents",ZH:"生活方式与病史"},
  patientPrefix:{EN:"Patient:",VN:"Bệnh nhân:",FR:"Patient:",ZH:"患者:"},
  patientId:{EN:"Patient ID",VN:"Mã bệnh nhân",FR:"ID Patient",ZH:"患者编号"},
  patientName:{EN:"Patient Name",VN:"Tên bệnh nhân",FR:"Nom du patient",ZH:"患者姓名"},
  dateOfBirth:{EN:"Date of Birth",VN:"Ngày Sinh",FR:"Date de naissance",ZH:"出生日期"},
  streetAddress:{EN:"Street Address",VN:"Địa chỉ",FR:"Adresse",ZH:"街道地址"},
  postalCode:{EN:"Postal / Zip Code",VN:"Mã bưu điện",FR:"Code postal",ZH:"邮编"},
  provinceState:{EN:"Province / State",VN:"Tỉnh / Bang",FR:"Province / État",ZH:"省/州"},
  contactName:{EN:"Contact Name",VN:"Người liên hệ",FR:"Nom du contact",ZH:"紧急联系人"},
  emergencyContact:{EN:"Emergency Contact",VN:"Liên hệ khẩn cấp",FR:"Contact d'urgence",ZH:"紧急联系"},
  newPatientBtn:{EN:"New Patient",VN:"Bệnh nhân mới",FR:"Nouveau patient",ZH:"新患者"},
  savePatientBtn:{EN:"Save Patient",VN:"Lưu bệnh nhân",FR:"Enregistrer patient",ZH:"保存患者"},
  updatePatientBtn:{EN:"Update Patient",VN:"Cập nhật bệnh nhân",FR:"Mettre à jour",ZH:"更新患者"},
  editPatientBtn:{EN:"Edit Patient",VN:"Sửa bệnh nhân",FR:"Modifier patient",ZH:"编辑患者"},
  editingRecord:{EN:"Editing patient record",VN:"Đang chỉnh sửa hồ sơ",FR:"Modification du dossier",ZH:"正在编辑病历"},
  editIntakeBtn:{EN:"Edit Intake",VN:"Sửa khám bệnh",FR:"Modifier la consultation",ZH:"编辑问诊"},
  chiefComplaintColon:{EN:"Chief Complaint:",VN:"Lý do khám:",FR:"Plainte principale:",ZH:"主诉:"},
  concern1:{EN:"Concern 1:",VN:"Vấn đề 1:",FR:"Préoccupation 1:",ZH:"关注问题1:"},
  concern2:{EN:"Concern 2:",VN:"Vấn đề 2:",FR:"Préoccupation 2:",ZH:"关注问题2:"},
  illnessSinceSec:{EN:"Illness Since",VN:"Thời gian bệnh",FR:"Depuis quand",ZH:"病程"},
  practNotesSec:{EN:"Practitioner Notes",VN:"Ghi chú thầy thuốc",FR:"Notes du praticien",ZH:"医师备注"},
  recentlyOpt:{EN:"Recently",VN:"Gần đây",FR:"Récemment",ZH:"近期"},
  lessThan6m:{EN:"Less than 6 months",VN:"Dưới 6 tháng",FR:"Moins de 6 mois",ZH:"不足6个月"},
  overAYear:{EN:"Over a year",VN:"Hơn 1 năm",FR:"Plus d'un an",ZH:"超过一年"},
  findingsSec:{EN:"Findings",VN:"Phát hiện",FR:"Observations",ZH:"发现"},
  findingId:{EN:"Finding ID",VN:"Mã phát hiện",FR:"ID de l'observation",ZH:"发现编号"},
  findingName:{EN:"Finding Name *",VN:"Tên phát hiện *",FR:"Nom de l'observation *",ZH:"发现名称 *"},
  diagnosticStr:{EN:"Diagnostic Strength",VN:"Độ mạnh chẩn đoán",FR:"Force diagnostique",ZH:"诊断权重"},
  sourceFld:{EN:"Source Field",VN:"Trường nguồn",FR:"Champ source",ZH:"来源字段"},
  sourcePat:{EN:"Source Pattern",VN:"Mẫu nguồn",FR:"Modèle source",ZH:"来源模式"},
  patternLinks:{EN:"Pattern Links",VN:"Liên kết mẫu",FR:"Liens de modèle",ZH:"证型链接"},
  reviewDb:{EN:"Review DB",VN:"Xem lại CSDL",FR:"Révision BDD",ZH:"审查数据库"},
  linkFindingPat:{EN:"Link Finding to Pattern",VN:"Liên kết phát hiện với mẫu",FR:"Lier observation au modèle",ZH:"将发现链接到证型"},
  addSymptPat:{EN:"Add Symptomatic Pattern",VN:"Thêm mẫu triệu chứng",FR:"Ajouter modèle symptomatique",ZH:"添加症候模式"},
  loadAllSugg:{EN:"Load All Suggestions",VN:"Tải tất cả gợi ý",FR:"Charger toutes suggestions",ZH:"加载所有建议"},
  addFromSugg:{EN:"Add from suggestions:",VN:"Thêm từ gợi ý:",FR:"Ajouter depuis suggestions:",ZH:"从建议中添加:"},
  alsoLabel:{EN:"Also:",VN:"Cũng:",FR:"Aussi:",ZH:"另外:"},
  bestMatch:{EN:"Best match:",VN:"Phù hợp nhất:",FR:"Meilleure correspondance:",ZH:"最佳匹配:"},
  builtIn:{EN:"Built-in:",VN:"Có sẵn:",FR:"Intégré:",ZH:"内置:"},
  customLabel:{EN:"Custom",VN:"Tùy chỉnh",FR:"Personnalisé",ZH:"自定义"},
  branchSpecPts:{EN:"Branch-specific points",VN:"Huyệt đặc hiệu Tiêu",FR:"Points spécifiques Biao",ZH:"标证特定穴"},
  treatmentPlans:{EN:"Treatment Plans",VN:"Kế hoạch điều trị",FR:"Plans de traitement",ZH:"治疗方案"},
  rootPrefix:{EN:"Root:",VN:"Bản:",FR:"Racine:",ZH:"本:"},
  activeFindings2:{EN:"Active Findings (",VN:"Phát hiện hiện có (",FR:"Observations actives (",ZH:"活跃发现（"},
  armPain:{EN:"Arm pain",VN:"Đau tay",FR:"Douleur au bras",ZH:"手臂痛"},
  chestPain:{EN:"Chest pain",VN:"Đau ngực",FR:"Douleur thoracique",ZH:"胸痛"},
  coldHandsFeet:{EN:"Cold hands / feet",VN:"Tay chân lạnh",FR:"Mains / pieds froids",ZH:"手脚冰凉"},
  fingerNumb:{EN:"Fingers numbness",VN:"Tê ngón tay",FR:"Engourdissement des doigts",ZH:"手指麻木"},
  highBP:{EN:"High blood pressure",VN:"Cao huyết áp",FR:"Hypertension",ZH:"高血压"},
  highStress:{EN:"High stress",VN:"Căng thẳng cao",FR:"Stress élevé",ZH:"高度压力"},
  irregHeart:{EN:"Irregular heartbeat",VN:"Nhịp tim không đều",FR:"Rythme cardiaque irrégulier",ZH:"心律不齐"},
  irregSleep:{EN:"Irregular sleep",VN:"Ngủ không đều",FR:"Sommeil irrégulier",ZH:"睡眠不规律"},
  kneePain:{EN:"Knee pain",VN:"Đau gối",FR:"Douleur au genou",ZH:"膝痛"},
  lowBP:{EN:"Low blood pressure",VN:"Huyết áp thấp",FR:"Hypotension",ZH:"低血压"},
  nightShifts:{EN:"Night shifts",VN:"Ca đêm",FR:"Travail de nuit",ZH:"夜班"},
  poorDiet:{EN:"Poor diet",VN:"Ăn uống kém",FR:"Mauvaise alimentation",ZH:"饮食不良"},
  sadSighing:{EN:"Sad / Sighing often",VN:"Buồn / Hay thở dài",FR:"Triste / Soupirs fréquents",ZH:"悲伤/常叹气"},
  sciaticPain:{EN:"Sciatic nerve pain",VN:"Đau thần kinh tọa",FR:"Douleur sciatique",ZH:"坐骨神经痛"},
  shoulderPain:{EN:"Shoulder pain",VN:"Đau vai",FR:"Douleur à l'épaule",ZH:"肩痛"},
  stiffNeck:{EN:"Stiff neck / Neck pain",VN:"Cứng cổ / Đau cổ",FR:"Nuque raide / Cervicalgie",ZH:"颈项强痛"},
  tenniElbow:{EN:"Tennis elbow",VN:"Khuỷu tay tennis",FR:"Épicondylite",ZH:"网球肘"},
  toesNumb:{EN:"Toes numbness",VN:"Tê ngón chân",FR:"Engourdissement des orteils",ZH:"脚趾麻木"},
  wristPain:{EN:"Wrist pain",VN:"Đau cổ tay",FR:"Douleur au poignet",ZH:"腕痛"},
  mensHealth:{EN:"Men's Health",VN:"Sức khỏe Nam giới",FR:"Santé Masculine",ZH:"男性健康"},
  womensHealth:{EN:"Women's Health",VN:"Sức khỏe Nữ giới",FR:"Santé Féminine",ZH:"女性健康"},
  tonifyKidYang:{EN:"Tonify Kidney Yang",VN:"Bổ Thận Dương",FR:"Tonifier le Yang des Reins",ZH:"补肾阳"},
  tonifyQiBlood:{EN:"Tonify Qi and Blood",VN:"Bổ Khí Huyết",FR:"Tonifier le Qi et le Sang",ZH:"补气血"},
  tonifyQiYang:{EN:"Tonify Qi and Yang",VN:"Bổ Khí Dương",FR:"Tonifier le Qi et le Yang",ZH:"补气阳"},
  tonifySplQi:{EN:"Tonify Spleen Qi",VN:"Bổ Tỳ Khí",FR:"Tonifier le Qi de la Rate",ZH:"补脾气"},
  warmTonifyYang:{EN:"Warm and Tonify Yang",VN:"Ôn Bổ Dương",FR:"Réchauffer et Tonifier le Yang",ZH:"温补阳气"},
  noChiefComp:{EN:"No chief complaint",VN:"Không có lý do khám",FR:"Aucune plainte principale",ZH:"无主诉"},
  noIntakesYet:{EN:"No intakes yet",VN:"Chưa có lần khám",FR:"Aucune consultation",ZH:"暂无问诊记录"},
  noPatientsYet:{EN:"No patients yet",VN:"Chưa có bệnh nhân",FR:"Aucun patient",ZH:"暂无患者"},
  noPlansYet:{EN:"No plans yet",VN:"Chưa có kế hoạch",FR:"Aucun plan",ZH:"暂无方案"},
  noMedAdvice:{EN:"No Medical Advice.",VN:"Không phải lời khuyên y tế.",FR:"Pas de conseil médical.",ZH:"非医疗建议。"},
  feedbackMatter:{EN:"Your Feedback Matters.",VN:"Phản hồi của bạn rất quan trọng.",FR:"Votre avis compte.",ZH:"您的反馈很重要。"},
  readDisclaimer:{EN:"Read full disclaimer ▼",VN:"Đọc đầy đủ tuyên bố ▼",FR:"Lire avertissement complet ▼",ZH:"阅读完整免责声明 ▼"},
  hideDisclaimer:{EN:"Hide full disclaimer ▲",VN:"Thu gọn tuyên bố ▲",FR:"Masquer l'avertissement ▲",ZH:"收起免责声明 ▲"},
  newFindingsInfo:{EN:"New findings are immediately available in the intake chips and Smart Finder.",VN:"Các phát hiện mới có sẵn ngay trong chip triệu chứng và Tìm kiếm thông minh.",FR:"Les nouvelles observations sont immédiatement disponibles dans les puces et le Chercheur intelligent.",ZH:"新发现立即可用于问诊芯片和智能搜索。"},
  selectTongueFnd:{EN:"Select any tongue-related findings observed during symptom inquiry.",VN:"Chọn các dấu hiệu lưỡi quan sát được trong quá trình hỏi bệnh.",FR:"Sélectionnez les observations linguales notées lors de l'anamnèse.",ZH:"选择症状询问中观察到的舌象发现。"},
  noPointsYet:{EN:"No points selected yet. Load suggestions above or add manually below.",VN:"Chưa chọn huyệt. Tải gợi ý ở trên hoặc thêm thủ công bên dưới.",FR:"Aucun point sélectionné. Chargez les suggestions ou ajoutez manuellement.",ZH:"尚未选穴。请加载建议或在下方手动添加。"},
  noSympMatch:{EN:"No symptomatic match found. Describe more specifically or check spelling.",VN:"Không tìm thấy kết quả. Mô tả cụ thể hơn hoặc kiểm tra chính tả.",FR:"Aucune correspondance. Décrivez plus précisément ou vérifiez l'orthographe.",ZH:"未找到匹配项。请更具体地描述或检查拼写。"},
  allowPopups:{EN:"Please allow pop-ups for this site to generate the PDF report.",VN:"Vui lòng cho phép cửa sổ bật lên để tạo báo cáo PDF.",FR:"Veuillez autoriser les fenêtres contextuelles pour générer le rapport PDF.",ZH:"请允许弹出窗口以生成PDF报告。"},
  exportExcelDesc:{EN:"Export patients, intakes, and treatment plans to Excel (.xlsx)",VN:"Xuất bệnh nhân, lần khám và kế hoạch điều trị sang Excel (.xlsx)",FR:"Exporter patients, consultations et plans de traitement vers Excel (.xlsx)",ZH:"将患者、问诊和治疗方案导出至Excel (.xlsx)"},
  clearDataConfirm:{EN:"Clear all patient data? This cannot be undone.",VN:"Xóa toàn bộ dữ liệu bệnh nhân? Không thể hoàn tác.",FR:"Effacer toutes les données patients? Impossible à annuler.",ZH:"清除所有患者数据？此操作无法撤销。"},
  finalPlan:    {EN:"Final Plan",VN:"Phác đồ cuối",FR:"Plan final",ZH:"最终方案"},
  branchLbl:    {EN:"Branch",VN:"Tiêu",FR:"Branche",ZH:"标"}
};

const GROUP_I18N = {
  "Energy & Fatigue":"grpEnergy","Digestion":"grpDigestion","Sleep & Mind":"grpSleep",
  "Pain":"grpPain","Head & Senses":"grpHead","Sweating & Temperature":"grpSweating",
  "Urinary":"grpUrinary","Respiratory":"grpRespiratory",
  "Skin & Body":"grpSkin","Emotional":"grpEmotional","Circulatory":"grpCirculatory",
  "Men's Health":"grpMens","Women's Health":"grpWomens",
};

let _lang = "EN";
function t(key) { const e=I18N[key]; return e ? (e[_lang]||e.EN||key) : key; }

// Translate a treatment principle string using PATTERN_PRINCIPLES lookup
const PATTERN_I18N = {
  "Qi Deficiency":{VN:"Hư Khí",FR:"Déficience du Qi",ZH:"气虚"},
  "Lung Qi Deficiency":{VN:"Hư Phế Khí",FR:"Déficience du Qi du Poumon",ZH:"肺气虚"},
  "Blood Deficiency":{VN:"Huyết Hư",FR:"Déficience du Sang",ZH:"血虚"},
  "Blood Stasis":{VN:"Huyết Ứ",FR:"Stase de Sang",ZH:"血瘀"},
  "Yang Deficiency":{VN:"Dương Hư",FR:"Déficience du Yang",ZH:"阳虚"},
  "Damp Accunulation":{VN:"Thấp Tích",FR:"Accumulation d’Humidité",ZH:"湿聚"},
  "Liver Qi Stagnation":{VN:"Can Khí Uất",FR:"Stagnation du Qi du Foie",ZH:"肝气郁结"},
  "Liver Blood Deficiency":{VN:"Can Huyết Hư",FR:"Déficience du Sang du Foie",ZH:"肝血虚"},
  "Liver Yin Deficiency":{VN:"Can Âm Hư",FR:"Déficience du Yin du Foie",ZH:"肝阴虚"},
  "Liver Yang Rising":{VN:"Can Dương Thăng",FR:"Montée du Yang du Foie",ZH:"肝阳上亢"},
  "Liver Fire Blazing":{VN:"Can Hỏa Vượng",FR:"Feu du Foie Flambant",ZH:"肝火炽盛"},
  "Liver Wind":{VN:"Can Phong",FR:"Vent du Foie",ZH:"肝风"},
  "Liver Cold Stagnation":{VN:"Can Hàn Ngưng Trệ",FR:"Stagnation de Froid dans le Foie",ZH:"肝寒凝滞"},
  "Liver Damp-Heat":{VN:"Can Thấp Nhiệt",FR:"Humidité-Chaleur du Foie",ZH:"肝湿热"},
  "Heart Qi Deficiency":{VN:"Tâm Khí Hư",FR:"Déficience du Qi du Cœur",ZH:"心气虚"},
  "Heart Yang Deficiency":{VN:"Tâm Dương Hư",FR:"Déficience du Yang du Cœur",ZH:"心阳虚"},
  "Heart Blood Deficiency":{VN:"Tâm Huyết Hư",FR:"Déficience du Sang du Cœur",ZH:"心血虚"},
  "Heart Yin Deficiency":{VN:"Tâm Âm Hư",FR:"Déficience du Yin du Cœur",ZH:"心阴虚"},
  "Heart Fire Blazing":{VN:"Tâm Hỏa Vượng",FR:"Feu du Cœur Flambant",ZH:"心火炽盛"},
  "Phlegm-Fire Harassing Heart":{VN:"Đàm Hỏa Nhiễu Tâm",FR:"Glaires-Feu Troublant le Cœur",ZH:"痰火扰心"},
  "Phlegm Misting the Mind":{VN:"Đàm Trọc Nhiễu Tâm",FR:"Glaires Voilant l’Ouverture du Cœur",ZH:"痰蒙心窍"},
  "Spleen Qi Deficiency":{VN:"Tỳ Khí Hư",FR:"Déficience du Qi de la Rate",ZH:"脾气虚"},
  "Spleen Yang Deficiency":{VN:"Tỳ Dương Hư",FR:"Déficience du Yang de la Rate",ZH:"脾阳虚"},
  "Spleen Qi Sinking":{VN:"Tỳ Khí Hãm",FR:"Affaissement du Qi de la Rate",ZH:"脾气下陷"},
  "Spleen Not Controlling Blood":{VN:"Tỳ Bất Thống Huyết",FR:"Rate Ne Contrôlant pas le Sang",ZH:"脾不统血"},
  "Spleen Dampness":{VN:"Tỳ Thấp",FR:"Humidité de la Rate",ZH:"脾湿"},
  "Spleen Damp-Heat":{VN:"Tỳ Thấp Nhiệt",FR:"Humidité-Chaleur de la Rate",ZH:"脾湿热"},
  "Lung Qi Deficiency":{VN:"Hư Phế Khí",FR:"Déficience du Qi du Poumon",ZH:"肺气虚"},
  "Lung Yin Deficiency":{VN:"Phế Âm Hư",FR:"Déficience du Yin du Poumon",ZH:"肺阴虚"},
  "Wind-Cold Invasion":{VN:"Phong Hàn Phạm Phế",FR:"Atteinte de Vent-Froid",ZH:"风寒犯肺"},
  "Wind-Heat Invasion":{VN:"Phong Nhiệt Phạm Phế",FR:"Atteinte de Vent-Chaleur",ZH:"风热犯肺"},
  "Lung Phlegm-Damp":{VN:"Đàm Thấp Phế",FR:"Glaires-Humidité dans le Poumon",ZH:"痰湿阻肺"},
  "Lung Phlegm-Heat":{VN:"Đàm Nhiệt Phế",FR:"Glaires-Chaleur dans le Poumon",ZH:"痰热壅肺"},
  "Kidney Yang Deficiency":{VN:"Thận Dương Hư",FR:"Déficience du Yang du Rein",ZH:"肾阳虚"},
  "Kidney Yin Deficiency":{VN:"Thận Âm Hư",FR:"Déficience du Yin du Rein",ZH:"肾阴虚"},
  "Kidney Qi Deficiency":{VN:"Thận Khí Hư",FR:"Déficience du Qi du Rein",ZH:"肾气虚"},
  "Kidney Essence Deficiency":{VN:"Thận Tinh Hư",FR:"Déficience de l’Essence du Rein",ZH:"肾精虚"},
  "Kidney Failing to Grasp Qi":{VN:"Thận Nạp Khí Kém",FR:"Rein Incapable de Recevoir le Qi",ZH:"肾不纳气"},
  "Stomach Heat":{VN:"Vị Nhiệt",FR:"Chaleur de l’Estomac",ZH:"胃热"},
  "Stomach Yin Deficiency":{VN:"Vị Âm Hư",FR:"Déficience du Yin de l’Estomac",ZH:"胃阴虚"},
  "Food Stagnation":{VN:"Thực Tích",FR:"Stagnation Alimentaire",ZH:"食积"},
  "Stomach Cold":{VN:"Vị Hàn",FR:"Froid de l’Estomac",ZH:"胃寒"},
  "Gallbladder Damp-Heat":{VN:"Đởm Thấp Nhiệt",FR:"Humidité-Chaleur de la Vésicule Biliaire",ZH:"胆湿热"},
  "Gallbladder Qi Deficiency":{VN:"Đởm Khí Hư",FR:"Déficience du Qi de la Vésicule Biliaire",ZH:"胆气虚"},
  "SI Qi Pain":{VN:"Tiểu Trường Khí Trệ",FR:"Douleur par Blocage du Qi de l’IG",ZH:"小肠气滞"},
  "SI Qi Tied":{VN:"Tiểu Trường Khí Kết",FR:"Blocage Sévère du Qi de l’IG",ZH:"小肠气结"},
  "SI Damp-Heat":{VN:"Tiểu Trường Thấp Nhiệt",FR:"Humidité-Chaleur de l’IG",ZH:"小肠湿热"},
  "LI Damp-Heat":{VN:"Đại Trường Thấp Nhiệt",FR:"Humidité-Chaleur du Gros Intestin",ZH:"大肠湿热"},
  "LI Dryness":{VN:"Đại Trường Táo",FR:"Sécheresse du Gros Intestin",ZH:"大肠燥"},
  "LI Cold":{VN:"Đại Trường Hàn",FR:"Froid du Gros Intestin",ZH:"大肠寒"},
  "Bladder Damp-Heat":{VN:"Bàng Quang Thấp Nhiệt",FR:"Humidité-Chaleur de la Vessie",ZH:"膀胱湿热"},
  "Bladder Damp-Cold":{VN:"Bàng Quang Thấp Hàn",FR:"Humidité-Froid de la Vessie",ZH:"膀胱湿寒"},
  "PC Heat":{VN:"Tâm Bào Nhiệt",FR:"Chaleur du Péricarde",ZH:"心包热"},
  "PC Blood Stasis":{VN:"Tâm Bào Huyết Ứ",FR:"Stase de Sang du Péricarde",ZH:"心包瘀血"},
  "Upper Jiao Heat":{VN:"Thượng Tiêu Nhiệt",FR:"Chaleur du Réchauffeur Supérieur",ZH:"上焦热"},
  "Middle Jiao Damp-Heat":{VN:"Trung Tiêu Thấp Nhiệt",FR:"Humidité-Chaleur du Réchauffeur Moyen",ZH:"中焦湿热"},
  "Lower Jiao Damp-Heat":{VN:"Hạ Tiêu Thấp Nhiệt",FR:"Humidité-Chaleur du Réchauffeur Inférieur",ZH:"下焦湿热"},
  "Qi Deficiency":{VN:"Khí Hư",FR:"Déficience du Qi",ZH:"气虚"},
  "Qi Stagnation":{VN:"Khí Uất",FR:"Stagnation du Qi",ZH:"气郁"},
  "Qi Sinking":{VN:"Khí Hãm",FR:"Affaissement du Qi",ZH:"气陷"},
  "Qi Rebellion":{VN:"Khí Nghịch",FR:"Qi Rebelle",ZH:"气逆"},
  "Blood Deficiency":{VN:"Huyết Hư",FR:"Déficience du Sang",ZH:"血虚"},
  "Blood Stasis":{VN:"Huyết Ứ",FR:"Stase de Sang",ZH:"血瘀"},
  "Blood Heat":{VN:"Huyết Nhiệt",FR:"Chaleur dans le Sang",ZH:"血热"},
  "Dampness":{VN:"Thấp",FR:"Humidité",ZH:"湿"},
  "Phlegm":{VN:"Đàm",FR:"Glaires",ZH:"痰"},
  "Dryness":{VN:"Táo",FR:"Sécheresse",ZH:"燥"},
  "Water Retention":{VN:"Thủy Ứ",FR:"Rétention d’Eau",ZH:"水肿"},
  "Taiyang Wind Attack":{VN:"Thái Dương Trúng Phong",FR:"Atteinte Vent au Taiyang",ZH:"太阳中风"},
  "Taiyang Cold Damage":{VN:"Thái Dương Thương Hàn",FR:"Atteinte Froid au Taiyang",ZH:"太阳伤寒"},
  "Yangming Channel Heat":{VN:"Dương Minh Kinh Nhiệt",FR:"Chaleur du Méridien Yangming",ZH:"阳明经热"},
  "Yangming Organ Heat":{VN:"Dương Minh Phủ Nhiệt",FR:"Chaleur des Organes Yangming",ZH:"阳明腑热"},
  "Shaoyang":{VN:"Shao Dương",FR:"Shaoyang",ZH:"少阳"},
  "Taiyin":{VN:"Thái Âm",FR:"Taiyin",ZH:"太阴"},
  "Shaoyin Cold Transformation":{VN:"Shao Âm Hàn Hóa",FR:"Transformation Froid du Shaoyin",ZH:"少阴寒化"},
  "Shaoyin Heat Transformation":{VN:"Shao Âm Nhiệt Hóa",FR:"Transformation Chaleur du Shaoyin",ZH:"少阴热化"},
  "Jueyin":{VN:"Quyết Âm",FR:"Jueyin",ZH:"厥阴"},
  "Wei Level Heat":{VN:"Vệ Phần Nhiệt",FR:"Chaleur au Niveau Wei",ZH:"卫分热"},
  "Qi Level Heat":{VN:"Khí Phần Nhiệt",FR:"Chaleur au Niveau Qi",ZH:"气分热"},
  "Ying Level Heat":{VN:"Dinh Phần Nhiệt",FR:"Chaleur au Niveau Ying",ZH:"营分热"},
  "Xue Level Heat":{VN:"Huyết Phần Nhiệt",FR:"Chaleur au Niveau Xue",ZH:"血分热"},
  "Upper Jiao Heat":{VN:"Thượng Tiêu Nhiệt",FR:"Chaleur du Réchauffeur Supérieur",ZH:"上焦热"},
  "Middle Jiao Damp-Heat":{VN:"Trung Tiêu Thấp Nhiệt",FR:"Humidité-Chaleur du Réchauffeur Moyen",ZH:"中焦湿热"},
  "Lower Jiao Damp-Heat":{VN:"Hạ Tiêu Thấp Nhiệt",FR:"Humidité-Chaleur du Réchauffeur Inférieur",ZH:"下焦湿热"},
  "Lower Jiao Heat in Blood":{VN:"Hạ Tiêu Huyết Nhiệt",FR:"Chaleur dans le Sang du Réchauffeur Inférieur",ZH:"下焦血热"},
  "Upper Jiao Heat Injuring Fluids":{VN:"Thượng Tiêu Nhiệt Thương Tân",FR:"Chaleur du Réchauffeur Supérieur Lésant les Liquides",ZH:"上焦热伤津"},
  "Lower Jiao Water Accumulation":{VN:"Hạ Tiêu Thủy Ứ",FR:"Accumulation d’Eau dans le Réchauffeur Inférieur",ZH:"下焦水停"},
  "Brain Essence Deficiency":{VN:"Tinh Não Hư",FR:"Déficience de l’Essence du Cerveau",ZH:"脑精虚"},
  "Bone Marrow Deficiency":{VN:"Tủy Cốt Hư",FR:"Déficience de la Moelle Osseuse",ZH:"骨髓虚"},
  "Uterus Blood Deficiency":{VN:"Tử Cung Huyết Hư",FR:"Déficience du Sang de l’Utérus",ZH:"子宫血虚"},
  "Uterus Yin Deficiency":{VN:"Tử Cung Âm Hư",FR:"Déficience du Yin de l’Utérus",ZH:"子宫阴虚"},
  "Uterus Cold":{VN:"Tử Cung Hàn",FR:"Froid dans l’Utérus",ZH:"子宫寒"},
  "Wind-Heat with Lung Qi Deficiency":{VN:"Phong Nhiệt kèm Phế Khí Hư",FR:"Vent-Chaleur avec Déficience du Qi du Poumon",ZH:"风热兼肺气虚"},
  "Phlegm-Heat in Lungs":{VN:"Đàm Nhiệt Phế",FR:"Glaires-Chaleur dans les Poumons",ZH:"痰热壅肺"},
  "Phlegm-Damp with Lung Qi Deficiency":{VN:"Đàm Thấp kèm Phế Khí Hư",FR:"Glaires-Humidité avec Déficience du Qi du Poumon",ZH:"痰湿兼肺气虚"},
  "Spleen Yang Deficiency with Dampness":{VN:"Tỳ Dương Hư kèm Thấp",FR:"Déficience du Yang de la Rate avec Humidité",ZH:"脾阳虚夹湿"},
  "Liver Qi Stagnation with Spleen Deficiency":{VN:"Can Khí Uất kèm Tỳ Hư",FR:"Stagnation du Qi du Foie avec Déficience de la Rate",ZH:"肝气郁结兼脾虚"},
  "Liver Yin Deficiency with Empty Heat":{VN:"Can Âm Hư kèm Hư Nhiệt",FR:"Déficience du Yin du Foie avec Chaleur Vide",ZH:"肝阴虚兼虚热"},
  "Liver Yang Rising with Kidney Yin Deficiency":{VN:"Can Dương Thăng kèm Thận Âm Hư",FR:"Montée du Yang du Foie avec Déficience du Yin du Rein",ZH:"肝阳上亢兼肾阴虚"},
  "Liver Overacting on Spleen":{VN:"Can Thừa Khắc Tỳ",FR:"Le Foie Insultant la Rate",ZH:"肝乘脾"},
  "Lung and Kidney Qi Deficiency":{VN:"Phế Thận Khí Hư",FR:"Déficience du Qi du Poumon et du Rein",ZH:"肺肾气虚"},
  "Lung and Kidney Yin Deficiency":{VN:"Phế Thận Âm Hư",FR:"Déficience du Yin du Poumon et du Rein",ZH:"肺肾阴虚"},
  "Heart and Spleen Blood Deficiency":{VN:"Tâm Tỳ Huyết Hư",FR:"Déficience du Sang du Cœur et de la Rate",ZH:"心脾血虚"},
  "Heart and Kidney Yin Deficiency":{VN:"Tâm Thận Âm Hư",FR:"Déficience du Yin du Cœur et du Rein",ZH:"心肾阴虚"},
  "Phlegm Obstructing Heart":{VN:"Đàm Trệ Tâm",FR:"Glaires Obstruant le Cœur",ZH:"痰阻心脉"},
  "Heart Blood Stasis":{VN:"Tâm Huyết Ứ",FR:"Stase de Sang du Cœur",ZH:"心血瘀阻"},
  "Heart and Lung Qi Deficiency":{VN:"Tâm Phế Khí Hư",FR:"Déficience du Qi du Cœur et du Poumon",ZH:"心肺气虚"},
  "Spleen and Kidney Yang Deficiency":{VN:"Tỳ Thận Dương Hư",FR:"Déficience du Yang de la Rate et du Rein",ZH:"脾肾阳虚"},
  "Spleen and Lung Qi Deficiency":{VN:"Tỳ Phế Khí Hư",FR:"Déficience du Qi de la Rate et du Poumon",ZH:"脾肺气虚"},
  "Liver and Kidney Blood Deficiency":{VN:"Can Thận Huyết Hư",FR:"Déficience du Sang du Foie et du Rein",ZH:"肝肾血虚"},
  "Liver and Kidney Yin Deficiency":{VN:"Can Thận Âm Hư",FR:"Déficience du Yin du Foie et du Rein",ZH:"肝肾阴虚"}
};
const PATTERN_I18N_ID = {
  "1":{EN:"Qi Deficiency",VN:"Hư Khí",FR:"Déficience du Qi",ZH:"气虚"},
  "2":{EN:"Lung Qi Deficiency",VN:"Hư Phế Khí",FR:"Déficience du Qi du Poumon",ZH:"肺气虚"},
  "3":{EN:"Blood Deficiency",VN:"Huyết Hư",FR:"Déficience du Sang",ZH:"血虚"},
  "4":{EN:"Blood Stasis",VN:"Huyết Ứ",FR:"Stase de Sang",ZH:"血瘀"},
  "5":{EN:"Yang Deficiency",VN:"Dương Hư",FR:"Déficience du Yang",ZH:"阳虚"},
  "6":{EN:"Damp Accunulation",VN:"Thấp Tích",FR:"Accumulation d’Humidité",ZH:"湿聚"},
  "8":{EN:"Liver Qi Stagnation",VN:"Can Khí Uất",FR:"Stagnation du Qi du Foie",ZH:"肝气郁结"},
  "9":{EN:"Liver Blood Deficiency",VN:"Can Huyết Hư",FR:"Déficience du Sang du Foie",ZH:"肝血虚"},
  "10":{EN:"Liver Yin Deficiency",VN:"Can Âm Hư",FR:"Déficience du Yin du Foie",ZH:"肝阴虚"},
  "11":{EN:"Liver Yang Rising",VN:"Can Dương Thăng",FR:"Montée du Yang du Foie",ZH:"肝阳上亢"},
  "12":{EN:"Liver Fire Blazing",VN:"Can Hỏa Vượng",FR:"Feu du Foie Flambant",ZH:"肝火炽盛"},
  "13":{EN:"Liver Wind",VN:"Can Phong",FR:"Vent du Foie",ZH:"肝风"},
  "14":{EN:"Liver Cold Stagnation",VN:"Can Hàn Ngưng Trệ",FR:"Stagnation de Froid dans le Foie",ZH:"肝寒凝滞"},
  "15":{EN:"Liver Damp-Heat",VN:"Can Thấp Nhiệt",FR:"Humidité-Chaleur du Foie",ZH:"肝湿热"},
  "16":{EN:"Heart Qi Deficiency",VN:"Tâm Khí Hư",FR:"Déficience du Qi du Cœur",ZH:"心气虚"},
  "17":{EN:"Heart Yang Deficiency",VN:"Tâm Dương Hư",FR:"Déficience du Yang du Cœur",ZH:"心阳虚"},
  "18":{EN:"Heart Blood Deficiency",VN:"Tâm Huyết Hư",FR:"Déficience du Sang du Cœur",ZH:"心血虚"},
  "19":{EN:"Heart Yin Deficiency",VN:"Tâm Âm Hư",FR:"Déficience du Yin du Cœur",ZH:"心阴虚"},
  "20":{EN:"Heart Fire Blazing",VN:"Tâm Hỏa Vượng",FR:"Feu du Cœur Flambant",ZH:"心火炽盛"},
  "21":{EN:"Phlegm-Fire Harassing Heart",VN:"Đàm Hỏa Nhiễu Tâm",FR:"Glaires-Feu Troublant le Cœur",ZH:"痰火扰心"},
  "22":{EN:"Phlegm Misting the Mind",VN:"Đàm Trọc Nhiễu Tâm",FR:"Glaires Voilant l’Ouverture du Cœur",ZH:"痰蒙心窍"},
  "23":{EN:"Spleen Qi Deficiency",VN:"Tỳ Khí Hư",FR:"Déficience du Qi de la Rate",ZH:"脾气虚"},
  "24":{EN:"Spleen Yang Deficiency",VN:"Tỳ Dương Hư",FR:"Déficience du Yang de la Rate",ZH:"脾阳虚"},
  "25":{EN:"Spleen Qi Sinking",VN:"Tỳ Khí Hãm",FR:"Affaissement du Qi de la Rate",ZH:"脾气下陷"},
  "26":{EN:"Spleen Not Controlling Blood",VN:"Tỳ Bất Thống Huyết",FR:"Rate Ne Contrôlant pas le Sang",ZH:"脾不统血"},
  "27":{EN:"Spleen Dampness",VN:"Tỳ Thấp",FR:"Humidité de la Rate",ZH:"脾湿"},
  "28":{EN:"Spleen Damp-Heat",VN:"Tỳ Thấp Nhiệt",FR:"Humidité-Chaleur de la Rate",ZH:"脾湿热"},
  "29":{EN:"Lung Qi Deficiency",VN:"Hư Phế Khí",FR:"Déficience du Qi du Poumon",ZH:"肺气虚"},
  "30":{EN:"Lung Yin Deficiency",VN:"Phế Âm Hư",FR:"Déficience du Yin du Poumon",ZH:"肺阴虚"},
  "31":{EN:"Wind-Cold Invasion",VN:"Phong Hàn Phạm Phế",FR:"Atteinte de Vent-Froid",ZH:"风寒犯肺"},
  "32":{EN:"Wind-Heat Invasion",VN:"Phong Nhiệt Phạm Phế",FR:"Atteinte de Vent-Chaleur",ZH:"风热犯肺"},
  "33":{EN:"Lung Phlegm-Damp",VN:"Đàm Thấp Phế",FR:"Glaires-Humidité dans le Poumon",ZH:"痰湿阻肺"},
  "34":{EN:"Lung Phlegm-Heat",VN:"Đàm Nhiệt Phế",FR:"Glaires-Chaleur dans le Poumon",ZH:"痰热壅肺"},
  "35":{EN:"Kidney Yang Deficiency",VN:"Thận Dương Hư",FR:"Déficience du Yang du Rein",ZH:"肾阳虚"},
  "36":{EN:"Kidney Yin Deficiency",VN:"Thận Âm Hư",FR:"Déficience du Yin du Rein",ZH:"肾阴虚"},
  "37":{EN:"Kidney Qi Deficiency",VN:"Thận Khí Hư",FR:"Déficience du Qi du Rein",ZH:"肾气虚"},
  "38":{EN:"Kidney Essence Deficiency",VN:"Thận Tinh Hư",FR:"Déficience de l’Essence du Rein",ZH:"肾精虚"},
  "39":{EN:"Kidney Failing to Grasp Qi",VN:"Thận Nạp Khí Kém",FR:"Rein Incapable de Recevoir le Qi",ZH:"肾不纳气"},
  "40":{EN:"Stomach Heat",VN:"Vị Nhiệt",FR:"Chaleur de l’Estomac",ZH:"胃热"},
  "41":{EN:"Stomach Yin Deficiency",VN:"Vị Âm Hư",FR:"Déficience du Yin de l’Estomac",ZH:"胃阴虚"},
  "42":{EN:"Food Stagnation",VN:"Thực Tích",FR:"Stagnation Alimentaire",ZH:"食积"},
  "43":{EN:"Stomach Cold",VN:"Vị Hàn",FR:"Froid de l’Estomac",ZH:"胃寒"},
  "44":{EN:"Gallbladder Damp-Heat",VN:"Đởm Thấp Nhiệt",FR:"Humidité-Chaleur de la Vésicule Biliaire",ZH:"胆湿热"},
  "45":{EN:"Gallbladder Qi Deficiency",VN:"Đởm Khí Hư",FR:"Déficience du Qi de la Vésicule Biliaire",ZH:"胆气虚"},
  "46":{EN:"SI Qi Pain",VN:"Tiểu Trường Khí Trệ",FR:"Douleur par Blocage du Qi de l’IG",ZH:"小肠气滞"},
  "47":{EN:"SI Qi Tied",VN:"Tiểu Trường Khí Kết",FR:"Blocage Sévère du Qi de l’IG",ZH:"小肠气结"},
  "48":{EN:"SI Damp-Heat",VN:"Tiểu Trường Thấp Nhiệt",FR:"Humidité-Chaleur de l’IG",ZH:"小肠湿热"},
  "49":{EN:"LI Damp-Heat",VN:"Đại Trường Thấp Nhiệt",FR:"Humidité-Chaleur du Gros Intestin",ZH:"大肠湿热"},
  "50":{EN:"LI Dryness",VN:"Đại Trường Táo",FR:"Sécheresse du Gros Intestin",ZH:"大肠燥"},
  "51":{EN:"LI Cold",VN:"Đại Trường Hàn",FR:"Froid du Gros Intestin",ZH:"大肠寒"},
  "52":{EN:"Bladder Damp-Heat",VN:"Bàng Quang Thấp Nhiệt",FR:"Humidité-Chaleur de la Vessie",ZH:"膀胱湿热"},
  "53":{EN:"Bladder Damp-Cold",VN:"Bàng Quang Thấp Hàn",FR:"Humidité-Froid de la Vessie",ZH:"膀胱湿寒"},
  "54":{EN:"PC Heat",VN:"Tâm Bào Nhiệt",FR:"Chaleur du Péricarde",ZH:"心包热"},
  "55":{EN:"PC Blood Stasis",VN:"Tâm Bào Huyết Ứ",FR:"Stase de Sang du Péricarde",ZH:"心包瘀血"},
  "56":{EN:"Upper Jiao Heat",VN:"Thượng Tiêu Nhiệt",FR:"Chaleur du Réchauffeur Supérieur",ZH:"上焦热"},
  "57":{EN:"Dyspnea / SOB",VN:"Khó thở / SOB",FR:"Dyspnée / SOB",ZH:"气促/呼吸困难"},
  "58":{EN:"Lower Jiao Damp-Heat",VN:"Hạ Tiêu Thấp Nhiệt",FR:"Humidité-Chaleur du Réchauffeur Inférieur",ZH:"下焦湿热"},
  "59":{EN:"Qi Deficiency",VN:"Khí Hư",FR:"Déficience du Qi",ZH:"气虚"},
  "60":{EN:"Qi Stagnation",VN:"Khí Uất",FR:"Stagnation du Qi",ZH:"气郁"},
  "61":{EN:"Qi Sinking",VN:"Khí Hãm",FR:"Affaissement du Qi",ZH:"气陷"},
  "62":{EN:"Qi Rebellion",VN:"Khí Nghịch",FR:"Qi Rebelle",ZH:"气逆"},
  "63":{EN:"Blood Deficiency",VN:"Huyết Hư",FR:"Déficience du Sang",ZH:"血虚"},
  "64":{EN:"Blood Stasis",VN:"Huyết Ứ",FR:"Stase de Sang",ZH:"血瘀"},
  "65":{EN:"Blood Heat",VN:"Huyết Nhiệt",FR:"Chaleur dans le Sang",ZH:"血热"},
  "66":{EN:"Dampness",VN:"Thấp",FR:"Humidité",ZH:"湿"},
  "67":{EN:"Phlegm",VN:"Đàm",FR:"Glaires",ZH:"痰"},
  "68":{EN:"Dryness",VN:"Táo",FR:"Sécheresse",ZH:"燥"},
  "69":{EN:"Water Retention",VN:"Thủy Ứ",FR:"Rétention d’Eau",ZH:"水肿"},
  "70":{EN:"Taiyang Wind Attack",VN:"Thái Dương Trúng Phong",FR:"Atteinte Vent au Taiyang",ZH:"太阳中风"},
  "71":{EN:"Taiyang Cold Damage",VN:"Thái Dương Thương Hàn",FR:"Atteinte Froid au Taiyang",ZH:"太阳伤寒"},
  "72":{EN:"Yangming Channel Heat",VN:"Dương Minh Kinh Nhiệt",FR:"Chaleur du Méridien Yangming",ZH:"阳明经热"},
  "73":{EN:"Yangming Organ Heat",VN:"Dương Minh Phủ Nhiệt",FR:"Chaleur des Organes Yangming",ZH:"阳明腑热"},
  "74":{EN:"Shaoyang",VN:"Shao Dương",FR:"Shaoyang",ZH:"少阳"},
  "75":{EN:"Taiyin",VN:"Thái Âm",FR:"Taiyin",ZH:"太阴"},
  "76":{EN:"Shaoyin Cold Transformation",VN:"Shao Âm Hàn Hóa",FR:"Transformation Froid du Shaoyin",ZH:"少阴寒化"},
  "77":{EN:"Shaoyin Heat Transformation",VN:"Shao Âm Nhiệt Hóa",FR:"Transformation Chaleur du Shaoyin",ZH:"少阴热化"},
  "78":{EN:"Jueyin",VN:"Quyết Âm",FR:"Jueyin",ZH:"厥阴"},
  "79":{EN:"Wei Level Heat",VN:"Vệ Phần Nhiệt",FR:"Chaleur au Niveau Wei",ZH:"卫分热"},
  "80":{EN:"Qi Level Heat",VN:"Khí Phần Nhiệt",FR:"Chaleur au Niveau Qi",ZH:"气分热"},
  "81":{EN:"Ying Level Heat",VN:"Dinh Phần Nhiệt",FR:"Chaleur au Niveau Ying",ZH:"营分热"},
  "82":{EN:"Xue Level Heat",VN:"Huyết Phần Nhiệt",FR:"Chaleur au Niveau Xue",ZH:"血分热"},
  "83":{EN:"Upper Jiao Heat",VN:"Thượng Tiêu Nhiệt",FR:"Chaleur du Réchauffeur Supérieur",ZH:"上焦热"},
  "84":{EN:"Middle Jiao Damp-Heat",VN:"Trung Tiêu Thấp Nhiệt",FR:"Humidité-Chaleur du Réchauffeur Moyen",ZH:"中焦湿热"},
  "85":{EN:"Lower Jiao Damp-Heat",VN:"Hạ Tiêu Thấp Nhiệt",FR:"Humidité-Chaleur du Réchauffeur Inférieur",ZH:"下焦湿热"},
  "86":{EN:"Lower Jiao Heat in Blood",VN:"Hạ Tiêu Huyết Nhiệt",FR:"Chaleur dans le Sang du Réchauffeur Inférieur",ZH:"下焦血热"},
  "87":{EN:"Upper Jiao Heat Injuring Fluids",VN:"Thượng Tiêu Nhiệt Thương Tân",FR:"Chaleur du Réchauffeur Supérieur Lésant les Liquides",ZH:"上焦热伤津"},
  "88":{EN:"Lower Jiao Water Accumulation",VN:"Hạ Tiêu Thủy Ứ",FR:"Accumulation d’Eau dans le Réchauffeur Inférieur",ZH:"下焦水停"},
  "89":{EN:"Brain Essence Deficiency",VN:"Tinh Não Hư",FR:"Déficience de l’Essence du Cerveau",ZH:"脑精虚"},
  "90":{EN:"Bone Marrow Deficiency",VN:"Tủy Cốt Hư",FR:"Déficience de la Moelle Osseuse",ZH:"骨髓虚"},
  "91":{EN:"Uterus Blood Deficiency",VN:"Tử Cung Huyết Hư",FR:"Déficience du Sang de l’Utérus",ZH:"子宫血虚"},
  "92":{EN:"Uterus Yin Deficiency",VN:"Tử Cung Âm Hư",FR:"Déficience du Yin de l’Utérus",ZH:"子宫阴虚"},
  "93":{EN:"Uterus Cold",VN:"Tử Cung Hàn",FR:"Froid dans l’Utérus",ZH:"子宫寒"},
  "94":{EN:"Wind-Heat with Lung Qi Deficiency",VN:"Phong Nhiệt kèm Phế Khí Hư",FR:"Vent-Chaleur avec Déficience du Qi du Poumon",ZH:"风热兼肺气虚"},
  "95":{EN:"Phlegm-Heat in Lungs",VN:"Đàm Nhiệt Phế",FR:"Glaires-Chaleur dans les Poumons",ZH:"痰热壅肺"},
  "96":{EN:"Phlegm-Damp with Lung Qi Deficiency",VN:"Đàm Thấp kèm Phế Khí Hư",FR:"Glaires-Humidité avec Déficience du Qi du Poumon",ZH:"痰湿兼肺气虚"},
  "97":{EN:"Spleen Yang Deficiency with Dampness",VN:"Tỳ Dương Hư kèm Thấp",FR:"Déficience du Yang de la Rate avec Humidité",ZH:"脾阳虚夹湿"},
  "98":{EN:"Liver Qi Stagnation with Spleen Deficiency",VN:"Can Khí Uất kèm Tỳ Hư",FR:"Stagnation du Qi du Foie avec Déficience de la Rate",ZH:"肝气郁结兼脾虚"},
  "99":{EN:"Liver Yin Deficiency with Empty Heat",VN:"Can Âm Hư kèm Hư Nhiệt",FR:"Déficience du Yin du Foie avec Chaleur Vide",ZH:"肝阴虚兼虚热"},
  "100":{EN:"Liver Yang Rising with Kidney Yin Deficiency",VN:"Can Dương Thăng kèm Thận Âm Hư",FR:"Montée du Yang du Foie avec Déficience du Yin du Rein",ZH:"肝阳上亢兼肾阴虚"},
  "101":{EN:"Liver Overacting on Spleen",VN:"Can Thừa Khắc Tỳ",FR:"Le Foie Insultant la Rate",ZH:"肝乘脾"},
  "102":{EN:"Lung and Kidney Qi Deficiency",VN:"Phế Thận Khí Hư",FR:"Déficience du Qi du Poumon et du Rein",ZH:"肺肾气虚"},
  "103":{EN:"Lung and Kidney Yin Deficiency",VN:"Phế Thận Âm Hư",FR:"Déficience du Yin du Poumon et du Rein",ZH:"肺肾阴虚"},
  "104":{EN:"Heart and Spleen Blood Deficiency",VN:"Tâm Tỳ Huyết Hư",FR:"Déficience du Sang du Cœur et de la Rate",ZH:"心脾血虚"},
  "105":{EN:"Heart and Kidney Yin Deficiency",VN:"Tâm Thận Âm Hư",FR:"Déficience du Yin du Cœur et du Rein",ZH:"心肾阴虚"},
  "106":{EN:"Phlegm Obstructing Heart",VN:"Đàm Trệ Tâm",FR:"Glaires Obstruant le Cœur",ZH:"痰阻心脉"},
  "107":{EN:"Heart Blood Stasis",VN:"Tâm Huyết Ứ",FR:"Stase de Sang du Cœur",ZH:"心血瘀阻"},
  "108":{EN:"Heart and Lung Qi Deficiency",VN:"Tâm Phế Khí Hư",FR:"Déficience du Qi du Cœur et du Poumon",ZH:"心肺气虚"},
  "109":{EN:"Spleen and Kidney Yang Deficiency",VN:"Tỳ Thận Dương Hư",FR:"Déficience du Yang de la Rate et du Rein",ZH:"脾肾阳虚"},
  "110":{EN:"Spleen and Lung Qi Deficiency",VN:"Tỳ Phế Khí Hư",FR:"Déficience du Qi de la Rate et du Poumon",ZH:"脾肺气虚"},
  "111":{EN:"Liver and Kidney Blood Deficiency",VN:"Can Thận Huyết Hư",FR:"Déficience du Sang du Foie et du Rein",ZH:"肝肾血虚"},
  "112":{EN:"Liver and Kidney Yin Deficiency",VN:"Can Thận Âm Hư",FR:"Déficience du Yin du Foie et du Rein",ZH:"肝肾阴虚"}
};

// Translate a pattern name based on active language
function tPattern(name, id) {
  // Try name-keyed lookup first (exact match)
  const p = PATTERN_I18N[name];
  if (p && p[_lang]) return p[_lang];
  // Fallback: ID-keyed lookup (more reliable when names differ slightly)
  if (id !== undefined) {
    const pid = PATTERN_I18N_ID[String(id)];
    if (pid && pid[_lang]) return pid[_lang];
  }
  // Last resort: case-insensitive name search
  const key = Object.keys(PATTERN_I18N).find(k => k.toLowerCase() === name.toLowerCase());
  if (key && PATTERN_I18N[key][_lang]) return PATTERN_I18N[key][_lang];
  return name;
}

function tPrinciple(patternId, principleEN) {
  const pp = PATTERN_PRINCIPLES[String(patternId)];
  if (!pp) return principleEN;
  const match = pp.find(p => p.EN === principleEN);
  if (!match) return principleEN;
  return match[_lang] || principleEN;
}

const FINDING_I18N = {
  "1":{EN:"Low",VN:"Thấp",FR:"Faible",ZH:"低"},
  "2":{EN:"Exhausted",VN:"Kiệt sức",FR:"Épuisé",ZH:"筋疲力尽"},
  "3":{EN:"Poor",VN:"Kém",FR:"Mauvais",ZH:"差"},
  "4":{EN:"Loose stools",VN:"Phân lỏng",FR:"Selles molles",ZH:"溏便"},
  "5":{EN:"Bloating always",VN:"Luôn đầy hơi",FR:"Toujours ballonné",ZH:"总是腹胀"},
  "6":{EN:"Pale",VN:"Nhạt",FR:"Pâle",ZH:"淡"},
  "7":{EN:"Red",VN:"Đỏ",FR:"Rouge",ZH:"红"},
  "8":{EN:"Sticky",VN:"Phân dính",FR:"Collant",ZH:"便粘"},
  "9":{EN:"Weak",VN:"Nhược",FR:"Faible",ZH:"弱"},
  "10":{EN:"Fixed pain",VN:"Đau cố định",FR:"Douleur fixe",ZH:"固定痛"},
  "12":{EN:"Distention",VN:"Đầy hơi",FR:"Ballonné",ZH:"腹胀"},
  "13":{EN:"Mood swings",VN:"Tâm bất thường",FR:"sautes d'humeur",ZH:"情绪波动"},
  "14":{EN:"Sighing",VN:"Thở dài",FR:"Soupirs",ZH:"太息"},
  "15":{EN:"Irritability",VN:" Cáu gắt",FR:" Irritable",ZH:" 易怒"},
  "16":{EN:"Dry eyes",VN:"Mắt khô",FR:"Yeux secs",ZH:"干眼"},
  "17":{EN:"Dizziness",VN:"Chóng mặt",FR:"Vertiges",ZH:"眩晕"},
  "18":{EN:"Scanty menses",VN:"Kinh ít",FR:"Règles peu abondantes",ZH:"月经过少"},
  "19":{EN:"Blurred vision",VN:"Mờ mắt",FR:"Vision floue",ZH:"视力模糊"},
  "20":{EN:"Night sweats",VN:"Đổ mồ hôi đêm",FR:"Sueurs nocturnes",ZH:"盗汗"},
  "21":{EN:"Tinnitus",VN:"Ù tai",FR:"Acouphènes",ZH:"耳鸣"},
  "22":{EN:"Headache",VN:"Đau đầu",FR:"Mal de tête",ZH:"头痛"},
  "23":{EN:"Anger",VN:"Tức giận",FR:"Colère",ZH:"愤怒"},
  "24":{EN:"Red eyes",VN:"Mắt đỏ",FR:"Yeux rouges",ZH:"红眼"},
  "25":{EN:"Bitter taste",VN:"Vị đắng",FR:"Goût amer",ZH:"口苦"},
  "26":{EN:"Tremors",VN:"Run",FR:"Tremblements",ZH:"震颤"},
  "27":{EN:"Numbness",VN:" Tê",FR:" Engourdi",ZH:" 麻木"},
  "28":{EN:"Cold pain in lower abdomen",VN:" Đau lạnh bụng dưới",FR:" Douleur froide bas‑ventre",ZH:" 下腹冷痛"},
  "29":{EN:"Contraction",VN:"sự co rút",FR:"Rétrécissement",ZH:"收缩"},
  "30":{EN:"Hypochondriac pain",VN:"Đau hạ sườn",FR:"Douleur dans l'hypocondre",ZH:"肋痛"},
  "31":{EN:"Jaundice",VN:"Bệnh vàng da",FR:"Jaunisse",ZH:"黄疸"},
  "32":{EN:"Fatigue",VN:"Mệt mỏi",FR:"Fatigue",ZH:"疲劳"},
  "33":{EN:"Palpitations",VN:"Hồi hộp",FR:"Palpitations",ZH:"心悸"},
  "34":{EN:"Shortness of breath",VN:"Khó thở",FR:"Essoufflement",ZH:"呼吸短促"},
  "35":{EN:"Cold limbs",VN:"Tay chân lạnh",FR:"Membres froids",ZH:"四肢冷"},
  "36":{EN:"Chest discomfort",VN:" Tức ngực",FR:"Inconfort thoracique",ZH:" 胸闷"},
  "37":{EN:"Insomnia",VN:"Mất ngủ",FR:"Insomnie",ZH:"失眠"},
  "38":{EN:"Anxious",VN:"Lo âu",FR:"Anxiété",ZH:"焦虑"},
  "39":{EN:"Poor memory",VN:"Trí nhớ kém",FR:"Mauvaise mémoire",ZH:"记忆差"},
  "40":{EN:"Mouth ulcers",VN:"Mục đẹn",FR:"Ulcères buccaux",ZH:"口疮"},
  "41":{EN:"Irritable",VN:"Cáu gắt",FR:"Irritable",ZH:"易怒"},
  "42":{EN:"Chest oppression",VN:"Nặng ngực",FR:"Oppression thoracique",ZH:"胸闷"},
  "43":{EN:"Sputum",VN:"Đàm",FR:"Mucosités",ZH:"痰"},
  "44":{EN:"Confusion",VN:"Hoang mang",FR:"Confusion",ZH:"困惑"},
  "45":{EN:"Mental cloudiness",VN:"Mơ hồ tinh thần",FR:"Confusion mentale",ZH:"思维模糊"},
  "46":{EN:"Lethargy",VN:"Lờ đờ uể oải",FR:"Léthargie",ZH:"懒散"},
  "47":{EN:"Poor appetite",VN:"Chán ăn",FR:"Manque d’appétit",ZH:"食欲不振"},
  "48":{EN:"Diarrhea",VN:"Tiêu chảy",FR:"Diarrhée",ZH:"腹泻"},
  "49":{EN:"Abdominal pain",VN:"Đau bụng",FR:"Douleur abdominale",ZH:"腹痛"},
  "50":{EN:"Prolapse",VN:"Sa, xệ",FR:"Prolapsus",ZH:"脱垂"},
  "51":{EN:"Bearing-down sensation",VN:"Cảm giác nặng nề",FR:"pesanteur pelvienne",ZH:"下腹坠痛"},
  "52":{EN:"Easy bruising",VN:"Dễ bị bầm tím",FR:"Faire facilement des bleus",ZH:"容易淤青"},
  "53":{EN:"Bleeding",VN:"Chảy máu",FR:"Saignement",ZH:"出血"},
  "54":{EN:"Heaviness",VN:"Nặng",FR:"Lourdeur",ZH:"沉重"},
  "55":{EN:"Nausea",VN:"Buồn nôn",FR:"Nausées",ZH:"恶心"},
  "56":{EN:"Weak voice",VN:"Giọng yếu",FR:"Voix faible",ZH:"声音弱"},
  "57":{"EN":"Effortless breathing","VN":"Thở nhẹ nhàng","FR":"Respiration aisée","ZH":"毫不费力的呼吸"},
  "58":{EN:"Dry cough",VN:"Ho khan",FR:"Toux sèche",ZH:"干咳"},
  "59":{EN:"Hoarseness, lost of voice",VN:" Khàn tiếng/mất tiếng",FR:" Enrouement/perte de voix",ZH:" 嘶哑/失声"},
  "60":{EN:"Chills",VN:"Ớn lạnh",FR:"Frissons",ZH:"恶寒"},
  "61":{EN:"Fever",VN:"Sốt",FR:"Fièvre",ZH:"发热"},
  "62":{EN:"Body aches",VN:"Đau mình ẩm",FR:"Courbatures",ZH:"浑身疼痛"},
  "63":{EN:"Sore throat",VN:"Đau họng",FR:"Gorge irritée",ZH:"喉咙痛"},
  "64":{EN:"Thirst",VN:"Khát nước",FR:"Soif",ZH:"口渴"},
  "65":{EN:"Cough with copious sputum",VN:"Ho có nhiều đàm",FR:"Toux avec beaucoup de mucus",ZH:"咳痰量多"},
  "66":{EN:"Cough with yellow sputum",VN:"Ho ra đàm vàng",FR:"Toux avec mucus jaune",ZH:"咳黄痰"},
  "67":{EN:"Low back pain",VN:"Đau thắt lưng",FR:"Mal au bas du dos",ZH:"下腰痛"},
  "68":{EN:"Dry mouth",VN:"Khô miệng",FR:"Bouche sèche",ZH:"口干"},
  "69":{EN:"Weak knees",VN:"Đầu gối yếu",FR:"Genoux faibles",ZH:"膝弱"},
  "70":{EN:"Frequent urination",VN:"Tiểu nhiều",FR:"Mictions fréquentes",ZH:"小便频"},
  "71":{EN:"Developmental delay",VN:"Chậm phát triển",FR:"Retard de développement",ZH:"发育迟滞"},
  "72":{EN:"Chronic cough",VN:"Ho mạn tính",FR:"Toux chronique",ZH:"慢性咳嗽"},
  "73":{EN:"Weak inhalation",VN:"Hít vào yếu",FR:"Inspiration faible",ZH:"吸气弱"},
  "74":{EN:"Burning epigastric pain",VN:"Đau rát vùng thượng vị",FR:"Brûlures épigastriques",ZH:"烧心样上腹痛"},
  "75":{EN:"Bad breath",VN:"Hôi miệng",FR:"Mauvaise haleine",ZH:"口臭"},
  "76":{EN:"Dull epigastric pain",VN:"Đau âm ỉ vùng thượng vị",FR:"Douleur épigastrique sourde",ZH:"上腹部隐痛"},
  "77":{EN:"Hungry but no desire to eat",VN:"Đói nhưng không muốn ăn",FR:"Faim sans envie de manger",ZH:"饥而不欲食"},
  "78":{EN:"Epigastric fullness",VN:"Đầy trướng vùng thượng vị",FR:"La plénitude épigastrique",ZH:"上腹部饱胀感"},
  "79":{EN:"Foul breath",VN:"Hơi thở hôi",FR:"Haleine fétide",ZH:"口气臭"},
  "80":{EN:"Belching",VN:"Ợ hơi",FR:"Éructations",ZH:"打嗝"},
  "81":{EN:"Cold epigastric pain relieved by warmth",VN:"Đau vùng thượng vị giảm khi chườm ấm",FR:"Douleurs épigastriques soulagées par la chaleur",ZH:"胃寒痛得温则减"},
  "82":{EN:"Timid, Withdrawn",VN:"Rụt rè/thu mình",FR:"  Timide, retiré",ZH:"  胆怯/退缩"},
  "83":{EN:"Indecision",VN:"Sự thiếu quả quyết",FR:"indécision",ZH:"优柔寡断"},
  "84":{EN:"Lower abdominal twisting pain",VN:"Đau xoắn bụng dưới",FR:"Douleur torsion bas‑ventre",ZH:"下腹绞痛"},
  "85":{EN:"Gas",VN:"Trướng hơi",FR:"Gaz",ZH:"肠道气体"},
  "86":{EN:"Severe abdominal pain",VN:"Đau bụng dữ dội",FR:"Douleur abdominale sévère",ZH:"严重腹痛"},
  "87":{EN:"Constipation",VN:"Táo bón",FR:"Constipation",ZH:"便秘"},
  "88":{EN:"Burning urination",VN:"Tiểu rát",FR:"Brûlures à la miction",ZH:"排尿灼痛"},
  "89":{EN:"Dark urine",VN:"Nước tiểu sẫm màu",FR:"Urines foncées",ZH:"尿色深"},
  "90":{EN:"Diarrhea with foul odor",VN:"Tiêu chảy có mùi hôi",FR:"Diarrhée nauséabonde",ZH:"腹泻伴有恶臭"},
  "91":{EN:"Dry stools",VN:"Phân khô",FR:"Sec",ZH:"便干"},
  "92":{EN:"Cold abdominal pain",VN:"Đau bụng lạnh",FR:"Douleur froide abdominale",ZH:"腹部冷痛"},
  "94":{EN:"Difficult urination",VN:"Tiểu khó",FR:"Mictions difficiles",ZH:"排尿困难"},
  "95":{EN:"Delirium",VN:"Mê sảng",FR:"Délire",ZH:"神志不清"},
  "96":{EN:"Heat signs",VN:"Dấu hiệu của nhiệt",FR:"Signes de chaleurs",ZH:"热症"},
  "97":{EN:t("chestPain"),VN:"Đau ngực",FR:"Douleur thoracique",ZH:"胸痛"},
  "98":{EN:"Stabbing pain",VN:"Đau nhói",FR:"Douleur poignardante",ZH:"刺痛"},
  "99":{EN:"Cough",VN:"Ho",FR:"Toux",ZH:"咳嗽"},
  "100":{EN:"Lower abdominal heaviness",VN:"Nặng bụng dưới",FR:"Lourdeur bas‑ventre",ZH:"下腹沉重"},
  "101":{EN:"Spontaneous sweating",VN:"Tự ra mồ hôi",FR:"Sueurs spontanées",ZH:"自汗"},
  "102":{EN:"Vomiting",VN:"Nôn",FR:"Vomissements",ZH:"呕吐"},
  "103":{EN:"Hiccups",VN:"Nấc cụt",FR:"Hoquet",ZH:"打嗝"},
  "104":{EN:"Pale complexion",VN:"Sắc mặt nhợt",FR:"Teint pâle",ZH:"面色苍白"},
  "105":{EN:"Dry hair",VN:"Tóc khô",FR:"Cheveux secs",ZH:"干性发质"},
  "106":{EN:"Fixed pain",VN:"Cố định",FR:"Fixe",ZH:"固定痛"},
  "107":{EN:"Dark clots",VN:"Cục máu đông màu sậm",FR:"Caillots foncés",ZH:"深色血块"},
  "108":{EN:"Edema",VN:"Phù sưng",FR:"œdème",ZH:"水肿"},
  "109":{EN:"Cough with sputum",VN:"Ho có đàm",FR:"Toux avec mucosités",ZH:"咳痰"},
  "110":{EN:"Dry skin",VN:"Da khô",FR:"Peau sèche",ZH:"皮肤干燥"},
  "111":{EN:"Dry throat",VN:"Khô cổ",FR:"Gorge sèche",ZH:"喉咙干燥"},
  "112":{EN:"Urinary difficulty",VN:"Tiểu khó",FR:"Mictions difficiles",ZH:"排尿困难"},
  "113":{EN:"Stiff neck",VN:"Đau cổ gáy",FR:"Torticolis",ZH:"颈部僵硬"},
  "114":{EN:"Severe chills",VN:"Ớn lạnh dữ dội",FR:"frissons sévères",ZH:"剧烈发冷"},
  "115":{EN:"High fever",VN:"Sốt cao",FR:"Forte fièvre",ZH:"剧烈发冷"},
  "116":{EN:"Sweating",VN:"Đổ mồ hôi",FR:"Transpirer",ZH:"出汗"},
  "117":{EN:"Abdominal fullness",VN:"Đầy bụng",FR:"Pleineur abdominale",ZH:"腹胀"},
  "118":{EN:"Alternating chills and fever",VN:"Sốt rét run",FR:"Alternance fièvre‑frissons",ZH:"寒热往来"},
  "119":{EN:"Cold",VN:"Hàn",FR:"Froid",ZH:"寒"},
  "120":{EN:"Desire to sleep",VN:"Muốn ngủ",FR:"Envie de dormir",ZH:"嗜睡"},
  "121":{EN:"Heat above",VN:"Nóng trên",FR:"Chaleur en haut",ZH:" 上热"},
  "122":{EN:"Cold below",VN:"Lạnh dưới",FR:"Froid en bas",ZH:"下寒"},
  "123":{EN:"Vomiting roundworms",VN:"Nôn ra giun",FR:"Vomir des ascaris",ZH:"呕吐蛔虫"},
  "124":{EN:"Slight chills",VN:"Ớn lạ̣nh nhẹ",FR:"Légers frissons",ZH:"微恶寒"},
  "125":{EN:"Fever at night",VN:"Số́t về đêm",FR:"Fièvre la nuit",ZH:"夜间发热"},
  "126":{EN:"Scanty urine",VN:"Tiểu ít",FR:"Urines rares",ZH:"小便少"},
  "127":{EN:"Weak bones",VN:"Xương yếu",FR:"Os faibles",ZH:"骨弱"},
  "128":{EN:"Loose teeth",VN:"Răng lung lay",FR:"Des dents qui bougent",ZH:"牙齿松动"},
  "129":{EN:"Infertility",VN:"Vô sinh",FR:"Infertilité",ZH:"不育症"},
  "130":{EN:"Irregular menses",VN:"Kinh nguyệt không đều",FR:"Règles irrégulières",ZH:"月经不调"},
  "131":{EN:"Cold uterus",VN:"Cung hàn",FR:"utérus froid",ZH:"宫寒"},
  "132":{EN:"Painful periods",VN:"Đau bụng kinh",FR:"Règles douloureuses",ZH:"痛经"},
  "133":{EN:"Cough with watery sputum",VN:"Ho có đờn loãng",FR:"Toux avec crachats liquides",ZH:"咳嗽伴水样痰"},
  "134":{EN:"Mucus in stools",VN:"Phân có chất nhầy",FR:"Mucus dans les selles",ZH:"粘液便"},
  "135":{EN:"Stabbing chest pain",VN:"Đau ngực nhói",FR:"Douleur thoracique poignardante",ZH:"刺痛胸痛"},
  "136":{EN:"Weak limbs",VN:"Chân tay yếu",FR:"Membres faibles",ZH:"四肢无力"},
  "139":{EN:"Normal or slightly red sides",VN:"Hai bên bình thường hay hơi đỏ",FR:"Côtés normaux ou légèrement rouges",ZH:"正常或两侧微红"},
  "140":{EN:"Pale",VN:"Nhạt",FR:"Pâle",ZH:"淡"},
  "141":{EN:"thin",VN:"Mỏng",FR:"Fin",ZH:"薄"},
  "142":{EN:"Dry",VN:"Khô",FR:"Sec (langue)",ZH:"干燥"},
  "143":{EN:"Red",VN:"Đỏ",FR:"Rouge",ZH:"红"},
  "144":{EN:"Peeled sides",VN:"Rìa lưỡi bị tróc rêu",FR:"Pelée aux côtés",ZH:"两侧脱皮"},
  "145":{EN:"Red edges",VN:"Lưỡi đỏ hai bên rìa",FR:"Boards rouges",ZH:"舌缘红"},
  "146":{EN:"Dry yellow coat",VN:"Rêu lưỡi màu vàng khô.",FR:"Enduit jaune et sec",ZH:"舌苔黄燥"},
  "147":{EN:"Trembling",VN:"Lưỡi run",FR:"Tremblante",ZH:"颤"},
  "148":{EN:"Wet",VN:"Ướt",FR:"Humide",ZH:"湿"},
  "149":{EN:"Sticky yellow coat",VN:"Lưỡ̃i vàng dính",FR:"Enduit jaune et collante",ZH:"黄色黏稠物"},
  "150":{EN:"No coat",VN:"Lưỡi không rêu",FR:"Pas d'enduit",ZH:"无苔"},
  "151":{EN:"Red tip",VN:"Đầu lưỡi đỏ",FR:"Bout rouge",ZH:"舌尖红"},
  "152":{EN:"Yellow coat",VN:"Rêu vàng",FR:"Enduit jaune",ZH:"黄色苔"},
  "153":{EN:"Swollen",VN:"Sưng",FR:"Enflé",ZH:"肿胀"},
  "154":{EN:"Sticky coat",VN:"Lưỡi rêu dính",FR:"Enduit collante",ZH:"腻苔"},
  "155":{EN:"Sticky white coat",VN:"Rêu trắng dính",FR:"Enduit blanche collante",ZH:"白腻苔"},
  "156":{EN:"Peeled",VN:"Lưỡi tróc rêu",FR:"Dépapillée",ZH:"剥苔"},
  "157":{EN:"Thin white coat",VN:"Rêu trắng mỏng.",FR:"Fine enduit blanch",ZH:"薄白苔"},
  "158":{EN:"Thin yellow coat",VN:"Rêu vàng mỏng",FR:"Fine enduit jaune",ZH:"薄黄苔"},
  "159":{EN:"Pale or red without coat",VN:"Tái hay đỏ không rêu",FR:"Pâle ou rouge sans enduit",ZH:"淡白或 红绛无苔"},
  "160":{EN:"Peeled center",VN:"Tróc rêu giữa lưỡi",FR:"Dépapillée au centre",ZH:"中央舌乳头消失"},
  "161":{EN:"Thick coat",VN:"Rêu lưỡi dày",FR:"Enduit épaise",ZH:"厚苔"},
  "162":{EN:"White coat",VN:"Rêu lưỡi trắng",FR:"Enduit blanche     ",ZH:"白苔"},
  "163":{EN:"Thick white coat",VN:"Rêu lưỡi trắng dày",FR:"Enduit blanche épaise",ZH:"厚白苔"},
  "164":{EN:"White sticky coat",VN:"Rêu lưỡi trắng dính",FR:"Enduit blanche collante",ZH:"白腻苔"},
  "165":{EN:"Deep red",VN:"Đỏ đậm",FR:"Rouge foncé",ZH:"深红"},
  "166":{EN:"Purple",VN:"Tím",FR:"Pourpre",ZH:"紫"},
  "167":{EN:"Normal",VN:"Bình thường",FR:"Normal",ZH:"正常"},
  "168":{EN:"Thin white or yellow coat",VN:"Rêu mỏng trắng hay vàng",FR:"Fine enduit jaune ou blanche",ZH:"薄白或黄苔"},
  "169":{EN:"Pale or red",VN:"Đỏ hay tái",FR:"Pâle ou rouge",ZH:"苍白或红色"},
  "170":{EN:"Slight red tip",VN:"Đầu lưỡi hơi đỏ",FR:"léger bout rouge",ZH:"微红的尖端"},
  "171":{EN:"Deep red or purple",VN:"Đỏ đậm hay tím",FR:"Rouge foncé ou violet",ZH:"深红或紫色"},
  "172":{EN:"Wiry",VN:"Huyền",FR:"Corde",ZH:"弦"},
  "173":{EN:"Choppy",VN:"Sáp",FR:"Rugueux",ZH:"涩"},
  "174":{EN:"Rapid",VN:"Sác",FR:"Rapide",ZH:"数"},
  "175":{EN:"Deep",VN:"Trầm",FR:"Profond",ZH:"沉"},
  "176":{EN:"Slippery",VN:"Hoạt",FR:"Glissant",ZH:"滑"},
  "177":{EN:"Weak",VN:"Nhược",FR:"Faible",ZH:"弱"},
  "178":{EN:"Full",VN:"Thực",FR:"Plein",ZH:"实"},
  "179":{EN:"Floating",VN:"Phù",FR:"Flottant",ZH:"浮"},
  "180":{EN:"Tight",VN:"Huyền",FR:"Tendu",ZH:"紧"},
  "181":{EN:"Slow",VN:"Trì",FR:"Lent",ZH:"迟"},
  "182":{EN:"Forceful",VN:"Hữu lực",FR:"Force",ZH:"有力"},
  "183":{"EN":"Full · R","VN":"Thực · P","FR":"Fort · D","ZH":"实·右"},
  "186":{"EN":"Slippery · R","VN":"Hoạt · P","FR":"Glissant · D","ZH":"滑·右"},
  "187":{"EN":"Slow · R","VN":"Trì · P","FR":"Lent · D","ZH":"迟·右"},
  "188":{"EN":"Tight · R","VN":"Huyền · P","FR":"Tendu · D","ZH":"紧·右"},
  "194":{EN:"Tennis elbow",VN:"Khuỷu tay tennis",FR:"Épicondylite",ZH:"网球肘"},
  "195":{EN:"Arm pain",VN:"Đau tay",FR:"Douleur au bras",ZH:"手臂痛"},
  "196":{EN:"Shoulder pain",VN:"Đau vai",FR:"Douleur à l\'épaule",ZH:"肩痛"},
  "197":{EN:"Stiff neck / Neck pain",VN:"Cứng cổ / Đau cổ",FR:"Nuque raide / Cervicalgie",ZH:"颈项强痛"},
  "198":{EN:"Knee pain",VN:"Đau gối",FR:"Douleur au genou",ZH:"膝痛"},
  "199":{EN:"Wrist pain",VN:"Đau cổ tay",FR:"Douleur au poignet",ZH:"腕痛"},
  "6":{EN:"Tongue body pale",VN:"Lưỡi nhạt",FR:"Corps lingual pâle",ZH:"舌体淡白"},
  "7":{EN:"Tongue body red",VN:"Lưỡi đỏ",FR:"Corps lingual rouge",ZH:"舌体红"},
  "8":{EN:"Tongue coating greasy",VN:"Rêu nhờn",FR:"Enduit graisseux",ZH:"舌苔腻"},
  "9":{EN:"Pulse strength weak",VN:"Mạch yếu",FR:"Pouls faible",ZH:"脉力弱"},
  "27":{EN:"Fingers numbness",VN:"Tê ngón tay",FR:"Engourdissement des doigts",ZH:"手指麻木"},
  "190":{EN:"Toes numbness",VN:"Tê ngón chân",FR:"Engourdissement des orteils",ZH:"脚趾麻木"},
  "191":{EN:"Sciatic nerve pain",VN:"Đau thần kinh tọa",FR:"Douleur sciatique",ZH:"坐骨神经痛"},
  "192":{EN:"Sad / Sighing often",VN:"Buồn / Hay thở dài",FR:"Triste / Soupirs fréquents",ZH:"悲伤/常叹气"},
  "193":{EN:"Cold hands / feet",VN:"Tay chân lạnh",FR:"Mains / pieds froids",ZH:"手脚冰凉"},
  "201":{EN:"Irregular heartbeat",VN:"Nhịp tim không đều",FR:"Rythme cardiaque irrégulier",ZH:"心律不齐"},
  "203":{EN:"High blood pressure",VN:"Cao huyết áp",FR:"Hypertension",ZH:"高血压"},
  "204":{EN:"Low blood pressure",VN:"Huyết áp thấp",FR:"Hypotension",ZH:"低血压"},
  "97":{EN:"Chest pain",VN:"Đau ngực",FR:"Douleur thoracique",ZH:"胸痛"},
  "200":{EN:"Asthma",VN:"Hen suyễn",FR:"Asthme",ZH:"哮喘"},
  "202":{EN:"Palpitations",VN:"Hồi hộp đánh trống ngực",FR:"Palpitations",ZH:"心悸"}
};

const PATTERN_PRINCIPLES = {
  "1":[{EN:"Tonify Qi",VN:"Bổ Khí",FR:"Tonifier le Qi",ZH:"补气"}],
  "2":[{EN:"Tonify Qi",VN:"Bổ Khí",FR:"Tonifier le Qi",ZH:"补气"}],
  "3":[{EN:"Nourish Blood",VN:"Bổ Huyết",FR:"Nourrir le Sang",ZH:" 补血"}],
  "5":[{EN:"Warm and Tonify Yang",VN:"Ôn Dương Bổ Hỏa",FR:"Réchauffer et Tonifier le Yang",ZH:"温阳补火"}],
  "6":[{EN:"Transform Dampness",VN:"Hóa Thấp",FR:"Transformer l’Humidité",ZH:"化湿邪"}],
  "8":[{EN:"Move Qi",VN:"Hành Khí",FR:"Faire Circuler le Qi",ZH:"行气"}],
  "9":[{EN:"Nourish Blood",VN:"Bổ Huyết",FR:"Nourrir le Sang",ZH:" 补血"}],
  "10":[{EN:"Nourish Yin",VN:"Bổ Âm",FR:"Nourrir le Yin",ZH:"滋阴"}],
  "14":[{EN:"Move Qi",VN:"Hành Khí",FR:"Faire Circuler le Qi",ZH:"行气"},{EN:"Warm Interior",VN:"Ôn Lý",FR:"Réchauffer l’Intérieur",ZH:"温理"}],
  "15":[{EN:"Transform Dampness",VN:"Hóa Thấp",FR:"Transformer l’Humidité",ZH:"化湿邪"},{EN:"Clear Heat",VN:"Thanh Nhiệt",FR:"Clarifier la Chaleur",ZH:"清热"}],
  "16":[{EN:"Tonify Qi",VN:"Bổ Khí",FR:"Tonifier le Qi",ZH:"补气"}],
  "17":[{EN:"Warm and Tonify Yang",VN:"Ôn Dương Bổ Hỏa",FR:"Réchauffer et Tonifier le Yang",ZH:"温阳补火"}],
  "18":[{EN:"Nourish Blood",VN:"Bổ Huyết",FR:"Nourrir le Sang",ZH:" 补血"}],
  "19":[{EN:"Nourish Yin",VN:"Bổ Âm",FR:"Nourrir le Yin",ZH:"滋阴"}],
  "23":[{EN:"Tonify Qi",VN:"Bổ Khí",FR:"Tonifier le Qi",ZH:"补气"}],
  "24":[{EN:"Warm and Tonify Yang",VN:"Ôn Dương Bổ Hỏa",FR:"Réchauffer et Tonifier le Yang",ZH:"温阳补火"}],
  "27":[{EN:"Transform Dampness",VN:"Hóa Thấp",FR:"Transformer l’Humidité",ZH:"化湿邪"}],
  "28":[{EN:"Transform Dampness",VN:"Hóa Thấp",FR:"Transformer l’Humidité",ZH:"化湿邪"},{EN:"Clear Heat",VN:"Thanh Nhiệt",FR:"Clarifier la Chaleur",ZH:"清热"}],
  "29":[{EN:"Tonify Qi",VN:"Bổ Khí",FR:"Tonifier le Qi",ZH:"补气"}],
  "30":[{EN:"Nourish Yin",VN:"Bổ Âm",FR:"Nourrir le Yin",ZH:"滋阴"}],
  "31":[{EN:"Warm Interior",VN:"Ôn Lý",FR:"Réchauffer l’Intérieur",ZH:"温理"}],
  "32":[{EN:"Clear Heat",VN:"Thanh Nhiệt",FR:"Clarifier la Chaleur",ZH:"清热"}],
  "33":[{EN:"Transform Dampness",VN:"Hóa Thấp",FR:"Transformer l’Humidité",ZH:"化湿邪"}],
  "34":[{EN:"Clear Heat",VN:"Thanh Nhiệt",FR:"Clarifier la Chaleur",ZH:"清热"}],
  "35":[{EN:"Warm and Tonify Yang",VN:"Ôn Dương Bổ Hỏa",FR:"Réchauffer et Tonifier le Yang",ZH:"温阳补火"}],
  "36":[{EN:"Nourish Yin",VN:"Bổ Âm",FR:"Nourrir le Yin",ZH:"滋阴"}],
  "37":[{EN:"Tonify Qi",VN:"Bổ Khí",FR:"Tonifier le Qi",ZH:"补气"}],
  "40":[{EN:"Clear Heat",VN:"Thanh Nhiệt",FR:"Clarifier la Chaleur",ZH:"清热"}],
  "41":[{EN:"Nourish Yin",VN:"Bổ Âm",FR:"Nourrir le Yin",ZH:"滋阴"}],
  "42":[{EN:"Move Qi",VN:"Hành Khí",FR:"Faire Circuler le Qi",ZH:"行气"}],
  "43":[{EN:"Warm Interior",VN:"Ôn Lý",FR:"Réchauffer l’Intérieur",ZH:"温理"}],
  "44":[{EN:"Transform Dampness",VN:"Hóa Thấp",FR:"Transformer l’Humidité",ZH:"化湿邪"},{EN:"Clear Heat",VN:"Thanh Nhiệt",FR:"Clarifier la Chaleur",ZH:"清热"}],
  "45":[{EN:"Tonify Qi",VN:"Bổ Khí",FR:"Tonifier le Qi",ZH:"补气"}],
  "48":[{EN:"Transform Dampness",VN:"Hóa Thấp",FR:"Transformer l’Humidité",ZH:"化湿邪"},{EN:"Clear Heat",VN:"Thanh Nhiệt",FR:"Clarifier la Chaleur",ZH:"清热"}],
  "49":[{EN:"Transform Dampness",VN:"Hóa Thấp",FR:"Transformer l’Humidité",ZH:"化湿邪"},{EN:"Clear Heat",VN:"Thanh Nhiệt",FR:"Clarifier la Chaleur",ZH:"清热"}],
  "51":[{EN:"Warm Interior",VN:"Ôn Lý",FR:"Réchauffer l’Intérieur",ZH:"温理"}],
  "52":[{EN:"Transform Dampness",VN:"Hóa Thấp",FR:"Transformer l’Humidité",ZH:"化湿邪"},{EN:"Clear Heat",VN:"Thanh Nhiệt",FR:"Clarifier la Chaleur",ZH:"清热"}],
  "53":[{EN:"Transform Dampness",VN:"Hóa Thấp",FR:"Transformer l’Humidité",ZH:"化湿邪"},{EN:"Warm Interior",VN:"Ôn Lý",FR:"Réchauffer l’Intérieur",ZH:"温理"}],
  "54":[{EN:"Clear Heat",VN:"Thanh Nhiệt",FR:"Clarifier la Chaleur",ZH:"清热"}],
  "56":[{EN:"Clear Heat",VN:"Thanh Nhiệt",FR:"Clarifier la Chaleur",ZH:"清热"}],
  "57":[{EN:"Transform Dampness",VN:"Hóa Thấp",FR:"Transformer l’Humidité",ZH:"化湿邪"},{EN:"Clear Heat",VN:"Thanh Nhiệt",FR:"Clarifier la Chaleur",ZH:"清热"}],
  "58":[{EN:"Transform Dampness",VN:"Hóa Thấp",FR:"Transformer l’Humidité",ZH:"化湿邪"},{EN:"Clear Heat",VN:"Thanh Nhiệt",FR:"Clarifier la Chaleur",ZH:"清热"}],
  "59":[{EN:"Tonify Qi",VN:"Bổ Khí",FR:"Tonifier le Qi",ZH:"补气"}],
  "60":[{EN:"Move Qi",VN:"Hành Khí",FR:"Faire Circuler le Qi",ZH:"行气"}],
  "63":[{EN:"Nourish Blood",VN:"Bổ Huyết",FR:"Nourrir le Sang",ZH:" 补血"}],
  "65":[{EN:"Clear Heat",VN:"Thanh Nhiệt",FR:"Clarifier la Chaleur",ZH:"清热"}],
  "66":[{EN:"Transform Dampness",VN:"Hóa Thấp",FR:"Transformer l’Humidité",ZH:"化湿邪"}],
  "71":[{EN:"Warm Interior",VN:"Ôn Lý",FR:"Réchauffer l’Intérieur",ZH:"温理"}],
  "72":[{EN:"Clear Heat",VN:"Thanh Nhiệt",FR:"Clarifier la Chaleur",ZH:"清热"}],
  "73":[{EN:"Clear Heat",VN:"Thanh Nhiệt",FR:"Clarifier la Chaleur",ZH:"清热"}],
  "76":[{EN:"Warm Interior",VN:"Ôn Lý",FR:"Réchauffer l’Intérieur",ZH:"温理"}],
  "77":[{EN:"Clear Heat",VN:"Thanh Nhiệt",FR:"Clarifier la Chaleur",ZH:"清热"}],
  "79":[{EN:"Clear Heat",VN:"Thanh Nhiệt",FR:"Clarifier la Chaleur",ZH:"清热"}],
  "80":[{EN:"Clear Heat",VN:"Thanh Nhiệt",FR:"Clarifier la Chaleur",ZH:"清热"}],
  "81":[{EN:"Clear Heat",VN:"Thanh Nhiệt",FR:"Clarifier la Chaleur",ZH:"清热"}],
  "82":[{EN:"Clear Heat",VN:"Thanh Nhiệt",FR:"Clarifier la Chaleur",ZH:"清热"}],
  "83":[{EN:"Clear Heat",VN:"Thanh Nhiệt",FR:"Clarifier la Chaleur",ZH:"清热"}],
  "84":[{EN:"Transform Dampness",VN:"Hóa Thấp",FR:"Transformer l’Humidité",ZH:"化湿邪"},{EN:"Clear Heat",VN:"Thanh Nhiệt",FR:"Clarifier la Chaleur",ZH:"清热"}],
  "85":[{EN:"Transform Dampness",VN:"Hóa Thấp",FR:"Transformer l’Humidité",ZH:"化湿邪"},{EN:"Clear Heat",VN:"Thanh Nhiệt",FR:"Clarifier la Chaleur",ZH:"清热"}],
  "86":[{EN:"Clear Heat",VN:"Thanh Nhiệt",FR:"Clarifier la Chaleur",ZH:"清热"}],
  "87":[{EN:"Clear Heat",VN:"Thanh Nhiệt",FR:"Clarifier la Chaleur",ZH:"清热"}],
  "91":[{EN:"Nourish Blood",VN:"Bổ Huyết",FR:"Nourrir le Sang",ZH:" 补血"}],
  "92":[{EN:"Nourish Yin",VN:"Bổ Âm",FR:"Nourrir le Yin",ZH:"滋阴"}],
  "93":[{EN:"Warm Interior",VN:"Ôn Lý",FR:"Réchauffer l’Intérieur",ZH:"温理"}],
  "94":[{EN:"Tonify Qi",VN:"Bổ Khí",FR:"Tonifier le Qi",ZH:"补气"},{EN:"Clear Heat",VN:"Thanh Nhiệt",FR:"Clarifier la Chaleur",ZH:"清热"}],
  "95":[{EN:"Clear Heat",VN:"Thanh Nhiệt",FR:"Clarifier la Chaleur",ZH:"清热"}],
  "96":[{EN:"Tonify Qi",VN:"Bổ Khí",FR:"Tonifier le Qi",ZH:"补气"},{EN:"Transform Dampness",VN:"Hóa Thấp",FR:"Transformer l’Humidité",ZH:"化湿邪"}],
  "97":[{EN:"Warm and Tonify Yang",VN:"Ôn Dương Bổ Hỏa",FR:"Réchauffer et Tonifier le Yang",ZH:"温阳补火"},{EN:"Transform Dampness",VN:"Hóa Thấp",FR:"Transformer l’Humidité",ZH:"化湿邪"}],
  "98":[{EN:"Move Qi",VN:"Hành Khí",FR:"Faire Circuler le Qi",ZH:"行气"}],
  "99":[{EN:"Nourish Yin",VN:"Bổ Âm",FR:"Nourrir le Yin",ZH:"滋阴"},{EN:"Clear Heat",VN:"Thanh Nhiệt",FR:"Clarifier la Chaleur",ZH:"清热"}],
  "100":[{EN:"Nourish Yin",VN:"Bổ Âm",FR:"Nourrir le Yin",ZH:"滋阴"}],
  "102":[{EN:"Tonify Qi",VN:"Bổ Khí",FR:"Tonifier le Qi",ZH:"补气"}],
  "103":[{EN:"Nourish Yin",VN:"Bổ Âm",FR:"Nourrir le Yin",ZH:"滋阴"}],
  "104":[{EN:"Nourish Blood",VN:"Bổ Huyết",FR:"Nourrir le Sang",ZH:" 补血"}],
  "105":[{EN:"Nourish Yin",VN:"Bổ Âm",FR:"Nourrir le Yin",ZH:"滋阴"}],
  "108":[{EN:"Tonify Qi",VN:"Bổ Khí",FR:"Tonifier le Qi",ZH:"补气"}],
  "109":[{EN:"Warm and Tonify Yang",VN:"Ôn Dương Bổ Hỏa",FR:"Réchauffer et Tonifier le Yang",ZH:"温阳补火"}],
  "110":[{EN:"Tonify Qi",VN:"Bổ Khí",FR:"Tonifier le Qi",ZH:"补气"}],
  "111":[{EN:"Nourish Blood",VN:"Bổ Huyết",FR:"Nourrir le Sang",ZH:" 补血"}],
  "112":[{EN:"Nourish Yin",VN:"Bổ Âm",FR:"Nourrir le Yin",ZH:"滋阴"}]
};

const FINDING_NAMES_ML = {
  "VN": {
    "thấp":1,
    "kiệt sức":2,
    "kiệt":2,
    "sức":2,
    "kém":3,
    "phân lỏng":4,
    "phân":4,
    "lỏng":4,
    "luôn đầy hơi":5,
    "luôn":5,
    "đầy":5,
    "hơi":5,
    "nhạt":140,
    "đỏ":143,
    "phân dính":8,
    "dính":8,
    "nhược":177,
    "đau cố định":10,
    "đau":10,
    "định":10,
    "đầy hơi":85,
    "tâm bất thường":13,
    "tâm":13,
    "bất":13,
    "thường":13,
    "thở dài":14,
    "thở":14,
    "dài":14,
    "cáu gắt":41,
    "cáu":15,
    "gắt":15,
    "mắt khô":16,
    "mắt":16,
    "khô":16,
    "chóng mặt":17,
    "chóng":17,
    "mặt":17,
    "kinh ít":18,
    "kinh":18,
    "mờ mắt":19,
    "đổ mồ hôi đêm":20,
    "hôi":20,
    "đêm":20,
    "ù tai":21,
    "tai":21,
    "đau đầu":22,
    "đầu":22,
    "tức giận":23,
    "tức":23,
    "giận":23,
    "mắt đỏ":24,
    "vị đắng":25,
    "đắng":25,
    "run":26,
    "tê":27,
    "đau lạnh bụng dưới":28,
    "lạnh":28,
    "bụng":28,
    "dưới":28,
    "sự co rút":29,
    "sự":29,
    "rút":29,
    "đau hạ sườn":30,
    "hạ":30,
    "sườn":30,
    "bệnh vàng da":31,
    "bệnh":31,
    "vàng":31,
    "mệt mỏi":32,
    "mệt":32,
    "mỏi":32,
    "hồi hộp":33,
    "hồi":33,
    "hộp":33,
    "khó thở":57,
    "khó":34,
    "tay chân lạnh":35,
    "tay":35,
    "chân":35,
    "tức ngực":36,
    "tức":36,
    "ngực":36,
    "mất ngủ":37,
    "mất":37,
    "ngủ":37,
    "lo âu":38,
    "trí nhớ kém":39,
    "trí":39,
    "nhớ":39,
    "mục đẹn":40,
    "mục":40,
    "đẹn":40,
    "nặng ngực":42,
    "nặng":54,
    "đàm":43,
    "hoang mang":44,
    "hoang":44,
    "mang":44,
    "mơ hồ tinh thần":45,
    "tinh":45,
    "thần":45,
    "lờ đờ uể oải":46,
    "lờ":46,
    "đờ":46,
    "uể":46,
    "oải":46,
    "chán ăn":47,
    "chán":47,
    "tiêu chảy":48,
    "tiêu":48,
    "chảy":48,
    "đau bụng":49,
    "bụng":49,
    "sa, xệ":50,
    "sa,":50,
    "xệ":50,
    "cảm giác nặng nề":51,
    "cảm":51,
    "giác":51,
    "nặng":51,
    "nề":51,
    "dễ bị bầm tím":52,
    "dễ":52,
    "bị":52,
    "bầm":52,
    "tím":52,
    "chảy máu":53,
    "chảy":53,
    "máu":53,
    "buồn nôn":55,
    "buồn":55,
    "nôn":102,
    "giọng yếu":56,
    "giọng":56,
    "yếu":56,
    "ho khan":58,
    "khan":58,
    "khàn tiếng/mất tiếng":59,
    "khàn":59,
    "tiếng/mất":59,
    "tiếng":59,
    "ớn lạnh":60,
    "sốt":61,
    "đau mình ẩm":62,
    "mình":62,
    "ẩm":62,
    "đau họng":63,
    "họng":63,
    "khát nước":64,
    "khát":64,
    "nước":64,
    "ho có nhiều đàm":65,
    "có":65,
    "nhiều":65,
    "ho ra đàm vàng":66,
    "vàng":66,
    "đau thắt lưng":67,
    "thắt":67,
    "lưng":67,
    "khô miệng":68,
    "miệng":68,
    "đầu gối yếu":69,
    "gối":69,
    "tiểu nhiều":70,
    "tiểu":70,
    "nhiều":70,
    "chậm phát triển":71,
    "chậm":71,
    "phát":71,
    "triển":71,
    "ho mạn tính":72,
    "mạn":72,
    "tính":72,
    "hít vào yếu":73,
    "hít":73,
    "vào":73,
    "đau rát vùng thượng vị":74,
    "rát":74,
    "vùng":74,
    "thượng":74,
    "vị":74,
    "hôi miệng":75,
    "đau âm ỉ vùng thượng vị":76,
    "đói nhưng không muốn ăn":77,
    "đói":77,
    "nhưng":77,
    "không":77,
    "muốn":77,
    "đầy trướng vùng thượng vị":78,
    "trướng":78,
    "hơi thở hôi":79,
    "ợ hơi":80,
    "đau vùng thượng vị giảm khi chườm ấm":81,
    "vùng":81,
    "thượng":81,
    "giảm":81,
    "khi":81,
    "chườm":81,
    "rụt rè/thu mình":82,
    "rụt":82,
    "rè/thu":82,
    "mình":82,
    "sự thiếu quả quyết":83,
    "thiếu":83,
    "quả":83,
    "quyết":83,
    "đau xoắn bụng dưới":84,
    "xoắn":84,
    "đau bụng dữ dội":86,
    "dữ":86,
    "dội":86,
    "táo bón":87,
    "táo":87,
    "bón":87,
    "tiểu rát":88,
    "tiểu":88,
    "nước tiểu sẫm màu":89,
    "sẫm":89,
    "màu":89,
    "tiêu chảy có mùi hôi":90,
    "mùi":90,
    
    "đau bụng lạnh":92,
    "tiểu khó":112,
    "khó":94,
    "mê sảng":95,
    "sảng":95,
    "dấu hiệu của nhiệt":96,
    "dấu":96,
    "hiệu":96,
    "của":96,
    "nhiệt":96,
    "đau ngực":97,
    "ngực":97,
    "đau nhói":98,
    "nhói":98,
    "ho":99,
    "nặng bụng dưới":100,
    "tự ra mồ hôi":101,
    "nấc cụt":103,
    "nấc":103,
    "cụt":103,
    "sắc mặt nhợt":104,
    "sắc":104,
    "nhợt":104,
    "tóc khô":105,
    "tóc":105,
    "cố định":106,
    "cục máu đông màu sậm":107,
    "cục":107,
    "đông":107,
    "màu":107,
    "sậm":107,
    "phù sưng":108,
    "phù":108,
    "sưng":153,
    "ho có đàm":109,
    "đàm":109,
    "da khô":110,
    "khô cổ":111,
    "cổ":111,
    "đau cổ gáy":113,
    "gáy":113,
    "ớn lạnh dữ dội":114,
    "ớn":114,
    "lạnh":114,
    "sốt cao":115,
    "sốt":115,
    "cao":115,
    "đổ mồ hôi":116,
    "đổ":116,
    "mồ":116,
    "đầy bụng":117,
    "đầy":117,
    "sốt rét run":118,
    "rét":118,
    "hàn":119,
    "muốn ngủ":120,
    "nóng trên":121,
    "nóng":121,
    "trên":121,
    "lạnh dưới":122,
    "nôn ra giun":123,
    "giun":123,
    "ớn lạ̣nh nhẹ":124,
    "lạ̣nh":124,
    "nhẹ":124,
    "số́t về đêm":125,
    "số́t":125,
    "về":125,
    "tiểu ít":126,
    "xương yếu":127,
    "xương":127,
    "răng lung lay":128,
    "răng":128,
    "lung":128,
    "lay":128,
    "vô sinh":129,
    "sinh":129,
    "kinh nguyệt không đều":130,
    "nguyệt":130,
    "đều":130,
    "cung hàn":131,
    "cung":131,
    "hàn":131,
    "đau bụng kinh":132,
    "ho có đờn loãng":133,
    "đờn":133,
    "loãng":133,
    "phân có chất nhầy":134,
    "chất":134,
    "nhầy":134,
    "đau ngực nhói":135,
    "chân tay yếu":136,
    "hai bên bình thường hay hơi đỏ":139,
    "hai":139,
    "bên":139,
    "bình":139,
    "hay":139,
    "đỏ":139,
    "mỏng":141,
    "rìa lưỡi bị tróc rêu":144,
    "rìa":144,
    "lưỡi":144,
    "tróc":144,
    "rêu":144,
    "lưỡi đỏ hai bên rìa":145,
    "rêu lưỡi màu vàng khô.":146,
    "khô.":146,
    "lưỡi run":147,
    "lưỡi":147,
    "ướt":148,
    "lưỡ̃i vàng dính":149,
    "lưỡ̃i":149,
    "dính":149,
    "lưỡi không rêu":150,
    "đầu lưỡi đỏ":151,
    "đầu":151,
    "rêu vàng":152,
    "lưỡi rêu dính":154,
    "rêu trắng dính":155,
    "trắng":155,
    "lưỡi tróc rêu":156,
    "tróc":156,
    "rêu trắng mỏng.":157,
    "mỏng.":157,
    "rêu vàng mỏng":158,
    "mỏng":158,
    "tái hay đỏ không rêu":159,
    "tái":159,
    "tróc rêu giữa lưỡi":160,
    "giữa":160,
    "rêu lưỡi dày":161,
    "dày":161,
    "rêu lưỡi trắng":162,
    "rêu lưỡi trắng dày":163,
    "rêu lưỡi trắng dính":164,
    "đỏ đậm":165,
    "đậm":165,
    "tím":166,
    "bình thường":167,
    "bình":167,
    "thường":167,
    "rêu mỏng trắng hay vàng":168,
    "đỏ hay tái":169,
    "đầu lưỡi hơi đỏ":170,
    "đỏ đậm hay tím":171,
    "huyền":172,
    "sáp":173,
    "sác":174,
    "trầm":175,
    "hoạt":186,
    "thực":183,
    "phù":179,
    "huyền":188,
    "trì":187,
    "hữu lực":182,
    "hữu":182,
    "lực":182
  },
  "FR": {
    "faible":177,
    "épuisé":2,
    "mauvais":3,
    "selles molles":4,
    "selles":4,
    "molles":4,
    "toujours ballonné":5,
    "toujours":5,
    "ballonné":12,
    "pâle":140,
    "rouge":143,
    "collant":8,
    "douleur fixe":10,
    "douleur":10,
    "fixe":106,
    "sautes d'humeur":13,
    "sautes":13,
    "d'humeur":13,
    "soupirs":14,
    "irritable":41,
    "yeux secs":16,
    "yeux":16,
    "secs":16,
    "vertiges":17,
    "règles peu abondantes":18,
    "règles":18,
    "peu":18,
    "abondantes":18,
    "vision floue":19,
    "vision":19,
    "floue":19,
    "sueurs nocturnes":20,
    "sueurs":20,
    "nocturnes":20,
    "acouphènes":21,
    "mal de tête":22,
    "mal":22,
    "tête":22,
    "colère":23,
    "yeux rouges":24,
    "rouges":24,
    "goût amer":25,
    "goût":25,
    "amer":25,
    "tremblements":26,
    "engourdi":27,
    "douleur froide bas‑ventre":28,
    "froide":28,
    "bas‑ventre":28,
    "rétrécissement":29,
    "douleur dans l'hypocondre":30,
    "dans":30,
    "l'hypocondre":30,
    "jaunisse":31,
    "fatigue":32,
    "palpitations":33,
    "essoufflement":57,
    "membres froids":35,
    "membres":35,
    "froids":35,
    "inconfort thoracique":36,
    "inconfort":36,
    "thoracique":36,
    "insomnie":37,
    "anxiété":38,
    "mauvaise mémoire":39,
    "mauvaise":39,
    "mémoire":39,
    "ulcères buccaux":40,
    "ulcères":40,
    "buccaux":40,
    "oppression thoracique":42,
    "oppression":42,
    "mucosités":43,
    "confusion":44,
    "confusion mentale":45,
    "mentale":45,
    "léthargie":46,
    "manque d’appétit":47,
    "manque":47,
    "d’appétit":47,
    "diarrhée":48,
    "douleur abdominale":49,
    "abdominale":49,
    "prolapsus":50,
    "pesanteur pelvienne":51,
    "pesanteur":51,
    "pelvienne":51,
    "faire facilement des bleus":52,
    "faire":52,
    "facilement":52,
    "des":52,
    "bleus":52,
    "saignement":53,
    "lourdeur":54,
    "nausées":55,
    "voix faible":56,
    "voix":56,
    "toux sèche":58,
    "toux":99,
    "sèche":58,
    "enrouement/perte de voix":59,
    "enrouement/perte":59,
    "frissons":60,
    "fièvre":61,
    "courbatures":62,
    "gorge irritée":63,
    "gorge":63,
    "irritée":63,
    "soif":64,
    "toux avec beaucoup de mucus":65,
    "avec":65,
    "beaucoup":65,
    "mucus":65,
    "toux avec mucus jaune":66,
    "jaune":66,
    "mal au bas du dos":67,
    "bas":67,
    "dos":67,
    "bouche sèche":68,
    "bouche":68,
    "genoux faibles":69,
    "genoux":69,
    "faibles":69,
    "mictions fréquentes":70,
    "mictions":70,
    "fréquentes":70,
    "retard de développement":71,
    "retard":71,
    "développement":71,
    "toux chronique":72,
    "chronique":72,
    "inspiration faible":73,
    "inspiration":73,
    "brûlures épigastriques":74,
    "brûlures":74,
    "épigastriques":74,
    "mauvaise haleine":75,
    "haleine":75,
    "douleur épigastrique sourde":76,
    "épigastrique":76,
    "sourde":76,
    "faim sans envie de manger":77,
    "faim":77,
    "sans":77,
    "envie":77,
    "manger":77,
    "la plénitude épigastrique":78,
    "plénitude":78,
    "épigastrique":78,
    "haleine fétide":79,
    "fétide":79,
    "éructations":80,
    "douleurs épigastriques soulagées par la chaleur":81,
    "douleurs":81,
    "soulagées":81,
    "par":81,
    "chaleur":81,
    "timide, retiré":82,
    "timide,":82,
    "retiré":82,
    "indécision":83,
    "douleur torsion bas‑ventre":84,
    "torsion":84,
    "gaz":85,
    "douleur abdominale sévère":86,
    "sévère":86,
    "constipation":87,
    "brûlures à la miction":88,
    "miction":88,
    "urines foncées":89,
    "urines":89,
    "foncées":89,
    "diarrhée nauséabonde":90,
    "nauséabonde":90,
    "sec":142,
    "douleur froide abdominale":92,
    "mictions difficiles":112,
    "difficiles":94,
    "délire":95,
    "signes de chaleurs":96,
    "signes":96,
    "chaleurs":96,
    "douleur thoracique":97,
    "douleur poignardante":98,
    "poignardante":98,
    "lourdeur bas‑ventre":100,
    "sueurs spontanées":101,
    "spontanées":101,
    "vomissements":102,
    "hoquet":103,
    "teint pâle":104,
    "teint":104,
    "cheveux secs":105,
    "cheveux":105,
    "caillots foncés":107,
    "caillots":107,
    "foncés":107,
    "œdème":108,
    "toux avec mucosités":109,
    "peau sèche":110,
    "peau":110,
    "sèche":110,
    "gorge sèche":111,
    "torticolis":113,
    "frissons sévères":114,
    "sévères":114,
    "forte fièvre":115,
    "forte":115,
    "transpirer":116,
    "pleineur abdominale":117,
    "pleineur":117,
    "alternance fièvre‑frissons":118,
    "alternance":118,
    "fièvre‑frissons":118,
    "froid":119,
    "envie de dormir":120,
    "dormir":120,
    "chaleur en haut":121,
    "haut":121,
    "froid en bas":122,
    "vomir des ascaris":123,
    "vomir":123,
    "ascaris":123,
    "légers frissons":124,
    "légers":124,
    "fièvre la nuit":125,
    "nuit":125,
    "urines rares":126,
    "rares":126,
    "os faibles":127,
    "des dents qui bougent":128,
    "dents":128,
    "qui":128,
    "bougent":128,
    "infertilité":129,
    "règles irrégulières":130,
    "irrégulières":130,
    "utérus froid":131,
    "utérus":131,
    "règles douloureuses":132,
    "douloureuses":132,
    "toux avec crachats liquides":133,
    "crachats":133,
    "liquides":133,
    "mucus dans les selles":134,
    "les":134,
    "douleur thoracique poignardante":135,
    "membres faibles":136,
    "côtés normaux ou légèrement rouges":139,
    "côtés":139,
    "normaux":139,
    "légèrement":139,
    "fin":141,
    "pelée aux côtés":144,
    "pelée":144,
    "aux":144,
    "boards rouges":145,
    "boards":145,
    "enduit jaune et sec":146,
    "enduit":146,
    "tremblante":147,
    "humide":148,
    "enduit jaune et collante":149,
    "collante":149,
    "pas d'enduit":150,
    "pas":150,
    "d'enduit":150,
    "bout rouge":151,
    "bout":151,
    "enduit jaune":152,
    "enflé":153,
    "enduit collante":154,
    "enduit blanche collante":164,
    "blanche":155,
    "dépapillée":156,
    "fine enduit blanch":157,
    "fine":157,
    "blanch":157,
    "fine enduit jaune":158,
    "pâle ou rouge sans enduit":159,
    "dépapillée au centre":160,
    "centre":160,
    "enduit épaise":161,
    "épaise":161,
    "enduit blanche":162,
    "enduit blanche épaise":163,
    "rouge foncé":165,
    "foncé":165,
    "pourpre":166,
    "normal":167,
    "fine enduit jaune ou blanche":168,
    "pâle ou rouge":169,
    "léger bout rouge":170,
    "léger":170,
    "rouge foncé ou violet":171,
    "violet":171,
    "corde":172,
    "rugueux":173,
    "rapide":174,
    "profond":175,
    "glissant":186,
    "plein":183,
    "flottant":179,
    "tendu":188,
    "lent":187,
    "force":182
  },
  "ZH": {
    "低":1,
    "筋疲力尽":2,
    "差":3,
    "溏便":4,
    "总是腹胀":5,
    "淡":140,
    "红":143,
    "便粘":8,
    "弱":177,
    "固定痛":106,
    "腹胀":117,
    "情绪波动":13,
    "太息":14,
    "易怒":41,
    "干眼":16,
    "眩晕":17,
    "月经过少":18,
    "视力模糊":19,
    "盗汗":20,
    "耳鸣":21,
    "头痛":22,
    "愤怒":23,
    "红眼":24,
    "口苦":25,
    "震颤":26,
    "麻木":27,
    "下腹冷痛":28,
    "收缩":29,
    "肋痛":30,
    "黄疸":31,
    "疲劳":32,
    "心悸":33,
    "呼吸短促":57,
    "四肢冷":35,
    "胸闷":42,
    "失眠":37,
    "焦虑":38,
    "记忆差":39,
    "口疮":40,
    "痰":43,
    "困惑":44,
    "思维模糊":45,
    "懒散":46,
    "食欲不振":47,
    "腹泻":48,
    "腹痛":49,
    "脱垂":50,
    "下腹坠痛":51,
    "容易淤青":52,
    "出血":53,
    "沉重":54,
    "恶心":55,
    "声音弱":56,
    "干咳":58,
    "嘶哑/失声":59,
    "恶寒":60,
    "发热":61,
    "浑身疼痛":62,
    "喉咙痛":63,
    "口渴":64,
    "咳痰量多":65,
    "咳黄痰":66,
    "下腰痛":67,
    "口干":68,
    "膝弱":69,
    "小便频":70,
    "发育迟滞":71,
    "慢性咳嗽":72,
    "吸气弱":73,
    "烧心样上腹痛":74,
    "口臭":75,
    "上腹部隐痛":76,
    "饥而不欲食":77,
    "上腹部饱胀感":78,
    "口气臭":79,
    "打嗝":103,
    "胃寒痛得温则减":81,
    "胆怯/退缩":82,
    "优柔寡断":83,
    "下腹绞痛":84,
    "肠道气体":85,
    "严重腹痛":86,
    "便秘":87,
    "排尿灼痛":88,
    "尿色深":89,
    "腹泻伴有恶臭":90,
    "便干":142,
    "腹部冷痛":92,
    "排尿困难":112,
    "神志不清":95,
    "热症":96,
    "胸痛":97,
    "刺痛":98,
    "咳嗽":99,
    "下腹沉重":100,
    "自汗":101,
    "呕吐":102,
    "面色苍白":104,
    "干性发质":105,
    "深色血块":107,
    "水肿":108,
    "咳痰":109,
    "皮肤干燥":110,
    "喉咙干燥":111,
    "颈部僵硬":113,
    "剧烈发冷":115,
    "出汗":116,
    "寒热往来":118,
    "寒":119,
    "嗜睡":120,
    "上热":121,
    "下寒":122,
    "呕吐蛔虫":123,
    "微恶寒":124,
    "夜间发热":125,
    "小便少":126,
    "骨弱":127,
    "牙齿松动":128,
    "不育症":129,
    "月经不调":130,
    "宫寒":131,
    "痛经":132,
    "咳嗽伴水样痰":133,
    "粘液便":134,
    "刺痛胸痛":135,
    "四肢无力":136,
    "正常或两侧微红":139,
    "薄":141,
    "两侧脱皮":144,
    "舌缘红":145,
    "舌苔黄燥":146,
    "颤":147,
    "湿":148,
    "黄色黏稠物":149,
    "无苔":150,
    "舌尖红":151,
    "黄色苔":152,
    "肿胀":153,
    "腻苔":154,
    "白腻苔":164,
    "剥苔":156,
    "薄白苔":157,
    "薄黄苔":158,
    "淡白或 红绛无苔":159,
    "淡白或":159,
    "红绛无苔":159,
    "中央舌乳头消失":160,
    "厚苔":161,
    "白苔":162,
    "厚白苔":163,
    "深红":165,
    "紫":166,
    "正常":167,
    "薄白或黄苔":168,
    "苍白或红色":169,
    "微红的尖端":170,
    "深红或紫色":171,
    "弦":172,
    "涩":173,
    "数":174,
    "沉":175,
    "滑":186,
    "实":183,
    "浮":179,
    "紧":188,
    "迟":187,
    "有力":182
  }
};

const DB_I18N = {
  "Action_ClearHeat":{EN:"Clear Heat",VN:"Thanh nhiệt",FR:"Clarifier la Chaleur",ZH:"清热"},
  "Action_CoolBlood":{EN:"Cool Blood",VN:"Lương huyết",FR:"Refroidir le Sang",ZH:"凉血"},
  "Action_DescendQi":{EN:"Descend Qi",VN:"Giáng khí",FR:"Abaisser le Qi",ZH:"降气"},
  "Action_DissipateNodules":{EN:"Dissipate nodules",VN:"Tiêu kết",FR:"Dissiper les nodules",ZH:"消结"},
  "Action_MoistenDryness":{EN:"Moisten dryness",VN:"Nhuận táo",FR:"Humidifier la sécheresse",ZH:"润燥"},
  "Action_RaiseQi":{EN:"Raise Qi",VN:"Thăng khí",FR:"Élever le Qi",ZH:"升气"},
  "Action_RegulateBlood":{EN:"Regulate Blood",VN:"Điều huyết",FR:"Réguler le Sang",ZH:"理血"},
  "Action_RegulateIntestines":{EN:"Regulate Intestines",VN:"Điều trường",FR:"Réguler les Intestins",ZH:"调肠"},
  "Action_RegulateQi":{EN:"Regulate Qi",VN:"Điều khí",FR:"Réguler le Qi",ZH:"理气"},
  "Action_RegulateStomach":{EN:"Regulate Stomach",VN:"Điều vị",FR:"Réguler l’Estomac",ZH:"调胃"},
  "Action_ReleaseExterior":{EN:"Release Exterior",VN:"Giải biểu",FR:"Libérer l’Extérieur",ZH:"解表"},
  "Action_Sedate":{EN:"Sedate",VN:"Tả",FR:"Sédater",ZH:"泻"},
  "Action_SoftenHardness":{EN:"Soften hardness",VN:"Nhuận kiên",FR:"Ramollir les masses",ZH:"软坚"},
  "Action_WarmYang":{EN:"Warm Yang",VN:"Ôn dương",FR:"Chauffer le Yang",ZH:"温阳"},
  "Pattern_BloodDeficiency":{EN:"Blood Deficiency",VN:"Huyết hư",FR:"Déficience de Sang",ZH:"血虚"},
  "Pattern_BloodStasis":{EN:"Blood Stasis",VN:"Ứ huyết",FR:"Stase de Sang",ZH:"血瘀"},
  "Pattern_Cold":{EN:"Cold",VN:"Hàn",FR:"Froid",ZH:"寒"},
  "Pattern_DampCold":{EN:"Damp‑Cold",VN:"Thấp hàn",FR:"Froid‑Humidité",ZH:"寒湿"},
  "Pattern_DampHeat":{EN:"Damp‑Heat",VN:"Thấp nhiệt",FR:"Chaleur‑Humidité",ZH:"湿热"},
  "Pattern_DryPhlegm":{EN:"Dry Phlegm",VN:"Đàm táo",FR:"Mucosités sèches",ZH:"燥痰"},
  "Pattern_EmptyCold":{EN:"Empty Cold",VN:"Hàn hư",FR:"Froid vide",ZH:"虚寒"},
  "Pattern_EmptyHeat":{EN:"Empty Heat",VN:"Nhiệt hư",FR:"Chaleur vide",ZH:"虚热"},
  "Pattern_ExteriorCold":{EN:"Exterior Cold",VN:"Ngoại cảm hàn",FR:"Froid externe",ZH:"外感寒邪"},
  "Pattern_ExteriorHeat":{EN:"Exterior Heat",VN:"Ngoại cảm nhiệt",FR:"Chaleur externe",ZH:"外感热邪"},
  "Pattern_ExteriorWind":{EN:"Exterior Wind",VN:"Ngoại cảm phong",FR:"Vent externe",ZH:"外感风邪"},
  "Pattern_FoodStagnation":{EN:"Food Stagnation",VN:"Thực tích",FR:"Stagnation alimentaire",ZH:"食积"},
  "Pattern_FullCold":{EN:"Full Cold",VN:"Thực hàn",FR:"Froid plénitude",ZH:"实寒"},
  "Pattern_FullHeat":{EN:"Full Heat",VN:"Thực nhiệt",FR:"Chaleur plénitude",ZH:"实热"},
  "Pattern_HeartBloodDeficiency":{EN:"Heart Blood Deficiency",VN:"Huyết Tâm hư",FR:"Déficience du Sang du Cœur",ZH:"心血虚"},
  "Pattern_HeartQiDeficiency":{EN:"Heart Qi Deficiency",VN:"Khí Tâm hư",FR:"Déficience du Qi du Cœur",ZH:"心气虚"},
  "Pattern_HeartYangDeficiency":{EN:"Heart Yang Deficiency",VN:"Dương Tâm hư",FR:"Déficience du Yang du Cœur",ZH:"心阳虚"},
  "Pattern_HeartYinDeficiency":{EN:"Heart Yin Deficiency",VN:"Âm Tâm hư",FR:"Déficience du Yin du Cœur",ZH:"心阴虚"},
  "Pattern_Heat":{EN:"Heat",VN:"Nhiệt",FR:"Chaleur",ZH:"热"},
  "Pattern_KidneyEssenceDeficiency":{EN:"Kidney Essence Deficiency",VN:"Tinh Thận hư",FR:"Déficience de l’Essence du Rein",ZH:"肾精不足"},
  "Pattern_KidneyQiDeficiency":{EN:"Kidney Qi Deficiency",VN:"Khí Thận hư",FR:"Déficience du Qi du Rein",ZH:"肾气虚"},
  "Pattern_KidneyYangDeficiency":{EN:"Kidney Yang Deficiency",VN:"Dương Thận hư",FR:"Déficience du Yang du Rein",ZH:"肾阳虚"},
  "Pattern_KidneyYinDeficiency":{EN:"Kidney Yin Deficiency",VN:"Âm Thận hư",FR:"Déficience du Yin du Rein",ZH:"肾阴虚"},
  "Pattern_LiverBloodDeficiency":{EN:"Liver Blood Deficiency",VN:"Huyết Can hư",FR:"Déficience du Sang du Foie",ZH:"肝血虚"},
  "Pattern_LiverQiStagnation":{EN:"Liver Qi Stagnation",VN:"Ứ trệ khí Can",FR:"Stagnation du Qi du Foie",ZH:"肝气郁结"},
  "Pattern_LiverYangRising":{EN:"Liver Yang Rising",VN:"Dương Can vượng",FR:"Montée du Yang du Foie",ZH:"肝阳上亢"},
  "Pattern_LiverYinDeficiency":{EN:"Liver Yin Deficiency",VN:"Âm Can hư",FR:"Déficience du Yin du Foie",ZH:"肝阴虚"},
  "Pattern_LungDryness":{EN:"Lung Dryness",VN:"Phế táo",FR:"Sécheresse du Poumon",ZH:"肺燥"},
  "Pattern_LungQiDeficiency":{EN:"Lung Qi Deficiency",VN:"Khí Phế hư",FR:"Déficience du Qi du Poumon",ZH:"肺气虚"},
  "Pattern_LungYinDeficiency":{EN:"Lung Yin Deficiency",VN:"Âm Phế hư",FR:"Déficience du Yin du Poumon",ZH:"肺阴虚"},
  "Pattern_PhlegmCold":{EN:"Phlegm‑Cold",VN:"Đàm hàn",FR:"Mucosités‑Froid",ZH:"寒痰"},
  "Pattern_PhlegmHeat":{EN:"Phlegm‑Heat",VN:"Đàm nhiệt",FR:"Mucosités‑Chaleur",ZH:"痰热"},
  "Pattern_PhlegmMistingMind":{EN:"Phlegm Misting the Mind",VN:"Đàm che tâm khiếu",FR:"Mucosités troublant l’esprit",ZH:"痰蒙心窍"},
  "Pattern_QiDeficiency":{EN:"Qi Deficiency",VN:"Khí hư",FR:"Déficience de Qi",ZH:"气虚"},
  "Pattern_QiRebellion":{EN:"Qi Rebellion",VN:"Khí nghịch",FR:"Qi rebelle",ZH:"气逆"},
  "Pattern_QiStagnation":{EN:"Qi Stagnation",VN:"Khí uất",FR:"Stagnation de Qi",ZH:"气滞"},
  "Pattern_SpleenNotControllingBlood":{EN:"Spleen Not Controlling Blood",VN:"Tỳ không nhiếp huyết",FR:"Rate ne contrôle pas le Sang",ZH:"脾不统血"},
  "Pattern_SpleenQiDeficiency":{EN:"Spleen Qi Deficiency",VN:"Khí Tỳ hư",FR:"Déficience du Qi de la Rate",ZH:"脾气虚"},
  "Pattern_SpleenQiSinking":{EN:"Spleen Qi Sinking",VN:"Khí Tỳ hạ hãm",FR:"Affaissement du Qi de la Rate",ZH:"脾气下陷"},
  "Pattern_SpleenYangDeficiency":{EN:"Spleen Yang Deficiency",VN:"Dương Tỳ hư",FR:"Déficience du Yang de la Rate",ZH:"脾阳虚"},
  "Pattern_StomachCold":{EN:"Stomach Cold",VN:"Vị hàn",FR:"Froid de l’Estomac",ZH:"胃寒"},
  "Pattern_StomachYinDeficiency":{EN:"Stomach Yin Deficiency",VN:"Âm Vị hư",FR:"Déficience du Yin de l’Estomac",ZH:"胃阴虚"},
  "Pattern_YangDeficiency":{EN:"Yang Deficiency",VN:"Dương hư",FR:"Déficience de Yang",ZH:"阳虚"},
  "Pattern_YinDeficiency":{EN:"Yin Deficiency",VN:"Âm hư",FR:"Déficience de Yin",ZH:"阴虚"},
  "PointCategory_AshiPoints":{EN:"Ashi Points",VN:"Huyệt A thị",FR:"Points Ashi",ZH:"阿是穴"},
  "PointCategory_BackShu":{EN:"Back‑Shu Points",VN:"Huyệt Bối Du",FR:"Points Shu du dos",ZH:"背俞穴"},
  "PointCategory_BackTransport":{EN:"Back Transport Points",VN:"Huyệt vận chuyển lưng",FR:"Points de transport dorsal",ZH:"背输穴"},
  "PointCategory_ChildPoint":{EN:"Child Point",VN:"Huyệt tử",FR:"Point fils",ZH:"子穴"},
  "PointCategory_CommandPoints":{EN:"Command Points",VN:"Huyệt chỉ huy",FR:"Points de commande",ZH:"四总穴"},
  "PointCategory_CrossingPoints":{EN:"Crossing Points",VN:"Huyệt giao hội",FR:"Points de croisement",ZH:"交会穴"},
  "PointCategory_EightConfluent":{EN:"Eight Confluent Points",VN:"Bát mạch giao hội",FR:"Huit points Confluents",ZH:"八脉交会穴"},
  "PointCategory_EightInfluential":{EN:"Eight Influential Points",VN:"Bát hội huyệt",FR:"Huit points Influents",ZH:"八会穴"},
  "PointCategory_ExtraordinaryPoints":{EN:"Extraordinary Points",VN:"Huyệt kỳ kinh",FR:"Points extraordinaires",ZH:"奇穴"},
  "PointCategory_FiveShu":{EN:"Five‑Shu Points",VN:"Ngũ Du huyệt",FR:"Points des Cinq Shu",ZH:"五输穴"},
  "PointCategory_FourGates":{EN:"Four Gates",VN:"Tứ quan",FR:"Quatre Portes",ZH:"四关"},
  "PointCategory_FourSea":{EN:"Four Seas Points",VN:"Tứ hải huyệt",FR:"Points des Quatre Mers",ZH:"四海穴"},
  "PointCategory_FrontMu":{EN:"Front‑Mu Points",VN:"Huyệt Mộ",FR:"Points Mu antérieurs",ZH:"募穴"},
  "PointCategory_HeSea":{EN:"He‑Sea Points",VN:"Hợp huyệt",FR:"Points He‑Mer",ZH:"合穴"},
  "PointCategory_HoraryPoint":{EN:"Horary Point",VN:"Huyệt thời khí",FR:"Point horaire",ZH:"本穴"},
  "PointCategory_JingRiver":{EN:"Jing‑River Points",VN:"Kinh huyệt",FR:"Points Jing‑Rivière",ZH:"经穴"},
  "PointCategory_JingWell":{EN:"Jing‑Well Points",VN:"Tỉnh huyệt",FR:"Points Jing‑Puits",ZH:"井穴"},
  "PointCategory_LowerHeSea":{EN:"Lower He‑Sea Points",VN:"Huyệt Hợp dưới",FR:"Points He‑Mer inférieurs",ZH:"下合穴"},
  "PointCategory_LuoConnecting":{EN:"Luo‑Connecting Points",VN:"Huyệt Lạc",FR:"Points Luo‑Connexion",ZH:"络穴"},
  "PointCategory_MaDanYang":{EN:"Ma Dan‑Yang Heavenly Points",VN:"Thập tam thiên huyệt",FR:"Points célestes de Ma Dan‑Yang",ZH:"马丹阳天星穴"},
  "PointCategory_MeetingPoints":{EN:"Meeting Points",VN:"Huyệt hội",FR:"Points de réunion",ZH:"会穴"},
  "PointCategory_MotherPoint":{EN:"Mother Point",VN:"Huyệt mẫu",FR:"Point mère",ZH:"母穴"},
  "PointCategory_SedationPoint":{EN:"Sedation Point",VN:"Huyệt tả",FR:"Point de dispersion",ZH:"泻穴"},
  "PointCategory_ShuStream":{EN:"Shu‑Stream Points",VN:"Du huyệt",FR:"Points Shu‑Rivière",ZH:"输穴"},
  "PointCategory_SpiritPoints":{EN:"Spirit Points",VN:"Huyệt linh",FR:"Points de l’esprit",ZH:"灵穴"},
  "PointCategory_SunSiMiaoGhost":{EN:"Sun Si‑Miao Ghost Points",VN:"Quỷ huyệt Tôn Tư Miễu",FR:"Points fantômes de Sun Si‑Miao",ZH:"孙思邈十三鬼穴"},
  "PointCategory_TonificationPoint":{EN:"Tonification Point",VN:"Huyệt bổ",FR:"Point de tonification",ZH:"补穴"},
  "PointCategory_XiCleft":{EN:"Xi‑Cleft Points",VN:"Huyệt Khích",FR:"Points Xi‑Fente",ZH:"郄穴"},
  "PointCategory_YingSpring":{EN:"Ying‑Spring Points",VN:"Huỳnh huyệt",FR:"Points Ying‑Source",ZH:"荥穴"},
  "PointCategory_YuanSource":{EN:"Yuan‑Source Points",VN:"Huyệt Nguyên",FR:"Points Yuan‑Source",ZH:"原穴"},
  "Symptom_AbdominalDistension":{EN:"Abdominal distension",VN:"Chướng bụng",FR:"Distension abdominale",ZH:"腹胀"},
  "Symptom_AlternatingChillsFever":{EN:"Alternating chills and fever",VN:"Sốt rét run",FR:"Alternance fièvre‑frissons",ZH:"寒热往来"},
  "Symptom_Anxiety":{EN:"Anxiety",VN:"Lo âu",FR:"Anxiété",ZH:"焦虑"},
  "Symptom_BitterTaste":{EN:"Bitter taste",VN:"Vị đắng",FR:"Goût amer",ZH:"口苦"},
  "Symptom_Borborygmus":{EN:"Borborygmus",VN:"Óc ách ruột",FR:"Borborygmes",ZH:"肠鸣"},
  "Symptom_BurningPain":{EN:"Burning pain",VN:"Đau nóng rát",FR:"Douleur brûlante",ZH:"灼痛"},
  "Symptom_ChestOppression":{EN:"Chest oppression",VN:"Nặng ngực",FR:"Oppression thoracique",ZH:"胸闷"},
  "Symptom_Chills":{EN:"Chills",VN:"Ớn lạnh",FR:"Frissons",ZH:"恶寒"},
  "Symptom_ColdLimbs":{EN:"Cold limbs",VN:"Tay chân lạnh",FR:"Membres froids",ZH:"四肢冷"},
  "Symptom_ColdPain":{EN:"Cold pain",VN:"Đau lạnh",FR:"Douleur froide",ZH:"冷痛"},
  "Symptom_Constipation":{EN:"Constipation",VN:"Táo bón",FR:"Constipation",ZH:"便秘"},
  "Symptom_Cough":{EN:"Cough",VN:"Ho",FR:"Toux",ZH:"咳嗽"},
  "Symptom_CoughPhlegm":{EN:"Cough with phlegm",VN:"Ho có đàm",FR:"Toux avec mucosités",ZH:"咳痰"},
  "Symptom_DarkUrine":{EN:"Dark urine",VN:"Nước tiểu sẫm màu",FR:"Urines foncées",ZH:"尿色深"},
  "Symptom_Depression":{EN:"Depression",VN:"Trầm cảm",FR:"Dépression",ZH:"抑郁"},
  "Symptom_Diarrhea":{EN:"Diarrhea",VN:"Tiêu chảy",FR:"Diarrhée",ZH:"腹泻"},
  "Symptom_DistendingPain":{EN:"Distending pain",VN:"Đau căng tức",FR:"Douleur distensive",ZH:"胀痛"},
  "Symptom_Dizziness":{EN:"Dizziness",VN:"Chóng mặt",FR:"Vertiges",ZH:"眩晕"},
  "Symptom_DryMouth":{EN:"Dry mouth",VN:"Khô miệng",FR:"Bouche sèche",ZH:"口干"},
  "Symptom_DullPain":{EN:"Dull pain",VN:"Đau âm ỉ",FR:"Douleur sourde",ZH:"隐痛"},
  "Symptom_Dysmenorrhea":{EN:"Dysmenorrhea",VN:"Đau bụng kinh",FR:"Dysménorrhée",ZH:"痛经"},
  "Symptom_Fatigue":{EN:"Fatigue",VN:"Mệt mỏi",FR:"Fatigue",ZH:"疲劳"},
  "Symptom_Fever":{EN:"Fever",VN:"Sốt",FR:"Fièvre",ZH:"发热"},
  "Symptom_FixedPain":{EN:"Fixed pain",VN:"Đau cố định",FR:"Douleur fixe",ZH:"固定痛"},
  "Symptom_FrequentUrination":{EN:"Frequent urination",VN:"Tiểu nhiều",FR:"Mictions fréquentes",ZH:"小便频"},
  "Symptom_Headache":{EN:"Headache",VN:"Đau đầu",FR:"Mal de tête",ZH:"头痛"},
  "Symptom_HeavyMenses":{EN:"Heavy menses",VN:"Kinh nhiều",FR:"Règles abondantes",ZH:"月经过多"},
  "Symptom_HeavySensation":{EN:"Heavy sensation",VN:"Cảm giác nặng nề",FR:"Sensation de lourdeur",ZH:"沉重感"},
  "Symptom_Insomnia":{EN:"Insomnia",VN:"Mất ngủ",FR:"Insomnie",ZH:"失眠"},
  "Symptom_IrregularMenses":{EN:"Irregular menses",VN:"Kinh nguyệt không đều",FR:"Règles irrégulières",ZH:"月经不调"},
  "Symptom_Leukorrhea":{EN:"Leukorrhea",VN:"Khí hư",FR:"Leucorrhée",ZH:"带下"},
  "Symptom_LooseStools":{EN:"Loose stools",VN:"Phân lỏng",FR:"Selles molles",ZH:"溏便"},
  "Symptom_Nausea":{EN:"Nausea",VN:"Buồn nôn",FR:"Nausées",ZH:"恶心"},
  "Symptom_NightSweats":{EN:"Night sweats",VN:"Đổ mồ hôi đêm",FR:"Sueurs nocturnes",ZH:"盗汗"},
  "Symptom_NoThirst":{EN:"No thirst",VN:"Không khát",FR:"Pas de soif",ZH:"不渴"},
  "Symptom_PainfulUrination":{EN:"Painful urination",VN:"Tiểu đau",FR:"Mictions douloureuses",ZH:"小便痛"},
  "Symptom_Palpitations":{EN:"Palpitations",VN:"Hồi hộp",FR:"Palpitations",ZH:"心悸"},
  "Symptom_PoorAppetite":{EN:"Poor appetite",VN:"Chán ăn",FR:"Manque d’appétit",ZH:"食欲不振"},
  "Symptom_PoorMemory":{EN:"Poor memory",VN:"Trí nhớ kém",FR:"Mauvaise mémoire",ZH:"健忘"},
  "Symptom_ScantyMenses":{EN:"Scanty menses",VN:"Kinh ít",FR:"Règles peu abondantes",ZH:"月经过少"},
  "Symptom_ScantyUrine":{EN:"Scanty urine",VN:"Tiểu ít",FR:"Urines rares",ZH:"小便少"},
  "Symptom_ShortnessOfBreath":{EN:"Shortness of breath",VN:"Khó thở",FR:"Essoufflement",ZH:"气短"},
  "Symptom_Sighing":{EN:"Sighing",VN:"Thở dài",FR:"Soupirs",ZH:"太息"},
  "Symptom_SourTaste":{EN:"Sour taste",VN:"Vị chua",FR:"Goût acide",ZH:"口酸"},
  "Symptom_SpontaneousSweating":{EN:"Spontaneous sweating",VN:"Tự ra mồ hôi",FR:"Sueurs spontanées",ZH:"自汗"},
  "Symptom_StabbingPain":{EN:"Stabbing pain",VN:"Đau nhói",FR:"Douleur poignardante",ZH:"刺痛"},
  "Symptom_SweatingOnExertion":{EN:"Sweating on exertion",VN:"Ra mồ hôi khi vận động",FR:"Sueurs à l’effort",ZH:"动则汗出"},
  "Symptom_SweetTaste":{EN:"Sweet taste",VN:"Vị ngọt",FR:"Goût sucré",ZH:"口甜"},
  "Symptom_Thirst":{EN:"Thirst",VN:"Khát nước",FR:"Soif",ZH:"口渴"},
  "Symptom_Tinnitus":{EN:"Tinnitus",VN:"Ù tai",FR:"Acouphènes",ZH:"耳鸣"},
  "Symptom_Vomiting":{EN:"Vomiting",VN:"Nôn",FR:"Vomissements",ZH:"呕吐"},
  "Symptom_Wheezing":{EN:"Wheezing",VN:"Khò khè",FR:"Sifflements",ZH:"喘鸣"},
  "Treatment_AnchorYang":{EN:"Anchor Yang",VN:"Tiềm dương",FR:"Ancrer le Yang",ZH:"潜阳"},
  "Treatment_BreakBloodStasis":{EN:"Break Blood Stasis",VN:"Phá ứ huyết",FR:"Briser la stase de Sang",ZH:"破瘀"},
  "Treatment_CalmShen":{EN:"Calm the Shen",VN:"An thần",FR:"Calmer le Shen",ZH:"安神"},
  "Treatment_ClearLiverHeat":{EN:"Clear Liver Heat",VN:"Thanh Can nhiệt",FR:"Clarifier la Chaleur du Foie",ZH:"清肝热"},
  "Treatment_ConsolidateQi":{EN:"Consolidate Qi",VN:"Cố khí",FR:"Consolider le Qi",ZH:"固气"},
  "Treatment_DescendRebelliousQi":{EN:"Descend rebellious Qi",VN:"Giáng nghịch khí",FR:"Abaisser le Qi rebelle",ZH:"降逆"},
  "Treatment_DispelCold":{EN:"Dispel Cold",VN:"Tán hàn",FR:"Disperser le Froid",ZH:"散寒"},
  "Treatment_ExpelWindHeat":{EN:"Expel Wind‑Heat",VN:"Khu phong nhiệt",FR:"Expulser Vent‑Chaleur",ZH:"祛风热"},
  "Treatment_GenerateFluids":{EN:"Generate fluids",VN:"Sinh tân dịch",FR:"Générer les liquides",ZH:"生津"},
  "Treatment_HarmonizeLiverSpleen":{EN:"Harmonize Liver and Spleen",VN:"Điều hòa Can Tỳ",FR:"Harmoniser Foie‑Rate",ZH:"调和肝脾"},
  "Treatment_HarmonizeLiverStomach":{EN:"Harmonize Liver and Stomach",VN:"Điều hòa Can Vị",FR:"Harmoniser Foie‑Estomac",ZH:"调和肝胃"},
  "Treatment_InduceSweating":{EN:"Induce sweating",VN:"Phát hãn",FR:"Induire la sudation",ZH:"发汗"},
  "Treatment_InvigorateBlood":{EN:"Invigorate Blood",VN:"Hoạt huyết",FR:"Activer le Sang",ZH:"活血"},
  "Treatment_LiftQi":{EN:"Lift Qi",VN:"Thăng khí",FR:"Élever le Qi",ZH:"升气"},
  "Treatment_MoveBlood":{EN:"Move Blood",VN:"Hành huyết",FR:"Activer le Sang",ZH:"活血"},
  "Treatment_PromoteUrination":{EN:"Promote urination",VN:"Lợi niệu",FR:"Promouvoir la diurèse",ZH:"利尿"},
  "Treatment_PurgeHeat":{EN:"Purge Heat",VN:"Tả hỏa",FR:"Purger la Chaleur",ZH:"泻火"},
  "Treatment_ReleaseExterior":{EN:"Release the Exterior",VN:"Giải biểu",FR:"Libérer l’Extérieur",ZH:"解表"},
  "Treatment_ResolveDamp":{EN:"Resolve Damp",VN:"Trừ thấp",FR:"Éliminer l’Humidité",ZH:"祛湿"},
  "Treatment_SecureExterior":{EN:"Secure the Exterior",VN:"Cố biểu",FR:"Consolider l’Extérieur",ZH:"固表"},
  "Treatment_SecureLungQi":{EN:"Secure Lung Qi",VN:"Cố phế khí",FR:"Consolider le Qi du Poumon",ZH:"固肺气"},
  "Treatment_SubdueLiverYang":{EN:"Subdue Liver Yang",VN:"Bình Can tức phong",FR:"Abaisser le Yang du Foie",ZH:"平肝息风"},
  "Treatment_TonifyBlood":{EN:"Nourish Blood",VN:"Bổ huyết",FR:"Nourrir le Sang",ZH:"养血"},
  "Treatment_TonifyQi":{EN:"Tonify Qi",VN:"Bổ khí",FR:"Tonifier le Qi",ZH:"补气"},
  "Treatment_TonifyYang":{EN:"Tonify Yang",VN:"Bổ dương",FR:"Tonifier le Yang",ZH:"补阳"},
  "Treatment_TonifyYin":{EN:"Tonify Yin",VN:"Bổ âm",FR:"Tonifier le Yin",ZH:"补阴"},
  "Treatment_TransformPhlegm":{EN:"Transform Phlegm",VN:"Hóa đàm",FR:"Transformer les mucosités",ZH:"化痰"}
};






const { useState, useEffect, useMemo } = React;
 function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }

// ─── Real clinical data from tblPattern, tblFinding, tblPatternFindings,
//     tblPatternPointSet, tblPatternPrinciple, LookupValues ───────────────
const DB = {"patterns":[{"id":5,"code":"P08_YANG_DEFICIENCY","name":"Yang Deficiency","org":"","cat":"Qi/Blood/Fluids","root":true,"branch":false,"tongue":"","pulse":"","findings":[[2, 2, 0], [35, 2, 0], [104, 1, 0], [4, 1, 0], [1, 2, 0]],"points":[["ST36", t("tonifyQiYang"), 1], ["CV4", "Warm and Tonify Yang", 1], ["CV6", "Tonify Yang", 1], ["KI3", t("tonifyKidYang"), 0], ["SP6", t("tonifyQiBlood"), 0]],"principles":[["Warm and Tonify Yang",1,0]]},{"id":6,"code":"P11_DAMP_ACC","name":"Damp Accunulation","org":"","cat":"Qi/Blood/Fluids","root":false,"branch":true,"tongue":"","pulse":"","findings":[[54, 2, 0], [5, 2, 0], [8, 2, 0], [4, 1, 0], [55, 1, 0]],"points":[["SP9", "Resolve Dampness", 1], ["SP6", "Tonify Spleen, resolve Damp", 1], ["ST36", t("tonifySplQi"), 0], ["CV12", "Regulate Middle Jiao", 0], ["UB20", "Back-Shu of Spleen", 0]],"principles":[["Transform Dampness",0,1]]},{"id":8,"code":"P008","name":"Liver Qi Stagnation","org":"","cat":"Zang-Fu","root":false,"branch":false,"tongue":"Normal or slightly red sides","pulse":"Wiry","findings":[[12,3,1],[13,3,1],[14,3,1],[15,3,1],[139,2,1],[172,2,1]],"points":[["LV3","tonify",1,3],["LI4","harmonize",0,1],["GB34","tonify",1,3],["PC6","clear",0,2],["SJ6","clear",0,2]],"principles":[["Move Qi",0,1]]},{"id":9,"code":"P009","name":"Liver Blood Deficiency","org":"","cat":"Zang-Fu","root":false,"branch":false,"tongue":"Pale, thin, dry","pulse":"Thin, choppy","findings":[[16,3,1],[17,3,1],[18,3,1],[19,3,1]],"points":[["LV8","tonify",1,3],["SP6","tonify",1,3],["ST36","tonify",1,3]],"principles":[["Nourish Blood",1,0]]},{"id":10,"code":"P010","name":"Liver Yin Deficiency","org":"","cat":"Zang-Fu","root":false,"branch":false,"tongue":"Red, peeled sides","pulse":"Thin, rapid","findings":[[15,3,1],[16,3,1],[20,3,1],[21,3,1]],"points":[["LV3","tonify",1,3],["KI3","drain",0,2],["SP6","tonify",1,3],["LI1","regulate",0,2]],"principles":[["Nourish Yin",1,0]]},{"id":11,"code":"P011","name":"Liver Yang Rising","org":"","cat":"Zang-Fu","root":false,"branch":false,"tongue":"Red edges","pulse":"Wiry, rapid","findings":[[22,3,1],[17,3,1],[15,3,1],[21,3,1],[145,2,1]],"points":[["GB20","drain",0,2],["LV3","regulate",0,2],["KI3","tonify",1,3],["SP6","tonify",1,3],["LV2","drain",0,2]],"principles":[]},{"id":12,"code":"P012","name":"Liver Fire Blazing","org":"","cat":"Zang-Fu","root":false,"branch":false,"tongue":"Red, dry yellow coat","pulse":"Wiry, rapid","findings":[[23,3,1],[24,3,1],[25,3,1],[22,3,1]],"points":[["LV2","drain",0,2],["GB20","drain",0,2],["LI11","tonify",1,3],["GB34","drain",0,2]],"principles":[]},{"id":13,"code":"P013","name":"Liver Wind","org":"","cat":"Zang-Fu","root":false,"branch":false,"tongue":"Trembling","pulse":"Wiry","findings":[[26,3,1],[17,3,1],[27,3,1],[147,2,1],[172,2,1]],"points":[["LV3","clear",0,2],["GB20","clear",0,2],["DU16","clear",0,2],["DU20","clear",0,2]],"principles":[]},{"id":14,"code":"P014","name":"Liver Cold Stagnation","org":"","cat":"Zang-Fu","root":false,"branch":false,"tongue":"Pale, wet","pulse":"Deep, wiry","findings":[[28,3,1],[29,3,1]],"points":[["LV1","tonify",1,3],["LV3","tonify",1,3],["REN4","tonify",1,3],["KI3","drain",0,2]],"principles":[["Move Qi",0,1],["Warm Interior",0,1]]},{"id":15,"code":"P015","name":"Liver Damp-Heat","org":"","cat":"Zang-Fu","root":false,"branch":false,"tongue":"Red, sticky yellow coat","pulse":"Slippery, wiry, rapid","findings":[[30,3,1],[25,3,1],[31,3,1]],"points":[["GB34","clear",0,2],["SP9","drain",0,2],["LV3","harmonize",0,1],["LI11","tonify",1,3]],"principles":[["Transform Dampness",0,1],["Clear Heat",0,1]]},{"id":16,"code":"P016","name":"Heart Qi Deficiency","org":"","cat":"Zang-Fu","root":false,"branch":false,"tongue":"Pale","pulse":"Weak","findings":[[32,3,1],[33,3,1],[34,3,1],[140,2,1],[177,2,1]],"points":[["HT5","tonify",1,3],["PC6","tonify",1,3],["UB15","tonify",1,3],["REN6","tonify",1,3]],"principles":[["Tonify Qi",1,0]]},{"id":17,"code":"P017","name":"Heart Yang Deficiency","org":"","cat":"Zang-Fu","root":false,"branch":false,"tongue":"Pale, wet","pulse":"Deep, weak","findings":[[35,3,1],[33,3,1],[36,3,1]],"points":[["DU14","tonify",1,3],["HT5","tonify",1,3],["REN4","tonify",1,3],["UB15","tonify",1,3]],"principles":[["Warm and Tonify Yang",1,0]]},{"id":18,"code":"P018","name":"Heart Blood Deficiency","org":"","cat":"Zang-Fu","root":false,"branch":false,"tongue":"Pale, thin","pulse":"Thin, choppy","findings":[[37,3,1],[38,3,1],[39,3,1]],"points":[["HT7","tonify",1,3],["SP6","tonify",1,3],["UB17","tonify",1,3],["REN14","tonify",1,3]],"principles":[["Nourish Blood",1,0]]},{"id":19,"code":"P019","name":"Heart Yin Deficiency","org":"","cat":"Zang-Fu","root":false,"branch":false,"tongue":"Red, no coat","pulse":"Thin, rapid","findings":[[37,3,1],[20,3,1],[15,3,1]],"points":[["HT7","tonify",1,3],["KI6","tonify",1,3],["PC6","tonify",1,3],["REN4","tonify",1,3]],"principles":[["Nourish Yin",1,0]]},{"id":20,"code":"P020","name":"Heart Fire Blazing","org":"","cat":"Zang-Fu","root":false,"branch":false,"tongue":"Red tip, yellow coat","pulse":"Rapid, full","findings":[[40,3,1],[41,3,1],[37,3,1]],"points":[["HT8","clear",0,2],["HT9","clear",0,2],["LI11","clear",0,2],["REN15","clear",0,2]],"principles":[]},{"id":21,"code":"P021","name":"Phlegm-Fire Harassing Heart","org":"","cat":"Zang-Fu","root":false,"branch":false,"tongue":"Red, sticky yellow coat","pulse":"Slippery, rapid","findings":[[41,3,1],[37,3,1],[42,3,1],[43,3,1]],"points":[["PC7","clear",0,2],["HT8","clear",0,2],["ST40","drain",0,2],["REN12","nourish",1,3]],"principles":[]},{"id":22,"code":"P022","name":"Phlegm Misting the Mind","org":"","cat":"Zang-Fu","root":false,"branch":false,"tongue":"Swollen, sticky coat","pulse":"Slippery","findings":[[44,3,1],[45,3,1],[46,3,1],[176,2,1]],"points":[["PC5","tonify",1,3],["ST40","clear",0,2],["DU20","tonify",1,3],["REN12","tonify",1,3]],"principles":[]},{"id":23,"code":"P023","name":"Spleen Qi Deficiency","org":"","cat":"Zang-Fu","root":false,"branch":false,"tongue":"Pale, swollen","pulse":"Weak","findings":[[32,3,1],[4,3,1],[47,3,1],[177,2,1]],"points":[["ST36","tonify",1,3],["SP3","tonify",1,3],["SP6","tonify",1,3],["UB20","tonify",1,3]],"principles":[["Tonify Qi",1,0]]},{"id":24,"code":"P024","name":"Spleen Yang Deficiency","org":"","cat":"Zang-Fu","root":false,"branch":false,"tongue":"Pale, wet","pulse":"Deep, weak","findings":[[35,3,1],[48,3,1],[49,3,1]],"points":[["ST36","tonify",1,3],["REN6","tonify",1,3],["UB20","tonify",1,3],["SP3","tonify",1,3]],"principles":[["Warm and Tonify Yang",1,0]]},{"id":25,"code":"P025","name":"Spleen Qi Sinking","org":"","cat":"Zang-Fu","root":false,"branch":false,"tongue":"Pale","pulse":"Weak","findings":[[50,3,1],[51,3,1],[140,2,1],[177,2,1]],"points":[["DU20","tonify",1,3],["ST36","tonify",1,3],["REN6","tonify",1,3],["SP3","tonify",1,3]],"principles":[]},{"id":26,"code":"P026","name":"Spleen Not Controlling Blood","org":"","cat":"Zang-Fu","root":false,"branch":false,"tongue":"Pale","pulse":"Weak, thin","findings":[[52,3,1],[53,3,1],[140,2,1]],"points":[["SP1","tonify",1,3],["SP6","tonify",1,3],["UB17","tonify",1,3],["ST36","tonify",1,3]],"principles":[]},{"id":27,"code":"P027","name":"Spleen Dampness","org":"","cat":"Zang-Fu","root":false,"branch":false,"tongue":"Sticky white coat","pulse":"Slippery","findings":[[54,3,1],[55,3,1],[4,3,1],[155,2,1],[176,2,1]],"points":[["SP9","clear",0,2],["ST40","clear",0,2],["REN12","tonify",1,3],["UB20","tonify",1,3]],"principles":[["Transform Dampness",0,1]]},{"id":28,"code":"P028","name":"Spleen Damp-Heat","org":"","cat":"Zang-Fu","root":false,"branch":false,"tongue":"Red, sticky yellow coat","pulse":"Slippery, rapid","findings":[[54,3,1],[25,3,1],[4,3,1]],"points":[["SP9","clear",0,2],["LI11","tonify",1,3],["GB34","tonify",1,3],["ST40","clear",0,2]],"principles":[["Transform Dampness",0,1],["Clear Heat",0,1]]},{"id":29,"code":"P029","name":"Lung Qi Deficiency","org":"","cat":"Zang-Fu","root":false,"branch":false,"tongue":"Pale","pulse":"Weak","findings":[[56,3,1],[57,3,1],[32,3,1],[140,2,1],[177,2,1]],"points":[["LU9","tonify",1,3],["LU7","move",0,2],["ST36","tonify",1,3],["UB13","tonify",1,3]],"principles":[["Tonify Qi",1,0]]},{"id":30,"code":"P030","name":"Lung Yin Deficiency","org":"","cat":"Zang-Fu","root":false,"branch":false,"tongue":"Red, peeled","pulse":"Thin, rapid","findings":[[58,3,1],[59,3,1],[20,3,1]],"points":[["LU9","tonify",1,3],["KI6","tonify",1,3],["UB13","tonify",1,3],["SP6","tonify",1,3]],"principles":[["Nourish Yin",1,0]]},{"id":31,"code":"P031","name":"Wind-Cold Invasion","org":"","cat":"Zang-Fu","root":false,"branch":false,"tongue":"Thin white coat","pulse":"Floating, tight","findings":[[60,3,1],[61,3,1],[62,3,1],[157,2,1]],"points":[["LU7","warm",1,3],["LI4","tonify",1,3],["GB20","clear",0,2],["UB12","clear",0,2]],"principles":[["Warm Interior",0,1]]},{"id":32,"code":"P032","name":"Wind-Heat Invasion","org":"","cat":"Zang-Fu","root":false,"branch":false,"tongue":"Red tip, thin yellow coat","pulse":"Floating, rapid","findings":[[61,3,1],[63,3,1],[64,3,1]],"points":[["LI4","tonify",1,3],["LI11","tonify",1,3],["SJ5","clear",0,2],["LU10","clear",0,2]],"principles":[["Clear Heat",0,1]]},{"id":33,"code":"P033","name":"Lung Phlegm-Damp","org":"","cat":"Zang-Fu","root":false,"branch":false,"tongue":"Swollen, sticky white coat","pulse":"Slippery","findings":[[65,3,1],[42,3,1],[176,2,1]],"points":[["ST40","clear",0,2],["LU5","clear",0,2],["LU1","tonify",1,3],["REN12","regulate",0,2]],"principles":[["Transform Dampness",0,1]]},{"id":34,"code":"P034","name":"Lung Phlegm-Heat","org":"","cat":"Zang-Fu","root":false,"branch":false,"tongue":"Red, sticky yellow coat","pulse":"Slippery, rapid","findings":[[66,3,1],[61,3,1]],"points":[["LU5","tonify",1,3],["LU10","clear",0,2],["ST40","clear",0,2],["LI11","clear",0,2]],"principles":[["Clear Heat",0,1]]},{"id":35,"code":"P035","name":"Kidney Yang Deficiency","org":"","cat":"Zang-Fu","root":false,"branch":false,"tongue":"Pale, wet","pulse":"Deep, weak","findings":[[67,3,1],[35,3,1],[32,3,1]],"points":[["DU4","tonify",1,3],["REN4","tonify",1,3],["KI3","clear",0,2],["UB23","tonify",1,3]],"principles":[["Warm and Tonify Yang",1,0]]},{"id":36,"code":"P036","name":"Kidney Yin Deficiency","org":"","cat":"Zang-Fu","root":false,"branch":false,"tongue":"Red, peeled","pulse":"Thin, rapid","findings":[[21,3,1],[20,3,1],[68,3,1]],"points":[["KI3","clear",0,2],["KI6","tonify",1,3],["SP6","tonify",1,3],["UB23","tonify",1,3]],"principles":[["Nourish Yin",1,0]]},{"id":37,"code":"P037","name":"Kidney Qi Deficiency","org":"","cat":"Zang-Fu","root":false,"branch":false,"tongue":"Pale","pulse":"Weak","findings":[[69,3,1],[32,3,1],[70,3,1],[140,2,1],[177,2,1]],"points":[["KI3","clear",0,2],["UB23","tonify",1,3],["REN6","tonify",1,3]],"principles":[["Tonify Qi",1,0]]},{"id":38,"code":"P038","name":"Kidney Essence Deficiency","org":"","cat":"Zang-Fu","root":false,"branch":false,"tongue":"Pale or red without coat","pulse":"Thin, weak","findings":[[39,3,1],[71,3,1],[159,2,1]],"points":[["KI3","clear",0,2],["DU20","tonify",1,3],["UB23","tonify",1,3],["REN4","tonify",1,3]],"principles":[]},{"id":39,"code":"P039","name":"Kidney Failing to Grasp Qi","org":"","cat":"Zang-Fu","root":false,"branch":false,"tongue":"Pale","pulse":"Weak, deep","findings":[[72,3,1],[57,3,1],[73,3,1],[140,2,1]],"points":[["KI3","clear",0,2],["KI7","tonify",1,3],["LU7","move",0,2],["UB23","tonify",1,3]],"principles":[]},{"id":40,"code":"P040","name":"Stomach Heat","org":"","cat":"Zang-Fu","root":false,"branch":false,"tongue":"Red, yellow coat","pulse":"Rapid","findings":[[74,3,1],[64,3,1],[75,3,1],[174,2,1]],"points":[["ST44","tonify",1,3],["ST34","clear",0,2],["LI11","clear",0,2]],"principles":[["Clear Heat",0,1]]},{"id":41,"code":"P041","name":"Stomach Yin Deficiency","org":"","cat":"Zang-Fu","root":false,"branch":false,"tongue":"Red, peeled center","pulse":"Thin, rapid","findings":[[76,3,1],[68,3,1],[77,3,1]],"points":[["ST36","tonify",1,3],["SP6","tonify",1,3],["REN12","tonify",1,3]],"principles":[["Nourish Yin",1,0]]},{"id":42,"code":"P042","name":"Food Stagnation","org":"","cat":"Zang-Fu","root":false,"branch":false,"tongue":"Thick coat","pulse":"Slippery","findings":[[78,3,1],[79,3,1],[80,3,1],[161,2,1],[176,2,1]],"points":[["REN10","tonify",1,3],["ST21","tonify",1,3],["ST40","clear",0,2],["LI10","tonify",1,3]],"principles":[["Move Qi",0,1]]},{"id":43,"code":"P043","name":"Stomach Cold","org":"","cat":"Zang-Fu","root":false,"branch":false,"tongue":"Pale, wet","pulse":"Slow, deep","findings":[[81,3,1]],"points":[["ST36","tonify",1,3],["REN12","tonify",1,3],["UB20","tonify",1,3]],"principles":[["Warm Interior",0,1]]},{"id":44,"code":"P044","name":"Gallbladder Damp-Heat","org":"","cat":"Zang-Fu","root":false,"branch":false,"tongue":"Red, sticky yellow coat","pulse":"Slippery, wiry","findings":[[30,3,1],[25,3,1],[55,3,1]],"points":[["GB34","clear",0,2],["GB24","clear",0,2],["SP9","tonify",1,3],["LI11","tonify",1,3]],"principles":[["Transform Dampness",0,1],["Clear Heat",0,1]]},{"id":45,"code":"P045","name":"Gallbladder Qi Deficiency","org":"","cat":"Zang-Fu","root":false,"branch":false,"tongue":"Pale","pulse":"Weak","findings":[[82,3,1],[83,3,1],[14,3,1],[140,2,1],[177,2,1]],"points":[["GB40","tonify",1,3],["ST36","tonify",1,3],["UB19","tonify",1,3]],"principles":[["Tonify Qi",1,0]]},{"id":46,"code":"P046","name":"SI Qi Pain","org":"","cat":"Zang-Fu","root":false,"branch":false,"tongue":"White coat","pulse":"Wiry","findings":[[84,3,1],[85,3,1],[162,2,1],[172,2,1]],"points":[["ST39","clear",0,2],["REN6","regulate",0,2],["GB34","clear",0,2]],"principles":[]},{"id":47,"code":"P047","name":"SI Qi Tied","org":"","cat":"Zang-Fu","root":false,"branch":false,"tongue":"Thick white coat","pulse":"Deep, wiry","findings":[[86,3,1],[87,3,1],[163,2,1]],"points":[["ST39","clear",0,2],["LI4","tonify",1,3],["REN6","tonify",1,3]],"principles":[]},{"id":48,"code":"P048","name":"SI Damp-Heat","org":"","cat":"Zang-Fu","root":false,"branch":false,"tongue":"Red, sticky yellow coat","pulse":"Slippery, rapid","findings":[[88,3,1],[89,3,1]],"points":[["SI2","clear",0,2],["SI5","clear",0,2],["SP9","clear",0,2],["UB22","tonify",1,3]],"principles":[["Transform Dampness",0,1],["Clear Heat",0,1]]},{"id":49,"code":"P049","name":"LI Damp-Heat","org":"","cat":"Zang-Fu","root":false,"branch":false,"tongue":"Red, sticky yellow coat","pulse":"Slippery, rapid","findings":[[90,3,1],[49,3,1]],"points":[["ST37","clear",0,2],["LI11","tonify",1,3],["SP9","tonify",1,3],["UB25","tonify",1,3]],"principles":[["Transform Dampness",0,1],["Clear Heat",0,1]]},{"id":50,"code":"P050","name":"LI Dryness","org":"","cat":"Zang-Fu","root":false,"branch":false,"tongue":"Dry","pulse":"Thin","findings":[[91,3,1],[64,3,1],[142,2,1],[141,2,1]],"points":[["ST25","tonify",1,3],["SP6","tonify",1,3],["ST36","tonify",1,3]],"principles":[]},{"id":51,"code":"P051","name":"LI Cold","org":"","cat":"Zang-Fu","root":false,"branch":false,"tongue":"Pale","pulse":"Deep, tight","findings":[[92,3,1],[48,3,1],[140,2,1]],"points":[["ST37","tonify",1,3],["REN6","tonify",1,3],["ST25","tonify",1,3]],"principles":[["Warm Interior",0,1]]},{"id":52,"code":"P052","name":"Bladder Damp-Heat","org":"","cat":"Zang-Fu","root":false,"branch":false,"tongue":"Red, sticky yellow coat","pulse":"Slippery, rapid","findings":[[88,3,1],[93,3,1]],"points":[["UB28","clear",0,2],["SP9","clear",0,2],["REN3","tonify",1,3],["UB22","tonify",1,3]],"principles":[["Transform Dampness",0,1],["Clear Heat",0,1]]},{"id":53,"code":"P053","name":"Bladder Damp-Cold","org":"","cat":"Zang-Fu","root":false,"branch":false,"tongue":"White sticky coat","pulse":"Slippery, slow","findings":[[94,3,1],[54,3,1],[164,2,1]],"points":[["UB28","tonify",1,3],["REN3","tonify",1,3],["SP9","tonify",1,3]],"principles":[["Transform Dampness",0,1],["Warm Interior",0,1]]},{"id":54,"code":"P054","name":"PC Heat","org":"","cat":"Zang-Fu","root":false,"branch":false,"tongue":"Deep red","pulse":"Thin, rapid","findings":[[61,3,1],[95,3,1],[96,3,1],[165,2,1]],"points":[["PC8","clear",0,2],["HT8","clear",0,2],["LI11","clear",0,2]],"principles":[["Clear Heat",0,1]]},{"id":55,"code":"P055","name":"PC Blood Stasis","org":"","cat":"Zang-Fu","root":false,"branch":false,"tongue":"Purple","pulse":"Choppy","findings":[[97,3,1],[33,3,1],[98,3,1],[166,2,1],[173,2,1]],"points":[["PC6","tonify",1,3],["UB17","tonify",1,3],["SP10","tonify",1,3],["REN17","tonify",1,3]],"principles":[]},{"id":56,"code":"P056","name":"Upper Jiao Heat","org":"","cat":"Zang-Fu","root":false,"branch":false,"tongue":"Red tip","pulse":"Rapid","findings":[[99,3,1],[61,3,1],[63,3,1],[61,3,1],[63,3,1],[99,3,1],[151,2,1],[151,2,1],[174,2,1],[174,2,1]],"points":[["LU5","tonify",1,3],["LU10","clear",0,2],["LI11","clear",0,2],["SJ5","clear",0,2],["LU5","clear",0,2],["LU10","clear",0,2],["LI11","clear",0,2],["SJ5","clear",0,2]],"principles":[["Clear Heat",0,1]]},{"id":57,"code":"P057","name":"Middle Jiao Damp-Heat","org":"","cat":"Zang-Fu","root":false,"branch":false,"tongue":"Sticky yellow coat","pulse":"Slippery, rapid","findings":[[78,3,1],[55,3,1],[54,3,1],[78,3,1],[55,3,1],[54,3,1],[149,2,1],[149,2,1]],"points":[["REN12","clear",0,2],["ST36","tonify",1,3],["SP9","tonify",1,3],["ST40","drain",0,2],["REN12","regulate",0,2],["ST36","clear",0,2],["SP9","clear",0,2],["ST40","clear",0,2]],"principles":[["Transform Dampness",0,1],["Clear Heat",0,1]]},{"id":58,"code":"P058","name":"Lower Jiao Damp-Heat","org":"","cat":"Zang-Fu","root":false,"branch":false,"tongue":"Red, sticky yellow coat","pulse":"Slippery, rapid","findings":[[89,3,1],[100,3,1],[89,3,1],[100,3,1]],"points":[["REN3","tonify",1,3],["SP9","tonify",1,3],["UB22","tonify",1,3],["REN3","tonify",1,3],["SP9","clear",0,2],["UB22","tonify",1,3]],"principles":[["Transform Dampness",0,1],["Clear Heat",0,1]]},{"id":59,"code":"P059","name":"Qi Deficiency","org":"","cat":"Qi/Blood/Fluids","root":false,"branch":false,"tongue":"Pale","pulse":"Weak","findings":[[32,3,1],[101,3,1],[56,3,1],[140,2,1],[177,2,1]],"points":[["ST36","tonify",1,3],["REN6","tonify",1,3],["SP6","tonify",1,3],["UB20","tonify",1,3]],"principles":[["Tonify Qi",1,0]]},{"id":60,"code":"P060","name":"Qi Stagnation","org":"","cat":"Qi/Blood/Fluids","root":false,"branch":false,"tongue":"Normal","pulse":"Wiry","findings":[[12,3,1],[15,3,1],[13,3,1],[167,2,1],[172,2,1]],"points":[["LV3","move",0,2],["LI4","tonify",1,3],["PC6","regulate",0,2],["GB34","tonify",1,3]],"principles":[["Move Qi",0,1]]},{"id":61,"code":"P061","name":"Qi Sinking","org":"","cat":"Qi/Blood/Fluids","root":false,"branch":false,"tongue":"Pale","pulse":"Weak","findings":[[50,3,1],[51,3,1],[140,2,1],[177,2,1]],"points":[["DU20","tonify",1,3],["ST36","tonify",1,3],["REN6","tonify",1,3],["SP3","tonify",1,3]],"principles":[]},{"id":62,"code":"P062","name":"Qi Rebellion","org":"","cat":"Qi/Blood/Fluids","root":false,"branch":false,"tongue":"Normal","pulse":"Wiry","findings":[[55,3,1],[102,3,1],[80,3,1],[103,3,1],[167,2,1],[172,2,1]],"points":[["PC6","regulate",0,2],["REN17","tonify",1,3],["ST36","tonify",1,3],["LU7","clear",0,2]],"principles":[]},{"id":63,"code":"P063","name":"Blood Deficiency","org":"","cat":"Qi/Blood/Fluids","root":false,"branch":false,"tongue":"Pale, thin","pulse":"Thin","findings":[[17,3,1],[104,3,1],[105,3,1],[141,2,1]],"points":[["LV8","tonify",1,3],["SP6","tonify",1,3],["UB17","tonify",1,3],["ST36","tonify",1,3]],"principles":[["Nourish Blood",1,0]]},{"id":64,"code":"P064","name":"Blood Stasis","org":"","cat":"Qi/Blood/Fluids","root":false,"branch":false,"tongue":"Purple","pulse":"Choppy","findings":[[98,3,1],[106,3,1],[107,3,1],[166,2,1],[173,2,1]],"points":[["SP10","tonify",1,3],["UB17","tonify",1,3],["LV3","tonify",1,3],["LI4","tonify",1,3]],"principles":[]},{"id":65,"code":"P065","name":"Blood Heat","org":"","cat":"Qi/Blood/Fluids","root":false,"branch":false,"tongue":"Red","pulse":"Rapid","findings":[[61,3,1],[64,3,1],[53,3,1],[143,2,1],[174,2,1]],"points":[["LI11","clear",0,2],["SP10","clear",0,2],["UB17","regulate",0,2]],"principles":[["Clear Heat",0,1]]},{"id":66,"code":"P066","name":"Dampness","org":"","cat":"Qi/Blood/Fluids","root":false,"branch":false,"tongue":"Sticky coat","pulse":"Slippery","findings":[[54,3,1],[108,3,1],[4,3,1],[154,2,1],[176,2,1]],"points":[["SP9","drain",0,2],["ST40","drain",0,2],["REN12","tonify",1,3],["UB20","tonify",1,3]],"principles":[["Transform Dampness",0,1]]},{"id":67,"code":"P067","name":"Phlegm","org":"","cat":"Qi/Blood/Fluids","root":false,"branch":false,"tongue":"Swollen, sticky coat","pulse":"Slippery","findings":[[109,3,1],[17,3,1],[42,3,1],[176,2,1]],"points":[["ST40","drain",0,2],["REN12","tonify",1,3],["LU5","clear",0,2],["LU1","tonify",1,3]],"principles":[]},{"id":68,"code":"P068","name":"Dryness","org":"","cat":"Qi/Blood/Fluids","root":false,"branch":false,"tongue":"Dry","pulse":"Thin","findings":[[110,3,1],[111,3,1],[87,3,1],[142,2,1],[141,2,1]],"points":[["LU9","clear",0,2],["KI6","tonify",1,3],["SP6","tonify",1,3]],"principles":[]},{"id":69,"code":"P069","name":"Water Retention","org":"","cat":"Qi/Blood/Fluids","root":false,"branch":false,"tongue":"Pale, swollen","pulse":"Deep","findings":[[108,3,1],[112,3,1],[175,2,1]],"points":[["REN9","tonify",1,3],["UB23","tonify",1,3],["SP9","tonify",1,3],["KI7","tonify",1,3]],"principles":[]},{"id":70,"code":"P070","name":"Taiyang Wind Attack","org":"","cat":"Six Stages","root":false,"branch":false,"tongue":"Thin white coat","pulse":"Floating","findings":[[60,3,1],[61,3,1],[113,3,1],[157,2,1],[179,2,1]],"points":[["LU7","clear",0,2],["UB12","clear",0,2],["GB20","regulate",0,2],["LI4","tonify",1,3]],"principles":[]},{"id":71,"code":"P071","name":"Taiyang Cold Damage","org":"","cat":"Six Stages","root":false,"branch":false,"tongue":"Thin white coat","pulse":"Floating, tight","findings":[[114,3,1],[62,3,1],[157,2,1]],"points":[["UB12","clear",0,2],["UB13","tonify",1,3],["LI4","tonify",1,3]],"principles":[["Warm Interior",0,1]]},{"id":72,"code":"P072","name":"Yangming Channel Heat","org":"","cat":"Six Stages","root":false,"branch":false,"tongue":"Red, yellow coat","pulse":"Rapid, full","findings":[[115,3,1],[116,3,1],[64,3,1]],"points":[["LI11","clear",0,2],["ST44","tonify",1,3],["DU14","regulate",0,2]],"principles":[["Clear Heat",0,1]]},{"id":73,"code":"P073","name":"Yangming Organ Heat","org":"","cat":"Six Stages","root":false,"branch":false,"tongue":"Red, dry yellow coat","pulse":"Rapid, forceful","findings":[[87,3,1],[117,3,1]],"points":[["ST25","clear",0,2],["ST37","clear",0,2],["LI11","clear",0,2],["ST44","tonify",1,3]],"principles":[["Clear Heat",0,1]]},{"id":74,"code":"P074","name":"Shaoyang","org":"","cat":"Six Stages","root":false,"branch":false,"tongue":"Thin white or yellow coat","pulse":"Wiry","findings":[[118,3,1],[25,3,1],[168,2,1],[172,2,1]],"points":[["SJ5","regulate",0,2],["GB41","tonify",1,3],["GB34","tonify",1,3]],"principles":[]},{"id":75,"code":"P075","name":"Taiyin","org":"","cat":"Six Stages","root":false,"branch":false,"tongue":"Pale, sticky coat","pulse":"Weak","findings":[[117,3,1],[119,3,1],[48,3,1],[177,2,1]],"points":[["ST36","tonify",1,3],["SP3","tonify",1,3],["REN12","tonify",1,3],["UB20","tonify",1,3]],"principles":[]},{"id":76,"code":"P076","name":"Shaoyin Cold Transformation","org":"","cat":"Six Stages","root":false,"branch":false,"tongue":"Pale, wet","pulse":"Deep, weak","findings":[[35,3,1],[32,3,1],[120,3,1]],"points":[["REN4","tonify",1,3],["KI7","tonify",1,3],["DU4","nourish",1,3],["UB23","tonify",1,3]],"principles":[["Warm Interior",0,1]]},{"id":77,"code":"P077","name":"Shaoyin Heat Transformation","org":"","cat":"Six Stages","root":false,"branch":false,"tongue":"Red, no coat","pulse":"Thin, rapid","findings":[[15,3,1],[37,3,1],[68,3,1]],"points":[["KI3","clear",0,2],["HT7","clear",0,2],["PC6","clear",0,2],["REN4","clear",0,2]],"principles":[["Clear Heat",0,1]]},{"id":78,"code":"P078","name":"Jueyin","org":"","cat":"Six Stages","root":false,"branch":false,"tongue":"Pale or red","pulse":"Wiry","findings":[[121,3,1],[122,3,1],[123,3,1],[169,2,1],[172,2,1]],"points":[["LV3","tonify",1,3],["PC6","regulate",0,2],["SP4","tonify",1,3]],"principles":[]},{"id":79,"code":"P079","name":"Wei Level Heat","org":"","cat":"Four Levels","root":false,"branch":false,"tongue":"Slight red tip","pulse":"Floating, rapid","findings":[[61,3,1],[124,3,1],[63,3,1],[170,2,1]],"points":[["LI4","clear",0,2],["SJ5","clear",0,2],["LU10","clear",0,2],["GB20","harmonize",0,1]],"principles":[["Clear Heat",0,1]]},{"id":80,"code":"P080","name":"Qi Level Heat","org":"","cat":"Four Levels","root":false,"branch":false,"tongue":"Red, yellow coat","pulse":"Rapid","findings":[[115,3,1],[64,3,1],[116,3,1],[174,2,1]],"points":[["LI11","clear",0,2],["ST44","tonify",1,3],["DU14","clear",0,2]],"principles":[["Clear Heat",0,1]]},{"id":81,"code":"P081","name":"Ying Level Heat","org":"","cat":"Four Levels","root":false,"branch":false,"tongue":"Deep red","pulse":"Thin, rapid","findings":[[37,3,1],[15,3,1],[125,3,1],[165,2,1]],"points":[["HT8","clear",0,2],["PC8","clear",0,2],["KI6","tonify",1,3]],"principles":[["Clear Heat",0,1]]},{"id":82,"code":"P082","name":"Xue Level Heat","org":"","cat":"Four Levels","root":false,"branch":false,"tongue":"Deep red or purple","pulse":"Wiry, rapid","findings":[[53,3,1],[95,3,1],[125,3,1],[171,2,1]],"points":[["SP10","regulate",0,2],["KI6","tonify",1,3],["UB17","regulate",0,2]],"principles":[["Clear Heat",0,1]]},{"id":83,"code":"P083","name":"Upper Jiao Heat","org":"","cat":"San Jiao","root":false,"branch":false,"tongue":"Red tip","pulse":"Rapid","findings":[[99,3,1],[61,3,1],[63,3,1],[61,3,1],[63,3,1],[99,3,1],[151,2,1],[151,2,1],[174,2,1],[174,2,1]],"points":[["LU5","tonify",1,3],["LU10","clear",0,2],["LI11","clear",0,2],["SJ5","clear",0,2],["LU5","clear",0,2],["LU10","clear",0,2],["LI11","clear",0,2],["SJ5","clear",0,2]],"principles":[["Clear Heat",0,1]]},{"id":84,"code":"P084","name":"Middle Jiao Damp-Heat","org":"","cat":"San Jiao","root":false,"branch":false,"tongue":"Sticky yellow coat","pulse":"Slippery, rapid","findings":[[78,3,1],[55,3,1],[54,3,1],[78,3,1],[55,3,1],[54,3,1],[149,2,1],[149,2,1]],"points":[["REN12","clear",0,2],["ST36","tonify",1,3],["SP9","tonify",1,3],["ST40","drain",0,2],["REN12","regulate",0,2],["ST36","clear",0,2],["SP9","clear",0,2],["ST40","clear",0,2]],"principles":[["Transform Dampness",0,1],["Clear Heat",0,1]]},{"id":85,"code":"P085","name":"Lower Jiao Damp-Heat","org":"","cat":"San Jiao","root":false,"branch":false,"tongue":"Red, sticky yellow coat","pulse":"Slippery, rapid","findings":[[89,3,1],[100,3,1],[89,3,1],[100,3,1]],"points":[["REN3","tonify",1,3],["SP9","tonify",1,3],["UB22","tonify",1,3],["REN3","tonify",1,3],["SP9","clear",0,2],["UB22","tonify",1,3]],"principles":[["Transform Dampness",0,1],["Clear Heat",0,1]]},{"id":86,"code":"P086","name":"Lower Jiao Heat in Blood","org":"","cat":"San Jiao","root":false,"branch":false,"tongue":"Deep red","pulse":"Rapid","findings":[[115,3,1],[95,3,1],[53,3,1],[165,2,1],[174,2,1]],"points":[["SP10","nourish",1,3],["UB17","tonify",1,3],["KI6","tonify",1,3]],"principles":[["Clear Heat",0,1]]},{"id":87,"code":"P087","name":"Upper Jiao Heat Injuring Fluids","org":"","cat":"San Jiao","root":false,"branch":false,"tongue":"Red","pulse":"Rapid","findings":[[64,3,1],[15,3,1],[126,3,1],[143,2,1],[174,2,1]],"points":[["LU9","clear",0,2],["KI6","tonify",1,3],["SP6","tonify",1,3]],"principles":[["Clear Heat",0,1]]},{"id":88,"code":"P088","name":"Lower Jiao Water Accumulation","org":"","cat":"San Jiao","root":false,"branch":false,"tongue":"Pale, swollen","pulse":"Deep, slow","findings":[[108,3,1],[112,3,1],[54,3,1]],"points":[["REN9","tonify",1,3],["UB22","tonify",1,3],["SP9","tonify",1,3],["KI7","tonify",1,3]],"principles":[]},{"id":89,"code":"P089","name":"Brain Essence Deficiency","org":"","cat":"Extraordinary Organs","root":false,"branch":false,"tongue":"Pale or red without coat","pulse":"Thin, weak","findings":[[39,3,1],[17,3,1],[21,3,1],[159,2,1]],"points":[["DU20","tonify",1,3],["KI3","clear",0,2],["UB23","tonify",1,3],["REN4","tonify",1,3]],"principles":[]},{"id":90,"code":"P090","name":"Bone Marrow Deficiency","org":"","cat":"Extraordinary Organs","root":false,"branch":false,"tongue":"Pale","pulse":"Weak","findings":[[127,3,1],[128,3,1],[71,3,1],[140,2,1],[177,2,1]],"points":[["KI3","clear",0,2],["UB23","tonify",1,3],["DU20","tonify",1,3],["SP6","tonify",1,3]],"principles":[]},{"id":91,"code":"P091","name":"Uterus Blood Deficiency","org":"","cat":"Extraordinary Organs","root":false,"branch":false,"tongue":"Pale or red","pulse":"Thin","findings":[[129,3,1],[130,3,1],[169,2,1],[141,2,1]],"points":[["REN4","tonify",1,3],["SP6","tonify",1,3],["UB17","tonify",1,3],["ST36","tonify",1,3]],"principles":[["Nourish Blood",1,0]]},{"id":92,"code":"P092","name":"Uterus Yin Deficiency","org":"","cat":"Extraordinary Organs","root":false,"branch":false,"tongue":"Red, peeled","pulse":"Thin, rapid","findings":[[129,3,1],[18,3,1],[17,3,1]],"points":[["KI3","tonify",1,3],["KI6","tonify",1,3],["SP6","tonify",1,3],["REN4","tonify",1,3]],"principles":[["Nourish Yin",1,0]]},{"id":93,"code":"P093","name":"Uterus Cold","org":"","cat":"Extraordinary Organs","root":false,"branch":false,"tongue":"Pale, wet","pulse":"Deep, tight","findings":[[129,3,1],[131,3,1],[132,3,1]],"points":[["REN4","tonify",1,3],["ST29","tonify",1,3],["SP6","clear",0,2],["KI7","tonify",1,3]],"principles":[["Warm Interior",0,1]]},{"id":94,"code":"P094","name":"Wind-Heat with Lung Qi Deficiency","org":"","cat":"Combined Patterns","root":false,"branch":false,"tongue":"Red tip","pulse":"Floating, rapid","findings":[[61,3,1],[60,3,1],[63,3,1],[99,3,1],[151,2,1]],"points":[["LU9","clear",0,2],["LU7","move",0,2],["LI4","tonify",1,3],["SJ5","clear",0,2]],"principles":[["Tonify Qi",1,0],["Clear Heat",0,1]]},{"id":95,"code":"P095","name":"Phlegm-Heat in Lungs","org":"","cat":"Combined Patterns","root":false,"branch":false,"tongue":"Red, sticky yellow coat","pulse":"Slippery, rapid","findings":[[66,3,1],[61,3,1]],"points":[["LU5","clear",0,2],["LU10","clear",0,2],["ST40","clear",0,2],["LI11","clear",0,2]],"principles":[["Clear Heat",0,1]]},{"id":96,"code":"P096","name":"Phlegm-Damp with Lung Qi Deficiency","org":"","cat":"Combined Patterns","root":false,"branch":false,"tongue":"Pale, swollen","pulse":"Slippery, weak","findings":[[133,3,1],[32,3,1]],"points":[["LU9","tonify",1,3],["ST36","tonify",1,3],["SP9","tonify",1,3],["ST40","clear",0,2]],"principles":[["Tonify Qi",1,0],["Transform Dampness",0,1]]},{"id":97,"code":"P097","name":"Spleen Yang Deficiency with Dampness","org":"","cat":"Combined Patterns","root":false,"branch":false,"tongue":"Pale, wet","pulse":"Deep, weak","findings":[[4,3,1],[32,3,1],[35,3,1]],"points":[["SP9","clear",0,2],["ST36","tonify",1,3],["UB20","tonify",1,3],["REN6","tonify",1,3]],"principles":[["Warm and Tonify Yang",1,0],["Transform Dampness",0,1]]},{"id":98,"code":"P098","name":"Liver Qi Stagnation with Spleen Deficiency","org":"","cat":"Combined Patterns","root":false,"branch":false,"tongue":"Pale","pulse":"Wiry, weak","findings":[[30,3,1],[15,3,1],[32,3,1],[140,2,1]],"points":[["LV3","tonify",1,3],["SP6","tonify",1,3],["ST36","tonify",1,3],["PC6","regulate",0,2]],"principles":[["Move Qi",0,1]]},{"id":99,"code":"P099","name":"Liver Yin Deficiency with Empty Heat","org":"","cat":"Combined Patterns","root":false,"branch":false,"tongue":"Red, peeled","pulse":"Thin, rapid","findings":[[15,3,1],[37,3,1],[20,3,1]],"points":[["LV3","tonify",1,3],["KI3","clear",0,2],["SP6","tonify",1,3],["PC6","regulate",0,2]],"principles":[["Nourish Yin",1,0],["Clear Heat",0,1]]},{"id":100,"code":"P100","name":"Liver Yang Rising with Kidney Yin Deficiency","org":"","cat":"Combined Patterns","root":false,"branch":false,"tongue":"Red edges","pulse":"Wiry, rapid","findings":[[22,3,1],[17,3,1],[21,3,1],[145,2,1]],"points":[["LV3","clear",0,2],["KI3","clear",0,2],["GB20","clear",0,2],["SP6","tonify",1,3]],"principles":[["Nourish Yin",1,0]]},{"id":101,"code":"P101","name":"Liver Overacting on Spleen","org":"","cat":"Combined Patterns","root":false,"branch":false,"tongue":"Sticky coat","pulse":"Slippery, wiry","findings":[[49,3,1],[48,3,1],[134,3,1],[154,2,1]],"points":[["LV3","clear",0,2],["SP6","regulate",0,2],["ST36","tonify",1,3],["REN12","regulate",0,2]],"principles":[]},{"id":102,"code":"P102","name":"Lung and Kidney Qi Deficiency","org":"","cat":"Combined Patterns","root":false,"branch":false,"tongue":"Pale","pulse":"Weak","findings":[[99,3,1],[57,3,1],[56,3,1],[140,2,1],[177,2,1]],"points":[["LU9","tonify",1,3],["KI3","clear",0,2],["UB23","tonify",1,3],["ST36","tonify",1,3]],"principles":[["Tonify Qi",1,0]]},{"id":103,"code":"P103","name":"Lung and Kidney Yin Deficiency","org":"","cat":"Combined Patterns","root":false,"branch":false,"tongue":"Red, peeled","pulse":"Thin, rapid","findings":[[20,3,1],[21,3,1],[111,3,1]],"points":[["LU9","tonify",1,3],["KI6","tonify",1,3],["SP6","tonify",1,3],["UB23","tonify",1,3]],"principles":[["Nourish Yin",1,0]]},{"id":104,"code":"P104","name":"Heart and Spleen Blood Deficiency","org":"","cat":"Combined Patterns","root":false,"branch":false,"tongue":"Pale, thin","pulse":"Thin, choppy","findings":[[33,3,1],[37,3,1],[39,3,1]],"points":[["HT7","tonify",1,3],["SP6","tonify",1,3],["UB17","tonify",1,3],["ST36","tonify",1,3]],"principles":[["Nourish Blood",1,0]]},{"id":105,"code":"P105","name":"Heart and Kidney Yin Deficiency","org":"","cat":"Combined Patterns","root":false,"branch":false,"tongue":"Red, peeled","pulse":"Thin, rapid","findings":[[38,3,1],[33,3,1],[20,3,1]],"points":[["HT7","tonify",1,3],["KI3","clear",0,2],["KI6","tonify",1,3],["PC6","regulate",0,2]],"principles":[["Nourish Yin",1,0]]},{"id":106,"code":"P106","name":"Phlegm Obstructing Heart","org":"","cat":"Combined Patterns","root":false,"branch":false,"tongue":"Swollen, sticky coat","pulse":"Slippery","findings":[[42,3,1],[43,3,1],[17,3,1],[176,2,1]],"points":[["PC5","drain",0,2],["ST40","drain",0,2],["REN12","tonify",1,3],["DU20","tonify",1,3]],"principles":[]},{"id":107,"code":"P107","name":"Heart Blood Stasis","org":"","cat":"Combined Patterns","root":false,"branch":false,"tongue":"Purple","pulse":"Choppy","findings":[[135,3,1],[33,3,1],[166,2,1],[173,2,1]],"points":[["PC6","tonify",1,3],["UB17","tonify",1,3],["SP10","tonify",1,3],["REN17","clear",0,2]],"principles":[]},{"id":108,"code":"P108","name":"Heart and Lung Qi Deficiency","org":"","cat":"Combined Patterns","root":false,"branch":false,"tongue":"Pale","pulse":"Weak","findings":[[32,3,1],[57,3,1],[101,3,1],[140,2,1],[177,2,1]],"points":[["LU9","tonify",1,3],["HT5","move",0,2],["ST36","tonify",1,3],["UB13","tonify",1,3]],"principles":[["Tonify Qi",1,0]]},{"id":109,"code":"P109","name":"Spleen and Kidney Yang Deficiency","org":"","cat":"Combined Patterns","root":false,"branch":false,"tongue":"Pale, swollen","pulse":"Deep, weak","findings":[[108,3,1],[112,3,1],[32,3,1]],"points":[["REN4","tonify",1,3],["DU4","tonify",1,3],["KI3","clear",0,2],["UB23","tonify",1,3],["SP6","tonify",1,3]],"principles":[["Warm and Tonify Yang",1,0]]},{"id":110,"code":"P110","name":"Spleen and Lung Qi Deficiency","org":"","cat":"Combined Patterns","root":false,"branch":false,"tongue":"Pale","pulse":"Weak","findings":[[4,3,1],[32,3,1],[136,3,1],[140,2,1],[177,2,1]],"points":[["ST36","tonify",1,3],["SP3","tonify",1,3],["LU9","tonify",1,3],["UB20","tonify",1,3]],"principles":[["Tonify Qi",1,0]]},{"id":111,"code":"P111","name":"Liver and Kidney Blood Deficiency","org":"","cat":"Combined Patterns","root":false,"branch":false,"tongue":"Pale, thin","pulse":"Thin","findings":[[17,3,1],[19,3,1],[16,3,1],[141,2,1]],"points":[["LV8","tonify",1,3],["SP6","tonify",1,3],["UB17","tonify",1,3],["KI3","clear",0,2]],"principles":[["Nourish Blood",1,0]]},{"id":112,"code":"P112","name":"Liver and Kidney Yin Deficiency","org":"","cat":"Combined Patterns","root":false,"branch":false,"tongue":"Red, peeled","pulse":"Thin, rapid","findings":[[21,3,1],[67,3,1],[17,3,1]],"points":[["KI3","clear",0,2],["KI6","tonify",1,3],["SP6","tonify",1,3],["LV3","tonify",1,3]],"principles":[["Nourish Yin",1,0]]}],"findings":{"1":["FND_ENERGY_LOW","Low","Symptom","EnergyLevel"],"2":["FND_ENERGY_EXHAUSTED","Exhausted","Symptom","EnergyLevel"],"3":["FND_APPETITE_POOR","Appetite-Poor","Symptom","Appetite"],"4":["FND_STOOL_LOOSE","Loose stools","Symptom","StoolConsistency"],"5":["FND_BLOATING_ALWAYS","Bloating always","Symptom","Bloating"],"6":["FND_TONGUE_PALE",t("tongueBodyPale"),"Symptom","TongueBodyColor"],"7":["FND_TONGUE_RED",t("tongueBodyRed"),"Symptom","TongueBodyColor"],"8":["FND_TONGUE_GREASY",t("tongueCoatGreasy"),"Symptom","TongueMoisture"],"9":["FND_PULSE_WEAK",t("pulseStrWeak"),"Symptom","PulseStrengthLeft"],"10":["FND_PAIN_FIXD","Pain-fixed","Symptom","ChiefComplaint"],"12":["nan","Distention","Symptom","Gas"],"13":["nan","mood swings","Symptom","MoodMain"],"14":["nan","Sighing","Symptom","Breathing"],"15":["nan","Irritability","Symptom","MoodMain"],"16":["nan","Dry eyes","Symptom","VisionHealth"],"17":["nan","Dizziness","Symptom","Dizziness"],"18":["nan","Scanty menses","Symptom","FlowAmount"],"19":["nan","blurred vision","Symptom","VisionHealth"],"20":["nan","Night sweats","Symptom","Sweats"],"21":["nan","Tinnitus","Symptom","Hearing"],"22":["nan","Headache","Symptom","Headache"],"23":["nan","Anger","Symptom","MoodMain"],"24":["nan","Red eyes","Symptom","VisionHealth"],"25":["nan","Bitter taste","Symptom","TasteInMouth"],"26":["nan","Tremors","Symptom","ChiefComplaint"],"27":["nan","Fingers numbness","Symptom","PainFeels"],"190":["nan","Toes numbness","Symptom","PainFeels"],"191":["nan","Sciatic nerve pain","Symptom","PainFeels"],"192":["nan","Sad / Sighing often","Symptom","MoodMain"],"193":["nan","Cold hands / feet","Symptom","TemperatureSense"],"194":["nan","Tennis elbow","Symptom","MusculoPain"],"195":["nan","Arm pain","Symptom","MusculoPain"],"196":["nan","Shoulder pain","Symptom","MusculoPain"],"197":["nan","Stiff neck / Neck pain","Symptom","MusculoPain"],"198":["nan","Knee pain","Symptom","MusculoPain"],"199":["nan","Wrist pain","Symptom","MusculoPain"],"200":["nan","Asthma","Symptom","AsthmaFlag"],"201":["nan","Irregular heartbeat","Symptom","CirculatoryHealth"],"202":["nan","Palpitations","Symptom","CirculatoryHealth"],"203":["nan","High blood pressure","Symptom","CirculatoryHealth"],"204":["nan","Low blood pressure","Symptom","CirculatoryHealth"],"28":["nan","Cold pain in lower abdomen","Symptom","AbdominalIssues"],"29":["nan","Contraction","Symptom","OtherConcern1"],"30":["nan","Hypochondriac pain","Symptom","GeneralHealthNotes"],"31":["nan","Jaundice","Symptom","NotesPractitioner"],"32":["nan","Fatigue","Symptom","FatigueTime"],"33":["nan","Palpitations","Symptom","Palpitations"],"34":["nan","Shortness of breath","Symptom","Breathing"],"35":["nan","Cold limbs","Symptom","LimbCondition"],"36":["nan","Chest discomfort","Symptom","ChestSensation"],"37":["nan","Insomnia","Symptom","SleepQuality"],"38":["nan","Anxiety","Symptom","MoodMain"],"39":["nan","Poor memory","Symptom","Cognitive"],"40":["nan","Mouth ulcers","Symptom","OverallTongueNotes"],"41":["nan","agitation","Symptom","MoodMain"],"42":["nan","chest oppression","Symptom","ChestSensation"],"43":["nan","sputum","Symptom","PhlegmColor"],"44":["nan","Confusion","Symptom","Cognitive"],"45":["nan","mental cloudiness","Symptom","Cognitive"],"46":["nan","lethargy","Symptom","MoodMain"],"47":["nan","poor appetite","Symptom","Appetite"],"48":["nan","diarrhea","Symptom","StoolConsistency"],"49":["nan","abdominal pain","Symptom","AbdominalIssues"],"50":["nan","Prolapse","Symptom","ChiefComplaint"],"51":["nan","bearing-down sensation","Symptom","EnergyLevel"],"52":["nan","Easy bruising","Symptom","NotesPractitioner"],"53":["nan","bleeding","Symptom","ChiefComplaint"],"54":["nan","Heaviness","Symptom","PainFeels"],"55":["nan","nausea","Symptom","Nausea"],"56":["nan","Weak voice","Symptom","Voice"],"57":["nan","SOB","Symptom","Breathing"],"58":["nan","Dry cough","Symptom","CoughType"],"59":["nan","hoarse voice","Symptom","Voice"],"60":["nan","Chills","Symptom","Chills"],"61":["nan","fever","Symptom","ChiefComplaint"],"62":["nan","body aches","Symptom","ChiefComplaint"],"63":["nan","sore throat","Symptom","Throat"],"64":["nan","thirst","Symptom","Thirst"],"65":["nan","Cough with copious sputum","Symptom","CoughType"],"66":["nan","Cough with yellow sputum","Symptom","PhlegmColor"],"67":["nan","Low back pain","Symptom","ChiefComplaint"],"68":["nan","dry mouth","Symptom","Thirst"],"69":["nan","Weak knees","Symptom","LimbCondition"],"70":["nan","frequent urination","Symptom","FrequencyPerDay"],"71":["nan","developmental delay","Symptom","ChiefComplaint"],"72":["nan","Chronic cough","Symptom","CoughType"],"73":["nan","weak inhalation","Symptom","Breathing"],"74":["nan","Burning epigastric pain","Symptom","Heartburn"],"75":["nan","bad breath","Symptom","Breathing"],"76":["nan","Dull epigastric pain","Symptom","Heartburn"],"77":["nan","hunger without desire to eat","Symptom","Appetite"],"78":["nan","Epigastric fullness","Symptom","Gas"],"79":["nan","foul breath","Symptom","Breathing"],"80":["nan","belching","Symptom","Gas"],"81":["nan","Cold epigastric pain relieved by warmth","Symptom","BetterWith"],"82":["nan","Timidity","Symptom","MoodMain"],"83":["nan","Indecision","Symptom","MoodMain"],"84":["nan","Lower abdominal twisting pain","Symptom","AbdominalIssues"],"85":["nan","gas","Symptom","Gas"],"86":["nan","Severe abdominal pain","Symptom","AbdoninalIssues"],"87":["nan","constipation","Symptom","BowelFrequency"],"88":["nan","Burning urination","Symptom","PainOrBurning"],"89":["nan","dark urine","Symptom","UrineColor"],"90":["nan","Diarrhea with foul odor","Symptom","StoolOdor"],"91":["nan","Dry stools","Symptom","StoolConsistency"],"92":["nan","Cold abdominal pain","Symptom","AbdominalIssues"],"93":["nan","frequency","Symptom",""],"94":["nan","Difficult urination","Symptom","UrinaryNotes"],"95":["nan","delirium","Symptom","ChiefComplaint"],"96":["nan","heat signs","Symptom","TemperatureSense"],"97":["nan","Chest pain","Symptom","ChestSensation"],"98":["nan","stabbing pain","Symptom","ChestSensation"],"99":["nan","Cough","Symptom","Cough"],"100":["nan","lower abdominal heaviness","Symptom","AbdominalIssues"],"101":["nan","spontaneous sweating","Symptom","Sweats"],"102":["nan","vomiting","Symptom","Vomiting"],"103":["nan","hiccups","Symptom","Gas"],"104":["nan","pale complexion","Symptom","SkinHealth"],"105":["nan","dry hair","Symptom","SkinHealth"],"106":["nan","fixed pain","Symptom","PainFeels"],"107":["nan","dark clots","Symptom","Clots"],"108":["nan","edema","Symptom","Edema"],"109":["nan","Cough with sputum","Symptom","CoughType"],"110":["nan","Dry skin","Symptom","SkinHealth"],"111":["nan","dry throat","Symptom","Throat"],"112":["nan","urinary difficulty","Symptom","UrinaryNotes"],"113":["nan","stiff neck","Symptom","ChiefComplaint"],"114":["nan","Severe chills","Symptom","ChiefComplaint"],"115":["nan","High fever","Symptom","ChiefComplaint"],"116":["nan","sweating","Symptom","Sweats"],"117":["nan","abdominal fullness","Symptom","AbdominalIssues"],"118":["nan","Alternating chills and fever","Symptom","TemperatureSense"],"119":["nan","cold","Symptom","TemperatureSense"],"120":["nan","desire to sleep","Symptom","SleepQuality"],"121":["nan","Heat above","Symptom","TemperatureSense"],"122":["nan","cold below","Symptom","TemperatureSense"],"123":["nan","vomiting roundworms","Symptom","DigestionNotes"],"124":["nan","slight chills","Symptom","TemperatureSense"],"125":["nan","fever at night","Symptom","TemperatureSense"],"126":["nan","scanty urine","Symptom","FrequencyPerDay"],"127":["nan","Weak bones","Symptom","BoneHealth"],"128":["nan","loose teeth","Symptom","BoneHealth"],"129":["nan","Infertility","Symptom","FertilityConcern"],"130":["nan","irregular menses","Symptom","CycleRegular"],"131":["nan","cold uterus","Symptom","WomenHealthNotes"],"132":["nan","painful periods","Symptom","CrampsSeverity"],"133":["nan","Cough with watery sputum","Symptom","CoughType"],"134":["nan","mucus in stools","Symptom","StoolConsistency"],"135":["nan","Stabbing chest pain","Symptom","ChestSensation"],"136":["nan","weak limbs","Symptom","LimbCondition"],"139":["nan","Normal or slightly red sides","Symptom","TongueBodyColor"],"140":["nan","Pale","Tongue","TongueBodyColor"],"141":["nan","thin","Tongue","TongueCoatingAmount"],"142":["nan","dry","Tongue","TongueMoisture"],"143":["nan","Red","Tongue","TongueBodyColor"],"144":["nan","peeled sides","Tongue","TongueCoatingAmount"],"145":["nan","Red edges","Tongue","TongueBodyColor"],"146":["nan","dry yellow coat","Tongue","TongueCoatingColor"],"147":["nan","Trembling","Tongue","OverallTongueNotes"],"148":["nan","wet","Tongue","TongueMoisture"],"149":["nan","sticky yellow coat","Tongue","TongueMoisture"],"150":["nan","no coat","Tongue","TongueCoatingAmount"],"151":["nan","Red tip","Tongue","TongueBodyColor"],"152":["nan","yellow coat","Tongue","TongueCoatingColor"],"153":["nan","Swollen","Tongue","TongueBody"],"154":["nan","sticky coat","Tongue","TongueMoisture"],"155":["nan","Sticky white coat","Tongue","TongueCoatingColor"],"156":["nan","peeled","Tongue","TongueCoatingAmount"],"157":["nan","Thin white coat","Tongue","TongueCoatingAmount"],"158":["nan","thin yellow coat","Tongue","TongueCoatingColor"],"159":["nan","Pale or red without coat","Tongue","TongueBodyColor"],"160":["nan","peeled center","Tongue","TongueBody"],"161":["nan","Thick coat","Tongue","TongueCoatingAmount"],"162":["nan","White coat","Tongue","TongueCoatingColor"],"163":["nan","Thick white coat","Tongue","TongueCoatingAmount"],"164":["nan","White sticky coat","Tongue","TongueMoisture"],"165":["nan","Deep red","Tongue","TongueBodyColor"],"166":["nan","Purple","Tongue","TongueBodyColor"],"167":["nan","Normal","Tongue","TongueBody"],"168":["nan","Thin white or yellow coat","Tongue","TongueCoatingColor"],"169":["nan","Pale or red","Tongue","TongueBodyColor"],"170":["nan","Slight red tip","Tongue","TongueBodyColor"],"171":["nan","Deep red or purple","Tongue","TongueBodyColor"],"172":["nan","Wiry","Pulse","PulseQualityLeft"],"173":["nan","choppy","Pulse","PulseQualityRight"],"174":["nan","rapid","Pulse","PulseQualityLeft"],"175":["nan","Deep","Pulse","PulseQualityLeft"],"176":["nan","Slippery","Pulse","PulseQualityLeft"],"177":["nan","Weak","Pulse","PulseQualityLeft"],"178":["nan","full","Pulse","PulseQualityLeft"],"179":["nan","Floating","Pulse","PulseQualityLeft"],"180":["nan","tight","Pulse","PulseQualityLeft"],"181":["nan","Slow","Pulse","PulseQualityLeft"],"182":["nan","forceful","Pulse","PulseQualityLeft"],"183":["nan","full","Pulse","PulseQualityRight"],"186":["nan","slippery","Pulse","PulseQualityRight"],"187":["nan","Slow","Pulse","PulseQualityRight"],"188":["nan","Tight","Pulse","PulseQualityRight"]},"lookup":{"ENERGY_LEVEL":[(_lang==="VN"?"Rất cao":_lang==="FR"?"Très élevé":_lang==="ZH"?"极高":"Very high"),(_lang==="VN"?"Cao":_lang==="FR"?"Élevé":_lang==="ZH"?"高":"High"),"Moderate","Low",(_lang==="VN"?"Rất thấp":_lang==="FR"?"Très faible":_lang==="ZH"?"极低":"Very low"),"Exhausted"],"APPETITE":["Good","Normal","Low","Variable","Hungry but no desire to eat","Poor"],"MOOD":["Calm/Balanced","Mood Swing","Stressed","Irritable","Anxious",t("sadSighing"),"Angry/frustrated","Fearful/Worried","Timid, Withdrawn","Lethargic"],"SLEEP_QUALITY":["Normal","Desire to sleep","Difficulty falling asleep","Frequent waking","Restless sleep","Insomnia","Dream-disturbed sleep"],"STOOL_CONSISTENCY":["Normal","Loose","Watery","Sticky","Dry","Hard","Alternating loose/constipation","Mucus in stool"],"THIRST":["Normal","Low thirst","High thirst","Prefers cold drinks","Prefers warm drinks","Dry mouth without thirst"],"SWEATING":["Normal","Spontaneous","Night sweats","Sweats easily","Sweats on exertion","Profuse sweating"],"PULSE_QUALITY":["Moderate","Slippery","Choppy","Stirring","Hidden","Rapid","Slow","Tight","Floating","Deep","Forcelful","Forceless","Large","Faint","Short","Long","Leathery","LeatheryWiry","Hollow","Firm","Irregular","Intermittent","Racing","Knot","Thready","Scatter","Weak","Soft","Big"],"PULSE_QUALITY_VN":["Hoãn","Hoạt","Sáp","Động","Phục","Sác","Trì","Khẩn","Phù","Trầm","Hữu lực","Vô lực","Đại","Vi","Đoản","Trường","Cách","Lao","Khâu","Lao chắc","Kết","Đợt","Tật","Nút","Tế","Tán","Nhược","Nhu","Hồng"],"PULSE_QUALITY_FR":["Modéré","Glissant","Rugueux","Agité","Caché","Rapide","Lent","Tendu","Flottant","Profond","Fort","Faible","Grand","Fin","Court","Long","Dur","Dur-filif.","Creux","Ferme","Irrégulier","Intermittent","Rapide","Noué","Filiforme","Dispersé","Faible","Mou","Grand"],"PULSE_QUALITY_ZH":["缓","滑","涩","动","伏","数","迟","紧","浮","沉","有力","无力","大","细","短","长","革","牢","芤","牢","结","代","疾","结","细","散","弱","软","大"],"TONGUE_BODY_COLOR":["Pale","Normal pink","Red","Dark red","Purple / dusky"],"TONGUE_BODY_COLOR_VN":["Lưỡi nhạt","Hồng bình thường","Lưỡi đỏ","Đỏ sẫm","Tím/xỉn"],"TONGUE_BODY_COLOR_FR":["Pâle","Rose normal","Rouge","Rouge foncé","Pourpre / terne"],"TONGUE_BODY_COLOR_ZH":["淡白","正常粉红","红","深红","紫/暗"],"TONGUE_COATING_COLOR":["White","Yellow","Black or Brown","Red","Purple"],"TONGUE_COATING_COLOR_VN":["Trắng","Vàng","Đen hoặc nâu","Lưỡi đỏ","Tím"],"TONGUE_COATING_COLOR_FR":["Blanc","Jaune","Noir ou brun","Rouge","Pourpre"],"TONGUE_COATING_COLOR_ZH":["白","黄","黑或棕","红","紫"],"TONGUE_COATING_AMOUNT":["Thin","Moderate","Thick","Peeling / partial coat"],"TONGUE_MOISTURE":["Normal","Dry","Very dry","Wet","Sticky"],"TONGUE_MOISTURE_VN":["Bình thường","Khô","Rất khô","Ướt","Dính"],"TONGUE_MOISTURE_FR":["Normal","Sec","Très sec","Humide","Collant"],"TONGUE_MOISTURE_ZH":["正常","干","非常干","湿","腻"],"ILLNESS_SINCE":[t("recentlyOpt"),t("lessThan6m"),"6-12 months",t("overAYear")],"ILLNESS_SINCE_VN":["Gần đây","Dưới 6 tháng","6–12 tháng","Hơn 1 năm"],"ILLNESS_SINCE_FR":["Récemment","Moins de 6 mois","6–12 mois","Plus d'un an"],"ILLNESS_SINCE_ZH":["近期","不足6个月","6–12个月","超过一年"],"PAIN_TIMING":["Occasional","Chronic","Worse at night","Worse with cold","Better with heat","Better with movementt"],"TEMP_SENSATION":["Normal","Feels cold often or chills","Feels hot often or fever",t("coldHandsFeet"),"Night heat","Alternating fever and chills"],"BREATHING":["Normal","Shortness of breath","Asthma history","Chest tightness","Fast breathing","Weak inhalation","Bad breath","Foul breath"],"COUGH":["Dry cough","Wet cough","Chronic cough","Acute cough"],"URINE COLOR":["Clear","Pale yellow","Dark yellow/amber","Orange","Pink/red","Blue/green","Brown/dark orange","Dark brown or black","Cloudy"],"STRESS_LEVEL":["Mild","Moderate",(_lang==="VN"?"Cao":_lang==="FR"?"Élevé":_lang==="ZH"?"高":"High"),"Overwhelmed"],"PULSE_STRENGTH":["Weak","Moderate","Strong"],"PULSE_STRENGTH_VN":["Yếu","Trung bình","Mạnh"],"PULSE_STRENGTH_FR":["Faible","Modéré","Fort"],"PULSE_STRENGTH_ZH":["弱","中等","强"]}};

// ─── Helper: resolve finding name from id ───────────────────────────────
const getFinding = (id) => DB.findings[String(id)] || [null, String(id), 'Symptom', ''];

// ─── Symptomatic treatment data from S_Pattern, S_PatternKeyword, S_PatternPoint
//     653 clinical symptom patterns with empirical acupuncture point sets ──────
const S_DB = [{"id":1,"en":"Elbow tendon contraction / spasm","vn":"Cùi chỏ rút gân","fr":"Contraction / spasme des tendons du coude","zh":"肘部筋脉拘急 / 痉挛","cat":"","pts":[]},{"id":2,"en":"Arm pain with restricted movement","vn":"Cánh tay đau không cử động được","fr":"Douleur au bras avec mobilité réduite","zh":"手臂疼痛，活动受限","cat":"Tay","pts":[["LI11","Quchi",""],["LI15","Jianyu",""],["LI10","Shousanli",""],["HT3","Shaohai",""],["SI5","Yanggu",""],["SJ4","Yangchi",""],["SI2","Qiangu",""],["LI4","Hegu",""],["SJ2","Yemen",""],["SJ5","Waiguan",""]]},{"id":3,"en":"Cold numbness in the arm","vn":"Tê lạnh cánh tay","fr":"Engourdissement froid du bras","zh":"手臂冰冷麻木","cat":"","pts":[]},{"id":4,"en":"Deep pain inside the arm","vn":"Đau trong cánh tay","fr":"Douleur profonde dans le bras","zh":"手臂深部疼痛","cat":"Tay","pts":[["LU9","Taiyuan",""]]},{"id":5,"en":"Unilateral arm and wrist pain","vn":"Đau một bên cánh tay, cổ tay","fr":"Douleur unilatérale du bras et du poignet","zh":"单侧手臂与手腕疼痛","cat":"Tay","pts":[["SI5","Yanggu",""]]},{"id":6,"en":"Loss of wrist mobility","vn":"Mất vận động cổ tay","fr":"Perte de mobilité du poignet","zh":"手腕失去活动能力","cat":"Tay","pts":[["PC3","Quze",""]]},{"id":7,"en":"Wrist weakness","vn":"Yếu cổ tay","fr":"Faiblesse du poignet","zh":"手腕无力","cat":"","pts":[]},{"id":8,"en":"Elbow and upper arm cannot flex","vn":"Cùi chỏ cánh tay không co lại được","fr":"Coude et haut du bras incapables de se fléchir","zh":"肘与上臂无法屈曲","cat":"Tay","pts":[["LI11","Quchi",""],["ST36","Zusanli",""],["SJ5","Waiguan",""]]},{"id":9,"en":"Arm numbness and aching","vn":"Cánh tay tê đau","fr":"Engourdissement et douleur du bras","zh":"手臂麻木酸痛","cat":"Tay","pts":[["GB21","Jiangjing",""],["LI11","Quchi",""],["LI8","Xialian",""]]},{"id":10,"en":"Arm numbness / loss of sensation","vn":"Cánh tay mất cảm giác","fr":"Engourdissement / perte de sensation du bras","zh":"手臂麻木 / 失去感觉","cat":"Tay","pts":[["LI11","Quchi",""],["SJ5","Waiguan",""],["SJ6","Zhigou",""],["LI5","Yangxi",""],["LI9","Shanglian",""],["LI4","Hegu",""]]},{"id":11,"en":"Hand contraction / cramping","vn":"Co rút bàn tay","fr":"Contraction / crampe de la main","zh":"手部拘挛 / 抽筋","cat":"Tay","pts":[["LI11","Quchi",""],["SI5","Yanggu",""],["LI4","Hegu",""]]},{"id":12,"en":"Heat sensation in the palms","vn":"Nóng lòng bàn tay","fr":"Sensation de chaleur dans les paumes","zh":"手掌发热感","cat":"Tay","pts":[["LU9","Taiyuan",""],["PC8","Laogong",""]]},{"id":13,"en":"Red, swollen arm","vn":"Sưng đỏ cánh tay","fr":"Bras rouge et enflé","zh":"手臂红肿","cat":"Tay","pts":[["LI11","Quchi",""],["HT5","Tongli",""],["LI4","Hegu",""],["LI10","Shousanli",""],["SJ2","Yemen",""]]},{"id":14,"en":"Heat in the hands","vn":"Nóng tay","fr":"Chaleur dans les mains","zh":"手部发热","cat":"Tay","pts":[["PC8","Laogong",""],["LI11","Quchi",""],["PC3","Quze",""],["PC6","Neiguan",""],["LU9","Taiyuan",""],["PC9","Zhongchong",""],["HT9","Shaochong",""]]},{"id":15,"en":"Difficulty moving the arm and shoulder","vn":"Cánh tay, vai khó cử động","fr":"Difficulté à bouger le bras et l’épaule","zh":"手臂与肩部活动困难","cat":"Tay","pts":[["LI11","Quchi",""],["LI15","Jianyu",""],["LI16","Jugu",""],["SJ11","Qinglenguyan",""]]},{"id":16,"en":"Swelling of the elbow and axilla","vn":"Sưng cùi chỏ - nách","fr":"Gonflement du coude et de l’aisselle","zh":"肘部与腋下肿胀","cat":"Tay","pts":[["SI8","Xiaohai",""],["PC5","Jianshi",""],["PC7","Daling",""],["HT7","Shenmen",""]]},{"id":17,"en":"Swelling under the armpit","vn":"Sưng dưới nách","fr":"Gonflement sous l’aisselle","zh":"腋下肿胀","cat":"Tay","pts":[["GB38","Yanglu",""],["GB40","Qiuxu",""]]},{"id":18,"en":"Aching pain in the shoulder and arm","vn":"Nhức nhối vai cánh tay","fr":"Douleur sourde à l’épaule et au bras","zh":"肩臂酸痛","cat":"Tay","pts":[["GB21","Jiangjing",""],["LI15","Jianyu",""],["LI11","Quchi",""]]},{"id":19,"en":"Contracting, aching pain in the arm","vn":"Cánh tay co đau nhức","fr":"Douleur contractile et douloureuse du bras","zh":"手臂拘急酸痛","cat":"Tay","pts":[["SI2","Qiangu",""],["SI3","Houxi",""]]},{"id":20,"en":"Pain in both shoulders","vn":"Đau hai bả vai","fr":"Douleur aux deux épaules","zh":"双肩疼痛","cat":"Tay","pts":[["GB21","Jiangjing",""],["SJ6","Zhigou",""]]},{"id":21,"en":"Wrist joint pain","vn":"Đau khớp cổ tay","fr":"Douleur articulaire du poignet","zh":"手腕关节痛","cat":"Tay","pts":[["LI5","Yangxi",""],["LI11","Quchi",""]]},{"id":22,"en":"Pain in the elbow, upper arm, and wrist","vn":"Đau khớp khuỷu, cánh tay, cổ tay","fr":"Douleur au coude, au bras et au poignet","zh":"肘、上臂与手腕疼痛","cat":"Tay","pts":[["SI2","Qiangu",""],["SJ2","Yemen",""]]},{"id":23,"en":"Knee pain with tendon contraction","vn":"Đầu gối rút đau","fr":"Douleur du genou avec contraction tendineuse","zh":"膝部疼痛伴筋脉拘急","cat":"Ch\\u00e2n","pts":[["GB31","Fengshi",""],["GB31","Fengshi",""],["LV8","Ququan",""],["LV8","Ququan",""],["UB60","Kunlun",""],["UB60","Kunlun",""]]},{"id":24,"en":"Thigh and calf aching pain","vn":"Đùi cẳng đau nhức","fr":"Douleur des cuisses et des mollets","zh":"大腿与小腿酸痛","cat":"Ch\\u00e2n","pts":[["GB31","Fengshi",""],["GB32","Zhongdu",""],["DU3","Yaoyangguan",""],["GB33","Yangguan",""]]},{"id":25,"en":"Leg weakness, unable to retract the leg","vn":"Yếu chân không rút vào được","fr":"Faiblesse de la jambe, incapacité à la replier","zh":"腿无力，无法收回","cat":"Ch\\u00e2n","pts":[["KI7","Fuliu",""]]},{"id":26,"en":"Outer knee pain","vn":"Đau đầu gối ngoài","fr":"Douleur externe du genou","zh":"膝外侧疼痛","cat":"Ch\\u00e2n","pts":[["GB43","Xiaxi",""],["GB43","Xiaxi",""],["DU3","Yaoyangguan",""],["GB33","Yangguan",""],["DU3","Yaoyangguan",""],["GB33","Yangguan",""]]},{"id":27,"en":"Inner knee pain","vn":"Đau đầu gối trong","fr":"Douleur interne du genou","zh":"膝内侧疼痛","cat":"Ch\\u00e2n","pts":[["LV7","Xiquan",""],["LV7","Xiquan",""],["LV3","Taichong",""],["LV4","Zhongfeng",""],["LV4","Zhongfeng",""]]},{"id":28,"en":"Knee pain with cold legs","vn":"Gối đau, lạnh chân","fr":"Douleur du genou avec jambes froides","zh":"膝痛伴双腿发冷","cat":"Ch\\u00e2n","pts":[["GB30","Huantiao",""],["ST3","Juliao",""]]},{"id":29,"en":"Ankle pain","vn":"Đau cổ chân","fr":"Douleur de la cheville","zh":"踝关节痛","cat":"Ch\\u00e2n","pts":[["UB60","Kunlun",""],["KI3","Taizi",""],["UB62","Shenmai",""],["GB40","Qiuxu",""],["SJ5","Waiguan",""],["LV3","Taichong",""]]},{"id":30,"en":"Toe pain and aching","vn":"Đau nhức các ngón chân","fr":"Douleur et courbature des orteils","zh":"脚趾酸痛","cat":"Ch\\u00e2n","pts":[["KI1","Yongquan",""],["KI2","Rangu",""]]},{"id":31,"en":"Swollen knee","vn":"Sưng đầu gối","fr":"Genou enflé","zh":"膝关节肿胀","cat":"Ch\\u00e2n","pts":[["ST36","Zusanli",""],["LV2","Xinglian",""]]},{"id":32,"en":"Leg weakness with muscle atrophy","vn":"Yếu chân, teo cơ","fr":"Faiblesse des jambes avec atrophie musculaire","zh":"腿无力伴肌肉萎缩","cat":"Ch\\u00e2n","pts":[["ST36","Zusanli",""]]},{"id":33,"en":"Cold sensation in both buttocks","vn":"Hai mông lạnh","fr":"Sensation de froid aux fesses","zh":"双臀发冷","cat":"Ch\\u00e2n","pts":[["ST33","Yinshi",""]]},{"id":34,"en":"Low back pain radiating to the leg","vn":"Đau thắt lưng xuống chân","fr":"Douleur lombaire irradiant vers la jambe","zh":"腰痛放射至腿部","cat":"Ch\\u00e2n","pts":[["GB30","Huantiao",""],["GB31","Fengshi",""],["ST33","Yinshi",""],["UB57","Chengshan",""],["UB60","Kunlun",""],["UB62","Shenmai",""]]},{"id":35,"en":"Knee and calf pain","vn":"Đau đầu gối, cẳng chân","fr":"Douleur du genou et du mollet","zh":"膝部与小腿疼痛","cat":"Ch\\u00e2n","pts":[["UB40","Weizhong",""],["LV8","Ququan",""],["GB31","Fengshi",""],["UB60","Kunlun",""],["ST41","Jiexi",""]]},{"id":36,"en":"Leg numbness","vn":"Tê chân","fr":"Engourdissement des jambes","zh":"腿部麻木","cat":"Ch\\u00e2n","pts":[["GB30","Huantiao",""],["GB31","Fengshi",""]]},{"id":37,"en":"Loss of sensation in the legs","vn":"Chân mất cảm giác","fr":"Perte de sensation dans les jambes","zh":"腿部失去感觉","cat":"Ch\\u00e2n","pts":[["GB30","Huantiao",""],["GB38","Yanglu",""],["KI3","Taizi",""]]},{"id":38,"en":"Buttock swelling","vn":"Sưng mông","fr":"Gonflement des fesses","zh":"臀部肿胀","cat":"Ch\\u00e2n","pts":[["UB57","Chengshan",""],["UB60","Kunlun",""]]},{"id":39,"en":"Lower leg swelling","vn":"Sưng cẳng chân","fr":"Gonflement de la jambe inférieure","zh":"小腿肿胀","cat":"Ch\\u00e2n","pts":[["UB57","Chengshan",""],["UB60","Kunlun",""],["KI2","Rangu",""],["LI8","Xialian",""],["GB31","Fengshi",""]]},{"id":40,"en":"Leg weakness","vn":"Yếu chân","fr":"Faiblesse des jambes","zh":"腿无力","cat":"Ch\\u00e2n","pts":[["LV3","Taichong",""],["GB40","Qiuxu",""]]},{"id":41,"en":"Lower leg weakness","vn":"Yếu cẳng chân","fr":"Faiblesse du bas de la jambe","zh":"小腿无力","cat":"Ch\\u00e2n","pts":[["UB40","Weizhong",""],["ST36","Zusanli",""],["UB57","Chengshan",""]]},{"id":42,"en":"Swelling in both knees","vn":"Sưng hai đầu gối","fr":"Gonflement des deux genoux","zh":"双膝肿胀","cat":"Ch\\u00e2n","pts":[["LV7","Xiquan",""],["ST36","Zusanli",""],["ST33","Yinshi",""]]},{"id":43,"en":"Heel tendon pain","vn":"Đau gân gót chân","fr":"Douleur du tendon du talon","zh":"脚跟肌腱痛","cat":"Ch\\u00e2n","pts":[["UB60","Kunlun",""],["SP5","Shangqiu",""],["KI6","Zhaohai",""]]},{"id":44,"en":"Difficulty walking","vn":"Chân khó đi","fr":"Difficulté à marcher","zh":"步行困难","cat":"Ch\\u00e2n","pts":[["ST36","Zusanli",""],["LV8","Ququan",""],["GB38","Yanglu",""],["SP6","Sanwinjiao",""],["KI7","Fuliu",""]]},{"id":45,"en":"Pain in the sole of the foot","vn":"Đau lòng bàn chân","fr":"Douleur à la plante du pied","zh":"足底疼痛","cat":"Ch\\u00e2n","pts":[["ST42","Chongyang",""],["KI2","Rangu",""],["UB62","Shenmai",""],["LV2","Xinglian",""],["UB20","Pishu",""],["UB60","Kunlun",""]]},{"id":46,"en":"Leg cramps","vn":"Vọp bẻ","fr":"Crampe des jambes","zh":"腿部抽筋","cat":"Ch\\u00e2n","pts":[["UB57","Chengshan",""],["UB38","Fuxi",""],["UB57","Chengshan",""],["UB60","Kunlun",""]]},{"id":47,"en":"Beriberi-type swelling and weakness","vn":"Cước khí","fr":"Œdème et faiblesse de type béribéri","zh":"脚气样肿胀与无力","cat":"Ch\\u00e2n","pts":[["DU16","Fengfu",""],["ST32","Futu",""],["ST36","Zusanli",""],["LI9","Shanglian",""],["LI8","Xialian",""]]},{"id":48,"en":"Beriberi with heat-clearing, damp-resolving, blood…","vn":"Cước khí - Thanh nhiệt, trừ thấp, hoạt huyết, điều khí","fr":"Béribéri – clarifier la chaleur, éliminer l’humidité, activer le sang, réguler le Qi","zh":"脚气—清热、祛湿、活血、理气","cat":"Ch\\u00e2n","pts":[["SP9","Yinlingquan",""],["ST36","Zusanli",""],["GB39","Xuanzhong",""],["SP6","Sanwinjiao",""],["UB60","Kunlun",""],["KI3","Taizi",""],["UB57","Chengshan",""],["PC6","Neiguan",""]]},{"id":49,"en":"Crawling or ant-like sensation in the legs","vn":"Cảm giác kiến bò","fr":"Sensation de fourmillement dans les jambes","zh":"腿部蚁行感","cat":"Ch\\u00e2n","pts":[["LI11","Quchi",""],["LI4","Hegu",""],["SP6","Sanwinjiao",""]]},{"id":50,"en":"Nodules or soft tissue masses","vn":"Bứu, thịt thừa","fr":"Nodules ou masses des tissus mous","zh":"结节或软组织肿块","cat":"","pts":[]},{"id":51,"en":"Cold damage with loss of pulse","vn":"Bệnh thương hàn mất mạch","fr":"Atteinte par le froid avec perte du pouls","zh":"伤寒导致脉绝","cat":"Ma\\u0323ch","pts":[["KI7","Fuliu",""],["REN3","Zhongji",""],["REN14","Juque",""],["ST30","Qichong",""]]},{"id":52,"en":"Dry retching with cold limbs and absent pulse","vn":"Nôn khan, lạnh tay chân, không còn mạch","fr":"Retchissements secs avec membres froids et pouls absent","zh":"干呕，四肢冰冷，无脉","cat":"Ma\\u0323ch","pts":[["PC5","Jianshi",""]]},{"id":53,"en":"Tendon pain with contraction","vn":"Nhức xương gân rút","fr":"Douleur tendineuse avec contraction","zh":"筋脉拘急作痛","cat":"G\\u00e2n","pts":[["UB47","Hunmen",""]]},{"id":54,"en":"Tendon contraction causing difficulty bending the…","vn":"Rút gân, đầu gối khó co dũi","fr":"Contraction tendineuse rendant la flexion du genou difficile","zh":"筋缩导致膝难屈伸","cat":"G\\u00e2n","pts":[["LV8","Ququan",""],["UB39","Weiyang",""]]},{"id":55,"en":"Tendon contraction causing difficulty walking","vn":"Rút gân khó đi","fr":"Contraction tendineuse rendant la marche difficile","zh":"筋缩导致步行困难","cat":"","pts":[]},{"id":56,"en":"Genital tendon contraction with pain","vn":"Rút đau cơ quan sinh dục","fr":"Contraction douloureuse des tendons génitaux","zh":"生殖部筋缩作痛","cat":"G\\u00e2n","pts":[["LV4","Zhongfeng",""]]},{"id":57,"en":"Tendon weakness due to Liver heat","vn":"Yếu gân do can nhiệt","fr":"Faiblesse tendineuse due à la chaleur du Foie","zh":"肝热导致筋脉无力","cat":"G\\u00e2n","pts":[["LV2","Xinglian",""],["LV3","Taichong",""]]},{"id":58,"en":"Aching pain in spine and knees","vn":"Đau nhức cột sống, đầu gối","fr":"Douleur de la colonne vertébrale et des genoux","zh":"脊柱与膝部酸痛","cat":"X\\u01b0\\u01a1ng","pts":[["DU26","Renzhong",""],["DU26","Renzhong",""]]},{"id":59,"en":"Bone pain with contraction","vn":"Nhức xương co rút","fr":"Douleur osseuse avec contraction","zh":"骨痛伴拘急","cat":"X\\u01b0\\u01a1ng","pts":[["UB47","Hunmen",""]]},{"id":60,"en":"Bone weakness","vn":"Xương yếu","fr":"Faiblesse des os","zh":"骨骼无力","cat":"","pts":[]},{"id":61,"en":"Abdominal pain","vn":"Đau bụng","fr":"Douleur abdominale","zh":"腹痛","cat":"Bu\\u0323ng","pts":[["PC6","Neiguan",""],["ST43","Xiangu",""],["ST36","Zusanli",""],["ST25","Tianshu",""],["UB25","Dachangshu",""],["REN14","Juque",""],["SP3","Taibai",""],["ST36","Zusanli",""],["SP4","Gongsun",""]]},{"id":62,"en":"Periumbilical abdominal pain","vn":"Đau bụng rốn","fr":"Douleur autour du nombril","zh":"脐周腹痛","cat":"Bu\\u0323ng","pts":[["SP9","Yinlingquan",""],["LV3","Taichong",""],["SJ6","Zhigou",""],["REN12","Zhongwan",""],["ST36","Zusanli",""],["REN4","Guanyan",""]]},{"id":63,"en":"All types of internal abdominal pain","vn":"Tất cả các loại đau trong bụng","fr":"Tous types de douleurs abdominales internes","zh":"各种内腹痛","cat":"Bu\\u0323ng","pts":[["SP4","Gongsun",""]]},{"id":64,"en":"Diarrhea with lower abdominal pain","vn":"Ỉa chảy kèm đau dưới rốn","fr":"Diarrhée avec douleur sous‑ombilicale","zh":"腹泻伴下腹痛","cat":"Bu\\u0323ng","pts":[["REN8","Shenjue",""]]},{"id":65,"en":"Abdominal pain due to food stagnation","vn":"Đau do tích thực","fr":"Douleur abdominale due à la stagnation alimentaire","zh":"食积腹痛","cat":"Bu\\u0323ng","pts":[["REN6","Quihai",""],["REN12","Zhongwan",""],["SP1","Yin Bai",""]]},{"id":66,"en":"Diarrhea with intestinal rumbling","vn":"Iả chảy, sôi ruột","fr":"Diarrhée avec borborygmes","zh":"腹泻伴肠鸣","cat":"Bu\\u0323ng","pts":[["REN8","Shenjue",""]]},{"id":67,"en":"Lower abdominal pain","vn":"Đau bụng dưới","fr":"Douleur du bas‑ventre","zh":"下腹痛","cat":"Bu\\u0323ng","pts":[["ST33","Yinshi",""],["UB57","Chengshan",""],["LI8","Xialian",""],["KI7","Fuliu",""],["LV4","Zhongfeng",""],["LV1","Dadun",""],["UB23","Shenshu",""]]},{"id":68,"en":"Breast swelling","vn":"Sưng vú","fr":"Gonflement du sein","zh":"乳房肿胀","cat":"Vu\\u0301","pts":[["ST16","Yingchuang",""],["ST18","Rugen",""],["LI8","Xialian",""],["KI7","Fuliu",""],["LV3","Taichong",""]]},{"id":69,"en":"Lack of breast milk","vn":"Không sữa","fr":"Manque de lait maternel","zh":"乳汁不足","cat":"Vu\\u0301","pts":[["SI1","Shaoze",""]]},{"id":70,"en":"Breast swelling and pain","vn":"Vú sưng đau","fr":"Sein enflé et douloureux","zh":"乳房肿胀疼痛","cat":"Vu\\u0301","pts":[["GB41","Linqi",""]]},{"id":70,"en":"Breast swelling and pain","vn":"Vú sưng đau","fr":"Sein enflé et douloureux","zh":"乳房肿胀疼痛","cat":"Vu\\u0301","pts":[["GB41","Linqi",""]]},{"id":71,"en":"Various types of heart pain","vn":"Các loại đau tim","fr":"Divers types de douleurs cardiaques","zh":"各种心痛","cat":"Ng\\u01b0\\u0323c","pts":[["PC5","Jianshi",""],["HT4","Lingdao",""],["SP4","Gongsun",""],["LV3","Taichong",""],["ST36","Zusanli",""],["SP9","Yinlingquan",""]]},{"id":72,"en":"Sudden heart pain","vn":"Đau tim đột ngột","fr":"Douleur cardiaque soudaine","zh":"心痛突然发作","cat":"Ng\\u01b0\\u0323c","pts":[["KI2","Rangu",""],["REN13","Sangwan",""],["REN6","Quihai",""],["KI1","Yongquan",""],["PC5","Jianshi",""],["ST36","Zusanli",""],["LV1","Dadun",""]]},{"id":73,"en":"Pain between chest and abdomen","vn":"Đau giữa ngực bụng","fr":"Douleur entre la poitrine et l’abdomen","zh":"胸腹之间疼痛","cat":"Ng\\u01b0\\u0323c","pts":[["ST36","Zusanli",""]]},{"id":74,"en":"Pain in the center of the chest","vn":"Đau giữa tim","fr":"Douleur au centre de la poitrine","zh":"胸中心疼痛","cat":"Ng\\u01b0\\u0323c","pts":[["PC6","Neiguan",""]]},{"id":75,"en":"Chest pain radiating to the back","vn":"Đau tim dẫn tới lưng ngực","fr":"Douleur thoracique irradiant vers le dos","zh":"胸痛放射至背部","cat":"Ng\\u01b0\\u0323c","pts":[["UB64","Jinggu",""],["UB60","Kunlun",""],["KI2","Rangu",""],["UB39","Weiyang",""]]},{"id":76,"en":"Heart dampness (chest oppression)","vn":"Thấp tim","fr":"Humidité du Cœur (oppression thoracique)","zh":"心部湿阻（胸闷）","cat":"Ng\\u01b0\\u0323c","pts":[["REN14","Juque",""],["HT8","Shaofu",""],["REN13","Sangwan",""],["PC3","Quze",""],["REN12","Zhongwan",""],["PC4","Ximen",""]]},{"id":77,"en":"Chest fullness and distention","vn":"Tức đầy ngực","fr":"Plénitude et distension thoracique","zh":"胸部胀满","cat":"Ng\\u01b0\\u0323c","pts":[["KI1","Yongquan",""],["KI3","Taizi",""],["PC9","Zhongchong",""],["PC7","Daling",""],["HT7","Shenmen",""],["SP1","Yin Bai",""],["SP3","Taibai",""],["HT9","Shaochong",""]]},{"id":78,"en":"Rib‑side pain","vn":"Đau hông sườn","fr":"Douleur du flanc / des côtes","zh":"胁肋疼痛","cat":"Ng\\u01b0\\u0323c","pts":[["SJ6","Zhigou",""],["SJ6","Zhigou",""],["SJ6","Zhigou",""],["DU9","Zhiyang",""],["SJ6","Zhigou",""],["SJ5","Waiguan",""],["GB34","Yanglingquan",""],["PC5","Jianshi",""],["LI11","Quchi",""],["GB24","Riyue",""],["PC7","Daling",""],["HT7","Shenmen",""],["ST36","Zusanli",""],["SP3","Taibai",""],["GB40","Qiuxu",""],["GB38","Yanglu",""]]},{"id":79,"en":"Rib‑side distention radiating to the abdomen","vn":"Tức hông sườn dẫn tới bụng","fr":"Distension du flanc irradiant vers l’abdomen","zh":"胁肋胀痛放射至腹部","cat":"Ng\\u01b0\\u0323c","pts":[["LI8","Xialian",""],["GB40","Qiuxu",""],["GB43","Xiaxi",""],["UB23","Shenshu",""]]},{"id":80,"en":"Cold sensation in the chest","vn":"Lạnh trong ngực","fr":"Sensation de froid dans la poitrine","zh":"胸中发冷","cat":"","pts":[]},{"id":81,"en":"Deep heart-region pain","vn":"Đau trong tim","fr":"Douleur profonde dans la région cardiaque","zh":"心区深部疼痛","cat":"Ng\\u01b0\\u0323c","pts":[["PC6","Neiguan",""],["PC3","Quze",""],["PC7","Daling",""],["HT7","Shenmen",""]]},{"id":82,"en":"Abdominal bloating","vn":"Bụng căng sình","fr":"Ballonnement abdominal","zh":"腹胀","cat":"Si\\u0300nh C\\u0103n","pts":[["ST44","Neiting",""]]},{"id":83,"en":"Abdominal distention with fluid retention","vn":"Bụng trướng nước","fr":"Distension abdominale avec rétention de liquide","zh":"腹胀伴积液","cat":"Si\\u0300nh C\\u0103n","pts":[["REN9","Shuifen",""],["SP6","Sanwinjiao",""]]},{"id":84,"en":"Fullness and distention in the abdomen","vn":"Căng đầy","fr":"Plénitude et distension abdominale","zh":"腹部胀满","cat":"Si\\u0300nh C\\u0103n","pts":[["REN12","Zhongwan",""],["ST36","Zusanli",""]]},{"id":85,"en":"Chest and abdominal distention","vn":"Căng đầy bụng ngực","fr":"Distension thoracique et abdominale","zh":"胸腹胀满","cat":"Si\\u0300nh C\\u0103n","pts":[["ST44","Neiting",""]]},{"id":86,"en":"Stomach and abdominal bloating with gurgling","vn":"Dạ dày, bụng no hơi, sình căng lọc ọc","fr":"Ballonnement gastrique et abdominal avec gargouillements","zh":"胃腹胀满伴肠鸣","cat":"Si\\u0300nh C\\u0103n","pts":[["LI4","Hegu",""],["ST36","Zusanli",""],["LV14","Qimen",""]]},{"id":87,"en":"Hard, enlarged abdomen","vn":"Bụng cứng lớn","fr":"Abdomen dur et élargi","zh":"腹部坚硬肿大","cat":"Si\\u0300nh C\\u0103n","pts":[["ST36","Zusanli",""],["SP9","Yinlingquan",""],["GB40","Qiuxu",""],["ST41","Jiexi",""],["LV14","Qimen",""],["REN9","Shuifen",""],["REN8","Shenjue",""],["UB28","Pangguanshu",""]]},{"id":88,"en":"Lower abdominal distention","vn":"Căng sình bụng dưới","fr":"Distension du bas‑ventre","zh":"下腹胀满","cat":"Si\\u0300nh C\\u0103n","pts":[["LV4","Zhongfeng",""],["KI2","Rangu",""],["ST44","Neiting",""],["LV1","Dadun",""]]},{"id":89,"en":"Inguinal hernia-type protrusion","vn":"Thoái vị bẹn","fr":"Protubérance de type hernie inguinale","zh":"腹股沟疝样突出","cat":"Ph\\u00e2\\u0300n Da\\u0301i","pts":[["LV3","Taichong",""],["LV1","Dadun",""]]},{"id":90,"en":"Testicles retracting into the abdomen","vn":"Dái thụt vào bụng","fr":"Testicules se rétractant dans l’abdomen","zh":"睾丸上缩入腹","cat":"Ph\\u00e2\\u0300n Da\\u0301i","pts":[["REN4","Guanyan",""],["LV3","Taichong",""]]},{"id":91,"en":"Frequent urination","vn":"Đái nhiều lần","fr":"Mictions fréquentes","zh":"小便频繁","cat":"Ph\\u00e2\\u0300n Da\\u0301i","pts":[["REN4","Guanyan",""],["UB23","Shenshu",""]]},{"id":92,"en":"Scrotal swelling","vn":"Sưng dái","fr":"Gonflement du scrotum","zh":"阴囊肿胀","cat":"Ph\\u00e2\\u0300n Da\\u0301i","pts":[["LV8","Ququan",""],["KI3","Taizi",""],["LV1","Dadun",""],["UB23","Shenshu",""],["SP6","Sanwinjiao",""]]},{"id":93,"en":"Chest oppression","vn":"Tức ngực","fr":"Oppression thoracique","zh":"胸闷","cat":"","pts":[["LV14","Qimen",""]]},{"id":94,"en":"Painful rib-side stitch","vn":"Đau xốc hai bên","fr":"Douleur vive sur les côtés des côtes","zh":"两胁刺痛","cat":"","pts":[["LV14","Qimen",""]]},{"id":95,"en":"Blurred vision","vn":"Mờ mắt","fr":"Vision trouble","zh":"视物模糊","cat":"","pts":[["LV14","Qimen",""],["SJ20","Jiaosun",""]]},{"id":96,"en":"Gallbladder inflammation","vn":"Viêm túi mật","fr":"Inflammation de la vésicule biliaire","zh":"胆囊炎","cat":"","pts":[["LV14","Qimen",""]]},{"id":97,"en":"Liver inflammation","vn":"Viêm gan","fr":"Inflammation du foie","zh":"肝炎","cat":"","pts":[["LV14","Qimen",""],["GB34","Yanglingquan",""]]},{"id":98,"en":"Acid regurgitation","vn":"Ợ nước chua","fr":"Régurgitation acide","zh":"胃酸反流","cat":"","pts":[["LV14","Qimen",""],["ST19","Burong",""],["UB46","Geguan",""]]},{"id":99,"en":"Intestinal rumbling","vn":"Sôi ruột","fr":"Borborygmes","zh":"肠鸣","cat":"","pts":[["LV14","Qimen",""],["LI4","Hegu",""],["ST36","Zusanli",""]]},{"id":100,"en":"Abdominal bloating with intestinal rumbling","vn":"Sình bụng, sôi bụng","fr":"Ballonnement abdominal avec gargouillements","zh":"腹胀伴肠鸣","cat":"","pts":[["KI19","Yindu",""],["REN7","Yinjiao",""],["ST25","Tianshu",""]]},{"id":101,"en":"Hiccups","vn":"Nấc cụt","fr":"Hoquet","zh":"呃逆","cat":"","pts":[["LV14","Qimen",""],["PC6","Neiguan",""],["ST36","Zusanli",""],["REN22","Tiantu",""],["LV13","Zhangmen",""],["UB46","Geguan",""],["SI6","Yanglao",""]]},{"id":102,"en":"Belching","vn":"Ợ hơi","fr":"Rots / éructations","zh":"嗳气","cat":"","pts":[["LV14","Qimen",""]]},{"id":103,"en":"Nosebleed","vn":"Chảy máu cam","fr":"Saignement de nez","zh":"鼻出血","cat":"","pts":[["DU15","Yamen",""],["UB18","Ganshu",""],["HT6","Yinxi",""],["DU15","Yamen",""],["SI3","Houxi",""],["ST44","Neiting",""]]},{"id":104,"en":"Insomnia","vn":"Mất ngủ","fr":"Insomnie","zh":"失眠","cat":"","pts":[["PC6","Neiguan",""],["SP6","Sanwinjiao",""],["SP6","Sanwinjiao",""]]},{"id":105,"en":"Insomnia due to excess Heart fire","vn":"Mất ngủ do hỏa vượng","fr":"Insomnie due à excès de Feu du Cœur","zh":"心火亢盛导致失眠","cat":"","pts":[["PC6","Neiguan",""],["PC7","Daling",""],["HT7","Shenmen",""]]},{"id":106,"en":"Tinnitus","vn":"Ù tai","fr":"Acouphènes","zh":"耳鸣","cat":"","pts":[["DU20","Baihui",""],["GB4","Hanyan",""],["UB23","Shenshu",""],["DU20","Baihui",""],["SI2","Qiangu",""],["SI3","Houxi",""],["HT5","Tongli",""],["SI19","Tinggong",""],["LI1","Shangyang",""],["SI5","Yanggu",""]]},{"id":107,"en":"Difficult urination, urinary retention, or incontinence","vn":"Tiểu khó, bí đái, không tự chủ","fr":"Mictions difficiles, rétention ou incontinence","zh":"小便困难、尿潴留或失禁","cat":"","pts":[["LV9","Yibao",""],["SP9","Yinlingquan",""]]},{"id":108,"en":"Bedwetting","vn":"Đái dầm","fr":"Énurésie (pipi au lit)","zh":"遗尿","cat":"","pts":[["LV9","Yibao",""],["ST36","Zusanli",""],["REN3","Zhongji",""],["SP6","Sanwinjiao",""],["REN7","Yinjiao",""],["REN6","Quihai",""],["REN4","Guanyan",""],["KI2","Rangu",""]]},{"id":109,"en":"Impotence, sexual weakness, painful urination","vn":"Liệt, yếu sinh dục, đái rát, đái buốc","fr":"Impuissance, faiblesse sexuelle, mictions douloureuses","zh":"阳痿、性功能弱、小便涩痛","cat":"","pts":[["KI10","Yingu",""]]},{"id":110,"en":"Urinary obstruction","vn":"Tiểu không thông","fr":"Obstruction urinaire","zh":"小便不通","cat":"","pts":[["KI10","Yingu",""],["SP7","Lougu",""],["SP9","Yinlingquan",""],["LV3","Taichong",""]]},{"id":111,"en":"Erectile dysfunction","vn":"Liệt dương","fr":"Dysfonction érectile","zh":"勃起功能障碍","cat":"","pts":[["KI10","Yingu",""],["REN3","Zhongji",""],["ST36","Zusanli",""]]},{"id":112,"en":"Knee pain with difficulty bending or extending","vn":"Đau đầu gối, không co dủi được","fr":"Douleur du genou avec difficulté à fléchir ou étendre","zh":"膝痛，屈伸困难","cat":"","pts":[["KI10","Yingu",""],["UB11","Dashu",""]]},{"id":113,"en":"Chest fullness and oppression","vn":"Đầy tức trong tim","fr":"Plénitude et oppression thoracique","zh":"心胸胀闷","cat":"","pts":[["KI19","Yindu",""],["REN14","Juque",""]]},{"id":114,"en":"Poor digestion","vn":"Tiêu hóa kém","fr":"Mauvaise digestion","zh":"消化不良","cat":"","pts":[["KI19","Yindu",""],["ST36","Zusanli",""],["GB34","Yanglingquan",""]]},{"id":115,"en":"Fever with chills","vn":"Sốt rét","fr":"Fièvre avec frissons","zh":"发热恶寒","cat":"","pts":[["KI19","Yindu",""],["SJ2","Yemen",""],["PC5","Jianshi",""],["SI3","Houxi",""],["SJ4","Yangchi",""]]},{"id":116,"en":"Rib-side heat and pain with intestinal rumbling","vn":"Sôi ruột, đau nóng dưới sườn","fr":"Chaleur et douleur sous‑costale avec borborygmes","zh":"胁下灼热疼痛伴肠鸣","cat":"","pts":[["UB17","Geshu",""]]},{"id":117,"en":"Red, painful eyes","vn":"Đỏ mắt, đau khoé mắt","fr":"Yeux rouges et douloureux","zh":"眼红目痛","cat":"","pts":[["KI19","Yindu",""]]},{"id":118,"en":"Palpitations with shortness of breath","vn":"Tim đập mạnh, ngộp thở","fr":"Palpitations avec essoufflement","zh":"心悸气短","cat":"","pts":[["HT6","Yinxi",""]]},{"id":119,"en":"Clearing Heart fire, calming rising Yang, settling spirit","vn":"Thanh tâm hỏa, tiềm hư dương, an thần","fr":"Clarifier le Feu du Cœur, calmer le Yang, apaiser l’esprit","zh":"清心火、潜阳、安神","cat":"","pts":[["HT6","Yinxi",""]]},{"id":120,"en":"Night sweating with afternoon fever","vn":"Mồ hôi ban đêm, sốt buổi chiều","fr":"Sueurs nocturnes avec fièvre vespérale","zh":"夜间盗汗，午后潮热","cat":"","pts":[["HT6","Yinxi",""],["SI3","Houxi",""],["SP6","Sanwinjiao",""],["REN8","Shenjue",""]]},{"id":121,"en":"Stomach pain with acid regurgitation","vn":"Đau dạ dày, ợ chua","fr":"Douleur gastrique avec régurgitation acide","zh":"胃痛伴酸返","cat":"","pts":[["HT6","Yinxi",""],["ST36","Zusanli",""],["ST21","Liangmen",""]]},{"id":122,"en":"Sudden loss of voice","vn":"Mất tiếng, nói không được","fr":"Perte soudaine de la voix","zh":"突然失声","cat":"","pts":[["HT6","Yinxi",""]]},{"id":123,"en":"Spleen–Stomach deficiency cold with lower burner damp‑heat","vn":"Tỳ vị hư hàn, hạ tiêu thấp nhiệt","fr":"Froid de déficience Rate‑Estomac avec humidité‑chaleur du foyer inférieur","zh":"脾胃虚寒，下焦湿热","cat":"","pts":[["SP9","Yinlingquan",""]]},{"id":124,"en":"Difficult urination","vn":"Tiểu khó","fr":"Mictions difficiles","zh":"小便困难","cat":"","pts":[["SP9","Yinlingquan",""],["GB34","Yanglingquan",""],["LV1","Dadun",""]]},{"id":125,"en":"Urinary obstruction","vn":"Tiểu tiện không thông","fr":"Obstruction urinaire","zh":"小便不通","cat":"","pts":[["SP9","Yinlingquan",""],["REN6","Quihai",""],["SP6","Sanwinjiao",""]]},{"id":126,"en":"Nocturnal emission and seminal dreams","vn":"Di tinh, mộng tinh","fr":"Émission nocturne et rêves humides","zh":"遗精、梦遗","cat":"","pts":[["SP9","Yinlingquan",""],["UB52","Zhishi",""],["UB30","Baihuanshu",""],["UB23","Shenshu",""]]},{"id":127,"en":"Abdominal edema","vn":"Phù thủng ở bụng","fr":"Œdème abdominal","zh":"腹部水肿","cat":"","pts":[["SP9","Yinlingquan",""]]},{"id":128,"en":"Kidney or intestinal inflammation","vn":"Viêm thận, viêm ruột","fr":"Inflammation rénale ou intestinale","zh":"肾炎或肠炎","cat":"","pts":[["SP9","Yinlingquan",""]]},{"id":129,"en":"Cold sensation in the abdomen","vn":"Lạnh trong bụng","fr":"Sensation de froid dans l’abdomen","zh":"腹中发冷","cat":"","pts":[["SP9","Yinlingquan",""]]},{"id":130,"en":"Vomiting and diarrhea","vn":"Thổ tả","fr":"Vomissements et diarrhée","zh":"呕吐与腹泻","cat":"","pts":[["SP9","Yinlingquan",""],["ST41","Jiexi",""],["SP3","Taibai",""],["UB57","Chengshan",""]]},{"id":131,"en":"Severe diarrhea","vn":"Tiêu chảy dữ dội","fr":"Diarrhée sévère","zh":"剧烈腹泻","cat":"","pts":[["SP9","Yinlingquan",""],["SP1","Yin Bai",""]]},{"id":132,"en":"Pain in the perineum, swollen testicles, genital pain","vn":"Đau âm hộ, sưng tinh hoàn, đau dương vật, háng","fr":"Douleur périnéale, testicules enflés, douleur génitale","zh":"会阴痛、睾丸肿痛、生殖部疼痛","cat":"","pts":[["LV11","Yinlian",""]]},{"id":133,"en":"Seminal emission, nocturnal emission, spermatorrhea","vn":"Mộng, di, tiết tinh","fr":"Émission séminale, pollution nocturne, spermatorrhée","zh":"梦遗、滑精、遗精","cat":"Tinh","pts":[["UB15","Xinshu",""],["UB30","Baihuanshu",""],["UB23","Shenshu",""],["REN3","Zhongji",""],["SP6","Sanwinjiao",""]]},{"id":134,"en":"Seminal emission without dreams","vn":"Xuất tinh (không có mộng)","fr":"Émission séminale sans rêves","zh":"无梦遗精","cat":"Tinh","pts":[["UB23","Shenshu",""],["REN3","Zhongji",""]]},{"id":135,"en":"Physiological (normal) ejaculation","vn":"Xuất tinh do sinh lý tự nhiên","fr":"Éjaculation physiologique (normale)","zh":"生理性射精","cat":"Tinh","pts":[["REN3","Zhongji",""],["KI12","Dahe",""],["KI2","Rangu",""],["LV3","Taichong",""]]},{"id":136,"en":"Involuntary ejaculation","vn":"Xuất tinh không tự chủ","fr":"Éjaculation involontaire","zh":"不自主射精","cat":"Tinh","pts":[["REN3","Zhongji",""],["SP6","Sanwinjiao",""],["UB23","Shenshu",""]]},{"id":137,"en":"Ejaculation due to weakness or deficiency","vn":"Xuất tinh vì suy nhược","fr":"Éjaculation due à faiblesse ou déficience","zh":"虚弱导致的射精","cat":"Tinh","pts":[["KI12","Dahe",""],["LV4","Zhongfeng",""]]},{"id":138,"en":"All qi‑related disorders","vn":"Tất cả các chứng bệnh thuộc khí","fr":"Tous les troubles liés au Qi","zh":"所有与气相关的病证","cat":"Khi\\u0301","pts":[["REN6","Quihai",""]]},{"id":139,"en":"Rebellious qi","vn":"Khí nghịch","fr":"Qi rebelle","zh":"气逆","cat":"Khi\\u0301","pts":[["REN6","Quihai",""],["SP5","Shangqiu",""],["KI6","Zhaohai",""],["SP3","Taibai",""],["SP6","Sanwinjiao",""]]},{"id":140,"en":"Frequent belching","vn":"Ợ hơi hên","fr":"Éructations fréquentes","zh":"频繁嗳气","cat":"Khi\\u0301","pts":[["REN6","Quihai",""],["LU9","Taiyuan",""]]},{"id":141,"en":"Shortness of breath due to excess (fullness)","vn":"Hụt hơi, thở ngắn - thực","fr":"Essoufflement dû à plénitude (excès)","zh":"实证气逆导致气短","cat":"Khi\\u0301","pts":[["REN6","Quihai",""],["PC7","Daling",""],["HT7","Shenmen",""]]},{"id":142,"en":"Shortness of breath due to deficiency","vn":"Hụt hơi, thở ngắn - hư","fr":"Essoufflement dû à déficience","zh":"虚证导致气短","cat":"Khi\\u0301","pts":[["REN6","Quihai",""],["UB13","Feishu",""],["REN8","Shenjue",""],["UB18","Ganshu",""],["LU10","Yuji",""]]},{"id":143,"en":"Shortness of breath from qi deficiency","vn":"Khó thở do thiếu khí","fr":"Essoufflement par déficience de Qi","zh":"气虚气短","cat":"Khi\\u0301","pts":[["REN6","Quihai",""],["PC5","Jianshi",""],["PC7","Daling",""],["HT7","Shenmen",""],["HT9","Shaochong",""],["ST36","Zusanli",""],["LI8","Xialian",""],["LV2","Xinglian",""],["KI2","Rangu",""],["UB18","Ganshu",""]]},{"id":144,"en":"Qi rising upward","vn":"Khí thượng lên","fr":"Qi montant vers le haut","zh":"气上逆","cat":"Khi\\u0301","pts":[["REN6","Quihai",""],["LV3","Taichong",""]]},{"id":145,"en":"Frequent yawning","vn":"Hay ngáp","fr":"Bâillements fréquents","zh":"频繁打哈欠","cat":"Khi\\u0301","pts":[["REN6","Quihai",""],["HT5","Tongli",""],["ST44","Neiting",""]]},{"id":146,"en":"Shortness of breath from indigestion","vn":"Thở mệt do ăn không tiêu","fr":"Essoufflement dû à indigestion","zh":"食滞导致气短","cat":"Khi\\u0301","pts":[["REN6","Quihai",""]]},{"id":147,"en":"Cold qi causing lower abdominal pain","vn":"Khí lạnh làm đau dưới rốn","fr":"Douleur sous‑ombilicale due au froid","zh":"寒气入腹致下腹痛","cat":"Khi\\u0301","pts":[["REN6","Quihai",""]]},{"id":148,"en":"Mental fatigue, weakness, low vitality","vn":"Tinh thần ủy mị, yếu đuối, uể oài","fr":"Fatigue mentale, faiblesse, vitalité basse","zh":"精神疲惫、乏力、无生气","cat":"","pts":[]},{"id":149,"en":"Fearfulness and palpitations","vn":"Hay sợ sệt, hồi hộp","fr":"Peur excessive et palpitations","zh":"心悸易惊","cat":"Th\\u00e2\\u0300n","pts":[["KI2","Rangu",""],["PC6","Neiguan",""],["SP9","Yinlingquan",""],["LV2","Xinglian",""],["PC7","Daling",""],["HT7","Shenmen",""],["ST36","Zusanli",""]]},{"id":150,"en":"Poor memory","vn":"Hay quên","fr":"Mauvaise mémoire","zh":"记忆力差","cat":"Th\\u00e2\\u0300n","pts":[["UB15","Xinshu",""],["REN12","Zhongwan",""],["ST36","Zusanli",""],["HT3","Shaohai",""],["DU20","Baihui",""]]},{"id":151,"en":"Mental confusion and disorientation","vn":"Thất chí, lẩn thẩn","fr":"Confusion mentale, désorientation","zh":"神志恍惚、迷糊","cat":"Th\\u00e2\\u0300n","pts":[["PC9","Zhongchong",""],["REN15","Jiuwei",""],["DU20","Baihui",""],["SI3","Houxi",""],["KI4","Dazhong",""]]},{"id":152,"en":"Inappropriate laughing and talking","vn":"Cười nói loạn xạ","fr":"Rires et paroles inappropriés","zh":"言笑无常","cat":"Th\\u00e2\\u0300n","pts":[["PC6","Neiguan",""],["REN15","Jiuwei",""],["ST40","Fenglong",""]]},{"id":153,"en":"Nosebleed, vomiting blood, blood in stool","vn":"Máu cam, mửa ra máu. Ỉa ra máu","fr":"Épistaxis, hématémèse, sang dans les selles","zh":"鼻出血、吐血、便血","cat":"Huy\\u00ea\\u0301t","pts":[["SP1","Yin Bai",""],["PC7","Daling",""],["HT7","Shenmen",""],["KI3","Taizi",""]]},{"id":154,"en":"Persistent nosebleed","vn":"Chảy máu cam không cầm","fr":"Saignement nasal persistant","zh":"鼻血不止","cat":"Huy\\u00ea\\u0301t","pts":[["DU23","Shangxing",""],["DU15","Yamen",""],["DU15","Yamen",""],["ST44","Neiting",""],["ST36","Zusanli",""]]},{"id":155,"en":"Vomiting blood","vn":"Thổ huyết","fr":"Vomissement de sang","zh":"吐血","cat":"Huy\\u00ea\\u0301t","pts":[["DU16","Fengfu",""],["REN13","Sangwan",""],["REN12","Zhongwan",""],["REN6","Quihai",""],["ST36","Zusanli",""],["PC7","Daling",""],["HT7","Shenmen",""]]},{"id":156,"en":"Spitting up blood","vn":"Ọc ra huyết","fr":"Crachat de sang","zh":"咯血","cat":"Huy\\u00ea\\u0301t","pts":[["REN13","Sangwan",""],["PC7","Daling",""],["HT7","Shenmen",""],["PC3","Quze",""],["LU10","Yuji",""]]},{"id":157,"en":"Blood in stool","vn":"Tiêu ra máu","fr":"Sang dans les selles","zh":"便血","cat":"Huy\\u00ea\\u0301t","pts":[["UB17","Geshu",""],["KI7","Fuliu",""],["LV3","Taichong",""],["UB35","Huiyang",""]]},{"id":158,"en":"Coughing up blood","vn":"Ho ra máu","fr":"Toux avec sang","zh":"咳血","cat":"Huy\\u00ea\\u0301t","pts":[["ST36","Zusanli",""],["UB13","Feishu",""],["UB12","Fengmen",""]]},{"id":159,"en":"Coughing blood due to tuberculosis","vn":"Ho ra máu do lao","fr":"Hémoptysie due à la tuberculose","zh":"肺结核咳血","cat":"Huy\\u00ea\\u0301t","pts":[["REN12","Zhongwan",""],["UB13","Feishu",""],["ST36","Zusanli",""]]},{"id":160,"en":"Uncontrolled bleeding from mouth and nose","vn":"Xuất huyết miệng mũi, không cầm","fr":"Hémorragie buccale et nasale incontrôlée","zh":"口鼻出血不止","cat":"Huy\\u00ea\\u0301t","pts":[["DU23","Shangxing",""]]},{"id":161,"en":"Fearfulness with insomnia","vn":"Sợ sệt, mất ngủ","fr":"Peur excessive avec insomnie","zh":"惊恐失眠","cat":"Chim Bao","pts":[["REN7","Yinjiao",""]]},{"id":162,"en":"Restlessness and inability to lie still","vn":"Bức rức, nằm không yên","fr":"Agitation, incapacité à rester allongé","zh":"烦躁不安，不能安卧","cat":"Chim Bao","pts":[["UB38","Fuxi",""]]},{"id":163,"en":"Insomnia due to Gallbladder cold","vn":"Mất ngũ do đởm hàn","fr":"Insomnie due au froid de la Vésicule Biliaire","zh":"胆寒导致失眠","cat":"","pts":[]},{"id":164,"en":"Frequent frightening dreams and nightmares","vn":"Nhiều ác mộng sợ sệt","fr":"Cauchemars fréquents et rêves effrayants","zh":"多恶梦、惊恐梦","cat":"Chim Bao","pts":[["UB15","Xinshu",""],["ST44","Neiting",""]]},{"id":165,"en":"Sudden loss of voice","vn":"Mất tiếng đột ngột","fr":"Perte soudaine de la voix","zh":"突然失声","cat":"\\u00c2m Thanh","pts":[["REN22","Tiantu",""]]},{"id":166,"en":"Paralysis of the throat","vn":"Liệt họng","fr":"Paralysie de la gorge","zh":"喉部麻痹","cat":"\\u00c2m Thanh","pts":[["ST40","Fenglong",""]]},{"id":167,"en":"Sudden muteness","vn":"Câm đột ngột","fr":"Mutisme soudain","zh":"突然哑声","cat":"\\u00c2m Thanh","pts":[["LI4","Hegu",""],["PC5","Jianshi",""]]},{"id":168,"en":"Inability to speak","vn":"Câm","fr":"Incapacité à parler","zh":"不能说话","cat":"Ng\\u00f4n ng\\u01b0\\u0303","pts":[["LI4","Hegu",""],["KI1","Yongquan",""],["GB35","Yangjiao",""],["KI20","Tonggu",""],["KI20","Tonggu",""],["SJ6","Zhigou",""]]},{"id":169,"en":"Stiff tongue, slurred or unclear speech","vn":"Cứng lưởi, ngọng ngịu","fr":"Langue raide, parole pâteuse","zh":"舌强语涩","cat":"Ng\\u00f4n ng\\u01b0\\u0303","pts":[["HT5","Tongli",""]]},{"id":170,"en":"Tongue stiffness, slow or impaired speech","vn":"Líu lưỡi, nói ngọng, nói chậm","fr":"Langue raide, élocution lente","zh":"舌强言语迟缓","cat":"Ng\\u00f4n ng\\u01b0\\u0303","pts":[["DU15","Yamen",""]]},{"id":171,"en":"Swollen tongue with difficulty speaking","vn":"Sưng lưỡi, khó nói","fr":"Langue enflée, difficulté à parler","zh":"舌肿难言","cat":"Ng\\u00f4n ng\\u01b0\\u0303","pts":[["REN23","Lianquan",""]]},{"id":172,"en":"Excessive sweating","vn":"Nhiều mồ hôi","fr":"Transpiration excessive","zh":"多汗","cat":"T\\u00e2n di\\u0323ch","pts":[["LI4","Hegu",""],["KI7","Fuliu",""]]},{"id":173,"en":"Lack of sweating","vn":"It mồ hôi","fr":"Absence de transpiration","zh":"无汗","cat":"T\\u00e2n di\\u0323ch","pts":[["LI4","Hegu",""],["KI7","Fuliu",""]]},{"id":174,"en":"Night sweating","vn":"Mồ hôi trộm","fr":"Sueurs nocturnes","zh":"盗汗","cat":"T\\u00e2n di\\u0323ch","pts":[["HT6","Yinxi",""],["REN3","Zhongji",""],["REN6","Quihai",""]]},{"id":175,"en":"Persistent night sweating","vn":"Mồ hôi trộm ra không dứt","fr":"Sueurs nocturnes persistantes","zh":"盗汗不止","cat":"T\\u00e2n di\\u0323ch","pts":[["HT6","Yinxi",""]]},{"id":176,"en":"Night sweating due to consumption (deficiency)","vn":"Mồ hôi trộm do lao","fr":"Sueurs nocturnes par déficience","zh":"虚劳盗汗","cat":"T\\u00e2n di\\u0323ch","pts":[["UB13","Feishu",""]]},{"id":177,"en":"Cold damage with absence of sweating","vn":"Thương hàn, mồ hôi không ra","fr":"Atteinte par le froid sans transpiration","zh":"伤寒无汗","cat":"T\\u00e2n di\\u0323ch","pts":[["KI7","Fuliu",""]]},{"id":178,"en":"All types of phlegm‑damp disorders","vn":"Các loại đàm ẩm đều dùng","fr":"Tous les troubles de type mucosités‑humidité","zh":"各种痰湿病证","cat":"\\u0110a\\u0300m \\u00e2\\u0309m","pts":[["REN12","Zhongwan",""],["ST40","Fenglong",""]]},{"id":179,"en":"Phlegm obstruction in the chest causing poor appetite","vn":"Đàm ngăn trong ngực không ăn được","fr":"Obstruction de mucosités dans la poitrine entraînant perte d’appétit","zh":"痰阻胸中，食欲不振","cat":"\\u0110a\\u0300m \\u00e2\\u0309m","pts":[["REN14","Juque",""],["ST36","Zusanli",""]]},{"id":180,"en":"Chronic phlegm‑damp accumulation","vn":"Đàm ẩm kinh niên","fr":"Accumulation chronique de mucosités‑humidité","zh":"慢性痰湿积聚","cat":"","pts":[]},{"id":181,"en":"Irregular menstruation","vn":"Kinh nguyệt không đều","fr":"Menstruations irrégulières","zh":"月经不调","cat":"Ba\\u0300o cung","pts":[["REN3","Zhongji",""],["LV9","Yibao",""],["SP6","Sanwinjiao",""],["UB23","Shenshu",""]]},{"id":182,"en":"Amenorrhea","vn":"Mất kinh","fr":"Aménorrhée","zh":"闭经","cat":"Ba\\u0300o cung","pts":[["REN3","Zhongji",""],["SP6","Sanwinjiao",""],["UB23","Shenshu",""],["LI4","Hegu",""],["KI14","Siman",""],["ST36","Zusanli",""]]},{"id":183,"en":"Heavy or prolonged menstrual bleeding","vn":"Rong kinh","fr":"Règles abondantes ou prolongées","zh":"月经过多或经期延长","cat":"Ba\\u0300o cung","pts":[["SP10","Xuehai",""],["SP2","Dadu",""],["KI10","Yingu",""],["REN4","Guanyan",""],["SP6","Sanwinjiao",""],["REN3","Zhongji",""],["LV2","Xinglian",""],["SP6","Sanwinjiao",""],["LV3","Taichong",""],["REN3","Zhongji",""]]},{"id":184,"en":"Red or white vaginal discharge","vn":"Xích, bạch đới","fr":"Pertes vaginales rouges ou blanches","zh":"赤白带下","cat":"Ba\\u0300o cung","pts":[["REN3","Zhongji",""],["UB23","Shenshu",""],["SP6","Sanwinjiao",""],["LV13","Zhangmen",""],["LV2","Xinglian",""]]},{"id":185,"en":"Vaginal discharge","vn":"Bạch đới","fr":"Pertes vaginales","zh":"带下","cat":"Ba\\u0300o cung","pts":[["REN3","Zhongji",""],["REN6","Quihai",""],["REN2","Qugu",""],["GB18","Chengling",""]]},{"id":186,"en":"Pulmonary tuberculosis","vn":"Lao phổi","fr":"Tuberculose pulmonaire","zh":"肺结核","cat":"","pts":[]},{"id":187,"en":"Hip pain","vn":"Đau hông","fr":"Douleur de la hanche","zh":"髋部疼痛","cat":"H\\u00f4ng","pts":[["SJ5","Waiguan",""],["ST36","Zusanli",""],["LV13","Zhangmen",""],["LV4","Zhongfeng",""],["GB34","Yanglingquan",""],["LV2","Xinglian",""],["LV14","Qimen",""],["SP9","Yinlingquan",""]]},{"id":188,"en":"Hip pain radiating to the chest","vn":"Đau hông tới ngực","fr":"Douleur de la hanche irradiant vers la poitrine","zh":"髋痛放射至胸部","cat":"H\\u00f4ng","pts":[["LV14","Qimen",""],["LV13","Zhangmen",""],["LV2","Xinglian",""],["GB40","Qiuxu",""],["KI1","Yongquan",""],["SJ6","Zhigou",""],["UB19","Danshu",""]]},{"id":189,"en":"Rib‑side and abdominal distention with pain","vn":"Hông ngực căng đau","fr":"Distension douloureuse du flanc et de l’abdomen","zh":"胁腹胀痛","cat":"H\\u00f4ng","pts":[["SP4","Gongsun",""],["ST36","Zusanli",""],["LV3","Taichong",""],["SP6","Sanwinjiao",""]]},{"id":190,"en":"Hip pain radiating to the lower back","vn":"Đau hông thắt lưng","fr":"Douleur de la hanche irradiant vers les lombes","zh":"髋痛放射至腰部","cat":"H\\u00f4ng","pts":[["GB30","Huantiao",""],["SP3","Taibai",""],["GB38","Yanglu",""]]},{"id":191,"en":"Rib‑side pain","vn":"Đau hông sườn","fr":"Douleur du flanc","zh":"胁肋疼痛","cat":"H\\u00f4ng","pts":[["SJ6","Zhigou",""],["SJ6","Zhigou",""],["SJ6","Zhigou",""],["DU9","Zhiyang",""],["SJ6","Zhigou",""],["SJ5","Waiguan",""],["GB34","Yanglingquan",""],["PC5","Jianshi",""],["LI11","Quchi",""],["GB24","Riyue",""],["PC7","Daling",""],["HT7","Shenmen",""],["ST36","Zusanli",""],["SP3","Taibai",""],["GB40","Qiuxu",""],["GB38","Yanglu",""]]},{"id":192,"en":"Pain on both sides of the hips","vn":"Đau hai bên hông","fr":"Douleur des deux hanches","zh":"双侧髋部疼痛","cat":"H\\u00f4ng","pts":[["LV1","Dadun",""],["LV2","Xinglian",""]]},{"id":193,"en":"Rib‑side stabbing pain","vn":"Xốc tức hông","fr":"Douleur lancinante du flanc","zh":"胁部刺痛","cat":"H\\u00f4ng","pts":[["LV13","Zhangmen",""],["SI5","Yanggu",""],["SJ6","Zhigou",""],["UB17","Geshu",""],["UB62","Shenmai",""]]},{"id":194,"en":"Hip pain radiating to the spine","vn":"Đau hông tới cột sống","fr":"Douleur de la hanche irradiant vers la colonne","zh":"髋痛放射至脊柱","cat":"H\\u00f4ng","pts":[["UB18","Ganshu",""]]},{"id":195,"en":"Stiff, painful spine","vn":"Đau cứng sóng lưng","fr":"Colonne vertébrale raide et douloureuse","zh":"脊柱僵硬疼痛","cat":"L\\u01b0ng","pts":[["DU26","Renzhong",""]]},{"id":196,"en":"Shoulder and back pain","vn":"Đau vai lưng","fr":"Douleur de l’épaule et du dos","zh":"肩背疼痛","cat":"L\\u01b0ng","pts":[["LI10","Shousanli",""],["LI15","Jianyu",""],["LI11","Quchi",""],["SI5","Yanggu",""]]},{"id":197,"en":"Back pain radiating to the shoulder","vn":"Đau lưng chạy tới vai","fr":"Douleur dorsale irradiant vers l’épaule","zh":"背痛放射至肩部","cat":"L\\u01b0ng","pts":[["GB27","Wushu",""],["UB60","Kunlun",""],["GB21","Jiangjing",""]]},{"id":198,"en":"Generalized back stiffness and pain","vn":"Cứng lưng đau cả toàn thân","fr":"Raideur et douleur généralisées du dos","zh":"全背僵硬疼痛","cat":"L\\u01b0ng","pts":[["DU15","Yamen",""]]},{"id":199,"en":"Aching pain in the back region","vn":"Đau nhức vùng lưng","fr":"Douleur sourde dans la région dorsale","zh":"背部酸痛","cat":"L\\u01b0ng","pts":[["GB21","Jiangjing",""]]},{"id":200,"en":"Shoulder and back soreness","vn":"Đau mỏi vai lưng","fr":"Courbatures épaules‑dos","zh":"肩背酸痛","cat":"L\\u01b0ng","pts":[["UB12","Fengmen",""],["GB21","Jiangjing",""],["LI5","Yangxi",""],["UB40","Weizhong",""]]},{"id":201,"en":"Stiff lower back","vn":"Lưng cứng đơ","fr":"Raideur lombaire","zh":"下腰僵硬","cat":"L\\u01b0ng","pts":[["DU26","Renzhong",""],["DU16","Fengfu",""],["UB13","Feishu",""]]},{"id":202,"en":"Back muscle contraction","vn":"Co rút lưng","fr":"Contraction musculaire du dos","zh":"背部肌肉痉挛","cat":"","pts":[]},{"id":203,"en":"Hip pain radiating to the spine","vn":"Đau hông dẫn tới đau sóng lưng","fr":"Douleur de la hanche irradiant vers la colonne","zh":"髋痛放射至脊柱","cat":"L\\u01b0ng","pts":[["UB18","Ganshu",""]]},{"id":204,"en":"Low back pain","vn":"Đau thắt lưng","fr":"Douleur lombaire","zh":"腰痛","cat":"L\\u01b0ng","pts":[["UB23","Shenshu",""],["UB40","Weizhong",""],["UB52","Zhishi",""],["UB23","Shenshu",""],["DU4","Mingmen",""],["UB60","Kunlun",""],["UB23","Shenshu",""],["UB40","Weizhong",""]]},{"id":205,"en":"Unable to bend or extend the back","vn":"Không cúi ngữa được","fr":"Impossible de fléchir ou d’étendre le dos","zh":"腰部不能屈伸","cat":"L\\u01b0ng","pts":[["DU26","Renzhong",""]]},{"id":206,"en":"Low back pain due to Kidney deficiency","vn":"Đau lưng do thận suy","fr":"Lombalgie due à déficience rénale","zh":"肾虚腰痛","cat":"L\\u01b0ng","pts":[["GB21","Jiangjing",""]]},{"id":207,"en":"Traumatic low back pain","vn":"Đau lưng do chấn thương","fr":"Lombalgie traumatique","zh":"外伤性腰痛","cat":"L\\u01b0ng","pts":[["GB30","Huantiao",""],["UB60","Kunlun",""],["GB34","Yanglingquan",""],["UB34","Xialiao",""]]},{"id":208,"en":"Low back stiffness with cold sensation","vn":"Đau cứng thắt lưng","fr":"Raideur lombaire avec sensation de froid","zh":"腰部僵硬伴寒感","cat":"L\\u01b0ng","pts":[["DU4","Mingmen",""],["UB60","Kunlun",""],["UB52","Zhishi",""],["LV2","Xinglian",""],["KI7","Fuliu",""]]},{"id":209,"en":"Cold sensation in the lower back","vn":"Thắt lưng có cảm giác lạnh","fr":"Sensation de froid lombaire","zh":"腰部发冷","cat":"","pts":[]},{"id":210,"en":"Difficulty moving the back","vn":"Khó cử động","fr":"Difficulté à mobiliser le dos","zh":"背部活动困难","cat":"L\\u01b0ng","pts":[["LV2","Xinglian",""],["GB31","Fengshi",""]]},{"id":211,"en":"Finger contraction in all five fingers","vn":"Năm ngón tay co quắp","fr":"Contraction des cinq doigts","zh":"五指拘挛","cat":"Tay","pts":[["LI2","Erjian",""],["SI2","Qiangu",""]]},{"id":212,"en":"Finger joint pain","vn":"Đau các ngón tay","fr":"Douleur des articulations des doigts","zh":"手指关节痛","cat":"Tay","pts":[["SJ4","Yangchi",""],["SJ5","Waiguan",""],["LI4","Hegu",""]]},{"id":213,"en":"Difficulty flexing both hands","vn":"Hai tay khó co quắp","fr":"Difficulté à fléchir les deux mains","zh":"双手屈曲困难","cat":"Tay","pts":[["PC7","Daling",""],["HT7","Shenmen",""]]},{"id":214,"en":"Enhanced fertility when treated before/after menses","vn":"Dễ có con, châm trước và sau khi có kinh - cứu","fr":"Fertilité améliorée avec traitement avant/après les règles","zh":"经前后针灸助孕","cat":"","pts":[["LV11","Yinlian",""]]},{"id":215,"en":"Stomach ulcer pain","vn":"Loét dạ dày","fr":"Douleur d’ulcère gastrique","zh":"胃溃疡痛","cat":"","pts":[["PC6","Neiguan",""]]},{"id":216,"en":"Heart-region pain","vn":"Đau vùng tim","fr":"Douleur dans la région cardiaque","zh":"心区疼痛","cat":"","pts":[["PC6","Neiguan",""],["SI7","Zhizheng",""],["SI7","Zhizheng",""],["PC6","Neiguan",""]]},{"id":217,"en":"Chest and heart fullness/oppression","vn":"Đầy tức trong tim, ngực","fr":"Plénitude/oppression thoracique et cardiaque","zh":"心胸胀闷","cat":"","pts":[["PC6","Neiguan",""],["UB17","Geshu",""],["PC5","Jianshi",""],["ST36","Zusanli",""],["SP4","Gongsun",""]]},{"id":218,"en":"Abdominal pain","vn":"Đau trong bụng","fr":"Douleur abdominale","zh":"腹痛","cat":"","pts":[["PC6","Neiguan",""],["ST36","Zusanli",""]]},{"id":219,"en":"Low blood pressure","vn":"Huyết áp thấp","fr":"Hypotension","zh":"低血压","cat":"","pts":[["PC6","Neiguan",""],["DU25","Sulia",""]]},{"id":220,"en":"Dizziness, blurred vision, desire to lie down","vn":"Chóng mặt, hoa mắt, thích nằm","fr":"Vertiges, vision trouble, envie de s’allonger","zh":"头晕、视物模糊、想躺下","cat":"","pts":[["PC6","Neiguan",""],["GB20","Fengchi",""],["DU21","Qianding",""],["LI4","Hegu",""]]},{"id":221,"en":"Abdominal masses or lumps","vn":"Kết khối trong bụng","fr":"Masse ou nodule abdominal","zh":"腹部包块","cat":"","pts":[["PC6","Neiguan",""]]},{"id":222,"en":"Regulation of blood pressure","vn":"Điều hòa huyết áp","fr":"Régulation de la tension artérielle","zh":"调节血压","cat":"","pts":[["PC6","Neiguan",""]]},{"id":223,"en":"Balancing Yin/Yang, harmonizing water/fire","vn":"Quân bình âm dương, thủy hỏa","fr":"Équilibrer Yin/Yang, harmoniser eau et feu","zh":"调和阴阳，水火既济","cat":"","pts":[["PC6","Neiguan",""],["SP6","Sanwinjiao",""]]},{"id":224,"en":"Constipation","vn":"Bón","fr":"Constipation","zh":"便秘","cat":"","pts":[["UB38","Fuxi",""],["SJ6","Zhigou",""],["SP15","Daheng",""],["SP1","Yin Bai",""],["ST25","Tianshu",""],["ST36","Zusanli",""],["ST37","Shangjuxu",""]]},{"id":225,"en":"Shoulder nerve pain","vn":"Đau thần kinh vai","fr":"Névralgie de l’épaule","zh":"肩部神经痛","cat":"","pts":[["SP4","Gongsun",""],["SJ6","Zhigou",""]]},{"id":226,"en":"Epilepsy and nervous exhaustion","vn":"Động kinh, suy nhược thần kinh","fr":"Épilepsie et épuisement nerveux","zh":"癫痫与神经衰弱","cat":"","pts":[["PC6","Neiguan",""],["REN14","Juque",""],["ST40","Fenglong",""]]},{"id":227,"en":"Sore throat and laryngeal inflammation","vn":"Sưng đau họng, thanh quản","fr":"Gorge enflammée et laryngite","zh":"咽喉肿痛、喉炎","cat":"","pts":[["LI4","Hegu",""]]},{"id":228,"en":"Eye pain radiating to inner canthus","vn":"Đau mắt dẫn tới khoé","fr":"Douleur oculaire irradiant au canthus interne","zh":"眼痛放射至内眦","cat":"","pts":[]},{"id":229,"en":"Kyphosis (hunchback)","vn":"Gù lưng","fr":"Cyphose","zh":"驼背","cat":"","pts":[]},{"id":230,"en":"Dry throat","vn":"Khô họng","fr":"Gorge sèche","zh":"咽喉干燥","cat":"","pts":[]},{"id":231,"en":"Hemiplegia with loss of sensation","vn":"Liệt nửa người, mất cảm giác","fr":"Hémiplégie avec perte de sensation","zh":"偏瘫伴感觉丧失","cat":"","pts":[["GB13","Benshen",""]]},{"id":232,"en":"Lower limb paralysis due to collapse","vn":"Liệt hạ chi do đột trụy","fr":"Paralysie des membres inférieurs par collapsus","zh":"虚脱导致下肢瘫痪","cat":"","pts":[["ST33","Yinshi",""]]},{"id":233,"en":"Thighs cold like ice","vn":"Đùi lạnh như mước đá","fr":"Cuisses froides comme de la glace","zh":"大腿冰冷如冰","cat":"","pts":[["ST33","Yinshi",""]]},{"id":234,"en":"Cold sensation in both buttocks","vn":"Lạnh hai mông","fr":"Froid dans les deux fesses","zh":"双臀发冷","cat":"","pts":[["ST33","Yinshi",""],["DU3","Yaoyangguan",""],["GB33","Yangguan",""]]},{"id":235,"en":"Cold legs","vn":"Lạnh chân","fr":"Jambes froides","zh":"双腿发冷","cat":"","pts":[["GB32","Zhongdu",""],["KI7","Fuliu",""],["ST33","Yinshi",""],["UB62","Shenmai",""],["GB31","Fengshi",""],["ST45","Lidui",""],["UB61","Pushen",""]]},{"id":236,"en":"Lumbar disc herniation with low back pain","vn":"Thoái vị dĩa đệm thắt lưng","fr":"Hernie discale lombaire avec lombalgie","zh":"腰椎间盘突出伴腰痛","cat":"","pts":[]},{"id":237,"en":"Low back pain with inability to bend/extend","vn":"Đau thắt lưng không cúi ngẩng được","fr":"Lombalgie empêchant flexion/extension","zh":"腰痛，不能屈伸","cat":"","pts":[["UB23","Shenshu",""],["SI3","Houxi",""]]},{"id":238,"en":"Acute hepatitis","vn":"Viêm gan cấp tính","fr":"Hépatite aiguë","zh":"急性肝炎","cat":"","pts":[["GB32","Zhongdu",""]]},{"id":239,"en":"Lower limb numbness or paralysis","vn":"Tê liệt chi dưới","fr":"Engourdissement ou paralysie des membres inférieurs","zh":"下肢麻木或瘫痪","cat":"","pts":[["GB32","Zhongdu",""]]},{"id":240,"en":"Groin pain and testicular pain","vn":"Đau háng, đau tinh hoàng","fr":"Douleur de l’aine et des testicules","zh":"腹股沟痛、睾丸痛","cat":"","pts":[["LV11","Yinlian",""]]},{"id":241,"en":"Amenorrhea and menstrual blockage","vn":"Không có kinh, bế kinh","fr":"Aménorrhée et blocage menstruel","zh":"闭经、经闭","cat":"","pts":[["LV11","Yinlian",""],["SP10","Xuehai",""],["SP6","Sanwinjiao",""],["LI4","Hegu",""],["SP9","Yinlingquan",""]]},{"id":242,"en":"Menstrual pain","vn":"Đau khi có kinh","fr":"Dysménorrhée","zh":"痛经","cat":"","pts":[["LV11","Yinlian",""],["SP6","Sanwinjiao",""]]},{"id":243,"en":"Shoulder pain with inability to lift arm","vn":"Đau vai không dở lên được","fr":"Douleur d’épaule empêchant l’élévation du bras","zh":"肩痛不能抬举","cat":"","pts":[["SJ4","Yangchi",""],["SI12","Bingfeng",""],["SI6","Yanglao",""]]},{"id":244,"en":"Alternating fever and chills","vn":"Sốt lạnh, sốt rét","fr":"Alternance fièvre/frissons","zh":"寒热往来","cat":"","pts":[["SJ4","Yangchi",""]]},{"id":245,"en":"Common cold w/ neck pain, eye pain, hearing issues","vn":"Cảm, đau cổ, đau mắt, điếc","fr":"Rhume avec douleur cervicale, oculaire et baisse auditive","zh":"感冒伴颈痛、眼痛、听力下降","cat":"","pts":[["SJ4","Yangchi",""],["UB12","Fengmen",""],["DU14","Dazhui",""]]},{"id":246,"en":"Low back pain with inability to bend","vn":"Đau that lưng, khong cui duoc","fr":"Lombalgie empêchant la flexion","zh":"腰痛不能前屈","cat":"","pts":[["ST37","Shangjuxu",""],["UB40","Weizhong",""],["UB23","Shenshu",""],["SI3","Houxi",""],["SP9","Yinlingquan",""]]},{"id":247,"en":"Headache with nasal congestion","vn":"Nhức đầu, nghẹt mũi","fr":"Céphalée avec congestion nasale","zh":"头痛伴鼻塞","cat":"","pts":[]},{"id":248,"en":"High blood pressure","vn":"Huyết áp cao","fr":"Hypertension","zh":"高血压","cat":"","pts":[["LI11","Quchi",""],["ST40","Fenglong",""]]},{"id":249,"en":"Insomnia","vn":"Mất ngủ","fr":"Insomnie","zh":"失眠","cat":"","pts":[["PC6","Neiguan",""],["SP6","Sanwinjiao",""],["SP6","Sanwinjiao",""]]},{"id":250,"en":"Regulating blood, warming Spleen, warming Yang","vn":"Điều huyết,ôn tỳ, ôn dương","fr":"Réguler le sang, réchauffer la Rate et le Yang","zh":"调血、温脾、温阳","cat":"","pts":[["SP1","Yin Bai",""]]},{"id":251,"en":"Cold hands and feet","vn":"Lạnh chân, Lạnh tay","fr":"Mains et pieds froids","zh":"手脚冰冷","cat":"","pts":[["SP1","Yin Bai",""],["DU20","Baihui",""],["ST45","Lidui",""],["SP2","Dadu",""]]},{"id":252,"en":"Blood in stool","vn":"Đi tiêu ra máu","fr":"Sang dans les selles","zh":"便血","cat":"","pts":[["SP1","Yin Bai",""],["ST36","Zusanli",""],["UB62","Shenmai",""]]},{"id":253,"en":"Stopping bleeding","vn":"Cầm máu","fr":"Arrêter le saignement","zh":"止血","cat":"","pts":[["SP1","Yin Bai",""],["SP1","Yin Bai",""],["KI3","Taizi",""],["KI3","Taizi",""],["PC7","Daling",""],["HT7","Shenmen",""],["PC7","Daling",""],["HT7","Shenmen",""]]},{"id":254,"en":"Uncontrolled nosebleed","vn":"Chảy máu cam không cầm được","fr":"Épistaxis incontrôlable","zh":"鼻血不止","cat":"","pts":[["SP1","Yin Bai",""],["UB40","Weizhong",""],["REN24","Chengjiang",""],["HT6","Yinxi",""]]},{"id":255,"en":"Swollen big toe","vn":"Sưng ngón chân cái","fr":"Gonflement du gros orteil","zh":"大脚趾肿胀","cat":"","pts":[["SP1","Yin Bai",""]]},{"id":256,"en":"Paralysis due to cerebral hemorrhage","vn":"Liệt do xuất huyết não","fr":"Paralysie due à hémorragie cérébrale","zh":"脑出血导致瘫痪","cat":"","pts":[["SP1","Yin Bai",""],["ST31","Biquan",""]]},{"id":257,"en":"Poor appetite with vomiting","vn":"Không thèm ăn, nôn mữa","fr":"Mauvais appétit avec vomissements","zh":"食欲差伴呕吐","cat":"","pts":[["SP1","Yin Bai",""]]},{"id":258,"en":"Frequent dreaming and nightmares","vn":"Ngủ hay mộng mị (ma quỉ)","fr":"Rêves fréquents et cauchemars","zh":"多梦、噩梦","cat":"","pts":[["SP1","Yin Bai",""],["ST45","Lidui",""]]},{"id":259,"en":"Abdominal distention","vn":"Bụng trướng","fr":"Distension abdominale","zh":"腹胀","cat":"","pts":[["SP1","Yin Bai",""],["ST41","Jiexi",""],["SP1","Yin Bai",""],["UB20","Pishu",""],["SP10","Xuehai",""],["ST25","Tianshu",""],["UB21","Weishu",""],["SP5","Shangqiu",""],["KI6","Zhaohai",""],["UB20","Pishu",""],["ST36","Zusanli",""],["UB21","Weishu",""],["ST25","Tianshu",""],["ST36","Zusanli",""],["REN7","Yinjiao",""]]},{"id":260,"en":"Raising Yang and warming Yang","vn":"Tăng dương, ổn dương","fr":"Élever le Yang et réchauffer le Yang","zh":"升阳、温阳","cat":"","pts":[["SP1","Yin Bai",""],["SI3","Houxi",""]]},{"id":261,"en":"Wind‑stroke with hives or urticaria","vn":"Trúng phong, nổi mề đay","fr":"Coup de vent avec urticaire","zh":"中风伴风疹","cat":"","pts":[]},{"id":262,"en":"Vertex headache","vn":"Nhức đỉnh đầu","fr":"Céphalée au sommet du crâne","zh":"头顶痛","cat":"","pts":[["DU20","Baihui",""],["LI4","Hegu",""],["DU23","Shangxing",""]]},{"id":263,"en":"Rectal prolapse","vn":"Sa trực trường","fr":"Prolapsus rectal","zh":"直肠脱垂","cat":"","pts":[["DU20","Baihui",""],["REN15","Jiuwei",""],["DU1","Chiangqiang",""]]},{"id":264,"en":"Tinnitus, dizziness, palpitations, insomnia","vn":"Ù tai, hoa mắt, hồi hộp, mất ngủ","fr":"Acouphènes, vertiges, palpitations, insomnie","zh":"耳鸣、头晕、心悸、失眠","cat":"","pts":[["DU20","Baihui",""]]},{"id":265,"en":"Nasal congestion","vn":"Nghẹt mũi","fr":"Congestion nasale","zh":"鼻塞","cat":"","pts":[["DU20","Baihui",""]]},{"id":266,"en":"Forgetfulness","vn":"Hay quên trước quên sau","fr":"Oublis fréquents","zh":"健忘","cat":"","pts":[["DU20","Baihui",""],["UB43","Gaohuangshu",""]]},{"id":267,"en":"Upper toothache, tonsillitis, finger numbness","vn":"Đau răng, amidale, tê ngón tay","fr":"Douleur dentaire supérieure, amygdalite, doigts engourdis","zh":"上牙痛、扁桃体炎、手指麻木","cat":"","pts":[]},{"id":268,"en":"Upper jaw toothache","vn":"Đau răng hàm trên","fr":"Douleur des dents de la mâchoire supérieure","zh":"上颌牙痛","cat":"","pts":[["ST3","Juliao",""],["LI4","Hegu",""],["ST7","Xiaguan",""],["REN10","Xiawan",""],["SJ2","Yemen",""]]},{"id":269,"en":"Stiff, painful spine and low back","vn":"Đau cứng cột sống, thắt lưng","fr":"Colonne et bas du dos raides et douloureux","zh":"脊柱僵硬疼痛","cat":"","pts":[["UB30","Baihuanshu",""],["DU8","Jinsuo",""],["UB28","Pangguanshu",""],["SJ3","Zhongzhu",""],["GB34","Yanglingquan",""]]},{"id":270,"en":"Wind‑damp obstruction","vn":"Phong thấp","fr":"Obstruction vent‑humidité","zh":"风湿阻滞","cat":"","pts":[["UB28","Pangguanshu",""],["ST31","Biquan",""],["UB28","Pangguanshu",""]]},{"id":271,"en":"Bladder inflammation and urethritis","vn":"Viêm bàng quang, viêm niếu đạo","fr":"Inflammation de la vessie et urétrite","zh":"膀胱炎、尿道炎","cat":"","pts":[["UB28","Pangguanshu",""],["UB23","Shenshu",""],["REN3","Zhongji",""],["SP6","Sanwinjiao",""]]},{"id":272,"en":"Bedwetting, constipation, diarrhea, abdominal pain","vn":"Đái dầm, bón, tiêu chảy, đau bụng","fr":"Énurésie, constipation, diarrhée, douleur abdominale","zh":"遗尿、便秘、腹泻、腹痛","cat":"","pts":[["UB28","Pangguanshu",""],["UB23","Shenshu",""]]},{"id":273,"en":"Indigestion","vn":"Ăn không tiêu","fr":"Indigestion","zh":"消化不良","cat":"","pts":[["UB28","Pangguanshu",""],["UB20","Pishu",""],["SP3","Taibai",""]]},{"id":274,"en":"Difficult urination or urinary incontinence","vn":"Bi tiểu, tiểu không tự chủ","fr":"Mictions difficiles ou incontinence","zh":"小便困难或失禁","cat":"","pts":[["UB53","Baohuang",""],["REN4","Guanyan",""],["SP6","Sanwinjiao",""]]},{"id":275,"en":"Stomach pain with vomiting","vn":"Đau dạ dày, nôn mữa","fr":"Douleur gastrique avec vomissements","zh":"胃痛伴呕吐","cat":"","pts":[]},{"id":276,"en":"Diabetes (Xiao Ke pattern)","vn":"Tiểu đường","fr":"Diabète (type Xiao Ke)","zh":"消渴（糖尿病）","cat":"","pts":[]},{"id":277,"en":"Hepatitis","vn":"Viêm gan","fr":"Hépatite","zh":"肝炎","cat":"","pts":[["LV14","Qimen",""],["GB34","Yanglingquan",""]]},{"id":278,"en":"Swollen toes and dorsum of the foot","vn":"Sưng ngón chân, mu chân","fr":"Gonflement des orteils et du dessus du pied","zh":"脚趾与足背肿胀","cat":"","pts":[]},{"id":279,"en":"Loss of sensation in lower limbs and toes","vn":"Mất cảm giác hạ chi và các ngón chân","fr":"Perte de sensation des membres inférieurs et des orteils","zh":"下肢及脚趾感觉丧失","cat":"","pts":[["ST36","Zusanli",""]]},{"id":280,"en":"Swelling and numbness of fingers and wrist joints","vn":"Sưng, tê ngón tay, khớp tay","fr":"Gonflement et engourdissement des doigts et poignets","zh":"手指与腕关节肿胀麻木","cat":"","pts":[["SJ5","Waiguan",""]]},{"id":281,"en":"Red, swollen arm","vn":"Cánh tay sưng đỏ","fr":"Bras rouge et enflé","zh":"手臂红肿","cat":"","pts":[]},{"id":282,"en":"Epilepsy with foaming at the mouth and dizziness","vn":"Động kinh, sùi bọt mép, hoa mắt","fr":"Épilepsie avec écume buccale et étourdissements","zh":"癫痫发作伴口吐白沫、头晕","cat":"","pts":[["GB13","Benshen",""],["DU12","Shenzhu",""]]},{"id":283,"en":"Abdominal distention, vomiting, stomach pain","vn":"Đầy bụng, nôn mửa, đau dạ dày","fr":"Distension abdominale, vomissements, douleur gastrique","zh":"腹胀、呕吐、胃痛","cat":"","pts":[["ST19","Burong",""]]},{"id":284,"en":"Abdominal bloating, gas, vomiting blood, chest pain, acid reflux","vn":"Sình ruột, no hơi, mửa ra máu, đau vùng tim, ợ chua","fr":"Ballonnement, gaz, hématémèse, douleur thoracique, reflux acide","zh":"腹胀、胀气、吐血、心区痛、胃酸反流","cat":"","pts":[["ST19","Burong",""],["LV14","Qimen",""],["PC7","Daling",""],["HT7","Shenmen",""],["KI27","Shufu",""]]},{"id":285,"en":"Stomach pain","vn":"Đau dạ dày","fr":"Douleur gastrique","zh":"胃痛","cat":"","pts":[["ST19","Burong",""],["SP3","Taibai",""],["ST36","Zusanli",""],["REN12","Zhongwan",""],["PC6","Neiguan",""],["SP4","Gongsun",""]]},{"id":286,"en":"Sciatic nerve pain","vn":"Đau thần kinh đùi","fr":"Douleur du nerf sciatique","zh":"坐骨神经痛","cat":"","pts":[]},{"id":287,"en":"Chronic physical and mental exhaustion","vn":"Tinh thần thể chất suy nhược, lao","fr":"Épuisement physique et mental chronique","zh":"身心长期衰弱","cat":"","pts":[]},{"id":288,"en":"Asthma, tonsillitis, toothache","vn":"Suyễn, amidale, đau răng","fr":"Asthme, amygdalite, mal de dents","zh":"哮喘、扁桃体炎、牙痛","cat":"","pts":[]},{"id":289,"en":"Anemia","vn":"Thiếu máu","fr":"Anémie","zh":"贫血","cat":"","pts":[]},{"id":290,"en":"Swollen knee joints with lower limb numbness/paralysis","vn":"Sưng khớp gối, tê liệt hạ chi","fr":"Genoux enflés avec engourdissement/paralysie des jambes","zh":"膝关节肿胀伴下肢麻木或瘫痪","cat":"","pts":[["ST31","Biquan",""],["UB40","Weizhong",""],["UB57","Chengshan",""]]},{"id":291,"en":"Wind‑damp obstruction","vn":"Phong thấp","fr":"Obstruction vent‑humidité","zh":"风湿阻滞","cat":"","pts":[["UB28","Pangguanshu",""],["ST31","Biquan",""],["UB28","Pangguanshu",""]]},{"id":292,"en":"Lower limb paralysis","vn":"Liệt hạ chi","fr":"Paralysie des membres inférieurs","zh":"下肢瘫痪","cat":"","pts":[["ST31","Biquan",""],["UB57","Chengshan",""],["GB31","Fengshi",""],["ST36","Zusanli",""]]},{"id":293,"en":"Tonsillitis and sore throat","vn":"Amidal, viêm cổ họng","fr":"Amygdalite et mal de gorge","zh":"扁桃体炎、咽喉痛","cat":"","pts":[]},{"id":294,"en":"Enlarged spleen or abdominal mass","vn":"Sưng lá lách, cục cứng trong bụng","fr":"Rate hypertrophiée ou masse abdominale","zh":"脾肿大或腹部包块","cat":"","pts":[]},{"id":295,"en":"Shoulder pain with inability to raise arm","vn":"Nhức bả vai không nâng tay lên được","fr":"Douleur d’épaule empêchant de lever le bras","zh":"肩痛不能抬臂","cat":"","pts":[["SI12","Bingfeng",""],["SJ4","Yangchi",""],["LU2","Yunmen",""],["GB21","Jiangjing",""],["SI3","Houxi",""]]},{"id":296,"en":"Asthma, rhinitis, tracheitis","vn":"Suyễn, viêm mũi, viêm khí quản","fr":"Asthme, rhinite, trachéite","zh":"哮喘、鼻炎、气管炎","cat":"","pts":[["KI22","Bulang",""],["UB13","Feishu",""],["KI19","Yindu",""]]},{"id":297,"en":"Pleurisy","vn":"Viêm màng ngực","fr":"Pleurésie","zh":"胸膜炎","cat":"","pts":[["KI22","Bulang",""]]},{"id":298,"en":"Palpitations, rapid heartbeat, chest pain","vn":"Hồi hộp, nhịp tim nhanh, đau ngực","fr":"Palpitations, tachycardie, douleur thoracique","zh":"心悸、心动过速、胸痛","cat":"","pts":[["KI22","Bulang",""],["UB15","Xinshu",""],["PC6","Neiguan",""]]},{"id":299,"en":"Heel and arch pain","vn":"Đau gót chân, mặt cá chân","fr":"Douleur du talon et de la voûte plantaire","zh":"脚跟与足弓疼痛","cat":"","pts":[["UB61","Pushen",""],["UB57","Chengshan",""],["UB60","Kunlun",""],["UB58","Feiyang",""],["KI3","Taizi",""]]},{"id":300,"en":"Leg cramps and lower limb paralysis","vn":"Vọp bẻ, liệt hạ chi","fr":"Crampe des jambes et paralysie des membres inférieurs","zh":"腿部抽筋与下肢瘫痪","cat":"","pts":[["UB61","Pushen",""]]},{"id":301,"en":"Low back pain","vn":"Đau lưng","fr":"Douleur lombaire","zh":"腰痛","cat":"","pts":[["UB61","Pushen",""]]},{"id":302,"en":"Epilepsy","vn":"Động kinh","fr":"Épilepsie","zh":"癫痫","cat":"","pts":[["UB61","Pushen",""],["DU20","Baihui",""],["DU26","Renzhong",""],["ST41","Jiexi",""]]},{"id":303,"en":"Age‑related blurred vision","vn":"Mờ mắt người già","fr":"Vision trouble liée à l’âge","zh":"老年性视物模糊","cat":"","pts":[["UB18","Ganshu",""],["DU4","Mingmen",""],["LI1","Shangyang",""],["SJ20","Jiaosun",""]]},{"id":304,"en":"Low back pain, spinal pain","vn":"Đau lưng, đau cột sống","fr":"Douleur lombaire et rachidienne","zh":"腰痛、脊柱痛","cat":"","pts":[["UB18","Ganshu",""]]},{"id":305,"en":"Watery eyes, swollen eyes, blurred vision","vn":"Nhèm mắt, sưng mắt, hoa mắt","fr":"Larmoiement, yeux enflés, vision floue","zh":"流泪、眼肿、视物模糊","cat":"","pts":[["UB18","Ganshu",""],["KI7","Fuliu",""],["SI1","Shaoze",""]]},{"id":306,"en":"Gastritis","vn":"Viêm dạ dày","fr":"Gastrite","zh":"胃炎","cat":"","pts":[["UB18","Ganshu",""]]},{"id":307,"en":"Nosebleed","vn":"Chảy máu cam","fr":"Saignement de nez","zh":"鼻出血","cat":"","pts":[["DU15","Yamen",""],["UB18","Ganshu",""],["HT6","Yinxi",""],["DU15","Yamen",""],["SI3","Houxi",""],["ST44","Neiting",""]]},{"id":308,"en":"Trachoma","vn":"Mắt hột","fr":"Trachome","zh":"沙眼","cat":"","pts":[["UB18","Ganshu",""],["UB40","Weizhong",""]]},{"id":309,"en":"Eye disorders","vn":"Các bệnh về mắt","fr":"Affections oculaires","zh":"眼科疾病","cat":"","pts":[["UB18","Ganshu",""],["ST36","Zusanli",""],["LU11","Shaoshang",""],["ST8","Touwei",""],["DU20","Baihui",""]]},{"id":310,"en":"Cirrhosis","vn":"Xơ gan","fr":"Cirrhose","zh":"肝硬化","cat":"","pts":[["UB18","Ganshu",""],["KI7","Fuliu",""],["UB20","Pishu",""],["REN9","Shuifen",""],["GB34","Yanglingquan",""],["UB23","Shenshu",""],["UB16","Dushu",""],["ST36","Zusanli",""],["LV14","Qimen",""],["KI9","Zhubin",""],["SP10","Xuehai",""],["SP6","Sanwinjiao",""]]},{"id":311,"en":"Tendon pain and contraction","vn":"Gân đau co rút","fr":"Douleur tendineuse avec contraction","zh":"筋痛伴拘急","cat":"","pts":[["UB18","Ganshu",""],["GB34","Yanglingquan",""]]},{"id":312,"en":"Tracheitis, hepatitis, cholecystitis","vn":"Viêm khí quản, viêm gan, túi mật","fr":"Trachéite, hépatite, cholécystite","zh":"气管炎、肝炎、胆囊炎","cat":"","pts":[]},{"id":313,"en":"Weakness, consumption","vn":"Suy nhược, lao","fr":"Faiblesse, consomption","zh":"虚弱、虚劳","cat":"","pts":[["UB43","Gaohuangshu",""],["UB13","Feishu",""],["UB23","Shenshu",""],["UB42","Pohu",""],["ST36","Zusanli",""]]},{"id":314,"en":"Asthma","vn":"Suyễn","fr":"Asthme","zh":"哮喘","cat":"","pts":[["UB43","Gaohuangshu",""],["UB11","Dashu",""],["REN22","Tiantu",""],["REN22","Tiantu",""],["REN22","Tiantu",""],["DU14","Dazhui",""],["ST40","Fenglong",""],["PC6","Neiguan",""],["ST36","Zusanli",""],["ST40","Fenglong",""]]},{"id":315,"en":"Asthma","vn":"Suyễn","fr":"Asthme","zh":"哮喘","cat":"","pts":[["UB43","Gaohuangshu",""],["UB11","Dashu",""],["REN22","Tiantu",""],["REN22","Tiantu",""],["REN22","Tiantu",""],["DU14","Dazhui",""],["ST40","Fenglong",""],["PC6","Neiguan",""],["ST36","Zusanli",""],["ST40","Fenglong",""]]},{"id":316,"en":"Chronic constitutional weakness","vn":"Cơ thể suy yếu (mãn tính)","fr":"Faiblesse constitutionnelle chronique","zh":"体质长期虚弱","cat":"","pts":[["UB43","Gaohuangshu",""],["REN4","Guanyan",""],["ST36","Zusanli",""]]},{"id":317,"en":"Yin deficiency with weakened upright qi","vn":"Âm hư, chính khí suy","fr":"Vide de Yin avec affaiblissement du Qi correct","zh":"阴虚正气弱","cat":"","pts":[["UB43","Gaohuangshu",""],["REN4","Guanyan",""],["ST36","Zusanli",""]]},{"id":318,"en":"Yang deficiency with deep, thin, faint, scattered pulse","vn":"Dương hư, mạch trầm, tế, vi, hoãng","fr":"Vide de Yang avec pouls profond, fin, faible, dispersé","zh":"阳虚，脉沉细微散","cat":"","pts":[["UB43","Gaohuangshu",""]]},{"id":319,"en":"Diarrhea, bloating, abdominal pain, acid regurgitation","vn":"Ỉa chảy, sình bụng, đau bụng, thừa vị toan","fr":"Diarrhée, ballonnement, douleur abdominale, reflux acide","zh":"腹泻、腹胀、腹痛、胃酸过多","cat":"","pts":[]},{"id":320,"en":"Lethargy, drowsiness","vn":"Lừ đừ, thích ngủ","fr":"Léthargie, somnolence","zh":"嗜睡、困倦","cat":"","pts":[["SP1","Yin Bai",""],["ST45","Lidui",""],["ST45","Lidui",""],["LV1","Dadun",""],["LV1","Dadun",""]]},{"id":321,"en":"Cold hands and feet","vn":"Lạnh tay chân","fr":"Mains et pieds froids","zh":"手脚冰冷","cat":"","pts":[["SP1","Yin Bai",""],["SP2","Dadu",""],["ST45","Lidui",""],["HT3","Shaohai",""]]},{"id":322,"en":"Blood disorders, dizziness","vn":"Tất cả bệnh về huyết, chóng mặt","fr":"Troubles sanguins, vertiges","zh":"血病、头晕","cat":"","pts":[["UB17","Geshu",""]]},{"id":323,"en":"Blurred vision, dizziness","vn":"Hoa mắt, chóng mặt","fr":"Vision floue, vertiges","zh":"视物模糊、头晕","cat":"","pts":[["DU8","Jinsuo",""],["DU20","Baihui",""],["LV3","Taichong",""]]},{"id":324,"en":"Spinal stiffness, lumbar stiffness","vn":"Đau cứng cột sống, thắt lưng","fr":"Raideur de la colonne et des lombes","zh":"脊柱僵硬、腰部僵硬","cat":"","pts":[["UB30","Baihuanshu",""],["DU8","Jinsuo",""],["UB28","Pangguanshu",""],["SJ3","Zhongzhu",""],["GB34","Yanglingquan",""]]},{"id":325,"en":"Convulsions","vn":"Co giật","fr":"Convulsions","zh":"抽搐","cat":"","pts":[["DU8","Jinsuo",""],["LV3","Taichong",""],["LI4","Hegu",""]]},{"id":326,"en":"Poor vision, blurred vision","vn":"Mắt kém, mờ","fr":"Mauvaise vision, vision floue","zh":"视力差、视物模糊","cat":"","pts":[["UB47","Hunmen",""],["UB1","Jingming",""],["LI4","Hegu",""],["GB20","Fengchi",""],["LV3","Taichong",""],["UB18","Ganshu",""]]},{"id":327,"en":"Sexual weakness, impotence","vn":"Suy nhược sinh dục, liệt dương","fr":"Faiblesse sexuelle, impuissance","zh":"性功能弱、阳痿","cat":"","pts":[["LV12","Jimai",""],["DU4","Mingmen",""]]},{"id":328,"en":"Hydrocele","vn":"Sưng dịch hoàn","fr":"Hydrocèle","zh":"鞘膜积液","cat":"","pts":[["LV12","Jimai",""],["LV1","Dadun",""],["REN4","Guanyan",""]]},{"id":329,"en":"Rheumatism","vn":"Thấp khớp","fr":"Rhumatisme","zh":"风湿","cat":"","pts":[["LV3","Taichong",""]]},{"id":330,"en":"Rheumatism of the upper limbs","vn":"Thấp khớp trên tay","fr":"Rhumatisme des membres supérieurs","zh":"上肢风湿","cat":"","pts":[["LV3","Taichong",""],["REN18","Yutang",""]]},{"id":331,"en":"Low back pain, insomnia","vn":"Đau lưng, mất ngủ","fr":"Lombalgie et insomnie","zh":"腰痛、失眠","cat":"","pts":[["KI3","Taizi",""]]},{"id":332,"en":"Wind‑damp","vn":"Phong thấp","fr":"Vent‑humidité","zh":"风湿","cat":"","pts":[["UB28","Pangguanshu",""],["ST31","Biquan",""],["UB28","Pangguanshu",""]]},{"id":333,"en":"Weak upright qi; raising upright qi","vn":"Chính khí yếu, nâng chính khí","fr":"Qi correct faible; tonifier et élever le Qi","zh":"正气虚弱，扶正升阳","cat":"","pts":[]},{"id":334,"en":"Sneezing","vn":"Hắt xì","fr":"Éternuements","zh":"打喷嚏","cat":"","pts":[]},{"id":335,"en":"Runny nose","vn":"Chảy mũi","fr":"Nez qui coule","zh":"流鼻涕","cat":"","pts":[]},{"id":336,"en":"Runny nose","vn":"Sổ mũi","fr":"Écoulement nasal","zh":"流涕","cat":"","pts":[]},{"id":337,"en":"Nasal congestion","vn":"Nghẹt mũi","fr":"Congestion nasale","zh":"鼻塞","cat":"","pts":[]},{"id":338,"en":"Arm pain","vn":"Đau cánh tay","fr":"Douleur du bras","zh":"手臂疼痛","cat":"","pts":[["LI11","Quchi",""],["SI2","Qiangu",""],["LI10","Shousanli",""],["LI4","Hegu",""],["LI15","Jianyu",""],["LI11","Quchi",""],["LI14","Binao",""],["PC3","Quze",""],["LU9","Taiyuan",""]]},{"id":339,"en":"Elbow pain","vn":"Đau khuỷu tay","fr":"Douleur du coude","zh":"肘部疼痛","cat":"","pts":[["LI11","Quchi",""],["SJ2","Yemen",""],["SI2","Qiangu",""],["LI5","Yangxi",""],["PC7","Daling",""],["HT7","Shenmen",""],["PC3","Quze",""]]},{"id":340,"en":"Wrist pain","vn":"Đau cổ tay","fr":"Douleur du poignet","zh":"手腕疼痛","cat":"","pts":[["LI11","Quchi",""],["LI6","Pianli",""],["PC7","Daling",""],["HT7","Shenmen",""]]},{"id":341,"en":"Hand pain","vn":"Đau bàn tay","fr":"Douleur de la main","zh":"手部疼痛","cat":"","pts":[["LI3","Sanjian",""],["PC7","Daling",""],["HT7","Shenmen",""],["PC8","Laogong",""]]},{"id":342,"en":"Finger pain","vn":"Đau ngón tay","fr":"Douleur des doigts","zh":"手指疼痛","cat":"","pts":[]},{"id":343,"en":"Irregular heartbeat","vn":"Tim đập không đều","fr":"Rythme cardiaque irrégulier","zh":"心律不齐","cat":"","pts":[["HT9","Shaochong",""],["LV3","Taichong",""]]},{"id":344,"en":"Blood not ascending to the head","vn":"Máu không lên đầu","fr":"Le sang ne monte pas à la tête","zh":"血不上头","cat":"","pts":[["HT3","Shaohai",""]]},{"id":345,"en":"Loss of voice due to fright","vn":"Mất tiếng vì quá sợ","fr":"Perte de voix due à la frayeur","zh":"因惊吓失声","cat":"","pts":[["HT5","Tongli",""],["HT4","Lingdao",""]]},{"id":346,"en":"Itchy eyes","vn":"Mắt ngứa","fr":"Yeux qui démangent","zh":"眼睛发痒","cat":"","pts":[["GB38","Yanglu",""]]},{"id":347,"en":"Acne","vn":"Mụn trứng cá","fr":"Acné","zh":"痤疮","cat":"","pts":[["LI4","Hegu",""],["LI1","Shangyang",""],["UB40","Weizhong",""],["LV8","Ququan",""]]},{"id":348,"en":"Aggressive temperament","vn":"Tính hung hăng","fr":"Tempérament agressif","zh":"性情暴躁","cat":"","pts":[["GB20","Fengchi",""],["GB38","Yanglu",""]]},{"id":349,"en":"Weight loss","vn":"Sụt cân","fr":"Perte de poids","zh":"体重下降","cat":"","pts":[["DU19","Houding",""],["SP6","Sanwinjiao",""],["KI7","Fuliu",""],["SJ10","Tianjing",""],["ST45","Lidui",""],["ST36","Zusanli",""],["REN17","Shanzhong",""],["LV1","Dadun",""],["LV2","Xinglian",""],["LV3","Taichong",""]]},{"id":350,"en":"Anxiety, restlessness, depression","vn":"Lo âu, bồn chồn, trầm cảm","fr":"Anxiété, agitation, dépression","zh":"焦虑、烦躁、抑郁","cat":"","pts":[["HT9","Shaochong",""],["DU19","Houding",""],["PC6","Neiguan",""],["SJ10","Tianjing",""],["ST36","Zusanli",""],["REN17","Shanzhong",""],["REN12","Zhongwan",""],["REN15","Jiuwei",""],["LV3","Taichong",""]]},{"id":351,"en":"Cervical spondylosis","vn":"Thoái hóa đốt sống cổ","fr":"Spondylose cervicale","zh":"颈椎病","cat":"","pts":[["SI3","Houxi",""],["SJ5","Waiguan",""],["LU7","Lieque",""],["GB20","Fengchi",""],["GB21","Jiangjing",""]]},{"id":352,"en":"Asthma","vn":"Hen suyễn","fr":"Asthme","zh":"哮喘","cat":"","pts":[["LI4","Hegu",""],["LU5","Chize",""],["LU7","Lieque",""],["LV8","Ququan",""],["HT9","Shaochong",""],["REN17","Shanzhong",""],["LV3","Taichong",""]]},{"id":353,"en":"Bloating, abdominal distention","vn":"Đầy hơi, chướng bụng","fr":"Ballonnements, distension abdominale","zh":"腹胀、肠胃胀气","cat":"","pts":[["SP9","Yinlingquan",""],["SJ5","Waiguan",""],["GB41","Linqi",""],["LV8","Ququan",""],["ST25","Tianshu",""],["REN12","Zhongwan",""]]},{"id":354,"en":"Mouth disorders (oral ulcers, glossitis)","vn":"Miệng (viêm loét miệng, viêm lưỡi)","fr":"Affections buccales (aphtes, glossite)","zh":"口腔疾病（口疮、舌炎）","cat":"","pts":[["LI4","Hegu",""],["LI3","Sanjian",""],["SP5","Shangqiu",""],["KI6","Zhaohai",""],["SP5","Shangqiu",""],["KI6","Zhaohai",""],["DU19","Houding",""]]},{"id":355,"en":"Chronic bronchitis","vn":"Viêm phế quản mãn tính","fr":"Bronchite chronique","zh":"慢性支气管炎","cat":"","pts":[["REN22","Tiantu",""],["REN17","Shanzhong",""],["REN19","Zigong",""],["LU5","Chize",""],["LU7","Lieque",""],["LU9","Taiyuan",""],["LI4","Hegu",""],["GB13","Benshen",""],["ST36","Zusanli",""]]},{"id":356,"en":"Cellulitis / peau d’orange","vn":"Viêm mô tế bào / Sần vỏ cam","fr":"Cellulite / peau d’orange","zh":"蜂窝组织炎 / 橘皮样皮肤","cat":"","pts":[["ST36","Zusanli",""],["REN15","Jiuwei",""],["REN9","Shuifen",""],["LV3","Taichong",""],["ST45","Lidui",""]]},{"id":357,"en":"Hair loss","vn":"Rụng tóc","fr":"Perte de cheveux","zh":"脱发","cat":"","pts":[["UB40","Weizhong",""],["ST36","Zusanli",""],["REN15","Jiuwei",""],["DU20","Baihui",""]]},{"id":358,"en":"Colitis","vn":"Viêm đại tràng","fr":"Colite","zh":"结肠炎","cat":"","pts":[["ST36","Zusanli",""],["LI9","Shanglian",""],["SP9","Yinlingquan",""],["UB60","Kunlun",""],["SP5","Shangqiu",""],["KI6","Zhaohai",""]]},{"id":359,"en":"Poor concentration","vn":"Thiếu tập trung","fr":"Manque de concentration","zh":"注意力不集中","cat":"","pts":[["SP2","Dadu",""],["SP6","Sanwinjiao",""]]},{"id":360,"en":"Constipation (infrequent stools)","vn":"Táo bón (đi ngoài ít)","fr":"Constipation (selles peu fréquentes)","zh":"便秘（排便少）","cat":"","pts":[["UB20","Pishu",""],["LI11","Quchi",""],["LI4","Hegu",""],["UB38","Fuxi",""],["LV1","Dadun",""]]},{"id":361,"en":"Constipation (small/pellet stools)","vn":"Táo bón (phân nhỏ/vón cục)","fr":"Constipation (selles petites/déshydratées)","zh":"便秘（羊屎状小便）","cat":"","pts":[["ST36","Zusanli",""],["PC6","Neiguan",""],["LI3","Sanjian",""],["LI2","Erjian",""]]},{"id":362,"en":"Elbow pain (tennis elbow)","vn":"Đau khuỷu tay (Tennis Elbow)","fr":"Douleur du coude (tennis elbow)","zh":"肱骨外上髁炎（网球肘）","cat":"","pts":[["LI11","Quchi",""],["LI1","Shangyang",""],["LU9","Taiyuan",""]]},{"id":363,"en":"Common cold / flu","vn":"Cảm lạnh - cảm cúm","fr":"Rhume / grippe","zh":"感冒 / 流感","cat":"","pts":[["GB21","Jiangjing",""],["DU14","Dazhui",""],["UB13","Feishu",""],["LI4","Hegu",""],["ST36","Zusanli",""]]},{"id":364,"en":"Courage / fortitude","vn":"Sự can đảm / Dũng khí","fr":"Courage / force morale","zh":"勇气、胆量","cat":"","pts":[["KI1","Yongquan",""],["LI4","Hegu",""],["ST36","Zusanli",""],["SJ3","Zhongzhu",""],["SJ5","Waiguan",""]]},{"id":365,"en":"Hip osteoarthritis (hip pain)","vn":"Thoái hóa khớp háng","fr":"Arthrose de la hanche","zh":"髋关节骨关节炎","cat":"","pts":[["GB30","Huantiao",""],["GB40","Qiuxu",""],["UB64","Jinggu",""],["GB34","Yanglingquan",""],["GB38","Yanglu",""]]},{"id":366,"en":"Calf cramps","vn":"Chuột rút bắp chân","fr":"Crampe du mollet","zh":"小腿抽筋","cat":"","pts":[["UB56","Chengjin",""],["UB57","Chengshan",""],["UB58","Feiyang",""],["SJ5","Waiguan",""],["UB63","Jinmen",""]]},{"id":367,"en":"Femoral nerve pain","vn":"Đau dây thần kinh đùi","fr":"Douleur du nerf fémoral","zh":"股神经痛","cat":"","pts":[["SP1","Yin Bai",""],["SP2","Dadu",""],["SP3","Taibai",""],["SP4","Gongsun",""],["GB41","Linqi",""],["SJ5","Waiguan",""]]},{"id":368,"en":"Cystitis (urinary tract infection)","vn":"Viêm bàng quang","fr":"Cystite (infection urinaire)","zh":"膀胱炎（尿路感染）","cat":"","pts":[["REN3","Zhongji",""],["KI2","Rangu",""],["KI3","Taizi",""],["LV2","Xinglian",""],["ST36","Zusanli",""]]},{"id":369,"en":"Toothache","vn":"Đau răng","fr":"Mal de dents","zh":"牙痛","cat":"","pts":[["LI11","Quchi",""],["LI4","Hegu",""],["LU7","Lieque",""],["ST44","Neiting",""]]},{"id":370,"en":"Diarrhea","vn":"Tiêu chảy","fr":"Diarrhée","zh":"腹泻","cat":"","pts":[["REN5","Shimen",""],["REN12","Zhongwan",""],["ST25","Tianshu",""],["SP4","Gongsun",""],["KI7","Fuliu",""]]},{"id":371,"en":"Digestion issues","vn":"Tiêu hóa","fr":"Troubles digestifs","zh":"消化不良","cat":"","pts":[["ST41","Jiexi",""],["REN12","Zhongwan",""],["ST36","Zusanli",""],["LV3","Taichong",""],["SP3","Taibai",""]]},{"id":372,"en":"Thumb base osteoarthritis","vn":"Thoái hóa khớp gốc ngón cái","fr":"Arthrose de la base du pouce","zh":"拇指根部关节炎","cat":"","pts":[["SJ5","Waiguan",""],["PC6","Neiguan",""],["LI7","Wenliu",""],["LU11","Shaoshang",""],["LU10","Yuji",""]]},{"id":373,"en":"Upper or mid‑back pain","vn":"Đau lưng trên/giữa","fr":"Douleur du haut ou milieu du dos","zh":"上背或中背疼痛","cat":"","pts":[["SJ5","Waiguan",""],["SJ3","Zhongzhu",""],["UB40","Weizhong",""]]},{"id":374,"en":"Eczema","vn":"Chàm","fr":"Eczéma","zh":"湿疹","cat":"","pts":[["LV8","Ququan",""],["GB38","Yanglu",""],["UB40","Weizhong",""],["LI11","Quchi",""],["SP10","Xuehai",""]]},{"id":375,"en":"Shyness, timidity","vn":"Sự rụt rè / Nhút nhát","fr":"Timidité, réserve","zh":"害羞、胆怯","cat":"","pts":[["PC6","Neiguan",""],["PC5","Jianshi",""],["HT3","Shaohai",""]]},{"id":376,"en":"Ankle sprain","vn":"Bong gân cổ chân","fr":"Entorse de la cheville","zh":"踝关节扭伤","cat":"","pts":[["UB60","Kunlun",""],["SP5","Shangqiu",""],["KI6","Zhaohai",""],["SP5","Shangqiu",""],["KI6","Zhaohai",""],["KI3","Taizi",""],["SP6","Sanwinjiao",""]]},{"id":377,"en":"Bedwetting","vn":"Đái dầm","fr":"Énurésie","zh":"遗尿","cat":"","pts":[["LV9","Yibao",""],["ST36","Zusanli",""],["REN3","Zhongji",""],["SP6","Sanwinjiao",""],["REN7","Yinjiao",""],["REN6","Quihai",""],["REN4","Guanyan",""],["KI2","Rangu",""]]},{"id":378,"en":"Shoulder periarthritis","vn":"Viêm quanh khớp vai","fr":"Périarthrite scapulaire","zh":"肩周炎","cat":"","pts":[["GB41","Linqi",""],["LI11","Quchi",""],["SJ5","Waiguan",""],["GB21","Jiangjing",""],["LI15","Jianyu",""]]},{"id":379,"en":"Heartburn, gastric burning","vn":"Ợ nóng / Rát dạ dày","fr":"Brûlures d’estomac","zh":"胃灼热、反酸","cat":"","pts":[["REN12","Zhongwan",""],["ST36","Zusanli",""],["ST45","Lidui",""],["LU7","Lieque",""]]},{"id":380,"en":"Fatigue reduction, restoring vitality","vn":"Giảm mệt mỏi / Phục hồi sức lực","fr":"Réduction de la fatigue, restauration de la vitalité","zh":"减轻疲劳、恢复元气","cat":"","pts":[["ST36","Zusanli",""],["DU19","Houding",""],["LU9","Taiyuan",""],["REN6","Quihai",""],["KI1","Yongquan",""]]},{"id":381,"en":"Liver dysfunction","vn":"Rối loạn chức năng gan","fr":"Dysfonction hépatique","zh":"肝功能失调","cat":"","pts":[["LV3","Taichong",""],["LV2","Xinglian",""],["LV14","Qimen",""],["LV8","Ququan",""]]},{"id":382,"en":"Knee pain","vn":"Đau đầu gối","fr":"Douleur du genou","zh":"膝痛","cat":"","pts":[["SJ5","Waiguan",""],["GB34","Yanglingquan",""],["LV8","Ququan",""],["SP9","Yinlingquan",""],["SP5","Shangqiu",""],["KI6","Zhaohai",""],["UB40","Weizhong",""]]},{"id":383,"en":"Sore throat","vn":"Đau họng","fr":"Mal de gorge","zh":"咽喉痛","cat":"","pts":[["LI4","Hegu",""],["LU11","Shaoshang",""],["LI3","Sanjian",""],["LU7","Lieque",""]]},{"id":384,"en":"Hallux valgus","vn":"Vẹo ngón chân cái","fr":"Hallux valgus","zh":"拇外翻","cat":"","pts":[["SP2","Dadu",""],["SP4","Gongsun",""],["SP5","Shangqiu",""],["KI6","Zhaohai",""],["LV2","Xinglian",""],["LV3","Taichong",""],["LV8","Ququan",""],["KI10","Yingu",""]]},{"id":385,"en":"Hemorrhoids","vn":"Bệnh trĩ","fr":"Hémorroïdes","zh":"痔疮","cat":"","pts":[["GB38","Yanglu",""],["DU1","Chiangqiang",""],["SP5","Shangqiu",""],["KI6","Zhaohai",""],["GB34","Yanglingquan",""],["UB40","Weizhong",""]]},{"id":386,"en":"Herpes","vn":"Mụn rộp","fr":"Herpès","zh":"疱疹","cat":"","pts":[["UB40","Weizhong",""],["LI4","Hegu",""],["LI15","Jianyu",""],["PC6","Neiguan",""],["SP5","Shangqiu",""],["KI6","Zhaohai",""]]},{"id":387,"en":"High blood pressure","vn":"Cao huyết áp","fr":"Hypertension","zh":"高血压","cat":"","pts":[["PC7","Daling",""],["HT7","Shenmen",""],["KI2","Rangu",""],["LU9","Taiyuan",""],["REN6","Quihai",""],["HT9","Shaochong",""],["ST36","Zusanli",""],["KI7","Fuliu",""],["LV3","Taichong",""],["LI11","Quchi",""]]},{"id":388,"en":"Insomnia","vn":"Mất ngủ","fr":"Insomnie","zh":"失眠","cat":"","pts":[["UB60","Kunlun",""],["SP5","Shangqiu",""],["KI6","Zhaohai",""],["SP5","Shangqiu",""],["KI6","Zhaohai",""],["LU9","Taiyuan",""],["DU19","Houding",""],["SJ10","Tianjing",""]]},{"id":389,"en":"Cold feet, varicose veins","vn":"Lạnh chân tay, suy giãn tĩnh mạch","fr":"Pieds froids, varices","zh":"手脚冰冷、静脉曲张","cat":"","pts":[["ST32","Futu",""],["ST36","Zusanli",""],["GB38","Yanglu",""],["UB58","Feiyang",""],["SP6","Sanwinjiao",""],["SP5","Shangqiu",""],["KI6","Zhaohai",""],["LV1","Dadun",""],["LV2","Xinglian",""],["LV3","Taichong",""]]},{"id":390,"en":"Low back pain, sciatica","vn":"Đau thắt lưng, thần kinh tọa","fr":"Lombalgie, sciatique","zh":"腰痛、坐骨神经痛","cat":"","pts":[["UB40","Weizhong",""],["UB60","Kunlun",""],["SP5","Shangqiu",""],["KI6","Zhaohai",""],["SJ5","Waiguan",""],["UB31","Shangliao",""]]},{"id":391,"en":"Memory issues","vn":"Trí nhớ","fr":"Troubles de la mémoire","zh":"记忆力问题","cat":"","pts":[["DU19","Houding",""],["PC6","Neiguan",""],["KI1","Yongquan",""],["SJ3","Zhongzhu",""],["SP2","Dadu",""]]},{"id":392,"en":"Nausea (motion sickness)","vn":"Buồn nôn (say tàu xe)","fr":"Nausées (mal des transports)","zh":"恶心（晕车晕船）","cat":"","pts":[["REN12","Zhongwan",""],["REN15","Jiuwei",""],["GB40","Qiuxu",""],["SP5","Shangqiu",""],["KI6","Zhaohai",""],["ST36","Zusanli",""]]},{"id":393,"en":"Anxiety, nervous tension","vn":"Lo lắng / Căng thẳng thần kinh","fr":"Anxiété, tension nerveuse","zh":"焦虑、神经紧张","cat":"","pts":[["DU19","Houding",""],["ST36","Zusanli",""],["REN15","Jiuwei",""],["LV3","Taichong",""],["HT9","Shaochong",""]]},{"id":394,"en":"Facial nerve pain","vn":"Đau dây thần kinh mặt","fr":"Névralgie faciale","zh":"面神经痛","cat":"","pts":[["LU9","Taiyuan",""],["HT3","Shaohai",""],["LI11","Quchi",""],["SJ23","Sizhukong",""]]},{"id":395,"en":"Nasal congestion, sinusitis, rhinitis","vn":"Nghẹt mũi, viêm xoang, viêm mũi","fr":"Congestion nasale, sinusite, rhinite","zh":"鼻塞、鼻窦炎、鼻炎","cat":"","pts":[["LI20","Yingxiang",""],["SJ22","Heliao",""],["GB1","Tongziliao",""],["UB1","Jingming",""],["EP1","Yintang",""],["SJ5","Waiguan",""],["LI4","Hegu",""],["LV8","Ququan",""],["LU7","Lieque",""]]},{"id":396,"en":"Rapid heartbeat, palpitations","vn":"Tim đập nhanh / Hồi hộp","fr":"Tachycardie, palpitations","zh":"心跳加速、心悸","cat":"","pts":[["PC6","Neiguan",""],["HT9","Shaochong",""],["LU7","Lieque",""]]},{"id":397,"en":"Puffy eyes","vn":"Bọng mắt","fr":"Poches sous les yeux","zh":"眼袋、眼部浮肿","cat":"","pts":[["ST19","Burong",""],["GB1","Tongziliao",""],["UB1","Jingming",""],["SJ23","Sizhukong",""]]},{"id":398,"en":"Wrist–hand pain (medial)","vn":"Cổ tay–bàn tay (mặt trong)","fr":"Douleur poignet‑main (interne)","zh":"腕手内侧疼痛","cat":"","pts":[["PC6","Neiguan",""],["PC3","Quze",""],["LU5","Chize",""],["HT8","Shaofu",""],["PC8","Laogong",""]]},{"id":399,"en":"Wrist–hand pain (lateral)","vn":"Cổ tay–bàn tay (mặt ngoài)","fr":"Douleur poignet‑main (externe)","zh":"腕手外侧疼痛","cat":"","pts":[["LI4","Hegu",""],["SJ3","Zhongzhu",""],["SJ5","Waiguan",""],["PC6","Neiguan",""]]},{"id":400,"en":"Polyarthritis","vn":"Viêm đa khớp","fr":"Polyarthrite","zh":"多关节炎","cat":"","pts":[["SJ5","Waiguan",""],["GB41","Linqi",""],["SP5","Shangqiu",""],["KI6","Zhaohai",""],["UB63","Jinmen",""]]},{"id":401,"en":"Impotence, frigidity","vn":"Liệt dương – lãnh cảm","fr":"Impuissance, frigidité","zh":"阳痿、性冷淡","cat":"","pts":[["REN6","Quihai",""],["UB43","Gaohuangshu",""],["SP6","Sanwinjiao",""],["HT9","Shaochong",""],["LV8","Ququan",""]]},{"id":402,"en":"Prostate disorders","vn":"Tuyến tiền liệt","fr":"Troubles de la prostate","zh":"前列腺疾病","cat":"","pts":[["KI7","Fuliu",""],["KI8","Jiaoxin",""],["LU7","Lieque",""],["REN4","Guanyan",""]]},{"id":403,"en":"Psoriasis","vn":"Vảy nến","fr":"Psoriasis","zh":"银屑病","cat":"","pts":[["REN12","Zhongwan",""],["LI4","Hegu",""],["LI11","Quchi",""],["UB40","Weizhong",""],["SP6","Sanwinjiao",""]]},{"id":404,"en":"Menstrual pain","vn":"Đau bụng kinh","fr":"Douleur menstruelle","zh":"痛经","cat":"","pts":[["SP6","Sanwinjiao",""],["UB60","Kunlun",""],["UB64","Jinggu",""],["ST28","Shuidao",""]]},{"id":405,"en":"Diffuse skin redness","vn":"Đỏ da lan tỏa","fr":"Rougeur cutanée diffuse","zh":"皮肤弥漫性发红","cat":"","pts":[["DU20","Baihui",""],["LI7","Wenliu",""]]},{"id":406,"en":"Sciatica","vn":"Đau thần kinh tọa","fr":"Sciatique","zh":"坐骨神经痛","cat":"","pts":[["UB40","Weizhong",""],["UB60","Kunlun",""],["SP5","Shangqiu",""],["KI6","Zhaohai",""],["UB58","Feiyang",""],["GB37","Guangminh",""]]},{"id":407,"en":"Lower abdominal spasm","vn":"Co thắt bụng dưới","fr":"Spasme du bas‑ventre","zh":"下腹部痉挛","cat":"","pts":[["SP9","Yinlingquan",""],["KI3","Taizi",""],["REN4","Guanyan",""]]},{"id":408,"en":"Hypocalcemia / muscle spasm","vn":"Hạ canxi huyết / Co thắt cơ","fr":"Hypocalcémie / spasme musculaire","zh":"低钙血症 / 肌肉痉挛","cat":"","pts":[["PC6","Neiguan",""],["SP4","Gongsun",""],["LI7","Wenliu",""],["SP5","Shangqiu",""],["KI6","Zhaohai",""],["REN6","Quihai",""]]},{"id":409,"en":"Smoking cessation","vn":"Cai thuốc lá","fr":"Sevrage tabagique","zh":"戒烟","cat":"","pts":[["GB8","Shuaigu",""],["LI20","Yingxiang",""],["ST36","Zusanli",""]]},{"id":410,"en":"Headache (frontal region and…)","vn":"Đau đầu (vùng trán và…)","fr":"Céphalée (frontale et…)","zh":"头痛（前额部等）","cat":"","pts":[["ST36","Zusanli",""],["GB37","Guangminh",""],["LI11","Quchi",""]]},{"id":411,"en":"Migraine above the eye","vn":"Đau nửa đầu trên mắt","fr":"Migraine au‑dessus de l’œil","zh":"眼上偏头痛","cat":"","pts":[["LI4","Hegu",""],["SJ3","Zhongzhu",""],["ST36","Zusanli",""],["LU7","Lieque",""],["GB38","Yanglu",""],["SP9","Yinlingquan",""],["GB41","Linqi",""],["LV3","Taichong",""]]},{"id":412,"en":"Occipital headache, stiff neck","vn":"Đau đầu vùng gáy, vẹo cổ","fr":"Céphalée occipitale, torticolis","zh":"枕部头痛、颈项强直","cat":"","pts":[["LI3","Sanjian",""],["SJ5","Waiguan",""],["LU7","Lieque",""],["GB20","Fengchi",""],["DU21","Qianding",""]]},{"id":413,"en":"Vision improvement","vn":"Cải thiện thị lực","fr":"Amélioration de la vision","zh":"改善视力","cat":"","pts":[["LI3","Sanjian",""],["ST36","Zusanli",""],["LV8","Ququan",""],["DU19","Houding",""],["LV3","Taichong",""]]},{"id":414,"en":"Facial tightening","vn":"Căng da mặt","fr":"Raffermissement du visage","zh":"面部紧致","cat":"","pts":[["EP1","Yintang",""],["GB1","Tongziliao",""],["ST7","Xiaguan",""],["REN10","Xiawan",""],["ST4","Dicang",""],["UB14","Jueyinshu",""],["GB14","Yangbai",""],["REN24","Chengjiang",""],["SI18","Quanlia",""],["ST6","Jiache",""],["ST5","Daying",""],["LI20","Yingxiang",""]]},{"id":415,"en":"Herpes zoster","vn":"Zona thần kinh","fr":"Zona (herpès zoster)","zh":"带状疱疹","cat":"","pts":[["GB34","Yanglingquan",""],["UB60","Kunlun",""],["LV13","Zhangmen",""],["GB25","Jingmen",""],["LV5","Ligou",""],["SP6","Sanwinjiao",""],["KI7","Fuliu",""],["UB40","Weizhong",""],["SP1","Yin Bai",""],["GB43","Xiaxi",""],["GB44","Qiaoyin",""]]},{"id":416,"en":"Tinnitus, sore throat, finger numbness, eye pain","vn":"Ù tai, đau họng, tê ngón tay, đau mắt","fr":"Acouphènes, mal de gorge, doigts engourdis, douleur oculaire","zh":"耳鸣、咽痛、手指麻木、眼痛","cat":"","pts":[["SI2","Qiangu",""]]},{"id":417,"en":"Mastitis, painful urination with heat","vn":"Viêm tuyến vú, đái nóng đỏ","fr":"Mastite, mictions brûlantes","zh":"乳腺炎、小便灼热疼痛","cat":"","pts":[["SI2","Qiangu",""]]},{"id":418,"en":"Arm pain","vn":"Đau cánh tay","fr":"Douleur du bras","zh":"手臂疼痛","cat":"","pts":[["LI11","Quchi",""],["SI2","Qiangu",""],["LI10","Shousanli",""],["LI4","Hegu",""],["LI15","Jianyu",""],["LI11","Quchi",""],["LI14","Binao",""],["PC3","Quze",""],["LU9","Taiyuan",""]]},{"id":419,"en":"Little finger numbness","vn":"Tê ngón tay út","fr":"Engourdissement du petit doigt","zh":"小指麻木","cat":"","pts":[["SI2","Qiangu",""],["SJ5","Waiguan",""],["SI5","Yanggu",""]]},{"id":420,"en":"Arm cannot be lifted, neck–shoulder pain","vn":"Cánh tay không nâng lên được, đau cổ gáy","fr":"Bras impossible à lever, douleur cou‑épaule","zh":"手臂无法抬起，颈肩疼痛","cat":"","pts":[["SI2","Qiangu",""],["SI3","Houxi",""]]},{"id":421,"en":"Elbow joint pain, ulnar nerve pain","vn":"Đau khớp khuỷ, đau thần kinh trụ","fr":"Douleur du coude, douleur du nerf ulnaire","zh":"肘关节痛、尺神经痛","cat":"","pts":[["SI8","Xiaohai",""],["HT4","Lingdao",""],["HT3","Shaohai",""],["LI11","Quchi",""]]},{"id":422,"en":"Schizophrenia","vn":"Tâm thần phân liệt","fr":"Schizophrénie","zh":"精神分裂症","cat":"","pts":[["SI8","Xiaohai",""],["SI2","Qiangu",""],["DU14","Dazhui",""],["DU26","Renzhong",""],["SI3","Houxi",""],["LI11","Quchi",""],["DU14","Dazhui",""],["DU20","Baihui",""],["DU13","Taodao",""],["ST41","Jiexi",""],["UB63","Jinmen",""],["UB62","Shenmai",""]]},{"id":423,"en":"Low back pain, constipation, enuresis, seminal emission","vn":"Đau thắt lưng, bón, đái dầm, di tinh","fr":"Lombalgie, constipation, énurésie, émission séminale","zh":"腰痛、便秘、遗尿、遗精","cat":"","pts":[["UB27","Xiaochangshu",""],["LV9","Yibao",""],["REN3","Zhongji",""],["SP6","Sanwinjiao",""]]},{"id":424,"en":"Eye disorders","vn":"Các chứng bệnh thuộc mắt","fr":"Affections oculaires","zh":"眼科疾病","cat":"","pts":[["UB1","Jingming",""],["LU10","Yuji",""]]},{"id":425,"en":"Red trachoma","vn":"Mắt hột đỏ","fr":"Trachome rouge","zh":"红色沙眼","cat":"","pts":[["UB1","Jingming",""],["LV2","Xinglian",""]]},{"id":426,"en":"Glaucoma","vn":"Glocom","fr":"Glaucome","zh":"青光眼","cat":"","pts":[["UB1","Jingming",""],["UB20","Pishu",""],["LV3","Taichong",""]]},{"id":427,"en":"Dizziness from blood deficiency","vn":"Chóng mặt vì huyết hư","fr":"Vertiges par déficience sanguine","zh":"血虚头晕","cat":"","pts":[["DU22","Xinhui",""],["SJ6","Zhigou",""],["SP10","Xuehai",""],["SP6","Sanwinjiao",""]]},{"id":428,"en":"Myopia, tearing, blurred vision","vn":"Cận thị, chảy nước mắt, mờ mắt","fr":"Myopie, larmoiement, vision floue","zh":"近视、流泪、视物模糊","cat":"","pts":[["UB2","Sanzhu",""],["LV3","Taichong",""]]},{"id":429,"en":"Raising yang, rescuing collapse, clearing heat","vn":"Thăng dương, cứu nghịch, thanh nhiệt","fr":"Élever le Yang, sauver le collapsus, clarifier la chaleur","zh":"升阳、回阳救逆、清热","cat":"","pts":[["DU25","Sulia",""],["PC6","Neiguan",""]]},{"id":430,"en":"Mutism, deafness, tinnitus, headache, shoulder–back pain","vn":"Câm điếc, ù tai, điếc, nhức đầu, đau vai lưng","fr":"Mutisme, surdité, acouphènes, céphalée, douleur épaule‑dos","zh":"哑、聋、耳鸣、头痛、肩背痛","cat":"","pts":[["SJ3","Zhongzhu",""]]},{"id":431,"en":"Five fingers unable to move","vn":"Năm ngón tay không cử động được","fr":"Cinq doigts immobiles","zh":"五指不能活动","cat":"","pts":[["SJ3","Zhongzhu",""]]},{"id":432,"en":"Cataract","vn":"Cataract","fr":"Cataracte","zh":"白内障","cat":"","pts":[["SI1","Shaoze",""]]},{"id":433,"en":"Seminal emission, enuresis, urinary retention, impotence, sciatic pain","vn":"Di tinh, đái dầm, bí đái, liệt dương, đau dây thần kinh hông","fr":"Émission séminale, énurésie, rétention urinaire, impuissance, douleur sciatique","zh":"遗精、遗尿、尿闭、阳痿、坐骨神经痛","cat":"","pts":[["REN3","Zhongji",""]]},{"id":434,"en":"Frequent urination","vn":"Tiểu nhiều lần","fr":"Mictions fréquentes","zh":"小便频繁","cat":"","pts":[["REN3","Zhongji",""],["SP9","Yinlingquan",""],["UB23","Shenshu",""]]},{"id":435,"en":"Tinnitus","vn":"Ù tai","fr":"Acouphènes","zh":"耳鸣","cat":"","pts":[["DU20","Baihui",""],["GB4","Hanyan",""],["UB23","Shenshu",""],["DU20","Baihui",""],["SI2","Qiangu",""],["SI3","Houxi",""],["HT5","Tongli",""],["SI19","Tinggong",""],["LI1","Shangyang",""],["SI5","Yanggu",""]]},{"id":436,"en":"Abdominal distention","vn":"Bụng trướng","fr":"Distension abdominale","zh":"腹胀","cat":"","pts":[["SP1","Yin Bai",""],["ST41","Jiexi",""],["SP1","Yin Bai",""],["UB20","Pishu",""],["SP10","Xuehai",""],["ST25","Tianshu",""],["UB21","Weishu",""],["SP5","Shangqiu",""],["KI6","Zhaohai",""],["UB20","Pishu",""],["ST36","Zusanli",""],["UB21","Weishu",""],["ST25","Tianshu",""],["ST36","Zusanli",""],["REN7","Yinjiao",""]]},{"id":437,"en":"Muscle cramps","vn":"Vọp bẻ","fr":"Crampe musculaire","zh":"肌肉痉挛","cat":"","pts":[["ST41","Jiexi",""]]},{"id":438,"en":"Sore throat, neck pain with limited movement","vn":"Yết hầu viêm, cổ đau không cử động được","fr":"Gorge enflammée, douleur cervicale avec mobilité réduite","zh":"咽喉炎、颈痛活动受限","cat":"","pts":[["SI1","Shaoze",""],["SI2","Qiangu",""],["LV4","Zhongfeng",""]]},{"id":439,"en":"Cold–heat, wind‑stroke, unconsciousness","vn":"Nóng lạnh, trúng phong, bất tỉnh","fr":"Froid‑chaleur, coup de vent, inconscience","zh":"寒热、风中风、昏迷","cat":"","pts":[["SI1","Shaoze",""]]},{"id":440,"en":"Childhood epilepsy","vn":"Trẻ nhỏ động kinh","fr":"Épilepsie infantile","zh":"小儿癫痫","cat":"","pts":[["SI1","Shaoze",""],["UB60","Kunlun",""],["SJ23","Sizhukong",""],["DU20","Baihui",""]]},{"id":441,"en":"Hemiplegia","vn":"Bán thân bất toại","fr":"Hémiplégie","zh":"偏瘫","cat":"","pts":[["SI1","Shaoze",""]]},{"id":442,"en":"No breast milk, insufficient lactation","vn":"Không sữa, thiếu sữa","fr":"Agalactie, lactation insuffisante","zh":"无乳、乳汁不足","cat":"","pts":[["SI1","Shaoze",""],["SI2","Qiangu",""]]},{"id":443,"en":"Hot eyes","vn":"Mắt nóng","fr":"Chaleur oculaire","zh":"眼热","cat":"","pts":[["SI1","Shaoze",""],["UB18","Ganshu",""],["LV2","Xinglian",""],["SI2","Qiangu",""]]},{"id":444,"en":"Red eyes, hot inner canthus","vn":"Mắt đỏ, khóe mắt nóng","fr":"Yeux rouges, chaleur au canthus interne","zh":"眼红、内眦发热","cat":"","pts":[["SI3","Houxi",""],["LV2","Xinglian",""],["SI5","Yanggu",""]]},{"id":445,"en":"High fever without sweating","vn":"Sốt cao, không ra mồ hôi","fr":"Fièvre élevée sans sueur","zh":"高热无汗","cat":"","pts":[["SI1","Shaoze",""],["SI2","Qiangu",""],["SI5","Yanggu",""]]},{"id":446,"en":"Heart pain, hand tremor","vn":"Đau tim, rung tay","fr":"Douleur cardiaque, tremblements des mains","zh":"心痛、手抖","cat":"","pts":[["HT3","Shaohai",""],["SI8","Xiaohai",""],["ST33","Yinshi",""],["ST33","Yinshi",""],["SI3","Houxi",""]]},{"id":447,"en":"Nervous exhaustion from excessive mental work","vn":"Thần kinh suy vì làm việc trí não quá nhiều","fr":"Épuisement nerveux par surcharge mentale","zh":"过度用脑导致神经衰弱","cat":"","pts":[["HT3","Shaohai",""],["SI3","Houxi",""]]},{"id":448,"en":"Anterior arm numbness and pain","vn":"Tê đau cánh tay trước","fr":"Engourdissement et douleur du bras antérieur","zh":"上臂前侧麻痛","cat":"","pts":[["SI2","Qiangu",""],["LI4","Hegu",""],["LI11","Quchi",""],["SJ5","Waiguan",""]]},{"id":449,"en":"Little finger numbness, difficulty flexing","vn":"Tê ngón tay út, co duỗi khó","fr":"Engourdissement du petit doigt, flexion difficile","zh":"小指麻木、屈伸困难","cat":"","pts":[["SI2","Qiangu",""],["SJ5","Waiguan",""],["SI5","Yanggu",""],["SI3","Houxi",""]]},{"id":450,"en":"Elbow, wrist, neck pain, dizziness","vn":"Khớp khuỷu, cổ tay, gáy, cổ, hoa mắt","fr":"Douleur coude‑poignet‑nuque, vertiges","zh":"肘、腕、颈项疼痛伴头晕","cat":"","pts":[["SI2","Qiangu",""],["SI3","Houxi",""]]},{"id":451,"en":"Arm cannot lift, shoulder pain","vn":"Tay không nâng lên được, đau vai","fr":"Bras impossible à lever, douleur d’épaule","zh":"手臂不能抬起、肩痛","cat":"","pts":[["SI2","Qiangu",""],["SJ4","Yangchi",""]]},{"id":452,"en":"Cough with chest fullness","vn":"Ho làm đầy tức ngực","fr":"Toux avec oppression thoracique","zh":"咳嗽伴胸闷","cat":"","pts":[["SI2","Qiangu",""]]},{"id":453,"en":"Night sweating","vn":"Mồ hôi trộm","fr":"Sueurs nocturnes","zh":"盗汗","cat":"","pts":[["SI3","Houxi",""],["HT6","Yinxi",""]]},{"id":454,"en":"Epilepsy","vn":"Động kinh","fr":"Épilepsie","zh":"癫痫","cat":"","pts":[["SI3","Houxi",""]]},{"id":455,"en":"Madness, memory loss","vn":"Điên, mất trí","fr":"Folie, perte de mémoire","zh":"癫狂、失忆","cat":"","pts":[["SI3","Houxi",""],["DU14","Dazhui",""],["PC5","Jianshi",""],["DU20","Baihui",""],["ST40","Fenglong",""]]},{"id":456,"en":"Alternate‑day malaria","vn":"Sốt rét cách ngày","fr":"Paludisme intermittent","zh":"隔日疟","cat":"","pts":[["SI3","Houxi",""],["PC5","Jianshi",""],["DU14","Dazhui",""]]},{"id":457,"en":"Headache, blurred vision","vn":"Nhức đầu, hoa mắt","fr":"Céphalée, vision floue","zh":"头痛、视物模糊","cat":"","pts":[["SI3","Houxi",""],["GB20","Fengchi",""],["DU20","Baihui",""]]},{"id":458,"en":"Hip, thigh, ankle pain","vn":"Đau hông, đùi, cổ chân","fr":"Douleur hanche‑cuisse‑cheville","zh":"髋、腿、踝疼痛","cat":"","pts":[["SI3","Houxi",""]]},{"id":459,"en":"Neck, arm, back, ear aching","vn":"Cổ, tay, lưng, tai nhức mỏi","fr":"Douleur cou‑bras‑dos‑oreille","zh":"颈、臂、背、耳酸痛","cat":"","pts":[["SI3","Houxi",""],["UB62","Shenmai",""]]},{"id":460,"en":"Jaundice","vn":"Vàng da","fr":"Ictère","zh":"黄疸","cat":"","pts":[["SI3","Houxi",""],["PC8","Laogong",""]]},{"id":461,"en":"Post‑typhoid jaundice","vn":"Vàng da sau thương hàn","fr":"Ictère post‑typhoïde","zh":"伤寒后黄疸","cat":"","pts":[["UB62","Shenmai",""],["KI1","Yongquan",""]]},{"id":462,"en":"Diabetes","vn":"Đái đường","fr":"Diabète","zh":"糖尿病","cat":"","pts":[["UB21","Weishu",""],["UB20","Pishu",""],["ST36","Zusanli",""]]},{"id":463,"en":"Gastritis, cholecystitis","vn":"Viêm dạ dày, viêm túi mật","fr":"Gastrite, cholécystite","zh":"胃炎、胆囊炎","cat":"","pts":[]},{"id":464,"en":"Low back and thigh pain","vn":"Đau thắt lưng, đùi","fr":"Douleur lombaire et cuisse","zh":"腰腿痛","cat":"","pts":[]},{"id":465,"en":"Constipation, restlessness, fearfulness","vn":"Bón, tâm bồn chồn, sợ sệt","fr":"Constipation, agitation, peur","zh":"便秘、心烦、易惊","cat":"","pts":[]},{"id":466,"en":"Clearing blood heat, draining heat, relaxing sinews","vn":"Thanh huyết, tiết nhiệt, thư cân thông lạc","fr":"Clarifier la chaleur du sang, drainer la chaleur, détendre les tendons","zh":"清血热、泻热、舒筋通络","cat":"","pts":[["UB40","Weizhong",""]]},{"id":467,"en":"Dispelling wind‑damp","vn":"Đuổi phong thấp","fr":"Chasser vent‑humidité","zh":"祛风湿","cat":"","pts":[["UB40","Weizhong",""],["ST40","Fenglong",""]]},{"id":468,"en":"Detoxification, heatstroke, enteritis","vn":"Giải độc, trúng nắng, viêm ruột","fr":"Détoxification, coup de chaleur, entérite","zh":"解毒、中暑、肠炎","cat":"","pts":[["UB40","Weizhong",""]]},{"id":469,"en":"Low back pain","vn":"Trị đau lưng","fr":"Traitement de la lombalgie","zh":"治疗腰痛","cat":"","pts":[["UB40","Weizhong",""],["KI7","Fuliu",""]]},{"id":470,"en":"Knee pain, calf pain","vn":"Đau gối, đau bắp chân","fr":"Douleur genou‑mollet","zh":"膝痛、小腿痛","cat":"","pts":[["UB40","Weizhong",""],["SP6","Sanwinjiao",""],["ST36","Zusanli",""],["UB57","Chengshan",""]]},{"id":471,"en":"Low back pain","vn":"Đau thắt lưng","fr":"Douleur lombaire","zh":"腰痛","cat":"","pts":[["UB23","Shenshu",""],["UB40","Weizhong",""],["UB52","Zhishi",""],["UB23","Shenshu",""],["DU4","Mingmen",""],["UB60","Kunlun",""],["UB23","Shenshu",""],["UB40","Weizhong",""]]},{"id":472,"en":"Wind‑stroke","vn":"Trúng phong","fr":"Coup de vent (AVC énergétique)","zh":"中风","cat":"","pts":[["UB40","Weizhong",""],["LI4","Hegu",""]]},{"id":473,"en":"Lower limb paralysis","vn":"Liệt chi dưới","fr":"Paralysie des membres inférieurs","zh":"下肢瘫痪","cat":"","pts":[["UB40","Weizhong",""],["GB34","Yanglingquan",""],["GB39","Xuanzhong",""]]},{"id":474,"en":"Parotid gland inflammation","vn":"Viêm tuyến mang tai","fr":"Inflammation de la parotide","zh":"腮腺炎","cat":"","pts":[["SI5","Yanggu",""]]},{"id":475,"en":"Slowing aging, relaxing sinews, opening collaterals, brightening eyes","vn":"Chậm lão hóa, thư cân, thông lạc, sáng mắt","fr":"Ralentir le vieillissement, détendre les tendons, ouvrir les méridiens, éclaircir la vision","zh":"延缓衰老、舒筋通络、明目","cat":"","pts":[["SI6","Yanglao",""]]},{"id":476,"en":"Clearing heat, draining damp","vn":"Thanh nhiệt, lợi thấp","fr":"Clarifier la chaleur, éliminer l’humidité","zh":"清热、利湿","cat":"","pts":[["SI6","Yanglao",""]]},{"id":477,"en":"Finger, wrist, elbow disorders; eye disorders","vn":"Bệnh ngón tay, cổ tay, khuỷu; bệnh mắt","fr":"Troubles doigts‑poignet‑coude ; affections oculaires","zh":"手指、手腕、肘部疾病；眼病","cat":"","pts":[["SI6","Yanglao",""]]},{"id":478,"en":"Arm pain, shoulder pain as if breaking","vn":"Đau cánh tay, đau vai như muốn gãy","fr":"Douleur du bras et de l’épaule « comme cassée »","zh":"手臂痛、肩痛如折","cat":"","pts":[["SI6","Yanglao",""]]},{"id":479,"en":"Expelling pathogens in the Small Intestine channel","vn":"Tán tà ở kinh Tiểu Trường, đuổi phong khí","fr":"Expulser les agents pathogènes du méridien de l’Intestin Grêle","zh":"祛除小肠经邪气、祛风","cat":"","pts":[["SI8","Xiaohai",""]]},{"id":480,"en":"Elbow joint pain, ulnar nerve pain, shoulder muscle spasm","vn":"Đau khuỷu, đau thần kinh trụ, co rút cơ vai","fr":"Douleur du coude, nerf ulnaire, spasme musculaire de l’épaule","zh":"肘关节痛、尺神经痛、肩肌痉挛","cat":"","pts":[["SI8","Xiaohai",""],["HT3","Shaohai",""]]},{"id":481,"en":"Heart pain, cooling the blood","vn":"Tim đau, làm mát máu","fr":"Douleur cardiaque, rafraîchir le sang","zh":"心痛、凉血","cat":"","pts":[["SI8","Xiaohai",""]]},{"id":482,"en":"Abdominal obstruction","vn":"Bí kết trong bụng","fr":"Obstruction abdominale","zh":"腹中痞结","cat":"","pts":[["SJ6","Zhigou",""],["PC7","Daling",""],["HT7","Shenmen",""]]},{"id":483,"en":"Flank pain","vn":"Đau hông sườn","fr":"Douleur du flanc","zh":"胁痛","cat":"","pts":[["SJ6","Zhigou",""],["SJ6","Zhigou",""],["SJ6","Zhigou",""],["DU9","Zhiyang",""],["SJ6","Zhigou",""],["SJ5","Waiguan",""],["GB34","Yanglingquan",""],["PC5","Jianshi",""],["LI11","Quchi",""],["GB24","Riyue",""],["PC7","Daling",""],["HT7","Shenmen",""],["ST36","Zusanli",""],["SP3","Taibai",""],["GB40","Qiuxu",""],["GB38","Yanglu",""]]},{"id":484,"en":"Sharp flank–chest pain","vn":"Đau chói hông ngực","fr":"Douleur vive flanc‑thorax","zh":"胁胸刺痛","cat":"","pts":[["SJ6","Zhigou",""],["LV13","Zhangmen",""]]},{"id":485,"en":"Intercostal neuralgia","vn":"Đau thần kinh gian sườn","fr":"Névralgie intercostale","zh":"肋间神经痛","cat":"","pts":[["SJ6","Zhigou",""],["SP9","Yinlingquan",""]]},{"id":486,"en":"Gallstone pain","vn":"Đau sỏi mật","fr":"Douleur due aux calculs biliaires","zh":"胆结石痛","cat":"","pts":[["SJ6","Zhigou",""],["GB34","Yanglingquan",""]]},{"id":487,"en":"Chronic constipation","vn":"Bón kinh niên","fr":"Constipation chronique","zh":"慢性便秘","cat":"","pts":[["SJ6","Zhigou",""],["SJ6","Zhigou",""],["SP15","Daheng",""],["SP15","Daheng",""],["ST36","Zusanli",""],["ST25","Tianshu",""],["ST36","Zusanli",""],["ST37","Shangjuxu",""]]},{"id":488,"en":"Clearing the spirit, releasing exterior heat, dispelling pathogens","vn":"Thanh thần chí, giải biểu nhiệt, sơ tà","fr":"Clarifier l’esprit, libérer la chaleur externe, chasser les agents pathogènes","zh":"清神志、解表热、祛邪","cat":"","pts":[["SI7","Zhizheng",""]]},{"id":489,"en":"Fever without sweating, fright‑induced mania","vn":"Sốt không ra mồ hôi, điên kinh sợ","fr":"Fièvre sans sueur, agitation par frayeur","zh":"发热无汗、惊恐癫狂","cat":"","pts":[["SI7","Zhizheng",""]]},{"id":490,"en":"Elbow, arm, finger spasms with inability to grasp","vn":"Co rút khuỷu, cánh tay, ngón tay không bóp được","fr":"Spasmes du coude‑bras‑doigts, incapacité à saisir","zh":"肘、臂、指痉挛，不能握物","cat":"","pts":[["SI7","Zhizheng",""],["LI11","Quchi",""]]},{"id":491,"en":"Small warts between fingers, scaling deficiency disorder","vn":"Mụn cơm nhỏ ở khe tay, kết vảy hư chứng","fr":"Petites verrues inter‑digitales, desquamation par vide","zh":"指缝小疣、脱屑虚证","cat":"","pts":[["SI7","Zhizheng",""]]},{"id":492,"en":"Dizziness, blurred vision, headache","vn":"Chóng mặt hoa mắt, hoa mắt đau đầu","fr":"Vertiges, vision floue, céphalée","zh":"头晕、视物模糊、头痛","cat":"","pts":[["SI7","Zhizheng",""],["SI7","Zhizheng",""],["UB22","Sanjiaoshu",""]]},{"id":493,"en":"Wind‑damp; fear, sadness, mania","vn":"Phong thấp; kinh sợ buồn rầu, điên cuồng","fr":"Vent‑humidité; peur, tristesse, manie","zh":"风湿；惊恐、悲伤、狂躁","cat":"","pts":[["SI7","Zhizheng",""]]},{"id":494,"en":"Emotional stagnation, weakness from excessive anger","vn":"Thất tình uất ức, suy nhược do nhiều tức giận","fr":"Stagnation émotionnelle, faiblesse due à la colère","zh":"情志郁结、怒伤致虚弱","cat":"","pts":[["SI7","Zhizheng",""]]},{"id":495,"en":"Excessive sexual desire, masturbation","vn":"Nhiều dâm dục, thủ dâm","fr":"Désir sexuel excessif, masturbation","zh":"淫欲过度、手淫","cat":"","pts":[["SI7","Zhizheng",""]]},{"id":496,"en":"Shortness of breath","vn":"Khí ngắn, hụt hơi","fr":"Essoufflement","zh":"气短、呼吸不足","cat":"","pts":[["REN20","Huagai",""]]},{"id":497,"en":"Chest pain","vn":"Đau tim ngực","fr":"Douleur thoracique","zh":"胸痛","cat":"","pts":[]},{"id":498,"en":"Asthma","vn":"Suyễn","fr":"Asthme","zh":"哮喘","cat":"","pts":[["UB43","Gaohuangshu",""],["UB11","Dashu",""],["REN22","Tiantu",""],["REN22","Tiantu",""],["REN22","Tiantu",""],["DU14","Dazhui",""],["ST40","Fenglong",""],["PC6","Neiguan",""],["ST36","Zusanli",""],["ST40","Fenglong",""]]},{"id":499,"en":"No breast milk","vn":"Không có sữa","fr":"Absence de lait","zh":"无乳","cat":"","pts":[["SI1","Shaoze",""]]},{"id":500,"en":"Breast nodules","vn":"Nhọt ở vú","fr":"Nodules mammaires","zh":"乳房结节","cat":"","pts":[["PC7","Daling",""],["HT7","Shenmen",""],["SI1","Shaoze",""]]},{"id":501,"en":"Muscle contraction causing the body to bend","vn":"Co rút uốn cong người","fr":"Contraction musculaire courbant le corps","zh":"肌肉痉挛致身体弯曲","cat":"","pts":[["DU15","Yamen",""],["DU16","Fengfu",""]]},{"id":502,"en":"Tongue difficulty speaking, slow speech, impaired articulation","vn":"Lưỡi khó phát âm, chậm, khó nói","fr":"Langue difficile à bouger, parole lente","zh":"舌强难言、言语迟缓","cat":"","pts":[["DU15","Yamen",""]]},{"id":503,"en":"Cognitive impairment from brain injury sequelae","vn":"Khờ do di chứng tổn thương não","fr":"Déficit cognitif post‑traumatique","zh":"脑损伤后遗致智力低下","cat":"","pts":[["DU15","Yamen",""],["DU26","Renzhong",""],["ST36","Zusanli",""],["KI4","Dazhong",""]]},{"id":504,"en":"Mutism and deafness","vn":"Câm điếc","fr":"Mutisme et surdité","zh":"哑聋","cat":"","pts":[["DU15","Yamen",""],["REN23","Lianquan",""],["SJ21","Ermen",""],["SJ17","Yifeng",""],["LI4","Hegu",""]]},{"id":505,"en":"Underdeveloped brain function","vn":"Não kém phát triển","fr":"Fonction cérébrale sous‑développée","zh":"脑功能发育不良","cat":"","pts":[["DU15","Yamen",""],["DU14","Dazhui",""],["PC6","Neiguan",""],["ST36","Zusanli",""]]},{"id":506,"en":"Stiff neck","vn":"Cứng cổ gáy","fr":"Raideur de la nuque","zh":"颈项强直","cat":"","pts":[["DU15","Yamen",""]]},{"id":507,"en":"Uncontrolled nosebleed","vn":"Chảy máu cam không cầm","fr":"Épistaxis incontrôlable","zh":"鼻血不止","cat":"","pts":[["DU23","Shangxing",""],["DU15","Yamen",""],["DU15","Yamen",""],["ST44","Neiting",""],["ST36","Zusanli",""]]},{"id":508,"en":"Emergency revival, restoring yang","vn":"Cấp cứu, hồi dương","fr":"Réanimation, restauration du Yang","zh":"急救回阳","cat":"","pts":[["DU15","Yamen",""]]},{"id":509,"en":"Hiccups","vn":"Nấc cụt","fr":"Hoquet","zh":"呃逆","cat":"","pts":[["LV14","Qimen",""],["PC6","Neiguan",""],["ST36","Zusanli",""],["REN22","Tiantu",""],["LV13","Zhangmen",""],["UB46","Geguan",""],["SI6","Yanglao",""]]},{"id":510,"en":"Insomnia, calming the spirit","vn":"Mất ngủ, an thần","fr":"Insomnie, apaisement du Shen","zh":"失眠、安神","cat":"","pts":[["PC6","Neiguan",""],["SP6","Sanwinjiao",""]]},{"id":511,"en":"Dizziness","vn":"Chóng mặt","fr":"Vertiges","zh":"头晕","cat":"","pts":[["LI11","Quchi",""],["ST40","Fenglong",""]]},{"id":512,"en":"Schizophrenia","vn":"Tâm thần phân liệt","fr":"Schizophrénie","zh":"精神分裂症","cat":"","pts":[["SI8","Xiaohai",""],["SI2","Qiangu",""],["DU14","Dazhui",""],["DU26","Renzhong",""],["SI3","Houxi",""],["LI11","Quchi",""],["DU14","Dazhui",""],["DU20","Baihui",""],["DU13","Taodao",""],["ST41","Jiexi",""],["UB63","Jinmen",""],["UB62","Shenmai",""]]},{"id":513,"en":"Hemorrhoids, rectal prolapse","vn":"Trĩ, sa trực tràng","fr":"Hémorroïdes, prolapsus rectal","zh":"痔疮、直肠脱垂","cat":"","pts":[["DU20","Baihui",""],["REN15","Jiuwei",""],["DU1","Chiangqiang",""],["UB57","Chengshan",""],["UB30","Baihuanshu",""]]},{"id":514,"en":"Forgetfulness, tinnitus, blurred vision, palpitations, insomnia","vn":"Hay quên, ù tai, hoa mắt, hồi hộp, mất ngủ","fr":"Oublis, acouphènes, vision floue, palpitations, insomnie","zh":"健忘、耳鸣、视物模糊、心悸、失眠","cat":"","pts":[["DU20","Baihui",""]]},{"id":515,"en":"Epilepsy","vn":"Động kinh","fr":"Épilepsie","zh":"癫痫","cat":"","pts":[["UB61","Pushen",""],["DU20","Baihui",""],["DU26","Renzhong",""],["ST41","Jiexi",""]]},{"id":516,"en":"Tinnitus","vn":"Ù tai","fr":"Acouphènes","zh":"耳鸣","cat":"","pts":[["DU20","Baihui",""],["GB4","Hanyan",""],["UB23","Shenshu",""],["DU20","Baihui",""],["SI2","Qiangu",""],["SI3","Houxi",""],["HT5","Tongli",""],["SI19","Tinggong",""],["LI1","Shangyang",""],["SI5","Yanggu",""]]},{"id":517,"en":"Persistent runny nose","vn":"Chảy nước mũi không cầm","fr":"Rhinorrhée persistante","zh":"流鼻涕不停","cat":"","pts":[["DU20","Baihui",""],["DU23","Shangxing",""],["UB7","Tongtian",""],["UB12","Fengmen",""]]},{"id":518,"en":"Night crying in children","vn":"Trẻ con khóc đêm","fr":"Cris nocturnes chez l’enfant","zh":"小儿夜啼","cat":"","pts":[["DU20","Baihui",""],["UB20","Pishu",""]]},{"id":519,"en":"Syncope, fainting","vn":"Kích ngất, xỉu","fr":"Syncope, évanouissement","zh":"晕厥、昏倒","cat":"","pts":[["DU20","Baihui",""],["EP1","Yintang",""],["DU26","Renzhong",""],["PC6","Neiguan",""]]},{"id":520,"en":"Headache","vn":"Nhức đầu","fr":"Céphalée","zh":"头痛","cat":"","pts":[["DU20","Baihui",""],["EP1","Yintang",""],["LI4","Hegu",""]]},{"id":521,"en":"Circulatory collapse, weak pulse","vn":"Trụy mạch, mạch thấp","fr":"Collapsus circulatoire, pouls faible","zh":"循环衰竭、脉微弱","cat":"","pts":[["DU20","Baihui",""],["DU26","Renzhong",""]]},{"id":522,"en":"High fever with convulsions","vn":"Sốt cao, co giật","fr":"Fièvre élevée avec convulsions","zh":"高热惊厥","cat":"","pts":[["DU20","Baihui",""]]},{"id":523,"en":"Qi deficiency","vn":"Khí hư","fr":"Vide de Qi","zh":"气虚","cat":"","pts":[["DU20","Baihui",""],["REN6","Quihai",""]]},{"id":524,"en":"Wind‑damp, itching, hives, genital sores","vn":"Phong thấp, ngứa, nổi mề đay, lở hạ bộ","fr":"Vent‑humidité, démangeaisons, urticaire, lésions génitales","zh":"风湿、瘙痒、荨麻疹、下部疮疡","cat":"","pts":[]},{"id":525,"en":"Lumbar spine stiffness with cold sensation","vn":"Đau cứng cột sống thắt lưng, lạnh","fr":"Raideur lombaire avec sensation de froid","zh":"腰椎僵硬伴寒感","cat":"","pts":[["UB30","Baihuanshu",""]]},{"id":526,"en":"Numbness of hands and feet","vn":"Tay chân mất cảm giác","fr":"Engourdissement des mains et pieds","zh":"手足麻木","cat":"","pts":[["UB30","Baihuanshu",""]]},{"id":527,"en":"Constipation and urinary retention","vn":"Đại tiểu tiện không thông","fr":"Constipation et rétention urinaire","zh":"大便秘结、小便不利","cat":"","pts":[["UB30","Baihuanshu",""]]},{"id":528,"en":"Gallbladder cold, fearfulness, nightmares","vn":"Đởm hàn, kinh sợ, mơ thấy ma quỷ","fr":"Froid de la vésicule biliaire, frayeur, cauchemars","zh":"胆寒、易惊、多恶梦","cat":"","pts":[["UB30","Baihuanshu",""],["UB15","Xinshu",""]]},{"id":529,"en":"Finger numbness, tonsillitis, toothache","vn":"Tê ngón tay, amidan, đau răng","fr":"Engourdissement des doigts, amygdalite, mal de dents","zh":"手指麻木、扁桃体炎、牙痛","cat":"","pts":[]},{"id":530,"en":"Coccyx pain, low back pain","vn":"Đau xương cụt, đau lưng","fr":"Douleur du coccyx, lombalgie","zh":"尾骨痛、腰痛","cat":"","pts":[]},{"id":531,"en":"Lumbosacral nerve pain","vn":"Đau thần kinh thắt lưng‑cùng","fr":"Névralgie lombo‑sacrée","zh":"腰骶神经痛","cat":"","pts":[]},{"id":532,"en":"Urinary tract disease, cystitis","vn":"Bệnh đường tiểu, viêm bàng quang","fr":"Maladie urinaire, cystite","zh":"泌尿道病、膀胱炎","cat":"","pts":[["UB23","Shenshu",""],["REN3","Zhongji",""],["SP6","Sanwinjiao",""]]},{"id":533,"en":"Enuresis, constipation, diarrhea, endometritis","vn":"Đái dầm, bón, ỉa chảy, viêm nội mạc tử cung","fr":"Énurésie, constipation, diarrhée, endométrite","zh":"遗尿、便秘、腹泻、子宫内膜炎","cat":"","pts":[]},{"id":534,"en":"Urinary retention or incontinence","vn":"Bí tiểu hoặc tiểu không tự chủ","fr":"Rétention ou incontinence urinaire","zh":"小便不通或失禁","cat":"","pts":[["UB53","Baohuang",""],["UB54","Zhidian",""],["REN4","Guanyan",""],["SP6","Sanwinjiao",""]]},{"id":535,"en":"Lumbar spine pain, abdominal rigidity, intestinal rumbling","vn":"Đau cột sống thắt lưng, bụng co cứng, sôi ruột","fr":"Douleur lombaire, abdomen tendu, borborygmes","zh":"腰椎痛、腹部拘急、肠鸣","cat":"","pts":[["UB53","Baohuang",""]]},{"id":536,"en":"Frequent urination, difficult urination, urinary retention, swollen lower limbs","vn":"Tiểu rắt, tiểu khó, bí tiểu, sưng húp hạ chi","fr":"Mictions fréquentes/difficiles, rétention, œdème des jambes","zh":"小便频急、困难、尿闭、下肢肿胀","cat":"","pts":[["UB53","Baohuang",""]]},{"id":537,"en":"Blood deficiency, anemia","vn":"Bần huyết, thiếu máu","fr":"Vide de sang, anémie","zh":"血虚、贫血","cat":"","pts":[]},{"id":538,"en":"Epilepsy, mania","vn":"Động kinh, điên","fr":"Épilepsie, manie","zh":"癫痫、狂躁","cat":"","pts":[]},{"id":539,"en":"Eye disorders","vn":"Bệnh ở mắt","fr":"Affections oculaires","zh":"眼病","cat":"","pts":[["SP6","Sanwinjiao",""],["SP2","Dadu",""],["UB62","Shenmai",""]]},{"id":540,"en":"Wind‑stroke, unconsciousness","vn":"Trúng phong, bất tỉnh","fr":"Coup de vent, inconscience","zh":"中风、昏迷","cat":"","pts":[["DU26","Renzhong",""],["DU20","Baihui",""]]},{"id":541,"en":"Heart pain, acid regurgitation","vn":"Đau tim, hay ợ chua","fr":"Douleur cardiaque, reflux acide","zh":"心痛、胃酸反流","cat":"","pts":[["ST19","Burong",""],["LV14","Qimen",""]]},{"id":542,"en":"Vomiting blood","vn":"Mửa ra máu","fr":"Hématémèse","zh":"吐血","cat":"","pts":[["ST19","Burong",""],["REN13","Sangwan",""],["PC7","Daling",""],["HT7","Shenmen",""]]},{"id":543,"en":"Stomach pain, abdominal fullness","vn":"Đau dạ dày, bụng căng đầy","fr":"Douleur gastrique, distension abdominale","zh":"胃痛、腹胀","cat":"","pts":[["ST19","Burong",""],["ST36","Zusanli",""],["PC6","Neiguan",""],["SP4","Gongsun",""]]},{"id":544,"en":"Chills, stiff neck","vn":"Ớn lạnh, cổ nhức đơ","fr":"Frissons, nuque raide","zh":"恶寒、颈项强痛","cat":"","pts":[["UB65","Shugu",""]]},{"id":545,"en":"Blurred vision","vn":"Mắt mờ","fr":"Vision floue","zh":"视物模糊","cat":"","pts":[["SI6","Yanglao",""]]},{"id":546,"en":"Headache, neck pain, back pain, spinal aching","vn":"Đầu nhức, cổ đau, lưng đau, xương sống nhức","fr":"Céphalée, douleur cervicale, dorsale, rachidienne","zh":"头痛、颈痛、背痛、脊柱酸痛","cat":"","pts":[]},{"id":547,"en":"Memory enhancement, high blood pressure","vn":"Tăng trí nhớ, huyết áp cao","fr":"Amélioration de la mémoire, hypertension","zh":"增强记忆、高血压","cat":"","pts":[]},{"id":548,"en":"Unilateral headache","vn":"Nhức đầu một bên","fr":"Céphalée unilatérale","zh":"偏头痛","cat":"","pts":[]},{"id":549,"en":"Achilles tendon contraction, limited movement","vn":"Gân sau gót co rút, đẩy qua lại không được","fr":"Contraction du tendon d’Achille, mobilité réduite","zh":"跟腱挛缩、活动受限","cat":"","pts":[["UB11","Dashu",""]]},{"id":550,"en":"Gas movement in intestines, sharp Small Intestine pain","vn":"Cục hơi chạy trong ruột, đau quặn ở tiểu trường","fr":"Gaz intestinaux mobiles, douleur aiguë de l’IG","zh":"肠内气走窜、小肠绞痛","cat":"","pts":[["UB11","Dashu",""],["DU1","Chiangqiang",""]]},{"id":551,"en":"Spinal inflammation from wind‑damp","vn":"Viêm cột sống do phong thấp","fr":"Inflammation rachidienne vent‑humidité","zh":"风湿性脊柱炎","cat":"","pts":[["UB11","Dashu",""],["DU12","Shenzhu",""],["DU9","Zhiyang",""],["DU8","Jinsuo",""],["DU3","Yaoyangguan",""],["GB33","Yangguan",""]]},{"id":552,"en":"Back pain","vn":"Đau cột sống lưng","fr":"Douleur dorsale","zh":"背部疼痛","cat":"","pts":[["UB11","Dashu",""],["DU14","Dazhui",""],["UB13","Feishu",""],["UB18","Ganshu",""],["UB15","Xinshu",""],["UB23","Shenshu",""]]},{"id":553,"en":"Common cold","vn":"Cảm mạo","fr":"Rhume","zh":"感冒","cat":"","pts":[["UB11","Dashu",""],["GB20","Fengchi",""],["UB12","Fengmen",""],["UB13","Feishu",""]]},{"id":554,"en":"Asthma","vn":"Suyễn","fr":"Asthme","zh":"哮喘","cat":"","pts":[["UB43","Gaohuangshu",""],["UB11","Dashu",""],["REN22","Tiantu",""],["REN22","Tiantu",""],["REN22","Tiantu",""],["DU14","Dazhui",""],["ST40","Fenglong",""],["PC6","Neiguan",""],["ST36","Zusanli",""],["ST40","Fenglong",""]]},{"id":555,"en":"Bilateral back stiffness","vn":"Đau cứng hai bên lưng","fr":"Raideur bilatérale du dos","zh":"两侧背部僵硬","cat":"","pts":[["UB11","Dashu",""],["UB46","Geguan",""],["REN9","Shuifen",""]]},{"id":556,"en":"Stiff neck, unable to flex or extend","vn":"Cổ gáy cứng đơ, không cúi ngửa được","fr":"Nuque raide, flexion/extension impossible","zh":"颈项强直、不能屈伸","cat":"","pts":[["UB11","Dashu",""],["UB64","Jinggu",""]]},{"id":557,"en":"Pneumonia","vn":"Viêm phổi","fr":"Pneumonie","zh":"肺炎","cat":"","pts":[["UB11","Dashu",""],["UB13","Feishu",""]]},{"id":558,"en":"Chest oppression","vn":"Uất ức trong ngực","fr":"Oppression thoracique","zh":"胸闷","cat":"","pts":[["UB11","Dashu",""],["UB15","Xinshu",""]]},{"id":559,"en":"Knee pain with limited flexion/extension","vn":"Đau đầu gối không co duỗi được","fr":"Douleur du genou, flexion/extension limitée","zh":"膝痛、屈伸受限","cat":"","pts":[["UB11","Dashu",""]]},{"id":560,"en":"Knee inflammation","vn":"Viêm đầu gối","fr":"Inflammation du genou","zh":"膝关节炎","cat":"","pts":[["SP9","Yinlingquan",""],["GB34","Yanglingquan",""],["KI10","Yingu",""],["LV9","Yibao",""],["ST33","Yinshi",""]]},{"id":561,"en":"Wind‑damp in thigh and knee, knee arthritis, lower‑limb paralysis","vn":"Phong thấp ở đùi gối, viêm khớp gối, liệt hạ chi","fr":"Vent‑humidité cuisse‑genou, arthrite du genou, paralysie des membres inférieurs","zh":"大腿膝部风湿、膝关节炎、下肢瘫痪","cat":"","pts":[]},{"id":562,"en":"Hamstring contraction, limited extension","vn":"Rút gân đầu gối không co duỗi được","fr":"Contraction des ischio‑jambiers, extension limitée","zh":"腘绳肌挛缩、伸展受限","cat":"","pts":[["UB40","Weizhong",""],["LV8","Ququan",""]]},{"id":563,"en":"Spinal and knee pain","vn":"Đau nhức cột sống, đầu gối","fr":"Douleur de la colonne et du genou","zh":"脊柱痛、膝痛","cat":"","pts":[["DU26","Renzhong",""],["DU26","Renzhong",""]]},{"id":564,"en":"Knee spasm and pain","vn":"Đầu gối rút đau","fr":"Spasme et douleur du genou","zh":"膝部痉挛疼痛","cat":"","pts":[["GB31","Fengshi",""],["GB31","Fengshi",""],["LV8","Ququan",""],["LV8","Ququan",""],["UB60","Kunlun",""],["UB60","Kunlun",""]]},{"id":565,"en":"Lateral knee pain","vn":"Đau đầu gối ngoài","fr":"Douleur latérale du genou","zh":"膝外侧痛","cat":"","pts":[["GB43","Xiaxi",""],["GB43","Xiaxi",""],["DU3","Yaoyangguan",""],["GB33","Yangguan",""],["DU3","Yaoyangguan",""],["GB33","Yangguan",""]]},{"id":566,"en":"Medial knee pain","vn":"Đau đầu gối trong","fr":"Douleur médiale du genou","zh":"膝内侧痛","cat":"","pts":[["LV7","Xiquan",""],["LV7","Xiquan",""],["LV3","Taichong",""],["LV4","Zhongfeng",""],["LV4","Zhongfeng",""]]},{"id":567,"en":"Irregular menstruation","vn":"Kinh nguyệt không đều","fr":"Menstruations irrégulières","zh":"月经不调","cat":"","pts":[["REN3","Zhongji",""],["LV9","Yibao",""],["SP6","Sanwinjiao",""],["UB23","Shenshu",""]]},{"id":568,"en":"Headache, dizziness, rhinitis, nasal congestion","vn":"Đau đầu, chóng mặt, viêm mũi, nghẹt mũi","fr":"Céphalée, vertiges, rhinite, congestion nasale","zh":"头痛、头晕、鼻炎、鼻塞","cat":"","pts":[["UB5","Wuchu",""]]},{"id":569,"en":"Sweating with chills","vn":"Mồ hôi ra, sốt lạnh","fr":"Transpiration avec frissons","zh":"汗出恶寒","cat":"","pts":[["UB5","Wuchu",""],["REN13","Sangwan",""]]},{"id":570,"en":"Abdominal pain from obstruction","vn":"Đau do bí kết trong bụng","fr":"Douleur abdominale par obstruction","zh":"腹中痞结作痛","cat":"","pts":[["SJ6","Zhigou",""],["SJ5","Waiguan",""],["PC7","Daling",""],["HT7","Shenmen",""]]},{"id":571,"en":"Sharp flank–chest pain","vn":"Đau nhói hông ngực","fr":"Douleur vive flanc‑thorax","zh":"胁胸刺痛","cat":"","pts":[["SJ6","Zhigou",""],["SJ5","Waiguan",""]]},{"id":572,"en":"Flank pain","vn":"Đau hông sườn","fr":"Douleur du flanc","zh":"胁痛","cat":"","pts":[["SJ6","Zhigou",""],["SJ6","Zhigou",""],["SJ6","Zhigou",""],["DU9","Zhiyang",""],["SJ6","Zhigou",""],["SJ5","Waiguan",""],["GB34","Yanglingquan",""],["PC5","Jianshi",""],["LI11","Quchi",""],["GB24","Riyue",""],["PC7","Daling",""],["HT7","Shenmen",""],["ST36","Zusanli",""],["SP3","Taibai",""],["GB40","Qiuxu",""],["GB38","Yanglu",""]]},{"id":573,"en":"Gallstone pain, intercostal neuralgia","vn":"Đau sỏi mật, đau thần kinh liên sườn","fr":"Douleur des calculs biliaires, névralgie intercostale","zh":"胆结石痛、肋间神经痛","cat":"","pts":[["SJ6","Zhigou",""],["GB34","Yanglingquan",""]]},{"id":574,"en":"Habitual constipation","vn":"Quen táo bón","fr":"Constipation habituelle","zh":"习惯性便秘","cat":"","pts":[["SJ6","Zhigou",""],["ST37","Shangjuxu",""]]},{"id":575,"en":"Frightened spirit, panic","vn":"Thần chí hoảng hốt","fr":"Esprit effrayé, panique","zh":"神志惊恐","cat":"","pts":[["SJ6","Zhigou",""],["DU20","Baihui",""],["SI7","Zhizheng",""]]},{"id":576,"en":"Neck unable to turn","vn":"Gáy không quay được","fr":"Cou incapable de tourner","zh":"颈项不能回转","cat":"","pts":[["SJ6","Zhigou",""]]},{"id":577,"en":"Clearing the spirit, releasing exterior heat, dispelling pathogens","vn":"Thanh thần khí, giải biểu nhiệt, sơ tà ở kinh","fr":"Clarifier l’esprit, libérer la chaleur externe, chasser les agents pathogènes","zh":"清神气、解表热、祛经中邪","cat":"","pts":[["SI7","Zhizheng",""]]},{"id":578,"en":"Arm pain, hand contraction, inability to grasp","vn":"Đau cánh tay, co tay, ngón tay không nắm được","fr":"Douleur du bras, contraction de la main, incapacité à saisir","zh":"臂痛、手挛、不能握物","cat":"","pts":[["SI7","Zhizheng",""]]},{"id":579,"en":"Neck swelling and pain, jaw pain, dizziness","vn":"Cổ gáy sưng đau, đau hàm, hoa mắt","fr":"Gonflement cervical, douleur de la mâchoire, vertiges","zh":"颈项肿痛、下颌痛、头晕","cat":"","pts":[["SI7","Zhizheng",""]]},{"id":580,"en":"Nervous exhaustion, fever without sweating, mania, fright","vn":"Suy nhược thần kinh, sốt không ra mồ hôi, điên, kinh sợ","fr":"Épuisement nerveux, fièvre sans sueur, agitation, frayeur","zh":"神经衰弱、无汗发热、狂躁、惊恐","cat":"","pts":[["SI7","Zhizheng",""]]},{"id":581,"en":"Heart region pain","vn":"Đau vùng tim","fr":"Douleur de la région cardiaque","zh":"心区痛","cat":"","pts":[["PC6","Neiguan",""],["SI7","Zhizheng",""],["SI7","Zhizheng",""],["PC6","Neiguan",""]]},{"id":582,"en":"Blurred vision, headache","vn":"Hoa mắt, đau đầu","fr":"Vision floue, céphalée","zh":"视物模糊、头痛","cat":"","pts":[["SI7","Zhizheng",""],["UB22","Sanjiaoshu",""]]},{"id":583,"en":"Fever with knee pain, stiff neck","vn":"Sốt, nhức gối, cứng cổ","fr":"Fièvre avec douleur du genou et nuque raide","zh":"发热伴膝痛、颈项强直","cat":"","pts":[["SI7","Zhizheng",""],["HT3","Shaohai",""]]},{"id":584,"en":"Constipation","vn":"Bí đại tiện","fr":"Constipation","zh":"便秘","cat":"","pts":[["SP3","Taibai",""],["LV13","Zhangmen",""]]},{"id":585,"en":"Soft abdominal masses","vn":"Mềm khối cục trong bụng","fr":"Masse abdominale molle","zh":"腹部软块","cat":"","pts":[["PC6","Neiguan",""]]},{"id":586,"en":"Ankle pain","vn":"Đau mắt cá chân","fr":"Douleur de la cheville","zh":"踝痛","cat":"","pts":[["UB62","Shenmai",""]]},{"id":587,"en":"Seven types of hernia disorders","vn":"Trị 7 thứ Sán","fr":"Sept types de hernies","zh":"七种疝气病","cat":"","pts":[["REN7","Yinjiao",""],["LV8","Ququan",""],["REN6","Quihai",""]]},{"id":588,"en":"Dry throat, mouth dryness, throat obstruction","vn":"Họng, miệng khô, bế tắc trong họng","fr":"Gorge sèche, bouche sèche, obstruction pharyngée","zh":"咽干、口燥、咽阻","cat":"","pts":[]},{"id":589,"en":"Irritability, nervous agitation, insomnia, lethargy","vn":"Buồn phiền, thần kinh không yên, mất ngủ, lừ đừ","fr":"Irritabilité, agitation nerveuse, insomnie, léthargie","zh":"烦躁、神经不安、失眠、嗜睡","cat":"","pts":[]},{"id":590,"en":"Swollen painful foot joints, hot soles","vn":"Sưng nhức khớp chân, nóng gan bàn chân","fr":"Articulations du pied enflées et douloureuses, plantes brûlantes","zh":"足关节肿痛、脚心发热","cat":"","pts":[]},{"id":591,"en":"Headache, pterygium, nasal congestion, nosebleed","vn":"Đau đầu, mộng thịt mắt, nghẹt mũi, chảy máu mũi","fr":"Céphalée, ptérygion, congestion nasale, épistaxis","zh":"头痛、胬肉、鼻塞、鼻出血","cat":"","pts":[]},{"id":592,"en":"Generalized itching","vn":"Đau ngứa khắp người","fr":"Démangeaisons généralisées","zh":"全身瘙痒","cat":"","pts":[]},{"id":593,"en":"Infectious hepatitis","vn":"Viêm gan do truyền nhiễm","fr":"Hépatite infectieuse","zh":"传染性肝炎","cat":"","pts":[["DU9","Zhiyang",""],["UB18","Ganshu",""],["UB20","Pishu",""],["ST36","Zusanli",""],["GB34","Yanglingquan",""]]},{"id":594,"en":"Irregular heartbeat","vn":"Nhịp tim không đều","fr":"Rythme cardiaque irrégulier","zh":"心律不齐","cat":"","pts":[["DU9","Zhiyang",""],["HT8","Shaofu",""],["PC6","Neiguan",""],["PC6","Neiguan",""],["PC7","Daling",""],["HT7","Shenmen",""]]},{"id":595,"en":"Stomach disorders","vn":"Bệnh thuộc dạ dày","fr":"Affections gastriques","zh":"胃病","cat":"","pts":[["DU9","Zhiyang",""],["PC6","Neiguan",""],["ST36","Zusanli",""],["REN12","Zhongwan",""]]},{"id":596,"en":"Cough with asthma","vn":"Ho suyễn","fr":"Toux avec asthme","zh":"咳嗽伴哮喘","cat":"","pts":[["DU9","Zhiyang",""],["REN22","Tiantu",""],["LU9","Taiyuan",""]]},{"id":597,"en":"Low back pain","vn":"Đau lưng thắt lưng","fr":"Douleur lombaire","zh":"腰背痛","cat":"","pts":[["DU9","Zhiyang",""],["SJ3","Zhongzhu",""]]},{"id":598,"en":"Flank pain","vn":"Đau hông sườn","fr":"Douleur du flanc","zh":"胁痛","cat":"","pts":[["SJ6","Zhigou",""],["SJ6","Zhigou",""],["SJ6","Zhigou",""],["DU9","Zhiyang",""],["SJ6","Zhigou",""],["SJ5","Waiguan",""],["GB34","Yanglingquan",""],["PC5","Jianshi",""],["LI11","Quchi",""],["GB24","Riyue",""],["PC7","Daling",""],["HT7","Shenmen",""],["ST36","Zusanli",""],["SP3","Taibai",""],["GB40","Qiuxu",""],["GB38","Yanglu",""]]},{"id":599,"en":"Kidney heat","vn":"Thận nhiệt","fr":"Chaleur du Rein","zh":"肾热","cat":"","pts":[["DU9","Zhiyang",""]]},{"id":600,"en":"Tonifying Kidney, benefiting essence, promoting urination, draining damp","vn":"Bổ thận, ích tinh, lợi tiểu, tháo thấp","fr":"Tonifier le Rein, nourrir l’essence, favoriser la diurèse, éliminer l’humidité","zh":"补肾益精、利尿祛湿","cat":"","pts":[["UB52","Zhishi",""]]},{"id":601,"en":"Frequent urination, urinary retention, genital swelling","vn":"Đái rắt, bí đái, sưng sinh dục ngoài","fr":"Mictions fréquentes, rétention, gonflement génital","zh":"小便频急、尿闭、外阴肿胀","cat":"","pts":[["UB52","Zhishi",""]]},{"id":602,"en":"Nephritis, sexual weakness, prostate issues, nocturnal emission","vn":"Viêm thận, suy nhược sinh dục, prostate, di mộng tinh","fr":"Néphrite, faiblesse sexuelle, prostate, émissions nocturnes","zh":"肾炎、性虚、前列腺病、遗精梦遗","cat":"","pts":[["UB52","Zhishi",""]]},{"id":603,"en":"Genital prolapse, swelling and pain","vn":"Sa sinh dục, sưng đau","fr":"Prolapsus génital, douleur et gonflement","zh":"生殖器脱垂、肿痛","cat":"","pts":[["UB52","Zhishi",""],["UB53","Baohuang",""]]},{"id":604,"en":"Seminal emission, nocturnal emission","vn":"Di tinh, mộng tinh","fr":"Émission séminale, pollution nocturne","zh":"遗精、梦遗","cat":"","pts":[["SP9","Yinlingquan",""],["UB52","Zhishi",""],["UB30","Baihuanshu",""],["UB23","Shenshu",""]]},{"id":605,"en":"Low back pain","vn":"Đau thắt lưng","fr":"Lombalgie","zh":"腰痛","cat":"","pts":[["UB23","Shenshu",""],["UB40","Weizhong",""],["UB52","Zhishi",""],["UB23","Shenshu",""],["DU4","Mingmen",""],["UB60","Kunlun",""],["UB23","Shenshu",""],["UB40","Weizhong",""]]},{"id":606,"en":"Impotence, seminal emission","vn":"Liệt dương, di tinh","fr":"Impuissance, émission séminale","zh":"阳痿、遗精","cat":"","pts":[["UB52","Zhishi",""],["REN4","Guanyan",""],["UB23","Shenshu",""],["LV12","Jimai",""]]},{"id":607,"en":"Early‑morning diarrhea","vn":"Ỉa chảy lúc sáng sớm","fr":"Diarrhée matinale","zh":"清晨腹泻","cat":"","pts":[["DU4","Mingmen",""]]},{"id":608,"en":"Low body temperature","vn":"Thân nhiệt quá thấp","fr":"Température corporelle basse","zh":"体温过低","cat":"","pts":[["DU14","Dazhui",""],["REN8","Shenjue",""]]},{"id":609,"en":"Weakness, exhaustion","vn":"Yếu bải hoải","fr":"Faiblesse, épuisement","zh":"虚弱、乏力","cat":"","pts":[["LI11","Quchi",""],["GB38","Yanglu",""],["REN6","Quihai",""],["ST36","Zusanli",""],["DU14","Dazhui",""],["DU12","Shenzhu",""],["SP21","Dabao",""]]},{"id":610,"en":"Debility","vn":"Suy nhược","fr":"Débilité","zh":"衰弱","cat":"","pts":[["DU13","Taodao",""],["REN6","Quihai",""],["ST36","Zusanli",""],["DU14","Dazhui",""],["DU12","Shenzhu",""]]},{"id":611,"en":"Fatigue, near fainting","vn":"Mệt lả, sắp xỉu","fr":"Fatigue extrême, quasi‑syncope","zh":"极度疲劳、将昏厥","cat":"","pts":[["PC6","Neiguan",""],["ST36","Zusanli",""],["SP6","Sanwinjiao",""]]},{"id":612,"en":"Excessive sweating","vn":"Ra nhiều mồ hôi","fr":"Transpiration excessive","zh":"多汗","cat":"","pts":[["DU14","Dazhui",""],["LI4","Hegu",""],["LU10","Yuji",""],["KI7","Fuliu",""],["ST44","Neiting",""]]},{"id":613,"en":"Deafness, tinnitus, hearing loss","vn":"Điếc, ù tai, lãng tai","fr":"Surdité, acouphènes, perte auditive","zh":"耳聋、耳鸣、听力下降","cat":"","pts":[["SJ17","Yifeng",""],["SI19","Tinggong",""]]},{"id":614,"en":"Parotid gland inflammation","vn":"Viêm tuyến dưới tai","fr":"Inflammation de la parotide","zh":"腮腺炎","cat":"","pts":[["SJ17","Yifeng",""],["ST6","Jiache",""],["LI4","Hegu",""]]},{"id":615,"en":"Facial nerve paralysis","vn":"Liệt dây thần kinh mặt","fr":"Paralysie faciale","zh":"面神经麻痹","cat":"","pts":[["SJ17","Yifeng",""],["ST4","Dicang",""]]},{"id":616,"en":"Eye pain, toothache","vn":"Đau mắt, đau răng","fr":"Douleur oculaire, mal de dents","zh":"眼痛、牙痛","cat":"","pts":[["SJ17","Yifeng",""]]},{"id":617,"en":"Throat pain, laryngeal pain","vn":"Đau trong họng, thanh quản","fr":"Douleur pharyngée, douleur laryngée","zh":"咽痛、喉痛","cat":"","pts":[["SJ17","Yifeng",""],["LI4","Hegu",""],["ST5","Daying",""]]},{"id":618,"en":"Liver–Gallbladder fire excess","vn":"Bệnh do Can Đởm Hỏa vượng","fr":"Excès de Feu du Foie‑Vésicule Biliaire","zh":"肝胆火旺","cat":"","pts":[["SJ17","Yifeng",""],["SJ21","Ermen",""],["GB20","Fengchi",""]]},{"id":619,"en":"Leg cramps","vn":"Vọp bẻ","fr":"Crampe des jambes","zh":"腿抽筋","cat":"","pts":[["UB57","Chengshan",""],["UB38","Fuxi",""],["UB57","Chengshan",""],["UB60","Kunlun",""]]},{"id":620,"en":"Constipation, hard stools","vn":"Bón, phân cứng","fr":"Constipation, selles dures","zh":"便秘、硬便","cat":"","pts":[["UB38","Fuxi",""]]},{"id":621,"en":"Enteritis, cystitis","vn":"Viêm trường vị, viêm bàng quang","fr":"Entérite, cystite","zh":"肠炎、膀胱炎","cat":"","pts":[["UB38","Fuxi",""]]},{"id":622,"en":"Lateral lower‑limb paralysis","vn":"Liệt hạ chi mặt ngoài","fr":"Paralysie latérale du membre inférieur","zh":"下肢外侧瘫痪","cat":"","pts":[["UB38","Fuxi",""]]},{"id":623,"en":"Stomach pain, sour vomiting","vn":"Đau dạ dày, nôn ra chất chua","fr":"Douleur gastrique, vomissements acides","zh":"胃痛、吐酸","cat":"","pts":[["SP4","Gongsun",""],["ST25","Tianshu",""],["ST21","Liangmen",""],["SP1","Yin Bai",""],["ST36","Zusanli",""],["HT6","Yinxi",""]]},{"id":624,"en":"Indigestion","vn":"Ăn không tiêu","fr":"Indigestion","zh":"消化不良","cat":"","pts":[["UB28","Pangguanshu",""],["UB20","Pishu",""],["SP3","Taibai",""]]},{"id":625,"en":"Abdominal pain","vn":"Đau bụng","fr":"Douleur abdominale","zh":"腹痛","cat":"","pts":[["PC6","Neiguan",""],["ST43","Xiangu",""],["ST36","Zusanli",""],["ST25","Tianshu",""],["UB25","Dachangshu",""],["REN14","Juque",""],["SP3","Taibai",""],["ST36","Zusanli",""],["SP4","Gongsun",""]]},{"id":626,"en":"Diarrhea","vn":"Ỉa chảy","fr":"Diarrhée","zh":"腹泻","cat":"","pts":[["REN6","Quihai",""],["SP9","Yinlingquan",""]]},{"id":627,"en":"Lower limb pain","vn":"Đau nhức chi dưới","fr":"Douleur des membres inférieurs","zh":"下肢疼痛","cat":"","pts":[["UB58","Feiyang",""]]},{"id":628,"en":"Lower limb paralysis, ankle joint swelling","vn":"Liệt hạ chi, sưng khớp mắt cá","fr":"Paralysie des jambes, cheville enflée","zh":"下肢瘫痪、踝关节肿胀","cat":"","pts":[]},{"id":629,"en":"Tendon contraction","vn":"Gân co rút","fr":"Contraction tendineuse","zh":"筋挛缩","cat":"","pts":[]},{"id":630,"en":"Shoulder–neck–back pain, arm numbness","vn":"Đau vai cổ lưng, tê cạnh tay","fr":"Douleur épaule‑cou‑dos, engourdissement du bras","zh":"肩颈背痛、手臂麻木","cat":"","pts":[["UB41","Fufen",""]]},{"id":631,"en":"Cold feet","vn":"Lạnh chân","fr":"Pieds froids","zh":"脚冷","cat":"","pts":[["GB32","Zhongdu",""],["KI7","Fuliu",""],["ST33","Yinshi",""],["UB62","Shenmai",""],["GB31","Fengshi",""],["ST45","Lidui",""],["UB61","Pushen",""]]},{"id":632,"en":"Inducing sweating","vn":"Làm ra mồ hôi","fr":"Induire la transpiration","zh":"发汗","cat":"","pts":[["KI7","Fuliu",""],["LI4","Hegu",""]]},{"id":633,"en":"Stopping sweating","vn":"Làm ngưng mồ hôi","fr":"Arrêter la transpiration","zh":"止汗","cat":"","pts":[["KI7","Fuliu",""],["LI4","Hegu",""]]},{"id":634,"en":"Edema","vn":"Phù thủng","fr":"Œdème","zh":"水肿","cat":"","pts":[["KI7","Fuliu",""],["REN8","Shenjue",""]]},{"id":635,"en":"Blood in stool","vn":"Tiêu ra máu","fr":"Sang dans les selles","zh":"便血","cat":"","pts":[["UB17","Geshu",""],["KI7","Fuliu",""],["LV3","Taichong",""],["UB35","Huiyang",""]]},{"id":636,"en":"Cirrhosis","vn":"Xơ gan","fr":"Cirrhose","zh":"肝硬化","cat":"","pts":[["UB18","Ganshu",""],["KI7","Fuliu",""],["UB20","Pishu",""],["REN9","Shuifen",""],["GB34","Yanglingquan",""],["UB23","Shenshu",""],["UB16","Dushu",""],["ST36","Zusanli",""],["LV14","Qimen",""],["KI9","Zhubin",""],["SP10","Xuehai",""],["SP6","Sanwinjiao",""]]},{"id":637,"en":"Diabetes (Xiao Ke)","vn":"Tiểu đường (Tiêu khát)","fr":"Diabète (Xiao Ke)","zh":"消渴（糖尿病）","cat":"","pts":[["KI7","Fuliu",""],["UB18","Ganshu",""],["UB20","Pishu",""]]},{"id":638,"en":"Intestinal rumbling","vn":"Hay sôi trong bụng","fr":"Borborygmes","zh":"肠鸣","cat":"","pts":[["KI7","Fuliu",""]]},{"id":639,"en":"Nourishing yin, tonifying Kidney, warming yang, benefiting qi","vn":"Tư âm bổ thận, ôn dương ích khí","fr":"Nourrir le Yin, tonifier le Rein, réchauffer le Yang, tonifier le Qi","zh":"滋阴补肾、温阳益气","cat":"","pts":[["KI7","Fuliu",""]]},{"id":640,"en":"Rectal bleeding","vn":"Đi cầu ra máu","fr":"Saignement rectal","zh":"直肠出血","cat":"","pts":[["SP1","Yin Bai",""],["ST36","Zusanli",""]]},{"id":641,"en":"Stopping bleeding","vn":"Cầm máu","fr":"Arrêter le saignement","zh":"止血","cat":"","pts":[["SP1","Yin Bai",""],["SP1","Yin Bai",""],["KI3","Taizi",""],["KI3","Taizi",""],["PC7","Daling",""],["HT7","Shenmen",""],["PC7","Daling",""],["HT7","Shenmen",""]]},{"id":642,"en":"Abdominal distention","vn":"Bụng trướng","fr":"Distension abdominale","zh":"腹胀","cat":"","pts":[["SP1","Yin Bai",""],["ST41","Jiexi",""],["SP1","Yin Bai",""],["UB20","Pishu",""],["SP10","Xuehai",""],["ST25","Tianshu",""],["UB21","Weishu",""],["SP5","Shangqiu",""],["KI6","Zhaohai",""],["UB20","Pishu",""],["ST36","Zusanli",""],["UB21","Weishu",""],["ST25","Tianshu",""],["ST36","Zusanli",""],["REN7","Yinjiao",""]]},{"id":643,"en":"Nightmares, ghost dreams","vn":"Mộng ma quỷ","fr":"Cauchemars, rêves effrayants","zh":"噩梦、鬼梦","cat":"","pts":[["SP1","Yin Bai",""],["ST45","Lidui",""]]},{"id":644,"en":"Cold hands and feet, fainting","vn":"Lạnh tay chân, bất tỉnh","fr":"Mains et pieds froids, évanouissement","zh":"手脚冰冷、昏厥","cat":"","pts":[["SP1","Yin Bai",""],["DU20","Baihui",""]]},{"id":645,"en":"Menorrhagia","vn":"Rong kinh","fr":"Ménorragie","zh":"月经过多","cat":"","pts":[["SP10","Xuehai",""],["SP2","Dadu",""],["KI10","Yingu",""],["REN4","Guanyan",""],["SP6","Sanwinjiao",""],["REN3","Zhongji",""],["LV2","Xinglian",""],["SP6","Sanwinjiao",""],["LV3","Taichong",""],["REN3","Zhongji",""]]},{"id":646,"en":"Abdominal distention, chest fullness, heart pain","vn":"Bụng trướng, ngực đầy, tim đau","fr":"Distension abdominale, oppression thoracique, douleur cardiaque","zh":"腹胀、胸闷、心痛","cat":"","pts":[["SP2","Dadu",""],["SP3","Taibai",""]]},{"id":647,"en":"Stomach pain, sour vomiting","vn":"Đau dạ dày, nôn chua","fr":"Douleur gastrique, vomissements acides","zh":"胃痛、吐酸","cat":"","pts":[["SP4","Gongsun",""],["ST25","Tianshu",""],["ST21","Liangmen",""],["SP1","Yin Bai",""],["ST36","Zusanli",""],["HT6","Yinxi",""]]},{"id":648,"en":"Heart, chest, stomach disorders","vn":"Bệnh ở tim, ngực, dạ dày","fr":"Affections du cœur, du thorax et de l’estomac","zh":"心胸胃疾病","cat":"","pts":[["SP4","Gongsun",""],["PC6","Neiguan",""]]},{"id":649,"en":"Difficult urination","vn":"Tiểu không thông","fr":"Mictions difficiles","zh":"小便不利","cat":"","pts":[["KI10","Yingu",""],["SP7","Lougu",""],["SP9","Yinlingquan",""],["LV3","Taichong",""]]},{"id":650,"en":"Numbness of knee and thigh","vn":"Gối đùi tê","fr":"Engourdissement genou‑cuisse","zh":"膝大腿麻木","cat":"","pts":[["SP7","Lougu",""],["SP10","Xuehai",""],["ST34","Liangkiu",""],["ST36","Zusanli",""],["SP6","Sanwinjiao",""]]},{"id":651,"en":"Cold abdomen","vn":"Bụng lạnh","fr":"Abdomen froid","zh":"腹冷","cat":"","pts":[["SP7","Lougu",""]]},{"id":652,"en":"Intercostal pain, gallstone pain","vn":"Đau liên sườn, đau sỏi mật","fr":"Douleur intercostale, douleur des calculs biliaires","zh":"肋间痛、胆结石痛","cat":"","pts":[["SJ6","Zhigou",""],["GB34","Yanglingquan",""]]},{"id":653,"en":"Chronic constipation","vn":"Bón kinh niên","fr":"Constipation chronique","zh":"慢性便秘","cat":"","pts":[["SJ6","Zhigou",""],["SJ6","Zhigou",""],["SP15","Daheng",""],["SP15","Daheng",""],["ST36","Zusanli",""],["ST25","Tianshu",""],["ST36","Zusanli",""],["ST37","Shangjuxu",""]]},{"id":654,"en":"Indigestion, bloating, fullness","vn":"Ăn không tiêu, đầy bụng, no hơi","fr":"Indigestion, ballonnements","zh":"消化不良、腹胀、饱闷","cat":"","pts":[["SP3","Taibai",""],["SP4","Gongsun",""],["ST36","Zusanli",""]]},{"id":655,"en":"Stomach pain","vn":"Đau dạ dày","fr":"Douleur gastrique","zh":"胃痛","cat":"","pts":[["ST19","Burong",""],["SP3","Taibai",""],["ST36","Zusanli",""],["REN12","Zhongwan",""],["PC6","Neiguan",""],["SP4","Gongsun",""]]},{"id":656,"en":"Clearing heat, transforming damp","vn":"Thanh nhiệt, hóa thấp","fr":"Clarifier la chaleur, transformer l’humidité","zh":"清热化湿","cat":"","pts":[["SP3","Taibai",""]]},{"id":657,"en":"Internal hemorrhoids","vn":"Trĩ nội","fr":"Hémorroïdes internes","zh":"内痔","cat":"","pts":[["SP5","Shangqiu",""],["KI6","Zhaohai",""],["KI7","Fuliu",""]]},{"id":658,"en":"Leg pain","vn":"Đau chân","fr":"Douleur de la jambe","zh":"腿痛","cat":"","pts":[["SP5","Shangqiu",""],["KI6","Zhaohai",""],["ST41","Jiexi",""]]},{"id":659,"en":"Spleen deficiency with difficult urination","vn":"Tỳ hư khó tiểu","fr":"Vide de Rate avec dysurie","zh":"脾虚小便不利","cat":"","pts":[["SP5","Shangqiu",""],["KI6","Zhaohai",""],["SP6","Sanwinjiao",""]]},{"id":660,"en":"Chronic diarrhea due to Spleen deficiency","vn":"Tiêu chảy mãn tính do tỳ hư","fr":"Diarrhée chronique due au vide de Rate","zh":"脾虚慢性泄泻","cat":"","pts":[["SP5","Shangqiu",""],["KI6","Zhaohai",""],["REN4","Guanyan",""],["UB20","Pishu",""],["UB22","Sanjiaoshu",""]]},{"id":661,"en":"Whooping cough","vn":"Ho gà","fr":"Coqueluche","zh":"百日咳","cat":"","pts":[["SP5","Shangqiu",""],["KI6","Zhaohai",""],["LI4","Hegu",""]]},{"id":662,"en":"Cold feet","vn":"Lạnh bàn chân","fr":"Pieds froids","zh":"脚心冷","cat":"","pts":[["ST45","Lidui",""]]},{"id":663,"en":"Nosebleed, toothache","vn":"Chảy máu cam, đau răng","fr":"Épistaxis, mal de dents","zh":"鼻出血、牙痛","cat":"","pts":[["ST45","Lidui",""]]},{"id":664,"en":"Epigastric fullness","vn":"Đầy tức thượng vị","fr":"Plénitude épigastrique","zh":"上腹胀满","cat":"","pts":[["ST45","Lidui",""],["SP7","Lougu",""]]},{"id":665,"en":"Lethargy, drowsiness","vn":"Lừ đừ, thích ngủ","fr":"Léthargie, somnolence","zh":"嗜睡、困倦","cat":"","pts":[["SP1","Yin Bai",""],["ST45","Lidui",""],["ST45","Lidui",""],["LV1","Dadun",""],["LV1","Dadun",""]]},{"id":666,"en":"Many dreams, ghost dreams, unstable spirit","vn":"Nhiều mộng mị, mộng ma quỷ, tâm thần bất định","fr":"Beaucoup de rêves, cauchemars, esprit instable","zh":"多梦、鬼梦、神志不安","cat":"","pts":[["ST45","Lidui",""],["SP1","Yin Bai",""]]},{"id":667,"en":"Cold shins","vn":"Lạnh cẳng chân","fr":"Tibias froids","zh":"小腿发冷","cat":"","pts":[["ST45","Lidui",""],["SP6","Sanwinjiao",""]]},{"id":668,"en":"Hunger immediately after eating","vn":"Ăn vào đói liền","fr":"Faim immédiatement après avoir mangé","zh":"刚吃完就饿","cat":"","pts":[["ST45","Lidui",""]]},{"id":669,"en":"Crooked mouth, slanted eyes","vn":"Miệng méo, mắt xếch","fr":"Bouche déviée, yeux inclinés","zh":"口歪眼斜","cat":"","pts":[["ST45","Lidui",""],["ST44","Neiting",""],["ST4","Dicang",""],["ST6","Jiache",""],["UB2","Sanzhu",""]]},{"id":670,"en":"Knee swelling and pain","vn":"Sưng đau đầu gối","fr":"Genou enflé et douloureux","zh":"膝关节肿痛","cat":"","pts":[["ST45","Lidui",""]]},{"id":671,"en":"Shin pain with limited flexion/extension","vn":"Đau cẳng chân không co duỗi được","fr":"Douleur du tibia, flexion/extension limitée","zh":"小腿痛、屈伸受限","cat":"","pts":[["ST44","Neiting",""]]},{"id":672,"en":"Lower abdominal fullness, abdominal pain, gas retention","vn":"Căng đầy bụng dưới, đau bụng, bí trung tiện","fr":"Plénitude abdominale basse, douleur, gaz retenus","zh":"下腹胀满、腹痛、肠气滞","cat":"","pts":[["ST44","Neiting",""],["SP6","Sanwinjiao",""],["ST36","Zusanli",""]]},{"id":673,"en":"Intestinal rumbling, toothache, gum swelling, sore throat","vn":"Sôi ruột, nhức răng, sưng lợi, sưng cổ họng","fr":"Borborygmes, mal de dents, gencives enflées, mal de gorge","zh":"肠鸣、牙痛、牙龈肿痛、咽喉肿痛","cat":"","pts":[["ST44","Neiting",""],["LI4","Hegu",""]]},{"id":674,"en":"Menstrual abdominal pain","vn":"Đau bụng khi có kinh","fr":"Douleur menstruelle abdominale","zh":"痛经腹痛","cat":"","pts":[["ST44","Neiting",""],["SP6","Sanwinjiao",""]]},{"id":675,"en":"Diarrhea, dysentery due to damp‑heat","vn":"Tiêu chảy, kiết lỵ do thấp nhiệt","fr":"Diarrhée, dysenterie par humidité‑chaleur","zh":"湿热泄泻、痢疾","cat":"","pts":[["ST44","Neiting",""],["ST25","Tianshu",""],["LI11","Quchi",""]]},{"id":676,"en":"Toe and foot pain","vn":"Đau ngón chân, bàn chân","fr":"Douleur des orteils et du pied","zh":"趾痛、足痛","cat":"","pts":[["ST44","Neiting",""]]},{"id":677,"en":"Toothache, stomach and intestinal pain","vn":"Đau răng, dạ dày, ruột","fr":"Mal de dents, douleur gastrique et intestinale","zh":"牙痛、胃肠痛","cat":"","pts":[["ST44","Neiting",""]]},{"id":678,"en":"Bloating, abdominal distention","vn":"Sình bụng, đầy bụng, trướng bụng","fr":"Ballonnements, distension","zh":"腹胀、腹满","cat":"","pts":[["ST43","Xiangu",""],["GB39","Xuanzhong",""]]},{"id":679,"en":"Intestinal rumbling, abdominal fullness","vn":"Sôi ruột, bụng căng","fr":"Borborygmes, abdomen tendu","zh":"肠鸣、腹胀","cat":"","pts":[["ST43","Xiangu",""]]},{"id":680,"en":"Abdominal pain","vn":"Đau bụng","fr":"Douleur abdominale","zh":"腹痛","cat":"","pts":[["PC6","Neiguan",""],["ST43","Xiangu",""],["ST36","Zusanli",""],["ST25","Tianshu",""],["UB25","Dachangshu",""],["REN14","Juque",""],["SP3","Taibai",""],["ST36","Zusanli",""],["SP4","Gongsun",""]]},{"id":681,"en":"Facial edema","vn":"Mặt phù thủng","fr":"Œdème du visage","zh":"面部水肿","cat":"","pts":[["ST43","Xiangu",""],["SI18","Quanlia",""]]},{"id":682,"en":"Belching after childbirth","vn":"Sau đẻ hay ợ hơi","fr":"Rots après l’accouchement","zh":"产后嗳气","cat":"","pts":[["ST43","Xiangu",""],["LV14","Qimen",""]]},{"id":683,"en":"Fish‑scale eyes, tearing, severe eye pain","vn":"Mắt có vảy cá, chảy nước mắt, đau dữ dội","fr":"Yeux « écailles de poisson », larmoiement, douleur intense","zh":"鱼鳞眼、流泪、剧烈眼痛","cat":"","pts":[["SI2","Qiangu",""]]},{"id":684,"en":"Fever without sweating, postpartum lack of milk","vn":"Sốt, không ra mồ hôi, sau sinh không có sữa","fr":"Fièvre sans sueur, absence de lait postpartum","zh":"发热无汗、产后无乳","cat":"","pts":[["SI2","Qiangu",""]]},{"id":685,"en":"Schizophrenia","vn":"Tâm thần phân liệt","fr":"Schizophrénie","zh":"精神分裂症","cat":"","pts":[["SI8","Xiaohai",""],["SI2","Qiangu",""],["DU14","Dazhui",""],["DU26","Renzhong",""],["SI3","Houxi",""],["LI11","Quchi",""],["DU14","Dazhui",""],["DU20","Baihui",""],["DU13","Taodao",""],["ST41","Jiexi",""],["UB63","Jinmen",""],["UB62","Shenmai",""]]},{"id":686,"en":"External pathogens: wind‑cold, wind‑heat; harmonizing ying & wei","vn":"Ngoại cảm phong hàn phong nhiệt điều hòa vinh vệ","fr":"Pathogènes externes vent‑froid / vent‑chaleur, harmoniser ying‑wei","zh":"外感风寒风热、调和营卫","cat":"","pts":[["DU20","Baihui",""],["DU14","Dazhui",""],["GB20","Fengchi",""],["LI4","Hegu",""],["LI11","Quchi",""]]},{"id":687,"en":"Clearing heat, dispelling wind, unblocking upper burner","vn":"Thanh nhiệt, tán phong, thông thượng tiêu","fr":"Clarifier la chaleur, chasser le vent, débloquer le foyer supérieur","zh":"清热、祛风、通上焦","cat":"","pts":[["LI4","Hegu",""],["LI11","Quchi",""],["SJ5","Waiguan",""]]},{"id":688,"en":"Harmonizing ying & wei, warming yang, stabilizing exterior (night sweating, rumbling, bloating)","vn":"Điều hòa vinh vệ, ôn dương cố biểu, mồ hôi trộm, sôi ruột, sình bụng","fr":"Harmoniser ying‑wei, réchauffer le yang, stabiliser l’extérieur (sueurs nocturnes, borborygmes, ballonnements)","zh":"调和营卫、温阳固表（盗汗、肠鸣、腹胀）","cat":"","pts":[["LI4","Hegu",""],["KI7","Fuliu",""]]},{"id":689,"en":"Coma, unconsciousness","vn":"Các loại hôn mê, bất tỉnh","fr":"Coma, inconscience","zh":"昏迷、不省人事","cat":"","pts":[["DU20","Baihui",""],["DU26","Renzhong",""],["DU16","Fengfu",""]]},{"id":690,"en":"Yin deficiency with fire excess; upper heat, lower cold","vn":"Âm hư, hỏa vượng, trên nóng dưới lạnh","fr":"Vide de Yin avec excès de Feu; chaleur en haut, froid en bas","zh":"阴虚火旺、上热下寒","cat":"","pts":[["LI4","Hegu",""],["SP6","Sanwinjiao",""]]},{"id":691,"en":"Weak Stomach qi, poor appetite, bloating, belching","vn":"Vị khí suy nhược, ăn uống kém, no hơi, ợ hơi","fr":"Vide de Qi de l’Estomac, mauvaise appétence, ballonnements, éructations","zh":"胃气虚弱、食欲差、腹胀、嗳气","cat":"","pts":[["LI4","Hegu",""],["ST36","Zusanli",""]]},{"id":692,"en":"Abdominal pain, bloating, intestinal rumbling","vn":"Đau bụng, sình bụng, sôi ruột","fr":"Douleur abdominale, ballonnements, borborygmes","zh":"腹痛、腹胀、肠鸣","cat":"","pts":[["REN6","Quihai",""],["ST25","Tianshu",""]]},{"id":693,"en":"Hemorrhoids, bloody dysentery, chest–abdominal stagnation, cramps","vn":"Trĩ, kiết lỵ ra máu, ứ trệ vùng ngực bụng, vọp bẻ","fr":"Hémorroïdes, dysenterie sanglante, stagnation thoraco‑abdominale, crampes","zh":"痔疮、血痢、胸腹瘀滞、抽筋","cat":"","pts":[["ST36","Zusanli",""],["UB57","Chengshan",""]]},{"id":694,"en":"Cough with asthma, phlegm, chest oppression, restlessness","vn":"Ho suyễn, đàm nhiều, tức ngực, bồn chồn","fr":"Toux asthmatique, mucosités, oppression thoracique, agitation","zh":"咳喘、多痰、胸闷、烦躁","cat":"","pts":[["DU14","Dazhui",""],["PC6","Neiguan",""]]},{"id":695,"en":"Wind‑damp, paralysis","vn":"Phong thấp, bại liệt","fr":"Vent‑humidité, paralysie","zh":"风湿、瘫痪","cat":"","pts":[["LI15","Jianyu",""],["LI11","Quchi",""]]},{"id":696,"en":"Wind‑stroke, paralysis, numbness, convulsions","vn":"Trúng phong, bại liệt, mất cảm giác, co giật","fr":"Coup de vent, paralysie, engourdissement, convulsions","zh":"中风、瘫痪、麻木、抽搐","cat":"","pts":[["GB30","Huantiao",""],["GB31","Fengshi",""],["GB34","Yanglingquan",""]]},{"id":697,"en":"Wind‑damp, wind‑cold, wind‑heat, arm numbness","vn":"Phong thấp, phong hàn, phong nhiệt, tê cánh tay","fr":"Vent‑humidité / vent‑froid / vent‑chaleur, bras engourdi","zh":"风湿、风寒、风热、手臂麻木","cat":"","pts":[["LI11","Quchi",""],["LI8","Xialian",""]]},{"id":698,"en":"High fever","vn":"Nhiệt cao","fr":"Fièvre élevée","zh":"高热","cat":"","pts":[["LI11","Quchi",""],["LI4","Hegu",""],["LI15","Jianyu",""]]},{"id":699,"en":"Tearing","vn":"Chảy nước mắt","fr":"Larmoiement","zh":"流泪","cat":"","pts":[["LI11","Quchi",""],["UB18","Ganshu",""]]},{"id":700,"en":"High fever","vn":"Sốt cao","fr":"Forte fièvre","zh":"高烧","cat":"","pts":[["LI11","Quchi",""],["LI4","Hegu",""],["DU14","Dazhui",""]]},{"id":701,"en":"Cold feet","vn":"Lạnh chân","fr":"Pieds froids","zh":"脚冷","cat":"","pts":[["LI11","Quchi",""],["LV3","Taichong",""],["SP10","Xuehai",""]]},{"id":702,"en":"Inducing sweating","vn":"Làm ra mồ hôi","fr":"Induire la transpiration","zh":"发汗","cat":"","pts":[["LI11","Quchi",""],["LI4","Hegu",""],["SP10","Xuehai",""]]},{"id":703,"en":"Stopping sweating","vn":"Làm ngưng mồ hôi","fr":"Arrêter la transpiration","zh":"止汗","cat":"","pts":[["LI11","Quchi",""],["ST36","Zusanli",""],["GB20","Fengchi",""]]},{"id":704,"en":"Edema","vn":"Phù thủng","fr":"Œdème","zh":"水肿","cat":"","pts":[["LI11","Quchi",""],["GB34","Yanglingquan",""]]},{"id":705,"en":"Blood in stool","vn":"Tiêu ra máu","fr":"Sang dans les selles","zh":"便血","cat":"","pts":[["LI11","Quchi",""],["SP6","Sanwinjiao",""]]},{"id":706,"en":"Cirrhosis","vn":"Xơ gan","fr":"Cirrhose","zh":"肝硬化","cat":"","pts":[["LI8","Xialian",""],["SI1","Shaoze",""],["LI1","Shangyang",""],["REN17","Shanzhong",""],["LU10","Yuji",""]]},{"id":707,"en":"Diabetes (Xiao Ke)","vn":"Tiểu đường (Tiêu khát)","fr":"Diabète (Xiao Ke)","zh":"消渴（糖尿病）","cat":"","pts":[]},{"id":708,"en":"Intestinal rumbling","vn":"Hay sôi trong bụng","fr":"Borborygmes","zh":"肠鸣","cat":"","pts":[["ST36","Zusanli",""],["SP6","Sanwinjiao",""]]},{"id":709,"en":"Nourishing yin, tonifying Kidney, warming yang, benefiting qi","vn":"Tư âm bổ thận, ôn dương ích khí","fr":"Nourrir le Yin, tonifier le Rein, réchauffer le Yang, tonifier le Qi","zh":"滋阴补肾、温阳益气","cat":"","pts":[["SJ4","Yangchi",""],["ST36","Zusanli",""]]},{"id":710,"en":"Rectal bleeding","vn":"Đi cầu ra máu","fr":"Saignement rectal","zh":"直肠出血","cat":"","pts":[["HT3","Shaohai",""],["SI8","Xiaohai",""],["ST33","Yinshi",""],["ST33","Yinshi",""],["SI3","Houxi",""]]},{"id":711,"en":"Stopping bleeding","vn":"Cầm máu","fr":"Arrêter le saignement","zh":"止血","cat":"","pts":[["DU9","Zhiyang",""],["HT8","Shaofu",""],["PC6","Neiguan",""],["PC6","Neiguan",""],["PC7","Daling",""],["HT7","Shenmen",""]]},{"id":712,"en":"Abdominal distention","vn":"Bụng trướng","fr":"Distension abdominale","zh":"腹胀","cat":"","pts":[["REN14","Juque",""],["HT8","Shaofu",""],["REN13","Sangwan",""],["PC3","Quze",""],["REN12","Zhongwan",""],["PC4","Ximen",""]]},{"id":713,"en":"Nightmares, ghost dreams","vn":"Mộng ma quỷ","fr":"Cauchemars, rêves effrayants","zh":"噩梦、鬼梦","cat":"","pts":[["HT8","Shaofu",""],["PC6","Neiguan",""],["UB15","Xinshu",""]]},{"id":714,"en":"Cold hands and feet, fainting","vn":"Lạnh tay chân, bất tỉnh","fr":"Mains et pieds froids, évanouissement","zh":"手脚冰冷、昏厥","cat":"","pts":[["HT8","Shaofu",""]]}];

// Match a free-text complaint against S_DB symptom descriptions
// Returns array of matching S_Patterns sorted by relevance
const VN_TO_EN = {
  "buồn nôn":"nausea",
  "bụng đầy":"abdominal bloating",
  "chóng mặt":"dizziness",
  "chướng bụng":"abdominal bloating",
  "cáu gắt":"irritability",
  "cứng cổ":"stiff neck",
  "cứng vai":"stiff shoulder",
  "da khô":"dry skin",
  "da ngứa":"itchy skin",
  "ho":"cough",
  "ho khan":"dry cough",
  "hoa mắt":"dizziness",
  "khó ngủ":"insomnia",
  "khó thở":"shortness of breath",
  "kiệt sức":"exhaustion",
  "lo lắng":"anxiety",
  "lo âu":"anxiety",
  "luôn đầy hơi":"bloating always",
  "mất ngủ":"insomnia",
  "mắt khô":"dry eyes",
  "mệt":"fatigue",
  "mệt mỏi":"fatigue",
  "mồ hôi đêm":"night sweats",
  "ngủ không được":"insomnia",
  "nôn mửa":"vomiting",
  "phù":"edema",
  "sốt":"fever",
  "thần kinh tọa":"sciatica",
  "tiêu chảy":"diarrhea",
  "tiểu buốt":"burning urination",
  "tiểu nhiều":"frequent urination",
  "tiểu đêm":"frequent urination at night",
  "trầm cảm":"depression",
  "táo bón":"constipation",
  "ù tai":"tinnitus",
  "ăn không tiêu":"indigestion",
  "đau bụng":"abdominal pain",
  "đau chân":"leg pain",
  "đau cổ":"neck pain",
  "đau cổ gáy":"stiff neck",
  "đau cổ tay":"wrist pain",
  "đau gối":"knee pain",
  "đau hông":"hip pain",
  "đau khuỷu tay":"elbow pain",
  "đau lưng":"low back pain",
  "đau mắt cá":"ankle pain",
  "đau ngực":"chest pain",
  "đau thần kinh tọa":"sciatica",
  "đau thắt lưng":"low back pain",
  "đau vai":"shoulder pain",
  "đau đầu":"headache",
  "đau đầu gối":"knee pain",
  "đầu gối":"knee",
  "đầy bụng":"abdominal bloating",
  "đầy hơi":"bloating",
  "đổ mồ hôi":"sweating",
  "ớn lạnh":"chills"
};

function matchSymptomPatterns(text) {
  if (!text || text.trim().length < 2) return [];
  const lower = text.toLowerCase().trim();

  // ── Multilingual normalisation ────────────────────────────────────────
  // Convert VN/FR/ZH input to EN searchable terms
  let searchText = lower;
  const lang = (_lang || "EN").toUpperCase();
  if (lang === "VN") {
    // Try full phrase first, then word-by-word
    if (VN_TO_EN[lower]) {
      searchText = VN_TO_EN[lower];
    } else {
      // Replace known VN phrases/words with EN equivalents
      let translated = lower;
      // Sort by length descending so longer phrases match first
      const pairs = Object.entries(VN_TO_EN).sort((a,b) => b[0].length - a[0].length);
      pairs.forEach(([vn, en]) => {
        if (translated.includes(vn)) translated = translated.replace(new RegExp(vn, "g"), en);
      });
      searchText = translated;
    }
  }

  const words = searchText.split(/[\s,\.;:!?()\/-]+/).filter(w => w.length > 2);
  const origWords = lower.split(/[\s,\.;:!?()\/-]+/).filter(w => w.length > 2);

  // Score each S_Pattern
  // ── DisplayName principle: search active language field directly ─────
  const displayField = {"VN":"vn","FR":"fr","ZH":"zh"}[lang] || "en";
  const scored = S_DB.map(sp => {
    // Search the DisplayName (active language) — same ID returns same points
    const displayName = (sp[displayField] || sp.en).toLowerCase();
    const hay = displayName + " " + sp.en.toLowerCase(); // also search EN as fallback
    let score = 0;
    // Exact phrase match — highest weight
    if (displayName.includes(lower.trim())) score += 20;
    if (hay.includes(searchText.trim())) score += 10;
    // Each word match against display name
    lower.split(/[\s,\.;:!?()\/-]+/).filter(w=>w.length>1)
         .forEach(w => { if (displayName.includes(w)) score += 3; });
    // Translated/EN words as fallback
    words.forEach(w => { if (hay.includes(w)) score += 2; });
    // Stem match
    words.filter(w => w.length > 4).forEach(w => {
      if (hay.split(' ').some(hw => hw.startsWith(w.slice(0,4)))) score += 1;
    });
    return { ...sp, score };
  }).filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, 5);
}


// ─── Scoring engine ──────────────────────────────────────────────────────
// intakeFindings: Set of findingIds that are present
function scorePatterns(intakeFindings) {
  if (!intakeFindings || intakeFindings.size === 0) return [];
  return DB.patterns.map(p => {
    let score = 0, maxScore = 0, keyHits = 0, keyTotal = 0;
    for (const [fid, strength, isKey] of p.findings) {
      maxScore += strength;
      if (isKey) keyTotal++;
      if (intakeFindings.has(fid)) {
        score += strength;
        if (isKey) keyHits++;
      }
    }
    const pct = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
    return { ...p, score: pct, keyHits, keyTotal };
  }).filter(p => p.score > 0)
    .sort((a, b) => b.score - a.score);
}

// ─── Styles ──────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Noto+Serif:ital,wght@0,400;0,600;1,400&family=Noto+Sans:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --ink: #1a1208; --warm: #f5f0e8; --paper: #faf7f2;
    --gold: #b5872a; --gold-lt: #f0e4c0; --gold-dk: #8a6420;
    --teal: #1d6a6a; --teal-lt: #d0eaea; --teal-dk: #0f4040;
    --red: #8b2020; --red-lt: #f5d5d5;
    --muted: #6b6050; --border: #ddd4c0; --border-lt: #ede8de;
    --shadow: 0 2px 12px rgba(26,18,8,.07);
    --shadow-md: 0 4px 20px rgba(26,18,8,.12);
    --r: 10px; --r-sm: 6px;
    --serif: 'Noto Serif', Georgia, serif;
    --sans: 'Noto Sans', system-ui, sans-serif;
  }
  body { background: var(--paper); color: var(--ink); font-family: var(--sans); font-size: 14px; }
  .app { display: flex; flex-direction: column; height: 100dvh; max-width: 480px; margin: 0 auto; background: var(--paper); overflow: hidden; }

  /* Header */
  .header { background: var(--ink); color: var(--warm); padding: 13px 16px; display: flex; align-items: center; gap: 10px; position: sticky; top: 0; z-index: 100; box-shadow: 0 2px 8px rgba(0,0,0,.3); }
  .header-logo { font-family: var(--serif); font-size: 20px; font-weight: 600; letter-spacing: .05em; }
  .header-sub { font-size: 9px; font-weight: 300; opacity: .65; letter-spacing: .12em; text-transform: uppercase; }
  .back-btn { background: none; border: none; color: var(--gold); font-size: 22px; cursor: pointer; padding: 2px 6px; line-height: 1; }

  /* Bottom Nav */
  .bot-nav { position: sticky; bottom: 0; background: var(--ink); display: flex; border-top: 1px solid #2a2010; z-index: 100; }
  .nav-btn { flex: 1; background: none; border: none; color: #7a6e60; padding: 10px 4px 8px; font-family: var(--sans); font-size: 9px; letter-spacing: .07em; text-transform: uppercase; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 4px; transition: color .2s; }
  .nav-btn svg { width: 20px; height: 20px; }
  .nav-btn.active { color: var(--gold); }

  /* Main scroll */
  .main { flex: 1; overflow-y: scroll; -webkit-overflow-scrolling: touch; min-height: 0; }

  /* Cards */
  .card { background: #fff; border: 1px solid var(--border); border-radius: var(--r); margin: 12px 14px; padding: 16px; box-shadow: var(--shadow); }
  .card + .card { margin-top: 8px; }
  .card-hd { font-family: var(--serif); font-size: 14px; color: var(--ink); margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }
  .card-hd .pip { width: 7px; height: 7px; border-radius: 50%; background: var(--gold); flex-shrink: 0; }
  .card-hd .pip.teal { background: var(--teal); }
  .card-hd .pip.red { background: var(--red); }

  /* Form */
  .field { margin-bottom: 12px; }
  .field:last-child { margin-bottom: 0; }
  .field label { display: block; font-size: 10px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; color: var(--muted); margin-bottom: 5px; }
  .field input, .field select, .field textarea {
    width: 100%; padding: 9px 11px; border: 1px solid var(--border); border-radius: var(--r-sm);
    font-family: var(--sans); font-size: 14px; background: var(--warm); color: var(--ink);
    transition: border-color .2s, box-shadow .2s; outline: none;
  }
  .field input:focus, .field select:focus, .field textarea:focus {
    border-color: var(--teal); box-shadow: 0 0 0 3px var(--teal-lt);
  }
  .field textarea { resize: vertical; min-height: 68px; }
  .row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }

  /* Chips */
  .chips { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 4px; }
  .chip { padding: 5px 11px; border: 1px solid var(--border); border-radius: 20px; font-size: 12px; cursor: pointer; transition: all .15s; background: var(--warm); color: var(--muted); user-select: none; line-height: 1.3; }
  .chip.on { background: var(--teal); border-color: var(--teal); color: #fff; }
  .chip.on-red { background: var(--red); border-color: var(--red); color: #fff; }
  .chip.on-gold { background: var(--gold); border-color: var(--gold); color: #fff; }

  /* Buttons */
  .btn { display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 10px 18px; border-radius: 8px; font-family: var(--sans); font-size: 14px; font-weight: 500; cursor: pointer; border: none; transition: all .18s; }
  .btn-primary { background: var(--teal); color: #fff; }
  .btn-primary:hover { background: var(--teal-dk); }
  .btn-primary:disabled { opacity: .45; cursor: default; }
  .btn-gold { background: var(--gold); color: #fff; }
  .btn-gold:hover { background: var(--gold-dk); }
  .btn-outline { background: transparent; border: 1px solid var(--border); color: var(--ink); }
  .btn-outline:hover { background: var(--warm); }
  .btn-danger { background: var(--red); color: #fff; }
  .btn-full { width: 100%; }
  .btn-sm { padding: 6px 13px; font-size: 12px; }

  /* Patient list */
  .pt-row { display: flex; align-items: center; padding: 12px 14px; border-bottom: 1px solid var(--border-lt); cursor: pointer; transition: background .12s; gap: 11px; }
  .pt-row:hover { background: var(--warm); }
  .avatar { width: 38px; height: 38px; border-radius: 50%; background: var(--teal-lt); color: var(--teal); font-family: var(--serif); font-size: 14px; font-weight: 600; display: flex; align-items: center; justify-content: center; flex-shrink: 0; text-transform: uppercase; }
  .pt-row .info h3 { font-size: 14px; font-weight: 500; }
  .pt-row .info p { font-size: 11px; color: var(--muted); margin-top: 2px; }
  .chevron { margin-left: auto; color: var(--border); font-size: 20px; }

  /* Score bars */
  .pattern-item { padding: 8px 10px; border-radius: 8px; cursor: pointer; transition: background .12s; }
  .pattern-item:hover { background: var(--warm); }
  .pattern-item.sel { background: var(--teal-lt); }
  .p-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px; }
  .p-name { font-size: 13px; font-weight: 500; }
  .p-score { font-size: 11px; color: var(--muted); }
  .bar-track { height: 7px; background: var(--border-lt); border-radius: 4px; overflow: hidden; }
  .bar-fill { height: 100%; border-radius: 4px; transition: width .5s ease; background: linear-gradient(90deg, var(--teal), var(--gold)); }
  .bar-fill.hi { background: linear-gradient(90deg, var(--red), var(--gold)); }

  /* Treatment tiers */
  .tier { border-radius: 8px; padding: 13px; margin-bottom: 10px; }
  .tier-root { background: linear-gradient(135deg, #e8f4e8 0%, #d4ecd4 100%); border: 1px solid #b8d8b8; }
  .tier-branch { background: linear-gradient(135deg, var(--teal-lt) 0%, #bce0e0 100%); border: 1px solid #9dd0d0; }
  .tier-cc { background: linear-gradient(135deg, var(--gold-lt) 0%, #e0cc90 100%); border: 1px solid #c8b070; }
  .tier-oc { background: linear-gradient(135deg, #ede8f8 0%, #ddd0f0 100%); border: 1px solid #c0b0e0; }
  .tier-hd { font-family: var(--serif); font-size: 13px; font-weight: 600; margin-bottom: 8px; display: flex; align-items: center; gap: 6px; }
  .tier-hd span.label { font-size: 9px; font-weight: 500; letter-spacing: .1em; text-transform: uppercase; opacity: .7; margin-left: 4px; }
  .tier-principles { margin-bottom: 8px; }
  .tier-principle { font-size: 12px; color: var(--muted); padding: 2px 0; }
  .point-pill { display: inline-block; border-radius: 4px; padding: 3px 8px; font-size: 12px; font-weight: 600; margin: 2px 2px; }
  .pp-tonify { background: #d4ecd4; color: #2a5a2a; }
  .pp-clear { background: var(--red-lt); color: var(--red); }
  .pp-regulate { background: var(--gold-lt); color: var(--gold-dk); }
  .pp-drain { background: #e8e0f0; color: #503080; }
  .pp-move { background: #ffe8d0; color: #804010; }
  .pp-default { background: var(--border-lt); color: var(--muted); }

  /* Step progress */
  .steps { display: flex; gap: 4px; padding: 10px 14px 6px; }
  .step { flex: 1; height: 3px; border-radius: 2px; background: var(--border); transition: background .25s; }
  .step.done { background: var(--teal); }
  .step.cur { background: var(--gold); }

  /* Section strip */
  .strip { padding: 8px 14px 3px; font-size: 10px; letter-spacing: .1em; text-transform: uppercase; color: var(--muted); font-weight: 600; }

  /* Divider */
  hr { border: none; border-top: 1px solid var(--border-lt); margin: 10px 0; }

  /* Empty */
  .empty { text-align: center; padding: 44px 20px; color: var(--muted); }
  .empty .ico { font-size: 42px; margin-bottom: 10px; }
  .empty p { font-size: 13px; line-height: 1.6; }

  /* Tag / badge */
  .tag { display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 10px; font-weight: 600; letter-spacing: .04em; }
  .tag-root { background: #d4ecd4; color: #2a5a2a; }
  .tag-branch { background: var(--teal-lt); color: var(--teal-dk); }
  .tag-key { background: var(--gold-lt); color: var(--gold-dk); }

  /* Pattern selector buttons */
  .pattern-select-btn { display: block; width: 100%; text-align: left; padding: 9px 12px; border: 1px solid var(--border); border-radius: 6px; margin-bottom: 5px; background: var(--warm); cursor: pointer; font-family: var(--sans); font-size: 13px; transition: all .12s; }
  .pattern-select-btn:hover { border-color: var(--teal); background: var(--teal-lt); }
  .pattern-select-btn.sel { border-color: var(--teal); background: var(--teal-lt); font-weight: 500; }

  /* Search input */
  .search-wrap { padding: 10px 14px 6px; }
  .search-wrap input { width: 100%; padding: 9px 12px; border: 1px solid var(--border); border-radius: 20px; background: var(--warm); font-family: var(--sans); font-size: 14px; outline: none; }
  .search-wrap input:focus { border-color: var(--teal); }

  /* Fade */
  @keyframes fadeUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
  @keyframes spin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
  .fu { animation: fadeUp .25s ease forwards; }
`;

// ─── Icons ───────────────────────────────────────────────────────────────
const Ic = {
  patients: React.createElement('svg', { viewBox: "0 0 24 24"   , fill: "none", stroke: "currentColor", strokeWidth: "2",}, React.createElement('path', { d: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"          ,}), React.createElement('circle', { cx: "9", cy: "7", r: "4",}), React.createElement('path', { d: "M23 21v-2a4 4 0 0 0-3-3.87"     ,}), React.createElement('path', { d: "M16 3.13a4 4 0 0 1 0 7.75"       ,})),
  settings: React.createElement('svg', { viewBox: "0 0 24 24"   , fill: "none", stroke: "currentColor", strokeWidth: "2",}, React.createElement('circle', { cx: "12", cy: "12", r: "3",}), React.createElement('path', { d: "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"                                                                                                                                 ,})),
};

// ─── Storage ─────────────────────────────────────────────────────────────
const DB_KEY = "aaida_v3";
function loadStore() {
  try { const r = localStorage.getItem(DB_KEY); if (r) return JSON.parse(r); } catch (e2) {}
  return { patients: [], intakes: [], nPID: 1001, nIID: 1 };
}
function saveStore(s) { try { localStorage.setItem(DB_KEY, JSON.stringify(s)); } catch (e3) {} }

// ─── Chip group ───────────────────────────────────────────────────────────
function Chips({ options, value = [], onChange, cls = "on" }) {
  return (
    React.createElement('div', { className: "chips",}
      , options.map(o => {
        const on = value.includes(o);
        return React.createElement('div', { key: o, className: `chip ${on ? cls : ""}`, onClick: () =>
          onChange(on ? value.filter(x => x !== o) : [...value, o]),}, tLV(o));
      })
    )
  );
}

function SingleChip({ options, value, onChange }) {
  return (
    React.createElement('div', { className: "chips",}
      , options.map(o => React.createElement('div', { key: o, className: `chip ${value === o ? "on" : ""}`,
        onClick: () => onChange(value === o ? "" : o),}, tLV(o)))
    )
  );
}

// ─── PATIENT LIST ─────────────────────────────────────────────────────────
function PatientList({ store, onSelect, onNew }) {
  const [q, setQ] = useState("");
  const pts = store.patients.filter(p =>
    (p.firstName + " " + p.lastName).toLowerCase().includes(q.toLowerCase())
  );
  return (
    React.createElement('div', { className: "fu",}
      , React.createElement('div', { className: "search-wrap",}
        , React.createElement('input', { placeholder: t("searchPts") , value: q, onChange: e => setQ(e.target.value),} )
      )
      , React.createElement('div', { style: { padding: "0 14px 10px" },}
        , React.createElement('button', { className: "btn btn-primary btn-full"  , onClick: onNew,}, t("newPatient")  )
      )
      , pts.length === 0 && React.createElement('div', { className: "empty",}, React.createElement('div', { className: "ico",}, "🌿"), React.createElement('p', null, t("noPatients")  , React.createElement('br', null), t("tapToAdd")      ))
      , pts.map(p => {
        const ic = store.intakes.filter(i => i.patientId === p.id).length;
        return (
          React.createElement('div', { key: p.id, className: "pt-row", onClick: () => onSelect(p),}
            , React.createElement('div', { className: "avatar",}, p.firstName[0], p.lastName[0])
            , React.createElement('div', { className: "info",}, React.createElement('h3', null, p.firstName, " " , p.lastName), React.createElement('p', null, "DOB: " , p.dob||"—", " · "  , ic, " intake" , ic!==1?"s":""))
            , React.createElement('span', { className: "chevron",}, "›")
          )
        );
      })
    )
  );
}

// ─── NEW / EDIT PATIENT ───────────────────────────────────────────────────
function NewPatient({ existing, onSave, onCancel }) {
  const isEdit = !!existing;
  const [f, setF] = useState(existing ? { ...existing } : {
    firstName:"", lastName:"", dob:"", gender:"",
    phone:"", email:"",
    address:"", city:"", province:"", postalCode:"",
    emergencyName:"", emergencyRel:"", emergencyPhone:"",
  });
  const s = (k,v) => setF(x => ({...x,[k]:v}));
  return (
    React.createElement('div', { className: "fu",}
      , isEdit && (
        React.createElement('div', { style: {margin:"10px 14px 0",padding:"9px 13px",background:"var(--gold-lt)",
          border:"1px solid var(--gold)",borderRadius:8,fontSize:12,color:"var(--gold-dk)",
          display:"flex",alignItems:"center",gap:8},}, "✏️ "
           , React.createElement('span', null, React.createElement('strong', null, t("editingRecord")  ), " — "  , existing.firstName, " " , existing.lastName)
        )
      )
      , React.createElement('div', { className: "card", style: {marginTop: isEdit ? 8 : 12},}
        , React.createElement('div', { className: "card-hd",}, React.createElement('span', { className: "pip",}), "Patient Information" )
        , React.createElement('div', { className: "row2",}
          , React.createElement('div', { className: "field",}, React.createElement('label', null, "First Name *"  ), React.createElement('input', { value: f.firstName, onChange: e=>s("firstName",e.target.value),} ))
          , React.createElement('div', { className: "field",}, React.createElement('label', null, "Last Name *"  ), React.createElement('input', { value: f.lastName, onChange: e=>s("lastName",e.target.value),} ))
        )
        , React.createElement('div', { className: "row2",}
          , React.createElement('div', { className: "field",}, React.createElement('label', null, t("dateOfBirth")  ), React.createElement('input', { type: "date", value: f.dob, onChange: e=>s("dob",e.target.value),} ))
          , React.createElement('div', { className: "field",}, React.createElement('label', null, "Gender")
            , React.createElement('select', { value: f.gender, onChange: e=>s("gender",e.target.value),}
              , React.createElement('option', { value: "",}, "—"), React.createElement('option', { value:"Male"},   t("male")), React.createElement('option', { value:"Female"}, t("female")), React.createElement('option', { value:"Other"},  t("genderOther"))
            )
          )
        )
        , React.createElement('div', { className: "field",}, React.createElement('label', null, "Phone"), React.createElement('input', { type: "tel", value: f.phone, onChange: e=>s("phone",e.target.value),} ))
        , React.createElement('div', { className: "field",}, React.createElement('label', null, "Email"), React.createElement('input', { type: "email", value: f.email, onChange: e=>s("email",e.target.value),} ))
      )

      , React.createElement('div', { className: "card",}
        , React.createElement('div', { className: "card-hd",}, React.createElement('span', { className: "pip",}), "Address")
        , React.createElement('div', { className: "field",}, React.createElement('label', null, t("streetAddress") )
          , React.createElement('input', { value: f.address||"", onChange: e=>s("address",e.target.value), placeholder: "123 Main Street"  ,})
        )
        , React.createElement('div', { className: "row2",}
          , React.createElement('div', { className: "field",}, React.createElement('label', null, "City")
            , React.createElement('input', { value: f.city||"", onChange: e=>s("city",e.target.value),} )
          )
          , React.createElement('div', { className: "field",}, React.createElement('label', null, t("provinceState")  )
            , React.createElement('input', { value: f.province||"", onChange: e=>s("province",e.target.value),} )
          )
        )
        , React.createElement('div', { className: "field",}, React.createElement('label', null, t("postalCode")   )
          , React.createElement('input', { value: f.postalCode||"", onChange: e=>s("postalCode",e.target.value), style: {maxWidth:160},} )
        )
      )

      , React.createElement('div', { className: "card",}
        , React.createElement('div', { className: "card-hd",}, React.createElement('span', { className: "pip teal" ,}), t("emergencyContact") )
        , React.createElement('div', { className: "field",}, React.createElement('label', null, t("contactName") )
          , React.createElement('input', { value: f.emergencyName||"", onChange: e=>s("emergencyName",e.target.value), placeholder: "Full name" ,})
        )
        , React.createElement('div', { className: "row2",}
          , React.createElement('div', { className: "field",}, React.createElement('label', null, "Relationship")
            , React.createElement('input', { value: f.emergencyRel||"", onChange: e=>s("emergencyRel",e.target.value), placeholder: "e.g. Spouse, Son"  ,})
          )
          , React.createElement('div', { className: "field",}, React.createElement('label', null, "Phone")
            , React.createElement('input', { type: "tel", value: f.emergencyPhone||"", onChange: e=>s("emergencyPhone",e.target.value),} )
          )
        )
      )

      , React.createElement('div', { style: {display:"flex",gap:8,padding:"0 14px 16px"},}
        , React.createElement('button', { className: "btn btn-outline" , style: {flex:1}, onClick: onCancel,}, (_lang==="VN"?"Hủy":_lang==="FR"?"Annuler":_lang==="ZH"?"取消":"Cancel"))
        , React.createElement('button', { className: "btn btn-primary" , style: {flex:2},
          disabled: !f.firstName||!f.lastName,
          onClick: ()=>onSave(f),}
          , isEdit ? "Update Patient" : t("savePatientBtn")
        )
      )
    )
  );
}

// ─── PATIENT RECORD ───────────────────────────────────────────────────────
function PatientRecord({ patient, store, onNew, onOpen, onEdit }) {
  const intakes = store.intakes.filter(i=>i.patientId===patient.id).slice().reverse();
  return (
    React.createElement('div', { className: "fu",}
      , React.createElement('div', { className: "card", style: {background:"var(--ink)",color:"var(--warm)"},}
        , React.createElement('div', { style: {display:"flex",alignItems:"center",gap:14},}
          , React.createElement('div', { className: "avatar", style: {width:50,height:50,fontSize:18,background:"var(--teal)",color:"#fff"},}
            , patient.firstName[0], patient.lastName[0]
          )
          , React.createElement('div', { style: {flex:1},}
            , React.createElement('div', { style: {fontFamily:"var(--serif)",fontSize:17},}, patient.firstName, " " , patient.lastName)
            , React.createElement('div', { style: {fontSize:11,opacity:.7,marginTop:3},}, patient.dob||"—", " · "  , patient.gender||"—")
            , React.createElement('div', { style: {fontSize:11,opacity:.6},}, patient.phone||"", patient.email?" · "+patient.email:"")
            , (patient.address||patient.city) && (
              React.createElement('div', { style: {fontSize:11,opacity:.55,marginTop:2},}
                , [patient.address,patient.city,patient.province,patient.postalCode].filter(Boolean).join(", ")
              )
            )
            , patient.emergencyName && (
              React.createElement('div', { style: {fontSize:10,opacity:.5,marginTop:3},}, "Emergency: "
                 , patient.emergencyName, patient.emergencyRel?" ("+patient.emergencyRel+")":"", " " , patient.emergencyPhone||""
              )
            )
          )
        )
        , React.createElement('div', { style: {marginTop:12,display:"flex",gap:8},}
          , React.createElement('button', { className: "btn btn-sm" , onClick: onEdit,
            style: {background:"rgba(255,255,255,.12)",color:"var(--warm)",border:"1px solid rgba(255,255,255,.2)",flex:1},}, `✏️ ${t("editPatientBtn")||"Edit Patient Info"}`

          )
        )
      )
      , React.createElement('div', { style: {padding:"0 14px 10px"},}
        , React.createElement('button', { className: "btn btn-gold btn-full"  , onClick: onNew,}, `+ ${t("newIntake")||"New Intake"}`  )
      )
      , React.createElement('div', { className: "strip",}, t("intakeHistory") )
      , intakes.length===0 && React.createElement('div', { className: "empty",}, React.createElement('div', { className: "ico",}, "📋"), React.createElement('p', null, t("noIntakes")  ))
      , intakes.map(intake => {
        const scored = scorePatterns(new Set(intake.activeFindings||[]));
        const top = scored[0];
        return (
          React.createElement('div', { key: intake.id, className: "pt-row", onClick: ()=>onOpen(intake),}
            , React.createElement('div', { className: "avatar", style: {background:"var(--gold-lt)",color:"var(--gold-dk)"},}
              , intake.finalPlan ? "✅" : "📋"
            )
            , React.createElement('div', { className: "info",}
              , React.createElement('h3', null, intake.date, " — "  , intake.chiefComplaint||t("noChiefComp"))
              , React.createElement('p', null, intake.finalPlan
                ? `${_lang==="VN"?"Phác đồ":_lang==="FR"?"Plan final":_lang==="ZH"?"最终方案":"Final plan"}: ${intake.finalPlan.points.slice(0,6).map(p=>p.code).join(", ")}${intake.finalPlan.points.length>6?" …":""}`
                : top ? `Top: ${top.name} (${top.score}%)` : t("notAssessed"))
            )
            , React.createElement('span', { className: "chevron",}, "›")
          )
        );
      })
    )
  );
}

// ─── INTAKE WIZARD ────────────────────────────────────────────────────────
function getSteps() { return [
  _lang==="VN"?"Lý do khám":_lang==="FR"?"Plainte":_lang==="ZH"?"主诉":"Complaint",
  _lang==="VN"?"Triệu chứng":_lang==="FR"?"Symptômes":_lang==="ZH"?"症状":"Symptoms",
  _lang==="VN"?"Lưỡi & Mạch":_lang==="FR"?"Langue & Pouls":_lang==="ZH"?"舌象与脉象":"Tongue & Pulse",
  _lang==="VN"?"Xác nhận":_lang==="FR"?"Confirmation":_lang==="ZH"?"确认":"Confirm"
]; }
const STEPS = getSteps();  // fallback for any module-level uses

// Group symptom findings by source field for display
const SYMPTOM_GROUPS = {};
for (const [id, f] of Object.entries(DB.findings)) {
  if (f[2] === "Symptom" && f[3]) {
    const grp = f[3];
    if (!SYMPTOM_GROUPS[grp]) SYMPTOM_GROUPS[grp] = [];
    SYMPTOM_GROUPS[grp].push({ id: Number(id), name: f[1] });
  }
}
const TONGUE_FINDINGS = Object.entries(DB.findings)
  .filter(([,f]) => f[2]==="Tongue").map(([id,f]) => ({id:Number(id),name:f[1]}));
const PULSE_FINDINGS = Object.entries(DB.findings)
  .filter(([,f]) => f[2]==="Pulse").map(([id,f]) => ({id:Number(id),name:f[1]}));

const LV = DB.lookup;

function IntakeWizard({ patient, existing, onSave, onCancel }) {
  const isEdit = !!existing;
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(existing ? { ...existing } : {
    date: new Date().toISOString().slice(0,10),
    chiefComplaint:"", otherConcern1:"", otherConcern2:"",
    illnessSince:"", energyLevel:"", appetite:"", mood:[],
    sleepQuality:"", thirst:"", sweating:"", stoolConsistency:"",
    activeFindings: [],
    tongueBodyColor:"", tongueCoating:"", tongueMoisture:"",
    tongueNotes:"",
    pulseQualities:[], pulseStrengthR:"", pulseStrengthL:"",
    pulseNotes:"", practitionerNotes:"",
    lifestyle:[], medicalHistory:"",
  });
  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  // Autosave draft (new intakes only — not edits)
  useEffect(() => {
    if (!isEdit) {
      try { localStorage.setItem(INTAKE_DRAFT_KEY, JSON.stringify({patientId: patient.id, form})); } catch {}
    }
  }, [form]);

  // Load draft on mount (new intakes only)
  useEffect(() => {
    if (!isEdit) {
      try {
        const raw = localStorage.getItem(INTAKE_DRAFT_KEY);
        if (raw) {
          const draft = JSON.parse(raw);
          if (draft.patientId === patient.id) {
            setForm(draft.form);
          }
        }
      } catch {}
    }
  }, []);

  // Convert lookup selections + chip selections to finding IDs
  const toggleFinding = (id) => {
    const af = form.activeFindings;
    set("activeFindings", af.includes(id) ? af.filter(x=>x!==id) : [...af, id]);
  };
  const isFActive = (id) => form.activeFindings.includes(id);

  // ── Fuzzy search state ──
  const [searchQ, setSearchQ] = useState("");
  const [aiText, setAiText] = useState("");
  const [aiState, setAiState] = useState("idle"); // idle | loading | done | error
  const [aiMessage, setAiMessage] = useState("");

  // All findings flat list for search
  const ALL_FINDINGS_FLAT = Object.entries(DB.findings).map(([id, f]) => ({
    id: Number(id), name: f[1], domain: f[2], field: f[3]
  }));

  // Fuzzy search — matches on any word overlap, substring, or common synonym
  const SYNONYMS = {
    // Energy / fatigue
    tired:"exhausted low energy fatigue", fatigue:"exhausted low tired energy",
    sluggish:"exhausted low fatigue tired", "lack motivation":"exhausted low fatigue tired",
    "no energy":"exhausted low fatigue", "low energy":"exhausted low fatigue",
    lethargic:"exhausted low fatigue tired", weak:"exhausted low energy",
    // Sleep
    insomnia:"insomnia difficulty falling waking", "can't sleep":"insomnia difficulty falling",
    "poor sleep":"insomnia waking restless", "restless sleep":"insomnia waking restless",
    "dream disturbed":"insomnia vivid dream", "vivid dreams":"insomnia vivid dream",
    // Appetite / digestion
    "poor appetite":"appetite poor", "no appetite":"appetite poor",
    "lack appetite":"appetite poor", "not hungry":"appetite poor",
    bloated:"bloating distention gas", "stomach pain":"abdominal pain epigastric",
    "belly pain":"abdominal pain epigastric", nausea:"nausea vomiting stomach",
    constipation:"dry stools hard", diarrhea:"loose stools watery",
    "loose bowels":"loose stools", "stomach upset":"nausea abdominal",
    // Respiratory / heart
    "short of breath":"shortness breathing", "shortness of breath":"shortness breathing",
    "out of breath":"shortness breathing", "difficulty breathing":"shortness breathing",
    palpitations:"palpitations heart racing", "heart racing":"palpitations racing",
    "heart pounding":"palpitations racing", "irregular heartbeat":"palpitations",
    // Pain
    "back pain":"lower back kidney", "low back":"lower back kidney",
    headache:"headache head migraine", migraine:"headache migraine",
    "joint pain":"joint pain limbs", "muscle pain":"pain limbs",
    // Sweating
    "night sweats":"night sweating spontaneous", "sweating at night":"night sweating",
    "spontaneous sweating":"spontaneous sweating", "sweats easily":"spontaneous sweating",
    // Urinary
    "frequent urination":"frequent urinary", "dark urine":"dark urine color",
    "urinary frequency":"frequent urinary", "burning urination":"burning urinary",
    // Temperature
    "feel cold":"cold chills temperature", chills:"chills cold temperature",
    "feel hot":"heat fever temperature", "afternoon fever":"heat afternoon",
    "hot flushes":"heat sweating spontaneous", feverish:"heat fever temperature",
    // Emotional / mental
    anxious:"anxiety fear worry", anxiety:"anxiety fear worry",
    depressed:"depression sadness mood", "mood swings":"irritability mood",
    irritable:"irritability anger mood", angry:"anger irritability",
    "poor memory":"memory cognitive", "brain fog":"memory cognitive confusion",
    // Skin / appearance
    "dark skin":"complexion pale dark", "pale face":"complexion pale",
    "yellow skin":"jaundice yellow", "dry skin":"dry skin health",
    // Thirst / mouth
    "dry mouth":"thirst dry mouth", thirsty:"thirst",
    "bitter taste":"bitter taste mouth", "no thirst":"low thirst",
    // Eyes / vision
    "blurred vision":"blurred vision eyes", "dry eyes":"dry eyes vision",
    "red eyes":"red eyes vision", "floaters":"vision eyes",
    // Ears
    tinnitus:"tinnitus ringing hearing", "ringing ears":"tinnitus hearing",
    // Reproductive
    "irregular period":"cycle irregular menses", "period pain":"cramps painful",
    "heavy period":"flow heavy amount", "light period":"scanty menses flow",
    // Respiratory
    cough:"cough coughing", phlegm:"sputum phlegm cough",
    "yellow phlegm":"yellow sputum phlegm", wheeze:"breathing shortness",
    // Misc
    dizzy:"dizziness vertigo", dizziness:"dizziness vertigo",
    "dark complexion":"complexion pale dark skin",
    // ── Clinical synonyms from tblSynonyms (Access MVP06) ────────────────
    "painful":"pain",
    "hurting":"pain",
    "ache":"pain",
    "aching":"pain",
    "soreness":"pain",
    "discomfort":"pain",
    "tenderness":"pain",
    "hurts":"pain",
    "feels sore":"pain",
    "stabbing pain":"sharp pain",
    "knife-like pain":"sharp pain",
    "shooting pain":"sharp pain",
    "pain that shoots":"sharp pain",
    "deep ache":"dull pain",
    "heavy ache":"dull pain",
    "burning sensation":"burning pain",
    "hot pain":"burning pain",
    "heat sensation":"burning pain",
    "pain going down":"radiating pain",
    "pain spreading":"radiating pain",
    "pain traveling":"radiating pain",
    "pulsing pain":"throbbing pain",
    "heartbeat-like pain":"throbbing pain",
    "cramp":"cramping",
    "spasm":"cramping",
    "contraction":"cramping",
    "muscle spasm":"spasm",
    "muscle twitch":"spasm",
    "involuntary contraction":"spasm",
    "numb":"numbness",
    "loss of feeling":"numbness",
    "no sensation":"numbness",
    "cannot feel":"numbness",
    "dead feeling":"numbness",
    "pins and needles":"tingling",
    "prickling":"tingling",
    "tingly":"tingling",
    "electric feeling":"tingling",
    "shocking sensation":"tingling",
    "cold feeling":"cold sensation",
    "coldness":"cold sensation",
    "chilly feeling":"cold sensation",
    "hot feeling":"heat sensation",
    "warm sensation":"heat sensation",
    "feels hot":"heat sensation",
    "weak":"weakness",
    "lack of strength":"weakness",
    "cannot lift":"weakness",
    "feels weak":"weakness",
    "unstable":"weakness",
    "giving out":"weakness",
    "cannot move":"loss of mobility",
    "can’t bend":"loss of mobility",
    "stuck joint":"loss of mobility",
    "limited movement":"loss of mobility",
    "hard to move":"restricted movement",
    "reduced mobility":"restricted movement",
    "stiff movement":"restricted movement",
    "stiff":"stiffness",
    "hard to bend":"stiffness",
    "rigid":"stiffness",
    "locked up":"stiffness",
    "swollen":"swelling",
    "puffy":"swelling",
    "edema":"swelling",
    "fluid buildup":"swelling",
    "swelling up":"swelling",
    "redness":"inflammation",
    "hot and swollen":"inflammation",
    "irritation":"inflammation",
    "inflamed":"inflammation",
    "arm hurting":"arm pain",
    "arm ache":"arm pain",
    "pain in the arm":"arm pain",
    "wrist hurting":"wrist pain",
    "wrist ache":"wrist pain",
    "pain in the wrist":"wrist pain",
    "hand hurting":"hand pain",
    "hand ache":"hand pain",
    "pain in the hand":"hand pain",
    "finger hurting":"finger pain",
    "finger ache":"finger pain",
    "elbow hurting":"elbow pain",
    "elbow ache":"elbow pain",
    "pain in the elbow":"elbow pain",
    "shoulder hurting":"shoulder pain",
    "shoulder ache":"shoulder pain",
    "pain in the shoulder":"shoulder pain",
    "back pain":"lower back pain",
    "lumbar pain":"lower back pain",
    "back hurting":"lower back pain",
    "hip hurting":"hip pain",
    "hip ache":"hip pain",
    "pain in the hip":"hip pain",
    "leg hurting":"leg pain",
    "leg ache":"leg pain",
    "pain in the leg":"leg pain",
    "thigh hurting":"thigh pain",
    "thigh ache":"thigh pain",
    "knee hurting":"knee pain",
    "knee ache":"knee pain",
    "pain in the knee":"knee pain",
    "foot hurting":"foot pain",
    "foot ache":"foot pain",
    "pain in the foot":"foot pain",
    "hard to walk":"difficulty walking",
    "trouble walking":"difficulty walking",
    "limping":"difficulty walking",
    "hard to lift":"difficulty lifting",
    "weak grip":"difficulty gripping",
    "cannot hold":"difficulty gripping",
    "locks up":"locking",
    "gets stuck":"locking",
    "feels unstable":"instability",
    "gives out":"instability",
    "feels wobbly":"instability",
    "feels tight":"tightness",
    "pulling sensation":"tightness",
    "feels pressured":"pressure",
    "heavy feeling":"pressure",
    "tired feeling":"fatigue",
    "exhausted":"fatigue",
    "low energy":"fatigue",
    "bruise":"bruising",
    "blue mark":"bruising",
    "black and blue":"bruising"
  };

  const fuzzySearch = (q) => {
    if (!q || q.trim().length < 2) return [];
    const terms = q.toLowerCase().trim().split(/\s+/);
    const expanded = [...terms];
    terms.forEach(term => { if (SYNONYMS[term]) expanded.push(...SYNONYMS[term].split(" ")); });
    // Also check multi-word synonym keys
    const lq = q.toLowerCase().trim();
    if (SYNONYMS[lq]) expanded.push(...SYNONYMS[lq].split(" "));

    return ALL_FINDINGS_FLAT.filter(f => {
      const haystack = (f.name + " " + f.field).toLowerCase();
      return expanded.some(term => haystack.includes(term));
    }).slice(0, 20);
  };

  const searchResults = fuzzySearch(searchQ);

  // ── Local smart mapper (fallback + instant) ──
  // Extracts keywords from free text and matches against all findings
  const localMapper = (text) => {
    const lower = text.toLowerCase().trim();
    if (!lower) return [];

    // ── Step 1: tokenise input into words and 2-word phrases ─────────────
    const words   = lower.split(/[\s,\.;:!?\-\(\)]+/).filter(w => w.length > 1);
    const phrases = words.map((w,i) => i < words.length-1 ? w+" "+words[i+1] : null).filter(Boolean);
    const allTerms = [...new Set([...words, ...phrases, lower])];

    // ── Step 2: synonym expansion (EN only; other langs match by name) ────
    const expanded = new Set(allTerms);
    allTerms.forEach(term => {
      const exp = SYNONYMS[term];
      if (exp) exp.split(" ").forEach(s => expanded.add(s));
    });

    // ── Step 3: score against finding names in active language ────────────
    // For EN: use existing DB.findings name (f.name) as haystack
    // For VN/FR/ZH: also score against FINDING_NAMES_ML direct lookup
    const lang = (_lang || "EN").toUpperCase();
    const mlIndex = FINDING_NAMES_ML[lang]; // undefined for EN — that's fine

    // Direct-match pass: exact name or word hit in ML index (non-EN)
    const directHits = new Map(); // findingId → score
    if (mlIndex) {
      expanded.forEach(term => {
        const fid = mlIndex[term];
        if (fid) directHits.set(fid, (directHits.get(fid) || 0) + 3); // weight direct hits higher
      });
    }

    // Substring pass: score every finding against expanded terms
    const scored = ALL_FINDINGS_FLAT.map(f => {
      // Build multilingual haystack
      const fi18n   = FINDING_I18N[String(f.id)];
      const langName = fi18n ? (fi18n[lang] || "") : "";
      const haystack = (f.name + " " + langName + " " + f.field + " " + f.domain).toLowerCase();

      let score = directHits.get(f.id) || 0;
      expanded.forEach(term => {
        if (term.length > 1 && haystack.includes(term)) score++;
      });
      return { ...f, score };
    }).filter(f => f.score > 0).sort((a,b) => b.score - a.score);

    return scored.slice(0, 15);
  };

  // ── Smart local mapper (instant, no API needed) ──
  const runAIMapper = () => {
    if (!aiText.trim()) return;
    setAiState("loading");
    setAiMessage("");

    // Small delay so the UI re-renders before we run the work
    setTimeout(() => {
      const matches = localMapper(aiText);
      const ids = matches.map(f => f.id);
      if (ids.length > 0) {
        set("activeFindings", [...new Set([...form.activeFindings, ...ids])]);
        const topNames = matches.slice(0,5).map(f=>f.name).join(", ");
        setAiMessage(`✓ Matched ${ids.length} finding${ids.length!==1?"s":""}: ${topNames}${ids.length>5?" and more…":"."}  Tap any chip below to adjust.`);
        setAiState("done");
        setAiText("");
      } else {
        setAiState("error");
        setAiMessage(t("noFindingsMatch") || "No findings matched. Try different words or use the search bar below.");
      }
    }, 80);
  };

  // Important symptom groups to show in intake
  const SHOWN_GROUPS = [
    [(_lang==="VN"?"Năng lượng & Mệt mỏi":_lang==="FR"?"Énergie & Fatigue":_lang==="ZH"?"能量与疲劳":"Energy & Fatigue"), ["EnergyLevel","FatigueTime","Breathing"]],
    [(_lang==="VN"?"Tiêu hóa":_lang==="FR"?"Digestion":_lang==="ZH"?"消化":"Digestion"), ["Appetite","Gas","Nausea","StoolConsistency","Bloating","Heartburn","Vomiting"]],
    [t("sleepAndMind"), ["SleepQuality","Cognitive"]],
    [(_lang==="VN"?"Đau":_lang==="FR"?"Douleur":_lang==="ZH"?"疼痛":"Pain"), ["ChestSensation","AbdominalIssues","AbdoninalIssues","GeneralHealthNotes","MusculoPain"]],
    [t("headAndSenses"), ["Headache","Dizziness","Hearing","VisionHealth"]],
    [t("sweatingTemp"), ["Sweats","TemperatureSense","Chills","Thirst"]],
    [(_lang==="VN"?"Tiết niệu":_lang==="FR"?"Urinaire":_lang==="ZH"?"泌尿":"Urinary"), ["FrequencyPerDay","UrineColor","UrinaryNotes","PainOrBurning"]],
    [(_lang==="VN"?"Hô hấp":_lang==="FR"?"Respiratoire":_lang==="ZH"?"呼吸":"Respiratory"), ["Cough","CoughType","PhlegmColor","Throat","AsthmaFlag"]],
    [t("womensHealth"), ["CycleRegular","FlowAmount","Clots","CrampsSeverity","WomenHealthNotes"]],
    [t("skinAndBody"), ["SkinHealth","Edema","LimbCondition","BoneHealth","PainFeels"]],
    [(_lang==="VN"?"Cảm xúc":_lang==="FR"?"Émotionnel":_lang==="ZH"?"情志":"Emotional"), ["MoodMain"]],
    [(_lang==="VN"?"Tuần hoàn":_lang==="FR"?"Circulatoire":_lang==="ZH"?"循环":"Circulatory"), ["CirculatoryHealth"]],
  ];

  return (
    React.createElement('div', { className: "fu",}
      , isEdit && (
        React.createElement('div', { style: {margin:"10px 14px 0",padding:"9px 13px",background:"var(--gold-lt)",border:"1px solid var(--gold)",borderRadius:8,fontSize:12,color:"var(--gold-dk)",display:"flex",alignItems:"center",gap:8},}, "✏️ "
           , React.createElement('span', null, React.createElement('strong', null, t("editingIntake") ), " — "  , existing.date, " · "  , existing.chiefComplaint||t("noChiefComp"))
        )
      )
      , React.createElement('div', { className: "steps",}, STEPS.map((_,i)=>React.createElement('div', { key: i, className: `step ${i<step?"done":i===step?"cur":""}`,})))
      , React.createElement('div', { className: "strip", style: {paddingBottom:6},}, (_lang==="VN"?"Bước":_lang==="FR"?"Étape":_lang==="ZH"?"步骤":"Step"), " " , step+1, "/", getSteps().length, " — "  , getSteps()[step])

      , step===0 && (
        React.createElement('div', null
          , React.createElement('div', { className: "card",}
            , React.createElement('div', { className: "card-hd",}, React.createElement('span', { className: "pip",}), t("visitInfo") )
            , React.createElement('div', { className: "field",}, React.createElement('label', null, _lang==="VN"?"Ngày khám":_lang==="FR"?"Date":_lang==="ZH"?"日期":"Date"), React.createElement('input', { type: "date", value: form.date, onChange: e=>set("date",e.target.value),} ))
            , React.createElement('div', { className: "field",}, React.createElement('label', null, t("chiefComplaint")  )
              , React.createElement('textarea', { value: form.chiefComplaint, onChange: e=>set("chiefComplaint",e.target.value), placeholder: _lang==="VN"?"Lý do khám chính…":_lang==="FR"?"Plainte principale…":_lang==="ZH"?"主要主诉…":"Primary presenting complaint…"  ,})
            )
            , React.createElement('div', { className: "field",}, React.createElement('label', null, t("otherConcern1")  )
              , React.createElement('input', { value: form.otherConcern1, onChange: e=>set("otherConcern1",e.target.value), placeholder: _lang==="VN"?"Vấn đề thứ hai…":_lang==="FR"?"Préoccupation secondaire…":_lang==="ZH"?"其他关注问题…":"Secondary concern…" ,})
            )
            , React.createElement('div', { className: "field",}, React.createElement('label', null, t("otherConcern2")  )
              , React.createElement('input', { value: form.otherConcern2, onChange: e=>set("otherConcern2",e.target.value), placeholder: t("addlConcern") ,})
            )
            , React.createElement('div', { className: "field",}, React.createElement('label', null, t("illnessSince")  )
              , React.createElement(SingleChip, { options: (LV["ILLNESS_SINCE_"+(_lang||"EN").toUpperCase()]||LV["ILLNESS_SINCE"]||[]), value: form.illnessSince, onChange: v=>set("illnessSince",v),} )
            )
          )
          , React.createElement('div', { className: "card",}
            , React.createElement('div', { className: "card-hd",}, React.createElement('span', { className: "pip",}), t("lifestyleHistory")  )
            , React.createElement('div', { className: "field",}, React.createElement('label', null, t("lifestyle") )
              , React.createElement(Chips, { options: (_lang==="VN"
                ? ["Hút thuốc","Rượu bia","Ít vận động","Năng động","Căng thẳng cao","Ăn uống kém","Ngủ không đều","Ca đêm"]
                : _lang==="FR"
                ? ["Tabagisme","Alcool","Sédentaire","Actif","Stress élevé","Mauvaise alimentation","Sommeil irrégulier","Travail de nuit"]
                : _lang==="ZH"
                ? ["吸烟","饮酒","久坐","积极活动","高压力","饮食不规律","睡眠不规律","夜班"]
                : ["Smoking","Alcohol","Sedentary","Active",t("highStress"),t("poorDiet"),t("irregSleep"),t("nightShifts")]), value: form.lifestyle, onChange: v=>set("lifestyle",v),} )
            )
            , React.createElement('div', { className: "field",}, React.createElement('label', null, t("medHistory")   )
              , React.createElement('textarea', { value: form.medicalHistory, onChange: e=>set("medicalHistory",e.target.value), placeholder: _lang==="VN"?"Bệnh cũ, phẫu thuật, thuốc đang dùng…":_lang==="FR"?"Antécédents, chirurgies, médicaments en cours…":_lang==="ZH"?"既往病史、手术、当前用药…":"Past illnesses, surgeries, current medications…"    ,})
            )
          )
        )
      )

      , step===1 && (
        React.createElement('div', null
          /* ── SMART FINDING MAPPER ── */
          , React.createElement('div', { className: "card", style: {border:"1px solid var(--teal)",background:"linear-gradient(135deg,#f0fafa 0%,#e4f4f4 100%)"},}
            , React.createElement('div', { className: "card-hd",}, React.createElement('span', { className: "pip teal" ,}), _lang==="VN"?"⚡ Tra Cứu Thông Minh":_lang==="FR"?"⚡ Correspondance Intelligente":_lang==="ZH"?"⚡ 智能症状匹配":"⚡ Smart Finding Mapper"   )
            , React.createElement('p', { style: {fontSize:12,color:"var(--muted)",marginBottom:10,lineHeight:1.6},}, _lang==="VN"?"Mô tả triệu chứng bằng ngôn ngữ thông thường — kể cả từ dân gian hoặc tiếng Việt lẫn tiếng Anh. Hệ thống sẽ tự tra cứu.":_lang==="FR"?"Décrivez les symptômes en langage courant — termes populaires ou mixtes acceptés. Les résultats apparaissent instantanément.":_lang==="ZH"?"用日常语言描述患者症状——包括俗语或混合表达，系统将即时匹配。":"Describe the patient's presentation in plain language — including lay terms, synonyms, or mixed descriptions. Findings are matched instantly."

            )
            , React.createElement('div', { className: "field",}
              , React.createElement('textarea', {
                value: aiText,
                onChange: e=>{setAiText(e.target.value);setAiState("idle");setAiMessage("");},
                placeholder: _lang==="VN"
                  ? "VD: Mất ngủ, mệt mỏi ban ngày, ăn kém, khó thở, hồi hộp…"
                  : _lang==="FR"
                  ? "Ex: Insomnie, fatigue diurne, manque d'appétit, essoufflement, palpitations…"
                  : _lang==="ZH"
                  ? "例：失眠，白天疲倦，食欲不振，气短，心悸…"
                  : "e.g. Insomnia, tired during the day, sluggish, poor appetite, shortness of breath, palpitations…"            ,
                rows: 3,
                style: {background:"#fff"},
                disabled: aiState==="loading",}
              )
            )
            , aiState==="loading" && (
              React.createElement('div', { style: {fontSize:13,color:"var(--teal)",padding:"6px 0"},}, "⚡ Matching…"

              )
            )
            , aiMessage && aiState!=="loading" && (
              React.createElement('div', { style: {fontSize:12,padding:"8px 10px",borderRadius:6,marginBottom:8,
                background: aiState==="done" ? "#e8f5e8" : "#fde8e8",
                color: aiState==="done" ? "#2a6a2a" : "#8b2020",
                border: aiState==="done" ? "1px solid #b8d8b8" : "1px solid #e8b8b8",
                lineHeight:1.5},}
                , aiMessage
              )
            )
            , React.createElement('button', { className: "btn btn-primary btn-full"  , onClick: runAIMapper,
              disabled: aiState==="loading" || !aiText.trim(),}
              , aiState==="loading"
              ? (_lang==="VN" ? "Đang xử lý…" : _lang==="FR" ? "Traitement…" : _lang==="ZH" ? "处理中…" : "Matching…")
              : (_lang==="VN" ? "⚡ Tra cứu" : _lang==="FR" ? "⚡ Analyser" : _lang==="ZH" ? "⚡ 匹配" : "⚡ Map Findings")
            )
          )

          /* ── FUZZY SEARCH ── */
          , React.createElement('div', { className: "card",}
            , React.createElement('div', { className: "card-hd",}, React.createElement('span', { className: "pip teal" ,}), _lang==="VN"?"🔍 Tìm kiếm phát hiện":_lang==="FR"?"🔍 Rechercher observations":_lang==="ZH"?"🔍 搜索发现":"🔍 Search Findings"  )
            , React.createElement('p', { style: {fontSize:12,color:"var(--muted)",marginBottom:8,lineHeight:1.5},}, _lang==="VN"?"Nhập bất kỳ triệu chứng hoặc từ khóa. Từ đồng nghĩa được hỗ trợ — thử \"mệt mỏi\", \"đau bụng\", \"mất ngủ\".":_lang==="FR"?"Saisissez un symptôme ou mot-clé. Les synonymes sont acceptés — essayez \"fatigue\", \"mal au ventre\", \"insomnie\".":_lang==="ZH"?"输入任何症状或关键词。支持同义词——试试\"疲劳\"、\"肚子痛\"、\"失眠\"。":"Type any symptom, sensation, or keyword. Synonyms are supported — try \"tired\", \"belly pain\", \"can't sleep\"."

            )
            , React.createElement('input', {
              style: {width:"100%",padding:"9px 12px",border:"1px solid var(--border)",borderRadius:20,background:"var(--warm)",fontFamily:"var(--sans)",fontSize:14,outline:"none"},
              placeholder: t("searchFindings") ,
              value: searchQ,
              onChange: e=>setSearchQ(e.target.value),}
            )
            , searchQ.trim().length >= 2 && (
              React.createElement('div', { style: {marginTop:10},}
                , searchResults.length === 0
                  ? React.createElement('p', { style: {fontSize:12,color:"var(--muted)"},}, t("noFindingsMatch")     )
                  : React.createElement(React.Fragment, null
                      , React.createElement('p', { style: {fontSize:11,color:"var(--muted)",marginBottom:6},}, searchResults.length, " result" , searchResults.length!==1?"s":"", ":")
                      , React.createElement('div', { className: "chips",}
                        , searchResults.map(f=>(
                          React.createElement('div', { key: f.id, className: `chip ${isFActive(f.id)?"on-red":""}`,
                            onClick: ()=>{toggleFinding(f.id);},
                            style: {border: isFActive(f.id) ? undefined : "1px solid var(--teal)",color: isFActive(f.id) ? undefined : "var(--teal)"},}
                            , f.name
                          )
                        ))
                      )
                    )
                
              )
            )
          )

          /* Active findings summary bar */
          , form.activeFindings.length > 0 && (
            React.createElement('div', { style: {margin:"0 14px 4px",padding:"8px 12px",background:"var(--teal-lt)",borderRadius:8,border:"1px solid var(--teal)",fontSize:12,color:"var(--teal-dk)"},}
              , React.createElement('strong', null, form.activeFindings.length, " finding" , form.activeFindings.length!==1?(_lang==="VN"?" phát hiện":"s"):"", _lang==="VN"?" được chọn":_lang==="FR"?" sélectionnée(s)":_lang==="ZH"?" 项已选":""+" selected" )
              , " — ", _lang==="VN"?"nhấn chip bên dưới để bật/tắt":_lang==="FR"?"appuyez sur une puce ci-dessous pour activer/désactiver":_lang==="ZH"?"点击下方标签切换选中状态":"tap any chip below to toggle on/off"
            )
          )

          , SHOWN_GROUPS.map(([groupName, fields]) => {
            const groupFindings = fields.flatMap(f => SYMPTOM_GROUPS[f]||[]);
            if (groupFindings.length === 0) return null;
            const uniqueFindings = [...new Map(groupFindings.map(x=>[x.id,x])).values()];
            return (
              React.createElement('div', { className: "card", key: groupName,}
                , React.createElement('div', { className: "card-hd",}, React.createElement('span', { className: "pip teal" ,}), t(GROUP_I18N[groupName])||groupName)
                , React.createElement('div', { className: "chips",}
                  , uniqueFindings.map(f => (
                    React.createElement('div', { key: f.id, className: `chip ${isFActive(f.id)?"on-red":""}`,
                      onClick: ()=>toggleFinding(f.id),}, (FINDING_I18N[String(f.id)]&&FINDING_I18N[String(f.id)][_lang])||f.name)
                  ))
                )
              )
            );
          })
          , React.createElement('div', { className: "card",}
            , React.createElement('div', { className: "card-hd",}, React.createElement('span', { className: "pip teal" ,}), t("tongueSigns")   )
            , React.createElement('p', { style: {fontSize:11,color:"var(--muted)",marginBottom:8},}, t("selectTongueFnd")       )
            , React.createElement('div', { className: "chips",}
              , TONGUE_FINDINGS.map(f=>(
                React.createElement('div', { key: f.id, className: `chip ${isFActive(f.id)?"on":""}`, onClick: ()=>toggleFinding(f.id),}, (FINDING_I18N[String(f.id)]&&FINDING_I18N[String(f.id)][_lang])||f.name)
              ))
            )
          )
        )
      )

      , step===2 && (
        React.createElement('div', null
          /* ── TONGUE EXAMINATION ── */
          , React.createElement('div', { className: "strip", style: {paddingTop:14},}, t("tongueExam")  )
          , React.createElement('div', { className: "card",}
            , React.createElement('div', { className: "field",}, React.createElement('label', null, t("tongueBodyColor") )
              , React.createElement(SingleChip, { options: (LV["TONGUE_BODY_COLOR_"+(_lang||"EN").toUpperCase()]||LV["TONGUE_BODY_COLOR"]||[]), value: form.tongueBodyColor, onChange: v=>set("tongueBodyColor",v),} )
            )
            , React.createElement('div', { className: "field",}, React.createElement('label', null, t("tongueCoating") )
              , React.createElement(SingleChip, { options: (LV["TONGUE_COATING_COLOR_"+(_lang||"EN").toUpperCase()]||LV["TONGUE_COATING_COLOR"]||[]), value: form.tongueCoating, onChange: v=>set("tongueCoating",v),} )
            )
            , React.createElement('div', { className: "field",}, React.createElement('label', null, t("tongueMoisture"))
              , React.createElement(SingleChip, { options: (LV["TONGUE_MOISTURE_"+(_lang||"EN").toUpperCase()]||LV["TONGUE_MOISTURE"]||["Normal","Dry","Very dry","Wet","Sticky"]), value: form.tongueMoisture, onChange: v=>set("tongueMoisture",v),} )
            )
            , React.createElement('hr', null)
            , React.createElement('div', { className: "field",}
              , React.createElement('label', null, t("addTongueSigns")  )
              , React.createElement('div', { className: "chips",}
                , TONGUE_FINDINGS.filter(f=>!isFActive(f.id)).slice(0,12).map(f=>(
                  React.createElement('div', { key: f.id, className: `chip ${isFActive(f.id)?"on":""}`, onClick: ()=>toggleFinding(f.id),}, (FINDING_I18N[String(f.id)]&&FINDING_I18N[String(f.id)][_lang])||f.name)
                ))
                , TONGUE_FINDINGS.filter(f=>isFActive(f.id)).map(f=>(
                  React.createElement('div', { key: f.id, className: "chip on" , onClick: ()=>toggleFinding(f.id),}, (FINDING_I18N[String(f.id)]&&FINDING_I18N[String(f.id)][_lang])||f.name)
                ))
              )
            )
            , React.createElement('div', { className: "field",}, React.createElement('label', null, t("tongueNotes") )
              , React.createElement('textarea', { value: form.tongueNotes, onChange: e=>set("tongueNotes",e.target.value), placeholder: _lang==="VN"?"Hình dạng, phân bố rêu, tĩnh mạch dưới lưỡi…":_lang==="FR"?"Forme, distribution de l'enduit, veines sublinguales…":_lang==="ZH"?"舌形、苔分布、舌下静脉…":"Shape, coating distribution, sublingual veins…"    , rows: 2,})
            )
          )

          /* ── PULSE EXAMINATION ── */
          , React.createElement('div', { className: "strip", style: {paddingTop:6},}, _lang==="VN"?"🤲 Khám Mạch":_lang==="FR"?"🤲 Examen du Pouls":_lang==="ZH"?"🤲 脉诊":"🤲 Pulse Examination"  )
          , React.createElement('div', { className: "card",}
            , React.createElement('div', { className: "field",}, React.createElement('label', null, t("pulseQualities")  )
              , React.createElement(Chips, { options: (LV["PULSE_QUALITY_"+(_lang||"EN").toUpperCase()]||LV["PULSE_QUALITY"]||[]), value: form.pulseQualities, onChange: v=>set("pulseQualities",v),} )
            )
            , React.createElement('hr', null)
            , React.createElement('div', { className: "row2",}
              , React.createElement('div', { className: "field",}, React.createElement('label', null, t("pulseStrengthR")  )
                , React.createElement(SingleChip, { options: (LV["PULSE_STRENGTH_"+(_lang||"EN").toUpperCase()]||LV["PULSE_STRENGTH"]||["Weak","Moderate","Strong"]), value: form.pulseStrengthR, onChange: v=>set("pulseStrengthR",v),} )
              )
              , React.createElement('div', { className: "field",}, React.createElement('label', null, t("pulseStrengthL")  )
                , React.createElement(SingleChip, { options: (LV["PULSE_STRENGTH_"+(_lang||"EN").toUpperCase()]||LV["PULSE_STRENGTH"]||["Weak","Moderate","Strong"]), value: form.pulseStrengthL, onChange: v=>set("pulseStrengthL",v),} )
              )
            )
            , React.createElement('hr', null)
            , React.createElement('div', { className: "field",}
              , React.createElement('label', null, t("pulseRelFindings") )
              , React.createElement('div', { className: "chips",}
                , PULSE_FINDINGS.map(f=>(
                  React.createElement('div', { key: f.id, className: `chip ${isFActive(f.id)?"on":""}`, onClick: ()=>toggleFinding(f.id),}, (FINDING_I18N[String(f.id)]&&FINDING_I18N[String(f.id)][_lang])||f.name)
                ))
              )
            )
            , React.createElement('div', { className: "field", style: {marginTop:4},}, React.createElement('label', null, t("pulseNotes") )
              , React.createElement('textarea', { value: form.pulseNotes, onChange: e=>set("pulseNotes",e.target.value), placeholder: _lang==="VN"?"Quan sát theo vị trí, nhịp, độ sâu…":_lang==="FR"?"Observations par position, rythme, profondeur…":_lang==="ZH"?"各部位脉象观察、节律、深度…":"Position-specific observations, rhythm, depth…"   , rows: 2,})
            )
          )
          , React.createElement('div', { className: "strip", style: {paddingTop:6},}, `📝 ${t("practNotesSec")}`  )
          , React.createElement('div', { className: "card",}
            , React.createElement('div', { className: "field",}
              , React.createElement('label', null, t("palpationSec")   )
              , React.createElement('textarea', { value: form.practitionerNotes, onChange: e=>set("practitionerNotes",e.target.value), placeholder: _lang==="VN"?"Sờ nắn bụng, da, nhiệt độ cơ thể, nhận xét lâm sàng…":_lang==="FR"?"Palpation abdominale, peau, température, impressions cliniques…":_lang==="ZH"?"腹部触诊、皮肤、体温、临床印象…":"Abdominal palpation, skin, body temperature, clinical impressions…"      ,})
            )
          )
        )
      )

      , step===3 && (
        React.createElement('div', null
          , React.createElement('div', { className: "card",}
            , React.createElement('div', { className: "card-hd",}, React.createElement('span', { className: "pip",}), (_lang==="VN"?"Xem lại":_lang==="FR"?"Récapitulatif":_lang==="ZH"?"复诊摘要":"Review"))
            , React.createElement('p', { style: {fontSize:12,color:"var(--muted)",marginBottom:6},}, React.createElement('strong', null, _lang==="VN"?"Ngày:":_lang==="FR"?"Date:":_lang==="ZH"?"日期:":"Date:"), " " , form.date)
            , React.createElement('p', { style: {fontSize:13,marginBottom:4},}, React.createElement('strong', null, t("chiefComplaintColon") ), " " , form.chiefComplaint||"—")
            , form.otherConcern1 && React.createElement('p', { style: {fontSize:13,marginBottom:4},}, React.createElement('strong', null, t("concern1") ), " " , form.otherConcern1)
            , form.otherConcern2 && React.createElement('p', { style: {fontSize:13,marginBottom:4},}, React.createElement('strong', null, t("concern2") ), " " , form.otherConcern2)
            , React.createElement('hr', null)
            , React.createElement('p', { style: {fontSize:11,color:"var(--muted)",marginBottom:6,textTransform:"uppercase",letterSpacing:".06em"},}, (_lang==="VN"?"Bệnh trạng (":_lang==="FR"?"Constatations (":_lang==="ZH"?"活跃发现 (":"Active Findings (")  , form.activeFindings.length, ")")
            , React.createElement('div', { style: {display:"flex",flexWrap:"wrap",gap:4},}
              , form.activeFindings.map(id=>{
                const f = getFinding(id);
                return React.createElement('span', { key: id, className: "chip on-red" , style: {fontSize:11,padding:"3px 8px"},}, (FINDING_I18N[String(id)]&&FINDING_I18N[String(id)][_lang])||f[1]);
              })
            )
            , React.createElement('hr', null)
            , React.createElement('p', { style: {fontSize:12,color:"var(--muted)"},}, t("tonguePrefix")+" "
               , [form.tongueBodyColor,form.tongueCoating,form.tongueMoisture].filter(Boolean).map(v=>tLV(v)||v).join(" · ")||"—"
            )
            , React.createElement('p', { style: {fontSize:12,color:"var(--muted)",marginTop:3},}, t("pulsePrefix")+" "
               , form.pulseQualities.map(v=>tLV(v)||v).join(", ")||"—"
            )
          )
        )
      )

      , React.createElement('div', { style: {display:"flex",gap:8,padding:"8px 14px 16px"},}
        , React.createElement('button', { className: "btn btn-outline" , style: {flex:1}, onClick: step===0?onCancel:()=>setStep(s=>s-1),}
          , step===0?(_lang==="VN"?"Hủy":_lang==="FR"?"Annuler":_lang==="ZH"?"取消":"Cancel"):(_lang==="VN"?"← Quay lại":_lang==="FR"?"← Retour":_lang==="ZH"?"← 返回":"← Back")
        )
        , step < getSteps().length-1
          ? React.createElement('button', { className: "btn btn-primary" , style: {flex:2}, onClick: ()=>setStep(s=>s+1),}, t("btnNext") )
          : React.createElement('button', { className: "btn btn-gold" , style: {flex:2}, onClick: ()=>(()=>{ try { localStorage.removeItem(INTAKE_DRAFT_KEY); } catch {} onSave(form); })(),}, isEdit ? t("btnUpdateAssess") : t("btnSaveAssess"))
        
      )
    )
  );
}

// ─── POINT PILL ───────────────────────────────────────────────────────────
function PointPill({ code, role, name }) {
  const cls = {tonify:"pp-tonify",clear:"pp-clear",regulate:"pp-regulate",drain:"pp-drain",move:"pp-move"}[role]||"pp-default";
  return React.createElement('span', { className: `point-pill ${cls}`, title: `${name||code} (${role})`,}, code);
}

// ─── PDF REPORT GENERATOR ────────────────────────────────────────────────
function printReport({ patient, intake, planPoints, planNotes, rootPattern, branchPattern, ccMatches, oc1Matches, oc2Matches }) {
  const date = new Date().toLocaleDateString("en-CA");
  const intakeDate = intake.date || date;

  // Source colour map for point badges
  const srcColors = {Root:"#2a5a2a",Branch:"#0f4040",CC:"#8a6420",OC1:"#503080",OC2:"#503080",Manual:"#8b2020"};
  const srcBgs    = {Root:"#d4ecd4",Branch:"#d0eaea",CC:"#f0e4c0",OC1:"#ede8f8",OC2:"#ede8f8",Manual:"#f5d5d5"};

  const pointBadges = planPoints.map(pt =>
    `<span style="display:inline-block;margin:2px 3px;padding:3px 10px;border-radius:4px;
      font-size:12px;font-weight:700;background:${srcBgs[pt.source]||"#eee"};
      color:${srcColors[pt.source]||"#333"}">${pt.code}</span>`
  ).join('');

  const ccTop  = ccMatches[0];
  const oc1Top = oc1Matches[0];
  const oc2Top = oc2Matches[0];

  const symptomSection = (label, complaint, topMatch) => {
    if (!complaint) return '';
    const pts = topMatch ? topMatch.pts.map(p =>
      `<span style="display:inline-block;margin:2px 3px;padding:2px 8px;border-radius:4px;
        font-size:11px;font-weight:600;background:#f0e4c0;color:#8a6420">${p[0]}</span>`
    ).join('') : `<em style="color:#999;font-size:11px">${_lang==="VN"?"Không tìm thấy":_lang==="FR"?"Aucune correspondance":_lang==="ZH"?"未找到匹配":"No match found"}</em>`;
    return `
      <div style="margin-bottom:10px">
        <div style="font-size:11px;text-transform:uppercase;letter-spacing:.07em;color:#6b6050;margin-bottom:3px">${label}</div>
        <div style="font-size:13px;font-weight:500;color:#1a1208;margin-bottom:4px">${complaint}</div>
        ${topMatch ? `<div style="font-size:11px;color:#888;margin-bottom:4px;font-style:italic">${_lang==="VN"?"Khớp với":_lang==="FR"?"Correspondance":_lang==="ZH"?"匹配":"Matched"}: ${topMatch.en}</div>` : ''}
        <div>${pts}</div>
      </div>`;
  };

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <title>AAIDA Report — ${patient.firstName} ${patient.lastName} — ${intakeDate}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Serif:wght@400;600&family=Noto+Sans:wght@300;400;500&display=swap" rel="stylesheet"/>
  <style>
    * { box-sizing:border-box; margin:0; padding:0; }
    body { font-family:'Noto Sans',sans-serif; color:#1a1208; background:#fff;
           font-size:13px; line-height:1.6; }
    @page { size:A4; margin:18mm 16mm 18mm 16mm; }
    @media print {
      body { -webkit-print-color-adjust:exact; print-color-adjust:exact; }
      .no-print { display:none !important; }
      .page-break { page-break-before:always; }
    }

    /* Header */
    .header { display:flex; justify-content:space-between; align-items:flex-end;
               border-bottom:2px solid #1a1208; padding-bottom:10px; margin-bottom:16px; }
    .header-left h1 { font-family:'Noto Serif',serif; font-size:22px; letter-spacing:.06em; }
    .header-left p  { font-size:10px; color:#6b6050; letter-spacing:.1em;
                      text-transform:uppercase; margin-top:2px; }
    .header-right   { text-align:right; font-size:11px; color:#6b6050; line-height:1.8; }
    .header-right strong { color:#1a1208; }

    /* Patient banner */
    .patient-banner { background:#1a1208; color:#f5f0e8; padding:12px 16px;
                      border-radius:6px; margin-bottom:16px;
                      display:flex; justify-content:space-between; align-items:center; }
    .patient-banner h2 { font-family:'Noto Serif',serif; font-size:17px; }
    .patient-banner p  { font-size:11px; opacity:.7; margin-top:2px; }
    .patient-banner .date { font-size:12px; opacity:.8; text-align:right; }

    /* Sections */
    .section { margin-bottom:14px; border:1px solid #ddd4c0; border-radius:6px; overflow:hidden; }
    .section-hd { background:#f5f0e8; padding:7px 12px; font-size:10px; font-weight:600;
                  letter-spacing:.1em; text-transform:uppercase; color:#6b6050;
                  border-bottom:1px solid #ddd4c0; display:flex; align-items:center; gap:6px; }
    .section-hd .dot { width:7px; height:7px; border-radius:50%; flex-shrink:0; }
    .section-body { padding:12px; }

    /* Two-col layout */
    .two-col { display:grid; grid-template-columns:1fr 1fr; gap:12px; }

    /* Complaint block */
    .complaint-block { background:#faf7f2; border:1px solid #ddd4c0; border-radius:5px;
                       padding:10px 12px; margin-bottom:8px; }
    .complaint-block .label { font-size:10px; text-transform:uppercase; letter-spacing:.07em;
                               color:#6b6050; margin-bottom:3px; }
    .complaint-block .text  { font-size:13px; font-weight:500; }

    /* Pattern blocks */
    .pattern-block { border-radius:5px; padding:10px 12px; margin-bottom:8px; }
    .pattern-root   { background:#e8f5e8; border:1px solid #b8d8b8; }
    .pattern-branch { background:#d0eaea; border:1px solid #9dd0d0; }
    .pattern-name   { font-family:'Noto Serif',serif; font-size:14px; font-weight:600; margin-bottom:4px; }
    .pattern-tag    { display:inline-block; font-size:9px; font-weight:700; letter-spacing:.08em;
                      text-transform:uppercase; padding:2px 7px; border-radius:10px; margin-left:6px; }
    .tag-root   { background:#2a5a2a; color:#fff; }
    .tag-branch { background:#0f4040; color:#fff; }
    .principles { margin:6px 0; }
    .principles li { font-size:12px; color:#2a5a2a; margin-left:14px; }

    /* Points */
    .points-section { margin-top:6px; }
    .points-label { font-size:10px; text-transform:uppercase; letter-spacing:.07em;
                    color:#6b6050; margin-bottom:5px; }

    /* Final plan */
    .final-plan-box { background:#1a1208; color:#f5f0e8; border-radius:6px;
                      padding:14px 16px; margin-bottom:14px; }
    .final-plan-box h3 { font-family:'Noto Serif',serif; font-size:14px; margin-bottom:10px;
                          letter-spacing:.04em; opacity:.9; }
    .notes-box { background:#faf7f2; border:1px solid #ddd4c0; border-radius:5px;
                 padding:10px 12px; font-size:12px; color:#1a1208; line-height:1.7;
                 white-space:pre-wrap; min-height:40px; }

    /* Findings list */
    .finding-chip { display:inline-block; margin:2px 3px; padding:2px 8px;
                    border-radius:12px; font-size:11px; background:#f5f0e8;
                    border:1px solid #ddd4c0; color:#1a1208; }
    .finding-chip.tongue { background:#d0eaea; border-color:#9dd0d0; }
    .finding-chip.pulse  { background:#f0e4c0; border-color:#c8b070; }

    /* Footer */
    .footer { margin-top:20px; padding-top:10px; border-top:1px solid #ddd4c0;
              font-size:9px; color:#9a8c7a; display:flex; justify-content:space-between;
              line-height:1.6; }

    /* Print button */
    .print-btn { position:fixed; bottom:24px; right:24px; padding:12px 28px;
                 background:#b5872a; color:#fff; border:none; border-radius:8px;
                 font-size:14px; cursor:pointer; font-family:'Noto Sans',sans-serif;
                 box-shadow:0 4px 16px rgba(0,0,0,.2); z-index:100; }
    .print-btn:hover { background:#8a6420; }
    .close-btn { position:fixed; bottom:24px; right:200px; padding:12px 20px;
                 background:#fff; color:#1a1208; border:1px solid #ddd4c0;
                 border-radius:8px; font-size:14px; cursor:pointer;
                 font-family:'Noto Sans',sans-serif; box-shadow:0 4px 16px rgba(0,0,0,.1); }
  </style>
</head>
<body>

<button class="no-print print-btn" onclick="window.print()">${_lang==="VN"?"🖨 In / Lưu PDF":_lang==="FR"?"🖨 Imprimer / Enregistrer PDF":_lang==="ZH"?"🖨 打印/保存PDF":"🖨 Print / Save PDF"}</button>
<button class="no-print close-btn" onclick="window.close()">${_lang==="VN"?"✕ Đóng":_lang==="FR"?"✕ Fermer":_lang==="ZH"?"✕ 关闭":"✕ Close"}</button>

<!-- Header -->
<div class="header">
  <div class="header-left">
    <h1>AAIDA</h1>
    <p>${_lang==="VN"?"Trợ lý Chẩn đoán AI Châm cứu · Báo cáo Lâm sàng Đông y":_lang==="FR"?"Assistant IA de Diagnostic en Acupuncture · Rapport Clinique MTC":_lang==="ZH"?"针灸AI诊断助手 · 中医临床报告":"Acupuncture AI Diagnosis Assistant · TCM Clinical Report"}</p>
  </div>
  <div class="header-right">
    <div>${_lang==="VN"?"Ngày báo cáo":_lang==="FR"?"Date du rapport":_lang==="ZH"?"报告日期":"Report date"}: <strong>${date}</strong></div>
    <div>${_lang==="VN"?"Ngày khám":_lang==="FR"?"Date de consultation":_lang==="ZH"?"就诊日期":"Intake date"}: <strong>${intakeDate}</strong></div>
  </div>
</div>

<!-- Patient -->
<div class="patient-banner">
  <div>
    <h2>${patient.firstName} ${patient.lastName}</h2>
    <p>${_lang==="VN"?"Ngày sinh":_lang==="FR"?"Naissance":_lang==="ZH"?"出生日期":"DOB"}: ${patient.dob||"—"} · ${patient.gender||"—"}</p>
  </div>
  <div class="date">
    ${intake.chiefComplaint ? `<div style="font-size:12px;font-style:italic;max-width:220px;text-align:right">"${intake.chiefComplaint}"</div>` : ''}
  </div>
</div>

<!-- Complaints -->
<div class="section">
  <div class="section-hd"><span class="dot" style="background:#b5872a"></span>${_lang==="VN"?"Trình bày Lâm sàng":_lang==="FR"?"Présentation Clinique":_lang==="ZH"?"临床表现":"Clinical Presentation"}</div>
  <div class="section-body">
    <div class="two-col">
      <div>
        ${intake.chiefComplaint ? `<div class="complaint-block"><div class="label">${_lang==="VN"?"Lý do khám":_lang==="FR"?"Plainte principale":_lang==="ZH"?"主诉":"Chief Complaint"}</div><div class="text">${intake.chiefComplaint}</div>${intake.illnessSince?`<div style="font-size:11px;color:#888;margin-top:2px">${_lang==="VN"?"Thời gian":_lang==="FR"?"Durée":_lang==="ZH"?"病程":"Duration"}: ${intake.illnessSince}</div>`:''}</div>` : ''}
        ${intake.otherConcern1  ? `<div class="complaint-block"><div class="label">${_lang==="VN"?"Vấn đề khác 1":_lang==="FR"?"Autre préoccupation 1":_lang==="ZH"?"其他关注1":"Other Concern 1"}</div><div class="text">${intake.otherConcern1}</div></div>` : ''}
        ${intake.otherConcern2  ? `<div class="complaint-block"><div class="label">${_lang==="VN"?"Vấn đề khác 2":_lang==="FR"?"Autre préoccupation 2":_lang==="ZH"?"其他关注2":"Other Concern 2"}</div><div class="text">${intake.otherConcern2}</div></div>` : ''}
      </div>
      <div>
        ${(intake.tongueBodyColor||intake.tongueCoating||intake.tongueMoisture||intake.tongueNotes) ? `
        <div class="complaint-block">
          <div class="label">${_lang==="VN"?"Lưỡi":_lang==="FR"?"Langue":_lang==="ZH"?"舌象":"Tongue"}</div>
          <div style="font-size:12px">${[intake.tongueBodyColor,intake.tongueCoating,intake.tongueMoisture].filter(Boolean).join(' · ')||'—'}</div>
          ${intake.tongueNotes?`<div style="font-size:11px;color:#888;margin-top:2px">${intake.tongueNotes}</div>`:''}
        </div>` : ''}
        ${(intake.pulseQualities&&intake.pulseQualities.length||intake.pulseNotes) ? `
        <div class="complaint-block">
          <div class="label">${_lang==="VN"?"Mạch":_lang==="FR"?"Pouls":_lang==="ZH"?"脉象":"Pulse"}</div>
          <div style="font-size:12px">${(intake.pulseQualities||[]).join(', ')||'—'}</div>
          ${intake.pulseStrengthR||intake.pulseStrengthL?`<div style="font-size:11px;color:#888">${_lang==="VN"?"P":_lang==="FR"?"D":_lang==="ZH"?"右":"R"}: ${intake.pulseStrengthR||'—'} · ${_lang==="VN"?"T":_lang==="FR"?"G":_lang==="ZH"?"左":"L"}: ${intake.pulseStrengthL||'—'}</div>`:''}
          ${intake.pulseNotes?`<div style="font-size:11px;color:#888;margin-top:2px">${intake.pulseNotes}</div>`:''}
        </div>` : ''}
      </div>
    </div>
  </div>
</div>

<!-- Active Findings -->
${(intake.activeFindings||[]).length > 0 ? `
<div class="section">
  <div class="section-hd"><span class="dot" style="background:#1d6a6a"></span>${_lang==="VN"?"Phát hiện hiện có (":_lang==="FR"?"Observations actives (":_lang==="ZH"?"活跃发现 (":"Active Findings ("}${intake.activeFindings.length})</div>
  <div class="section-body">
    ${intake.activeFindings.map(id => {
      const f = DB.findings[String(id)];
      if (!f) return '';
      const cls = f[2]==='Tongue'?'tongue':f[2]==='Pulse'?'pulse':'';
      return `<span class="finding-chip ${cls}">${(FINDING_I18N[String(id)]&&FINDING_I18N[String(id)][_lang])||f[1]}</span>`;
    }).join('')}
  </div>
</div>` : ''}

<!-- TCM Pattern Assessment -->
<div class="section">
  <div class="section-hd"><span class="dot" style="background:#2a5a2a"></span>${_lang==="VN"?"Đánh giá Mẫu Đông Y — Điều trị truyền thống":_lang==="FR"?"Évaluation du Modèle MTC — Traitement traditionnel":_lang==="ZH"?"中医证型评估 — 传统治疗":"TCM Pattern Assessment — Traditional Treatment"}</div>
  <div class="section-body">
    ${rootPattern ? `
    <div class="pattern-block pattern-root">
      <div class="pattern-name">
        ${tPattern(rootPattern.name, rootPattern.id)}
        <span class="pattern-tag tag-root">${t("rootPrefix")} · Ben 本</span>
      </div>
      ${rootPattern.principles.filter(p=>p[1]).length > 0 ? `
      <ul class="principles">
        ${rootPattern.principles.filter(p=>p[1]).map(p=>`<li>${tPrinciple(rootPattern.id, p[0])}</li>`).join('')}
      </ul>` : ''}
      <div class="points-section">
        <div class="points-label">${_lang==="VN"?"Huyệt":_lang==="FR"?"Points":_lang==="ZH"?"穴位":"Points"}</div>
        ${rootPattern.points.filter(p=>p[2]).map(p=>`<span style="display:inline-block;margin:2px 3px;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:700;background:#d4ecd4;color:#2a5a2a">${p[0]}</span>`).join('')}
      </div>
    </div>` : '<p style="font-size:12px;color:#888">${_lang==="VN"?"Chưa chọn mẫu Bản.":_lang==="FR"?"Aucun modèle racine.":_lang==="ZH"?"未选择本证。":"No Root pattern selected."}</p>'}

    ${branchPattern ? `
    <div class="pattern-block pattern-branch">
      <div class="pattern-name">
        ${tPattern(branchPattern.name, branchPattern.id)}
        <span class="pattern-tag tag-branch">${_lang==="VN"?"Tiêu · Biao 標":_lang==="FR"?"Branche · Biao 標":_lang==="ZH"?"标 · Biao 標":"Branch · Biao 標"}</span>
      </div>
      ${branchPattern.principles.filter(p=>p[2]).length > 0 ? `
      <ul class="principles" style="color:#0f4040">
        ${branchPattern.principles.filter(p=>p[2]).map(p=>`<li>${tPrinciple(branchPattern.id, p[0])}</li>`).join('')}
      </ul>` : ''}
      <div class="points-section">
        <div class="points-label">${_lang==="VN"?"Huyệt":_lang==="FR"?"Points":_lang==="ZH"?"穴位":"Points"}</div>
        ${(() => {
          const bSpec = branchPattern.points.filter(p=>!p[2]);
          const bSupp = branchPattern.points.filter(p=>p[2]);
          const pill = (p, bg, color) => `<span style="display:inline-block;margin:2px 3px;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:700;background:${bg};color:${color}">${p[0]}</span>`;
          return [
            bSpec.length ? '<span style="font-size:10px;color:#0f4040;text-transform:uppercase;letter-spacing:.06em;margin-right:4px">Branch-specific: </span>' + bSpec.map(p=>pill(p,'#d0eaea','#0f4040')).join('') : '',
            bSupp.length ? (bSpec.length ? '<br/><span style="font-size:10px;color:#888;text-transform:uppercase;letter-spacing:.06em;margin-right:4px">Supporting: </span>' : '') + bSupp.map(p=>pill(p,'#e8f5e8','#2a5a2a')).join('') : ''
          ].join('');
        })()}
      </div>
    </div>` : ''}
  </div>
</div>

<!-- Symptomatic Treatment -->
<div class="section">
  <div class="section-hd"><span class="dot" style="background:#b5872a"></span>${_lang==="VN"?"Điều trị triệu chứng — Giảm nhanh":_lang==="FR"?"Traitement symptomatique — Soulagement immédiat":_lang==="ZH"?"对症治疗 — 即时缓解":"Symptomatic Treatment — Immediate Relief"}</div>
  <div class="section-body">
    ${symptomSection(_lang==="VN"?"Lý do khám":_lang==="FR"?"Plainte principale":_lang==="ZH"?"主诉":"Chief Complaint", intake.chiefComplaint, ccTop)}
    ${symptomSection(t("otherConcern1"), intake.otherConcern1, oc1Top)}
    ${symptomSection(t("otherConcern2"), intake.otherConcern2, oc2Top)}
  </div>
</div>

<!-- Final Treatment Plan -->
<div class="final-plan-box">
  <h3>✅ ${_lang==="VN"?"Phác đồ cuối — Lựa chọn thầy thuốc":_lang==="FR"?"Plan final — Sélection du praticien":_lang==="ZH"?"最终方案 — 医师选择":"Final Treatment Plan — Practitioner Selection"}</h3>
  <div style="margin-bottom:10px">${pointBadges}</div>
  ${planNotes ? `<div style="font-size:11px;opacity:.6;margin-bottom:6px;text-transform:uppercase;letter-spacing:.07em">Clinical Notes & Rationale</div>
  <div style="font-size:12px;opacity:.85;line-height:1.7;font-style:italic">${planNotes}</div>` : ''}
</div>

${intake.practitionerNotes ? `
<div class="section">
  <div class="section-hd"><span class="dot" style="background:#6b6050"></span>Practitioner Observations</div>
  <div class="section-body notes-box">${intake.practitionerNotes}</div>
</div>` : ''}

${intake.medicalHistory ? `
<div class="section">
  <div class="section-hd"><span class="dot" style="background:#6b6050"></span>Medical History</div>
  <div class="section-body notes-box">${intake.medicalHistory}</div>
</div>` : ''}

<!-- Footer -->
<div class="footer">
  <div>
    <div><strong>AAIDA</strong> — Acupuncture AI Diagnosis Assistant</div>
    <div>${_lang==="VN"?"Báo cáo này là tài liệu hỗ trợ lâm sàng, chỉ dành cho các thầy thuốc Đông y có chứng chỉ.":_lang==="FR"?"Ce rapport est un document d'aide à la décision clinique, réservé aux praticiens MTC certifiés.":_lang==="ZH"?"本报告为临床决策支持文件，仅供持证中医医师使用。":"This report is a clinical decision-support document for use by licensed TCM practitioners only."}</div>
    <div>${_lang==="VN"?"Mọi quyết định điều trị thuộc trách nhiệm của thầy thuốc phụ trách.":_lang==="FR"?"Toutes les décisions thérapeutiques restent sous la seule responsabilité du praticien traitant.":_lang==="ZH"?"所有治疗决策均由主治医师承担全部责任。":"All treatment decisions remain the sole responsibility of the attending practitioner."}</div>
  </div>
  <div style="text-align:right">
    <div>Generated: ${new Date().toLocaleString()}</div>
    <div>${patient.firstName} ${patient.lastName} · ${intakeDate}</div>
  </div>
</div>

<scr' + 'ipt>
  window.addEventListener('load', function() {
    setTimeout(function() { window.print(); }, 800);
  });
</' + 'script>
</body>
</html>`;

  // Open report in new window
  const win = window.open('', '_blank', 'width=900,height=1100');
  if (win) {
    win.document.write(html);
    win.document.close();
  } else {
    alert('Please allow pop-ups for this site to generate the PDF report.');
  }
}

// ─── PATTERN ASSESSMENT ───────────────────────────────────────────────────

// Symptomatic point pill — now shows universal PointCode with CN name as tooltip
function SPointPill({ code, cn, technique }) {
  const isMoxa = technique && technique.toLowerCase().includes('mox');
  // Colour by meridian prefix
  const meridianColor = (c) => {
    if (!c) return "pp-default";
    if (c.startsWith("LU")) return "pp-tonify";
    if (c.startsWith("LI")) return "pp-regulate";
    if (c.startsWith("ST")) return "pp-regulate";
    if (c.startsWith("SP")) return "pp-tonify";
    if (c.startsWith("HT")) return "pp-tonify";
    if (c.startsWith("SI")) return "pp-regulate";
    if (c.startsWith("UB") || c.startsWith("BL")) return "pp-drain";
    if (c.startsWith("KI") || c.startsWith("KD")) return "pp-tonify";
    if (c.startsWith("PC")) return "pp-tonify";
    if (c.startsWith("SJ") || c.startsWith("TW")) return "pp-regulate";
    if (c.startsWith("GB")) return "pp-drain";
    if (c.startsWith("LV")) return "pp-clear";
    if (c.startsWith("DU") || c.startsWith("GV")) return "pp-move";
    if (c.startsWith("REN") || c.startsWith("CV")) return "pp-tonify";
    if (c.startsWith("EP") || c.startsWith("EX")) return "pp-default";
    return "pp-default";
  };
  const titleText = [cn && cn !== code ? cn : null, technique || null].filter(Boolean).join(" — ");
  return (
    React.createElement('span', { className: `point-pill ${meridianColor(code)}`, title: titleText || code,}
      , code
      , isMoxa && React.createElement('span', { style: {fontSize:9,marginLeft:2},}, "🔥")
    )
  );
}

function PatternAssessment({ intake, patient, onBack, onEdit, onSavePlan }) {
  const afSet = useMemo(() => new Set(intake.activeFindings||[]), [intake]);
  const scored = useMemo(() => scorePatterns(afSet), [afSet]);

  const [rootId, setRootId] = useState(_optionalChain([scored, 'access', _2 => _2[0], 'optionalAccess', _3 => _3.id])||null);
  const [branchId, setBranchId] = useState(_optionalChain([scored, 'access', _4 => _4[1], 'optionalAccess', _5 => _5.id])||null);
  const [tab, setTab] = useState("scores");

  const rootPattern = scored.find(p=>p.id===rootId) || (rootId ? DB.patterns.find(p=>p.id===rootId) : null);
  const branchPattern = scored.find(p=>p.id===branchId) || (branchId ? DB.patterns.find(p=>p.id===branchId) : null);
  const allPoints = _optionalChain([rootPattern, 'optionalAccess', _6 => _6.points]) || [];

  // Symptomatic matches from S_ tables for CC, OC1, OC2
  const ccMatches   = useMemo(() => matchSymptomPatterns(intake.chiefComplaint), [intake.chiefComplaint]);
  const oc1Matches  = useMemo(() => matchSymptomPatterns(intake.otherConcern1),  [intake.otherConcern1]);
  const oc2Matches  = useMemo(() => matchSymptomPatterns(intake.otherConcern2),  [intake.otherConcern2]);

  // ── Final Plan state ──────────────────────────────────────────────────────
  // Initialise from saved plan if it exists, otherwise empty
  const savedPlan = intake.finalPlan || null;
  const [planPoints, setPlanPoints] = useState(_optionalChain([savedPlan, 'optionalAccess', _7 => _7.points]) || []);
  const [planNotes, setPlanNotes]   = useState(_optionalChain([savedPlan, 'optionalAccess', _8 => _8.notes])  || "");
  const [planSaved, setPlanSaved]   = useState(!!savedPlan);
  const [addPointInput, setAddPointInput] = useState("");

  // Build the full suggested point list across all tiers (for easy "add all" to plan)
  const allSuggestedPoints = useMemo(() => {
    const pts = [];
    // Root pattern points
    allPoints.filter(pt=>pt[2]).forEach(pt => {
      if (!pts.find(p=>p.code===pt[0])) pts.push({code:pt[0], source:"Root", role:pt[1]});
    });
    // Branch pattern points
    // Branch pattern: all points (branch-specific first, then supporting)
    const branchSpecific = (_optionalChain([branchPattern, 'optionalAccess', _9 => _9.points])||[]).filter(pt=>!pt[2]);
    const branchSupport  = (_optionalChain([branchPattern, 'optionalAccess', _10 => _10.points])||[]).filter(pt=>pt[2]);
    [...branchSpecific, ...branchSupport].forEach(pt => {
      if (!pts.find(p=>p.code===pt[0])) pts.push({code:pt[0], source:"Branch", role:pt[1]});
    });
    // Symptomatic points from CC, OC1, OC2
    [[ccMatches,"CC"],[oc1Matches,"OC1"],[oc2Matches,"OC2"]].forEach(([matches, src]) => {
      (_optionalChain([matches, 'access', _11 => _11[0], 'optionalAccess', _12 => _12.pts])||[]).forEach(pt => {
        if (!pts.find(p=>p.code===pt[0])) pts.push({code:pt[0], source:src, role:""});
      });
    });
    return pts;
  }, [rootId, branchId, ccMatches, oc1Matches, oc2Matches]);

  const togglePlanPoint = (code) => {
    setPlanSaved(false);
    setPlanPoints(prev =>
      prev.find(p=>p.code===code)
        ? prev.filter(p=>p.code!==code)
        : [...prev, allSuggestedPoints.find(p=>p.code===code) || {code, source:"Manual", role:""}]
    );
  };

  const addManualPoint = () => {
    const code = addPointInput.trim().toUpperCase();
    if (!code) return;
    if (!planPoints.find(p=>p.code===code)) {
      setPlanPoints(prev => [...prev, {code, source:"Manual", role:""}]);
      setPlanSaved(false);
    }
    setAddPointInput("");
  };

  const loadAllSuggested = () => {
    setPlanPoints(allSuggestedPoints);
    setPlanSaved(false);
  };

  const saveFinalPlan = () => {
    const plan = {
      points: planPoints,
      notes: planNotes,
      rootPattern: _optionalChain([rootPattern, 'optionalAccess', _13 => _13.name]) || "",
      branchPattern: _optionalChain([branchPattern, 'optionalAccess', _14 => _14.name]) || "",
      savedAt: new Date().toISOString(),
    };
    onSavePlan(intake.id, plan);
    setPlanSaved(true);
  };

  // Source badge colour
  const srcColor = {Root:"#2a6a2a", Branch:"var(--teal-dk)", CC:"var(--gold-dk)", OC1:"#503080", OC2:"#503080", Manual:"var(--red)"};
  const srcBg    = {Root:"#d4ecd4", Branch:"var(--teal-lt)", CC:"var(--gold-lt)", OC1:"#ede8f8", OC2:"#ede8f8", Manual:"var(--red-lt)"};

  // Render a symptomatic treatment block from S_ matches
  const renderSymptomTier = (label, complaint, matches, tierClass, icon) => {
    if (!complaint) return null;
    const topMatch = matches[0];
    return (
      React.createElement('div', { className: `tier ${tierClass}`, style: {marginTop:8},}
        , React.createElement('div', { className: "tier-hd",}, icon, " " , label, React.createElement('span', { className: "label",}, complaint))
        , topMatch ? (
          React.createElement(React.Fragment, null
            , React.createElement('div', { style: {fontSize:11,color:"var(--muted)",marginBottom:7,fontStyle:"italic"},}, t("bestMatch")+" "
                , React.createElement('strong', { style: {fontStyle:"normal"},}, (topMatch[{"VN":"vn","FR":"fr","ZH":"zh"}[(_lang||"EN").toUpperCase()]||"en"] || topMatch.en))
              , matches.length > 1 && React.createElement('span', null, " (+" , matches.length-1, (_lang==="VN"?" liên quan":_lang==="FR"?" liés":_lang==="ZH"?" 相关":" related")+")" )
            )
            /* Primary match points */
            , React.createElement('div', { style: {marginBottom: matches.length > 1 ? 8 : 0},}
              , topMatch.pts.map((pt,i) => (
                React.createElement(SPointPill, { key: i, code: pt[0], cn: pt[1], technique: pt[2],} )
              ))
            )
            /* Additional related matches */
            , matches.slice(1,3).map((m,mi) => (
              React.createElement('div', { key: mi, style: {marginTop:6,paddingTop:6,borderTop:"1px solid rgba(0,0,0,.08)"},}
                , React.createElement('div', { style: {fontSize:10,color:"var(--muted)",marginBottom:4,letterSpacing:".04em"},}, t("alsoLabel")+" "
                   , (m[{"VN":"vn","FR":"fr","ZH":"zh"}[(_lang||"EN").toUpperCase()]||"en"] || m.en)
                )
                , React.createElement('div', null, m.pts.map((pt,i) => React.createElement(SPointPill, { key: i, code: pt[0], cn: pt[1], technique: pt[2],})))
              )
            ))
          )
        ) : (
          React.createElement('p', { style: {fontSize:11,color:"var(--muted)"},}, t("noSympMatch")

          )
        )
      )
    );
  };

  return (
    React.createElement('div', { className: "fu",}
      /* Header card */
      , React.createElement('div', { className: "card", style: {background:"linear-gradient(135deg,var(--teal-dk) 0%,#0a3030 100%)",color:"#fff",margin:"12px 14px 8px"},}
        , React.createElement('div', { style: {fontFamily:"var(--serif)",fontSize:15,marginBottom:3},}, t("patternAssessment") )
        , React.createElement('div', { style: {fontSize:11,opacity:.75},}, patient.firstName, " " , patient.lastName, " · "  , intake.date)
        , React.createElement('div', { style: {fontSize:12,marginTop:8,background:"rgba(255,255,255,.12)",padding:"7px 10px",borderRadius:6,fontStyle:"italic"},}
          , intake.chiefComplaint||t("noChiefComp")
        )
        , (intake.otherConcern1||intake.otherConcern2) && (
          React.createElement('div', { style: {fontSize:11,marginTop:6,opacity:.8},}
            , intake.otherConcern1 && React.createElement('div', null, t("concern1")+" "  , intake.otherConcern1)
            , intake.otherConcern2 && React.createElement('div', null, t("concern2")+" "  , intake.otherConcern2)
          )
        )
      )

      /* Tab bar */
      , React.createElement('div', { style: {display:"flex",padding:"0 14px 8px",gap:5},}
        , [["scores",t("patternScores")],["treatment",t("treatmentSummary")||"Treatment"],["plan","✅ "+t("finalPlan")]].map(([tabKey,label])=>(
          React.createElement('button', { key: tabKey, className: `btn btn-sm ${tab===tabKey?"btn-primary":"btn-outline"}`,
            onClick: ()=>setTab(tabKey), style: {flex:1,fontSize:11,padding:"7px 4px"},}
            , label, tabKey==="plan"&&planSaved&&React.createElement('span', { style: {marginLeft:4,color:"#4a4",fontSize:10},}, "●")
          )
        ))
      )

      , tab==="scores" && (
        React.createElement('div', null
          , React.createElement('div', { className: "card",}
            , React.createElement('div', { className: "card-hd",}, React.createElement('span', { className: "pip teal" ,}), t("patternScores") )
            , scored.length===0 && React.createElement('p', { style: {fontSize:12,color:"var(--muted)"},}, t("noFindingsSel")       )
            , scored.slice(0,12).map(p=>(
              React.createElement('div', { key: p.id, className: `pattern-item ${p.id===rootId||p.id===branchId?"sel":""}`,
                onClick: ()=>{
                  if (rootId===null) { setRootId(p.id); return; }
                  if (p.id===rootId) { setRootId(null); return; }
                  if (branchId===null) { setBranchId(p.id); return; }
                  if (p.id===branchId) { setBranchId(null); return; }
                  setBranchId(p.id);
                },}
                , React.createElement('div', { className: "p-header",}
                  , React.createElement('span', { className: "p-name",}
                    , tPattern(p.name, p.id)
                    , p.id===rootId && React.createElement('span', { className: "tag tag-root" , style: {marginLeft:6},}, t("rootPrefix"))
                    , p.id===branchId && React.createElement('span', { className: "tag tag-branch" , style: {marginLeft:6},}, t("branchLbl"))
                  )
                  , React.createElement('span', { className: "p-score",}, p.score, "% " , p.keyHits>0&&React.createElement('span', { className: "tag tag-key" ,}, p.keyHits, "/", p.keyTotal, " "+(_lang==="VN"?"chủ":_lang==="FR"?"clé":_lang==="ZH"?"关键":"key") ))
                )
                , React.createElement('div', { className: "bar-track",}, React.createElement('div', { className: "bar-fill", style: {width:p.score+"%"},} ))
              )
            ))
          )

          , React.createElement('div', { className: "card",}
            , React.createElement('div', { className: "card-hd",}, React.createElement('span', { className: "pip",}), t("patternSelection") )
            , React.createElement('div', { className: "row2",}
              , React.createElement('div', null
                , React.createElement('p', { style: {fontSize:10,textTransform:"uppercase",letterSpacing:".07em",color:"var(--muted)",marginBottom:4},}, `${t("rootPrefix")} (Ben 本)`  )
                , React.createElement('select', { style: {width:"100%",padding:"8px 10px",border:"1px solid var(--border)",borderRadius:6,background:"var(--warm)",fontSize:13},
                  value: rootId||"", onChange: e=>setRootId(Number(e.target.value)||null),}
                  , React.createElement('option', { value: "",}, "— Select —"  )
                  , scored.map(p=>React.createElement('option', { key: p.id, value: p.id,}, tPattern(p.name, p.id), " (" , p.score, "%)"))
                )
              )
              , React.createElement('div', null
                , React.createElement('p', { style: {fontSize:10,textTransform:"uppercase",letterSpacing:".07em",color:"var(--muted)",marginBottom:4},}, `${t("branchLbl")} (Biao 標)`  )
                , React.createElement('select', { style: {width:"100%",padding:"8px 10px",border:"1px solid var(--border)",borderRadius:6,background:"var(--warm)",fontSize:13},
                  value: branchId||"", onChange: e=>setBranchId(Number(e.target.value)||null),}
                  , React.createElement('option', { value: "",}, "— Select —"  )
                  , scored.map(p=>React.createElement('option', { key: p.id, value: p.id,}, tPattern(p.name, p.id), " (" , p.score, "%)"))
                )
              )
            )
          )
        )
      )

      , tab==="treatment" && (
        React.createElement('div', null
          , rootPattern ? (
            React.createElement('div', { style: {margin:"0 14px 8px"},}

              /* ── TRADITIONAL TREATMENT (tbl tables) ── */
              , React.createElement('div', { style: {fontSize:10,textTransform:"uppercase",letterSpacing:".1em",color:"var(--muted)",marginBottom:6,fontWeight:600},}, (_lang==="VN"?"Điều trị theo biện chứng":_lang==="FR"?"Traitement par diagnostic":_lang==="ZH"?"辨证治疗":"Traditional Treatment — Pattern-Based")

              )

              /* ROOT tier */
              , React.createElement('div', { className: "tier tier-root" ,}
                , React.createElement('div', { className: "tier-hd",}, "🌱 "+t("rootPrefix")+" — "   , tPattern(rootPattern.name, rootPattern.id), React.createElement('span', { className: "label",}, "Ben 本" ))
                , rootPattern.principles.filter(pr=>pr[1]).length > 0 && (
                  React.createElement('div', { className: "tier-principles",}
                    , rootPattern.principles.filter(pr=>pr[1]).map((pr,i)=>(
                      React.createElement('div', { key: i, className: "tier-principle",}, "• " , tPrinciple(rootPattern.id, pr[0]))
                    ))
                  )
                )
                , React.createElement('div', null, allPoints.filter(pt=>pt[2]).map((pt,i)=>React.createElement(PointPill, { key: i, code: pt[0], role: pt[1], name: pt[3],})))
              )

              /* BRANCH tier */
              , branchPattern && (
                React.createElement('div', { className: "tier tier-branch" , style: {marginTop:8},}
                  , React.createElement('div', { className: "tier-hd",}, "🌿 "+t("branchLbl")+" — "   , tPattern(branchPattern.name, branchPattern.id), React.createElement('span', { className: "label",}, "Biao 標" ))
                  , branchPattern.principles.filter(pr=>pr[2]).length > 0 && (
                    React.createElement('div', { className: "tier-principles",}
                      , branchPattern.principles.filter(pr=>pr[2]).map((pr,i)=>(
                        React.createElement('div', { key: i, className: "tier-principle",}, "• " , tPrinciple(branchPattern.id, pr[0]))
                      ))
                    )
                  )
                  /* Branch-specific points (IsRoot=false) shown first, then supporting points */
                  , (() => {
                    const branchSpecific = branchPattern.points.filter(pt=>!pt[2]);
                    const supporting     = branchPattern.points.filter(pt=>pt[2]);
                    const hasSpecific    = branchSpecific.length > 0;
                    return (
                      React.createElement('div', null
                        , hasSpecific && (
                          React.createElement('div', { style: {marginBottom:4},}
                            , React.createElement('div', { style: {fontSize:10,textTransform:"uppercase",letterSpacing:".07em",
                              color:"var(--teal-dk)",marginBottom:4,fontWeight:600},}, t("branchSpecPts") )
                            , branchSpecific.map((pt,i)=>React.createElement(PointPill, { key: i, code: pt[0], role: pt[1], name: pt[3],}))
                          )
                        )
                        , React.createElement('div', { style: {marginTop: hasSpecific ? 6 : 0},}
                          , React.createElement('div', { style: {fontSize:10,textTransform:"uppercase",letterSpacing:".07em",
                            color:"var(--muted)",marginBottom:4,fontWeight:600},}
                            , hasSpecific ? (_lang==="VN"?"Huyệt hỗ trợ":_lang==="FR"?"Points de soutien":_lang==="ZH"?"辅助穴位":"Supporting points") : (_lang==="VN"?"Tất cả huyệt":_lang==="FR"?"Tous les points":_lang==="ZH"?"所有穴位":"All points")
                          )
                          , supporting.map((pt,i)=>React.createElement(PointPill, { key: i, code: pt[0], role: pt[1], name: pt[3],}))
                        )
                      )
                    );
                  })()
                )
              )

              /* ── SYMPTOMATIC TREATMENT (S_ tables) ── */
              , React.createElement('div', { style: {fontSize:10,textTransform:"uppercase",letterSpacing:".1em",color:"var(--muted)",marginTop:14,marginBottom:6,fontWeight:600},}, (_lang==="VN"?"Điều trị triệu chứng — Giảm nhanh":_lang==="FR"?"Traitement symptomatique — Soulagement":_lang==="ZH"?"对症治疗":"Symptomatic Treatment — Immediate Relief")

              )

              , renderSymptomTier(t("chiefComplaintColon")||"Chief Complaint", intake.chiefComplaint, ccMatches, "tier-cc", "🎯")
              , renderSymptomTier(t("concern1")||"Concern 1", intake.otherConcern1, oc1Matches, "tier-oc", "📌")
              , renderSymptomTier(t("concern2")||"Concern 2", intake.otherConcern2, oc2Matches, "tier-oc", "📌")

            )
          ) : (
            React.createElement('div', null
              /* Still show symptomatic tiers even without a root pattern selected */
              , React.createElement('div', { style: {margin:"0 14px 4px",padding:"8px 12px",background:"var(--gold-lt)",border:"1px solid var(--gold)",borderRadius:8,fontSize:12,color:"var(--gold-dk)"},}, "💡 Select a Root pattern on the Scores tab to add pattern-based treatment above."

              )
              , React.createElement('div', { style: {margin:"0 14px 8px",marginTop:8},}
                , React.createElement('div', { style: {fontSize:10,textTransform:"uppercase",letterSpacing:".1em",color:"var(--muted)",marginBottom:6,fontWeight:600},}, (_lang==="VN"?"Điều trị triệu chứng — Giảm nhanh":_lang==="FR"?"Traitement symptomatique — Soulagement":_lang==="ZH"?"对症治疗":"Symptomatic Treatment — Immediate Relief")

                )
                , renderSymptomTier(t("chiefComplaintColon")||"Chief Complaint", intake.chiefComplaint, ccMatches, "tier-cc", "🎯")
                , renderSymptomTier(t("concern1")||"Concern 1", intake.otherConcern1, oc1Matches, "tier-oc", "📌")
                , renderSymptomTier(t("concern2")||"Concern 2", intake.otherConcern2, oc2Matches, "tier-oc", "📌")
              )
            )
          )
        )
      )

      /* ── FINAL PLAN TAB ── */
      , tab==="plan" && (
        React.createElement('div', { style: {margin:"0 14px 8px"},}

          /* Saved banner */
          , planSaved && (
            React.createElement('div', { style: {padding:"9px 13px",background:"#e8f5e8",border:"1px solid #b8d8b8",borderRadius:8,fontSize:12,color:"#2a6a2a",marginBottom:8,display:"flex",alignItems:"center",gap:8},}, "✅ "
               , React.createElement('span', null, React.createElement('strong', null, t("finalPlanSaved")  ), " — "  , _optionalChain([savedPlan, 'optionalAccess', _15 => _15.savedAt]) ? new Date(savedPlan.savedAt).toLocaleString() : "")
            )
          )

          /* Load suggestions button */
          , allSuggestedPoints.length > 0 && planPoints.length === 0 && (
            React.createElement('div', { style: {padding:"10px 13px",background:"var(--teal-lt)",border:"1px solid var(--teal)",borderRadius:8,fontSize:12,color:"var(--teal-dk)",marginBottom:8},}
              , React.createElement('strong', null, allSuggestedPoints.length, " points" ), " suggested across all tiers."
              , React.createElement('button', { className: "btn btn-primary btn-sm"  , style: {marginLeft:10}, onClick: loadAllSuggested,}, t("loadAllSugg")

              )
            )
          )

          /* Point editor */
          , React.createElement('div', { style: {background:"#fff",border:"1px solid var(--border)",borderRadius:10,padding:14,marginBottom:8,boxShadow:"var(--shadow)"},}
            , React.createElement('div', { style: {fontFamily:"var(--serif)",fontSize:14,marginBottom:10,display:"flex",alignItems:"center",gap:8},}
              , React.createElement('span', { style: {width:7,height:7,borderRadius:"50%",background:"var(--gold)",display:"inline-block",flexShrink:0},}), t("acuPoints")

            )

            /* Selected points */
            , planPoints.length === 0 && (
              React.createElement('p', { style: {fontSize:12,color:"var(--muted)",marginBottom:10},}, t("noPointsYet")

              )
            )
            , React.createElement('div', { style: {display:"flex",flexWrap:"wrap",gap:6,marginBottom:12},}
              , planPoints.map((pt,i) => (
                React.createElement('div', { key: i, style: {display:"inline-flex",alignItems:"center",gap:4,
                  padding:"4px 6px 4px 10px",borderRadius:20,fontSize:12,fontWeight:600,
                  background: srcBg[pt.source]||"var(--border-lt)",
                  color: srcColor[pt.source]||"var(--muted)",
                  border:`1px solid ${srcColor[pt.source]||"var(--border)"}30`},}
                  , pt.code
                  , React.createElement('span', { style: {fontSize:9,opacity:.6,fontWeight:400},}, pt.source)
                  , React.createElement('button', { onClick: ()=>togglePlanPoint(pt.code), style: {
                    background:"none",border:"none",cursor:"pointer",fontSize:14,
                    color:srcColor[pt.source]||"var(--muted)",lineHeight:1,padding:"0 2px",opacity:.7},}, "×")
                )
              ))
            )

            /* Add suggested points not yet in plan */
            , allSuggestedPoints.filter(p=>!planPoints.find(x=>x.code===p.code)).length > 0 && (
              React.createElement('div', { style: {marginBottom:12},}
                , React.createElement('div', { style: {fontSize:10,textTransform:"uppercase",letterSpacing:".07em",color:"var(--muted)",marginBottom:6},}, t("addFromSugg")

                )
                , React.createElement('div', { style: {display:"flex",flexWrap:"wrap",gap:5},}
                  , allSuggestedPoints.filter(p=>!planPoints.find(x=>x.code===p.code)).map((pt,i)=>(
                    React.createElement('div', { key: i, onClick: ()=>togglePlanPoint(pt.code),
                      style: {padding:"4px 10px",borderRadius:20,fontSize:12,cursor:"pointer",
                        border:`1px dashed ${srcColor[pt.source]||"var(--border)"}`,
                        color:srcColor[pt.source]||"var(--muted)",background:"transparent",
                        display:"inline-flex",alignItems:"center",gap:4},}, "+ "
                       , pt.code
                      , React.createElement('span', { style: {fontSize:9,opacity:.6},}, pt.source)
                    )
                  ))
                )
              )
            )

            /* Manual add */
            , React.createElement('div', { style: {display:"flex",gap:6,alignItems:"center"},}
              , React.createElement('input', {
                style: {flex:1,padding:"8px 11px",border:"1px solid var(--border)",borderRadius:6,
                  fontFamily:"var(--sans)",fontSize:13,background:"var(--warm)",outline:"none",
                  textTransform:"uppercase"},
                placeholder: t("addPoint")    ,
                value: addPointInput,
                onChange: e=>setAddPointInput(e.target.value),
                onKeyDown: e=>e.key==="Enter"&&addManualPoint(),}
              )
              , React.createElement('button', { className: "btn btn-outline btn-sm"  , onClick: addManualPoint,}, (_lang==="VN"?"Thêm":_lang==="FR"?"Ajouter":_lang==="ZH"?"添加":"Add"))
            )
          )

          /* Practitioner override notes */
          , React.createElement('div', { style: {background:"#fff",border:"1px solid var(--border)",borderRadius:10,padding:14,marginBottom:8,boxShadow:"var(--shadow)"},}
            , React.createElement('div', { style: {fontFamily:"var(--serif)",fontSize:14,marginBottom:8,display:"flex",alignItems:"center",gap:8},}
              , React.createElement('span', { style: {width:7,height:7,borderRadius:"50%",background:"var(--teal)",display:"inline-block",flexShrink:0},}), t("practNotes")

            )
            , React.createElement('textarea', {
              style: {width:"100%",padding:"10px 12px",border:"1px solid var(--border)",borderRadius:6,
                fontFamily:"var(--sans)",fontSize:13,background:"var(--warm)",resize:"vertical",
                minHeight:90,outline:"none",lineHeight:1.6},
              placeholder: _lang==="VN"?"Lý luận lâm sàng, điều chỉnh, kỹ thuật châm, moxibustion, dược thảo, kế hoạch theo dõi…":_lang==="FR"?"Raisonnement clinique, modifications, technique d'acupuncture, moxa, formule herbale, suivi…":_lang==="ZH"?"临床依据、调整方案、针刺技术、艾灸、草药方剂、随访计划…":"Clinical rationale, modifications from suggestions, needling technique, moxa, herbal formula, follow-up plan…"           ,
              value: planNotes,
              onChange: e=>{setPlanNotes(e.target.value);setPlanSaved(false);},}
            )
          )

          /* Summary */
          , React.createElement('div', { style: {background:"var(--ink)",color:"var(--warm)",borderRadius:10,padding:14,marginBottom:8},}
            , React.createElement('div', { style: {fontFamily:"var(--serif)",fontSize:13,marginBottom:8,opacity:.9},}, t("treatmentSummary") )
            , React.createElement('div', { style: {fontSize:11,opacity:.7,marginBottom:4},}, t("patientPrefix")+" "
               , patient.firstName, " " , patient.lastName, " · "  , intake.date
            )
            , rootPattern && React.createElement('div', { style: {fontSize:11,opacity:.7},}, t("rootPrefix")+" " , tPattern(rootPattern.name, rootPattern.id), branchPattern?" · "+t("branchLbl")+" "+tPattern(branchPattern.name, branchPattern.id):"")
            , React.createElement('div', { style: {marginTop:8,display:"flex",flexWrap:"wrap",gap:4},}
              , planPoints.map((pt,i)=>(
                React.createElement('span', { key: i, style: {padding:"3px 8px",borderRadius:4,fontSize:12,fontWeight:600,
                  background:"rgba(255,255,255,.15)",color:"var(--warm)"},}
                  , pt.code
                )
              ))
            )
            , planNotes && React.createElement('div', { style: {fontSize:11,marginTop:8,opacity:.7,fontStyle:"italic",borderTop:"1px solid rgba(255,255,255,.1)",paddingTop:8},}, planNotes)
          )

          /* Save button */
          , React.createElement('button', { className: "btn btn-gold btn-full"  ,
            style: {fontSize:15,padding:13,marginBottom:4},
            onClick: saveFinalPlan,
            disabled: planPoints.length===0,}
            , planSaved ? `✅ ${_lang==="VN"?"Đã lưu — Cập nhật":_lang==="FR"?"Plan sauvegardé — Mettre à jour":_lang==="ZH"?"已保存 — 更新":"Plan Saved — Update"}` : `💾 ${_lang==="VN"?"Lưu phác đồ điều trị":_lang==="FR"?"Enregistrer le plan de traitement":_lang==="ZH"?"保存治疗方案":"Save Final Treatment Plan"}`
          )
          , planPoints.length===0 && React.createElement('p', { style: {fontSize:11,color:"var(--muted)",textAlign:"center"},}, t("selectOnePoint")      )

          /* PDF Report button — only show once plan is saved */
          , planSaved && planPoints.length > 0 && (
            React.createElement('button', { className: "btn btn-outline btn-full"  ,
              style: {marginTop:8,borderColor:"var(--teal)",color:"var(--teal)"},
              onClick: ()=>printReport({patient,intake,planPoints,planNotes,rootPattern,branchPattern,ccMatches,oc1Matches,oc2Matches}),}, `🖨️ ${_lang==="VN"?"In / Xuất báo cáo PDF":_lang==="FR"?"Imprimer / Exporter en PDF":_lang==="ZH"?"打印/导出PDF报告":"Print / Export PDF Report"}`

            )
          )
        )
      )

      , React.createElement('div', { style: {display:"flex",gap:8,padding:"8px 14px 20px"},}
        , React.createElement('button', { className: "btn btn-outline" , style: {flex:1}, onClick: onBack,}, `← ${_lang==="VN"?"Bệnh nhân":_lang==="FR"?"Patients":_lang==="ZH"?"患者列表":"Patients"}` )
        , React.createElement('button', { className: "btn btn-primary" , style: {flex:2}, onClick: onEdit,}, `✏️ ${t("editIntakeBtn")}`  )
      )
    )
  );
}

// ─── SETTINGS ─────────────────────────────────────────────────────────────

// ── BACKUP & EXPORT HELPERS ───────────────────────────────────────────────────

function downloadFile(filename, content, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a); URL.revokeObjectURL(url);
}

function exportJSON(store) {
  const ts   = new Date().toISOString().slice(0,10);
  const data = { exportDate: ts, version: "MVP05", patients: store.patients, intakes: store.intakes };
  downloadFile(`AAIDA_Backup_${ts}.json`, JSON.stringify(data, null, 2), 'application/json');
}

function importJSON(file, onImport) {
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const data = JSON.parse(e.target.result);
      if (!Array.isArray(data.patients) || !Array.isArray(data.intakes))
        throw new Error("Invalid backup file.");
      onImport(data);
    } catch (err) {
      alert("Import failed: " + err.message);
    }
  };
  reader.readAsText(file);
}

function exportExcel(store) {
  try {
    const XLSX = window.XLSX;

    // ── Sheet 1: Patients ──────────────────────────────────────────
    const patRows = store.patients.map(p => ({
      "Patient ID":  p.id,
      "First Name":  p.firstName,
      "Last Name":   p.lastName,
      "DOB":         p.dob       || "",
      "Gender":      p.gender    || "",
      "Phone":       p.phone     || "",
      "Email":       p.email     || "",
      "Intakes":     store.intakes.filter(i => i.patientId === p.id).length
    }));

    // ── Sheet 2: Intakes ───────────────────────────────────────────
    const intakeRows = store.intakes.map(i => {
      const pt = store.patients.find(p => p.id === i.patientId) || {};
      return {
        "Intake ID":          i.id,
        "Patient ID":       i.patientId,
        "Patient Name":       (pt.firstName||"") + " " + (pt.lastName||""),
        "Date":               i.date        || "",
        "Chief Complaint":    i.chiefComplaint || "",
        "Other Concern 1":    i.otherConcern1  || "",
        "Other Concern 2":    i.otherConcern2  || "",
        "Illness Since":      i.illnessSince   || "",
        "Energy Level":       i.energyLevel    || "",
        "Appetite":           i.appetite       || "",
        "Mood":               Array.isArray(i.mood) ? i.mood.join("; ") : (i.mood||""),
        "Sleep Quality":      i.sleepQuality   || "",
        "Thirst":             i.thirst         || "",
        "Sweating":           i.sweating       || "",
        "Stool":              i.stoolConsistency || "",
        "Tongue Color":       i.tongueBodyColor  || "",
        "Tongue Coating":     i.tongueCoating    || "",
        "Tongue Moisture":    i.tongueMoisture   || "",
        "Tongue Notes":       i.tongueNotes      || "",
        "Pulse Qualities":    Array.isArray(i.pulseQualities) ? i.pulseQualities.join("; ") : "",
        "Pulse Strength R":   i.pulseStrengthR   || "",
        "Pulse Strength L":   i.pulseStrengthL   || "",
        "Pulse Notes":        i.pulseNotes        || "",
        "Practitioner Notes": i.practitionerNotes || "",
        "Active Findings":    Array.isArray(i.activeFindings) ? i.activeFindings.join("; ") : "",
        "Has Final Plan":     i.finalPlan ? "Yes" : "No"
      };
    });

    // ── Sheet 3: Treatment Plans ───────────────────────────────────
    const planRows = [];
    store.intakes.forEach(i => {
      if (!i.finalPlan) return;
      const pt = store.patients.find(p => p.id === i.patientId) || {};
      const fp = i.finalPlan;
      (fp.points || []).forEach((pt2, idx) => {
        planRows.push({
          "Intake ID":      i.id,
          "Patient ID":       i.patientId,
          "Patient Name": (pt.firstName||"") + " " + (pt.lastName||""),
          "Date":           i.date || "",
          "Point #":        idx + 1,
          "Point Code":     pt2.code  || "",
          "Action":         pt2.action || "",
          "Tier":           pt2.tier   || "",
          "Pattern": pt2.pattern || ""
        });
      });
      if ((fp.points||[]).length === 0) {
        planRows.push({
          "Intake ID":  i.id, "Patient ID":       i.patientId,
          "Patient Name":     (pt.firstName||"") + " " + (pt.lastName||""),
          "Date": i.date||"", "Point #":"","Point Code":"","Action":"","Tier":"","Pattern": pt2.pattern || ""
        });
      }
    });

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(patRows.length    ? patRows    : [{"Note":t("noPatientsYet")}]),    "Patients");
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(intakeRows.length ? intakeRows : [{"Note":t("noIntakesYet")}]),     "Intakes");
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(planRows.length   ? planRows   : [{"Note":t("noPlansYet")}]),       t("treatmentPlans"));

    const ts = new Date().toISOString().slice(0,10);
    XLSX.writeFile(wb, `AAIDA_Export_${ts}.xlsx`);
  } catch(err) {
    alert("Excel export failed: " + err.message);
  }
}

function Settings({ store, onClear, onImport }) {
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  return (
    React.createElement('div', { className: "fu",}

      /* About card */
      , React.createElement('div', { className: "card",}
        , React.createElement('div', { className: "card-hd",}, React.createElement('span', { className: "pip",}), t("aboutAAIDA") )
        , React.createElement('p', { style: {fontSize:13,lineHeight:1.8,color:"var(--muted)"},}
          , React.createElement('strong', { style: {color:"var(--ink)"},}, "AAIDA"), " — Acupuncture AI Diagnosis Assistant — is a clinical support tool for Traditional Chinese Medicine. It guides patient intake, clinical finding collection, tongue and pulse assessment, TCM pattern scoring, and generates three-tier treatment suggestions with full practitioner override."



        )
        , React.createElement('hr', null)
        , React.createElement('p', { style: {fontSize:12,color:"var(--muted)"},}, "Built-in: "
           , DB.patterns.length, " patterns · "   , Object.keys(DB.findings).length, " findings · "   , S_DB.length, " symptomatic patterns"
        )
      )

      /* Disclaimer card */
      , React.createElement('div', { className: "card", style: {border:"1px solid var(--gold)",background:"linear-gradient(135deg,#fdf8ee 0%,#faf3e0 100%)"},}
        , React.createElement('div', { className: "card-hd",}
          , React.createElement('span', { className: "pip", style: {background:"var(--gold)"},}), t("disclaimer")

        )

        /* Always-visible summary */
        , React.createElement('div', { style: {fontSize:13,lineHeight:1.8,color:"var(--ink)"},}
          , React.createElement('p', { style: {marginBottom:10},}, (_lang==="VN"?"AAIDA được thiết kế ":_lang==="FR"?"AAIDA est destiné ":_lang==="ZH"?"AAIDA专为 ":(_lang==="VN"?"AAIDA được thiết kế ":_lang==="FR"?"AAIDA est destiné ":_lang==="ZH"?"AAIDA专为 ":"AAIDA is intended "))
               , React.createElement('strong', null, _lang==="VN"?"hoàn toàn cho mục đích giáo dục":_lang==="FR"?"strictement à des fins éducatives":_lang==="ZH"?"严格的教育目的":(_lang==="VN"?"hoàn toàn cho mục đích giáo dục":_lang==="FR"?"strictement à des fins éducatives":_lang==="ZH"?"严格的教育目的":"strictly for educational purposes")   ), (_lang==="VN"?" và là công cụ hỗ trợ quyết định lâm sàng dành cho:":_lang==="FR"?" et comme aide à la décision clinique pour:":_lang==="ZH"?" 并作为临床决策支持工具，适用于：":" and as a clinical decision-support aid for:")

          )
          , React.createElement('div', { style: {paddingLeft:12,marginBottom:10},}
            , React.createElement('div', { style: {marginBottom:5,display:"flex",gap:8,alignItems:"flex-start"},}
              , React.createElement('span', { style: {color:"var(--gold)",flexShrink:0},}, "•")
              , React.createElement('span', null, (_lang==="VN"?"Thầy thuốc Đông y có chứng chỉ hành nghề":_lang==="FR"?"Praticiens de MTC agréés et certifiés":_lang==="ZH"?"持证中医执业医师":"Licensed and certified Traditional Chinese Medicine practitioners")      )
            )
            , React.createElement('div', { style: {marginBottom:5,display:"flex",gap:8,alignItems:"flex-start"},}
              , React.createElement('span', { style: {color:"var(--gold)",flexShrink:0},}, "•")
              , React.createElement('span', null, (_lang==="VN"?"Sinh viên Đông y thực hành lâm sàng ":_lang==="FR"?"Étudiants en MTC effectuant un travail clinique ":_lang==="ZH"?"进行临床实践的中医学生 ":"Students of TCM performing clinical work ")      , React.createElement('strong', null, (_lang==="VN"?"dưới sự giám sát trực tiếp của thầy thuốc có chứng chỉ":_lang==="FR"?"sous la supervision directe d'un praticien qualifié":_lang==="ZH"?"在合格执业医师的直接监督下":"under the direct supervision of a qualified practitioner")       ))
            )
          )
          , React.createElement('p', { style: {marginBottom:10,color:"var(--muted)",fontSize:12,lineHeight:1.7},}, (_lang==="VN"?"Tất cả đề xuất điều trị của AAIDA chỉ mang tính tham khảo. ":_lang==="FR"?"Toutes les suggestions de traitement d'AAIDA ne sont que des recommandations. ":_lang==="ZH"?"AAIDA生成的所有治疗建议仅供参考。 ":"All treatment suggestions generated by AAIDA are recommendations only. The ")

             , React.createElement('strong', null, (_lang==="VN"?"thầy thuốc chịu trách nhiệm hoàn toàn":_lang==="FR"?"le praticien porte l'entière responsabilité":_lang==="ZH"?"医师承担全部责任":(_lang==="VN"?"thầy thuốc chịu trách nhiệm hoàn toàn":_lang==="FR"?"le praticien porte l'entière responsabilité":_lang==="ZH"?"医师承担全部责任":"practitioner bears sole responsibility"))   ), (_lang==="VN"?" chịu trách nhiệm hoàn toàn về kế hoạch điều trị và mọi quyết định lâm sàng. AAIDA không thay thế đào tạo chuyên môn, phán đoán lâm sàng, hay quan hệ điều trị giữa thầy thuốc và bệnh nhân.":_lang==="FR"?" porte l'entière responsabilité du plan de traitement et de toutes les décisions cliniques. AAIDA ne remplace pas la formation professionnelle, le jugement clinique ou la relation thérapeutique.":_lang==="ZH"?" 对最终治疗方案和所有临床决策承担全部责任。AAIDA不能替代专业培训、临床判断或医患治疗关系。":" for the final treatment plan and all clinical decisions. AAIDA does not replace professional training, clinical judgment, or the therapeutic relationship between practitioner and patient.")



          )

          /* Expandable full disclaimer */
          , React.createElement('button', { onClick: ()=>setShowDisclaimer(d=>!d),
            style: {background:"none",border:"none",color:"var(--gold-dk)",fontSize:12,
              cursor:"pointer",padding:"4px 0",textDecoration:"underline",textUnderlineOffset:3},}
            , showDisclaimer ? "Hide full disclaimer ▲" : t("readDisclaimer")
          )

          , showDisclaimer && (
            React.createElement('div', { style: {marginTop:12,padding:"12px 14px",background:"rgba(255,255,255,.7)",
              borderRadius:8,border:"1px solid var(--gold-lt)",fontSize:12,
              lineHeight:1.8,color:"var(--muted)"},}
              , React.createElement('p', { style: {marginBottom:8},}
                , React.createElement('strong', { style: {color:"var(--ink)"},}, t("noMedAdvice")  ), (_lang==="VN"?" Thông tin, đánh giá mẫu bệnh và gợi ý huyệt vị do AAIDA cung cấp không phải là lời khuyên y tế và không được dùng thay thế chẩn đoán hay điều trị Đông y chuyên nghiệp.":_lang==="FR"?" Les informations, évaluations de modèles et suggestions de points d'acupuncture fournies par AAIDA ne constituent pas un avis médical.":_lang==="ZH"?" AAIDA提供的信息、证型评估和穴位建议不构成医疗建议，不应替代专业中医诊断或治疗。":" The information, pattern assessments, and acupuncture point suggestions provided by AAIDA do not constitute medical advice and should not be used as a substitute for professional TCM diagnosis or treatment.")



              )
              , React.createElement('p', { style: {marginBottom:8},}
                , React.createElement('strong', { style: {color:"var(--ink)"},}, (_lang==="VN"?"Cơ sở tri thức đang phát triển.":_lang==="FR"?"Base de connaissances évolutive.":_lang==="ZH"?"不断进化的知识库。":"Evolving Knowledge Base.")  ), (_lang==="VN"?" AAIDA là công cụ lâm sàng đang phát triển. Cơ sở dữ liệu phản ánh kiến thức tại thời điểm xuất bản và sẽ được cập nhật theo nghiên cứu và kinh nghiệm lâm sàng Đông y.":_lang==="FR"?" AAIDA est un outil clinique évolutif dont la base de données sera mise à jour au fil des recherches et de l'expérience clinique en MTC.":_lang==="ZH"?" AAIDA是一个不断发展的临床工具，其数据库将随着中医研究和临床经验的发展而更新。":" AAIDA is an evolving clinical tool. Its database of patterns, findings, and treatment protocols reflects the knowledge available at the time of publication and will be updated as TCM research and clinical experience develop. Users are encouraged to apply their own clinical expertise and consult current TCM literature.")




              )
              , React.createElement('p', { style: {marginBottom:8},}
                , React.createElement('strong', { style: {color:"var(--ink)"},}, (_lang==="VN"?"Bảo mật dữ liệu.":_lang==="FR"?"Confidentialité des données.":_lang==="ZH"?"数据隐私。":"Data Privacy.") ), (_lang==="VN"?" Toàn bộ dữ liệu bệnh nhân nhập vào AAIDA được lưu trữ cục bộ trên thiết bị của bạn. Không có thông tin bệnh nhân nào được truyền ra máy chủ bên ngoài.":_lang==="FR"?" Toutes les données patients saisies dans AAIDA sont stockées localement sur votre appareil uniquement. Aucune information n'est transmise à un serveur externe.":_lang==="ZH"?" 所有输入AAIDA的患者数据仅存储在您的本地设备上，不向任何外部服务器传输任何患者信息。":" All patient data entered into AAIDA is stored locally on your device only. No patient information is transmitted to any external server. Users are responsible for complying with applicable patient privacy laws and regulations in their jurisdiction.")



              )
              , React.createElement('p', { style: {marginBottom:8},}
                , React.createElement('strong', { style: {color:"var(--ink)"},}, t("feedbackMatter")  ), (_lang==="VN"?" AAIDA cam kết cải tiến liên tục thông qua trí tuệ tập thể của cộng đồng Đông y. Mọi quan sát, chỉnh sửa và đề xuất từ thầy thuốc và sinh viên đều rất được hoan nghênh.":_lang==="FR"?" AAIDA s'engage à s'améliorer continuellement grâce à la sagesse collective de la communauté MTC. Les observations, corrections et suggestions sont les bienvenues.":_lang==="ZH"?" AAIDA致力于通过中医社区的集体智慧持续改进。欢迎来自医师和学生的临床观察、纠正和建议。":" AAIDA is dedicated to continuous improvement through the collective wisdom of the TCM community. Clinical observations, corrections, and suggestions from practitioners and students are greatly welcomed and will help refine this tool for the benefit of all users.")




              )
              , React.createElement('p', { style: {color:"var(--ink)",fontStyle:"italic",fontSize:11,marginTop:10,
                borderTop:"1px solid var(--gold-lt)",paddingTop:10},}, "By using AAIDA, you confirm that you are a licensed TCM practitioner or a student operating under qualified supervision, and that you understand and accept these terms."


              )
            )
          )
        )
      )

      /* Feedback card */
      , React.createElement('div', { className: "card", style: {border:"1px solid var(--teal)",background:"var(--teal-lt)"},}
        , React.createElement('div', { className: "card-hd",}, React.createElement('span', { className: "pip teal" ,}), t("feedback")  )
        , React.createElement('p', { style: {fontSize:13,lineHeight:1.7,color:"var(--teal-dk)"},}, (_lang==="VN"?"AAIDA là công cụ sống động, không ngừng phát triển. Kinh nghiệm lâm sàng của bạn là tài nguyên quý nhất. Nếu bạn nhận thấy điều gì chưa chính xác hoặc muốn đóng góp, phản hồi của bạn rất được trân trọng.":_lang==="FR"?"AAIDA est un outil vivant et évolutif. Votre expérience clinique est sa ressource la plus précieuse. Vos retours sont profondément appréciés et aideront à façonner les versions futures.":_lang==="ZH"?"AAIDA是一个不断发展的工具，您的临床经验是其最宝贵的资源。如发现错误或有建议，您的反馈将帮助塑造未来版本。":"AAIDA is a living, evolving tool. Your clinical experience is its most valuable resource. If you notice an inaccuracy, have a suggestion, or wish to contribute to the knowledge base, your feedback is deeply appreciated and will help shape future versions.")



        )
      )

      /* Data card */
      , React.createElement('div', { className: "card",}
        , React.createElement('div', { className: "card-hd",}, React.createElement('span', { className: "pip red" ,}), t("patientData") )
        , React.createElement('p', { style: {fontSize:13,color:"var(--muted)",marginBottom:12},}
          , store.patients.length, " patient" , store.patients.length!==1?"s":"", " · "  , store.intakes.length, " intake" , store.intakes.length!==1?"s":"", (_lang==="VN"?" lưu trữ cục bộ trên thiết bị này.":_lang==="FR"?" stocké(s) localement sur cet appareil.":_lang==="ZH"?" 存储在本地设备上。":" stored locally on this device.")
        )

        , React.createElement('div', { className: "card-hd", style:{marginTop:8,marginBottom:6}}, React.createElement('span', { className: "pip",}), t("backupRestore") )
        , React.createElement('div', { style:{display:"flex",gap:8,flexWrap:"wrap",marginBottom:12}},
          React.createElement('button', { className: "btn btn-primary btn-sm",
            onClick: ()=>exportJSON(store),
            title:"Download a full JSON backup of all patients and intakes"
          }, t("exportJSON")),
          React.createElement('label', { className: "btn btn-primary btn-sm",
            style:{cursor:"pointer",margin:0},
            title:"Restore from a previously exported JSON backup"
          },
            t("importJSON"),
            React.createElement('input', { type:"file", accept:".json", style:{display:"none"},
              onChange: e => {
                const file = e.target.files[0];
                if (!file) return;
                if (!window.confirm("Import will REPLACE all current patients and intakes. Continue?")) return;
                importJSON(file, onImport);
                e.target.value = "";
              }
            })
          )
        )

        , React.createElement('div', { className: "card-hd", style:{marginTop:8,marginBottom:6}}, React.createElement('span', { className: "pip teal",}), t("exportAnalysis") )
        , React.createElement('div', { style:{display:"flex",gap:8,flexWrap:"wrap",marginBottom:12}},
          React.createElement('button', { className: "btn btn-sm", style:{background:"var(--teal)",color:"#fff",border:"none"},
            onClick: ()=>exportExcel(store),
            title:t("exportExcelDesc")
          }, t("exportExcel"))
        )

        , React.createElement('hr', { style:{margin:"12px 0"}}),
        React.createElement('button', { className: "btn btn-danger btn-sm"  ,
          onClick: ()=>{if(window.confirm(t("clearDataConfirm")))onClear();},}, t("btnClearData")

        )
      )
    )
  );
}

// ─── ADMIN SCREEN ─────────────────────────────────────────────────────────
function Admin({ userDB, onSaveUserDB }) {
  const [adminTab, setAdminTab] = useState("findings");
  const [saved, setSaved] = useState(false);
  const [fName, setFName]       = useState("");
  const [fDomain, setFDomain]   = useState("Symptom");
  const [fField, setFField]     = useState("");
  const [fConfirm, setFConfirm] = useState("");
  const [sText, setSText]       = useState("");
  const [sPts, setSPts]         = useState("");
  const [sConfirm, setSConfirm] = useState("");
  const [pfPatId, setPfPatId]   = useState("");
  const [pfFindId, setPfFindId] = useState("");
  const [pfStrength, setPfStrength] = useState("3");
  const [pfConfirm, setPfConfirm]   = useState("");

  const persist = (updated) => { onSaveUserDB(updated); setSaved(true); setTimeout(()=>setSaved(false),2000); };

  const addFinding = () => {
    if (!fName.trim()) return;
    const newId = 10000 + (userDB.findings||[]).length + 1;
    const updated = { ...userDB, findings: [...(userDB.findings||[]), {
      id: newId, name: fName.trim(), domain: fDomain,
      field: fField.trim()||t("customLabel"), isActive: true, addedAt: new Date().toISOString()
    }]};
    persist(updated);
    setFConfirm(`✓ Finding "${fName.trim()}" added (ID ${newId})`);
    setFName(""); setFField("");
  };

  const addSPattern = () => {
    if (!sText.trim() || !sPts.trim()) return;
    const pts = sPts.split(/[,\r\n]+/).map(p=>p.trim().toUpperCase()).filter(Boolean);
    const newId = 9000 + (userDB.sPatterns||[]).length + 1;
    const updated = { ...userDB, sPatterns: [...(userDB.sPatterns||[]), {
      id: newId, en: sText.trim(), cat:t("customLabel"),
      pts: pts.map(p=>[p,p,""]), addedAt: new Date().toISOString()
    }]};
    persist(updated);
    setSConfirm(`✓ Pattern "${sText.trim()}" added with ${pts.length} points`);
    setSText(""); setSPts("");
  };

  const addPatternFinding = () => {
    const pid = parseInt(pfPatId), fid = parseInt(pfFindId), str = parseInt(pfStrength)||3;
    if (!pid || !fid) return;
    const pat = DB.patterns.find(p=>p.id===pid);
    const fin = DB.findings[String(fid)] || (userDB.findings||[]).find(f=>f.id===fid);
    if (!pat) { setPfConfirm("⚠ Pattern ID not found"); return; }
    if (!fin) { setPfConfirm("⚠ Finding ID not found"); return; }
    const updated = { ...userDB, patternFindings: [...(userDB.patternFindings||[]), {
      patternId:pid, findingId:fid, strength:str, isKey:false, addedAt:new Date().toISOString()
    }]};
    persist(updated);
    const finName = Array.isArray(fin) ? fin[1] : fin.name;
    setPfConfirm(`✓ Linked "${finName}" → "${pat.name}" (strength ${str})`);
    setPfPatId(""); setPfFindId("");
  };

  const removeUserFinding  = (id)  => persist({...userDB, findings:(userDB.findings||[]).filter(f=>f.id!==id)});
  const removeUserSPattern = (id)  => persist({...userDB, sPatterns:(userDB.sPatterns||[]).filter(s=>s.id!==id)});
  const removeUserPF       = (idx) => { const pfs=[...(userDB.patternFindings||[])]; pfs.splice(idx,1); persist({...userDB,patternFindings:pfs}); };

  const tabBtn = (t, label) => (
    React.createElement('button', { key: t, onClick: ()=>setAdminTab(t),
      style: {flex:1,padding:"8px 4px",fontSize:11,border:"none",cursor:"pointer",
        borderBottom: adminTab===t?"2px solid var(--gold)":"2px solid transparent",
        background:"transparent",color:adminTab===t?"var(--ink)":"var(--muted)",
        fontWeight:adminTab===t?600:400,letterSpacing:".04em"},}
      , label
    )
  );

  return (
    React.createElement('div', { className: "fu",}
      , saved && (
        React.createElement('div', { style: {margin:"10px 14px 0",padding:"8px 12px",background:"#e8f5e8",
          border:"1px solid #b8d8b8",borderRadius:8,fontSize:12,color:"#2a6a2a"},}, "✓ Saved successfully"

        )
      )
      , React.createElement('div', { style: {display:"flex",borderBottom:"1px solid var(--border)",margin:"10px 14px 0",gap:0},}
        , tabBtn("findings",t("findingsSec"))
        , tabBtn("spatterns",_lang==="VN"?"Triệu chứng học":_lang==="FR"?"Symptomatique":_lang==="ZH"?"症候":"Symptomatic")
        , tabBtn("links",t("patternLinks"))
        , tabBtn("review",t("reviewDb"))
      )

      , adminTab==="findings" && (
        React.createElement('div', null
          , React.createElement('div', { className: "card", style: {marginTop:10},}
            , React.createElement('div', { className: "card-hd",}, React.createElement('span', { className: "pip teal" ,}), (_lang==="VN"?"Thêm phát hiện mới":_lang==="FR"?"Ajouter une observation":_lang==="ZH"?"添加新发现":"Add New Finding")  )
            , React.createElement('p', { style: {fontSize:12,color:"var(--muted)",marginBottom:12,lineHeight:1.6},}, t("newFindingsInfo")

            )
            , React.createElement('div', { className: "field",}, React.createElement('label', null, t("findingName")  )
              , React.createElement('input', { value: fName, onChange: e=>setFName(e.target.value), placeholder: _lang==="VN"?"VD: Mệt mỏi buổi chiều kèm ra mồ hôi":_lang==="FR"?"Ex: Fatigue l'après-midi avec transpiration":_lang==="ZH"?"例：下午疲劳伴出汗":"e.g. Afternoon fatigue with sweating"    ,})
            )
            , React.createElement('div', { className: "row2",}
              , React.createElement('div', { className: "field",}, React.createElement('label', null, _lang==="VN"?"Lĩnh vực":_lang==="FR"?"Domaine":_lang==="ZH"?"领域":"Domain")
                , React.createElement('select', { value: fDomain, onChange: e=>setFDomain(e.target.value),}
                  , React.createElement('option', null, _lang==="VN"?"Triệu chứng":_lang==="FR"?"Symptôme":_lang==="ZH"?"症状":"Symptom"), React.createElement('option', null, _lang==="VN"?"Lưỡi":_lang==="FR"?"Langue":_lang==="ZH"?"舌":"Tongue"), React.createElement('option', null, _lang==="VN"?"Mạch":_lang==="FR"?"Pouls":_lang==="ZH"?"脉":"Pulse")
                )
              )
              , React.createElement('div', { className: "field",}, React.createElement('label', null, t("sourceFld") )
                , React.createElement('input', { value: fField, onChange: e=>setFField(e.target.value), placeholder: _lang==="VN"?"VD: EnergyLevel, SleepQuality":_lang==="FR"?"Ex: EnergyLevel, SleepQuality":_lang==="ZH"?"例：EnergyLevel":"e.g. FatigueTime" ,})
              )
            )
            , fConfirm && React.createElement('div', { style: {fontSize:12,color:"#2a6a2a",marginBottom:8},}, fConfirm)
            , React.createElement('button', { className: "btn btn-primary btn-full"  , onClick: addFinding, disabled: !fName.trim(),}, (_lang==="VN"?"+ Thêm phát hiện":_lang==="FR"?"+ Ajouter":_lang==="ZH"?"+ 添加发现":"+ Add Finding")  )
          )
          , (userDB.findings||[]).length > 0 && (
            React.createElement('div', { className: "card",}
              , React.createElement('div', { className: "card-hd",}, React.createElement('span', { className: "pip",}), (_lang==="VN"?"Phát hiện tùy chỉnh (":_lang==="FR"?"Observations personnalisées (":_lang==="ZH"?"自定义发现 (":"Custom Findings (")  , (userDB.findings||[]).length, ")")
              , (userDB.findings||[]).map(f=>(
                React.createElement('div', { key: f.id, style: {display:"flex",alignItems:"center",justifyContent:"space-between",
                  padding:"7px 0",borderBottom:"1px solid var(--border-lt)"},}
                  , React.createElement('div', null, React.createElement('span', { style: {fontSize:13,fontWeight:500},}, f.name)
                    , React.createElement('span', { style: {fontSize:10,color:"var(--muted)",marginLeft:8},}, f.domain, " · ID "   , f.id))
                  , React.createElement('button', { onClick: ()=>removeUserFinding(f.id),
                    style: {background:"none",border:"none",color:"var(--red)",cursor:"pointer",fontSize:16,padding:"2px 6px"},}, "×")
                )
              ))
            )
          )
        )
      )

      , adminTab==="spatterns" && (
        React.createElement('div', null
          , React.createElement('div', { className: "card", style: {marginTop:10},}
            , React.createElement('div', { className: "card-hd",}, React.createElement('span', { className: "pip teal" ,}), t("addSymptPat")  )
            , React.createElement('p', { style: {fontSize:12,color:"var(--muted)",marginBottom:12,lineHeight:1.6},}, (_lang==="VN"?"Thêm mô tả triệu chứng mới với bộ huyệt thực nghiệm. Dùng để khớp CC/OC.":_lang==="FR"?"Ajouter une description symptomatique avec son ensemble de points empiriques. Utilisé pour la correspondance CC/OC.":_lang==="ZH"?"添加新症状描述及其经验穴位组，用于CC/OC匹配。":"Add a new symptom description with its empirical point set. Used for CC/OC matching.")

            )
            , React.createElement('div', { className: "field",}, React.createElement('label', null, _lang==="VN"?"Mô tả triệu chứng *":_lang==="FR"?"Description du symptôme *":_lang==="ZH"?"症状描述 *":"Symptom Description *")
              , React.createElement('input', { value: sText, onChange: e=>setSText(e.target.value), placeholder: _lang==="VN"?"VD: Đau thắt lưng mãn tính kèm cảm giác lạnh":_lang==="FR"?"Ex: Lombalgie chronique avec sensation de froid":_lang==="ZH"?"例：慢性腰痛伴寒凉感":"e.g. Chronic lower back pain with cold sensation"       ,})
            )
            , React.createElement('div', { className: "field",}, React.createElement('label', null, _lang==="VN"?"Huyệt châm cứu * (cách nhau bởi dấu phẩy)":_lang==="FR"?"Points d'acupuncture * (séparés par virgule)":_lang==="ZH"?"穴位 *（逗号分隔）":"Acupuncture Points * (comma-separated)")
              , React.createElement('textarea', { value: sPts, onChange: e=>setSPts(e.target.value), rows: 2, placeholder: "e.g. UB23, DU4, KI3, UB52"    ,})
            )
            , sConfirm && React.createElement('div', { style: {fontSize:12,color:"#2a6a2a",marginBottom:8},}, sConfirm)
            , React.createElement('button', { className: "btn btn-primary btn-full"  , onClick: addSPattern, disabled: !sText.trim()||!sPts.trim(),}, (_lang==="VN"?"+ Thêm mẫu":_lang==="FR"?"+ Ajouter modèle":_lang==="ZH"?"+ 添加模式":"+ Add Pattern")  )
          )
          , (userDB.sPatterns||[]).length > 0 && (
            React.createElement('div', { className: "card",}
              , React.createElement('div', { className: "card-hd",}, React.createElement('span', { className: "pip",}), (_lang==="VN"?"Mẫu triệu chứng tùy chỉnh (":_lang==="FR"?"Modèles symptomatiques personnalisés (":_lang==="ZH"?"自定义症候模式 (":"Custom Symptomatic Patterns (")   , (userDB.sPatterns||[]).length, ")")
              , (userDB.sPatterns||[]).map(s=>(
                React.createElement('div', { key: s.id, style: {padding:"8px 0",borderBottom:"1px solid var(--border-lt)"},}
                  , React.createElement('div', { style: {display:"flex",justifyContent:"space-between",alignItems:"flex-start"},}
                    , React.createElement('div', { style: {flex:1},}
                      , React.createElement('div', { style: {fontSize:13,fontWeight:500},}, s.en)
                      , React.createElement('div', { style: {marginTop:4},}, s.pts.map((p,i)=>(
                        React.createElement('span', { key: i, style: {fontSize:11,background:"var(--teal-lt)",color:"var(--teal-dk)",
                          borderRadius:4,padding:"2px 6px",marginRight:3,fontWeight:600},}, p[0])
                      )))
                    )
                    , React.createElement('button', { onClick: ()=>removeUserSPattern(s.id),
                      style: {background:"none",border:"none",color:"var(--red)",cursor:"pointer",fontSize:16,padding:"2px 6px"},}, "×")
                  )
                )
              ))
            )
          )
        )
      )

      , adminTab==="links" && (
        React.createElement('div', null
          , React.createElement('div', { className: "card", style: {marginTop:10},}
            , React.createElement('div', { className: "card-hd",}, React.createElement('span', { className: "pip teal" ,}), t("linkFindingPat")   )
            , React.createElement('p', { style: {fontSize:12,color:"var(--muted)",marginBottom:12,lineHeight:1.6},}, (_lang==="VN"?"Liên kết phát hiện với mẫu bằng trọng số chẩn đoán để cải thiện độ chính xác từ kinh nghiệm lâm sàng.":_lang==="FR"?"Connecter une observation à un modèle avec un poids diagnostique pour améliorer la précision du score.":_lang==="ZH"?"将发现与证型关联并设置诊断权重，以提高评分准确性。":"Connect a finding to a pattern with a diagnostic weight to improve scoring accuracy from your clinical experience.")

            )
            , React.createElement('div', { className: "field",}, React.createElement('label', null, (_lang==="VN"?"Mã mẫu":_lang==="FR"?"ID modèle":_lang==="ZH"?"证型ID":"Pattern ID") )
              , React.createElement('input', { type: "number", value: pfPatId, onChange: e=>setPfPatId(e.target.value), placeholder: "e.g. 8" ,})
              , pfPatId && DB.patterns.find(p=>p.id===parseInt(pfPatId)) && (
                React.createElement('div', { style: {fontSize:11,color:"var(--teal)",marginTop:3},}, "✓ " , DB.patterns.find(p=>p.id===parseInt(pfPatId)).name)
              )
            )
            , React.createElement('div', { className: "field",}, React.createElement('label', null, t("findingId") )
              , React.createElement('input', { type: "number", value: pfFindId, onChange: e=>setPfFindId(e.target.value), placeholder: "e.g. 45 (see Review DB tab)"     ,})
              , pfFindId && (DB.findings[pfFindId]||(userDB.findings||[]).find(f=>f.id===parseInt(pfFindId))) && (
                React.createElement('div', { style: {fontSize:11,color:"var(--teal)",marginTop:3},}, "✓ "
                   , _optionalChain([DB, 'access', _16 => _16.findings, 'access', _17 => _17[pfFindId], 'optionalAccess', _18 => _18[1]])||_optionalChain([(userDB.findings||[]), 'access', _19 => _19.find, 'call', _20 => _20(f=>f.id===parseInt(pfFindId)), 'optionalAccess', _21 => _21.name])
                )
              )
            )
            , React.createElement('div', { className: "field",}, React.createElement('label', null, t("diagnosticStr") )
              , React.createElement('div', { className: "chips",}
                , [["2",_lang==="VN"?"Trung bình":_lang==="FR"?"Modéré":_lang==="ZH"?"中等":"Moderate"],["3",_lang==="VN"?"Mạnh — chỉ số chính":_lang==="FR"?"Fort — indicateur clé":_lang==="ZH"?"强 — 关键指标":"Strong — key indicator"]].map(([v,l])=>(
                  React.createElement('div', { key: v, className: `chip ${pfStrength===v?"on":""}`, onClick: ()=>setPfStrength(v),}, v, " — "  , l)
                ))
              )
            )
            , pfConfirm && React.createElement('div', { style: {fontSize:12,color:pfConfirm.startsWith("⚠")?"var(--red)":"#2a6a2a",marginBottom:8},}, pfConfirm)
            , React.createElement('button', { className: "btn btn-primary btn-full"  , onClick: addPatternFinding, disabled: !pfPatId||!pfFindId,}, (_lang==="VN"?"+ Thêm liên kết":_lang==="FR"?"+ Ajouter lien":_lang==="ZH"?"+ 添加链接":"+ Add Link")  )
          )
          , (userDB.patternFindings||[]).length > 0 && (
            React.createElement('div', { className: "card",}
              , React.createElement('div', { className: "card-hd",}, React.createElement('span', { className: "pip",}), (_lang==="VN"?"Liên kết tùy chỉnh (":_lang==="FR"?"Liens personnalisés (":_lang==="ZH"?"自定义链接 (":"Custom Links (")  , (userDB.patternFindings||[]).length, ")")
              , (userDB.patternFindings||[]).map((pf,i)=>{
                const pat = DB.patterns.find(p=>p.id===pf.patternId);
                const fin = DB.findings[String(pf.findingId)]||(userDB.findings||[]).find(f=>f.id===pf.findingId);
                const finName = Array.isArray(fin)?fin[1]:_optionalChain([fin, 'optionalAccess', _22 => _22.name])||pf.findingId;
                return (
                  React.createElement('div', { key: i, style: {display:"flex",alignItems:"center",justifyContent:"space-between",
                    padding:"7px 0",borderBottom:"1px solid var(--border-lt)"},}
                    , React.createElement('div', { style: {fontSize:12},}
                      , React.createElement('span', { style: {fontWeight:500},}, finName)
                      , React.createElement('span', { style: {color:"var(--muted)"},}, " → "  )
                      , React.createElement('span', { style: {fontWeight:500},}, _optionalChain([pat, 'optionalAccess', _23 => _23.name])||pf.patternId)
                      , React.createElement('span', { style: {fontSize:10,color:"var(--muted)",marginLeft:6},}, "strength " , pf.strength)
                    )
                    , React.createElement('button', { onClick: ()=>removeUserPF(i),
                      style: {background:"none",border:"none",color:"var(--red)",cursor:"pointer",fontSize:16,padding:"2px 6px"},}, "×")
                  )
                );
              })
            )
          )
        )
      )

      , adminTab==="review" && (
        React.createElement('div', null
          , React.createElement('div', { className: "card", style: {marginTop:10},}
            , React.createElement('div', { className: "card-hd",}, React.createElement('span', { className: "pip",}), (_lang==="VN"?"Mẫu (tham chiếu ID)":_lang==="FR"?"Modèles (référence ID)":_lang==="ZH"?"证型（ID参考）":"Patterns (ID reference)")  )
            , React.createElement('div', { style: {maxHeight:280,overflowY:"auto"},}
              , DB.patterns.slice(0,40).map(p=>(
                React.createElement('div', { key: p.id, style: {fontSize:12,padding:"3px 0",borderBottom:"1px solid var(--border-lt)",
                  display:"flex",justifyContent:"space-between"},}
                  , React.createElement('span', null, tPattern(p.name, p.id))
                  , React.createElement('span', { style: {color:"var(--muted)",fontWeight:600,minWidth:30,textAlign:"right"},}, "#", p.id)
                )
              ))
            )
          )
          , React.createElement('div', { className: "card",}
            , React.createElement('div', { className: "card-hd",}, React.createElement('span', { className: "pip",}), (_lang==="VN"?"Phát hiện (tham chiếu ID)":_lang==="FR"?"Observations (référence ID)":_lang==="ZH"?"发现（ID参考）":"Findings (ID reference)")  )
            , React.createElement('div', { style: {maxHeight:280,overflowY:"auto"},}
              , Object.entries(DB.findings).slice(0,60).map(([id,f])=>(
                React.createElement('div', { key: id, style: {fontSize:12,padding:"3px 0",borderBottom:"1px solid var(--border-lt)",
                  display:"flex",justifyContent:"space-between"},}
                  , React.createElement('span', null, (FINDING_I18N[id]&&FINDING_I18N[id][_lang])||f[1])
                  , React.createElement('span', { style: {color:"var(--muted)",fontWeight:600,minWidth:30,textAlign:"right"},}, "#", id)
                )
              ))
            )
          )
        )
      )
    )
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────

const USER_DB_KEY = "aaida_userdb_v1";
function loadUserDB() {
  try { const r = localStorage.getItem(USER_DB_KEY); if (r) return JSON.parse(r); } catch (e4) {}
  return { findings:[], sPatterns:[], patternFindings:[] };
}
function saveUserDB(u) { try { localStorage.setItem(USER_DB_KEY, JSON.stringify(u)); } catch (e5) {} }

const INTAKE_DRAFT_KEY = "aaida_intake_draft";



function LanguageSelector({ onSelect }) {
  const [chosen, setChosen] = React.useState("EN");
  const lbl = (key) => { const e=I18N[key]; return e?(e[chosen]||e.EN):key; };
  return React.createElement('div', {
    style:{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",
      justifyContent:"center",background:"linear-gradient(160deg,#3d2e14 0%,#503c18 60%,#3d2e14 100%)",
      padding:"32px 24px",textAlign:"center"}
  },
    React.createElement('div', {style:{fontSize:56,marginBottom:8}}, "\u9488"),
    React.createElement('h1', {style:{color:"var(--gold)",fontSize:28,fontWeight:700,
      letterSpacing:".04em",margin:"0 0 4px"}}, "AAIDA"),
    React.createElement('div', {style:{color:"var(--muted)",fontSize:13,marginBottom:32,
      letterSpacing:".06em"}}, "Acupuncture AI Diagnosis Assistant"),
    React.createElement('p', {style:{color:"#d4b96a",fontSize:16,fontWeight:600,marginBottom:8}},
      lbl("selectLang")),
    React.createElement('p', {style:{color:"var(--muted)",fontSize:12,marginBottom:24}},
      lbl("langSub")),
    React.createElement('div', {style:{display:"flex",flexDirection:"column",gap:12,
      width:"100%",maxWidth:320}},
      SUPPORTED_LANGS.map(function(lang) {
        return React.createElement('button', {
          key: lang.code,
          onClick: function() { setChosen(lang.code); },
          style:{padding:"14px 20px",borderRadius:12,cursor:"pointer",
            display:"flex",alignItems:"center",gap:12,transition:"all .2s",
            border: chosen===lang.code ? "2px solid var(--gold)" : "2px solid rgba(212,185,106,.3)",
            background: chosen===lang.code ? "rgba(212,185,106,.18)" : "rgba(255,255,255,.05)",
            color: chosen===lang.code ? "var(--gold)" : "var(--muted)",
            fontSize:16, fontWeight: chosen===lang.code ? 700 : 400}
        },
          React.createElement('span', {style:{fontSize: lang.code==="EN" ? 14 : 24, fontWeight: lang.code==="EN" ? 700 : 400, letterSpacing:".05em"}}, lang.flag),
          React.createElement('span', null, lang.native),
          chosen===lang.code ? React.createElement('span', {style:{marginLeft:"auto",fontSize:18}}, "\u2713") : null
        );
      })
    ),
    React.createElement('button', {
      onClick: function() { onSelect(chosen); },
      style:{marginTop:28,padding:"14px 40px",borderRadius:12,background:"var(--gold)",
        color:"#fff",border:"none",fontSize:18,fontWeight:700,cursor:"pointer",
        letterSpacing:".04em",boxShadow:"0 2px 16px rgba(212,185,106,.6)"}
    }, lbl("continueBtn"))
  );
}

function App() {
  const [store, setStore]   = useState(loadStore);
  const [userDB, setUserDB] = useState(loadUserDB);
  const [tab, setTab]       = useState("patients");
  const [stack, setStack]   = useState([]);
  const [lang, setLang]     = useState(null);  // always start at Welcome/Language page

  // ── ALL hooks must be declared before any early return ────────────────────
  // Dismiss splash once lang is confirmed and App renders the main UI
  useEffect(function(){
    if (lang) {
      requestAnimationFrame(function(){
        requestAnimationFrame(function(){
          setTimeout(function(){
            if(typeof enterApp==="function") enterApp();
          }, 50);
        });
      });
    }
  }, [lang]);

  const persist    = s => { setStore(s); saveStore(s); };
  const persistUDB = u => { setUserDB(u); saveUserDB(u); };

  useEffect(() => {
    (userDB.findings||[]).forEach(f => {
      if (!DB.findings[String(f.id)])
        DB.findings[String(f.id)] = [f.name, f.name, f.domain, f.field||t("customLabel")];
    });
    (userDB.sPatterns||[]).forEach(s => {
      if (!S_DB.find(x=>x.id===s.id)) S_DB.push(s);
    });
    (userDB.patternFindings||[]).forEach(pf => {
      const pat = DB.patterns.find(p=>p.id===pf.patternId);
      if (pat && !pat.findings.find(f=>f[0]===pf.findingId))
        pat.findings.push([pf.findingId, pf.strength, pf.isKey?1:0]);
    });
  }, [userDB]);

  const push = (view, payload={}) => setStack(s=>[...s,{view,payload}]);
  const pop  = () => setStack(s=>s.slice(0,-1));
  const top  = stack[stack.length-1];

  // Idle timeout: 5 min on home screen only (no stack, not in intake)
  const [idleWarning, setIdleWarning] = useState(false);
  useEffect(() => {
    if (!lang) { setIdleWarning(false); return; }  // no idle when on lang selector
    const isHome = () => stack.length === 0;
    if (!isHome()) { setIdleWarning(false); return; }
    let warnTimer, resetTimer;
    const reset = () => {
      clearTimeout(warnTimer); clearTimeout(resetTimer);
      setIdleWarning(false);
      warnTimer = setTimeout(() => setIdleWarning(true), 4 * 60 * 1000);
      resetTimer = setTimeout(() => {
        setIdleWarning(false);
        setTab("patients");
      }, 5 * 60 * 1000);
    };
    const events = ["mousemove","mousedown","keydown","touchstart","scroll"];
    events.forEach(e => window.addEventListener(e, reset));
    reset();
    return () => {
      clearTimeout(warnTimer); clearTimeout(resetTimer);
      events.forEach(e => window.removeEventListener(e, reset));
    };
  }, [lang, stack.length]);

  // ── Early return: show language selector until user picks a language ──────
  if (!lang) return React.createElement(LanguageSelector, {
    onSelect: function(code) {
      try{localStorage.setItem(LANG_KEY,code);}catch(e3){}
      _lang=code;
      setLang(code);
    }
  });
  _lang = lang;

  const addPatient = form => {
    const p = {...form, id:store.nPID};
    persist({...store, patients:[...store.patients,p], nPID:store.nPID+1});
    pop(); push((_lang==="VN"?"bệnh nhân":_lang==="FR"?"patient":_lang==="ZH"?"患者":"patient"),{patient:p});
  };

  const updatePatient = (patientId, form) => {
    const updated = {...form, id: patientId};
    persist({...store, patients: store.patients.map(p => p.id===patientId ? updated : p)});
    pop();
    // Refresh the patient view with updated data
    setStack(s => s.map(frame =>
      frame.view===(_lang==="VN"?"bệnh nhân":_lang==="FR"?"patient":_lang==="ZH"?"患者":"patient") && frame.payload.patient.id===patientId
        ? {...frame, payload:{...frame.payload, patient:updated}}
        : frame
    ));
  };

  const addIntake = (patientId, form) => {
    const intake = {...form, id:store.nIID, patientId};
    persist({...store, intakes:[...store.intakes,intake], nIID:store.nIID+1});
    pop(); push("assessment",{intake, patient:store.patients.find(p=>p.id===patientId)});
  };

  const updateIntake = (intakeId, patientId, form) => {
    const updated = {...form, id:intakeId, patientId};
    persist({...store, intakes:store.intakes.map(i=>i.id===intakeId?updated:i)});
    pop();
    push("assessment",{intake:updated, patient:store.patients.find(p=>p.id===patientId)});
  };

  const saveFinalPlan = (intakeId, plan) => {
    const updatedIntakes = store.intakes.map(i=>i.id===intakeId?{...i,finalPlan:plan}:i);
    persist({...store, intakes:updatedIntakes});
    setStack(s=>s.map(frame=>
      frame.view==="assessment"&&frame.payload.intake.id===intakeId
        ?{...frame,payload:{...frame.payload,intake:updatedIntakes.find(i=>i.id===intakeId)}}
        :frame
    ));
  };

  const titles = {
    newPatient:t("newPatientBtn"),
    editPatient:t("editPatientBtn"),
    patient: _optionalChain([top, 'optionalAccess', _24 => _24.payload, 'optionalAccess', _25 => _25.patient, 'optionalAccess', _26 => _26.firstName])+" "+_optionalChain([top, 'optionalAccess', _27 => _27.payload, 'optionalAccess', _28 => _28.patient, 'optionalAccess', _29 => _29.lastName]),
    intake:t("newIntake"), editIntake:t("editIntakeBtn"), assessment:(_lang==="VN"?"Đánh Giá":_lang==="FR"?"Évaluation":_lang==="ZH"?"证型评估":"Assessment"),
  };
  const title = top?(titles[top.view]||"AAIDA"):"AAIDA";
  const userDBCount = (userDB.findings||[]).length+(userDB.sPatterns||[]).length+(userDB.patternFindings||[]).length;

  return (
    React.createElement(React.Fragment, null
      , React.createElement('style', null, CSS)
      , React.createElement('div', { className: "app",}
        , React.createElement('div', { className: "header",}
          , stack.length>0 && React.createElement('button', { className: "back-btn", onClick: pop,}, "‹")
          , stack.length>1 && React.createElement('button', { className: "back-btn", onClick: ()=>setStack([]), style:{marginLeft:2,fontSize:12,padding:"4px 8px"}}, "⌂")
          , React.createElement('div', { style:{flex:1,minWidth:0}},
            React.createElement('div', { className: "header-logo",}, title),
            !stack.length && React.createElement('div', { className: "header-sub",}, t("appSubtitle"))
          )
          , React.createElement('div', { style:{display:"flex",gap:4,alignItems:"center",marginLeft:8,flexShrink:0}},
            SUPPORTED_LANGS.map(function(lg) {
              return React.createElement('button', {
                key: lg.code,
                title: lg.native,
                onClick: function() {
                  try{localStorage.setItem(LANG_KEY,lg.code);}catch(e){}
                  _lang=lg.code;
                  setLang(lg.code);
                },
                style:{
                  background: _lang===lg.code ? "var(--gold)" : "rgba(255,255,255,.12)",
                  border: "1px solid " + (_lang===lg.code ? "var(--gold)" : "rgba(255,255,255,.25)"),
                  borderRadius:6, padding:"3px 7px", cursor:"pointer",
                  fontSize: lg.code==="EN" ? 11 : 16, lineHeight:"1.4",
                  fontWeight: lg.code==="EN" ? 700 : 400,
                  color: _lang===lg.code ? "#1a1208" : "#fff",
                  letterSpacing: lg.code==="EN" ? ".05em" : 0,
                  transition:"all .15s", minWidth:28, textAlign:"center"
                }
              }, lg.flag);
            })
          )
        )

        , idleWarning && React.createElement('div', { style: {background:"#fff3cd",color:"#856404",fontSize:12,textAlign:"center",padding:"6px 12px",borderBottom:"1px solid #ffc107"}}, t("idleWarning"))
        , React.createElement('div', { className: "main",}
          , _optionalChain([top, 'optionalAccess', _30 => _30.view])==="newPatient" && React.createElement(NewPatient, { onSave: addPatient, onCancel: pop,})
          , _optionalChain([top, 'optionalAccess', _31 => _31.view])==="editPatient" && (
            React.createElement(NewPatient, {
              existing: top.payload.patient,
              onSave: form=>updatePatient(top.payload.patient.id, form),
              onCancel: pop,})
          )
          , _optionalChain([top, 'optionalAccess', _32 => _32.view])===(_lang==="VN"?"bệnh nhân":_lang==="FR"?"patient":_lang==="ZH"?"患者":"patient") && (
            React.createElement(PatientRecord, { patient: top.payload.patient, store: store,
              onNew: ()=>push((_lang==="VN"?"lần khám":_lang==="FR"?"consultation":_lang==="ZH"?"问诊":"intake"),{patient:top.payload.patient}),
              onOpen: intake=>push("assessment",{intake,patient:top.payload.patient}),
              onEdit: ()=>push("editPatient",{patient:top.payload.patient}),})
          )
          , _optionalChain([top, 'optionalAccess', _33 => _33.view])===(_lang==="VN"?"lần khám":_lang==="FR"?"consultation":_lang==="ZH"?"问诊":"intake") && (
            React.createElement(IntakeWizard, { patient: top.payload.patient,
              onSave: form=>addIntake(top.payload.patient.id,form), onCancel: pop,})
          )
          , _optionalChain([top, 'optionalAccess', _34 => _34.view])==="editIntake" && (
            React.createElement(IntakeWizard, { patient: top.payload.patient, existing: top.payload.intake,
              onSave: form=>updateIntake(top.payload.intake.id,top.payload.patient.id,form),
              onCancel: pop,})
          )
          , _optionalChain([top, 'optionalAccess', _35 => _35.view])==="assessment" && (
            React.createElement(PatternAssessment, { intake: top.payload.intake, patient: top.payload.patient,
              onBack: pop,
              onEdit: ()=>push("editIntake",{intake:top.payload.intake,patient:top.payload.patient}),
              onSavePlan: saveFinalPlan,})
          )
          , !top&&tab==="patients" && (
            React.createElement(React.Fragment, null,
              React.createElement(PatientList, { store: store, onSelect: p=>push((_lang==="VN"?"bệnh nhân":_lang==="FR"?"patient":_lang==="ZH"?"患者":"patient"),{patient:p}), onNew: ()=>push("newPatient"),}),
              React.createElement('div', {style:{textAlign:"center",padding:"10px 0 4px",fontSize:11,color:"var(--gold)",letterSpacing:".08em",fontWeight:500}}, t("freeStudent"))
            )
          )
          , !top&&tab==="admin" && React.createElement(Admin, { userDB: userDB, onSaveUserDB: persistUDB,})
          , !top&&tab==="settings" && (
            React.createElement(Settings, { store: store,
              onClear: ()=>persist({patients:[],intakes:[],nPID:1001,nIID:1}),
              onImport: data => {
                const maxPID = data.patients.reduce((m,p) => Math.max(m, p.id||0), 1000);
                const maxIID = data.intakes.reduce((m,i)  => Math.max(m, i.id||0), 0);
                persist({
                  patients: data.patients,
                  intakes:  data.intakes,
                  nPID: maxPID + 1,
                  nIID: maxIID + 1
                });
                alert(`Imported ${data.patients.length} patient(s) and ${data.intakes.length} intake(s).`);
              },
            })
          )
        )

        , !top && (
          React.createElement('div', { className: "bot-nav",}
            , React.createElement('button', { className: `nav-btn ${tab==="patients"?"active":""}`, onClick: ()=>setTab("patients"),}
              , Ic.patients, React.createElement('span', null, t("navPatients"))
            )
            , React.createElement('button', { className: `nav-btn ${tab==="admin"?"active":""}`, onClick: ()=>setTab("admin"),}
              , React.createElement('svg', { viewBox: "0 0 24 24"   , fill: "none", stroke: "currentColor", strokeWidth: "2",}
                , React.createElement('path', { d: "M12 20h9" ,}), React.createElement('path', { d: "M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"           ,})
              )
              , React.createElement('span', null, "Admin", userDBCount>0?` (${userDBCount})`:"")
            )
            , React.createElement('button', { className: `nav-btn ${tab==="settings"?"active":""}`, onClick: ()=>setTab("settings"),}
              , Ic.settings, React.createElement('span', null, t("navSettings"))
            )
          )
        )
      )
    )
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(App));

// Splash loading bar hides after animation
setTimeout(function(){
  var bar=document.getElementById('splash-loading');
  var ver=document.getElementById('splash-version');
  if(bar) bar.style.display='none';
  if(ver) ver.style.display='block';
}, 1200);

// enterApp() — called by React once it is mounted and ready
function enterApp(){
  var s=document.getElementById('splash');
  if(s){
    s.style.transition='opacity 0.6s';
    s.style.opacity='0';
    setTimeout(function(){if(s.parentNode)s.parentNode.removeChild(s);},650);
  }
}

// Safety net: if React hasn't called enterApp after 4 seconds, force it
setTimeout(function(){
  var s=document.getElementById('splash');
  if(s && s.style.opacity!=='0') enterApp();
}, 4000);const LV_I18N = {
  "Difficulty falling asleep":{VN:"Khó ngủ",FR:"Difficulté à s\'endormir",ZH:"入睡困难"},
  "High":{VN:"Cao",FR:"Élevé",ZH:"高"},
  "Desire to sleep":{VN:"Muốn ngủ",FR:"Envie de dormir",ZH:"嗜睡"},
  "Exhausted":{VN:"Kiệt sức",FR:"Épuisé",ZH:"筋疲力尽"},
  "Very high":{VN:"Rất cao",FR:"Très élevé",ZH:"很高"},
  "Very low":{VN:"Rất thấp",FR:"Très faible",ZH:"很低"},
  "Stirring":{VN:"Kích động",FR:"Agité",ZH:"动"},
  "Alternating fever and chills":{VN:"Lúc nóng lúc lạnh",FR:"Alternance fièvre/frissons",ZH:"寒热往来"},
  "Alternating loose/constipation":{VN:"Lúc lỏng lúc táo",FR:"Alternance mou/constipation",ZH:"便溏便秘交替"},
  "Anxious":{VN:"Lo âu",FR:"Anxieux",ZH:"焦虑"},
  "Watery":{VN:"Phân như nước",FR:"Aqueux",ZH:"水样便"},
  "None":{VN:"Không",FR:"Aucun",ZH:"无"},
  "Good":{VN:"Tốt",FR:"Bon",ZH:"好"},
  "Hidden":{VN:"Trầm",FR:"Caché",ZH:"伏"},
  "Calm/Balanced":{VN:"Bình tĩnh/cân bằng",FR:"Calme/équilibré",ZH:"平静/平衡"},
  "Night heat":{VN:"Nóng về đêm",FR:"Chaleur nocturne",ZH:"夜热"},
  "Sticky stools":{VN:"Phân dính",FR:"Collant",ZH:"便粘"},
  "Fearful/Worried":{VN:"Sợ/hay lo",FR:"Craintif/inquiet",ZH:"恐惧/担忧"},
  "Leathery":{VN:"Cách",FR:"Cuirassé",ZH:"革"},
  "LeatheryWiry":{VN:"Cách/huyền",FR:"Cuirassé et tendu",ZH:"革弦"},
  "Peeling / partial coat":{VN:"Tróc/lộ từng phần",FR:"Desquamation partielle",ZH:"剥苔"},
  "Scatter":{VN:"Tán",FR:"Dispersé",ZH:"散"},
  "Hard stools":{VN:"Phân cứng",FR:"Dur",ZH:"便硬"},
  "Angry/frustrated":{VN:"Giận/dễ bực",FR:"En colère/frustré",ZH:"愤怒/沮丧"},
  "Thick":{VN:"Dày",FR:"Épais",ZH:"厚"},
  "Faint":{VN:"Vi",FR:"Faible",ZH:"微"},
  "Hungry but no desire to eat":{VN:"Đói nhưng không muốn ăn",FR:"Faim sans envie de manger",ZH:"饥而不欲食"},
  "Firm":{VN:"Khẩn",FR:"Ferme",ZH:"牢"},
  "Thready":{VN:"Tế",FR:"Filiforme",ZH:"细"},
  "Forcelful":{VN:"Hữu lực",FR:"Fort",ZH:"有力"},
  "1-2 L/day":{VN:"– L/ngày",FR:"– L/jour",ZH:"–升/天"},
  "2/3 L/day":{VN:"– L/ngày",FR:"– L/jour",ZH:"–升/天"},
  "Large":{VN:"Đại",FR:"Large",ZH:"大"},
  "Lethargic":{VN:"Lờ đờ",FR:"Léthargique",ZH:"倦怠"},
  "Cold hands / feet":{VN:"Tay/chân lạnh",FR:"Mains/pieds froids",ZH:"手足冷"},
  "Poor":{VN:"Kém",FR:"Mauvais",ZH:"差"},
  "Better with rest":{VN:"Đỡ hơn khi nghỉ",FR:"Mieux avec le repos",ZH:"休息好转"},
  "Moderate":{VN:"Vừa",FR:"Modéré",ZH:"中等"},
  "Loose":{VN:"Phân lỏng",FR:"Mou",ZH:"便溏"},
  "Knot":{VN:"Kết",FR:"Nœud",ZH:"结"},
  "Normal":{VN:"Bình thường",FR:"Normal",ZH:"正常"},
  "Occasional":{VN:"Thỉnh thoảng",FR:"Occasionnel",ZH:"偶尔"},
  "Worse with activity":{VN:"Nặng hơn khi vận động",FR:"Pire avec l\'activité",ZH:"动则重"},
  "Worse in afternoon":{VN:"Nặng hơn buổi chiều",FR:"Pire l\'après-midi",ZH:"午后重"},
  "Worse in the morning":{VN:"Nặng hơn buổi sáng",FR:"Pire le matin",ZH:"晨重"},
  "Purple / dusky":{VN:"Tím/xỉn",FR:"Pourpre / terne",ZH:"紫暗"},
  "Daily":{VN:"Hàng ngày",FR:"Quotidien",ZH:"每日"},
  "Frequent waking":{VN:"Hay thức giấc",FR:"Réveils fréquents",ZH:"易醒"},
  "Normal pink":{VN:"Hồng bình thường",FR:"Rose normal",ZH:"淡红"},
  "Dark red":{VN:"Đỏ sẫm",FR:"Rouge foncé",ZH:"深红"},
  "Forceless":{VN:"Vô lực",FR:"Sans force",ZH:"无力"},
  "Mood Swing":{VN:"Dễ thay đổi cảm xúc",FR:"Sautes d\'humeur",ZH:"情绪波动"},
  "Dry stools":{VN:"Phân khô",FR:"Sec",ZH:"便干"},
  "Feels hot often or fever":{VN:"Thường nóng hoặc sốt",FR:"Sensation de chaleur ou fièvre",ZH:"发热或身热"},
  "Feels cold often or chills":{VN:"Thường lạnh hoặc ớn lạnh",FR:"Sensation de froid ou frissons",ZH:"畏寒或发冷"},
  "Restless sleep":{VN:"Ngủ không yên",FR:"Sommeil agité",ZH:"多梦易醒"},
  "Dream-disturbed sleep":{VN:"Ngủ hay mơ",FR:"Sommeil perturbé par les rêves",ZH:"多梦"},
  "Spontaneous":{VN:"Tự ra mồ hôi",FR:"Spontané",ZH:"自汗"},
  "Stressed":{VN:"Căng thẳng",FR:"Stressé",ZH:"紧张"},
  "Profuse sweating":{VN:"Đổ mồ hôi nhiều",FR:"Transpiration abondante",ZH:"大汗"},
  "Sweats on exertion":{VN:"Đổ mồ hôi khi gắng sức",FR:"Transpire à l\'effort",ZH:"动汗"},
  "Sweats easily":{VN:"Dễ đổ mồ hôi",FR:"Transpire facilement",ZH:"易汗"},
  "Sad / Sighing often":{VN:"Buồn/thở dài nhiều",FR:"Triste/soupirs fréquents",ZH:"悲伤/叹息"},
  "Variable":{VN:"Thay đổi",FR:"Variable",ZH:"多变"},
  "Absent":{VN:"Vắng",FR:"Absent",ZH:"缺失"},
  "Sour":{VN:"Chua",FR:"Aigre",ZH:"酸"},
  "Sharp":{VN:"Nhói",FR:"Aigu",ZH:"锐痛"},
  "Sharp/stabbing":{VN:"Nhói/đâm",FR:"Aigu/poignardant",ZH:"刺痛"},
  "Irregular eating":{VN:"Ăn uống thất thường",FR:"Alimentation irrégulière",ZH:"饮食不规律"},
  "Cold/frozen foods":{VN:"Đồ lạnh/đông lạnh",FR:"Aliments froids/surgelés",ZH:"冷食/冻食"},
  "Processed foods":{VN:"Thực phẩm chế biến",FR:"Aliments transformés",ZH:"加工食品"},
  "Bitter":{VN:"Đắng",FR:"Amer",ZH:"苦"},
  "Asthma history":{VN:"Tiền sử hen",FR:"Antécédents d\'asthme",ZH:"哮喘史"},
  "After eating":{VN:"Sau khi ăn",FR:"Après avoir mangé",ZH:"餐后"},
  "After period":{VN:"Sau kỳ",FR:"Après les règles",ZH:"经后"},
  "Back of head/neck":{VN:"Gáy/cổ",FR:"Arrière de la tête/nuque",ZH:"后头/颈"},
  "Warm":{VN:"Ôn",FR:"Chauffer",ZH:"温"},
  "Lower Chi Right":{VN:"Xích hạ phải",FR:"Chi inférieur droit",ZH:"尺下右"},
  "Lower Chi Left":{VN:"Xích hạ trái",FR:"Chi inférieur gauche",ZH:"尺下左"},
  "Upper Chi Left":{VN:"Xích thượng trái",FR:"Chi supérieur gauche",ZH:"尺上左"},
  "Chronic":{VN:"Mạn tính",FR:"Chronique",ZH:"慢性"},
  "Clear":{VN:"Thanh",FR:"Clarifier",ZH:"清"},
  "Clear all the times":{VN:"Thông suốt",FR:"Clair tout le temps",ZH:"鼻腔通畅"},
  "Heart":{VN:"Tâm",FR:"Cœur",ZH:"心"},
  "Sticky":{VN:"Dính",FR:"Collant",ZH:"粘"},
  "Sticky/greasy":{VN:"Dính/béo",FR:"Collant/gras",ZH:"粘腻"},
  "Sticky/heavy":{VN:"Dính/nặng",FR:"Collant/lourd",ZH:"粘/重"},
  "Confusion":{VN:"Hoang mang",FR:"Confusion",ZH:"困惑"},
  "Mental cloudiness":{VN:"Mơ hồ tinh thần",FR:"Confusion mentale",ZH:"思维模糊"},
  "Constant":{VN:"Liên tục",FR:"Constant",ZH:"持续"},
  "Covid/post-viral":{VN:"Covid/hậu virus",FR:"Covid/post-viral",ZH:"新冠/后病毒"},
  "FluCovid/post-viral":{VN:"Covid/hậu virus",FR:"Covid/post-viral",ZH:"新冠/后病毒"},
  "Fearful":{VN:"Sợ hãi",FR:"Craintif",ZH:"恐惧"},
  "Critical":{VN:"Nguy kịch",FR:"Critique",ZH:"危重"},
  "Lower Cun Right":{VN:"Thốn hạ phải",FR:"Cun inférieur droit",ZH:"寸下右"},
  "Lowe Cun Left":{VN:"Thốn hạ trái",FR:"Cun inférieur gauche",ZH:"寸下左"},
  "Upper Cun Right":{VN:"Thốn thượng phải",FR:"Cun supérieur droit",ZH:"寸口上右"},
  "Behind one eye":{VN:"Sau một mắt",FR:"Derrière un œil",ZH:"眼后"},
  "Difficult to expectorate":{VN:"Khó khạc",FR:"Difficile à expectorer",ZH:"难咳"},
  "Hard to swallow":{VN:"Khó nuốt",FR:"Difficulté à avaler",ZH:"吞咽困难"},
  "Decreased smell":{VN:"Giảm khứu giác",FR:"Diminution de l\'odorat",ZH:"嗅觉下降"},
  "Pain":{VN:"Đau",FR:"Douleur",ZH:"痛"},
  "Pain in the limbs":{VN:"Đau tay chân",FR:"Douleur des membres",ZH:"四肢疼痛"},
  "Ovulation pain":{VN:"Đau rụng trứng",FR:"Douleur d\'ovulation",ZH:"排卵痛"},
  "Cold abdominal pain":{VN:"Đau bụng lạnh",FR:"Douleur froide abdominale",ZH:"腹部冷痛"},
  "Cold pain in lower abdominal":{VN:"Đau lạnh bụng dưới",FR:"Douleur froide bas‑ventre",ZH:"下腹冷痛"},
  "Eye pain":{VN:"Đau mắt",FR:"Douleur oculaire",ZH:"眼痛"},
  "Stabbing chest pain":{VN:"Đau ngực nhói",FR:"Douleur thoracique poignardante",ZH:"刺痛胸痛"},
  "Lower abdominal twisting pain":{VN:"Đau xoắn bụng dưới",FR:"Douleur torsion bas‑ventre",ZH:"下腹绞痛"},
  "Achy":{VN:"Đau nhức",FR:"Douloureux",ZH:"酸痛"},
  "Drain":{VN:"Tả",FR:"Drainer",ZH:"泻"},
  "Hard":{VN:"Cứng",FR:"Dur",ZH:"硬"},
  "Thick discharge":{VN:"Dịch đặc",FR:"Écoulement épais",ZH:"浓稠分泌物"},
  "Angry":{VN:"Giận dữ",FR:"En colère",ZH:"愤怒"},
  "Swollen":{VN:"Lưỡi sưng",FR:"Gonflée",ZH:"肿"},
  "Numb":{VN:"Tê",FR:"Engourdi",ZH:"麻木"},
  "Hoarseness, lost of voice":{VN:"Khàn tiếng/mất tiếng",FR:"Enrouement/perte de voix",ZH:"嘶哑/失声"},
  "Diarrhea episodes":{VN:"Tiêu chảy từng đợt",FR:"Épisodes de diarrhée",ZH:"腹泻发作"},
  "Balanced":{VN:"Cân bằng",FR:"Équilibré",ZH:"均衡"},
  "Stomach":{VN:"Vị",FR:"Estomac",ZH:"胃"},
  "Low":{VN:"Thấp",FR:"Faible",ZH:"低"},
  "Low thirst":{VN:"Ít khát",FR:"Faible soif",ZH:"少渴"},
  "Foul":{VN:"Hôi",FR:"Fétide",ZH:"臭"},
  "Cracked, peeled":{VN:"Nứt, tróc",FR:"Fissuré, pelé",ZH:"裂/剥"},
  "Floating":{VN:"Phù",FR:"Flottant",ZH:"浮"},
  "Liver":{VN:"Can",FR:"Foie",ZH:"肝"},
  "Forceful":{VN:"Hữu lực",FR:"Force",ZH:"有力"},
  "Strong":{VN:"Cường",FR:"Fort",ZH:"有力"},
  "High thirst":{VN:"Khát nhiều",FR:"Forte soif",ZH:"多渴"},
  "Frequent":{VN:"Thường xuyên",FR:"Fréquent",ZH:"频繁"},
  "Wind-cold":{VN:"Phong hàn",FR:"Froid-vent",ZH:"风寒"},
  "Forehead/cheeks/bridge of nose":{VN:"Trán/má/sống mũi",FR:"Front/joues/arête du nez",ZH:"额/颊/鼻梁"},
  "Painful gas":{VN:"Đau do hơi",FR:"Gaz douloureux",ZH:"胀痛"},
  "Swelling":{VN:"Sưng",FR:"Gonflement",ZH:"肿胀"},
  "Sore throat":{VN:"Đau họng",FR:"Gorge irritée",ZH:"喉咙痛"},
  "Flu":{VN:"Cúm",FR:"Grippe",ZH:"流感"},
  "Large Intestine":{VN:"Đại trường",FR:"Gros intestin",ZH:"大肠"},
  "Lower Guan Right":{VN:"Quan hạ phải",FR:"Guan inférieur droit",ZH:"关下右"},
  "Lower Guan Left":{VN:"Quan hạ trái",FR:"Guan inférieur gauche",ZH:"关下左"},
  "Upper Guan Right":{VN:"Quan thượng phải",FR:"Guan supérieur droit",ZH:"关上右"},
  "Foul breath":{VN:"Hơi thở hôi",FR:"Haleine fétide",ZH:"口气臭"},
  "Harmonize":{VN:"Hòa giải",FR:"Harmoniser",ZH:"和解"},
  "Inflamation of the tonsils":{VN:"Viêm amidan",FR:"Inflammation des amygdales",ZH:"扁桃体发炎"},
  "Worried":{VN:"Lo lắng",FR:"Inquiet",ZH:"担忧"},
  "Intense":{VN:"Mạnh",FR:"Intense",ZH:"剧烈"},
  "Small Intestine":{VN:"Tiểu trường",FR:"Intestin grêle",ZH:"小肠"},
  "Irregular":{VN:"Không đều",FR:"Irrégulier",ZH:"不规律"},
  "Irritable":{VN:"Cáu gắt",FR:"Irritable",ZH:"易怒"},
  "Yellow":{VN:"Vàng",FR:"Jaune",ZH:"黄"},
  "Dark yellow/amber":{VN:"Vàng đậm/hổ phách",FR:"Jaune foncé/ambre",ZH:"深黄/琥珀"},
  "Pale yellow":{VN:"Vàng nhạt",FR:"Jaune pâle",ZH:"淡黄"},
  "Yellow/thick":{VN:"Vàng/đặc",FR:"Jaune/épais",ZH:"黄/稠"},
  "Light":{VN:"Nhẹ",FR:"Léger",ZH:"轻度"},
  "Mild":{VN:"Nhẹ",FR:"Léger",ZH:"轻度"},
  "Heavy":{VN:"Nặng",FR:"Lourd",ZH:"沉重"},
  "Heavy/numb":{VN:"Nặng/tê",FR:"Lourd/engourdi",ZH:"沉重/麻木"},
  "Heaviness":{VN:"Nặng",FR:"Lourdeur",ZH:"沉重"},
  "lower abdominal heaviness":{VN:"Nặng bụng dưới",FR:"Lourdeur bas‑ventre",ZH:"下腹沉重"},
  "Skin disease":{VN:"Bệnh da",FR:"Maladies de la peau",ZH:"皮肤病"},
  "Teeth-marked":{VN:"Dấu răng",FR:"Marques de dents",ZH:"齿痕"},
  "Brown":{VN:"Nâu",FR:"Marron",ZH:"棕"},
  "Morning":{VN:"Buổi sáng",FR:"Matin",ZH:"早晨"},
  "Hard hearing":{VN:"Nghe kém",FR:"Mauvaise audition",ZH:"听力差"},
  "Bad breath":{VN:"Hôi miệng",FR:"Mauvaise haleine",ZH:"口臭"},
  "Bad teeth, loose teeth":{VN:"Răng xấu/răng lung lay",FR:"Mauvaises dents/dents lâches",ZH:"牙差/松动"},
  "Cold limbs, extremities":{VN:"Tay chân lạnh",FR:"Membres froids",ZH:"四肢冰冷"},
  "Sharp memory":{VN:"Trí nhớ tốt",FR:"Mémoire vive",ZH:"记忆好"},
  "Menopause":{VN:"Mãn kinh",FR:"Ménopause",ZH:"更年期"},
  "Metallic":{VN:"Kim loại",FR:"Métallique",ZH:"金属味"},
  "Better with heat":{VN:"Đỡ hơn khi nóng",FR:"Mieux avec la chaleur",ZH:"遇热好转"},
  "Better with movementt":{VN:"Đỡ hơn khi vận động",FR:"Mieux avec le mouvement",ZH:"活动好转"},
  "Slender":{VN:"Gầy",FR:"Mince",ZH:"瘦"},
  "Less than  1L/day":{VN:"Dưới L/ngày",FR:"Moins de L/jour",ZH:"少于升/天"},
  "Averager":{VN:"Trung bình",FR:"Moyen",ZH:"中等"},
  "Mucus in stool":{VN:"Đàm trong phân",FR:"Mucus dans les selles",ZH:"大便带黏液"},
  "Black or Brown":{VN:"Đen hoặc nâu",FR:"Noir ou brun",ZH:"黑或棕"},
  "No":{VN:"Không",FR:"Non",ZH:"否"},
  "Purple/Dusky":{VN:"Tím/xỉn",FR:"Pourpre/terne",ZH:"紫/暗"},
  "Prefers warm drinks":{VN:"Thích uống ấm",FR:"Préfère les boissons chaudes",ZH:"喜热饮"},
  "Bright Red":{VN:"Đỏ tươi",FR:"Rouge vif",ZH:"鲜红"},
  "Often nose bleed":{VN:"Chảy máu mũi thường xuyên",FR:"Saignements de nez fréquents",ZH:"常流鼻血"},
  "Sedentary lifestyle":{VN:"Lối sống ít vận động",FR:"Sédentaire",ZH:"久坐"},
  "Tight":{VN:"Khẩn",FR:"Tendu",ZH:"紧"},
  "Severe":{VN:"Nặng",FR:"Sévère",ZH:"重度"},
  "Socially":{VN:"Giao tiếp xã hội",FR:"Socialement",ZH:"社交"},
  "Dull":{VN:"Âm ỉ",FR:"Sourd",ZH:"钝痛"},
  "Deaf":{VN:"Điếc",FR:"Sourd",ZH:"耳聋"},
  "Dull/Achy":{VN:"Âm ỉ",FR:"Sourd/terne",ZH:"隐隐痛"},
  "Often":{VN:"Thường xuyên",FR:"Souvent",ZH:"经常"},
  "Often congested":{VN:"Thường nghẹt",FR:"Souvent congestionné",ZH:"常鼻塞"},
  "Spotting only":{VN:"Chỉ ra huyết",FR:"Spotting seulement",ZH:"点滴出血"},
  "Sweet":{VN:"Ngọt",FR:"Sucré",ZH:"甜"},
  "Overwhelmed":{VN:"Quá tải",FR:"Surchargé",ZH:"不堪重负"},
  "Overthinking":{VN:"Suy nghĩ quá mức",FR:"Surmenage mental",ZH:"过度思虑"},
  "Overweight":{VN:"Thừa cân",FR:"Surpoids",ZH:"超重"},
  "Late":{VN:"Muộn",FR:"Tard",ZH:"推迟"},
  "Pale complexion":{VN:"Sắc mặt nhợt",FR:"Teint pâle",ZH:"面色苍白"},
  "Temples":{VN:"Thái dương",FR:"Tempes",ZH:"太阳穴"},
  "Early":{VN:"Sớm",FR:"Tôt",ZH:"提前"},
  "Always":{VN:"Lúc nào cũng có",FR:"Toujours",ZH:"总是"},
  "Every 3+ days":{VN:"Ba ngày trở lên",FR:"Tous les + jours",ZH:"三天以上"},
  "Every two days":{VN:"Hai ngày một lần",FR:"Tous les deux jours",ZH:"两天一次"},
  "Every day":{VN:"Hàng ngày",FR:"Tous les jours",ZH:"每天"},
  "Acute cough":{VN:"Ho cấp",FR:"Toux aiguë",ZH:"急性咳嗽"},
  "Chronic cough":{VN:"Ho mạn",FR:"Toux chronique",ZH:"慢性咳嗽"},
  "Dry cough":{VN:"Ho khan",FR:"Toux sèche",ZH:"干咳"},
  "Cough/cold":{VN:"Ho/cảm",FR:"Toux/rhume",ZH:"咳嗽/感冒"},
  "Very heavy":{VN:"Rất nhiều",FR:"Très lourd",ZH:"很多"},
  "Tripple Burner":{VN:"Tam tiêu",FR:"Triple réchauffeur",ZH:"三焦"},
  "Cloudy":{VN:"Đục",FR:"Trouble",ZH:"浑浊"},
  "One side":{VN:"Một bên",FR:"Un côté",ZH:"单侧"},
  "Any single spot":{VN:"Một điểm",FR:"Un seul point",ZH:"单点"},
  "Vegetarian/vegan":{VN:"Chay/thuần chay",FR:"Végétarien/végétalien",ZH:"素食/纯素"},
  "Green":{VN:"Xanh",FR:"Vert",ZH:"绿"},
  "Gallbladder":{VN:"Đởm",FR:"Vésicule biliaire",ZH:"胆"},
  "Bladder":{VN:"Bàng quang",FR:"Vessie",ZH:"膀胱"},
  "Empty":{VN:"Rỗng",FR:"Vide",ZH:"虚"},
  "Blurred Vision":{VN:"Mờ mắt",FR:"Vision floue",ZH:"视力模糊"},
  "Strong voice":{VN:"Giọng mạnh",FR:"Voix forte",ZH:"声音强"},
  "Red eyes":{VN:"Mắt đỏ",FR:"Yeux rouges",ZH:"红眼"},
  "Dry eyes":{VN:"Mắt khô",FR:"Yeux secs",ZH:"干眼"},
  "6-12 months":{VN:"6–12  tháng",FR:"6 – 12  mois",ZH:"–个月"},
  "To":{VN:"Đến",FR:"À",ZH:"到"},
  "Descend Qi":{VN:"Giáng khí",FR:"Abaisser le Qi",ZH:"降气"},
  "Descend rebellious Qi":{VN:"Giáng nghịch khí",FR:"Abaisser le Qi rebelle",ZH:"降逆"},
  "Subdue Liver Yang":{VN:"Bình Can tức phong",FR:"Abaisser le Yang du Foie",ZH:"平肝息风"},
  "Access denied. Please log in.":{VN:"Từ chối truy cập. Vui lòng đăng nhập.",FR:"Accès refusé. Veuillez vous connecter.",ZH:"拒绝访问，请先登录."},
  "Home":{VN:"Trang chủ",FR:"Accueil",ZH:"首页"},
  "Tinnitus":{VN:"Ù tai",FR:"Acouphènes",ZH:"耳鸣"},
  "Move Blood":{VN:"Hành huyết",FR:"Activer le Sang",ZH:"活血"},
  "Invigorate Blood":{VN:"Hoạt huyết",FR:"Activer le Sang",ZH:"活血"},
  "Address":{VN:"Địa chỉ",FR:"Adresse",ZH:"地址"},
  "Spleen Qi Sinking":{VN:"Khí Tỳ hạ hãm",FR:"Affaissement du Qi de la Rate",ZH:"脾气下陷"},
  "Alternating chills and fever":{VN:"Sốt rét run",FR:"Alternance fièvre‑frissons",ZH:"寒热往来"},
  "Anchor Yang":{VN:"Tiềm dương",FR:"Ancrer le Yang",ZH:"潜阳"},
  "Cancel":{VN:"Hủy",FR:"Annuler",ZH:"取消"},
  "Anxiety":{VN:"Lo âu",FR:"Anxiété",ZH:"焦虑"},
  "Preview Report":{VN:"Xem trước báo cáo",FR:"Aperçu du rapport",ZH:"预览报告"},
  "Apply Filter":{VN:"Áp dụng bộ lọc",FR:"Appliquer le filtre",ZH:"应用筛选"},
  "Insurance":{VN:"Bảo hiểm",FR:"Assurance",ZH:"保险"},
  "Insurance Paid":{VN:"Bảo hiểm trả",FR:"Assurance payée",ZH:"保险支付"},
  "Bluish":{VN:"Lưỡi xanh tím",FR:"Bleuté",ZH:"青紫"},
  "Borborygmus":{VN:"Óc ách ruột",FR:"Borborygmes",ZH:"肠鸣"},
  "Swollen sides":{VN:"Cạnh lưỡi sưng",FR:"Bords enflés",ZH:"舌边肿"},
  "Red sides":{VN:"Cạnh lưỡi đỏ",FR:"Bords rouges",ZH:"舌边红"},
  "Dry mouth":{VN:"Khô miệng",FR:"Bouche sèche",ZH:"口干"},
  "Break Blood Stasis":{VN:"Phá ứ huyết",FR:"Briser la stase de Sang",ZH:"破瘀"},
  "Calm the Shen":{VN:"An thần",FR:"Calmer le Shen",ZH:"安神"},
  "Heat":{VN:"Nhiệt",FR:"Chaleur",ZH:"热"},
  "Exterior Heat":{VN:"Ngoại cảm nhiệt",FR:"Chaleur externe",ZH:"外感热邪"},
  "Full Heat":{VN:"Thực nhiệt",FR:"Chaleur plénitude",ZH:"实热"},
  "Empty Heat":{VN:"Nhiệt hư",FR:"Chaleur vide",ZH:"虚热"},
  "Damp‑Heat":{VN:"Thấp nhiệt",FR:"Chaleur‑Humidité",ZH:"湿热"},
  "Warm Yang":{VN:"Ôn dương",FR:"Chauffer le Yang",ZH:"温阳"},
  "Chong Mai (Penetrating Vessel)":{VN:"Mạch Xung",FR:"Chong Mai",ZH:"冲脉"},
  "Chong‑Ren Axis":{VN:"Ai Xung‑Nhâm",FR:"Chong‑Ren",ZH:"冲任"},
  "Clear Heat":{VN:"Thanh nhiệt",FR:"Clarifier la Chaleur",ZH:"清热"},
  "Clear Liver Heat":{VN:"Thanh Can nhiệt",FR:"Clarifier la Chaleur du Foie",ZH:"清肝热"},
  "PassCode":{VN:"Mã truy cập",FR:"Code d’accès",ZH:"访问密码"},
  "Login":{VN:"Đăng nhập",FR:"Connexion",ZH:"登录"},
  "System Login":{VN:"Đăng nhập hệ thống",FR:"Connexion au système",ZH:"系统登录"},
  "Secure the Exterior":{VN:"Cố biểu",FR:"Consolider l’Extérieur",ZH:"固表"},
  "Consolidate Qi":{VN:"Cố khí",FR:"Consolider le Qi",ZH:"固气"},
  "Secure Lung Qi":{VN:"Cố phế khí",FR:"Consolider le Qi du Poumon",ZH:"固肺气"},
  "Constipation":{VN:"Táo bón",FR:"Constipation",ZH:"便秘"},
  "Wiry and slippery":{VN:"Huyền hoạt",FR:"Cordé et glissant",ZH:"弦滑"},
  "Short":{VN:"Lưỡi ngắn",FR:"Courte",ZH:"短"},
  "Credit":{VN:"Thẻ tín dụng",FR:"Crédit",ZH:"信用卡"},
  "Hollow":{VN:"Khổng",FR:"Creux",ZH:"芤"},
  "Leather":{VN:"Kiên",FR:"Cuir",ZH:"革"},
  "Dai Mai (Girdling Vessel)":{VN:"Mạch Đới",FR:"Dai Mai",ZH:"带脉"},
  "Invoice Date":{VN:"Ngày lập hóa đơn",FR:"Date de facture",ZH:"发票日期"},
  "Payment Date":{VN:"Ngày thanh toán",FR:"Date de paiement",ZH:"付款日期"},
  "Debit":{VN:"Thẻ ghi nợ",FR:"Débit",ZH:"借记卡"},
  "Surging":{VN:"Hồng",FR:"Débordant",ZH:"洪"},
  "Logout":{VN:"Đăng xuất",FR:"Déconnexion",ZH:"登出"},
  "Kidney Essence Deficiency":{VN:"Tinh Thận hư",FR:"Déficience de l’Essence du Rein",ZH:"肾精不足"},
  "Qi Deficiency":{VN:"Khí hư",FR:"Déficience de Qi",ZH:"气虚"},
  "Blood Deficiency":{VN:"Huyết hư",FR:"Déficience de Sang",ZH:"血虚"},
  "Yang Deficiency":{VN:"Dương hư",FR:"Déficience de Yang",ZH:"阳虚"},
  "Yin Deficiency":{VN:"Âm hư",FR:"Déficience de Yin",ZH:"阴虚"},
  "Spleen Qi Deficiency":{VN:"Khí Tỳ hư",FR:"Déficience du Qi de la Rate",ZH:"脾气虚"},
  "Heart Qi Deficiency":{VN:"Khí Tâm hư",FR:"Déficience du Qi du Cœur",ZH:"心气虚"},
  "Lung Qi Deficiency":{VN:"Khí Phế hư",FR:"Déficience du Qi du Poumon",ZH:"肺气虚"},
  "Kidney Qi Deficiency":{VN:"Khí Thận hư",FR:"Déficience du Qi du Rein",ZH:"肾气虚"},
  "Heart Blood Deficiency":{VN:"Huyết Tâm hư",FR:"Déficience du Sang du Cœur",ZH:"心血虚"},
  "Liver Blood Deficiency":{VN:"Huyết Can hư",FR:"Déficience du Sang du Foie",ZH:"肝血虚"},
  "Spleen Yang Deficiency":{VN:"Dương Tỳ hư",FR:"Déficience du Yang de la Rate",ZH:"脾阳虚"},
  "Heart Yang Deficiency":{VN:"Dương Tâm hư",FR:"Déficience du Yang du Cœur",ZH:"心阳虚"},
  "Kidney Yang Deficiency":{VN:"Dương Thận hư",FR:"Déficience du Yang du Rein",ZH:"肾阳虚"},
  "Stomach Yin Deficiency":{VN:"Âm Vị hư",FR:"Déficience du Yin de l’Estomac",ZH:"胃阴虚"},
  "Heart Yin Deficiency":{VN:"Âm Tâm hư",FR:"Déficience du Yin du Cœur",ZH:"心阴虚"},
  "Liver Yin Deficiency":{VN:"Âm Can hư",FR:"Déficience du Yin du Foie",ZH:"肝阴虚"},
  "Lung Yin Deficiency":{VN:"Âm Phế hư",FR:"Déficience du Yin du Poumon",ZH:"肺阴虚"},
  "Kidney Yin Deficiency":{VN:"Âm Thận hư",FR:"Déficience du Yin du Rein",ZH:"肾阴虚"},
  "Peeled":{VN:"Lưỡi tróc rêu",FR:"Dépapillée",ZH:"剥苔"},
  "Depression":{VN:"Trầm cảm",FR:"Dépression",ZH:"抑郁"},
  "Deviated":{VN:"Lưỡi lệch",FR:"Déviée",ZH:"偏"},
  "Diarrhea":{VN:"Tiêu chảy",FR:"Diarrhée",ZH:"腹泻"},
  "Scattered":{VN:"Tán",FR:"Dispersé",ZH:"散"},
  "Dispel Cold":{VN:"Tán hàn",FR:"Disperser le Froid",ZH:"散寒"},
  "Dissipate nodules":{VN:"Tiêu kết",FR:"Dissiper les nodules",ZH:"消结"},
  "Abdominal distension":{VN:"Chướng bụng",FR:"Distension abdominale",ZH:"腹胀"},
  "Burning pain":{VN:"Đau nóng rát",FR:"Douleur brûlante",ZH:"灼痛"},
  "Distending pain":{VN:"Đau căng tức",FR:"Douleur distensive",ZH:"胀痛"},
  "Fixed pain":{VN:"Đau cố định",FR:"Douleur fixe",ZH:"固定痛"},
  "Cold pain":{VN:"Đau lạnh",FR:"Douleur froide",ZH:"冷痛"},
  "Stabbing pain":{VN:"Đau nhói",FR:"Douleur poignardante",ZH:"刺痛"},
  "Dull pain":{VN:"Đau âm ỉ",FR:"Douleur sourde",ZH:"隐痛"},
  "Du‑Yang Qiao Axis":{VN:"Đốc‑Dương Kiều",FR:"Du‑Yang Qiao",ZH:"督阳跷"},
  "Dysmenorrhea":{VN:"Đau bụng kinh",FR:"Dysménorrhée",ZH:"痛经"},
  "Crimson":{VN:"Lưỡi đỏ thẫm",FR:"Écarlate",ZH:"绛"},
  "Backup failed":{VN:"Sao lưu thất bại",FR:"Échec de la sauvegarde",ZH:"备份失败"},
  "Lift Qi":{VN:"Thăng khí",FR:"Élever le Qi",ZH:"升气"},
  "Raise Qi":{VN:"Thăng khí",FR:"Élever le Qi",ZH:"升气"},
  "Resolve Damp":{VN:"Trừ thấp",FR:"Éliminer l’Humidité",ZH:"祛湿"},
  "White coating":{VN:"Rêu trắng",FR:"Enduit blanc",ZH:"白苔"},
  "Greasy coating":{VN:"Rêu nhờn",FR:"Enduit gras",ZH:"腻苔"},
  "Grey coating":{VN:"Rêu xám",FR:"Enduit gris",ZH:"灰苔"},
  "Yellow coating":{VN:"Rêu vàng",FR:"Enduit jaune",ZH:"黄苔"},
  "Thin coating":{VN:"Rêu mỏng",FR:"Enduit mince",ZH:"薄苔"},
  "Black coating":{VN:"Rêu đen",FR:"Enduit noir",ZH:"黑苔"},
  "Rootless coating":{VN:"Rêu không gốc",FR:"Enduit sans racine",ZH:"无根苔"},
  "Enter PassCode":{VN:"Nhập mã truy cập",FR:"Entrez le code d’accès",ZH:"输入访问密码"},
  "Shortness of breath":{VN:"Khó thở",FR:"Essoufflement",ZH:"气短"},
  "Are you sure you want to exit?":{VN:"Bạn có chắc muốn thoát không?",FR:"Êtes-vous sûr de vouloir quitter?",ZH:"确定要退出吗?"},
  "Expel Wind‑Heat":{VN:"Khu phong nhiệt",FR:"Expulser Vent‑Chaleur",ZH:"祛风热"},
  "Swollen tip":{VN:"Đầu lưỡi sưng",FR:"Extrémité enflée",ZH:"舌尖肿"},
  "Invoice":{VN:"Hóa đơn",FR:"Facture",ZH:"发票"},
  "Fatigue":{VN:"Mệt mỏi",FR:"Fatigue",ZH:"疲劳"},
  "Close Report":{VN:"Đóng báo cáo",FR:"Fermer le rapport",ZH:"关闭报告"},
  "Fever":{VN:"Sốt",FR:"Fièvre",ZH:"发热"},
  "Filter":{VN:"Lọc",FR:"Filtrer",ZH:"筛选"},
  "Fine":{VN:"Tế",FR:"Fin",ZH:"细"},
  "Center crack":{VN:"Nứt giữa lưỡi",FR:"Fissure centrale",ZH:"中裂"},
  "Cracks":{VN:"Nứt lưỡi",FR:"Fissures",ZH:"裂纹"},
  "Floating and empty":{VN:"Phù hư",FR:"Flottant et vide",ZH:"浮虚"},
  "Frail":{VN:"Nhược",FR:"Fragile",ZH:"弱"},
  "Chills":{VN:"Ớn lạnh",FR:"Frissons",ZH:"恶寒"},
  "Cold":{VN:"Hàn",FR:"Froid",ZH:"寒"},
  "Stomach Cold":{VN:"Vị hàn",FR:"Froid de l’Estomac",ZH:"胃寒"},
  "Exterior Cold":{VN:"Ngoại cảm hàn",FR:"Froid externe",ZH:"外感寒邪"},
  "Full Cold":{VN:"Thực hàn",FR:"Froid plénitude",ZH:"实寒"},
  "Empty Cold":{VN:"Hàn hư",FR:"Froid vide",ZH:"虚寒"},
  "Damp‑Cold":{VN:"Thấp hàn",FR:"Froid‑Humidité",ZH:"寒湿"},
  "Generate fluids":{VN:"Sinh tân dịch",FR:"Générer les liquides",ZH:"生津"},
  "User Management":{VN:"Quản lý người dùng",FR:"Gestion des utilisateurs",ZH:"用户管理"},
  "System Management":{VN:"Quản lý hệ thống",FR:"Gestion du système",ZH:"系统管理"},
  "Slippery":{VN:"Hoạt",FR:"Glissant",ZH:"滑"},
  "Slippery and rapid":{VN:"Hoạt sác",FR:"Glissant et rapide",ZH:"滑数"},
  "Sour taste":{VN:"Vị chua",FR:"Goût acide",ZH:"口酸"},
  "Bitter taste":{VN:"Vị đắng",FR:"Goût amer",ZH:"口苦"},
  "Sweet taste":{VN:"Vị ngọt",FR:"Goût sucré",ZH:"口甜"},
  "Big":{VN:"Đại",FR:"Gros",ZH:"大"},
  "Harmonize Liver and Stomach":{VN:"Điều hòa Can Vị",FR:"Harmoniser Foie‑Estomac",ZH:"调和肝胃"},
  "Harmonize Liver and Spleen":{VN:"Điều hòa Can Tỳ",FR:"Harmoniser Foie‑Rate",ZH:"调和肝脾"},
  "Hesitant":{VN:"Sáp",FR:"Hésitant",ZH:"涩"},
  "Payment History":{VN:"Lịch sử thanh toán",FR:"Historique des paiements",ZH:"付款记录"},
  "Eight Confluent Points":{VN:"Bát mạch giao hội",FR:"Huit points Confluents",ZH:"八脉交会穴"},
  "Eight Influential Points":{VN:"Bát hội huyệt",FR:"Huit points Influents",ZH:"八会穴"},
  "Moist":{VN:"Ẩm",FR:"Humide",ZH:"润"},
  "Slippery‑moist":{VN:"Ẩm trơn",FR:"Humide et glissante",ZH:"滑润"},
  "Moisten dryness":{VN:"Nhuận táo",FR:"Humidifier la sécheresse",ZH:"润燥"},
  "Practitioner ID":{VN:"Mã bác sĩ",FR:"ID du praticien",ZH:"医师编号"},
  "Induce sweating":{VN:"Phát hãn",FR:"Induire la sudation",ZH:"发汗"},
  "Insomnia":{VN:"Mất ngủ",FR:"Insomnie",ZH:"失眠"},
  "Intermittent":{VN:"Đại tuyệt",FR:"Intermittent",ZH:"代"},
  "LabelEN":{VN:"LabelVN",FR:"LabelFR",ZH:"LabelCN"},
  "Slow":{VN:"Trì",FR:"Lent",ZH:"迟"},
  "Leukorrhea":{VN:"Khí hư",FR:"Leucorrhée",ZH:"带下"},
  "Release Exterior":{VN:"Giải biểu",FR:"Libérer l’Extérieur",ZH:"解表"},
  "Release the Exterior":{VN:"Giải biểu",FR:"Libérer l’Extérieur",ZH:"解表"},
  "Bound":{VN:"Kết",FR:"Lié",ZH:"结"},
  "Mirror tongue":{VN:"Lưỡi gương",FR:"Lisse brillante",ZH:"镜面舌"},
  "Long":{VN:"Trường",FR:"Longue",ZH:"长"},
  "Headache":{VN:"Đau đầu",FR:"Mal de tête",ZH:"头痛"},
  "Poor appetite":{VN:"Chán ăn",FR:"Manque d’appétit",ZH:"食欲不振"},
  "Teeth marks":{VN:"Dấu răng",FR:"Marques dentaires",ZH:"齿痕"},
  "Poor memory":{VN:"Trí nhớ kém",FR:"Mauvaise mémoire",ZH:"健忘"},
  "Cold limbs":{VN:"Tay chân lạnh",FR:"Membres froids",ZH:"四肢冷"},
  "Main Menu":{VN:"Menu chính",FR:"Menu principal",ZH:"主菜单"},
  "Stomach Meridian":{VN:"Kinh Vị",FR:"Méridien de l’Estomac",ZH:"足阳明胃经"},
  "Small Intestine Meridian":{VN:"Kinh Tiểu Trường",FR:"Méridien de l’Intestin Grêle",ZH:"手太阳小肠经"},
  "Spleen Meridian":{VN:"Kinh Tỳ",FR:"Méridien de la Rate",ZH:"足太阴脾经"},
  "Gallbladder Meridian":{VN:"Kinh Đởm",FR:"Méridien de la Vésicule Biliaire",ZH:"足少阳胆经"},
  "Bladder Meridian":{VN:"Kinh Bàng Quang",FR:"Méridien de la Vessie",ZH:"足太阳膀胱经"},
  "Heart Meridian":{VN:"Kinh Tâm",FR:"Méridien du Cœur",ZH:"手少阴心经"},
  "Liver Meridian":{VN:"Kinh Can",FR:"Méridien du Foie",ZH:"足厥阴肝经"},
  "Large Intestine Meridian":{VN:"Kinh Đại Trường",FR:"Méridien du Gros Intestin",ZH:"手阳明大肠经"},
  "Pericardium Meridian":{VN:"Kinh Tâm Bào",FR:"Méridien du Péricarde",ZH:"手厥阴心包经"},
  "Lung Meridian":{VN:"Kinh Phế",FR:"Méridien du Poumon",ZH:"手太阴肺经"},
  "Kidney Meridian":{VN:"Kinh Thận",FR:"Méridien du Rein",ZH:"足少阴肾经"},
  "Painful urination":{VN:"Tiểu đau",FR:"Mictions douloureuses",ZH:"小便痛"},
  "Frequent urination":{VN:"Tiểu nhiều",FR:"Mictions fréquentes",ZH:"小便频"},
  "Thin":{VN:"Tế",FR:"Minces",ZH:"细"},
  "Minute":{VN:"Vi tế",FR:"Minuscule",ZH:"微细"},
  "Payment Method":{VN:"Phương thức thanh toán",FR:"Mode de paiement",ZH:"支付方式"},
  "Soft":{VN:"Nhu",FR:"Moelleux",ZH:"软"},
  "Amount":{VN:"Số tiền",FR:"Montant",ZH:"金额"},
  "Invoice Amount":{VN:"Số tiền hóa đơn",FR:"Montant de la facture",ZH:"发票金额"},
  "Total Invoice Amount":{VN:"Tổng tiền hóa đơn",FR:"Montant total des factures",ZH:"发票总额"},
  "Liver Yang Rising":{VN:"Dương Can vượng",FR:"Montée du Yang du Foie",ZH:"肝阳上亢"},
  "Soggy":{VN:"Nhược",FR:"Mou",ZH:"濡"},
  "Soft and weak":{VN:"Nhu nhược",FR:"Mou et faible",ZH:"软弱"},
  "Moving":{VN:"Động",FR:"Mouvant",ZH:"动"},
  "Dry Phlegm":{VN:"Đàm táo",FR:"Mucosités sèches",ZH:"燥痰"},
  "Phlegm Misting the Mind":{VN:"Đàm che tâm khiếu",FR:"Mucosités troublant l’esprit",ZH:"痰蒙心窍"},
  "Phlegm‑Heat":{VN:"Đàm nhiệt",FR:"Mucosités‑Chaleur",ZH:"痰热"},
  "Phlegm‑Cold":{VN:"Đàm hàn",FR:"Mucosités‑Froid",ZH:"寒痰"},
  "Nausea":{VN:"Buồn nôn",FR:"Nausées",ZH:"恶心"},
  "Practitioner Name":{VN:"Tên bác sĩ",FR:"Nom du praticien",ZH:"医师姓名"},
  "Number of Invoices":{VN:"Số hóa đơn",FR:"Nombre de factures",ZH:"发票数量"},
  "Notes":{VN:"Ghi chú",FR:"Notes",ZH:"备注"},
  "Knotted":{VN:"Kết",FR:"Noué",ZH:"结"},
  "Nourish Blood":{VN:"Bổ huyết",FR:"Nourrir le Sang",ZH:"养血"},
  "Invoice Number":{VN:"Số hóa đơn",FR:"Numéro de facture",ZH:"发票号码"},
  "OK":{VN:"OK",FR:"OK",ZH:"确定"},
  "Chest oppression":{VN:"Nặng ngực",FR:"Oppression thoracique",ZH:"胸闷"},
  "Yes":{VN:"Có",FR:"Oui",ZH:"是"},
  "Open Payment History":{VN:"Mở lịch sử thanh toán",FR:"Ouvrir l’historique des paiements",ZH:"打开付款记录"},
  "Open System Management":{VN:"Mở quản lý hệ thống",FR:"Ouvrir la gestion du système",ZH:"打开系统管理"},
  "Open Billing Module":{VN:"Mở mô-đun hóa đơn",FR:"Ouvrir le module de facturation",ZH:"打开账单模块"},
  "Open Revenue Summary":{VN:"Mở báo cáo doanh thu",FR:"Ouvrir le résumé des revenus",ZH:"打开收入汇总"},
  "Payment":{VN:"Thanh toán",FR:"Paiement",ZH:"付款"},
  "Pale":{VN:"Lưỡi nhạt",FR:"Pâle",ZH:"淡"},
  "Palpitations":{VN:"Hồi hộp",FR:"Palpitations",ZH:"心悸"},
  "Security Settings":{VN:"Cài đặt bảo mật",FR:"Paramètres de sécurité",ZH:"安全设置"},
  "System Settings":{VN:"Cài đặt hệ thống",FR:"Paramètres du système",ZH:"系统设置"},
  "No thirst":{VN:"Không khát",FR:"Pas de soif",ZH:"不渴"},
  "Patient":{VN:"Bệnh nhân",FR:"Patient",ZH:"病人"},
  "Patient Paid":{VN:"Bệnh nhân trả",FR:"Patient payé",ZH:"病人支付"},
  "Paid in Full":{VN:"Đã thanh toán",FR:"Payé en entier",ZH:"全额支付"},
  "Petechiae":{VN:"Xuất huyết điểm",FR:"Pétéchies",ZH:"瘀点"},
  "Date Range — From":{VN:"Khoảng ngày — Từ",FR:"Plage de dates — De",ZH:"日期范围 — 从"},
  "Full":{VN:"Thực",FR:"Plein",ZH:"实"},
  "Sedation Point":{VN:"Huyệt tả",FR:"Point de dispersion",ZH:"泻穴"},
  "Tonification Point":{VN:"Huyệt bổ",FR:"Point de tonification",ZH:"补穴"},
  "Child Point":{VN:"Huyệt tử",FR:"Point fils",ZH:"子穴"},
  "Horary Point":{VN:"Huyệt thời khí",FR:"Point horaire",ZH:"本穴"},
  "Mother Point":{VN:"Huyệt mẫu",FR:"Point mère",ZH:"母穴"},
  "Ashi Points":{VN:"Huyệt A thị",FR:"Points Ashi",ZH:"阿是穴"},
  "Ma Dan‑Yang Heavenly Points":{VN:"Thập tam thiên huyệt",FR:"Points célestes de Ma Dan‑Yang",ZH:"马丹阳天星穴"},
  "Command Points":{VN:"Huyệt chỉ huy",FR:"Points de commande",ZH:"四总穴"},
  "Crossing Points":{VN:"Huyệt giao hội",FR:"Points de croisement",ZH:"交会穴"},
  "Spirit Points":{VN:"Huyệt linh",FR:"Points de l’esprit",ZH:"灵穴"},
  "Meeting Points":{VN:"Huyệt hội",FR:"Points de réunion",ZH:"会穴"},
  "Back Transport Points":{VN:"Huyệt vận chuyển lưng",FR:"Points de transport dorsal",ZH:"背输穴"},
  "Five‑Shu Points":{VN:"Ngũ Du huyệt",FR:"Points des Cinq Shu",ZH:"五输穴"},
  "Four Seas Points":{VN:"Tứ hải huyệt",FR:"Points des Quatre Mers",ZH:"四海穴"},
  "Extraordinary Points":{VN:"Huyệt kỳ kinh",FR:"Points extraordinaires",ZH:"奇穴"},
  "Sun Si‑Miao Ghost Points":{VN:"Quỷ huyệt Tôn Tư Miễu",FR:"Points fantômes de Sun Si‑Miao",ZH:"孙思邈十三鬼穴"},
  "He‑Sea Points":{VN:"Hợp huyệt",FR:"Points He‑Mer",ZH:"合穴"},
  "Lower He‑Sea Points":{VN:"Huyệt Hợp dưới",FR:"Points He‑Mer inférieurs",ZH:"下合穴"},
  "Jing‑Well Points":{VN:"Tỉnh huyệt",FR:"Points Jing‑Puits",ZH:"井穴"},
  "Jing‑River Points":{VN:"Kinh huyệt",FR:"Points Jing‑Rivière",ZH:"经穴"},
  "Luo‑Connecting Points":{VN:"Huyệt Lạc",FR:"Points Luo‑Connexion",ZH:"络穴"},
  "Front‑Mu Points":{VN:"Huyệt Mộ",FR:"Points Mu antérieurs",ZH:"募穴"},
  "Back‑Shu Points":{VN:"Huyệt Bối Du",FR:"Points Shu du dos",ZH:"背俞穴"},
  "Shu‑Stream Points":{VN:"Du huyệt",FR:"Points Shu‑Rivière",ZH:"输穴"},
  "Purple spots":{VN:"Điểm tím",FR:"Points violets",ZH:"紫点"},
  "Xi‑Cleft Points":{VN:"Huyệt Khích",FR:"Points Xi‑Fente",ZH:"郄穴"},
  "Ying‑Spring Points":{VN:"Huỳnh huyệt",FR:"Points Ying‑Source",ZH:"荥穴"},
  "Yuan‑Source Points":{VN:"Huyệt Nguyên",FR:"Points Yuan‑Source",ZH:"原穴"},
  "Practitioner":{VN:"Bác sĩ",FR:"Praticien",ZH:"医师"},
  "Previous":{VN:"Trước đó",FR:"Précédent",ZH:"上一步"},
  "Hurried":{VN:"Xúc",FR:"Précipité",ZH:"促"},
  "Deep":{VN:"Trầm",FR:"Profond",ZH:"沉"},
  "Deep and weak":{VN:"Trầm nhược",FR:"Profond et faible",ZH:"沉弱"},
  "Promote urination":{VN:"Lợi niệu",FR:"Promouvoir la diurèse",ZH:"利尿"},
  "Purge Heat":{VN:"Tả hỏa",FR:"Purger la Chaleur",ZH:"泻火"},
  "Qi Rebellion":{VN:"Khí nghịch",FR:"Qi rebelle",ZH:"气逆"},
  "Four Gates":{VN:"Tứ quan",FR:"Quatre Portes",ZH:"四关"},
  "Exit System":{VN:"Thoát hệ thống",FR:"Quitter le système",ZH:"退出系统"},
  "Soften hardness":{VN:"Nhuận kiên",FR:"Ramollir les masses",ZH:"软坚"},
  "Rapid":{VN:"Sác",FR:"Rapide",ZH:"数"},
  "Spleen Not Controlling Blood":{VN:"Tỳ không nhiếp huyết",FR:"Rate ne contrôle pas le Sang",ZH:"脾不统血"},
  "Cool Blood":{VN:"Lương huyết",FR:"Refroidir le Sang",ZH:"凉血"},
  "Heavy menses":{VN:"Kinh nhiều",FR:"Règles abondantes",ZH:"月经过多"},
  "Irregular menses":{VN:"Kinh nguyệt không đều",FR:"Règles irrégulières",ZH:"月经不调"},
  "Scanty menses":{VN:"Kinh ít",FR:"Règles peu abondantes",ZH:"月经过少"},
  "Regulate Stomach":{VN:"Điều vị",FR:"Réguler l’Estomac",ZH:"调胃"},
  "Regulate Qi":{VN:"Điều khí",FR:"Réguler le Qi",ZH:"理气"},
  "Regulate Blood":{VN:"Điều huyết",FR:"Réguler le Sang",ZH:"理血"},
  "Regulate Intestines":{VN:"Điều trường",FR:"Réguler les Intestins",ZH:"调肠"},
  "Back":{VN:"Quay lại",FR:"Retour",ZH:"返回"},
  "Back to Main Menu":{VN:"Quay lại menu chính",FR:"Retour au menu principal",ZH:"返回主菜单"},
  "Practitioner Revenue Summary":{VN:"Doanh thu theo bác sĩ",FR:"Revenu par praticien",ZH:"医师收入汇总"},
  "Stiff":{VN:"Lưỡi cứng",FR:"Rigide",ZH:"强硬"},
  "Red":{VN:"Lưỡi đỏ",FR:"Rouge",ZH:"红"},
  "Red and dry":{VN:"Lưỡi đỏ khô",FR:"Rouge et sèche",ZH:"红干"},
  "Choppy":{VN:"Sáp",FR:"Rugueux",ZH:"涩"},
  "Rough":{VN:"Sáp",FR:"Rugueux",ZH:"涩"},
  "Choppy and slow":{VN:"Sáp trì",FR:"Rugueux et lent",ZH:"涩迟"},
  "Backup completed successfully":{VN:"Sao lưu thành công",FR:"Sauvegarde terminée avec succès",ZH:"备份成功"},
  "Backup Database":{VN:"Sao lưu cơ sở dữ liệu",FR:"Sauvegarder la base de données",ZH:"备份数据库"},
  "Dry":{VN:"Khô",FR:"Sèche",ZH:"干"},
  "Lung Dryness":{VN:"Phế táo",FR:"Sécheresse du Poumon",ZH:"肺燥"},
  "Sedate":{VN:"Tả",FR:"Sédater",ZH:"泻"},
  "Loose stools":{VN:"Phân lỏng",FR:"Selles molles",ZH:"溏便"},
  "Heavy sensation":{VN:"Cảm giác nặng nề",FR:"Sensation de lourdeur",ZH:"沉重感"},
  "Wheezing":{VN:"Khò khè",FR:"Sifflements",ZH:"喘鸣"},
  "Thirst":{VN:"Khát nước",FR:"Soif",ZH:"口渴"},
  "Balance":{VN:"Số dư",FR:"Solde",ZH:"余额"},
  "Outstanding Balance":{VN:"Số dư còn lại",FR:"Solde impayé",ZH:"未结余额"},
  "Total Balance":{VN:"Tổng số dư",FR:"Solde total",ZH:"总余额"},
  "Sighing":{VN:"Thở dài",FR:"Soupirs",ZH:"太息"},
  "Subtotal":{VN:"Tạm tính",FR:"Sous-total",ZH:"小计"},
  "Food Stagnation":{VN:"Thực tích",FR:"Stagnation alimentaire",ZH:"食积"},
  "Qi Stagnation":{VN:"Khí uất",FR:"Stagnation de Qi",ZH:"气滞"},
  "Liver Qi Stagnation":{VN:"Ứ trệ khí Can",FR:"Stagnation du Qi du Foie",ZH:"肝气郁结"},
  "Blood Stasis":{VN:"Ứ huyết",FR:"Stase de Sang",ZH:"血瘀"},
  "Sweating on exertion":{VN:"Ra mồ hôi khi vận động",FR:"Sueurs à l’effort",ZH:"动则汗出"},
  "Night sweats":{VN:"Đổ mồ hôi đêm",FR:"Sueurs nocturnes",ZH:"盗汗"},
  "Spontaneous sweating":{VN:"Tự ra mồ hôi",FR:"Sueurs spontanées",ZH:"自汗"},
  "Next":{VN:"Tiếp theo",FR:"Suivant",ZH:"下一步"},
  "Phone":{VN:"Điện thoại",FR:"Téléphone",ZH:"电话"},
  "Tense":{VN:"Khẩn",FR:"Tendu",ZH:"紧"},
  "Tonify Qi":{VN:"Bổ khí",FR:"Tonifier le Qi",ZH:"补气"},
  "Tonify Yang":{VN:"Bổ dương",FR:"Tonifier le Yang",ZH:"补阳"},
  "Tonify Yin":{VN:"Bổ âm",FR:"Tonifier le Yin",ZH:"补阴"},
  "Total":{VN:"Tổng cộng",FR:"Total",ZH:"总计"},
  "Total Insurance Paid":{VN:"Tổng tiền bảo hiểm trả",FR:"Total assurance payée",ZH:"保险支付总额"},
  "Total Patient Paid":{VN:"Tổng tiền bệnh nhân trả",FR:"Total patient payé",ZH:"病人支付总额"},
  "Cough":{VN:"Ho",FR:"Toux",ZH:"咳嗽"},
  "Cough with phlegm":{VN:"Ho có đàm",FR:"Toux avec mucosités",ZH:"咳痰"},
  "Transform Phlegm":{VN:"Hóa đàm",FR:"Transformer les mucosités",ZH:"化痰"},
  "Trembling":{VN:"Lưỡi run",FR:"Tremblante",ZH:"颤"},
  "Racing":{VN:"Cấp",FR:"Très rapide",ZH:"疾"},
  "Dark urine":{VN:"Nước tiểu sẫm màu",FR:"Urines foncées",ZH:"尿色深"},
  "Scanty urine":{VN:"Tiểu ít",FR:"Urines rares",ZH:"小便少"},
  "Authorized Users":{VN:"Người dùng được phép",FR:"Utilisateurs autorisés",ZH:"授权用户"},
  "Ren Vessel (Conception)":{VN:"Mạch Nhâm",FR:"Vaisseau Conception",ZH:"任脉"},
  "Du Vessel (Governing)":{VN:"Mạch Đốc",FR:"Vaisseau Gouverneur",ZH:"督脉"},
  "Exterior Wind":{VN:"Ngoại cảm phong",FR:"Vent externe",ZH:"外感风邪"},
  "Dizziness":{VN:"Chóng mặt",FR:"Vertiges",ZH:"眩晕"},
  "Purple‑dark":{VN:"Lưỡi tím sẫm",FR:"Violet foncé",ZH:"暗紫"},
  "E‑Transfer":{VN:"Chuyển khoản",FR:"Virement électronique",ZH:"电子转账"},
  "Vomiting":{VN:"Nôn",FR:"Vomissements",ZH:"呕吐"},
  "Yin Qiao Mai (Yin Motility)":{VN:"Mạch Âm Kiều",FR:"Yin Qiao Mai",ZH:"阴跷脉"},
  "Yin Wei Mai (Yin Linking)":{VN:"Mạch Âm Duy",FR:"Yin Wei Mai",ZH:"阴维脉"},
  "Add":{VN:"Thêm",FR:"Ajouter",ZH:"添加"},
  "abdominal pain":{VN:"Đau bụng",FR:"Douleur abdominale",ZH:"腹痛"},
  "Active Findings":{VN:"Bệnh trạng",FR:"Constatations actives",ZH:"活跃的发现"},
  "Acupuncture Points":{VN:"Huyệt Châm Cứu",FR:"Point d\'accupuncture",ZH:"针灸穴位"},
  "Add Finding":{VN:"Thêm bệnh chứng",FR:"Ajouter une contestation",ZH:"添加异议"},
  "Add from suggestions":{VN:"Thêm thể theo đề nghị",FR:"Ajouter à partir des suggestions",ZH:"从建议中添加"},
  "Add Link":{VN:"Thêm kết nối",FR:"Ajouter des liens",ZH:"添加链接"},
  "add manually below":{VN:"Điền thêm dưới đây",FR:"Remplisser ci-dessous",ZH:"在下面补充填写"},
  "Add New Finding":{VN:"Thêm bệnh chứng mới",FR:"Ajouter  une nouvelle contestation",ZH:"添加新疾病"},
  "Add Pattern":{VN:"Thêm hội chứng mới",FR:"Ajouter un schéma",ZH:"添加新的综合症"},
  "Add a Symptomatic Pattern":{VN:"Thêm triệu chứng mới",FR:"Ajouter un schéma symptomatique",ZH:"添加新症状"},
  "Anger":{VN:"Tức giận",FR:"Colère",ZH:"愤怒"},
  "belching":{VN:"Ợ hơi",FR:"éructations",ZH:"打嗝"},
  "Bloating always":{VN:"Luôn đầy hơi",FR:"Toujours ballonné",ZH:"总是腹胀"},
};
function tLV(val) {
  if (!val) return val;
  const tr = LV_I18N[val];
  return tr ? (tr[_lang] || val) : val;
}
