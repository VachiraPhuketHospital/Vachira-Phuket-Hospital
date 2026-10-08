/**
 * ============================================================================
 * ไฟล์สำหรับแก้ไขข้อมูล: รายการยาที่ประเมินความเหมาะสมการใช้ (DUE)
 * ไฟล์นี้อยู่ที่: src/data/dueContentConfig.ts
 * ============================================================================
 * 
 * วิธีการใส่ลิงก์ Google Drive:
 * 1. ลิงก์โฟลเดอร์ Google Drive รวมหลัก: แก้ไขที่ DUE_GOOGLE_DRIVE_MAIN_URL
 * 2. ลิงก์ Google Drive ประจำแต่ละหัวข้อ 1–6: ใส่ที่ \"googleDriveUrl\" ในแต่ละหัวข้อ
 * 3. ลิงก์ Google Drive เฉพาะของแต่ละเอกสารหรือยา: ใส่ที่ \"url\" ใน docLink หรือ items
 *    ตัวอย่าง: \x27https://drive.google.com/file/d/xxxxx/view\x27 หรือ \x27https://drive.google.com/drive/folders/xxxxx\x27
 *    *หากไม่ได้ใส่ url เฉพาะ ระบบจะใช้ลิงก์ Google Drive รวมกลางให้อัตโนมัติ*
 */

// ลิงก์โฟลเดอร์ Google Drive รวมเอกสาร DUE ทั้งหมด
export const DUE_GOOGLE_DRIVE_MAIN_URL =
  "https://drive.google.com/drive/folders/1PZs5h3ADWSp-KEzNUTol4M_8qvBFyxpd?usp=sharing";

export interface DueDocLinkItem {
  prefixText?: string;   // ข้อความก่อนหน้าลิงก์ (ถ้ามี)
  docCode: string;       // รหัสเอกสาร เช่น DUE_Albumin (จะแสดงเป็นตัวอักษรสีชมพูขีดเส้นใต้ มีไอคอน Drive)
  suffixText?: string;   // ข้อความต่อท้าย (ถ้ามี)
  url?: string;          // ลิงก์ Google Drive เฉพาะของเอกสารนี้ (ถ้าไม่ระบุ จะใช้ DUE_GOOGLE_DRIVE_MAIN_URL)
}

export interface DueListItem {
  text?: string;         // ข้อความ เช่น "Apixaban"
  url?: string;          // ลิงก์ Google Drive สำหรับรายการยานี้ (ถ้ามี)
  docLink?: DueDocLinkItem; // เอกสารที่มีลิงก์ Google Drive
}

export interface DueSubGroup {
  subTitle: string;      // หัวข้อย่อย เช่น "2.1 แบบประเมินความเหมาะสมการใช้ยากลุ่ม NOAC"
  googleDriveUrl?: string; // ลิงก์ Google Drive ประจำหัวข้อย่อย (ถ้ามี)
  items?: DueListItem[];
  subSections?: {
    header: string;      // เช่น "– Specific antidote NOAC"
    items: DueListItem[];
  }[];
}

export interface DueMainTopic {
  id: string;
  number: number;
  title: string;         // หัวข้อหลัก เช่น "1. แบบประเมินความเหมาะสมการใช้ Albumin"
  googleDriveUrl?: string; // ลิงก์ Google Drive โฟลเดอร์ประจำหัวข้อนี้ (สามารถนำลิงก์ Drive มาใส่ได้)
  items?: DueListItem[]; // รายการยา/เอกสาร
  subGroups?: DueSubGroup[]; // หัวข้อย่อย 2.1, 2.2 (ถ้ามี)
}

/**
 * ============================================================================
 * ข้อมูลรายการยาและเอกสาร DUE ทั้ง 6 กลุ่ม (สามารถใส่หรือเปลี่ยนลิงก์ Google Drive ได้ที่นี่)
 * ============================================================================
 */
