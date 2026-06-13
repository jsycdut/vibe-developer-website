import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../lib/api'

interface Note {
  id: string
  title: string
  createdAt: string
}

export default function NotesListPage() {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/notes').then((res) => {
      setNotes(res.data)
      setLoading(false)
    })
  }, [])

  if (loading) return <div className="text-slate-400 py-10 text-center">加载中...</div>
  if (!notes.length) return <div className="text-slate-400 py-10 text-center">暂无笔记</div>

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-8">笔记</h2>
      <div className="space-y-2">
        {notes.map((note) => (
          <Link
            key={note.id}
            to={`/notes/${note.id}`}
            className="flex items-baseline gap-6 group py-2 border-b border-slate-100 hover:border-slate-300 transition-colors"
          >
            <span className="text-sm text-slate-400 shrink-0 font-mono">
              {note.createdAt?.slice(0, 10)}
            </span>
            <span className="text-slate-800 group-hover:text-blue-600 transition-colors">
              {note.title}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
