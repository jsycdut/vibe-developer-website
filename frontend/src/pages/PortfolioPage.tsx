import { useNavigate } from "react-router-dom";

const projects = [
	{
		title: "体育直播赛事链接解析",
		desc: "解析免费的体育赛事直播链接，涵盖NBA，WNBA，NFL,F1，UFC，足球等赛事，赛事解说来自海外。",
		tag: "Tool",
		action: "https://github.com/jsycdut/live-game-stream-thief",
		external: true,
	},
	{
		title: "Emacs配置",
		desc: "我以前是一个vim用户，现在我是一个在Emacs中使用Vim按键特性(Evil)的用户，这是我的Emacs配置",
		tag: "编辑器",
		action: "https://github.com/jsycdut/emacs.d",
		external: true,
	},
	{
		title: "Leetcode",
		desc: "我的Leetcode算法刷题记录",
		tag: "算法",
		action: "https://github.com/jsycdut/leetcode",
		external: true,
	},
];

export default function PortfolioPage() {
	const navigate = useNavigate();

	return (
		<div>
			<h2 className="text-2xl font-bold text-slate-900 mb-8">Code</h2>
			<div className="grid gap-6 md:grid-cols-3">
				{projects.map((p) => (
					<div
						key={p.title}
						onClick={() => {
							if (!p.action) {
								return;
							}

							if (p.external) {
								window.open(p.action, "_blank");
							} else {
								p.action && navigate(p.action);
							}
						}}
						className={`bg-white rounded-2xl border border-slate-200 shadow-sm p-6 transition-all duration-200
              hover:-translate-y-1 hover:shadow-md
              ${p.action ? "cursor-pointer" : "opacity-70"}`}
					>
						<span className="inline-block px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-xs mb-3">
							{p.tag}
						</span>
						<h3 className="font-bold text-slate-900 mb-2">{p.title}</h3>
						<p className="text-sm text-slate-500">{p.desc}</p>
						{p.action && (
							<p className="text-xs text-blue-500 mt-3">点击进入 →</p>
						)}
					</div>
				))}
			</div>
		</div>
	);
}
