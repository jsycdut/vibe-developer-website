const timeline = [
  { period: '2024.05 ~ 2026.04', company: '招商银行', color: 'bg-blue-500' },
  { period: '2024.05 ~ 2026.04', company: '蚂蚁集团', color: 'bg-green-500' },
]

export default function AboutPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-8">关于我</h2>
      <div className="bg-white rounded-2xl border border-slate-900/10 p-8 mb-8">
        <p className="text-slate-600 leading-relaxed">
          一名热爱技术的全栈开发者，专注于 Java 后端和 React 前端的融合实践。
          喜欢用工程化的思维解决问题，相信好的架构能让代码保持生命力。
        </p>
      </div>

      <h3 className="font-bold text-slate-900 mb-4">工作经历</h3>
      <div className="space-y-3">
        {timeline.map((item) => (
          <div
            key={item.company}
            className="flex items-center gap-4 bg-white rounded-full border border-slate-900/10 px-6 py-4 shadow-[2px_2px_0px_0px_#0f172a]"
          >
            <div className={`w-3 h-3 rounded-full ${item.color} shrink-0`} />
            <span className="text-sm text-slate-500 font-mono shrink-0">{item.period}</span>
            <span className="font-bold text-slate-900">{item.company}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
