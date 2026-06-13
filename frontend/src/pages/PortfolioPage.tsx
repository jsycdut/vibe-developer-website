import { useNavigate } from 'react-router-dom'

const projects = [
  {
    title: '体育直播赛事链接解析',
    desc: '解析各大体育直播平台的赛事直播链接，提取有效播放源。',
    tag: 'Tool',
    action: null,
  },
  {
    title: '线上聊天室',
    desc: '基于 WebSocket + STOMP 的实时聊天室，支持多会话管理。',
    tag: 'Live',
    action: '/chat',
  },
  {
    title: 'A股历史数据',
    desc: '沪深两市历史行情数据查询与可视化分析，敬请期待。',
    tag: 'Data',
    action: null,
  },
]

export default function PortfolioPage() {
  const navigate = useNavigate()

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-8">作品集</h2>
      <div className="grid gap-6 md:grid-cols-3">
        {projects.map((p) => (
          <div
            key={p.title}
            onClick={() => p.action && navigate(p.action)}
            className={`bg-white rounded-2xl border border-slate-900/10 p-6 transition-all duration-200
              hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_#0f172a]
              ${p.action ? 'cursor-pointer' : 'opacity-70'}`}
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
  )
}
