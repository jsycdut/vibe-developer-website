import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../lib/api";

interface Note {
	slug: string;
	id: string;
	title: string;
	releaseDate: string;
	author: string;
}

const PAGE_SIZE = 8;

export default function NotesListPage() {
	const [notes, setNotes] = useState<Note[]>([]);
	const [loading, setLoading] = useState(true);
	const [page, setPage] = useState(0);
	const [total, setTotal] = useState(0);

	useEffect(() => {
		setLoading(true);
		api.get("/article/list", { params: { page, size: PAGE_SIZE } }).then((res) => {
			setNotes(res.data.content);
			setTotal(res.data.total);
			setLoading(false);
		});
	}, [page]);

	const totalPages = Math.ceil(total / PAGE_SIZE);

	if (loading)
		return <div className="text-slate-400 py-10 text-center">加载中...</div>;
	if (!notes.length)
		return <div className="text-slate-400 py-10 text-center">暂无笔记</div>;

	return (
		<div>
			<h2 className="text-2xl font-bold text-slate-900 mb-8">笔记</h2>
			<div className="space-y-2">
				{notes.map((note) => (
					<Link
						key={note.slug}
						to={`/notes/${note.slug}`}
						className="flex items-baseline gap-6 group py-2 border-b border-slate-100 hover:border-slate-300 transition-colors"
					>
						<span className="text-sm text-slate-400 shrink-0 font-mono">
							{note.releaseDate?.slice(0, 10)}
						</span>
						<span className="text-slate-800 group-hover:text-blue-600 transition-colors">
							{note.title}
						</span>
					</Link>
				))}
			</div>

			{totalPages > 1 && (
				<div className="flex items-center justify-center gap-2 mt-8">
					<button
						onClick={() => setPage((p) => p - 1)}
						disabled={page === 0}
						className="px-3 py-1 text-sm rounded-lg border border-slate-200 text-slate-600 hover:border-slate-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
					>
						上一页
					</button>
					<span className="text-sm text-slate-400">
						{page + 1} / {totalPages}
					</span>
					<button
						onClick={() => setPage((p) => p + 1)}
						disabled={page >= totalPages - 1}
						className="px-3 py-1 text-sm rounded-lg border border-slate-200 text-slate-600 hover:border-slate-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
					>
						下一页
					</button>
				</div>
			)}
		</div>
	);
}
