"use client";

import {
  Undo2,
  Redo2,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Table2,
  ChevronDown,
  ChevronUp,
  Pipette,
} from "lucide-react";
import type { Editor } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import React from "react";

interface ToolbarProps {
  editor: Editor | null;
}

export default function Toolbar({ editor }: ToolbarProps) {
  const [isHeadingMenuOpen, setIsHeadingMenuOpen] = React.useState(false);
  const [isColorPickerOpen, setIsColorPickerOpen] = React.useState(false);
  const [color, setColor] = React.useState(
    editor?.getAttributes("textStyle").color || "#000000"
  );

  const currentColor = editor?.getAttributes("textStyle").color || "#000000";

  if (!editor) {
    return null;
  }
  return (
    <div className="sticky top-3 flex flex-wrap items-center gap-2 px-4 py-3 bg-white dark:bg-[#333334] border border-gray-300 dark:border-[#272728] rounded-t-md z-50">
      <Button
        variant="outline"
        size="icon"
        onClick={(e) => {
          e.preventDefault();
          editor.commands.undo();
        }}
        disabled={!editor.can().chain().focus().undo().run()}
        aria-disabled={!editor.can().chain().focus().undo().run()}
      >
        <Undo2 className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={(e) => {
          e.preventDefault();
          editor.commands.redo();
        }}
        disabled={!editor.can().chain().focus().redo().run()}
        aria-disabled={!editor.can().chain().focus().redo().run()}
      >
        <Redo2 className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={(e) => {
          e.preventDefault();
          editor.commands.toggleBold();
        }}
        className={`${
          editor.isActive("bold") ? "bg-gray-200 dark:bg-gray-700" : ""
        }`}
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={(e) => {
          e.preventDefault();
          editor.commands.toggleItalic();
        }}
        className={`${
          editor.isActive("italic") ? "bg-gray-200 dark:bg-gray-700" : ""
        }`}
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={(e) => {
          e.preventDefault();
          editor.commands.toggleUnderline();
        }}
        className={`${
          editor.isActive("underline") ? "bg-gray-200 dark:bg-gray-700" : ""
        }`}
      >
        <Underline className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={(e) => {
          e.preventDefault();
          editor.commands.toggleStrike();
        }}
        className={`${
          editor.isActive("strike") ? "bg-gray-200 dark:bg-gray-700" : ""
        }`}
      >
        <Strikethrough className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleBulletList().run();
        }}
        className={`${
          editor.isActive("bulletList") ? "bg-gray-200 dark:bg-gray-700" : ""
        }`}
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleOrderedList().run();
        }}
        className={`${
          editor.isActive("orderedList") ? "bg-gray-200 dark:bg-gray-700" : ""
        }`}
      >
        <ListOrdered className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleBlockquote().run();
        }}
        className={`${
          editor.isActive("blockquote") ? "bg-gray-200 dark:bg-gray-700" : ""
        }`}
      >
        <Quote className="h-4 w-4" />
      </Button>
      <DropdownMenu onOpenChange={(open) => setIsHeadingMenuOpen(open)}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="default"
            className="dark:text-gray-400 dark:hover:text-gray-300"
          >
            {editor.isActive("heading", { level: 1 })
              ? "Heading 1"
              : editor.isActive("heading", { level: 2 })
              ? "Heading 2"
              : editor.isActive("heading", { level: 3 })
              ? "Heading 3"
              : "Normal Text"}
            {isHeadingMenuOpen ? (
              <ChevronUp className="ml-2 h-4 w-4" />
            ) : (
              <ChevronDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="dark:bg-gray-800 dark:border-gray-700">
          <DropdownMenuItem
            onClick={() => {
              editor.chain().focus().setParagraph().run();
            }}
            className={`${
              editor.isActive("paragraph") ? "bg-gray-200 dark:bg-gray-700" : ""
            } cursor-pointer`}
          >
            Normal Text
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              editor.chain().focus().toggleHeading({ level: 1 }).run();
            }}
            className={`${
              editor.isActive("heading", { level: 1 })
                ? "bg-gray-200 dark:bg-gray-700"
                : ""
            } cursor-pointer`}
          >
            <Heading1 className="h-4 w-4" />
            <p className="text-xl font-semibold">Heading 1</p>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              editor.chain().focus().toggleHeading({ level: 2 }).run();
            }}
            className={`${
              editor.isActive("heading", { level: 2 })
                ? "bg-gray-200 dark:bg-gray-700"
                : ""
            } cursor-pointer`}
          >
            <Heading2 className="h-4 w-4" />
            <p className="text-lg font-semibold">Heading 2</p>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              editor.chain().focus().toggleHeading({ level: 3 }).run();
            }}
            className={`${
              editor.isActive("heading", { level: 3 })
                ? "bg-gray-200 dark:bg-gray-700"
                : ""
            } cursor-pointer`}
          >
            <Heading3 className="h-4 w-4" />
            <p className="text-md font-semibold">Heading 3</p>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu onOpenChange={(open) => setIsColorPickerOpen(open)}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="default"
            className="dark:text-gray-400 dark:hover:text-gray-300"
          >
            <div
              className="h-4 w-4 rounded"
              style={{ backgroundColor: currentColor }}
            />
            {isColorPickerOpen ? (
              <ChevronUp className="ml-2 h-4 w-4" />
            ) : (
              <ChevronDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="flex flex-wrap dark:bg-gray-800 dark:border-gray-700">
          <DropdownMenuItem
            onClick={() => {
              editor.chain().focus().setColor("#FF0000").run();
            }}
            className="cursor-pointer dark:hover:bg-gray-700 dark:focus:bg-gray-700"
          >
            <div className="size-6 bg-red-500 rounded" />
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              editor.chain().focus().setColor("#00FF00").run();
            }}
            className="cursor-pointer dark:hover:bg-gray-700 dark:focus:bg-gray-700"
          >
            <div className="size-6 bg-green-500 rounded" />
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              editor.chain().focus().setColor("#0000FF").run();
            }}
            className="cursor-pointer dark:hover:bg-gray-700 dark:focus:bg-gray-700"
          >
            <div className="size-6 bg-blue-500 rounded" />
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              editor.chain().focus().setColor("#FFC107").run();
            }}
            className="cursor-pointer dark:hover:bg-gray-700 dark:focus:bg-gray-700"
          >
            <div className="size-6 bg-yellow-500 rounded" />
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              editor.chain().focus().setColor("#FFA500").run();
            }}
            className="cursor-pointer dark:hover:bg-gray-700 dark:focus:bg-gray-700"
          >
            <div className="size-6 bg-orange-500 rounded" />
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              editor.chain().focus().setColor("#800080").run();
            }}
            className="cursor-pointer dark:hover:bg-gray-700 dark:focus:bg-gray-700"
          >
            <div className="size-6 bg-purple-500 rounded" />
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              editor.chain().focus().setColor("#000000").run();
            }}
            className="cursor-pointer dark:hover:bg-gray-700 dark:focus:bg-gray-700"
          >
            <div className="size-6 bg-black rounded dark:bg-white" />
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer dark:hover:bg-gray-700 dark:focus:bg-gray-700"
            onClick={() => {
              document.getElementById("color-picker")?.click();
            }}
          >
            <Pipette className="size-4 dark:text-gray-300" />
            <input
              id="color-picker"
              type="color"
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => {
                e.preventDefault();
                setColor(e.target.value);
                editor.chain().focus().setColor(e.target.value).run();
              }}
              value={color}
              data-testid="color-picker"
              className="size-6 border-0 p-0 opacity-0 absolute cursor-pointer"
            />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Button
        variant="outline"
        size="icon"
        onClick={() => {
          editor.chain().focus().setTextAlign("left").run();
        }}
        className={`${
          editor.isActive({ textAlign: "left" })
            ? "bg-gray-200 dark:bg-gray-700"
            : ""
        }`}
      >
        <AlignLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().setTextAlign("center").run();
        }}
        className={`${
          editor.isActive({ textAlign: "center" })
            ? "bg-gray-200 dark:bg-gray-700"
            : ""
        }`}
      >
        <AlignCenter className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().setTextAlign("right").run();
        }}
        className={`${
          editor.isActive({ textAlign: "right" })
            ? "bg-gray-200 dark:bg-gray-700"
            : ""
        }`}
      >
        <AlignRight className="h-4 w-4" />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="dark:text-gray-400 dark:hover:text-gray-300"
          >
            <Table2 className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="dark:bg-gray-800 dark:border-gray-700">
          <DropdownMenuItem
            onClick={() => {
              editor
                .chain()
                .focus()
                .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                .run();
            }}
            className="cursor-pointer"
          >
            Insert table
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              editor.chain().focus().addColumnBefore().run();
            }}
            className="cursor-pointer"
          >
            Add column before
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              editor.chain().focus().addColumnAfter().run();
            }}
            className="cursor-pointer"
          >
            Add column after
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              editor.chain().focus().deleteColumn().run();
            }}
            className="cursor-pointer"
          >
            Delete column
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              editor.chain().focus().addRowBefore().run();
            }}
            className="cursor-pointer"
          >
            Add row before
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              editor.chain().focus().addRowAfter().run();
            }}
            className="cursor-pointer"
          >
            Add row after
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              editor.chain().focus().deleteRow().run();
            }}
            className="cursor-pointer"
          >
            Delete row
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              editor.chain().focus().mergeCells().run();
            }}
            className="cursor-pointer"
          >
            Merge cells
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              editor.chain().focus().splitCell().run();
            }}
            className="cursor-pointer"
          >
            Split cell
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              editor.chain().focus().deleteTable().run();
            }}
            className="cursor-pointer"
          >
            Delete table
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
