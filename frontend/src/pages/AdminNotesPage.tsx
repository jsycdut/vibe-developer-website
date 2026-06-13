import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Search, X } from 'lucide-react'
import api from '../lib/api'

interface Note {
  id: string
  title: string
  createdAt: string
}

interface NoteForm {
  title: string
  content: string
}

export default function AdminNotesPage() {
  const [notes, setNotes] = useState<Note[]>([])
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState<NoteForm>({ title: '', content: '' })
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const load = () => api.get('/notes').then((r) => setNotes(r.data))
  useEffect(() => { load() }, [])

  const filtered = notes.filter((n) =>
    n.title.toLowerCase().includes(search.toLowerCase())
  )

  const openCreate = () => {
    setEditId(null)
    setForm({ title: '', content: '' })
    setShowForm(true)
  }

  const openEdit = (id: string) => {
    api.get(`/notes/${id}`).then((r) => {
      setEditId(id)
      setForm({ title: r.data.title, content: r.data.content })
      setShowForm(true)
    })
  }

  const save = async () => {
    if (!form.title.trim()) return
    if (editId) {
      await api.put(`/notes/${editId}`, form)
    } else {
      await api.post('/notes', form)
    }
    setShowForm(false)
    load()
  }

  const confirmDelete = async () => {
    if (!deleteId) return
    await api.delete(`/notes/${deleteId}`)
    setDeleteId(null)
    load()
  }

  return (
    <div className="p-6 md:p-0">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-900">笔记管理</h2>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm rounded-lg hover:bg-slate-700 transition-colors"
        >
          <Plus size={14} /> 新建
        </button>
      </div>

      <div className="relative mb-4">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="搜索标题..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        />
      </div>

      <div className="bg-white rounded-2xl border border-slate-900/10 overflow-hidden">
        {filtered.length === 0 ? (
          <p className="text-slate-400 text-sm text-center py-10">暂无笔记</p>
        ) : (
          filtered.map((note) => (
            <div key={note.id} className="flex items-center justify-between px-4 py-3 border-b border-slate-100 last:border-0">
              <div>
                <p className="text-sm font-medium text-slate-800">{note.title}</p>
                <p className="text-xs text-slate-400 mt-0.5">{note.createdAt?.slice(0, 10)}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(note.id)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500">
                  <Pencil size={14} />
                </button>
                <button onClick={() => setDeleteId(note.id)} className="p-1.5 hover:bg-red-50 rounded-lg text-red-400">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 编辑/新建弹窗 */}
      {showForm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-slate-900/10 shadow-[4px_4px_0px_0px_#0f172a] w-full max-w-2xl">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h3 className="font-bold text-slate-900">{editId ? '编辑笔记' : '新建笔记'}</h3>
              <button onClick={() => setShowForm(false)} className="p-1 hover:bg-slate-100 rounded-lg">
                <X size={16} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <input
                type="text"
                placeholder="标题"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              <textarea
                placeholder="Markdown 内容..."
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                rows={12}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-mono text-sm resize-none"
              />
            </div>
            <div className="flex justify-end gap-3 p-6 pt-0">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">
                取消
              </button>
              <button onClick={save} className="px-4 py-2 text-sm bg-slate-900 text-white rounded-lg hover:bg-slate-700">
                保存
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 删除确认弹窗 */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-slate-900/10 shadow-[4px_4px_0px_0px_#0f172a] p-6 max-w-sm w-full">
            <h3 className="font-bold text-slate-900 mb-2">确认删除</h3>
            <p className="text-sm text-slate-500 mb-6">删除后不可恢复，确定要删除这篇笔记吗？</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">
                取消
              </button>
              <button onClick={confirmDelete} className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600">
                删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
