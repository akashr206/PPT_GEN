"use client";

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function PPTDetailPage({ params }) {
    const unwrappedParams = use(params);
    const pptId = unwrappedParams?.id;
    const router = useRouter();

    useEffect(() => {
        if (pptId) {
            router.replace(`/generate/${pptId}/view`);
        }
    }, [pptId, router]);

    return (
        <div className="flex h-screen items-center justify-center bg-background text-foreground">
            <Loader2 className="animate-spin text-primary" size={30} />
        </div>
    );
}
