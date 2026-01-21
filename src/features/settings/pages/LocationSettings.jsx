// src/features/settings/pages/LocationSettings.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Plus,
  Edit2,
  Trash2,
  X,
  Check,
  Loader2,
  Map,
} from "lucide-react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { locationService } from "@/app/services/location.api";
import { Notification } from "@/components/ui/Notification";

// Fix Leaflet default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const markerIcon = new L.Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Map click handler component
function LocationPicker({ position, onChange }) {
  const mapRef = useRef(null);
  const map = useMapEvents({
    click(e) {
      onChange(e.latlng);
    },
  });

  mapRef.current = map;

  useEffect(() => {
    const currentMap = mapRef.current;
    if (currentMap && position) {
      currentMap.setView(position, currentMap.getZoom());
    }
  }, [position]);

  return position ? <Marker position={position} icon={markerIcon} /> : null;
}

export default function LocationSettings() {
  const navigate = useNavigate();
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" | "edit"
  const [editingLocation, setEditingLocation] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    latitude: "",
    longitude: "",
  });
  const [mapPosition, setMapPosition] = useState(null);

  // Delete confirmation
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch locations
  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      setLoading(true);
      const res = await locationService.getAllLocations();
      if (res.success) {
        setLocations(res.data || []);
      } else {
        setNotification({
          type: "error",
          message: res.message || "Gagal memuat data lokasi",
        });
      }
    } catch (err) {
      setNotification({
        type: "error",
        message: err.message || "Gagal memuat data lokasi",
      });
    } finally {
      setLoading(false);
    }
  };

  // Open modal for adding
  const handleAdd = () => {
    setFormData({ name: "", address: "", latitude: "", longitude: "" });
    setMapPosition(null);
    setModalMode("add");
    setEditingLocation(null);
    setShowModal(true);
  };

  // Open modal for editing
  const handleEdit = (location) => {
    setFormData({
      name: location.name,
      address: location.address || "",
      latitude: location.latitude.toString(),
      longitude: location.longitude.toString(),
    });
    setMapPosition({ lat: location.latitude, lng: location.longitude });
    setModalMode("edit");
    setEditingLocation(location);
    setShowModal(true);
  };

  // Handle map click
  const handleMapClick = (latlng) => {
    setMapPosition(latlng);
    setFormData((prev) => ({
      ...prev,
      latitude: latlng.lat.toFixed(8),
      longitude: latlng.lng.toFixed(8),
    }));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setNotification({ type: "warning", message: "Nama lokasi wajib diisi" });
      return;
    }

    if (!formData.latitude || !formData.longitude) {
      setNotification({
        type: "warning",
        message: "Pilih lokasi pada peta atau isi koordinat",
      });
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        name: formData.name.trim(),
        address: formData.address.trim() || null,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
      };

      let res;
      if (modalMode === "add") {
        res = await locationService.createLocation(payload);
      } else {
        res = await locationService.updateLocation(editingLocation.id, payload);
      }

      if (res.success) {
        setNotification({
          type: "success",
          message:
            modalMode === "add"
              ? "Lokasi berhasil ditambahkan"
              : "Lokasi berhasil diperbarui",
        });
        setShowModal(false);
        fetchLocations();
      } else {
        setNotification({
          type: "error",
          message: res.message || "Gagal menyimpan lokasi",
        });
      }
    } catch (err) {
      setNotification({
        type: "error",
        message: err.message || "Gagal menyimpan lokasi",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Delete location
  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      setDeleting(true);
      const res = await locationService.deleteLocation(deleteId);

      if (res.success) {
        setNotification({
          type: "success",
          message: "Lokasi berhasil dihapus",
        });
        setDeleteId(null);
        fetchLocations();
      } else {
        setNotification({
          type: "error",
          message: res.message || "Gagal menghapus lokasi",
        });
      }
    } catch (err) {
      setNotification({
        type: "error",
        message: err.message || "Gagal menghapus lokasi",
      });
    } finally {
      setDeleting(false);
    }
  };

  // Toggle active status
  const handleToggleActive = async (location) => {
    try {
      const res = await locationService.updateLocation(location.id, {
        isActive: !location.isActive,
      });

      if (res.success) {
        setNotification({
          type: "success",
          message: `Lokasi ${!location.isActive ? "diaktifkan" : "dinonaktifkan"}`,
        });
        fetchLocations();
      } else {
        setNotification({
          type: "error",
          message: res.message || "Gagal mengubah status lokasi",
        });
      }
    } catch (err) {
      setNotification({
        type: "error",
        message: err.message || "Gagal mengubah status lokasi",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-6">
      {/* Notification */}
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
          duration={4000}
        />
      )}

      {/* Header */}
      <div className="max-w-4xl mx-auto">
        <div className="flex items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          <button
            onClick={() => navigate("/admin/settings")}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors flex-shrink-0"
          >
            <ArrowLeft size={20} className="sm:w-6 sm:h-6 text-gray-600" />
          </button>
          <div>
            <h1 className="text-lg sm:text-2xl font-bold text-gray-800">
              Pengaturan Lokasi Kantor
            </h1>
            <p className="text-gray-500 text-xs sm:text-sm">
              Kelola lokasi kantor yang dapat dipilih saat checkclock
            </p>
          </div>
        </div>

        {/* Add Button */}
        <div className="mb-4 sm:mb-6">
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
          >
            <Plus size={18} className="sm:w-5 sm:h-5" />
            <span>Tambah Lokasi</span>
          </button>
        </div>

        {/* Location List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="animate-spin text-blue-600" size={32} />
            </div>
          ) : locations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-gray-500 px-4">
              <MapPin size={40} className="sm:w-12 sm:h-12 mb-3 sm:mb-4 text-gray-300" />
              <p className="text-sm sm:text-base text-center">Belum ada lokasi yang ditambahkan</p>
              <p className="text-xs sm:text-sm text-center">
                Klik tombol &quot;Tambah Lokasi&quot; untuk menambahkan lokasi baru
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {locations.map((location) => (
                <div
                  key={location.id}
                  className={`p-3 sm:p-4 flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4 ${
                    !location.isActive ? "bg-gray-50 opacity-60" : ""
                  }`}
                >
                  <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
                    <div
                      className={`p-1.5 sm:p-2 rounded-lg flex-shrink-0 ${
                        location.isActive
                          ? "bg-red-50 text-red-500"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      <MapPin size={16} className="sm:w-5 sm:h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium text-gray-800 text-sm sm:text-base flex flex-wrap items-center gap-2">
                        <span className="truncate">{location.name}</span>
                        {!location.isActive && (
                          <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded flex-shrink-0">
                            Nonaktif
                          </span>
                        )}
                      </h3>
                      {location.address && (
                        <p className="text-xs sm:text-sm text-gray-500 mt-1 line-clamp-2">
                          {location.address}
                        </p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">
                        <span className="hidden sm:inline">Koordinat: </span>
                        <span className="font-mono">{location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 sm:gap-2 self-end sm:self-auto">
                    {/* Toggle Active */}
                    <button
                      onClick={() => handleToggleActive(location)}
                      className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
                        location.isActive
                          ? "hover:bg-gray-100 text-gray-500"
                          : "hover:bg-green-50 text-green-600"
                      }`}
                      title={location.isActive ? "Nonaktifkan" : "Aktifkan"}
                    >
                      {location.isActive ? (
                        <X size={16} className="sm:w-[18px] sm:h-[18px]" />
                      ) : (
                        <Check size={16} className="sm:w-[18px] sm:h-[18px]" />
                      )}
                    </button>

                    {/* Edit */}
                    <button
                      onClick={() => handleEdit(location)}
                      className="p-1.5 sm:p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => setDeleteId(location.id)}
                      className="p-1.5 sm:p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors"
                      title="Hapus"
                    >
                      <Trash2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="mt-4 sm:mt-6 bg-blue-50 border border-blue-200 rounded-xl p-3 sm:p-4">
          <div className="flex gap-2 sm:gap-3">
            <Map className="text-blue-600 flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6" />
            <div>
              <h4 className="font-medium text-blue-800 text-sm sm:text-base">
                Tentang Lokasi Kantor
              </h4>
              <p className="text-xs sm:text-sm text-blue-700 mt-1">
                Lokasi yang ditambahkan di sini akan muncul sebagai pilihan saat
                admin atau karyawan melakukan checkclock. Setiap lokasi terkait
                dengan company Anda, sehingga perusahaan lain akan memiliki
                daftar lokasi mereka sendiri.
              </p>
              <p className="text-xs sm:text-sm text-blue-700 mt-2">
                <strong>Tips:</strong> Klik pada peta untuk memilih koordinat lokasi
                dengan mudah.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                  {modalMode === "add" ? "Tambah Lokasi Baru" : "Edit Lokasi"}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} className="text-gray-700" />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                {/* Name */}
                <div className="mb-3 sm:mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                    Nama Lokasi <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="Contoh: Kantor Pusat"
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black text-sm sm:text-base"
                  />
                </div>

                {/* Address */}
                <div className="mb-3 sm:mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                    Alamat Lengkap (Opsional)
                  </label>
                  <textarea
                    value={formData.address}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        address: e.target.value,
                      }))
                    }
                    placeholder="Contoh: Jl. Raya Blimbing No.10, Malang"
                    rows={2}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-black text-sm sm:text-base"
                  />
                </div>

                {/* Map */}
                <div className="mb-3 sm:mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                    Pilih Lokasi pada Peta <span className="text-red-500">*</span>
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    Klik pada peta untuk menentukan koordinat lokasi
                  </p>
                  <div className="h-48 sm:h-64 rounded-lg overflow-hidden border border-gray-300">
                    <MapContainer
                      center={mapPosition || [-7.9666, 112.6326]} // Default: Malang
                      zoom={13}
                      style={{ height: "100%", width: "100%" }}
                    >
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                      />
                      <LocationPicker
                        position={mapPosition}
                        onChange={handleMapClick}
                      />
                    </MapContainer>
                  </div>
                </div>

                {/* Coordinates */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                      Latitude
                    </label>
                    <input
                      type="text"
                      value={formData.latitude}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          latitude: e.target.value,
                        }))
                      }
                      placeholder="-7.9666"
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black text-sm sm:text-base font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                      Longitude
                    </label>
                    <input
                      type="text"
                      value={formData.longitude}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          longitude: e.target.value,
                        }))
                      }
                      placeholder="112.6326"
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black text-sm sm:text-base font-mono"
                    />
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="w-full sm:w-auto px-4 sm:px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full sm:w-auto px-4 sm:px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    {submitting && <Loader2 size={18} className="animate-spin" />}
                    {modalMode === "add" ? "Tambah Lokasi" : "Simpan Perubahan"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-4 sm:p-6">
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Trash2 size={24} className="sm:w-8 sm:h-8 text-red-500" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
                Hapus Lokasi?
              </h3>
              <p className="text-sm sm:text-base text-gray-500 mb-4 sm:mb-6">
                Lokasi yang dihapus tidak dapat dikembalikan. Apakah Anda yakin
                ingin menghapus lokasi ini?
              </p>
              <div className="flex flex-col-reverse sm:flex-row justify-center gap-2 sm:gap-3">
                <button
                  onClick={() => setDeleteId(null)}
                  className="w-full sm:w-auto px-4 sm:px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
                >
                  Batal
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="w-full sm:w-auto px-4 sm:px-6 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  {deleting && <Loader2 size={18} className="animate-spin" />}
                  Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
