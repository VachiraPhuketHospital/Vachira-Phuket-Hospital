import React, { useState, useEffect } from 'react';
import {
  FolderTree,
  Plus,
  Trash2,
  Edit,
  Save,
  X,
  FileText,
  Search,
  Upload,
  Download,
  AlertCircle,
  CheckCircle,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  FileUp,
  RotateCcw,
  Sparkles,
  FolderPlus,
  Image as ImageIcon,
} from 'lucide-react';
import { compressImageFile } from '../../utils/fileHelpers';
import {
  NEW_SIDEBAR_MENU,
  getStoredSidebarMenu,
  saveSidebarMenu,
  NavMenuCategory,
  SubMenuItem,
  NestedSubGroup,
} from '../../data/sidebarMenuData';

const PRESET_TOPIC_IMAGES = [
  { label: 'ห้องจ่ายยาผู้ป่วยนอก OPD', url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80' },
  { label: 'ห้องยาหลักและการคัดกรองใบสั่งยา', url: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80' },
  { label: 'เภสัชกรให้คำปรึกษาการใช้ยา', url: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80' },
  { label: 'คลังเวชภัณฑ์และการจัดเก็บยา', url: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=1200&q=80' },
  { label: 'งานผลิตและผสมยาเฉพาะคราว', url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80' },
];

export const AdminMenuTopicsManager: React.FC = () => {
  const [categories, setCategories] = useState<NavMenuCategory[]>(() => getStoredSidebarMenu());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<{
    catId: string;
    groupId?: string;
    item: SubMenuItem;
  } | null>(null);

  // Modal / Form state for Add/Edit Item
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<{
    catId: string;
    groupId?: string;
    itemId: string;
    title: string;
    badge: string;
    description: string;
    content: string;
    imageUrl: string;
    fileName: string;
    fileUrl: string;
    isNew: boolean;
  }>({
    catId: 'about',
    groupId: undefined,
    itemId: '',
    title: '',
    badge: '',
    description: '',
    content: '',
    imageUrl: '',
    fileName: '',
    fileUrl: '',
    isNew: false,
  });

  // Modal state for Subgroup (Add / Edit)
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [groupForm, setGroupForm] = useState<{
    catId: string;
    groupId: string;
    title: string;
    isNew: boolean;
  }>({
    catId: 'drug_info',
    groupId: '',
    title: '',
    isNew: true,
  });

  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleSaveToStorage = (updatedCategories: NavMenuCategory[]) => {
    setCategories(updatedCategories);
    saveSidebarMenu(updatedCategories);
  };

  // Open Edit Form for an item
  const handleOpenEdit = (catId: string, item: SubMenuItem, groupId?: string) => {
    setEditForm({
      catId,
      groupId,
      itemId: item.id,
      title: item.title,
      badge: item.badge || '',
      description: item.description || '',
      content: item.content || '',
      imageUrl: item.imageUrl || '',
      fileName: item.fileName || '',
      fileUrl: item.fileUrl || '',
      isNew: false,
    });
    setIsEditing(true);
  };

  // Open Add Form for an item
  const handleOpenAdd = (targetCatId: string, targetGroupId?: string) => {
    const generatedId = `custom_${Date.now()}`;
    setEditForm({
      catId: targetCatId,
      groupId: targetGroupId,
      itemId: generatedId,
      title: '',
      badge: '',
      description: '',
      content: '',
      imageUrl: '',
      fileName: '',
      fileUrl: '',
      isNew: true,
    });
    setIsEditing(true);
  };

  // Open Add Subgroup Modal
  const handleOpenAddGroup = (catId: string) => {
    setGroupForm({
      catId,
      groupId: `group_${Date.now()}`,
      title: '',
      isNew: true,
    });
    setIsGroupModalOpen(true);
  };

  // Open Edit Subgroup Modal
  const handleOpenEditGroup = (catId: string, group: NestedSubGroup) => {
    setGroupForm({
      catId,
      groupId: group.id,
      title: group.title,
      isNew: false,
    });
    setIsGroupModalOpen(true);
  };

  // Delete Subgroup
  const handleDeleteGroup = (catId: string, groupId: string, groupTitle: string) => {
    if (!window.confirm(`ยืนยันการลบกลุ่มย่อย "${groupTitle}" หรือไม่? (หัวข้อทั้งหมดภายในกลุ่มนี้จะถูกลบออกด้วย)`)) {
      return;
    }

    const updated = categories.map((cat) => {
      if (cat.id !== catId) return cat;
      return {
        ...cat,
        groups: (cat.groups || []).filter((g) => g.id !== groupId),
      };
    });

    handleSaveToStorage(updated);
    setNotification({ type: 'success', message: `ลบกลุ่มย่อย "${groupTitle}" เรียบร้อยแล้ว` });
  };

  // Submit Subgroup Modal Form
  const handleGroupFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupForm.title.trim()) {
      setNotification({ type: 'error', message: 'กรุณาระบุชื่อกลุ่มย่อย' });
      return;
    }

    let updated: NavMenuCategory[];
    if (groupForm.isNew) {
      updated = categories.map((cat) => {
        if (cat.id !== groupForm.catId) return cat;
        const newGroup: NestedSubGroup = {
          id: groupForm.groupId,
          title: groupForm.title.trim(),
          items: [],
        };
        return {
          ...cat,
          groups: [...(cat.groups || []), newGroup],
        };
      });
      setNotification({ type: 'success', message: `เพิ่มกลุ่มย่อย "${groupForm.title.trim()}" สำเร็จแล้ว` });
    } else {
      updated = categories.map((cat) => {
        if (cat.id !== groupForm.catId) return cat;
        return {
          ...cat,
          groups: (cat.groups || []).map((g) =>
            g.id === groupForm.groupId ? { ...g, title: groupForm.title.trim() } : g
          ),
        };
      });
      setNotification({ type: 'success', message: `แก้ไขชื่อกลุ่มย่อยเป็น "${groupForm.title.trim()}" สำเร็จแล้ว` });
    }

    handleSaveToStorage(updated);
    setIsGroupModalOpen(false);
  };

  // Delete Item
  const handleDeleteItem = (catId: string, itemId: string, itemTitle: string, groupId?: string) => {
    if (!window.confirm(`ยืนยันการลบหัวข้อ "${itemTitle}" หรือไม่? ข้อมูลจะถูกลบออกจากเมนูและหน้าเว็บ`)) {
      return;
    }

    const updated = categories.map((cat) => {
      if (cat.id !== catId) return cat;

      if (groupId && cat.groups) {
        return {
          ...cat,
          groups: cat.groups.map((grp) => {
            if (grp.id !== groupId) return grp;
            return {
              ...grp,
              items: grp.items.filter((i) => i.id !== itemId),
            };
          }),
        };
      }

      return {
        ...cat,
        items: (cat.items || []).filter((i) => i.id !== itemId),
      };
    });

    handleSaveToStorage(updated);
    if (selectedItem?.item.id === itemId) {
      setSelectedItem(null);
    }
    setNotification({ type: 'success', message: `ลบหัวข้อ "${itemTitle}" เรียบร้อยแล้ว` });
  };

  // Handle Form Submit for Items
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm.title.trim()) {
      setNotification({ type: 'error', message: 'กรุณาระบุชื่อหัวข้อ' });
      return;
    }

    const itemData: SubMenuItem = {
      id: editForm.itemId,
      title: editForm.title.trim(),
      badge: editForm.badge.trim() || undefined,
      description: editForm.description.trim() || undefined,
      content: editForm.content.trim() || undefined,
      imageUrl: editForm.imageUrl.trim() || undefined,
      fileName: editForm.fileName.trim() || undefined,
      fileUrl: editForm.fileUrl.trim() || undefined,
    };

    let updated: NavMenuCategory[];

    if (editForm.isNew) {
      // ADD NEW
      updated = categories.map((cat) => {
        if (cat.id !== editForm.catId) return cat;

        if (editForm.groupId && cat.groups) {
          return {
            ...cat,
            groups: cat.groups.map((grp) => {
              if (grp.id !== editForm.groupId) return grp;
              return {
                ...grp,
                items: [...grp.items, itemData],
              };
            }),
          };
        }

        return {
          ...cat,
          items: [...(cat.items || []), itemData],
        };
      });
      setNotification({ type: 'success', message: `เพิ่มหัวข้อใหม่ "${itemData.title}" สำเร็จแล้ว` });
    } else {
      // EDIT EXISTING
      updated = categories.map((cat) => {
        if (cat.id !== editForm.catId) return cat;

        if (editForm.groupId && cat.groups) {
          return {
            ...cat,
            groups: cat.groups.map((grp) => {
              if (grp.id !== editForm.groupId) return grp;
              return {
                ...grp,
                items: grp.items.map((i) => (i.id === itemData.id ? itemData : i)),
              };
            }),
          };
        }

        return {
          ...cat,
          items: (cat.items || []).map((i) => (i.id === itemData.id ? itemData : i)),
        };
      });
      setNotification({ type: 'success', message: `บันทึกการแก้ไข "${itemData.title}" สำเร็จแล้ว` });
    }

    handleSaveToStorage(updated);
    setIsEditing(false);
    setSelectedItem({
      catId: editForm.catId,
      groupId: editForm.groupId,
      item: itemData,
    });
  };

  // Handle File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('ไฟล์มีขนาดเกิน 5MB กรุณาเลือกไฟล์ขนาดไม่เกิน 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setEditForm((prev) => ({
        ...prev,
        fileName: file.name,
        fileUrl: dataUrl,
      }));
    };
    reader.readAsDataURL(file);
  };

  // Handle Image Upload with automatic compression
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const compressed = await compressImageFile(file, 1200, 0.75);
      setEditForm((prev) => ({
        ...prev,
        imageUrl: compressed,
      }));
      setNotification({ type: 'success', message: `อัปโหลดรูปภาพ "${file.name}" เรียบร้อยแล้ว` });
    } catch (err) {
      alert('ไม่สามารถประมวลผลรูปภาพได้ กรุณาเลือกไฟล์ภาพขนาดไม่เกิน 5MB');
    }
  };

  // Reset to default
  const handleResetToDefault = () => {
    if (
      window.confirm(
        'คุณแน่ใจหรือไม่ว่าต้องการรีเซ็ตหัวข้อเมนูทั้งหมดกลับเป็นค่าเริ่มต้นของโรงพยาบาลหัวหิน? การเปลี่ยนแปลงที่บันทึกไว้จะถูกรีเซ็ต'
      )
    ) {
      handleSaveToStorage(NEW_SIDEBAR_MENU);
      setNotification({ type: 'success', message: 'รีเซ็ตข้อมูลเมนูกลับเป็นค่าเริ่มต้นเรียบร้อยแล้ว' });
    }
  };

  // Calculate stats
  const totalTopicsCount = categories.reduce((total, cat) => {
    const directCount = cat.items?.length || 0;
    const groupCount = cat.groups?.reduce((acc, g) => acc + g.items.length, 0) || 0;
    return total + directCount + groupCount;
  }, 0);

  // Filter categories and items based on search query
  const filteredCategories = categories.map((cat) => {
    if (!searchQuery.trim()) return cat;
    const q = searchQuery.toLowerCase();

    const filteredDirect = cat.items?.filter(
      (i) => i.title.toLowerCase().includes(q) || (i.description && i.description.toLowerCase().includes(q))
    );

    const filteredGroups = cat.groups
      ?.map((grp) => ({
        ...grp,
        items: grp.items.filter(
          (i) => i.title.toLowerCase().includes(q) || (i.description && i.description.toLowerCase().includes(q))
        ),
      }))
      .filter((grp) => grp.items.length > 0 || grp.title.toLowerCase().includes(q));

    return {
      ...cat,
      items: filteredDirect,
      groups: filteredGroups,
    };
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`p-4 rounded-xl border flex items-center gap-3 transition-all animate-in slide-in-from-top-2 ${
            notification.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          )}
          <span className="text-sm font-semibold">{notification.message}</span>
        </div>
      )}

      {/* Header section */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              Menu & Content CMS
            </span>
            <span className="text-xs text-slate-500">รวมทั้งหมด {totalTopicsCount} หัวข้อ</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <FolderTree className="w-6 h-6 text-emerald-600" />
            จัดการหัวข้อและเนื้อหาเมนู (Sidebar Content Manager)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            แอดมินสามารถเพิ่มหัวข้อใหม่ แก้ไขชื่อ/รายละเอียด/เนื้อหาบทความ อัปโหลดเอกสารแนบ จัดการกลุ่มย่อย หรือลบหัวข้อที่ไม่ต้องการได้ทันที
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetToDefault}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold transition-colors"
            title="รีเซ็ตกลับเป็นค่าเริ่มต้นของระบบ"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>คืนค่าเริ่มต้น</span>
          </button>
          <button
            onClick={() => handleOpenAdd(categories[0]?.id || 'about')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>เพิ่มหัวข้อใหม่</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="ค้นหาตามชื่อหัวข้อ หรือคำอธิบาย..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Main Content Area: Category List with Items */}
      <div className="space-y-6">
        {filteredCategories.map((category) => {
          const directCount = category.items?.length || 0;
          const groupCount = category.groups?.reduce((sum, g) => sum + g.items.length, 0) || 0;
          const catTotal = directCount + groupCount;

          return (
            <div
              key={category.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden"
            >
              {/* Category Header */}
              <div className="p-4 sm:p-5 bg-slate-50/80 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                    {category.title.substring(0, 1)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{category.title}</h3>
                    <span className="text-xs text-slate-500">ID: {category.id} • {catTotal} หัวข้อย่อย</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenAddGroup(category.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-300 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold transition-colors shadow-2xs"
                    title="เพิ่มกลุ่มย่อยใหม่ภายใต้หมวดนี้"
                  >
                    <FolderPlus className="w-3.5 h-3.5 text-emerald-700" />
                    <span>เพิ่มกลุ่มย่อย</span>
                  </button>
                  <button
                    onClick={() => handleOpenAdd(category.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-emerald-500 hover:text-emerald-700 text-xs font-semibold text-slate-700 transition-colors shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5 text-emerald-600" />
                    <span>เพิ่มหัวข้อ</span>
                  </button>
                </div>
              </div>

              {/* Category Body */}
              <div className="p-4 sm:p-6 space-y-4">
                {/* Direct Items */}
                {category.items && category.items.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {category.items.map((item) => (
                      <div
                        key={item.id}
                        className="p-3.5 rounded-xl border border-slate-200 hover:border-emerald-300 bg-white hover:bg-slate-50/50 transition-all flex flex-col justify-between group"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-semibold text-slate-900 text-sm leading-snug group-hover:text-emerald-800">
                              {item.title}
                            </span>
                            {item.badge && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 shrink-0 border border-emerald-200/60">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          {item.description && (
                            <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                              {item.description}
                            </p>
                          )}
                          <div className="flex flex-wrap items-center gap-1.5 mt-2">
                            {item.imageUrl && (
                              <div className="flex items-center gap-1 text-[11px] text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200/60">
                                <ImageIcon className="w-3 h-3" />
                                <span>มีรูปภาพ</span>
                              </div>
                            )}
                            {item.fileName && (
                              <div className="flex items-center gap-1 text-[11px] text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200/60">
                                <FileText className="w-3 h-3" />
                                <span className="truncate max-w-[140px]">{item.fileName}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="pt-3 mt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                          <span className="text-[10px] font-mono text-slate-400">id: {item.id}</span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleOpenEdit(category.id, item)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                              title="แก้ไขข้อมูลหัวข้อนี้"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteItem(category.id, item.id, item.title)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                              title="ลบหัวข้อนี้"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Subgroups */}
                {category.groups && category.groups.length > 0 && (
                  <div className="space-y-4 pt-2">
                    {category.groups.map((group) => (
                      <div
                        key={group.id}
                        className="rounded-xl border border-emerald-200/80 bg-emerald-50/20 p-4 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                            <h4 className="font-bold text-slate-800 text-sm">
                              {group.title}
                            </h4>
                            <span className="text-[10px] text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full font-semibold">
                              {group.items.length} รายการ
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleOpenEditGroup(category.id, group)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-white transition-colors"
                              title="เปลี่ยนชื่อกลุ่มย่อย"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteGroup(category.id, group.id, group.title)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                              title="ลบกลุ่มย่อยนี้"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleOpenAdd(category.id, group.id)}
                              className="flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-white border border-emerald-300 hover:bg-emerald-50 px-2.5 py-1 rounded-lg transition-colors shadow-2xs"
                            >
                              <Plus className="w-3 h-3" />
                              <span>เพิ่มในกลุ่มนี้</span>
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                          {group.items.map((subItem) => (
                            <div
                              key={subItem.id}
                              className="p-3 rounded-lg border border-slate-200 bg-white hover:border-emerald-300 transition-all flex items-start justify-between gap-2 shadow-2xs"
                            >
                              <div className="min-w-0 flex-1">
                                <span className="font-semibold text-slate-800 text-xs block truncate leading-snug">
                                  {subItem.title}
                                </span>
                                {subItem.description && (
                                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                                    {subItem.description}
                                  </p>
                                )}
                                <div className="flex flex-wrap items-center gap-1 mt-1">
                                  {subItem.imageUrl && (
                                    <span className="inline-flex items-center gap-0.5 text-[10px] text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200/60">
                                      <ImageIcon className="w-2.5 h-2.5" />
                                      <span>รูป</span>
                                    </span>
                                  )}
                                  {subItem.fileName && (
                                    <span className="inline-block text-[10px] text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded">
                                      📎 {subItem.fileName}
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center gap-1 shrink-0">
                                <button
                                  onClick={() => handleOpenEdit(category.id, subItem, group.id)}
                                  className="p-1 rounded text-slate-500 hover:text-emerald-700 hover:bg-emerald-50"
                                  title="แก้ไข"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteItem(category.id, subItem.id, subItem.title, group.id)}
                                  className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                                  title="ลบ"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Subgroup Add / Edit Modal */}
      {isGroupModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700 font-bold">
                  {groupForm.isNew ? <FolderPlus className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                </span>
                <h3 className="font-bold text-slate-900 text-base">
                  {groupForm.isNew ? 'เพิ่มกลุ่มย่อยใหม่' : 'แก้ไขชื่อกลุ่มย่อย'}
                </h3>
              </div>
              <button
                onClick={() => setIsGroupModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleGroupFormSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  หมวดหมู่หลัก
                </label>
                <select
                  disabled={!groupForm.isNew}
                  value={groupForm.catId}
                  onChange={(e) => setGroupForm((prev) => ({ ...prev, catId: e.target.value }))}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ชื่อกลุ่มย่อย <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={groupForm.title}
                  onChange={(e) => setGroupForm((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="เช่น แนวทางเวชปฏิบัติ, สารสกัดกัญชา..."
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsGroupModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>บันทึกกลุ่มย่อย</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit / Add Item Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700 font-bold">
                  {editForm.isNew ? <Plus className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                </span>
                <h3 className="font-bold text-slate-900 text-base">
                  {editForm.isNew ? 'เพิ่มหัวข้อใหม่' : 'แก้ไขข้อมูลหัวข้อ'}
                </h3>
              </div>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              {/* Category / Group indicator */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    หมวดหมู่หลัก
                  </label>
                  <select
                    value={editForm.catId}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, catId: e.target.value, groupId: undefined }))}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    กลุ่มย่อย (ถ้ามี)
                  </label>
                  <select
                    value={editForm.groupId || ''}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, groupId: e.target.value || undefined }))}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium"
                  >
                    <option value="">-- ไม่มีกลุ่มย่อย (อยู่ระดับหมวดหมู่) --</option>
                    {categories
                      .find((c) => c.id === editForm.catId)
                      ?.groups?.map((g) => (
                        <option key={g.id} value={g.id}>
                          {g.title}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {/* Title & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ชื่อหัวข้อ <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.title}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="เช่น บัญชียาเฉพาะโรค 2568, แนวทางปฏิบัติ..."
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ป้ายกำกับ (Badge)
                  </label>
                  <input
                    type="text"
                    value={editForm.badge}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, badge: e.target.value }))}
                    placeholder="เช่น อัปเดตใหม่, RDU, แบบฟอร์ม"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  คำอธิบายโดยย่อ (Short Description)
                </label>
                <textarea
                  rows={2}
                  value={editForm.description}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="อธิบายรายละเอียดโดยสังเขปของหัวข้อนี้..."
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {/* Detailed Content / Articles */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  เนื้อหารายละเอียดฉบับเต็ม (Full Content / Guide)
                </label>
                <textarea
                  rows={5}
                  value={editForm.content}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, content: e.target.value }))}
                  placeholder="พิมพ์ข้อความรายละเอียดคำแนะนำ วัตถุประสงค์ แนวทางปฏิบัติ หรือขั้นตอนการใช้ยาสำหรับแสดงในหน้านี้..."
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-sans"
                />
              </div>

              {/* Image Upload / URL / Presets for Admin */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-emerald-600" />
                    <span>รูปภาพประกอบหัวข้อ / ภาพประชาสัมพันธ์ (Featured Image)</span>
                  </label>
                  {editForm.imageUrl && (
                    <button
                      type="button"
                      onClick={() => setEditForm((prev) => ({ ...prev, imageUrl: '' }))}
                      className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>ลบรูปภาพ</span>
                    </button>
                  )}
                </div>

                {/* Preview if exists */}
                {editForm.imageUrl && (
                  <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 max-h-48 w-full">
                    <img
                      src={editForm.imageUrl}
                      alt="Preview"
                      className="w-full h-44 object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <span className="text-[10px] font-bold bg-slate-900/80 text-white px-2 py-1 rounded-md shadow-xs">
                        ✓ มีรูปภาพประกอบ
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-3">
                  <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-slate-300 hover:border-emerald-500 text-xs font-semibold text-slate-700 shadow-2xs transition-colors">
                    <Upload className="w-4 h-4 text-emerald-600" />
                    <span>เลือกรูปภาพจากเครื่อง (JPG/PNG/WebP)</span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleImageUpload}
                      accept="image/*"
                    />
                  </label>
                </div>

                {/* Preset hospital pharmacy images */}
                <div>
                  <span className="text-[11px] font-semibold text-slate-500 block mb-1.5">
                    หรือเลือกรูปภาพมาตรฐานกลุ่มงานเภสัชกรรม:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {PRESET_TOPIC_IMAGES.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setEditForm((prev) => ({ ...prev, imageUrl: preset.url }))}
                        className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                          editForm.imageUrl === preset.url
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold shadow-2xs'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Direct URL */}
                <div>
                  <span className="text-[11px] text-slate-400 block mb-1">
                    หรือระบุ URL รูปภาพโดยตรง (Direct Image URL):
                  </span>
                  <input
                    type="text"
                    value={editForm.imageUrl.startsWith('data:') ? '(รูปภาพที่อัปโหลดจากเครื่อง)' : editForm.imageUrl}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (!val.startsWith('(รูปภาพ')) {
                        setEditForm((prev) => ({ ...prev, imageUrl: val }));
                      }
                    }}
                    placeholder="https://example.com/hospital-pharmacy.jpg"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Attach File / PDF / Document */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
                <label className="block text-xs font-bold text-slate-800">
                  แนบไฟล์เอกสาร / PDF สำหรับดาวน์โหลด
                </label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-slate-300 hover:border-emerald-500 text-xs font-semibold text-slate-700 shadow-2xs transition-colors">
                    <FileUp className="w-4 h-4 text-emerald-600" />
                    <span>เลือกไฟล์จากเครื่อง (PDF/Doc)</span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleFileUpload}
                      accept=".pdf,.doc,.docx,.xls,.xlsx"
                    />
                  </label>

                  {editForm.fileName && (
                    <div className="flex items-center gap-2 text-xs text-emerald-800 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-200">
                      <FileText className="w-3.5 h-3.5" />
                      <span className="font-medium truncate max-w-[200px]">{editForm.fileName}</span>
                      <button
                        type="button"
                        onClick={() => setEditForm((prev) => ({ ...prev, fileName: '', fileUrl: '' }))}
                        className="text-rose-500 hover:text-rose-700"
                        title="ลบไฟล์แนบ"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="text-[11px] text-slate-400">
                  หรือระบุ URL ลิงก์เอกสารภายนอก:
                </div>
                <input
                  type="text"
                  value={editForm.fileUrl.startsWith('data:') ? '(ไฟล์ที่อัปโหลดไว้แล้ว)' : editForm.fileUrl}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (!val.startsWith('(ไฟล์')) {
                      setEditForm((prev) => ({ ...prev, fileUrl: val }));
                    }
                  }}
                  placeholder="https://example.com/document.pdf"
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {/* Form buttons */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>บันทึกข้อมูล</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
