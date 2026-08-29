import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2, MessageSquare, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function HistoryDialog({
  open,
  onOpenChange,
  conversations,
  loading,
  onLoad,
  onDelete,
  onNew,
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-[#faf6ef] border-[#e8ddc7]">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl text-[#2b2620]">
            Conversation history
          </DialogTitle>
          <DialogDescription className="text-[#8a7f6f]">
            Past questions you've asked the Truth Assistant. Tap one to resume it.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end mb-3">
          <Button
            size="sm"
            onClick={onNew}
            className="bg-[#2b2620] hover:bg-[#3a3328] text-[#f3e9c8]"
          >
            <PlusCircle className="w-4 h-4 mr-1.5" /> New conversation
          </Button>
        </div>

        <div className="max-h-[55vh] overflow-y-auto space-y-2 pr-1">
          {loading && (
            <div className="flex justify-center py-10">
              <Loader2 className="w-5 h-5 animate-spin text-[#b08d3c]" />
            </div>
          )}
          {!loading && conversations.length === 0 && (
            <p className="text-center text-[#8a7f6f] py-10">No past conversations yet.</p>
          )}
          {conversations.map((c) => (
            <div
              key={c.id}
              className="flex items-center gap-2 rounded-xl border border-[#e8ddc7] bg-white/70 p-3"
            >
              <button
                onClick={() => onLoad(c)}
                className="flex-1 text-left flex gap-2.5 items-start min-w-0"
              >
                <MessageSquare className="w-4 h-4 mt-0.5 text-[#b08d3c] shrink-0" />
                <span className="min-w-0">
                  <span className="block text-sm text-[#2b2620] truncate font-medium">
                    {c.title || "Untitled"}
                  </span>
                  <span className="block text-xs text-[#8a7f6f]">
                    {c.messages?.length || 0} messages ·{" "}
                    {c.updated_date
                      ? formatDistanceToNow(new Date(c.updated_date), { addSuffix: true })
                      : ""}
                  </span>
                </span>
              </button>
              <button
                onClick={() => onDelete(c.id)}
                className="text-[#8a7f6f] hover:text-[#7a2e2e] p-1.5 shrink-0"
                aria-label="Delete conversation"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}