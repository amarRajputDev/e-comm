"use client";

import { Save } from "lucide-react";
import { useUi } from "@/lib/store/providers";
import { Button } from "@/components/ui/button";

export function SaveNoteButton() {
  const { toast } = useUi();
  return (
    <Button
      size="sm"
      variant="outline"
      icon={<Save size={14} />}
      onClick={() => toast({ title: "Note saved", description: "Visible to your team only.", tone: "success" })}
    >
      Save note
    </Button>
  );
}
