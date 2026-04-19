import { getCurrentUser } from '@/lib/session';
import { getUnreadNotifications } from './actions/notificationActions';
import AdminLayoutClient from './AdminLayoutClient';

export default async function AdminLayout({ children }) {
  const user = await getCurrentUser();
  const initialNotifications = await getUnreadNotifications();

  return <AdminLayoutClient user={user} initialNotifications={initialNotifications}>{children}</AdminLayoutClient>;
}
