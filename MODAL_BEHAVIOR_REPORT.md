# Modal Konfirmasi Penyimpanan Data - Behavior Report

## 🔍 Status Saat Ini
File: `/src/features/attendance/pages/AddCheckClockAdmin.jsx` (634 lines)

## 📋 Alur Ketika Admin Mengklik Tombol "Save"

### 1. **Handler Trigger**
```javascript
const handleSubmit = (e) => {
  e.preventDefault();
  // Melakukan validasi form
  // Jika valid → setShowConfirmModal(true)
}
```

### 2. **Validasi yang Dilakukan**
Sebelum modal muncul, form harus lulus validasi:
- ✅ Karyawan harus dipilih
- ✅ Tipe Absensi harus dipilih
- ✅ Untuk Annual Leave: Start Date & End Date wajib
- ✅ Lokasi harus dipilih
- ✅ Latitude & Longitude harus terisi (dari map)
- ✅ Detail Alamat harus diisi

Jika ada yang kosong → **alert warning** sebelum modal muncul

### 3. **Modal Konfirmasi yang Ditampilkan**

#### Visual Structure:
```
┌─────────────────────────────────────┐
│       🔵 AlertCircle Icon           │  ← Icon biru di atas
│                                     │
│   Konfirmasi Penyimpanan Data       │  ← Title
│                                     │
│  Apakah Anda yakin ingin mengirim   │  ← Message
│  data absensi ini?                  │
│  Pastikan semua informasi...        │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ Karyawan:    Shane          │   │  ← Summary Info
│  │ Tipe Absensi: Clock Out     │   │
│  │ Waktu:       09:07:16       │   │
│  │ Lokasi:      Lainnya        │   │
│  └─────────────────────────────┘   │
│                                     │
│  [  Batal  ]  [ ✓ Ya, Kirim ]      │  ← Action Buttons
└─────────────────────────────────────┘
```

### 4. **Informasi yang Ditampilkan dalam Modal**
1. **Karyawan**: Nama yang dipilih dari dropdown
2. **Tipe Absensi**: Jenis absensi (Clock In/Out, Absent, Leave, etc)
3. **Waktu**: Captured time saat tipe absensi dipilih
4. **Lokasi**: Location dipilih dari dropdown

## ⚙️ Fungsi-Fungsi Modal

### handleConfirmSave()
Dipicu saat admin klik "Ya, Kirim":
```javascript
const handleConfirmSave = () => {
  console.log("Form Data:", formData);      // Log ke console
  console.log("Proof File:", proofFile);    // Log file upload
  alert("Data berhasil disimpan!");         // Success message
  setShowConfirmModal(false);                // Close modal
  navigate("/admin/checkclock");             // Redirect
}
```

### handleCancelSave()
Dipicu saat admin klik "Batal":
```javascript
const handleCancelSave = () => {
  setShowConfirmModal(false);  // Tutup modal, form tetap terinput
}
```

## 🐛 Kemungkinan Bug yang Perlu Dicek

1. **Modal tidak muncul setelah klik Save**
   - Cek: Apakah semua validasi terpenuhi?
   - Cek: State `showConfirmModal` berubah ke true?
   - Cek: Browser console untuk error?

2. **Data dalam modal tidak sesuai**
   - Cek: Apakah form data sudah tersimpan di state?
   - Cek: Apakah captured time sudah diisi saat select tipe absensi?

3. **Modal tidak merespons klik tombol**
   - Cek: onClick handler sudah benar?
   - Cek: Ada CSS yang memblokir click (pointer-events)?

4. **Styling modal tidak muncul dengan baik**
   - Modal menggunakan: `fixed inset-0 z-50 backdrop-blur-sm`
   - Harus: z-index 50, fixed positioning, blur background

## 📝 Data yang Dikirim ke Backend (Future)
```javascript
{
  employeeName: "Shane",
  attendanceType: "Clock Out",
  capturedTime: "09:07:16",
  location: "Lainnya",
  latitude: "-7.9666",
  longitude: "112.6315",
  address: "Alamat yang diisi",
  startDate: "tgl (jika Annual Leave)",
  endDate: "tgl (jika Annual Leave)",
  notes: "Catatan tambahan",
  proofFile: File object
}
```

## 🔗 Related Routes
- Form Page: `/admin/checkclock/add`
- After Success: `/admin/checkclock` (AttendanceAdmin page)

---

**Last Updated**: 11 Dec 2025
**File Version**: 634 lines
**Status**: Modal implemented, waiting for testing feedback
