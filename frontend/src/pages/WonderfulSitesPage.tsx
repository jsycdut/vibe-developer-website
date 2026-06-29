import { useState, useEffect, useRef } from "react";
// import api from "../lib/api";

interface Site {
	id: number;
	name: string;
	category: string;
	tags: string[];
	description: string;
	url: string;
}

// 模拟数据，后端就绪后删除，改用 api.get("/sites/list", { params: { q } })
const MOCK: Site[] = [
	{
		id: 1,
		name: "LeetCode",
		category: "算法",
		tags: ["刷题"],
		description: "最适合非竞赛选手的刷题网站",
		url: "https://leetcode.cn",
	},
	{
		id: 2,
		name: "Excalidraw",
		category: "工具",
		tags: ["画图", "白板"],
		description: "简洁好用的手绘风格在线白板",
		url: "https://excalidraw.com",
	},
	{
		id: 3,
		name: "Hacker News",
		category: "社区",
		tags: ["资讯", "技术"],
		description: "YC 旗下的技术资讯聚合社区",
		url: "https://news.ycombinator.com",
	},
	{
		id: 4,
		name: "Typst",
		category: "排版",
		tags: ["文档", "LaTeX替代"],
		description: "现代化的排版系统，LaTeX 的有力替代",
		url: "https://typst.app",
	},
	{
		id: 5,
		name: "Roadmap.sh",
		category: "学习",
		tags: ["路线图", "技术"],
		description: "各技术方向的学习路线图",
		url: "https://roadmap.sh",
	},
];

function mockSearch(q: string): Site[] {
	const kw = q.trim().toLowerCase();
	if (!kw) return MOCK;
	return MOCK.filter(
		(s) =>
			s.name.toLowerCase().includes(kw) ||
			s.category.toLowerCase().includes(kw) ||
			s.tags.some((t) => t.toLowerCase().includes(kw)) ||
			s.description.toLowerCase().includes(kw),
	);
}

export default function WonderfulSites() {
	const [query, setQuery] = useState("");
	const [sites, setSites] = useState<Site[]>(MOCK);
	const [loading, setLoading] = useState(false);
	const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		if (debounceRef.current) clearTimeout(debounceRef.current);
		debounceRef.current = setTimeout(async () => {
			setLoading(true);
			// 后端就绪后替换为：
			// const res = await api.get("/sites/list", { params: { q: query } });
			// setSites(res.data.items);
			setSites(mockSearch(query));
			setLoading(false);
		}, 300);
	}, [query]);

	return (
		<div>
			<h2 className="text-2xl font-normal text-slate-900 mb-6">网站收藏</h2>

			<input
				type="text"
				value={query}
				onChange={(e) => setQuery(e.target.value)}
				placeholder="搜索名称、类别、标签、描述..."
				className="w-full mb-6 px-4 py-2 rounded-xl border border-slate-200 shadow-sm text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
			/>

			<div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
				<table className="w-full text-sm">
					<thead>
						<tr className="border-b border-slate-100 text-left text-slate-500 text-xs uppercase tracking-wide">
							<th className="px-5 py-3 font-medium">名称</th>
							<th className="px-5 py-3 font-medium">类别</th>
							<th className="px-5 py-3 font-medium">标签</th>
							<th className="px-5 py-3 font-medium">描述</th>
							<th className="px-5 py-3 font-medium">操作</th>
						</tr>
					</thead>
					<tbody>
						{loading ? (
							<tr>
								<td
									colSpan={5}
									className="px-5 py-10 text-center text-slate-400"
								>
									搜索中...
								</td>
							</tr>
						) : sites.length === 0 ? (
							<tr>
								<td
									colSpan={5}
									className="px-5 py-10 text-center text-slate-400"
								>
									没有找到相关网站
								</td>
							</tr>
						) : (
							sites.map((site, i) => (
								<tr
									key={site.id}
									className={`border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors ${i % 2 === 0 ? "" : "bg-slate-50/50"}`}
								>
									<td className="px-5 py-3 font-medium text-slate-900">
										{site.name}
									</td>
									<td className="px-5 py-3 text-slate-500">{site.category}</td>
									<td className="px-5 py-3">
										<div className="flex flex-wrap gap-1">
											{site.tags.map((tag) => (
												<span
													key={tag}
													className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-500 text-xs"
												>
													{tag}
												</span>
											))}
										</div>
									</td>
									<td className="px-5 py-3 text-slate-500 max-w-xs">
										{site.description}
									</td>
									<td className="px-5 py-3">
										<a
											href={site.url}
											target="_blank"
											rel="noopener noreferrer"
											className="text-indigo-500 hover:text-indigo-700 font-medium transition-colors"
										>
											Go →
										</a>
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}
