import React from "react";
import { Download, Printer, Trash2 } from "lucide-react";
import ListenControl from "@/components/ListenControl";
import { downloadText, notebookFilename, notebookItemText, printText } from "@/lib/notebookExport";

export default function NotebookItemActions({ kind, item, onDelete }) {
  const title = item.reference || item.topic || kind;
  const text = notebookItemText(kind, item);

  return (
    <div className="flex items-center gap-1 shrink-0">
      <ListenControl variant="icon" id={`notebook:${kind}:${item.id || title}`} title={title} label={kind} text={text} />
      <button
        type="button"
        className="p-1.5 rounded-md text-[#8a7f6f] hover:bg-[#f3e9c8]/70 hover:text-[#2b2620]"
        title={`Download this ${kind.toLowerCase()}`}
        onClick={() => downloadText(notebookFilename(kind, item), text)}
      >
        <Download className="w-4 h-4" />
      </button>
      <button
        type="button"
        className="p-1.5 rounded-md text-[#8a7f6f] hover:bg-[#f3e9c8]/70 hover:text-[#2b2620]"
        title={`Print this ${kind.toLowerCase()}`}
        onClick={() => printText(title, text)}
      >
        <Printer className="w-4 h-4" />
      </button>
      <button
        type="button"
        className="p-1.5 rounded-md text-[#8a7f6f] hover:bg-[#f3e9c8]/70 hover:text-[#7a2e2e]"
        title={`Delete this ${kind.toLowerCase()}`}
        onClick={() => {
          if (window.confirm(`Delete this ${kind.toLowerCase()}?`)) onDelete();
        }}
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
