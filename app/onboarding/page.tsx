import { getUserCount } from "@/app/lib/database";
import { redirect } from "next/navigation";

export default async function Onboarding() {
    
    const numUsers = await getUserCount();
    if (numUsers > 0) redirect("/login");

    return <OnboardingForm></OnboardingForm>
}

import OnboardingForm from "@/app/components/form/OnboardingForm";