export const DUE_DOCUMENT_DIRECTORY_DATA: {
  pageTitle: string;
  topics: DueMainTopic[];
} = {
  // หัวข้อใหญ่ของหน้า
  pageTitle: "รายการยาที่ประเมินความเหมาะสมการใช้",
  topics: [
    // ------------------------------------------------------------------------
    // กลุ่มที่ 1: แบบประเมินความเหมาะสมการใช้ Albumin
    // ------------------------------------------------------------------------
    {
      id: "due_albumin",
      number: 1,
      title: "1. แบบประเมินความเหมาะสมการใช้ Albumin",
      // ลิงก์ Google Drive ประจำกลุ่มที่ 1
      googleDriveUrl: DUE_GOOGLE_DRIVE_MAIN_URL,
      items: [
        {
          docLink: {
            prefixText: "แบบประเมิน Albumin ",
            docCode: "DUE_Albumin",
            url: DUE_GOOGLE_DRIVE_MAIN_URL,
          },
        },
      ],
    },

    // ------------------------------------------------------------------------
    // กลุ่มที่ 2: ยากลุ่ม Non-vitamin K Antagonist Oral Anticoagulants (NOAC)
    // ------------------------------------------------------------------------
    {
      id: "due_noac",
      number: 2,
      title: "2. ยากลุ่ม Non-vitamin K Antagonist Oral Anticoagulants (NOAC)",
      // ลิงก์ Google Drive ประจำกลุ่มที่ 2
      googleDriveUrl: DUE_GOOGLE_DRIVE_MAIN_URL,
      subGroups: [
        {
          subTitle: "2.1 แบบประเมินความเหมาะสมการใช้ยากลุ่ม NOAC",
          googleDriveUrl: DUE_GOOGLE_DRIVE_MAIN_URL,
          items: [
            { text: "Apixaban" },
            { text: "Dabigatran" },
            { text: "Edoxaban" },
            { text: "Rivaroxaban" },
            {
              docLink: {
                prefixText: "แบบประเมินการใช้ยากลุ่ม NOAC ",
                docCode: "DUE_NOAC_2568_12_2",
                url: DUE_GOOGLE_DRIVE_MAIN_URL,
              },
            },
            {
              docLink: {
                prefixText: "หนังสือแสดงความยินยอม NOAC ",
                docCode: "Inform_NOAC_2569_01_25",
                url: DUE_GOOGLE_DRIVE_MAIN_URL,
              },
            },
          ],
        },
        {
          subTitle: "2.2 คำแนะนำการเตรียมยาต้านพิษ NOAC",
          googleDriveUrl: DUE_GOOGLE_DRIVE_MAIN_URL,
          subSections: [
            {
              header: "– Specific antidote NOAC",
              items: [
                {
                  docLink: {
                    prefixText: "Idarucizumab (specific antidote of Dabigatran) ",
                    docCode: "Idarucizumab_2569_1_14",
                    url: DUE_GOOGLE_DRIVE_MAIN_URL,
                  },
                },
                {
                  text: "Andexanet alfa (specific antidote of Apixaban) ไม่มีจำหน่ายในไทย",
                },
              ],
            },
            {
              header: "– Non-specific antidote NOAC",
              items: [
                {
                  docLink: {
                    prefixText:
                      "Prothrombin complex concentrate (PROTHROMPLEX) หรือ 4 factor ",
                    docCode: "Prothromplex_500_2569_1_20",
                    url: DUE_GOOGLE_DRIVE_MAIN_URL,
                  },
                },
                {
                  docLink: {
                    prefixText: "Activated prothrombin complex concentrate (FEIBA) ",
                    docCode: "Feiba_2569_1_20",
                    url: DUE_GOOGLE_DRIVE_MAIN_URL,
                  },
                },
                {
                  text: "Prothrombin complex concentrate (PROFILNINE) ไม่มีในบัญชีโรงพยาบาล",
                },
              ],
            },
          ],
        },
      ],
    },

    // ------------------------------------------------------------------------
    // กลุ่มที่ 3: ยาปฏิชีวนะมูลค่าสูง
    // ------------------------------------------------------------------------
    {
      id: "due_atb",
      number: 3,
      title: "3. ยาปฏิชีวนะมูลค่าสูง",
      // ลิงก์ Google Drive ประจำกลุ่มที่ 3
      googleDriveUrl: DUE_GOOGLE_DRIVE_MAIN_URL,
      items: [
        { text: "Piperacilin/Tazobactam" },
        { text: "Meropenem" },
        { text: "Imipenem/Cilastatin" },
        { text: "Sulbactam" },
        { text: "Colistin" },
        { text: "Tigecycline" },
        { text: "Vancomycin" },
        {
          docLink: {
            prefixText: "แบบขออนุมัติใช้ยาต้านจุลชีพชนิดควบคุม ",
            docCode: "DUE_ATB_2568_11_24",
            url: DUE_GOOGLE_DRIVE_MAIN_URL,
          },
        },
      ],
    },

    // ------------------------------------------------------------------------
    // กลุ่มที่ 4: Diabetic mellitus and Obesity
    // ------------------------------------------------------------------------
    {
      id: "due_dm_obesity",
      number: 4,
      title: "4. Diabetic mellitus and Obesity",
      // ลิงก์ Google Drive ประจำกลุ่มที่ 4
      googleDriveUrl: DUE_GOOGLE_DRIVE_MAIN_URL,
      items: [
        {
          docLink: {
            prefixText: "เอกสารแนะนำการใช้ปากกาฉีดยาอินซูลิน my pen ",
            docCode: "MyPen_2568_12_15",
            url: DUE_GOOGLE_DRIVE_MAIN_URL,
          },
        },
        {
          docLink: {
            prefixText:
              "Semaglutide 1 mg/dose (4 mg/3 mL/pen) solution for injection in pre-filled pen (OZEMPIC) ",
            docCode: "Ozempic_2568_12_15",
            url: DUE_GOOGLE_DRIVE_MAIN_URL,
          },
        },
        {
          docLink: {
            prefixText:
              "Semaglutide 1 mg/dose (4 mg/3 mL/pen) solution for injection in flex touch pen (WEGOVY) อัพเดท 10 มี.ค. 69 ",
            docCode: "Wegovy_2596_03_10",
            url: DUE_GOOGLE_DRIVE_MAIN_URL,
          },
        },
        {
          docLink: {
            prefixText:
              "Tirzepatide 5 mg/dose (20 mg/pen) และ 10 mg/dose (40 mg/pen) solution for injection in kwik pen (MOUNJARO) ",
            docCode: "Mounjaro_2568_12_15",
            url: DUE_GOOGLE_DRIVE_MAIN_URL,
          },
        },
      ],
    },

    // ------------------------------------------------------------------------
    // กลุ่มที่ 5: Osteoporosis
    // ------------------------------------------------------------------------
    {
      id: "due_osteoporosis",
      number: 5,
      title: "5. Osteoporosis",
      // ลิงก์ Google Drive ประจำกลุ่มที่ 5
      googleDriveUrl: DUE_GOOGLE_DRIVE_MAIN_URL,
      items: [
        {
          docLink: {
            prefixText: "Teriperatide 600 mcg/2.4 mL pre-filled pen (FORTEO) ",
            docCode: "Teriparatide_2568_12_23",
            url: DUE_GOOGLE_DRIVE_MAIN_URL,
          },
        },
        {
          docLink: {
            prefixText: "เอกสาร กรมบัญชีกลาง ว 548 เบิกจ่ายยาโรคกระดูกพรุน ",
            docCode: "2569_ว_548_Teriparatide",
            url: DUE_GOOGLE_DRIVE_MAIN_URL,
          },
        },
      ],
    },

    // ------------------------------------------------------------------------
    // กลุ่มที่ 6: Levetiracetam injection
    // ------------------------------------------------------------------------
    {
      id: "due_levetiracetam",
      number: 6,
      title: "6. Levetiracetam injection",
      // ลิงก์ Google Drive ประจำกลุ่มที่ 6
      googleDriveUrl: DUE_GOOGLE_DRIVE_MAIN_URL,
      items: [
        {
          docLink: {
            prefixText: "Levetiracetam 500 mg/5 mL injection ",
            docCode: "DUE_Levetiracetam_2569_07_07",
            url: DUE_GOOGLE_DRIVE_MAIN_URL,
          },
        },
      ],
    },
  ],
};

