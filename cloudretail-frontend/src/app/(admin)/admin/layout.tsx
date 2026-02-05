import AdminGuard from "@/components/guards/AdminGuard";
import NavbarAdmin from "@/components/ui/NavbarAdmin";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <NavbarAdmin />
      <main className="container-app py-6">{children}</main>
    </AdminGuard>
  );
}
