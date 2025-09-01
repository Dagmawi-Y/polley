export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container mx-auto max-w-md px-4 py-10">
      {children}
    </div>
  );
}
