import { redirect } from 'next/navigation';
import { Header, SidebarWrapper } from '@/components';
import { UserProvider } from '@/contexts/user-context';
import { getCurrentUser } from '@/lib/auth';
import { hasAccessToOrganization } from '@/lib/organization';

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ organizationSlug: string }>;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/sign-in');
  }

  const { organizationSlug } = await params;
  const hasAccess = await hasAccessToOrganization(organizationSlug);

  if (!hasAccess) {
    redirect('/');
  }

  return (
    <UserProvider initialUser={user}>
      <SidebarWrapper>
        <main className="h-full min-h-svh w-full">
          <Header />
          {children}
        </main>
      </SidebarWrapper>
    </UserProvider>
  );
}
