import NavbarStore from "@/components/ui/NavbarStore";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <NavbarStore />
      <main className="container-app py-6">{children}</main>
      <footer className="border-t border-slate-200 bg-white">
        <div className="container-app py-6 text-sm text-slate-600">
          © {new Date().getFullYear()} CloudRetail — MVP Storefront
        </div>
      </footer>
    </div>
  );
}
