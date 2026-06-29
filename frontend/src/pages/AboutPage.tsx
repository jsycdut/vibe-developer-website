import cmbLogo from "../assets/cmb.webp";
import antLogo from "../assets/ant-group.png";
import cdutLogo from "../assets/cdut.png";
import damengLogo from "../assets/dameng.png";

const timeline = [
	{
		period: "2024.05 ~ 2026.04",
		company: "招商银行",
		role: "服务端开发工程师",
		desc: "就职于商家服务团队，负责重构日均订单流量过亿的商家后端系统",
		logo: cmbLogo,
	},
	{
		period: "2021.05 ~ 2024.04",
		company: "蚂蚁集团",
		role: "服务端开发工程师",
		desc: "就职于IoT服务端团队，负责服务于百万级别支付宝设备的服务端资源下发平台",
		logo: antLogo,
	},
	{
		period: "2018.07 ~ 2021.04",
		company: "达梦数据",
		role: "图算法开发工程师",
		desc: "就职于图算法开发团队，负责在数据库计算层实现经典图算法",
		logo: damengLogo,
	},
	{
		period: "2014.09 ~ 2018.06",
		company: "成都理工大学",
		role: "学生",
		desc: "信息科学与技术学院/计算机科学与技术专业",
		logo: cdutLogo,
	},
];

const skills = [
	{
		category: "后端混饭主力",
		items: [
			{ label: "Java", icon: "devicon-java-plain colored" },
			{ label: "Spring", icon: "devicon-spring-original colored" },
			{ label: "MySQL", icon: "devicon-mysql-original colored" },
			{ label: "Redis", icon: "devicon-redis-plain colored" },
			{ label: "Git", icon: "devicon-git-plain colored" },
			{ label: "Linux", icon: "devicon-linux-plain colored" },
			{ label: "Docker", icon: "devicon-docker-plain colored" },
			{ label: "Bash", icon: "devicon-bash-plain" },
		],
	},
	{
		category: "前端自己瞎玩",
		items: [
			{ label: "TypeScript", icon: "devicon-typescript-plain colored" },
			{ label: "React", icon: "devicon-react-original colored" },
			{ label: "Tailwind", icon: "devicon-tailwindcss-original colored" },
		],
	},
	{
		category: "其他自己瞎玩",
		items: [
			{ label: "Go", icon: "devicon-go-plain colored" },
			{ label: "Python", icon: "devicon-python-plain colored" },
			//{ label: "Clojure", icon: "devicon-clojure-plain colored" },
			{ label: "Emacs", icon: "devicon-emacs-original colored" },
			{ label: "Vim", icon: "devicon-vim-plain colored" },
			{ label: "Leetcode", icon: "devicon-leetcode-plain colored" },
		],
	},
];

const contacts = [
	{
		label: "GitHub",
		href: "https://github.com/jsycdut",
		icon: "devicon-github-original",
	},
	{ label: "jsycdut@gmail.com", href: "mailto:jsycdut@gmail.com", icon: null },
];

export default function AboutPage() {
	return (
		<div className="space-y-10">
			{/* 自我定位 */}
			<div>
				<h2 className="text-2xl font-normal text-slate-900 mb-3">关于我</h2>
				<p className="text-normal text-slate-500 leading-relaxed indent-8">
					自2018年毕业于成都理工大学，先后就职于达梦数据、蚂蚁集团和招商银行，主要工作领域为Java技术栈服务端开发，目前定居成都。编程的世界有很多有趣的东西，值得我不断去学习、探索、体验~，这个网站就是我对前端的探索支点，当然我主要的工作范围依然还是后端，欢迎联系我。
				</p>
				<div className="flex flex-wrap gap-3 pt-4">
					{contacts.map(({ label, href, icon }) => (
						<a
							key={label}
							href={href}
							rel="noopener noreferrer"
							className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 shadow-sm text-normal text-slate-700 hover:border-indigo-300 hover:text-indigo-600 transition-colors bg-white"
						>
							{icon && <i className={`${icon} text-base leading-none`} />}
							{label}
						</a>
					))}
					<a
						href="/resume.pdf"
						target="_blank"
						rel="noopener noreferrer"
						className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 shadow-sm text-normal text-bold text-slate-700 hover:border-indigo-300 hover:text-indigo-600 transition-colors bg-white"
					>
						📄 查看简历
					</a>
					<a
						href="/resume.pdf"
						download="金世钰-个人简历2026.pdf"
						className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 shadow-sm text-normal text-slate-700 hover:border-indigo-300 hover:text-indigo-600 transition-colors bg-white"
					>
						⬇️ 下载简历
					</a>
				</div>
			</div>
			{/* 技术栈 */}
			<div>
				<h3 className="font-semibold text-slate-900 mb-4">技术栈</h3>
				<div className="space-y-4">
					{skills.map(({ category, items }) => (
						<div key={category} className="flex items-start gap-4">
							<div className="text-xs text-slate-400 w-24 shrink-0 pt-1.5">
								{category}
							</div>
							<div className="flex flex-wrap gap-2">
								{items.map(({ label, icon }) => (
									<span
										key={label}
										className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white border border-slate-200 shadow-sm text-sm text-slate-700"
									>
										<i className={`${icon} text-base leading-none`} />
										{label}
									</span>
								))}
							</div>
						</div>
					))}
				</div>
			</div>

			{/* 工作经历 */}
			<div>
				<h3 className="font-semibold text-slate-900 mb-4">工作经历</h3>
				<div className="space-y-3">
					{timeline.map((item) => (
						<div
							key={item.company}
							className="flex gap-4 p-4 bg-white rounded-2xl border border-slate-100"
						>
							<div className="w-24 h-24 shrink-0 rounded-xl bg-white overflow-hidden">
								<img
									src={item.logo}
									className="w-full h-full object-contain p-1"
								/>
							</div>
							<div className="flex-1 min-w-0 mt-4">
								<div className="flex">
									<p className="font-semibold text-slate-900">{item.company}</p>
									<p className="text-slate-500 ml-2">{item.role}</p>
									<p className="text-slate-500 ml-2">{item.period}</p>
								</div>
								<p className="text-sm text-slate-400 mt-2 leading-relaxed">
									{item.desc}
								</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
