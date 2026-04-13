"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import type { PresentationData } from "@/lib/types";
import PresentationBoard from "@/components/PresentationBoard";

const STORAGE_KEY = "magieDealsPresentationData";
const AUTH_KEY = "magieDealsAuth";

export default function PresentationPage() {
  const router = useRouter();
  const [data, setData] = useState<PresentationData | null>(null);

  useEffect(() => {
    try {
      if (!localStorage.getItem(AUTH_KEY)) {
        router.push("/");
        return;
      }

      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        router.push("/");
        return;
      }

      const parsed = JSON.parse(raw) as PresentationData;
      if (!parsed || !Array.isArray(parsed.deals) || !parsed.scores) {
        router.push("/");
        return;
      }

      // eslint-disable-next-line react-hooks/set-state-in-effect
      setData(parsed);
    } catch {
      router.push("/");
    }
  }, [router]);

  if (!data) return null;

  return <PresentationBoard data={data} />;
}