/**
 * ฟังก์ชันสร้างข้อความ Plain Text สำหรับการกดคัดลอก (Copy) ได้สะดวกรวดเร็ว
 */
export const getDuePlainText = (): string => {
  return [
    "รายการยาที่ประเมินความเหมาะสมการใช้",
    "1. แบบประเมินความเหมาะสมการใช้ Albumin",
    "• แบบประเมิน Albumin DUE_Albumin",
    "",
    "2. ยากลุ่ม Non-vitamin K Antagonist Oral Anticoagulants (NOAC)",
    "   2.1 แบบประเมินความเหมาะสมการใช้ยากลุ่ม NOAC",
    "   • Apixaban",
    "   • Dabigatran",
    "   • Edoxaban",
    "   • Rivaroxaban",
    "   • แบบประเมินการใช้ยากลุ่ม NOAC DUE_NOAC_2568_12_2",
    "   • หนังสือแสดงความยินยอม NOAC Inform_NOAC_2569_01_25",
    "",
    "   2.2 คำแนะนำการเตรียมยาต้านพิษ NOAC",
    "   – Specific antidote NOAC",
    "   • Idarucizumab (specific antidote of Dabigatran) Idarucizumab_2569_1_14",
    "   • Andexanet alfa (specific antidote of Apixaban) ไม่มีจำหน่ายในไทย",
    "   – Non-specific antidote NOAC",
    "   • Prothrombin complex concentrate (PROTHROMPLEX) หรือ 4 factor Prothromplex_500_2569_1_20",
    "   • Activated prothrombin complex concentrate (FEIBA) Feiba_2569_1_20",
    "   • Prothrombin complex concentrate (PROFILNINE) ไม่มีในบัญชีโรงพยาบาล",
    "",
    "3. ยาปฏิชีวนะมูลค่าสูง",
    "• Piperacilin/Tazobactam",
    "• Meropenem",
    "• Imipenem/Cilastatin",
    "• Sulbactam",
    "• Colistin",
    "• Tigecycline",
    "• Vancomycin",
    "• แบบขออนุมัติใช้ยาต้านจุลชีพชนิดควบคุม DUE_ATB_2568_11_24",
    "",
    "4. Diabetic mellitus and Obesity",
    "• เอกสารแนะนำการใช้ปากกาฉีดยาอินซูลิน my pen MyPen_2568_12_15",
    "• Semaglutide 1 mg/dose (4 mg/3 mL/pen) solution for injection in pre-filled pen (OZEMPIC) Ozempic_2568_12_15",
    "• Semaglutide 1 mg/dose (4 mg/3 mL/pen) solution for injection in flex touch pen (WEGOVY) อัพเดท 10 มี.ค. 69 Wegovy_2596_03_10",
    "• Tirzepatide 5 mg/dose (20 mg/pen) และ 10 mg/dose (40 mg/pen) solution for injection in kwik pen (MOUNJARO) Mounjaro_2568_12_15",
    "",
    "5. Osteoporosis",
    "• Teriperatide 600 mcg/2.4 mL pre-filled pen (FORTEO) Teriparatide_2568_12_23",
    "• เอกสาร กรมบัญชีกลาง ว 548 เบิกจ่ายยาโรคกระดูกพรุน 2569_ว_548_Teriparatide",
    "",
    "6. Levetiracetam injection",
    "• Levetiracetam 500 mg/5 mL injection DUE_Levetiracetam_2569_07_07"
  ].join("\n");
};

export const DUE_CONTENT_DATA = DUE_DOCUMENT_DIRECTORY_DATA;
