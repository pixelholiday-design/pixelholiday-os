export const runtime = "edge";
import { redirect } from 'next/navigation';

export default function RecruitmentRedirect() {
  redirect('/admin/ats');
}
