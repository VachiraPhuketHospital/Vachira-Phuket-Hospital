export interface DueDocumentItem {
  id: string;
  title: string;
  fileCode: string;
  description: string;
  category: string;
  fileSize: string;
  fileType: string;
  date: string;
  url: string;
  isExternalLink: boolean;
  statusTag?: string;
  statusType?: 'success' | 'warning' | 'danger' | 'info';
}

export interface DueAntidoteItem {
  name: string;
  brandName?: string;
  type: 'specific' | 'non_specific';
  targetDrug: string;
  availability: 'available' | 'not_in_thailand' | 'not_in_hospital';
  availabilityText: string;
  fileCode?: string;
  docTitle?: string;
  dosageGuidelines: string;
  preparation: string;
}

export interface DueDrugItem {
  genericName: string;
  tradeName?: string;
  strength?: string;
  dosageForm?: string;
  indications: string;
  dosage: string;
  precautions?: string;
  fileCode?: string;
  docTitle?: string;
  statusBadge?: string;
  statusType?: 'success' | 'warning' | 'danger' | 'info';
}

export interface DueCategorySection {
  id: string;
  sectionNumber: number;
  title: string;
  shortTitle: string;
  badge: string;
  subtitle: string;
  description: string;
  iconName: string;
  primaryDocCode?: string;
  documents: DueDocumentItem[];
  drugs?: DueDrugItem[];
  antidotes?: DueAntidoteItem[];
  evaluationCriteria: string[];
  clinicalHighlights: string[];
}

export const OFFICIAL_DUE_DRIVE_FOLDER = 'https://drive.google.com/drive/folders/1PZs5h3ADWSp-KEzNUTol4M_8qvBFyxpd?usp=sharing';

