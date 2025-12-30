import FaqHelpAdmin from "./FaqHelpAdmin";

/* ===================== FAQ & HELP PAGE FOR USER/EMPLOYEE ===================== */
// Wrapper component untuk user/employee
// Hanya menampilkan FAQ khusus employee tanpa tab switcher
export default function FaqHelpUser() {
  return <FaqHelpAdmin userRole="user" />;
}
