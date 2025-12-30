import { useState } from "react";
import { ChevronDown, Phone, Mail, MessageCircle } from "lucide-react";

// Assets
import waWhite from "@/assets/images/wa-white.png";
import emailWhite from "@/assets/images/email-white.png";

/* ===================== FAQ & HELP PAGE ===================== */
// userRole prop: "admin" | "user" | "employee"
// - Jika admin: tampilkan tab switcher untuk melihat FAQ admin & employee
// - Jika user/employee: hanya tampilkan FAQ employee (tanpa tab switcher)
export default function FaqHelpAdmin({ userRole = "admin" }) {
  const isAdmin = userRole === "admin";
  const [activeTab, setActiveTab] = useState(isAdmin ? "admin" : "user");
  const [openFaq, setOpenFaq] = useState(null);

  // FAQ untuk Admin
  const adminFaqs = [
    {
      category: "Dashboard & Navigasi",
      questions: [
        {
          question: "Bagaimana cara mengakses dashboard admin?",
          answer: "Setelah login dengan akun admin, Anda akan langsung diarahkan ke halaman Dashboard. Dashboard menampilkan ringkasan data karyawan, statistik kehadiran, dan grafik performa. Gunakan sidebar di sebelah kiri untuk navigasi ke menu lainnya."
        },
        {
          question: "Apa saja menu yang tersedia di sidebar?",
          answer: "Sidebar admin terdiri dari: Dashboard (ringkasan data), Employee Database (kelola data karyawan), Checkclock (kelola absensi), Work Schedule (kelola jadwal kerja), FAQ & Help (bantuan), dan Settings (pengaturan)."
        },
        {
          question: "Bagaimana cara memperkecil/memperbesar sidebar?",
          answer: "Klik area sidebar untuk toggle antara mode expanded dan collapsed. Dalam mode collapsed, hanya ikon yang ditampilkan untuk memaksimalkan ruang kerja."
        },
      ]
    },
    {
      category: "Manajemen Karyawan",
      questions: [
        {
          question: "Bagaimana cara menambahkan karyawan baru?",
          answer: "Buka menu 'Employee Database' dari sidebar, lalu klik tombol 'Add Employee' di pojok kanan atas. Isi formulir dengan data karyawan lengkap seperti nama, email, nomor telepon, posisi, department, dan upload foto jika diperlukan. Klik 'Save' untuk menyimpan data."
        },
        {
          question: "Bagaimana cara mengedit data karyawan?",
          answer: "Di halaman Employee Database, cari karyawan yang ingin diedit. Klik tombol 'Edit' (ikon pensil) pada baris karyawan tersebut. Ubah data yang diperlukan pada form edit, lalu klik 'Update' untuk menyimpan perubahan."
        },
        {
          question: "Bagaimana cara menghapus data karyawan?",
          answer: "Di halaman Employee Database, cari karyawan yang ingin dihapus. Klik tombol 'Delete' (ikon tempat sampah) pada baris karyawan tersebut. Konfirmasi penghapusan pada dialog yang muncul. Perhatian: Data yang dihapus tidak dapat dikembalikan."
        },
        {
          question: "Bagaimana cara mencari dan filter karyawan?",
          answer: "Gunakan search bar di atas tabel untuk mencari berdasarkan nama atau ID. Gunakan dropdown filter untuk menyaring berdasarkan department, posisi, atau status karyawan."
        },
      ]
    },
    {
      category: "Checkclock & Absensi",
      questions: [
        {
          question: "Bagaimana cara menambahkan data checkclock manual?",
          answer: "Buka menu 'Checkclock' dari sidebar, lalu klik tombol 'Add Checkclock'. Pilih karyawan, tentukan tanggal dan waktu clock-in/clock-out, pilih lokasi pada peta, dan tambahkan keterangan jika diperlukan. Klik 'Submit' untuk menyimpan."
        },
        {
          question: "Bagaimana cara melihat riwayat absensi karyawan?",
          answer: "Di halaman Checkclock, semua data absensi ditampilkan dalam tabel. Gunakan filter tanggal untuk melihat absensi pada periode tertentu. Klik nama karyawan untuk melihat detail lengkap."
        },
        {
          question: "Apa arti status absensi yang berbeda?",
          answer: "On-Time (hijau): Hadir tepat waktu. Late (kuning): Terlambat dari jadwal. Absent (merah): Tidak hadir tanpa keterangan. Leave (biru): Cuti yang disetujui. Sick (ungu): Izin sakit."
        },
        {
          question: "Bagaimana cara export data absensi?",
          answer: "Di halaman Checkclock, klik tombol 'Export' di pojok kanan atas. Pilih format file (Excel/PDF) dan rentang tanggal yang diinginkan, lalu klik 'Download'."
        },
      ]
    },
    {
      category: "Jadwal Kerja",
      questions: [
        {
          question: "Bagaimana cara membuat jadwal kerja?",
          answer: "Buka menu 'Work Schedule' dari sidebar. Klik 'Add Schedule' untuk membuat jadwal baru. Tentukan nama shift, jam kerja, dan hari yang berlaku. Assign karyawan ke jadwal yang sesuai."
        },
        {
          question: "Bagaimana cara mengubah shift karyawan?",
          answer: "Di halaman Work Schedule, temukan karyawan yang ingin diubah shift-nya. Klik pada kolom jadwal dan pilih shift baru dari dropdown. Perubahan akan otomatis tersimpan."
        },
      ]
    },
    {
      category: "Troubleshooting",
      questions: [
        {
          question: "Data tidak muncul di dashboard, apa yang harus dilakukan?",
          answer: "Coba refresh halaman dengan menekan F5 atau Ctrl+R. Jika masih bermasalah, clear cache browser Anda. Pastikan koneksi internet stabil. Jika problem berlanjut, hubungi tim support."
        },
        {
          question: "Gagal upload foto karyawan, bagaimana solusinya?",
          answer: "Pastikan format file adalah JPG, PNG, atau WEBP dengan ukuran maksimal 2MB. Coba kompres gambar jika ukurannya terlalu besar. Gunakan browser terbaru untuk pengalaman terbaik."
        },
        {
          question: "Session expired dan harus login ulang terus, mengapa?",
          answer: "Ini bisa terjadi karena: 1) Cookie browser diblokir - aktifkan cookie untuk situs ini. 2) Multiple login dari device berbeda. 3) Tidak mencentang 'Remember Me' saat login. Centang opsi tersebut untuk session yang lebih lama."
        },
      ]
    },
  ];

  // FAQ untuk User/Employee
  const userFaqs = [
    {
      category: "Dashboard & Profil",
      questions: [
        {
          question: "Bagaimana cara mengakses dashboard saya?",
          answer: "Setelah login dengan akun employee, Anda akan diarahkan ke Dashboard Employee. Di sini Anda dapat melihat ringkasan kehadiran, jadwal kerja, dan pengumuman terbaru."
        },
        {
          question: "Bagaimana cara mengubah foto profil?",
          answer: "Klik ikon profil di pojok kanan atas, pilih 'Edit Profile'. Klik area foto untuk upload gambar baru. Format yang didukung: JPG, PNG, WEBP dengan maksimal 2MB."
        },
        {
          question: "Bagaimana cara mengubah password?",
          answer: "Klik ikon profil di pojok kanan atas, pilih 'Settings'. Masuk ke tab 'Security', masukkan password lama dan password baru, lalu klik 'Update Password'."
        },
      ]
    },
    {
      category: "Absensi & Checkclock",
      questions: [
        {
          question: "Bagaimana cara melakukan clock-in?",
          answer: "Di halaman Checkclock, klik tombol 'Clock In'. Sistem akan meminta akses lokasi - izinkan untuk validasi GPS. Pastikan Anda berada di area kantor yang terdaftar. Klik 'Confirm' untuk menyimpan absensi."
        },
        {
          question: "Bagaimana cara melakukan clock-out?",
          answer: "Di halaman Checkclock, klik tombol 'Clock Out'. Sama seperti clock-in, pastikan lokasi GPS aktif dan Anda berada di area yang valid. Sistem akan mencatat jam keluar Anda."
        },
        {
          question: "Saya lupa clock-in/clock-out, bagaimana solusinya?",
          answer: "Hubungi admin HR Anda untuk meminta penambahan data absensi manual. Siapkan alasan yang jelas dan bukti pendukung (jika ada) untuk proses verifikasi."
        },
        {
          question: "Bagaimana cara melihat riwayat kehadiran saya?",
          answer: "Di halaman Checkclock, scroll ke bawah untuk melihat tabel riwayat kehadiran. Gunakan filter tanggal untuk melihat periode tertentu. Anda juga bisa download laporan bulanan."
        },
        {
          question: "GPS tidak terdeteksi, apa yang harus dilakukan?",
          answer: "1) Pastikan GPS/Location Service di device Anda aktif. 2) Berikan izin lokasi ke browser. 3) Coba di tempat terbuka jika sinyal lemah. 4) Refresh halaman dan coba lagi. 5) Jika masih gagal, hubungi admin."
        },
      ]
    },
    {
      category: "Jadwal & Cuti",
      questions: [
        {
          question: "Bagaimana cara melihat jadwal kerja saya?",
          answer: "Buka menu 'Work Schedule' dari sidebar. Jadwal kerja Anda untuk minggu ini dan bulan ini akan ditampilkan dalam format kalender. Shift yang berbeda ditandai dengan warna berbeda."
        },
        {
          question: "Bagaimana cara mengajukan cuti?",
          answer: "Di menu 'Leave Request', klik 'New Request'. Pilih jenis cuti (Annual Leave, Sick Leave, dll), tentukan tanggal mulai dan selesai, tambahkan alasan, lalu submit. Admin akan mereview dan menyetujui/menolak pengajuan Anda."
        },
        {
          question: "Bagaimana cara cek status pengajuan cuti?",
          answer: "Di menu 'Leave Request', Anda bisa melihat semua pengajuan cuti beserta statusnya: Pending (menunggu), Approved (disetujui), atau Rejected (ditolak)."
        },
      ]
    },
    {
      category: "Troubleshooting",
      questions: [
        {
          question: "Tidak bisa login, apa yang harus dilakukan?",
          answer: "1) Pastikan email/username dan password benar (case-sensitive). 2) Klik 'Forgot Password' jika lupa password. 3) Clear cache dan cookies browser. 4) Coba browser lain. 5) Hubungi admin jika akun terkunci."
        },
        {
          question: "Halaman loading terus tanpa henti?",
          answer: "Coba: 1) Refresh halaman (F5). 2) Clear cache browser. 3) Cek koneksi internet. 4) Coba mode incognito/private. 5) Update browser ke versi terbaru."
        },
        {
          question: "Data absensi saya tidak sesuai, bagaimana?",
          answer: "Screenshot data yang salah sebagai bukti, lalu hubungi admin HR melalui WhatsApp atau email. Sertakan tanggal dan detail ketidaksesuaian untuk pengecekan lebih cepat."
        },
      ]
    },
  ];

  const currentFaqs = activeTab === "admin" ? adminFaqs : userFaqs;

  const handleWhatsApp = (number) => {
    window.open(`https://wa.me/${number}?text=Halo, saya butuh bantuan terkait HRIS`, "_blank");
  };

  const handleEmail = () => {
    window.open("mailto:business@cmlabs.co?subject=HRIS Support Request", "_blank");
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#1D395E] mb-2">FAQ & Help Center</h1>
            <p className="text-gray-600">Temukan jawaban untuk pertanyaan umum atau hubungi tim support kami</p>
          </div>
          
          {/* Tab Switcher - Only show for Admin */}
          {isAdmin && (
            <div className="bg-gray-100 rounded-full p-1.5 flex">
              <button 
                onClick={() => { setActiveTab("admin"); setOpenFaq(null); }}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                  activeTab === "admin" 
                    ? "bg-[#1d395e] text-white shadow-md" 
                    : "text-gray-600 hover:text-[#1d395e]"
                }`}
              >
                Admin
              </button>
              <button 
                onClick={() => { setActiveTab("user"); setOpenFaq(null); }}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                  activeTab === "user" 
                    ? "bg-[#2D5F3F] text-white shadow-md" 
                    : "text-gray-600 hover:text-[#2D5F3F]"
                }`}
              >
                Employee
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* FAQ Section - Takes 2 columns */}
        <div className="lg:col-span-2 space-y-4">
          {currentFaqs.map((category, catIndex) => (
            <div key={catIndex} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Category Header */}
              <div className={`px-6 py-4 border-b border-gray-100 ${
                activeTab === "admin" ? "bg-[#1d395e]/5" : "bg-[#2D5F3F]/5"
              }`}>
                <h2 className={`text-lg font-semibold ${
                  activeTab === "admin" ? "text-[#1d395e]" : "text-[#2D5F3F]"
                }`}>
                  {category.category}
                </h2>
              </div>
              
              {/* Questions */}
              <div className="divide-y divide-gray-100">
                {category.questions.map((faq, faqIndex) => {
                  const uniqueKey = `${catIndex}-${faqIndex}`;
                  const isOpen = openFaq === uniqueKey;
                  
                  return (
                    <div key={faqIndex} className="transition-all duration-300">
                      <button 
                        onClick={() => setOpenFaq(isOpen ? null : uniqueKey)}
                        className="w-full flex items-center justify-between p-4 md:p-5 text-left hover:bg-gray-50/80 transition-all duration-300"
                      >
                        <span className={`text-[15px] font-medium pr-4 transition-colors duration-300 ${
                          isOpen 
                            ? (activeTab === "admin" ? "text-[#1d395e]" : "text-[#2D5F3F]") 
                            : "text-gray-800"
                        }`}>
                          {faq.question}
                        </span>
                        <ChevronDown 
                          size={20} 
                          className={`flex-shrink-0 transition-all duration-300 ${
                            isOpen 
                              ? `rotate-180 ${activeTab === "admin" ? "text-[#1d395e]" : "text-[#2D5F3F]"}` 
                              : "text-gray-400"
                          }`} 
                        />
                      </button>
                      <div className={`overflow-hidden transition-all duration-300 ${
                        isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                      }`}>
                        <div className="px-4 md:px-5 pb-4 md:pb-5">
                          <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 rounded-lg p-4">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Contact Center - Takes 1 column */}
        <div className="space-y-4">
          {/* Contact Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-[#1d395e]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-[#1d395e]" />
              </div>
              <h3 className="text-lg font-bold text-[#1d395e] mb-2">Butuh Bantuan Lebih?</h3>
              <p className="text-sm text-gray-600">Tim support kami siap membantu Anda</p>
            </div>
            
            <div className="space-y-3">
              {/* WhatsApp 1 */}
              <button 
                onClick={() => handleWhatsApp("6281213968518")}
                className="w-full flex items-center gap-3 bg-[#237047] hover:bg-[#20bd5a] text-white rounded-xl px-4 py-3 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <img src={waWhite} alt="WhatsApp" className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold">WhatsApp Support 1</p>
                  <p className="text-xs opacity-90">+62 812-1396-8518</p>
                </div>
              </button>

              {/* WhatsApp 2 */}
              <button 
                onClick={() => handleWhatsApp("6285712813983")}
                className="w-full flex items-center gap-3 bg-[#237047] hover:bg-[#20bd5a] text-white rounded-xl px-4 py-3 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <img src={waWhite} alt="WhatsApp" className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold">WhatsApp Support 2</p>
                  <p className="text-xs opacity-90">+62 857-1281-3983</p>
                </div>
              </button>

              {/* Email */}
              <button 
                onClick={handleEmail}
                className="w-full flex items-center gap-3 bg-[#1d395e] hover:bg-[#2a4a6e] text-white rounded-xl px-4 py-3 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <img src={emailWhite} alt="Email" className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold">Email Support</p>
                  <p className="text-xs opacity-90">business@cmlabs.co</p>
                </div>
              </button>
            </div>

            {/* Working Hours */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <h4 className="text-sm font-semibold text-gray-800 mb-3">Jam Operasional</h4>
              <div className="flex items-center justify-center gap-3 py-4">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <div className="text-center">
                  <p className="text-lg font-bold text-[#1d395e]">24/7 Support</p>
                  <p className="text-sm text-gray-600">Tim kami siap melayani Anda kapan saja</p>
                </div>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-200">
              <div className="flex gap-3">
                <MessageCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-800 mb-1">Tips Cepat</p>
                  <p className="text-xs text-amber-700">
                    Sertakan screenshot dan detail masalah saat menghubungi support untuk penanganan lebih cepat.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