export const DUE_SECTIONS: DueCategorySection[] = [
  // 1. Albumin
  {
    id: 'due_albumin',
    sectionNumber: 1,
    title: 'แบบประเมินความเหมาะสมการใช้ Albumin',
    shortTitle: 'Albumin',
    badge: 'DUE_Albumin',
    subtitle: 'Human Normal Albumin (20%, 25% injection)',
    description: 'เกณฑ์การประเมินข้อบ่งใช้และแบบฟอร์มขอใช้ Albumin ในผู้ป่วยโรคตับแข็ง ภาวะติดเชื้อในช่องท้อง และภาวะอัลบูมินในเลือดต่ำวิกฤต',
    iconName: 'Droplet',
    primaryDocCode: 'DUE_Albumin',
    documents: [
      {
        id: 'due_doc_albumin',
        title: 'แบบประเมินความเหมาะสมการใช้ Albumin (DUE_Albumin)',
        fileCode: 'DUE_Albumin',
        description: 'แบบฟอร์มการขออนุมัติและประเมินข้อบ่งชี้การสั่งใช้ Albumin ในโรงพยาบาลวชิระภูเก็ต',
        category: 'การประเมินความเหมาะสมการใช้ยา (DUE)',
        fileSize: '650 KB',
        fileType: 'PDF',
        date: 'ปรับปรุง 2568',
        url: OFFICIAL_DUE_DRIVE_FOLDER,
        isExternalLink: true,
        statusTag: 'แบบฟอร์มหลัก',
        statusType: 'success'
      }
    ],
    evaluationCriteria: [
      'Large-volume paracentesis ในผู้ป่วย Liver Cirrhosis ที่เจาะน้ำในช่องท้องมากกว่า 5 ลิตร (ให้ Albumin 8 กรัมต่อน้ำ 1 ลิตรที่เกิน 5 ลิตร)',
      'Spontaneous Bacterial Peritonitis (SBP): ให้ Albumin 1.5 g/kg ภายใน 6 ชั่วโมงแรก และ 1 g/kg ในวันที่ 3 เพื่อป้องกัน Hepatorenal syndrome',
      'Hepatorenal Syndrome (HRS Type 1): ให้ร่วมกับยาหดหลอดเลือด (Terlipressin หรือ Norepinephrine)',
      'Severe Hypoalbuminemia (Serum Albumin < 2.0-2.5 g/dL) ที่มี hemodynamic instability, shock หรือ severe generalized edema ที่ดื้อต่อยาขับปัสสาวะ'
    ],
    clinicalHighlights: [
      '❌ ไม่แนะนำให้ใช้ใน: Chronic stable hypoalbuminemia, malnutrition, เสริมโภชนาการ, แผลกดทับทั่วไป, หรือ Nephrotic syndrome ที่ไม่มี hypovolemia',
      '⚠️ เฝ้าระวัง: Volume overload, acute pulmonary edema, ความดันโลหิตสูง และระดับเกลือแร่ในเลือด'
    ],
    drugs: [
      {
        genericName: 'Human Normal Albumin 20%',
        tradeName: 'Albumin Baxter / Zenalb / Kedrion',
        strength: '20% (10 g/50 mL, 20 g/100 mL)',
        dosageForm: 'Intravenous Solution',
        indications: 'Cirrhosis with ascites > 5L, SBP, Hepatorenal syndrome, Severe refractory hypoalbuminemia',
        dosage: 'ตามข้อบ่งชี้ทางคลินิกและน้ำหนักตัว (infuse ช้าๆ 1-2 mL/min)',
        precautions: 'ระวังภาวะ Hypervolemia และ Circulatory overload ในผู้ป่วยโรคหัวใจล้มเหลว',
        fileCode: 'DUE_Albumin',
        docTitle: 'แบบประเมิน Albumin DUE_Albumin',
        statusBadge: 'ยาควบคุม DUE',
        statusType: 'warning'
      }
    ]
  },

  // 2. ยากลุ่ม NOAC & Antidote
  {
    id: 'due_noac',
    sectionNumber: 2,
    title: 'ยากลุ่ม Non-vitamin K Antagonist Oral Anticoagulants (NOAC)',
    shortTitle: 'NOAC & Antidote',
    badge: 'NOAC & Antidote',
    subtitle: 'Apixaban, Dabigatran, Edoxaban, Rivaroxaban และคำแนะนำยาต้านพิษ',
    description: 'แบบประเมินความเหมาะสมการใช้ยา หนังสือแสดงความยินยอม และแนวทางการเตรียมยาต้านพิษทั้งชนิดจำเพาะและไม่จำเพาะ',
    iconName: 'HeartPulse',
    primaryDocCode: 'DUE_NOAC_2568_12_2',
    documents: [
      {
        id: 'due_doc_noac_eval',
        title: 'แบบประเมินการใช้ยากลุ่ม NOAC (DUE_NOAC_2568_12_2)',
        fileCode: 'DUE_NOAC_2568_12_2',
        description: 'แบบฟอร์มคัดกรองข้อบ่งใช้ ขนาดยา และปัจจัยเสี่ยงเลือดออกก่อนสั่งใช้ยากลุ่ม NOAC',
        category: 'การประเมินความเหมาะสมการใช้ยา (DUE)',
        fileSize: '820 KB',
        fileType: 'PDF',
        date: '2 ธ.ค. 2568',
        url: OFFICIAL_DUE_DRIVE_FOLDER,
        isExternalLink: true,
        statusTag: 'แบบประเมิน DUE',
        statusType: 'success'
      },
      {
        id: 'due_doc_noac_inform',
        title: 'หนังสือแสดงความยินยอม NOAC (Inform_NOAC_2569_01_25)',
        fileCode: 'Inform_NOAC_2569_01_25',
        description: 'แบบฟอร์มยินยอมรับการรักษาด้วยยากลุ่ม NOAC และคำแนะนำความปลอดภัยสำหรับผู้ป่วย',
        category: 'หนังสือแสดงความยินยอม',
        fileSize: '540 KB',
        fileType: 'PDF',
        date: '25 ม.ค. 2569',
        url: OFFICIAL_DUE_DRIVE_FOLDER,
        isExternalLink: true,
        statusTag: 'Consent Form',
        statusType: 'info'
      },
      {
        id: 'due_doc_idarucizumab',
        title: 'คำแนะนำการใช้ยา Idarucizumab (Idarucizumab_2569_1_14)',
        fileCode: 'Idarucizumab_2569_1_14',
        description: 'คู่มือการเตรียมและบริหารยา Idarucizumab Specific Antidote สำหรับ Dabigatran ในภาวะฉุกเฉิน',
        category: 'ยาต้านพิษจำเพาะ (Specific Antidote)',
        fileSize: '710 KB',
        fileType: 'PDF',
        date: '14 ม.ค. 2569',
        url: OFFICIAL_DUE_DRIVE_FOLDER,
        isExternalLink: true,
        statusTag: 'Specific Antidote',
        statusType: 'success'
      },
      {
        id: 'due_doc_prothromplex',
        title: 'คำแนะนำการเตรียม Prothromplex 500 (Prothromplex_500_2569_1_20)',
        fileCode: 'Prothromplex_500_2569_1_20',
        description: 'คู่มือขนาดยาและการผสม 4-factor Prothrombin Complex Concentrate (PCC)',
        category: 'ยาต้านพิษไม่จำเพาะ (Non-specific Antidote)',
        fileSize: '680 KB',
        fileType: 'PDF',
        date: '20 ม.ค. 2569',
        url: OFFICIAL_DUE_DRIVE_FOLDER,
        isExternalLink: true,
        statusTag: 'มีในบัญชี รพ.',
        statusType: 'success'
      },
      {
        id: 'due_doc_feiba',
        title: 'คำแนะนำการเตรียมยา FEIBA (Feiba_2569_1_20)',
        fileCode: 'Feiba_2569_1_20',
        description: 'คู่มือการเตรียม Activated prothrombin complex concentrate (aPCC)',
        category: 'ยาต้านพิษไม่จำเพาะ (Non-specific Antidote)',
        fileSize: '620 KB',
        fileType: 'PDF',
        date: '20 ม.ค. 2569',
        url: OFFICIAL_DUE_DRIVE_FOLDER,
        isExternalLink: true,
        statusTag: 'มีในบัญชี รพ.',
        statusType: 'success'
      }
    ],
    drugs: [
      {
        genericName: 'Apixaban',
        tradeName: 'Eliquis®',
        strength: '2.5 mg, 5 mg',
        dosageForm: 'Film-coated tablet',
        indications: 'Non-valvular Atrial Fibrillation (NVAF), Treatment/Prevention of DVT and PE',
        dosage: 'NVAF ปกติ: 5 mg bid | ปรับลดเป็น 2.5 mg bid หากเข้าเกณฑ์ ≥ 2 ข้อ (อายุ ≥ 80 ปี, น้ำหนัก ≤ 60 kg, Serum Cr ≥ 1.5 mg/dL)',
        precautions: 'ห้ามใช้ในผู้ป่วยที่มี Mechanical prosthetic heart valve หรือ Moderate-severe Mitral stenosis',
        fileCode: 'DUE_NOAC_2568_12_2',
        docTitle: 'แบบประเมินการใช้ยากลุ่ม NOAC'
      },
      {
        genericName: 'Dabigatran etexilate',
        tradeName: 'Pradaxa®',
        strength: '110 mg, 150 mg',
        dosageForm: 'Capsule (ห้ามแกะหรือเคี้ยว)',
        indications: 'NVAF, Treatment/Prevention of DVT and PE',
        dosage: '150 mg bid (ลดเป็น 110 mg bid หากอายุ ≥ 80 ปี หรือมีความเสี่ยงเลือดออกสูง)',
        precautions: 'ห้ามใช้หาก CrCl < 30 mL/min, มี Specific Antidote คือ Idarucizumab พร้อมใช้ใน รพ.',
        fileCode: 'DUE_NOAC_2568_12_2',
        docTitle: 'แบบประเมินการใช้ยากลุ่ม NOAC'
      },
      {
        genericName: 'Edoxaban',
        tradeName: 'Lixiana®',
        strength: '15 mg, 30 mg, 60 mg',
        dosageForm: 'Film-coated tablet',
        indications: 'NVAF, Treatment of DVT and PE',
        dosage: '60 mg วันละ 1 ครั้ง (ปรับลดเป็น 30 mg วันละ 1 ครั้ง หาก CrCl 15-50 mL/min หรือน้ำหนัก ≤ 60 kg หรือใช้ร่วมกับ Potent P-gp inhibitor)',
        precautions: 'ประสิทธิภาพอาจลดลงในผู้ป่วยที่มี CrCl > 95 mL/min ในข้อบ่งชี้ NVAF',
        fileCode: 'DUE_NOAC_2568_12_2',
        docTitle: 'แบบประเมินการใช้ยากลุ่ม NOAC'
      },
      {
        genericName: 'Rivaroxaban',
        tradeName: 'Xarelto®',
        strength: '10 mg, 15 mg, 20 mg',
        dosageForm: 'Film-coated tablet',
        indications: 'NVAF, Treatment/Prevention of DVT and PE',
        dosage: 'NVAF: 20 mg วันละ 1 ครั้ง พร้อมอาหารมื้อหลัก (ลดเป็น 15 mg od หาก CrCl 15-49 mL/min)',
        precautions: 'ขนาดยา 15 mg และ 20 mg ต้องรับประทานพร้อมอาหารเพื่อเพิ่มการดูดซึม',
        fileCode: 'DUE_NOAC_2568_12_2',
        docTitle: 'แบบประเมินการใช้ยากลุ่ม NOAC'
      }
    ],
    antidotes: [
      {
        name: 'Idarucizumab',
        brandName: 'Praxbind®',
        type: 'specific',
        targetDrug: 'Dabigatran',
        availability: 'available',
        availabilityText: 'มีพร้อมใช้ในโรงพยาบาลวชิระภูเก็ต',
        fileCode: 'Idarucizumab_2569_1_14',
        docTitle: 'Idarucizumab_2569_1_14',
        dosageGuidelines: '5 g IV (ให้ในรูปแบบ 2.5 g/50 mL จำนวน 2 vials ติดต่อกันทางหลอดเลือดดำ)',
        preparation: 'พร้อมใช้เป็นสารละลายใส ไม่ต้องผสมตัวทำละลายเพิ่มเติม Infuse แต่ละขวดไม่เกิน 5-10 นาที'
      },
      {
        name: 'Andexanet alfa',
        brandName: 'Andexxa®',
        type: 'specific',
        targetDrug: 'Apixaban, Rivaroxaban',
        availability: 'not_in_thailand',
        availabilityText: 'ไม่มีจำหน่ายในไทย (ใช้ 4-factor PCC หรือ FEIBA แทน)',
        dosageGuidelines: 'ไม่มีจำหน่ายในประเทศไทย — แนะนำพิจารณาใช้ 4-factor PCC (Prothromplex) 25-50 IU/kg หรือ FEIBA ร่วมกับ Supportive care',
        preparation: 'ไม่มีจำหน่ายในประเทศไทย'
      },
      {
        name: 'Prothrombin complex concentrate (PROTHROMPLEX)',
        brandName: 'PROTHROMPLEX Total 500 IU (4-factor PCC)',
        type: 'non_specific',
        targetDrug: 'NOACs (Apixaban, Rivaroxaban, Edoxaban) & Warfarin',
        availability: 'available',
        availabilityText: 'มีในบัญชีโรงพยาบาลวชิระภูเก็ต',
        fileCode: 'Prothromplex_500_2569_1_20',
        docTitle: 'Prothromplex_500_2569_1_20',
        dosageGuidelines: '25-50 IU/kg IV infusion (สูงสุดไม่เกิน 3,000 IU หรือตามดุลยพินิจแพทย์)',
        preparation: 'ละลายผงยาด้วย Sterile water 20 mL ที่มาพร้อมในกล่อง ฉีดช้าๆ อัตราไม่เกิน 2-3 mL/นาที'
      },
      {
        name: 'Activated prothrombin complex concentrate (FEIBA)',
        brandName: 'FEIBA 500 IU (aPCC)',
        type: 'non_specific',
        targetDrug: 'NOACs ในภาวะเลือดออกรุนแรงคุกคามชีวิต',
        availability: 'available',
        availabilityText: 'มีในบัญชีโรงพยาบาลวชิระภูเก็ต',
        fileCode: 'Feiba_2569_1_20',
        docTitle: 'Feiba_2569_1_20',
        dosageGuidelines: '50 IU/kg IV (ขนาดยาสูงสุดไม่เกิน 100 IU/kg/day, rate ไม่เกิน 2 U/kg/นาที)',
        preparation: 'ละลายด้วยน้ำกลั่นปราศจากเชื้อตามชุดอุปกรณ์ ค่อยๆ หมุนขวด ห้ามเขย่าแรง'
      },
      {
        name: 'Prothrombin complex concentrate (PROFILNINE)',
        brandName: 'Profilnine (3-factor PCC)',
        type: 'non_specific',
        targetDrug: '3-factor (Factor II, IX, X ขาด Factor VII)',
        availability: 'not_in_hospital',
        availabilityText: 'ไม่มีในบัญชีโรงพยาบาลวชิระภูเก็ต',
        dosageGuidelines: 'ไม่มีในบัญชีโรงพยาบาลวชิระภูเก็ต — ให้ใช้ PROTHROMPLEX (4-factor PCC) ซึ่งมี Factor ครบถ้วนแทน',
        preparation: 'ไม่มีในบัญชียาโรงพยาบาล'
      }
    ],
    evaluationCriteria: [
      'ผู้ป่วยมีข้อบ่งใช้ที่ได้รับการรับรอง: Non-valvular Atrial Fibrillation (CHA2DS2-VASc score ≥ 1 ในชาย หรือ ≥ 2 ในหญิง) หรือ DVT/PE',
      'ตรวจประเมิน Baseline Renal function (eGFR / CrCl) และ Liver function ทุกราย',
      'ไม่มีข้อห้ามใช้เด็ดขาด: เลือดออกรุนแรงในปัจจุบัน, Severe hepatic impairment, Mechanical heart valve, มีการตั้งครรภ์',
      'มีการประเมินและให้คำแนะนำเรื่อง Drug-Drug interactions (Potent CYP3A4 / P-gp inhibitors เช่น Ketoconazole, Itraconazole)'
    ],
    clinicalHighlights: [
      '✅ ตรวจสอบขนาดยาลดลง (Dose reduction) ในผู้สูงอายุ น้ำหนักน้อย และค่าไตเสื่อม',
      '🛑 กรณีฉุกเฉินเลือดออกรุนแรง: Dabigatran ใช้ Idarucizumab ทันที | Apixaban/Rivaroxaban ใช้ Prothromplex 4-factor PCC (เนื่องจาก Andexanet alfa ไม่มีจำหน่ายในไทย)'
    ]
  },

  // 3. ยาปฏิชีวนะมูลค่าสูง
  {
    id: 'due_atb',
    sectionNumber: 3,
    title: 'ยาปฏิชีวนะมูลค่าสูง (High-cost & Restricted Antibiotics)',
    shortTitle: 'ยาปฏิชีวนะมูลค่าสูง',
    badge: 'Controlled ATB',
    subtitle: '7 รายการยาต้านจุลชีพชนิดควบคุม & แบบขออนุมัติ DUE_ATB_2568_11_24',
    description: 'ระบบควบคุมการสั่งใช้ยาต้านจุลชีพมูลค่าสูงและการบริหารยาตามนโยบาย Antimicrobial Stewardship (AMS) โรงพยาบาลวชิระภูเก็ต',
    iconName: 'ShieldAlert',
    primaryDocCode: 'DUE_ATB_2568_11_24',
    documents: [
      {
        id: 'due_doc_atb_eval',
        title: 'แบบขออนุมัติใช้ยาต้านจุลชีพชนิดควบคุม (DUE_ATB_2568_11_24)',
        fileCode: 'DUE_ATB_2568_11_24',
        description: 'แบบฟอร์มขออนุมัติสั่งใช้ยาต้านจุลชีพชนิดควบคุม (Pre-authorization & Post-prescription review 48-72 ชม.)',
        category: 'การประเมินความเหมาะสมการใช้ยา (DUE)',
        fileSize: '890 KB',
        fileType: 'PDF',
        date: '24 พ.ย. 2568',
        url: OFFICIAL_DUE_DRIVE_FOLDER,
        isExternalLink: true,
        statusTag: 'แบบขออนุมัติควบคุม',
        statusType: 'danger'
      }
    ],
    drugs: [
      {
        genericName: 'Piperacillin / Tazobactam',
        tradeName: 'Tazocin® / Pip-Tazo',
        strength: '4.5 g (4 g/0.5 g) vial',
        dosageForm: 'Powder for injection',
        indications: 'Severe nosocomial pneumonia, Intra-abdominal infection, Febrile neutropenia, Sepsis จากเชื้อ Pseudomonas aeruginosa',
        dosage: '4.5 g IV q 6-8h (แนะนำ Extended infusion นาน 3-4 ชม. ในผู้ป่วยหนัก)',
        precautions: 'ปรับขนาดยาตาม CrCl, หลีกเลี่ยงการใช้ร่วมกับ Vancomycin เป็นเวลานานเนื่องจากเพิ่มความเสี่ยงไตวายเฉียบพลัน (AKI)',
        fileCode: 'DUE_ATB_2568_11_24',
        docTitle: 'DUE_ATB_2568_11_24',
        statusBadge: 'Controlled Drug',
        statusType: 'warning'
      },
      {
        genericName: 'Meropenem',
        tradeName: 'Meronem®',
        strength: '1 g injection',
        dosageForm: 'Powder for injection',
        indications: 'Severe multidrug-resistant Gram-negative infections, ESBL-producing bacteria, Hospital-acquired pneumonia, Meningitis, Septic shock',
        dosage: '1 g IV q 8h (เยื่อหุ้มสมองอักเสบ: 2 g IV q 8h, แนะนำ Prolonged infusion 3 ชม.)',
        precautions: 'ปรับขนาดยาตาม eGFR, หลีกเลี่ยงการใช้ร่วมกับ Sodium valproate (ลดระดับ Valproate อย่างรุนแรงทำให้เกิดอาการชัก)',
        fileCode: 'DUE_ATB_2568_11_24',
        docTitle: 'DUE_ATB_2568_11_24',
        statusBadge: 'Carbapenem ควบคุม',
        statusType: 'danger'
      },
      {
        genericName: 'Imipenem / Cilastatin',
        tradeName: 'Tienam®',
        strength: '500 mg / 500 mg injection',
        dosageForm: 'Powder for injection',
        indications: 'Severe polymicrobial infections, ESBL, Intra-abdominal infection',
        dosage: '500 mg IV q 6h หรือ 1 g IV q 8h',
        precautions: 'เสี่ยงต่ออาการชักมากกว่า Meropenem โดยเฉพาะในผู้ป่วยไตเสื่อมหรือมีโรคทางระบบประสาทเดิม',
        fileCode: 'DUE_ATB_2568_11_24',
        docTitle: 'DUE_ATB_2568_11_24',
        statusBadge: 'Carbapenem ควบคุม',
        statusType: 'danger'
      },
      {
        genericName: 'Sulbactam (Cefoperazone/Sulbactam / Sulbactam IV)',
        tradeName: 'Sulperazon® / Sulbactam Sodium',
        strength: '1 g, 2 g injection',
        dosageForm: 'Powder for injection',
        indications: 'การรักษาการติดเชื้อดื้อยา Carbapenem-resistant Acinetobacter baumannii (CRAB) และเชื้อกรัมลบดื้อยา',
        dosage: 'ขนาดยาสูงสำหรับ CRAB: Sulbactam component 6-9 g/day แบ่งให้ q 8h โดยหยดนาน 3-4 ชม.',
        precautions: 'ติดตามการทำงานของตับ ไต และอาการเลือดออกผิดปกติ (กรณี Cefoperazone มีผลต่อ Prothrombin time)',
        fileCode: 'DUE_ATB_2568_11_24',
        docTitle: 'DUE_ATB_2568_11_24',
        statusBadge: 'CRAB Specific',
        statusType: 'warning'
      },
      {
        genericName: 'Colistin (Colistimethate Sodium)',
        tradeName: 'Colistimethate Sodium 150 mg',
        strength: '150 mg base activity (~4.5 ล้าน IU)',
        dosageForm: 'Powder for injection / Nebulizer',
        indications: 'Carbapenem-resistant Enterobacteriaceae (CRE), Extensively drug-resistant (XDR) Pseudomonas aeruginosa หรือ Acinetobacter baumannii',
        dosage: 'Loading dose: 300 mg CBA (~9 ล้าน IU) IV infuse 1 ชม. ตามด้วย Maintenance 150 mg CBA q 12h (ปรับตาม CrCl อย่างเคร่งครัด)',
        precautions: 'พิษต่อไตสูงมาก (Nephrotoxicity) และพิษต่อระบบประสาท (Neurotoxicity) ต้องติดตาม Serum Creatinine และปัสสาวะทุกวัน',
        fileCode: 'DUE_ATB_2568_11_24',
        docTitle: 'DUE_ATB_2568_11_24',
        statusBadge: 'Last Resort / ควบคุมพิเศษ',
        statusType: 'danger'
      },
      {
        genericName: 'Tigecycline',
        tradeName: 'Tygacil®',
        strength: '50 mg vial',
        dosageForm: 'Powder for injection',
        indications: 'Complicated intra-abdominal infections, Complicated skin and soft tissue infections, ติดเชื้อ CRAB ในช่องท้องหรือเนื้อเยื่ออ่อน',
        dosage: 'Loading 100 mg IV infuse 30-60 นาที ตามด้วย 50 mg IV q 12h',
        precautions: 'ไม่แนะนำให้ใช้ใน Hospital-acquired pneumonia หรือการติดเชื้อในกระแสเลือด (Bacteremia) เนื่องจากระดับยาในเลือดและปอดต่ำ',
        fileCode: 'DUE_ATB_2568_11_24',
        docTitle: 'DUE_ATB_2568_11_24',
        statusBadge: 'Glycylcycline',
        statusType: 'warning'
      },
      {
        genericName: 'Vancomycin',
        tradeName: 'Vancocin® / Edicin',
        strength: '500 mg, 1 g vial',
        dosageForm: 'Powder for injection',
        indications: 'Methicillin-resistant Staphylococcus aureus (MRSA), MRSE, Severe Enterococcal infections, ยาฆ่าเชื้อกรัมบวกในผู้ที่แพ้ Penicillin รุนแรง',
        dosage: '15-20 mg/kg IV q 8-12h (Loading dose 25-30 mg/kg ในผู้ป่วยวิกฤต) Infusion rate ไม่เกิน 1 g/ชั่วโมง',
        precautions: 'เฝ้าระวัง Red Man Syndrome (infuse ช้าๆ อย่างน้อย 60 นาที), พิษต่อไต และต้องตรวจวัดระดับยาในเลือด (Therapeutic Drug Monitoring: TDM)',
        fileCode: 'DUE_ATB_2568_11_24',
        docTitle: 'DUE_ATB_2568_11_24',
        statusBadge: 'TDM Required',
        statusType: 'warning'
      }
    ],
    evaluationCriteria: [
      'ต้องส่งตรวจสิ่งส่งตรวจเพาะเชื้อและทดสอบความไวของเชื้อ (Culture & Susceptibility) ก่อนเริ่มยาปฏิชีวนะทุกครั้ง',
      'มีข้อบ่งชี้ทางคลินิกชัดเจนว่าเป็น Severe infection จากเชื้อดื้อยา หรือมีผลการเพาะเชื้อยืนยัน',
      'แพทย์เจ้าของไข้ต้องกรอกแบบขออนุมัติ DUE_ATB_2568_11_24 ส่งกลุ่มงานเภสัชกรรม/คณะกรรมการ AMS',
      'ต้องประเมินซ้ำ (48-72 hr Reassessment) เมื่อผลเพาะเชื้อออก เพื่อพิจารณา De-escalation หรือหยุดยา'
    ],
    clinicalHighlights: [
      '🕒 กฎ 48-72 ชั่วโมง: เภสัชกรจะประสานงานติดตามผลเพาะเชื้อ เพื่อปรับลดขนาดยา (De-escalation) หรือเปลี่ยนเป็นยาที่มีสเปกตรัมแคบลง',
      '🧪 Vancomycin ต้องตรวจวัดระดับยาในเลือด (Trough level / AUC24/MIC) เพื่อประสิทธิภาพและความปลอดภัยต่อไต'
    ]
  },

  // 4. Diabetic mellitus and Obesity
  {
    id: 'due_dm_obesity',
    sectionNumber: 4,
    title: 'Diabetic mellitus and Obesity (ยาเบาหวานและโรคอ้วน)',
    shortTitle: 'DM & Obesity (GLP-1 / GIP)',
    badge: 'DM & Obesity',
    subtitle: 'MyPen, Ozempic, Wegovy, Mounjaro และเทคนิคการใช้ปากกาฉีด',
    description: 'คู่มือการใช้ปากกาฉีดยาอินซูลิน และยากลุ่ม GLP-1 Receptor Agonist / Dual GIP & GLP-1 RA สำหรับโรคเบาหวานชนิดที่ 2 และการควบคุมน้ำหนัก',
    iconName: 'Activity',
    primaryDocCode: 'MyPen_2568_12_15',
    documents: [
      {
        id: 'due_doc_mypen',
        title: 'เอกสารแนะนำการใช้ปากกาฉีดยาอินซูลิน my pen (MyPen_2568_12_15)',
        fileCode: 'MyPen_2568_12_15',
        description: 'คู่มือขั้นตอนการใช้งานปากกาฉีดยา การไล่ฟองอากาศ การเปลี่ยนหัวเข็ม และการฉีดยาอย่างถูกต้อง',
        category: 'คู่มืออุปกรณ์เทคนิคพิเศษ',
        fileSize: '1.2 MB',
        fileType: 'PDF',
        date: '15 ธ.ค. 2568',
        url: OFFICIAL_DUE_DRIVE_FOLDER,
        isExternalLink: true,
        statusTag: 'คู่มือคนไข้ & บุคลากร',
        statusType: 'success'
      },
      {
        id: 'due_doc_ozempic',
        title: 'เอกสารแนะนำยา OZEMPIC (Ozempic_2568_12_15)',
        fileCode: 'Ozempic_2568_12_15',
        description: 'Semaglutide 1 mg/dose (4 mg/3 mL/pen) solution for injection in pre-filled pen สำหรับโรคเบาหวาน',
        category: 'คู่มือการใช้ยาเฉพาะทาง',
        fileSize: '950 KB',
        fileType: 'PDF',
        date: '15 ธ.ค. 2568',
        url: OFFICIAL_DUE_DRIVE_FOLDER,
        isExternalLink: true,
        statusTag: 'เบาหวานชนิดที่ 2',
        statusType: 'info'
      },
      {
        id: 'due_doc_wegovy',
        title: 'เอกสารแนะนำยา WEGOVY อัพเดท 10 มี.ค. 69 (Wegovy_2596_03_10)',
        fileCode: 'Wegovy_2596_03_10',
        description: 'Semaglutide 1 mg/dose (4 mg/3 mL/pen) solution for injection in flex touch pen สำหรับควบคุมน้ำหนักเรื้อรัง',
        category: 'คู่มือการใช้ยาเฉพาะทาง',
        fileSize: '1.1 MB',
        fileType: 'PDF',
        date: '10 มี.ค. 2569',
        url: OFFICIAL_DUE_DRIVE_FOLDER,
        isExternalLink: true,
        statusTag: 'อัปเดตล่าสุด 2569',
        statusType: 'success'
      },
      {
        id: 'due_doc_mounjaro',
        title: 'เอกสารแนะนำยา MOUNJARO (Mounjaro_2568_12_15)',
        fileCode: 'Mounjaro_2568_12_15',
        description: 'Tirzepatide 5 mg/dose (20 mg/pen) และ 10 mg/dose (40 mg/pen) injection in kwik pen',
        category: 'คู่มือการใช้ยาเฉพาะทาง',
        fileSize: '1.0 MB',
        fileType: 'PDF',
        date: '15 ธ.ค. 2568',
        url: OFFICIAL_DUE_DRIVE_FOLDER,
        isExternalLink: true,
        statusTag: 'Dual GIP/GLP-1',
        statusType: 'info'
      }
    ],
    drugs: [
      {
        genericName: 'Semaglutide (T2DM formulation)',
        tradeName: 'OZEMPIC®',
        strength: '1 mg/dose (4 mg / 3 mL / pen)',
        dosageForm: 'Solution for injection in pre-filled pen',
        indications: 'ผู้ป่วยโรคเบาหวานชนิดที่ 2 (T2DM) เพื่อควบคุมระดับน้ำตาลในเลือดร่วมกับการควบคุมอาหารและการออกกำลังกาย และลดความเสี่ยง Major Adverse Cardiovascular Events (MACE)',
        dosage: 'ฉีดใต้ผิวหนัง (SC) สัปดาห์ละ 1 ครั้ง: เริ่มต้น 0.25 mg สัปดาห์ละครั้ง นาน 4 สัปดาห์ จากนั้นปรับเป็น 0.5 mg สัปดาห์ละครั้ง หากจำเป็นสามารถปรับเพิ่มเป็น 1 mg สัปดาห์ละครั้ง',
        precautions: 'อาการข้างเคียงระบบทางเดินอาหาร (คลื่นไส้ แน่นท้อง ท้องผูก/ท้องเสีย), ห้ามใช้ในผู้มีประวัติ Medullary Thyroid Carcinoma (MTC) หรือ MEN2',
        fileCode: 'Ozempic_2568_12_15',
        docTitle: 'Ozempic_2568_12_15'
      },
      {
        genericName: 'Semaglutide (Weight management formulation)',
        tradeName: 'WEGOVY® (อัพเดท 10 มี.ค. 69)',
        strength: '1 mg/dose (4 mg / 3 mL / pen)',
        dosageForm: 'Solution for injection in flex touch pen',
        indications: 'การควบคุมน้ำหนักเรื้อรังร่วมกับการควบคุมอาหารและการเพิ่มการออกกำลังกายในผู้ใหญ่ที่มี BMI ≥ 30 kg/m² หรือ BMI ≥ 27 kg/m² ร่วมกับโรคร่วม (เช่น ความดัน เบาหวาน ไขมันในเลือดสูง)',
        dosage: 'ฉีดใต้ผิวหนัง (SC) สัปดาห์ละ 1 ครั้ง Dose Escalation ค่อยๆ ปรับขึ้นทุก 4 สัปดาห์เพื่อลดผลข้างเคียงทางเดินอาหาร',
        precautions: 'ฉีดในวันเดียวกันของแต่ละสัปดาห์ เวลาใดก็ได้ เก็บในตู้เย็น 2-8°C ห้ามแช่แข็ง',
        fileCode: 'Wegovy_2596_03_10',
        docTitle: 'Wegovy_2596_03_10'
      },
      {
        genericName: 'Tirzepatide',
        tradeName: 'MOUNJARO®',
        strength: '5 mg/dose (20 mg/pen) และ 10 mg/dose (40 mg/pen)',
        dosageForm: 'Solution for injection in KwikPen',
        indications: 'Dual GIP and GLP-1 Receptor Agonist สำหรับควบคุมระดับน้ำตาลในผู้ป่วยเบาหวานชนิดที่ 2 และภาวะน้ำหนักเกิน/โรคอ้วน',
        dosage: 'ฉีดใต้ผิวหนัง (SC) สัปดาห์ละ 1 ครั้ง: เริ่มต้น 2.5 mg/สัปดาห์ นาน 4 สัปดาห์ แล้วปรับเป็น 5 mg/สัปดาห์ สามารถปรับเพิ่มทีละ 2.5 mg ทุก 4 สัปดาห์ตามเป้าหมาย (สูงสุด 15 mg/สัปดาห์)',
        precautions: 'ระวังอาการ Hypoglycemia เมื่อใช้ร่วมกับ Insulin หรือ Sulfonylurea, ป้องกันภาวะ Dehydration จากอาการคลื่นไส้อาเจียน',
        fileCode: 'Mounjaro_2568_12_15',
        docTitle: 'Mounjaro_2568_12_15'
      }
    ],
    evaluationCriteria: [
      'ตรวจสอบข้อบ่งใช้และเกณฑ์การเบิกจ่ายตามสิทธิการรักษาของผู้ป่วย',
      'ตรวจสอบเทคนิคการใช้ปากกาฉีดยา การหมุนปรับขนาดยูนิต และการเปลี่ยนหัวเข็มทุกครั้ง',
      'ประเมินประวัติส่วนตัวและครอบครัวเรื่องมะเร็งต่อมไทรอยด์ชนิด Medullary Thyroid Carcinoma หรือกลุ่มอาการ MEN 2',
      'ให้คำแนะนำการจัดการผลข้างเคียงคลื่นไส้อาเจียน การดื่มน้ำให้เพียงพอ และการปรับขนาดยาแบบค่อยเป็นค่อยไป (Dose Titration)'
    ],
    clinicalHighlights: [
      '❄️ การเก็บรักษา: ปากกาที่ยังไม่เปิดใช้เก็บในตู้เย็น 2-8°C (ห้ามแช่แข็ง) หลังเปิดใช้สามารถเก็บที่อุณหภูมิห้องตามระยะเวลาที่กำหนดในฉลาก',
      '📍 ตำแหน่งการฉีด: หน้าท้อง (เว้นรอบสะดือ 2 นิ้ว), หน้าขาด้านบน, หรือต้นแขนด้านนอก โดยหมุนเวียนตำแหน่งฉีดทุกครั้ง'
    ]
  },

  // 5. Osteoporosis
  {
    id: 'due_osteoporosis',
    sectionNumber: 5,
    title: 'Osteoporosis (โรคกระดูกพรุน)',
    shortTitle: 'Osteoporosis (ว 548)',
    badge: 'กระดูกพรุน & ว 548',
    subtitle: 'Teriparatide (FORTEO) & เอกสาร กรมบัญชีกลาง ว 548',
    description: 'แบบประเมินและเกณฑ์การเบิกจ่ายยา Teriparatide สำหรับผู้ป่วยโรคกระดูกพรุนรุนแรงตามหนังสือเวียนกรมบัญชีกลาง ว 548',
    iconName: 'Bone',
    primaryDocCode: 'Teriparatide_2568_12_23',
    documents: [
      {
        id: 'due_doc_teriparatide',
        title: 'เอกสารแนะนำยา Teriparatide FORTEO (Teriparatide_2568_12_23)',
        fileCode: 'Teriparatide_2568_12_23',
        description: 'Teriparatide 600 mcg/2.4 mL pre-filled pen (FORTEO) คู่มือวิธีใช้และการเก็บรักษา',
        category: 'คู่มือการใช้ยาเฉพาะทาง',
        fileSize: '880 KB',
        fileType: 'PDF',
        date: '23 ธ.ค. 2568',
        url: OFFICIAL_DUE_DRIVE_FOLDER,
        isExternalLink: true,
        statusTag: 'คู่มือการใช้ยา',
        statusType: 'success'
      },
      {
        id: 'due_doc_w548',
        title: 'เอกสาร กรมบัญชีกลาง ว 548 เบิกจ่ายยาโรคกระดูกพรุน (2569_ว_548_Teriparatide)',
        fileCode: '2569_ว_548_Teriparatide',
        description: 'หลักเกณฑ์และแนวทางการเบิกจ่ายค่ายารักษาโรคกระดูกพรุน Teriparatide ตามหนังสือกรมบัญชีกลาง ด่วนที่สุด ที่ กค 0416.2/ว 548',
        category: 'หนังสือเวียนและเกณฑ์เบิกจ่าย',
        fileSize: '1.4 MB',
        fileType: 'PDF',
        date: '2569',
        url: OFFICIAL_DUE_DRIVE_FOLDER,
        isExternalLink: true,
        statusTag: 'เกณฑ์เบิกจ่าย ว 548',
        statusType: 'danger'
      }
    ],
    drugs: [
      {
        genericName: 'Teriparatide',
        tradeName: 'FORTEO®',
        strength: '600 mcg / 2.4 mL pre-filled pen (20 mcg/dose)',
        dosageForm: 'Subcutaneous injection pre-filled pen',
        indications: 'Severe Osteoporosis ในหญิงวัยหมดประจำเดือนหรือในชายที่มีความเสี่ยงสูงต่อกระดูกหัก หรือเกิดกระดูกหักซ้ำซ้อนแม้ได้รับการรักษาด้วยยากลุ่ม Antiresorptive แล้ว',
        dosage: '20 mcg (80 mcL) ฉีดใต้ผิวหนัง (SC) บริเวณหน้าท้องหรือต้นขา วันละ 1 ครั้ง ติดต่อกันนานไม่เกิน 24 เดือน (lifetime maximum)',
        precautions: 'ต้องเก็บในตู้เย็น 2-8°C ตลอดเวลา ห้ามแช่แข็ง ฉีดเสร็จต้องเก็บเข้าตู้เย็นทันที ห้ามใช้ในผู้ป่วย Paget’s disease of bone หรือเคยได้รับการฉายรังสีบริเวณกระดูก',
        fileCode: 'Teriparatide_2568_12_23',
        docTitle: 'Teriparatide_2568_12_23'
      }
    ],
    evaluationCriteria: [
      'เกณฑ์ ว 548: ตรวจมวลกระดูก (DXA) พบ BMD T-score ≤ -3.0 ที่กระดูกสันหลัง (Spine) หรือคอกระดูกสะโพก (Femoral neck)',
      'มีภาวะกระดูกหักจากความเปราะบางรุนแรง (Severe Fragility Fracture) อย่างน้อย 1 ตำแหน่ง หรือเกิดกระดูกหักใหม่ขณะได้รับการรักษาด้วย Bisphosphonates ≥ 1 ปี',
      'ล้มเหลวหรือไม่สามารถทนต่อยากลุ่ม Bisphosphonates ได้ หรือมีข้อห้ามใช้ชัดเจน (เช่น eGFR < 30-35 mL/min)',
      'การสั่งใช้ต้องได้รับการประเมินและรับรองโดยแพทย์เฉพาะทางด้านโรคกระดูก (Orthopedist) หรือต่อมไร้ท่อ (Endocrinologist)'
    ],
    clinicalHighlights: [
      '⏱️ ระยะเวลาการรักษา: จำกัดสูงสุดไม่เกิน 24 เดือนตลอดชีวิต (Lifetime cumulative exposure ≤ 24 months)',
      '🧊 Cold Chain เคร่งครัด: ต้องเก็บในตู้เย็น 2-8°C เสมอ แม้หลังเปิดใช้แล้ว (ไม่สามารถทิ้งไว้ที่อุณหภูมิห้องเหมือนอินซูลิน)'
    ]
  },

  // 6. Levetiracetam injection
  {
    id: 'due_levetiracetam',
    sectionNumber: 6,
    title: 'Levetiracetam injection',
    shortTitle: 'Levetiracetam Inj',
    badge: 'DUE_Levetiracetam',
    subtitle: 'Levetiracetam 500 mg/5 mL injection & แบบประเมิน DUE_Levetiracetam_2569_07_07',
    description: 'แบบประเมินความเหมาะสมการสั่งใช้ยาฉีด Levetiracetam ในภาวะชักฉุกเฉิน ผู้ป่วยวิกฤตทางระบบประสาท และการปรับขนาดยาตามค่าไต',
    iconName: 'Zap',
    primaryDocCode: 'DUE_Levetiracetam_2569_07_07',
    documents: [
      {
        id: 'due_doc_levetiracetam_eval',
        title: 'แบบประเมิน Levetiracetam injection (DUE_Levetiracetam_2569_07_07)',
        fileCode: 'DUE_Levetiracetam_2569_07_07',
        description: 'แบบฟอร์มประเมินความเหมาะสมการสั่งใช้ยาฉีด Levetiracetam 500 mg/5 mL โรงพยาบาลวชิระภูเก็ต',
        category: 'การประเมินความเหมาะสมการใช้ยา (DUE)',
        fileSize: '760 KB',
        fileType: 'PDF',
        date: '7 ก.ค. 2569',
        url: OFFICIAL_DUE_DRIVE_FOLDER,
        isExternalLink: true,
        statusTag: 'แบบประเมิน DUE',
        statusType: 'success'
      }
    ],
    drugs: [
      {
        genericName: 'Levetiracetam',
        tradeName: 'Keppra® / Levitam Inj',
        strength: '500 mg / 5 mL vial',
        dosageForm: 'Concentrate for solution for IV infusion',
        indications: 'ภาวะชักต่อเนื่อง (Status Epilepticus), ป้องกันหรือรักษาอาการชักในผู้ป่วยบาดเจ็บที่ศีรษะ (TBI), ผู้ป่วยผ่าตัดสมอง (Post-craniotomy) หรือผู้ป่วยที่ไม่สามารถรับประทานยาทางปากได้ชั่วคราว',
        dosage: 'Loading dose: 20-60 mg/kg (สูงสุด 3,000-4,500 mg) หรือ Maintenance 500-1,500 mg IV q 12h หยดเข้าหลอดเลือดดำใน 15 นาที',
        precautions: 'ปรับขนาดยาตามค่าการทำงานของไต (CrCl) อย่างเคร่งครัดเนื่องจากขับออกทางไตเป็นหลัก, เมื่อผู้ป่วยกลืนยาได้ให้เปลี่ยนเป็นรูปแบบรับประทาน (Step-down to Oral)',
        fileCode: 'DUE_Levetiracetam_2569_07_07',
        docTitle: 'DUE_Levetiracetam_2569_07_07',
        statusBadge: 'IV to Oral Switch',
        statusType: 'warning'
      }
    ],
    evaluationCriteria: [
      'ผู้ป่วยมีภาวะชักเฉียบพลัน/ภาวะชักต่อเนื่อง (Status epilepticus) หรือจำเป็นต้องป้องกันอาการชักในผู้ป่วยวิกฤตระบบประสาท',
      'ผู้ป่วยไม่สามารถรับประทานยาทางปากได้ (เช่น NPO, Intubated, ภาวะดูดซึมอาหารผิดปกติ)',
      'มีการประเมินการทำงานของไตและปรับขนาดยาตาม CrCl: CrCl 50-79 mL/min ให้ 500-1,000 mg q 12h | CrCl 30-49 mL/min ให้ 250-750 mg q 12h | CrCl < 30 mL/min ให้ 250-500 mg q 12h',
      'มีการประเมินเพื่อเปลี่ยนกลับเป็นยารับประทาน (IV to Oral switch) โดยเร็วเมื่อผู้ป่วยเริ่มรับประทานอาหารหรือยาได้'
    ],
    clinicalHighlights: [
      '💉 การบริหารยา: เจือจางใน 0.9% NSS หรือ 5% D/W ปริมาตร 100 mL และหยดทางหลอดเลือดดำในเวลา 15 นาที (ห้ามฉีดแบบ IV Push เร็ว)',
      '🔄 นโยบาย IV to Oral: อัตราการดูดซึมยาแบบรับประทานสูงเกือบ 100% (ขนาดยาเท่ากัน 1:1) หากผู้ป่วยกินยาได้ควรเปลี่ยนทันทีเพื่อลดค่าใช้จ่ายและความเสี่ยงติดเชื้อ'
    ]
  }
];
