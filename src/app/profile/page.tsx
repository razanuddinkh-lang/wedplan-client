import { requireSession } from "@/lib/access";
import { ProfileForm } from "@/components/profile-form";
export default async function ProfilePage(){await requireSession();return <div className="mx-auto min-h-[55vh] max-w-7xl px-5 py-12 lg:px-8"><ProfileForm/></div>;}
