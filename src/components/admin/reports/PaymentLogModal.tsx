"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Clipboard } from "lucide-react";
import { useState } from "react";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  log: {
    id: string;
    event: string;
    provider: string;
    payload: Record<string, any>;
  } | null;
};

export function PaymentLogModal({ open, onOpenChange, log }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!log) return;
    await navigator.clipboard.writeText(JSON.stringify(log.payload, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Webhook Payload</DialogTitle>
          {log && (
            <DialogDescription className="text-sm text-muted-foreground">
              {log.provider} — {log.event}
            </DialogDescription>
          )}
        </DialogHeader>

        {log && (
          <>
            <div className="flex justify-end mb-2">
              <Button size="sm" variant="outline" onClick={handleCopy}>
                <Clipboard className="w-4 h-4 mr-2" />
                {copied ? "Copied!" : "Copy JSON"}
              </Button>
            </div>
            <ScrollArea className="max-h-[500px] mt-2 rounded-md border bg-muted p-4">
              <pre className="text-xs whitespace-pre-wrap break-all">
                {JSON.stringify(log.payload, null, 2)}
              </pre>
            </ScrollArea>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
