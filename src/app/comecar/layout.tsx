import { redirect } from 'next/navigation';
import { getCurrentUserId } from '@/lib';
import { findOrganizationByUserId } from '@/utils/organizations';

export default async function SetupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userId = await getCurrentUserId();

  if (!userId) {
    redirect('/sign-in');
  }

  const organization = await findOrganizationByUserId(userId);

  if (organization) {
    redirect(`/${organization.slug}/vendas`);
  }

  return <>{children}</>;
}
