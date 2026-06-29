import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../lib/api";

interface Note {
	slug: string;
	title: string;
	content: string;
	releaseDate: string;
}

interface Comment {
	id: string;
	nickname: string;
	content: string;
	createdAt: string;
}

export default function NoteDetailPage() {
	const { slug } = useParams<{ slug: string }>();
	const [note, setNote] = useState<Note | null>(null);
	const [comments, setComments] = useState<Comment[]>([]);
	const [nickname, setNickname] = useState("");
	const [commentText, setCommentText] = useState("");
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		api.get(`/article/detail/${slug}`).then((res) => setNote(res.data));
		api.get(`/notes/${slug}/comments`).then((res) => setComments(res.data));
	}, [slug]);

	const submitComment = async () => {
		if (!nickname.trim() || !commentText.trim() || !slug) return;
		setSubmitting(true);
		const res = await api.post(`/notes/${slug}/comments`, {
			nickname: nickname.trim(),
			content: commentText.trim(),
		});
		setComments((prev) => [...prev, res.data]);
		setCommentText("");
		setSubmitting(false);
	};

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

			{/* 评论区 */}
			{/*
			<div className="bg-white rounded-2xl border border-slate-900/10 p-8">
				<h3 className="font-bold text-slate-900 mb-6">
					💬 参与探讨 ({comments.length} 条评论)
				</h3>

				<div className="flex gap-3 mb-6">
					<input
						type="text"
						placeholder="你的昵称"
						value={nickname}
						onChange={(e) => setNickname(e.target.value)}
						className="w-32 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
					/>
					<input
						type="text"
						placeholder="写下你的想法..."
						value={commentText}
						onChange={(e) => setCommentText(e.target.value)}
						onKeyDown={(e) => e.key === "Enter" && submitComment()}
						className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
					/>
					<button
						onClick={submitComment}
						disabled={submitting}
						className="px-4 py-2 bg-slate-900 text-white text-sm rounded-lg hover:bg-slate-700 transition-colors disabled:opacity-50"
					>
						提交
					</button>
				</div>

				<div className="space-y-4">
					{comments.map((c) => (
						<div key={c.id} className="flex gap-3">
							<div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 shrink-0">
								{c.nickname[0]?.toUpperCase()}
							</div>
							<div>
								<div className="flex items-baseline gap-2 mb-1">
									<span className="text-sm font-medium text-slate-800">
										{c.nickname}
									</span>
									<span className="text-xs text-slate-400">
										{c.createdAt?.slice(0, 16).replace("T", " ")}
									</span>
								</div>
								<p className="text-sm text-slate-600">{c.content}</p>
							</div>
						</div>
					))}
				</div>
				</div>*/}
		</div>
	);
}
