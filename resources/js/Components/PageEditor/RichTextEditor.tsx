import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Heading1,
  Heading2,
  Heading3,
} from 'lucide-react'

// ... (MenuBar component remains the same) ...
const MenuBar = ({ editor }: { editor: any }) => {
  // ... keep existing MenuBar code ...
  if (!editor) {
    return null
  }

  return (
    <div className='flex flex-wrap gap-1 border-b border-gray-200 bg-gray-50 p-2'>
      {/* ... buttons ... */}
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`rounded p-1.5 hover:bg-gray-200 ${editor.isActive('bold') ? 'bg-gray-200 text-blue-600' : 'text-gray-600'}`}
        title='Bold'
      >
        <Bold className='h-4 w-4' />
      </button>
      {/* ... keep the rest of your buttons here ... */}
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={`rounded p-1.5 hover:bg-gray-200 ${editor.isActive('italic') ? 'bg-gray-200 text-blue-600' : 'text-gray-600'}`}
        title='Italic'
      >
        <Italic className='h-4 w-4' />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`rounded p-1.5 hover:bg-gray-200 ${editor.isActive('underline') ? 'bg-gray-200 text-blue-600' : 'text-gray-600'}`}
        title='Underline'
      >
        <UnderlineIcon className='h-4 w-4' />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={`rounded p-1.5 hover:bg-gray-200 ${editor.isActive('strike') ? 'bg-gray-200 text-blue-600' : 'text-gray-600'}`}
        title='Strikethrough'
      >
        <Strikethrough className='h-4 w-4' />
      </button>

      <div className='mx-1 h-6 w-px bg-gray-300' />

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`rounded p-1.5 hover:bg-gray-200 ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-200 text-blue-600' : 'text-gray-600'}`}
        title='Heading 1'
      >
        <Heading1 className='h-4 w-4' />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`rounded p-1.5 hover:bg-gray-200 ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200 text-blue-600' : 'text-gray-600'}`}
        title='Heading 2'
      >
        <Heading2 className='h-4 w-4' />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`rounded p-1.5 hover:bg-gray-200 ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-200 text-blue-600' : 'text-gray-600'}`}
        title='Heading 3'
      >
        <Heading3 className='h-4 w-4' />
      </button>

      <div className='mx-1 h-6 w-px bg-gray-300' />

      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`rounded p-1.5 hover:bg-gray-200 ${editor.isActive('bulletList') ? 'bg-gray-200 text-blue-600' : 'text-gray-600'}`}
        title='Bullet List'
      >
        <List className='h-4 w-4' />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`rounded p-1.5 hover:bg-gray-200 ${editor.isActive('orderedList') ? 'bg-gray-200 text-blue-600' : 'text-gray-600'}`}
        title='Ordered List'
      >
        <ListOrdered className='h-4 w-4' />
      </button>

      <div className='mx-1 h-6 w-px bg-gray-300' />

      <button
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        className={`rounded p-1.5 hover:bg-gray-200 ${editor.isActive({ textAlign: 'left' }) ? 'bg-gray-200 text-blue-600' : 'text-gray-600'}`}
        title='Align Left'
      >
        <AlignLeft className='h-4 w-4' />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        className={`rounded p-1.5 hover:bg-gray-200 ${editor.isActive({ textAlign: 'center' }) ? 'bg-gray-200 text-blue-600' : 'text-gray-600'}`}
        title='Align Center'
      >
        <AlignCenter className='h-4 w-4' />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        className={`rounded p-1.5 hover:bg-gray-200 ${editor.isActive({ textAlign: 'right' }) ? 'bg-gray-200 text-blue-600' : 'text-gray-600'}`}
        title='Align Right'
      >
        <AlignRight className='h-4 w-4' />
      </button>
    </div>
  )
}

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  editable?: boolean
}

export default function RichTextEditor({
  content,
  onChange,
  editable = true,
}: Readonly<RichTextEditorProps>) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: content,
    editable: editable,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        // Added 'h-full' here to ensure the internal prose div takes height
        class:
          'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl m-5 focus:outline-none min-h-[150px] h-full',
      },
    },
  })

  return (
    // Added 'h-full flex flex-col' to container
    <div className='flex h-full flex-col overflow-hidden rounded-md border border-gray-200 bg-white'>
      {editable && <MenuBar editor={editor} />}
      {/* Added 'flex-grow' to content wrapper so it fills the remaining space */}
      <EditorContent
        editor={editor}
        className='flex-grow [&>.ProseMirror]:h-full'
      />
    </div>
  )
}
