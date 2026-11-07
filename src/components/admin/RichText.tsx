"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { Bold, Italic, Heading2, Heading3, List, ListOrdered, Quote, Code2, Link2, ImageIcon, Undo2, Redo2, Pilcrow } from "lucide-react";
import { useAdmin } from "@/lib/admin/ctx";
import { uploadImage } from "./upload";

export function RichText({ value, onChange }: { value: string; onChange: (html: string) => void }) {
  const { db, toast } = useAdmin();
  const editor = useEditor({
    extensions: [StarterKit.configure({ heading: { levels: [2, 3] }, link: { openOnClick: false, autolink: true } }), Image],
    content: value, immediatelyRender: false,
    editorProps: { attributes: { class: "prose-ig !max-w-none focus:outline-none", "aria-label": "Rich text editor" } },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });
  if (!editor) return <div className="h-64 animate-pulse rounded-lg border border-line bg-paper" />;

  const Btn = ({ on, active, label, children, disabled }: { on: () => void; active?: boolean; label: string; children: React.ReactNode; disabled?: boolean }) => (
    <button type="button" onClick={on} disabled={disabled} title={label} aria-label={label} aria-pressed={active} className={`grid h-10 w-10 place-items-center rounded-lg transition ${active ? "bg-brand text-white" : "hover:bg-paper"} disabled:opacity-40`}>{children}</button>
  );
  const link = () => {
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL (leave empty to remove)", prev ?? "https://");
    if (url === null) return;
    if (url === "") return void editor.chain().focus().unsetLink().run();
    if (!/^(https?:\/\/|mailto:|\/)/i.test(url)) return toast("err", "Links must start with https://, mailto: or /");
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };
  const image = () => {
    const input = document.createElement("input"); input.type = "file"; input.accept = "image/*";
    input.onchange = async () => {
      const f = input.files?.[0]; if (!f) return;
      try { const url = await uploadImage(db, f, "blog"); const alt = window.prompt("Image alt text (describe the image)", "") ?? ""; editor.chain().focus().setImage({ src: url, alt }).run(); }
      catch (e) { toast("err", (e as Error).message); }
    };
    input.click();
  };
  return (
    <div className="overflow-hidden rounded-lg border border-line bg-white focus-within:border-brand focus-within:ring-4 focus-within:ring-brand/10">
      <div className="flex flex-wrap gap-0.5 border-b border-line bg-paper/60 p-1.5" role="toolbar" aria-label="Formatting">
        <Btn label="Paragraph" on={() => editor.chain().focus().setParagraph().run()} active={editor.isActive("paragraph")}><Pilcrow className="h-5 w-5" /></Btn>
        <Btn label="Heading 2" on={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })}><Heading2 className="h-5 w-5" /></Btn>
        <Btn label="Heading 3" on={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })}><Heading3 className="h-5 w-5" /></Btn>
        <Btn label="Bold" on={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")}><Bold className="h-5 w-5" /></Btn>
        <Btn label="Italic" on={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")}><Italic className="h-5 w-5" /></Btn>
        <Btn label="Bullet list" on={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")}><List className="h-5 w-5" /></Btn>
        <Btn label="Numbered list" on={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")}><ListOrdered className="h-5 w-5" /></Btn>
        <Btn label="Quote" on={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")}><Quote className="h-5 w-5" /></Btn>
        <Btn label="Code block" on={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive("codeBlock")}><Code2 className="h-5 w-5" /></Btn>
        <Btn label="Link" on={link} active={editor.isActive("link")}><Link2 className="h-5 w-5" /></Btn>
        <Btn label="Insert image" on={image}><ImageIcon className="h-5 w-5" /></Btn>
        <span className="mx-1 w-px bg-line" />
        <Btn label="Undo" on={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}><Undo2 className="h-5 w-5" /></Btn>
        <Btn label="Redo" on={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}><Redo2 className="h-5 w-5" /></Btn>
      </div>
      <div className="tt-editor max-h-[640px] overflow-y-auto"><EditorContent editor={editor} /></div>
    </div>
  );
}
