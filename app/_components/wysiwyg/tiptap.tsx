"use client";

import Toolbar from "./toolbar";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import { Color } from "@tiptap/extension-color";
import { useEffect } from "react";
import { Table } from "@tiptap/extension-table";
import { TextStyle } from "@tiptap/extension-text-style";

interface TiptapProps {
  content: string;
  onChange: (content: string) => void;
}

const Tiptap = ({ content, onChange }: TiptapProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Table.configure({
        resizable: true,
      }),
      TableHeader,
      TableRow,
      TableCell,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      TextStyle,
      Color,
    ],
    content: content,
    editorProps: {
      attributes: {
        class:
          "flex flex-col px-4 py-3 justify-start border border-t-0 border-gray-300 dark:border-gray-700 rounded-b-md focus-visible:outline-none bg-white dark:bg-[#333334] dark:text-dark-text prose dark:prose-invert max-w-none",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  return (
    <div className="relative w-full">
      <Toolbar editor={editor} />
      <EditorContent className="custom-markdown" editor={editor} />
    </div>
  );
};

export default Tiptap;
