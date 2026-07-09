import { NavLink, Outlet } from "react-router-dom";

const navItems = [
	{ to: "/", label: "主页 " },
	{ to: "/notes", label: "笔记" },
	{ to: "/portfolio", label: "个人项目" },
	{ to: "/about", label: "关于我" },
	{ to: "/sites", label: "sites" },
];

export default function PublicLayout() {
	return (
		<div className="min-h-screen bg-[#f8fafc]">
			<nav className="bg-white/80 backdrop-blur-md sticky top-0 border-b border-slate-900/10 z-50">
				<div className="max-w-4xl mx-auto px-6 h-16 flex justify-between items-center">
					<span className="text-indigo-500 italic text-lg tracking-tight">
						⚡ Happy Hacking ⚡
					</span>
					<div className="flex gap-6">
						{navItems.map(({ to, label }) => (
							<NavLink
								key={to}
								to={to}
								end={to === "/"}
								className={({ isActive }) =>
									isActive
										? "text-indigo-600 text-base italic underline"
										: "text-slate-400 hover:text-slate-900 transition-colors font-light"
								}
							>
								{label}
							</NavLink>
						))}
					</div>
				</div>
			</nav>
			<main className="max-w-4xl mx-auto px-6 py-10">
				<Outlet />
			</main>
			<footer className="border-t border-slate-100 mt-1">
				<div className="max-w-4xl mx-auto px-6 py-6 flex flex-col items-center">
					<p className="text-xs text-slate-400 font-mono tracking-wide">
						designed & made by jsy
					</p>
					<p>
						<a
							href="https://beian.miit.gov.cn/"
							target="_blank"
							className="text-xs text-blue-400 font-mono"
						>
							蜀ICP备2026038026号-1
						</a>
					</p>
				</div>
			</footer>
		</div>
	);
}
