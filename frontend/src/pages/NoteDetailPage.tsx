import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../lib/api";

interface Note {
	slug: string;
	title: string;
	content: string;
	releaseDate: string;
}

export default function NoteDetailPage() {
	const { slug } = useParams<{ slug: string }>();
	const [note, setNote] = useState<Note | null>(null);

	useEffect(() => {
		api.get(`/article/detail/${slug}`).then((res) => setNote(res.data));
	}, [slug]);

	if (!note)
		return <div className="text-slate-400 py-10 text-center">加载中...</div>;

	return (
		<div>
			<h1 className="text-3xl font-bold text-slate-900 mb-2">{note.title}</h1>
			<p className="text-sm text-slate-400 mb-8 font-mono">
				{note.releaseDate?.slice(0, 10)}
			</p>

			<div className="bg-white rounded-2xl border border-slate-900/10 p-8 mb-10">
				<div
					className="prose prose-slate max-w-none text-lg"
					dangerouslySetInnerHTML={{ __html: note.content }}
				/>
			</div>
		</div>
	);
}
