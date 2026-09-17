export interface SubMenuItem {
  id: string;
  title: string;
  badge?: string;
  description?: string;
}

export interface NestedSubGroup {
  id: string;
  title: string;
  items: SubMenuItem[];
}

export interface NavMenuCategory {
  id: string;
  title: string;
  iconName: string;
  items?: SubMenuItem[];
  groups?: NestedSubGroup[];
}

export const NEW_SIDEBAR_MENU: NavMenuCategory[] = [
  {
    id: 'about',
    title: 'เกี่ยวกับกลุ่มงาน',
    iconName: 'Building2',
    items: [
      { id: 'about_vision', title: 'วิสัยทัศน์และพันธกิจ', description: 'วิสัยทัศน์ พันธกิจ ค่านิยม และเป้าหมายการดำเนินงานกลุ่มงานเภสัชกรรม' }
    ]
  },
  {
    id: 'structure',
    title: 'โครงสร้างกลุ่มงาน',
    iconName: 'Network',
    items: [
      { id: 'struct_opd', title: 'งานบริการผู้ป่วยนอก', description: 'การให้บริการจ่ายยาผู้ป่วยนอก ตรวจสอบความถูกต้องและให้คำแนะนำ' },
      { id: 'struct_ipd', title: 'งานบริการผู้ป่วยใน', description: 'การกระจายยาผู้ป่วยใน ระบบ Unit Dose และบริหารยาเฉพาะราย' },
      { id: 'struct_care_opd', title: 'งานการบริบาลทาง เภสัชกรรมผู้ป่วยนอก', description: 'คลินิกเฉพาะทางผู้ป่วยนอก เช่น คลินิกวาร์ฟาริน หอบหืด เบาหวาน' },
      { id: 'struct_care_ipd', title: 'งานการบริบาลทาง เภสัชกรรมผู้ป่วยใน', description: 'เภสัชกรประจำหอผู้ป่วย ติดตามอาการไม่พึงประสงค์และการปรับขนาดยา' },
      { id: 'struct_inventory', title: 'งานบริหารเวชภัณฑ์', description: 'การจัดซื้อ จัดหา จัดเก็บ และควบคุมคลังยาและเวชภัณฑ์' },
      { id: 'struct_chemo', title: 'งานผลิตและเคมีบำบัด', description: 'ห้องผสมยาเคมีบำบัด ยาปราศจากเชื้อ และงานเตรียมยาเฉพาะคราว' },
      { id: 'struct_primary', title: 'งานเภสัชกรรมปฐมภูมิ', description: 'การสนับสนุนและพัฒนาระบบยาในเครือข่าย รพ.สต. และชุมชน' },
      { id: 'struct_dis', title: 'งานบริการเภสัชสนเทศ', description: 'ศูนย์ข้อมูลยา ตอบคำถามและให้ข้อมูลด้านยาแก่บุคลากรทางการแพทย์' }
    ]
  },
  {
    id: 'drug_info',
    title: 'ข้อมูลยา (Drug Information)',
    iconName: 'Pill',
    items: [
      { id: 'di_hospital_list', title: 'บัญชียาโรงพยาบาลหัวหิน', badge: 'บัญชียา' },
      { id: 'di_tmt', title: 'รหัส TMT ยาโรงพยาบาลหัวหิน', badge: 'TMT Code' },
      { id: 'di_subdistrict_list', title: 'บัญชียาโรงพยาบาลส่งเสริมสุขภาพตำบล', badge: 'รพ.สต.' },
      { id: 'di_form_r2', title: 'แบบฟอร์มยาบัญชี R2 (บัญชี จ.2)', badge: 'แบบฟอร์ม' },
      { id: 'di_nlem', title: 'บัญชียาหลักแห่งชาติ', badge: 'NLEM' },
      { id: 'di_ned', title: 'บัญชียานอกบัญชียาหลักแห่งชาติ (NED)', badge: 'NED' },
      { id: 'di_ned_free', title: 'ยานอกบัญชียาหลักแห่งชาติ (NED) ที่จำเป็นต้องใช้ โดยผู้ป่วยไม่ต้องชำระเงิน', badge: 'สิทธิประโยชน์' },
      { id: 'di_annual_list', title: 'รายการยาเข้า-ออกประจำปี', badge: 'ประจำปี' },
      { id: 'di_herbal_list', title: 'บัญชียาหลักแห่งชาติด้านสมุนไพร', badge: 'สมุนไพร' }
    ],
    groups: [
      {
        id: 'group_amr',
        title: 'การจัดการการดื้อยาต้านจุลชีพ (AMR Management)',
        items: [
          { id: 'di_herb_interaction', title: 'อันตรกิริยาระหว่างยาและสมุนไพร' },
          { id: 'di_had', title: 'ยาความเสี่ยงสูง (High Alert Drug)' }
        ]
      },
      {
        id: 'group_warfarin',
        title: 'ยาวาร์ฟาริน (Warfarin)',
        items: [
          { id: 'di_warfarin_calc', title: 'คำนวณขนาดยาวาร์ฟารินเริ่มต้น (Warfarin Initial Dose)' },
          { id: 'di_fatal_interaction', title: 'คู่ยาที่ห้ามใช้ด้วยกัน (Fatal drug-drug interaction)' },
          { id: 'di_special_technique', title: 'ยาเทคนิคพิเศษ' },
          { id: 'di_antibiotic_inj', title: 'ขนาดยาปฏิชีวนะรูปแบบฉีด' },
          { id: 'di_malaria_dose', title: 'ขนาดยาต้านมาลาเรีย' },
          { id: 'di_covid_dose', title: 'ขนาดยาต้านไวรัสโควิด 19' },
          { id: 'di_pediatric_dose', title: 'ขนาดยาที่ใช้ในเด็ก' },
          { id: 'di_pediatric_vaccine', title: 'ตารางการให้วัคซีนในเด็ก' },
          { id: 'di_drug_stability', title: 'ความคงตัวของยาหลังจากเปิดใช้' }
        ]
      },
      {
        id: 'group_cannabis',
        title: 'สารสกัดกัญชาทางการแพทย์',
        items: [
          { id: 'di_rdu', title: 'การใช้ยาอย่างสมเหตุสมผล (Rational Drug Use; RDU)' },
          { id: 'di_geriatric', title: 'การใช้ยาในผู้สูงอายุ' },
          { id: 'di_subdistrict_manual', title: 'คู่มือการใช้ยาในรพ.สต.อำเภอหัวหิน' },
          { id: 'di_dis_service', title: 'เภสัชสนเทศ (Drug Information Service)' }
        ]
      }
    ]
  },
  {
    id: 'policies_guidelines',
    title: 'ระเบียบและแนวทางปฏิบัติงาน',
    iconName: 'FileCheck',
    items: [
      { id: 'pol_policy', title: 'แผนและนโยบายด้านยา' },
      { id: 'pol_mms', title: 'ระบบการจัดการด้านยา' },
      { id: 'pol_rx_error', title: 'แนวทางการเขียนใบสั่งยาเพื่อลดการเกิดความคลาดเคลื่อนทางยา' },
      { id: 'pol_med_rec', title: 'แนวทางการทำ Medication Reconciliation' },
      { id: 'pol_allergy_screen', title: 'แบบคัดกรองประวัติแพ้ยาในอดีต' },
      { id: 'pol_smp', title: 'การติดตามอาการไม่พึงประสงค์ของยาใหม่ (SMP)' },
      { id: 'pol_stat_dispense', title: 'แนวทางการจัดและจ่ายยาด่วน' },
      { id: 'pol_extravasation', title: 'แนวทางการจัดการยารั่วออกนอกเส้นเลือด (Extravasation)' },
      { id: 'pol_stroke_rtpa', title: 'การบริหารจัดการยา rt-PA สำหรับเครือข่าย Stroke fast track' },
      { id: 'pol_pep', title: 'แนวทางการใช้ยาป้องกันการติดเชื้อหลังสัมผัส oPEP และ nPEP' },
      { id: 'pol_gene_test', title: 'งานตรวจยีนแพ้ยา' },
      { id: 'pol_spill_kit', title: 'วิธีการใช้ Spill Kit' },
      { id: 'pol_substock', title: 'การเข้าใช้งานระบบเบิกจ่ายยาคลังย่อย' },
      { id: 'pol_g6pd_tafenoquine', title: 'แนวทางการตรวจ G6PD ก่อนเริ่มยา Tafenoquine' },
      { id: 'pol_morphine_sc', title: 'แนวทางการบริหารยามอร์ฟีนหรือยาอื่นๆใต้ผิวหนังในผู้ป่วยระยะท้าย' },
      { id: 'pol_high_value_fraud', title: 'แนวทางการป้องกันทุจริตยามูลยาสูง' }
    ],
    groups: [
      {
        id: 'group_cpg',
        title: 'แนวทางเวชปฏิบัติ',
        items: [
          { id: 'pol_cpg_malaria', title: 'แนวทางเวชปฏิบัติในการรักษาผู้ป่วยโรคไข้มาลาเรีย' },
          { id: 'pol_cpg_pertussis', title: 'แนวทางปฏิบัติการป้องกัน ควบคุมโรคไอกรน' },
          { id: 'pol_cpg_hpv', title: 'แนวทางการให้บริการวัคซีนป้องกันการติดเชื้อไวรัสเอชพีวี' }
        ]
      }
    ]
  },
  {
    id: 'news_pr',
    title: 'ข่าว/ประชาสัมพันธ์',
    iconName: 'Newspaper',
    items: [
      { id: 'news_journal', title: 'วารสารเภสัชกรรมโรงพยาบาล' },
      { id: 'news_recruitment', title: 'รับสมัครงาน' },
      { id: 'news_pickup_channels', title: 'ช่องทางการเลือกรับยา' }
    ]
  },
  {
    id: 'academic',
    title: 'ผลงานวิชาการ',
    iconName: 'GraduationCap',
    items: [
      { id: 'acad_research', title: 'งานวิจัยและผลงานวิชาการทางเภสัชกรรม' },
      { id: 'acad_innovation', title: 'นวัตกรรมและงานพัฒนาคุณภาพ (CQI)' },
      { id: 'acad_poster', title: 'โปสเตอร์และเอกสารเผยแพร่ทางวิชาการ' }
    ]
  },
  {
    id: 'activities',
    title: 'กิจกรรม',
    iconName: 'CalendarCheck',
    items: [
      { id: 'act_community', title: 'กิจกรรมชุมชนและเครือข่าย รพ.สต.' },
      { id: 'act_training', title: 'การอบรมและพัฒนาวิชาการบุคลากร' },
      { id: 'act_gallery', title: 'ประมวลภาพกิจกรรมกลุ่มงานเภสัชกรรม' }
    ]
  }
];
