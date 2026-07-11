import GuestGuard from "@/components/auth/guest-guard";


export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <GuestGuard>
      {children}
    </GuestGuard>
  );

}