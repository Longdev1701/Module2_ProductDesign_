// Layout cho route group (auth) — onboarding, reset-password
// Group layout không thêm gì, chỉ pass children qua để Next.js nhận route
export default function AuthGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
