export interface SubMenuItem {
  id: string;
  title: string;
  badge?: string;
  description?: string;
  content?: string;
  fileUrl?: string;
  fileName?: string;
  imageUrl?: string;
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

export const STORAGE_KEY_SIDEBAR_MENU = 'huahin_hospital_sidebar_menu_v2';

export const getStoredSidebarMenu = (): NavMenuCategory[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SIDEBAR_MENU);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Failed to parse sidebar menu from localStorage:', err);
  }
  return NEW_SIDEBAR_MENU;
};

export const saveSidebarMenu = (menu: NavMenuCategory[]) => {
  try {
    localStorage.setItem(STORAGE_KEY_SIDEBAR_MENU, JSON.stringify(menu));
    window.dispatchEvent(new CustomEvent('vachira_sidebar_menu_changed', { detail: menu }));
  } catch (err) {
    console.error('Failed to save sidebar menu to localStorage:', err);
  }
};

export const NEW_SIDEBAR_MENU: NavMenuCategory[] = [
  {
    id: 'about',
    title: 'เกี่ยวกับกลุ่มงาน',
    iconName: 'Building2',
    items: [
{
        id: 'about_vision',
        title: 'วิสัยทัศน์และพันธกิจ',
        description: 'วิสัยทัศน์ พันธกิจ ค่านิยม และเป้าหมายการดำเนินงานกลุ่มงานเภสัชกรรม โรงพยาบาลวชิระภูเก็ต',
        imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5nk7-GhnGTiApCURC5DckqXtv_0mzxEC59usc7m3_Dkoh1Wm0qOTWvAlN&s=10', // เช่น '/vachira-banner.jpg' หรือ URL รูปภาพ
        content: `วิสัยทัศน์ (Vision):
"เป็นกลุ่มงานเภสัชกรรมชั้นนำระดับตติยภูมิ มุ่งมั่นสู่ความเป็นเลิศด้านการบริบาลทางเภสัชกรรมและระบบยาที่ปลอดภัย ด้วยเทคโนโลยีทันสมัยและบริการด้วยหัวใจ"

พันธกิจ (Mission):
1. พัฒนาระบบยาให้ได้มาตรฐานคุณภาพและความปลอดภัยในระดับสากล ปราศจากความคลาดเคลื่อนทางยาที่มีผลต่อผู้ป่วย
2. ส่งเสริมการบริบาลทางเภสัชกรรมทั้งผู้ป่วยนอก ผู้ป่วยใน และคลินิกเฉพาะทางอย่างครอบคลุม
3. ส่งเสริมการใช้ยาอย่างสมเหตุสมผล (Rational Drug Use; RDU) ในโรงพยาบาลและเครือข่ายปฐมภูมิ
4. พัฒนาศักยภาพบุคลากร งานวิจัย นวัตกรรม และสารสนเทศทางเภสัชกรรมอย่างต่อเนื่อง`
      }
    ]
  },
  {
    id: 'structure',
    title: 'โครงสร้างกลุ่มงาน',
    iconName: 'Network',
    items: [
      {
        id: 'struct_opd',
        title: 'งานบริการผู้ป่วยนอก',
        description: 'การให้บริการจ่ายยาผู้ป่วยนอก ตรวจสอบความถูกต้องและให้คำแนะนำการใช้ยา',
        content: 'รับผิดชอบงานคัดกรองใบสั่งยา ตรวจสอบอันตรกิริยา จัดและจ่ายยาผู้ป่วยนอก ให้คำปรึกษาการใช้ยาเฉพาะโรค และระบบคิวอัจฉริยะ',
        imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80'
      },
      {
        id: 'struct_ipd',
        title: 'งานบริการผู้ป่วยใน',
        description: 'การกระจายยาผู้ป่วยใน ระบบ Unit Dose และบริหารยาเฉพาะรายสำหรับหอผู้ป่วย',
        content: 'รับผิดชอบระบบกระจายยาวันละมื้อ (Unit Dose System), การตรวจสอบความถูกต้องของคำสั่งใช้ยาแพทย์บนหอผู้ป่วย และการสำรองยาฉุกเฉิน'
      },
      {
        id: 'struct_care_opd',
        title: 'งานการบริบาลทาง เภสัชกรรมผู้ป่วยนอก',
        description: 'คลินิกเฉพาะทางผู้ป่วยนอก เช่น คลินิกวาร์ฟาริน หอบหืด เบาหวาน ความดันโลหิตสูง',
        content: 'การบริบาลทางเภสัชกรรมผู้ป่วยนอก คลินิกโรคเรื้อรัง (NCDs), คลินิกยาต้านการแข็งตัวของเลือด (Warfarin Clinic), คลินิกโรคหืดและปอดอุดกั้นเรื้อรัง (Asthma/COPD Clinic) และคลินิกผู้ติดเชื้อเอชไอวี/วัณโรค'
      },
      {
        id: 'struct_care_ipd',
        title: 'งานการบริบาลทาง เภสัชกรรมผู้ป่วยใน',
        description: 'เภสัชกรประจำหอผู้ป่วย ติดตามอาการไม่พึงประสงค์และการปรับขนาดยาตามการทำงานของไตและตับ',
        content: 'เภสัชกรประจำหอผู้ป่วยวิกฤต (ICU) และหอผู้ป่วยสามัญ ดำเนินการ Medication Reconciliation, ติดตาม Therapeutic Drug Monitoring (TDM) และประเมินความปลอดภัยของผู้ป่วยใน'
      },
      {
        id: 'struct_inventory',
        title: 'งานบริหารเวชภัณฑ์',
        description: 'การจัดซื้อ จัดหา จัดเก็บ และควบคุมคลังยาและเวชภัณฑ์มิใช่ยาตามมาตรฐาน GSP',
        content: 'ควบคุมคลังเวชภัณฑ์ ระบบ Cold Chain Storage บริหารจัดการสต็อกยาให้มีพร้อมใช้ ไม่ขาดคราว และตรวจสอบวันหมดอายุอย่างเคร่งครัด'
      },
      {
        id: 'struct_chemo',
        title: 'งานผลิตและเคมีบำบัด',
        description: 'ห้องผสมยาเคมีบำบัด ยาปราศจากเชื้อ และงานเตรียมยาเฉพาะคราวตามมาตรฐานสากล',
        content: 'ห้องเตรียมผสมยาเคมีบำบัดระบบปิด (Clean Room ISO Class 5) ภายใต้ตู้ชีวนิรภัย BSC Class II Type B2 และงานเตรียมสารอาหารทางหลอดเลือดดำ (TPN)'
      },
      {
        id: 'struct_primary',
        title: 'งานเภสัชกรรมปฐมภูมิ',
        description: 'การสนับสนุนและพัฒนาระบบยาในเครือข่าย รพ.สต. และงานบริบาลเภสัชกรรมชุมชน',
        content: 'นิเทศและสนับสนุนมาตรฐานระบบยา รพ.สต. ในเครือข่ายอำเภอหัวหิน, การเยี่ยมบ้านผู้ป่วยติดเตียง (Home Health Care) และการจัดการยาในชุมชน'
      },
      {
        id: 'struct_dis',
        title: 'งานบริการเภสัชสนเทศ',
        description: 'ศูนย์ข้อมูลยา ตอบคำถามและให้ข้อมูลด้านยาแก่บุคลากรทางการแพทย์และประชาชน',
        content: 'ศูนย์บริการสารสนเทศทางยา (Drug Information Center: DIC) ให้บริการตอบคำถามด้านยา สารพิษ ขนาดยา ความคงตัว อันตรกิริยาระหว่างยา และจัดทำวารสารเภสัชสนเทศ'
      }
    ]
  },
  {
    id: 'drug_info',
    title: 'ข้อมูลยา (Drug Information)',
    iconName: 'Pill',
    items: [
      {
        id: 'di_hospital_list',
        title: 'บัญชียาโรงพยาบาลหัวหิน',
        badge: 'รพ.หัวหิน',
        description: 'รายการยาที่ได้รับการบรรจุในบัญชียาโรงพยาบาลหัวหิน ฉบับปรับปรุงล่าสุด',
        content: 'รายการยาทั้งหมดที่ผ่านการอนุมัติจากคณะกรรมการเภสัชกรรมและการบำบัด (PTC) โรงพยาบาลหัวหิน พร้อมข้อบ่งใช้ ขนาดยา และเงื่อนไขการสั่งใช้'
      },
      {
        id: 'di_tmt',
        title: 'รหัส TMT ยาโรงพยาบาลหัวหิน',
        badge: 'TMT Code',
        description: 'รหัสยามาตรฐานไทย (Thai Medicines Terminology) ประจำโรงพยาบาลหัวหิน',
        content: 'รหัส TMT GPU/TPU สำหรับเชื่อมโยงระบบเบิกจ่าย สปสช., กรมบัญชีกลาง และสำนักงานประกันสังคม'
      },
      {
        id: 'di_subdistrict_list',
        title: 'บัญชียาโรงพยาบาลส่งเสริมสุขภาพตำบล',
        badge: 'รพ.สต.',
        description: 'รายการยาสำหรับโรงพยาบาลส่งเสริมสุขภาพตำบล (รพ.สต.) ในเครือข่ายอำเภอหัวหิน',
        content: 'รายการยาที่ได้รับอนุญาตให้สำรองและใช้ใน รพ.สต. เครือข่ายบริการสุขภาพอำเภอหัวหิน'
      },
      {
        id: 'di_form_r2',
        title: 'แบบฟอร์มยาบัญชี R2 (บัญชี จ.2)',
        badge: 'แบบฟอร์ม',
        description: 'แบบฟอร์มขออนุมัติใช้ยาในบัญชี จ(2) และเกณฑ์การประเมิน',
        content: 'แบบคำขออนุมัติการใช้ยาในบัญชียาหลักแห่งชาติ บัญชี จ(2) ตามโครงการพิเศษของ สปสช. พร้อมแนวทางการส่งเอกสาร'
      },
      {
        id: 'di_nlem',
        title: 'บัญชียาหลักแห่งชาติ',
        badge: 'NLEM',
        description: 'บัญชียาหลักแห่งชาติ ฉบับทางการ กระทรวงสาธารณสุข',
        content: 'ประกาศบัญชียาหลักแห่งชาติ บัญชี ก, ข, ค, ง, จ ตามราชกิจจานุเบกษา'
      },
      {
        id: 'di_ned',
        title: 'บัญชียานอกบัญชียาหลักแห่งชาติ (NED)',
        badge: 'NED',
        description: 'รายการยานอกบัญชียาหลักแห่งชาติและแนวทางขออนุมัติสั่งใช้',
        content: 'เกณฑ์และขั้นตอนการสั่งใช้ยานอกบัญชียาหลักแห่งชาติ (Non-Essential Drugs) ในโรงพยาบาลหัวหิน'
      },
      {
        id: 'di_ned_free',
        title: 'ยานอกบัญชียาหลักแห่งชาติ (NED) ที่จำเป็นต้องใช้ โดยผู้ป่วยไม่ต้องชำระเงิน',
        badge: 'สิทธิประโยชน์',
        description: 'รายการยานอกบัญชีหลักฯ ที่มีเกณฑ์ยกเว้นการชำระเงินตามข้อบ่งชี้พิเศษ',
        content: 'รายการยานอกบัญชียาหลักแห่งชาติที่คณะกรรมการฯ อนุมัติให้ผู้ป่วยสามารถเบิกได้ตามเกณฑ์ข้อบ่งชี้เฉพาะทางการแพทย์'
      },
      {
        id: 'di_annual_list',
        title: 'รายการยาเข้า-ออกประจำปี',
        badge: 'ประจำปี',
        description: 'สรุปรายการยาที่ผ่านการตัดออกหรือนำเข้าใหม่ประจำปีงบประมาณ',
        content: 'มติที่ประชุมคณะกรรมการเภสัชกรรมและการบำบัด (PTC) สรุปรายการยาตัดออกจากบัญชีและยาคัดเลือกเข้าใหม่ประจำปี'
      },
      {
        id: 'di_herbal_list',
        title: 'บัญชียาหลักแห่งชาติด้านสมุนไพร',
        badge: 'สมุนไพร',
        description: 'รายการยาสมุนไพรในบัญชียาหลักแห่งชาติและแนวทางการสั่งใช้',
        content: 'ยาสมุนไพรตำรับ ยาพัฒนาจากสมุนไพร และยาสมุนไพรเดี่ยวในระบบบริการสุขภาพ'
      }
    ],
    groups: [
      {
        id: 'group_amr',
        title: 'การจัดการการดื้อยาต้านจุลชีพ (AMR Management)',
        items: [
          {
            id: 'di_herb_interaction',
            title: 'อันตรกิริยาระหว่างยาและสมุนไพร',
            badge: 'Drug-Herb',
            description: 'คู่มือและตารางตรวจสอบ Drug-Herb Interaction ที่พบบ่อย',
            content: 'ข้อมูลอันตรกิริยาระหว่างยาสมัยใหม่กับสมุนไพร/ผลิตภัณฑ์เสริมอาหาร เช่น ฟ้าทะลายโจร, ขมิ้นชัน, ใบแปะก๊วย, โสม, กระเทียมสกัด'
          },
          {
            id: 'di_had',
            title: 'ยาความเสี่ยงสูง (High Alert Drug)',
            badge: 'HAD',
            description: 'รายการและแนวทางการจัดการยาความเสี่ยงสูง (High Alert Drugs: HAD)',
            content: 'มาตรการความปลอดภัยในการเก็บรักษา จัด จ่าย และบริหารยา HAD เช่น Insulin, Potassium Chloride Inj, Heparin, Warfarin, Methotrexate'
          }
        ]
      },
      {
        id: 'group_warfarin',
        title: 'ยาวาร์ฟาริน (Warfarin)',
        items: [
          {
            id: 'di_warfarin_calc',
            title: 'คำนวณขนาดยาวาร์ฟารินเริ่มต้น (Warfarin Initial Dose)',
            badge: 'เครื่องมือคำนวณ',
            description: 'แนวทางการคำนวณและปรับขนาดยา Warfarin ตามค่า INR',
            content: 'โปรโตคอลการเริ่มยาวาร์ฟาริน การปรับขนาดยาตามค่า INR และเป้าหมาย INR ในแต่ละข้อบ่งชี้'
          },
          {
            id: 'di_fatal_interaction',
            title: 'คู่ยาที่ห้ามใช้ด้วยกัน (Fatal drug-drug interaction)',
            badge: 'อันตรายร้ายแรง',
            description: 'รายการคู่ยาที่เกิดปฏิกิริยารุนแรงถึงชีวิต ห้ามสั่งใช้ร่วมกันเด็ดขาด',
            content: 'ตาราง Contraindicated Drug Pairs เช่น ยาต้านเชื้อรากลุ่ม Azoles กับยาบางชนิด, SSRIs กับ MAOIs, และระบบเตือนใน HIS'
          },
          {
            id: 'di_special_technique',
            title: 'ยาเทคนิคพิเศษ',
            badge: 'คู่มือ',
            description: 'วิดีโอและคู่มือการใช้อุปกรณ์ยาเทคนิคพิเศษ (Inhalers, Insulin pen, Eye drops)',
            content: 'ขั้นตอนการใช้งานยาพ่นสูดชนิด MDI, DPI, Respimat, ปากกาฉีดอินซูลิน และยาหยอดตาอย่างถูกวิธี'
          },
          {
            id: 'di_antibiotic_inj',
            title: 'ขนาดยาปฏิชีวนะรูปแบบฉีด',
            badge: 'Dosage',
            description: 'ตารางขนาดยาปฏิชีวนะฉีดและการปรับตาม Renal function',
            content: 'คู่มือขนาดยาปฏิชีวนะรูปแบบฉีด ตัวทำละลาย ความเข้มข้นสูงสุด อัตราการให้ และการปรับขนาดยาตาม eGFR/CrCl'
          },
          {
            id: 'di_malaria_dose',
            title: 'ขนาดยาต้านมาลาเรีย',
            badge: 'Malaria',
            description: 'แนวทางการรักษาและขนาดยาต้านมาลาเรียสายพันธุ์ต่างๆ',
            content: 'ขนาดยา Artesunate, Artemether/Lumefantrine, Chloroquine, Primaquine, Tafenoquine'
          },
          {
            id: 'di_covid_dose',
            title: 'ขนาดยาต้านไวรัสโควิด 19',
            badge: 'COVID-19',
            description: 'แนวทางการใช้ยาต้านไวรัสโควิด-19 (Paxlovid, Remdesivir, Molnupiravir)',
            content: 'เกณฑ์การคัดเลือกผู้ป่วย ข้อห้ามใช้ และ Drug Interaction ของยา Paxlovid (Nirmatrelvir/Ritonavir)'
          },
          {
            id: 'di_pediatric_dose',
            title: 'ขนาดยาที่ใช้ในเด็ก',
            badge: 'Pediatric',
            description: 'ตารางคำนวณขนาดยาสำหรับผู้ป่วยเด็กตามน้ำหนักตัว (mg/kg/dose)',
            content: 'คู่มือขนาดยาที่ใช้บ่อยในเด็ก ยาลดไข้ ยาปฏิชีวนะ และยากลุ่มทางเดินหายใจ'
          },
          {
            id: 'di_pediatric_vaccine',
            title: 'ตารางการให้วัคซีนในเด็ก',
            badge: 'EPI',
            description: 'กำหนดการสร้างเสริมภูมิคุ้มกันโรค (EPI) ของกระทรวงสาธารณสุข',
            content: 'ตารางการให้วัคซีนพื้นฐานและวัคซีนเสริมในเด็กไทยตั้งแต่แรกเกิดถึงอายุ 12 ปี'
          },
          {
            id: 'di_drug_stability',
            title: 'ความคงตัวของยาหลังจากเปิดใช้',
            badge: 'Stability',
            description: 'ตารางอายุยาและความคงตัวภายหลังเปิดใช้ (Beyond-Use Date: BUD)',
            content: 'อายุการใช้งานของยาหยอดตา ยาน้ำแขวนตะกอน ยาฉีดอินซูลิน และยาเตรียมเฉพาะคราวหลังเปิดใช้'
          }
        ]
      },
      {
        id: 'group_cannabis',
        title: 'สารสกัดกัญชาทางการแพทย์',
        items: [
          {
            id: 'di_rdu',
            title: 'การใช้ยาอย่างสมเหตุสมผล (Rational Drug Use; RDU)',
            badge: 'RDU',
            description: 'เกณฑ์และแนวทางปฏิบัติตามมาตรฐานโรงพยาบาลส่งเสริมการใช้ยาอย่างสมเหตุสมผล',
            content: 'เกณฑ์ชี้วัด RDU ขั้นที่ 1-3, การใช้ยาปฏิชีวนะใน 3 โรค, การใช้ยาในสตรีมีครรภ์ และระบบติดตามผล'
          },
          {
            id: 'di_geriatric',
            title: 'การใช้ยาในผู้สูงอายุ',
            badge: 'Geriatric',
            description: 'หลักการใช้ยาในผู้สูงอายุ Beers Criteria และข้อควรระวัง',
            content: 'การประเมิน Polypharmacy, การใช้ยาที่ควรหลีกเลี่ยงในผู้สูงอายุ (Beers Criteria / STOPP criteria)'
          },
          {
            id: 'di_subdistrict_manual',
            title: 'คู่มือการใช้ยาในรพ.สต.อำเภอหัวหิน',
            badge: 'รพ.สต.หัวหิน',
            description: 'คู่มือแนวทางการใช้ยาสำหรับเจ้าหน้าที่สาธารณสุขใน รพ.สต. เครือข่าย',
            content: 'คู่มือการบริหารจัดการยา การให้คำแนะนำ และการส่งต่อผู้ป่วยที่มีปัญหาจากการใช้ยาใน รพ.สต. อำเภอหัวหิน'
          },
          {
            id: 'di_dis_service',
            title: 'เภสัชสนเทศ (Drug Information Service)',
            badge: 'DIS/DIC',
            description: 'ช่องทางการติดต่อและขอคำปรึกษาจากศูนย์เภสัชสนเทศ',
            content: 'บริการตอบคำถามด้านยา ติดต่อกลุ่มงานเภสัชกรรม โรงพยาบาลหัวหิน โทรศัพท์สายใน หรือส่งคำถามผ่านระบบออนไลน์'
          }
        ]
      }
    ]
  },
  {
    id: 'policies_guidelines',
    title: 'ระเบียบและแนวทางปฏิบัติงาน',
    iconName: 'FileCheck',
    items: [
      {
        id: 'pol_policy',
        title: 'แผนและนโยบายด้านยา',
        description: 'นโยบายด้านยาและเวชภัณฑ์ โรงพยาบาลหัวหิน',
        content: 'นโยบายการจัดซื้อ จัดหา บริหารจัดการยา และการควบคุมคุณภาพระบบยาโรงพยาบาล'
      },
      {
        id: 'pol_mms',
        title: 'ระบบการจัดการด้านยา',
        description: 'แนวทาง Medication Management System (MMS) ตามมาตรฐาน HA',
        content: 'ระบบการจัดการด้านยา 7 ขั้นตอน (Selection, Procurement, Storage, Ordering/Transcribing, Preparing/Dispensing, Administration, Monitoring)'
      },
      {
        id: 'pol_rx_error',
        title: 'แนวทางการเขียนใบสั่งยาเพื่อลดการเกิดความคลาดเคลื่อนทางยา',
        description: 'แนวทางการสั่งใช้ยาที่ปลอดภัย คำย่อที่ห้ามใช้ (Do Not Use Abbreviations)',
        content: 'ข้อกำหนดการเขียนใบสั่งยา รายการตัวย่ออันตรายที่ห้ามใช้เด็ดขาด เพื่อป้องกันความคลาดเคลื่อนในการสั่งใช้ยา'
      },
      {
        id: 'pol_med_rec',
        title: 'แนวทางการทำ Medication Reconciliation',
        description: 'ขั้นตอนการเทียบเคียงประวัติการใช้ยาผู้ป่วยเมื่อรับไว้ในโรงพยาบาล ย้ายหอผู้ป่วย และจำหน่าย',
        content: 'แนวทางปฏิบัติการทำ Medication Reconciliation (Med Rec) ครอบคลุมจุดรับผู้ป่วยใหม่ หอผู้ป่วย และจุดจำหน่าย'
      },
      {
        id: 'pol_allergy_screen',
        title: 'แบบคัดกรองประวัติแพ้ยาในอดีต',
        description: 'แบบประเมินและแนวทางการซักประวัติการแพ้ยาและบันทึกลงระบบ',
        content: 'ขั้นตอนการซักประวัติ การประเมินความน่าจะเป็นด้วย Naranjo Algorithm และการออกบัตรแพ้ยา'
      },
      {
        id: 'pol_smp',
        title: 'การติดตามอาการไม่พึงประสงค์ของยาใหม่ (SMP)',
        description: 'Safety Monitoring Program (SMP) สำหรับยาที่ขึ้นทะเบียนใหม่',
        content: 'แนวทางการติดตามความปลอดภัยและการรายงานอาการไม่พึงประสงค์ของยาที่อยู่ภายใต้โครงการ SMP ตามระเบียบ อย.'
      },
      {
        id: 'pol_stat_dispense',
        title: 'แนวทางการจัดและจ่ายยาด่วน',
        description: 'เกณฑ์และขั้นตอนการสั่ง จ่าย และบริหารยาด่วน (Stat dose)',
        content: 'แนวปฏิบัติการจ่ายยาด่วนภายในระยะเวลาที่กำหนดสำหรับหอผู้ป่วยและห้องฉุกเฉิน'
      },
      {
        id: 'pol_extravasation',
        title: 'แนวทางการจัดการยารั่วออกนอกเส้นเลือด (Extravasation)',
        description: 'การปฐมพยาบาล ยาต้านพิษ และแนวทางดูแลเมื่อเกิด Extravasation',
        content: 'แนวทางการจัดการ Vesicant and Irritant drugs รั่วซึมออกนอกหลอดเลือดดำ และการใช้ Antidote เฉพาะ'
      },
      {
        id: 'pol_stroke_rtpa',
        title: 'การบริหารจัดการยา rt-PA สำหรับเครือข่าย Stroke fast track',
        description: 'แนวทางการเตรียมและบริหารยา Alteplase (rt-PA) ในผู้ป่วย Stroke',
        content: 'แนวทางเตรียมและให้ยา Alteplase ในผู้ป่วยหลอดเลือดสมองอุดตันเฉียบพลันตามเกณฑ์เวลา Door-to-Needle'
      },
      {
        id: 'pol_pep',
        title: 'แนวทางการใช้ยาป้องกันการติดเชื้อหลังสัมผัส oPEP และ nPEP',
        description: 'Post-Exposure Prophylaxis สำหรับบุคลากรทางการแพทย์และประชาชน',
        content: 'แนวทางการประเมินความเสี่ยง การเริ่มยาต้านไวรัสภายใน 72 ชั่วโมง และการติดตามผลการตรวจเลือด'
      },
      {
        id: 'pol_gene_test',
        title: 'งานตรวจยีนแพ้ยา',
        description: 'การตรวจ HLA-B*1502, HLA-B*5801 ก่อนเริ่มยาเสี่ยงสูง',
        content: 'แนวทางการตรวจสารพันธุกรรมเพื่อป้องกันการแพ้ยารุนแรง (SCARs) เช่น Carbamazepine และ Allopurinol'
      },
      {
        id: 'pol_spill_kit',
        title: 'วิธีการใช้ Spill Kit',
        description: 'ขั้นตอนการทำความสะอาดและจัดการสารเคมี/ยาเคมีบำบัดหกรั่วไหล',
        content: 'คู่มือการปฏิบัติเมื่อเกิดเหตุยาเคมีบำบัดหรือสารเคมีอันตรายหกหล่น การใช้อุปกรณ์คุ้มครองส่วนบุคคล และการทิ้งขยะอันตราย'
      },
      {
        id: 'pol_substock',
        title: 'การเข้าใช้งานระบบเบิกจ่ายยาคลังย่อย',
        description: 'คู่มือการเบิกจ่ายเวชภัณฑ์ผ่านระบบสารสนเทศคลังย่อยหอผู้ป่วย',
        content: 'ขั้นตอนการบันทึกเบิกยา การตรวจนับสต็อก และการขอคืนยาเข้าคลังใหญ่'
      },
      {
        id: 'pol_g6pd_tafenoquine',
        title: 'แนวทางการตรวจ G6PD ก่อนเริ่มยา Tafenoquine',
        description: 'เกณฑ์การตรวจระดับเอนไซม์ G6PD เพื่อป้องกันภาวะเม็ดเลือดแดงแตกเฉียบพลัน',
        content: 'แนวทางการตรวจคัดกรองและประเมินระดับ G6PD activity ก่อนจ่ายยา Tafenoquine สำหรับรักษามาลาเรีย Vivax'
      },
      {
        id: 'pol_morphine_sc',
        title: 'แนวทางการบริหารยามอร์ฟีนหรือยาอื่นๆใต้ผิวหนังในผู้ป่วยระยะท้าย',
        description: 'การให้ยา Subcutaneous Infusion ในงาน Palliative Care',
        content: 'คู่มือการคำนวณขนาดยา การเตรียมอุปกรณ์ และการให้ยาแก้ปวดใต้ผิวหนังแบบต่อเนื่องสำหรับผู้ป่วยประคับประคอง'
      },
      {
        id: 'pol_high_value_fraud',
        title: 'แนวทางการป้องกันทุจริตยามูลยาสูง',
        description: 'มาตรการตรวจสอบ ควบคุม และกำกับดูแลการสั่งใช้ยาที่มีมูลค่าสูง',
        content: 'ระบบ Audit Trail และการตรวจทานใบสั่งยามูลค่าสูงเพื่อความโปร่งใสและคุ้มค่า'
      }
    ],
    groups: [
      {
        id: 'group_cpg',
        title: 'แนวทางเวชปฏิบัติ',
        items: [
          {
            id: 'pol_cpg_malaria',
            title: 'แนวทางเวชปฏิบัติในการรักษาผู้ป่วยโรคไข้มาลาเรีย',
            description: 'Clinical Practice Guideline สำหรับการวินิจฉัยและรักษาโรคไข้มาลาเรีย',
            content: 'แนวทางการวินิจฉัย รักษา ติดตามอาการ และการเลือกใช้สูตรยาต้านมาลาเรียตามชนิดของเชื้อ'
          },
          {
            id: 'pol_cpg_pertussis',
            title: 'แนวทางปฏิบัติการป้องกัน ควบคุมโรคไอกรน',
            description: 'แนวทางเฝ้าระวัง สอบสวน และให้ยารักษา/ป้องกันโรคไอกรน (Pertussis)',
            content: 'มาตรการควบคุมการระบาด การให้ยาปฏิชีวนะเพื่อการรักษาและป้องกันผู้สัมผัสใกล้ชิด'
          },
          {
            id: 'pol_cpg_hpv',
            title: 'แนวทางการให้บริการวัคซีนป้องกันการติดเชื้อไวรัสเอชพีวี',
            description: 'แนวทางการฉีดวัคซีน HPV ในกลุ่มเป้าหมาย',
            content: 'กลุ่มเป้าหมาย ข้อบ่งใช้ ตารางการฉีด และข้อห้ามใช้ของวัคซีนป้องกันมะเร็งปากมดลูก (HPV Vaccine)'
          }
        ]
      }
    ]
  },
  {
    id: 'news_pr',
    title: 'ข่าว/ประชาสัมพันธ์',
    iconName: 'Newspaper',
    items: [
      {
        id: 'news_journal',
        title: 'วารสารเภสัชกรรมโรงพยาบาล',
        description: 'วารสารข่าวสารและสาระน่ารู้ทางเภสัชกรรมประจำงวด',
        content: 'รวบรวมบทความวิชาการ ข่าวสารเตือนภัยด้านยา และข่าวสารความเคลื่อนไหวของกลุ่มงานเภสัชกรรม'
      },
      {
        id: 'news_recruitment',
        title: 'รับสมัครงาน',
        description: 'ประกาศรับสมัครเภสัชกรและเจ้าพนักงานเภสัชกรรม',
        content: 'ประกาศตำแหน่งงานว่าง คุณสมบัติ และรายละเอียดการรับสมัครบุคลากรเข้าปฏิบัติงานในกลุ่มงานเภสัชกรรม'
      },
      {
        id: 'news_pickup_channels',
        title: 'ช่องทางการเลือกรับยา',
        description: 'ทางเลือกการรับยา เช่น รับยาที่ห้องยา, รับยาที่ร้านยาใกล้บ้าน, รับยาทางไปรษณีย์',
        content: 'บริการลดความแออัดในการรับยา: 1. รับยาด้วยตนเอง 2. รับยาผ่านไปรษณีย์ส่งตรงถึงบ้าน 3. โครงการรับยาที่ร้านยาชุมชนอบอุ่นใกล้บ้าน'
      }
    ]
  },
  {
    id: 'academic',
    title: 'ผลงานวิชาการ',
    iconName: 'GraduationCap',
    items: [
      {
        id: 'acad_research',
        title: 'งานวิจัยและผลงานวิชาการทางเภสัชกรรม',
        description: 'งานวิจัยทางคลินิก การประเมินผลการใช้ยา และงานวิจัยระบบสุขภาพ',
        content: 'รวบรวมรายงานวิจัย โครงการศึกษา และบทคัดย่อผลงานวิชาการของเภสัชกรโรงพยาบาลหัวหิน'
      },
      {
        id: 'acad_innovation',
        title: 'นวัตกรรมและงานพัฒนาคุณภาพ (CQI)',
        description: 'นวัตกรรมสิ่งประดิษฐ์และโครงการพัฒนาคุณภาพงานบริการทางเภสัชกรรม',
        content: 'โครงการ Continuous Quality Improvement (CQI) และนวัตกรรมเพื่อความปลอดภัยของผู้ป่วย'
      },
      {
        id: 'acad_poster',
        title: 'โปสเตอร์และเอกสารเผยแพร่ทางวิชาการ',
        description: 'โปสเตอร์วิชาการที่นำเสนอในการประชุมระดับชาติและนานาชาติ',
        content: 'เอกสารและโปสเตอร์เผยแพร่ความรู้ทางเภสัชกรรมสำหรับบุคลากรสาธารณสุข'
      }
    ]
  },
  {
    id: 'activities',
    title: 'กิจกรรม',
    iconName: 'CalendarCheck',
    items: [
      {
        id: 'act_community',
        title: 'กิจกรรมชุมชนและเครือข่าย รพ.สต.',
        description: 'กิจกรรมส่งเสริมสุขภาพ การคัดกรอง และการให้ความรู้เรื่องยาในชุมชน',
        content: 'ภาพและรายงานกิจกรรมลงพื้นที่ชุมชน รณรงค์การใช้ยาอย่างถูกต้อง และการทำงานร่วมกับ อสม.'
      },
      {
        id: 'act_training',
        title: 'การอบรมและพัฒนาวิชาการบุคลากร',
        description: 'การจัดประชุมวิชาการ อบรมเชิงปฏิบัติการ และการศึกษาต่อเนื่อง',
        content: 'โครงการอบรมเพิ่มพูนทักษะวิชาชีพเภสัชกรรม และการให้ความรู้เรื่องยาแก่ทีมสหสาขาวิชาชีพ'
      },
      {
        id: 'act_gallery',
        title: 'ประมวลภาพกิจกรรมกลุ่มงานเภสัชกรรม',
        description: 'ภาพกิจกรรมภายในหน่วยงาน กิจกรรมสานสัมพันธ์ และภาพบรรยากาศการทำงาน',
        content: 'อัลบั้มภาพกิจกรรม ประเพณี และกิจกรรมสร้างเสริมความสามัคคีของบุคลากรกลุ่มงานเภสัชกรรม'
      }
    ]
  }
];
