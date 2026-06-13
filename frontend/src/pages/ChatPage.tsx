import { useState, useRef, useEffect, useMemo } from 'react'
import { ArrowLeft, Plus, Smile, Image as ImageIcon, Film } from 'lucide-react'
import EmojiPicker from 'emoji-picker-react'
import { useNavigate } from 'react-router-dom'
import { useStompClient } from '../hooks/useStompClient'
import api from '../lib/api'

interface ChatMsg {
  id?: string
  sessionId: string
  senderName: string
  fromChatter: boolean
  messageType: 'TEXT' | 'IMAGE' | 'VIDEO'
  content: string
  fileUrl?: string
  sentAt?: string
}

function generateUUID() {
  if (crypto.randomUUID) return crypto.randomUUID()
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })
}

function formatTime(sentAt?: string): string {
  const d = sentAt ? new Date(sentAt) : new Date()
  const now = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  const hhmm = `${pad(d.getHours())}:${pad(d.getMinutes())}`
  if (d.toDateString() === now.toDateString()) return hhmm
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  if (d.toDateString() === yesterday.toDateString()) return `昨天 ${hhmm}`
  return `${d.getMonth() + 1}月${d.getDate()}日 ${hhmm}`
}

function needsTimestamp(prev: ChatMsg | undefined, curr: ChatMsg): boolean {
  if (!prev) return true
  const a = prev.sentAt ? new Date(prev.sentAt).getTime() : 0
  const b = curr.sentAt ? new Date(curr.sentAt).getTime() : Date.now()
  return b - a > 5 * 60 * 1000
}

// 头像：圆角方块 + 首字母，和微信风格一致
function Avatar({ name, color }: { name: string; color: string }) {
  return (
    <div
      className="shrink-0 w-10 h-10 rounded-[6px] flex items-center justify-center text-white text-sm font-semibold"
      style={{ background: color }}
    >
      {name[0]?.toUpperCase() ?? '?'}
    </div>
  )
}

// 气泡尖角（CSS 三角形）
function Tail({ side, color }: { side: 'left' | 'right'; color: string }) {
  const base: React.CSSProperties = {
    position: 'absolute',
    top: 10,
    width: 0,
    height: 0,
    borderTop: '5px solid transparent',
    borderBottom: '5px solid transparent',
  }
  return (
    <div
      style={
        side === 'left'
          ? { ...base, left: -6, borderRight: `7px solid ${color}` }
          : { ...base, right: -6, borderLeft: `7px solid ${color}` }
      }
    />
  )
}

export default function ChatPage() {
  const navigate = useNavigate()
  const sessionId = useMemo(() => generateUUID(), [])
  const [nickname, setNickname] = useState('')
  const [inputNick, setInputNick] = useState('')
  const [joined, setJoined] = useState(false)
  const [messages, setMessages] = useState<ChatMsg[]>([])
  const [inputText, setInputText] = useState('')
  const [panel, setPanel] = useState<'emoji' | 'attach' | null>(null)
  const [uploadProgress, setUploadProgress] = useState<number | null>(null)

  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const photoInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)

  const subscriptions = [`/queue/session/${sessionId}`, `/queue/session/${sessionId}/joined`]

  const { send, connected } = useStompClient({
    subscriptions,
    onMessage: (_dest, body) => {
      const data = body as ChatMsg & { guestNickname?: string }
      if (data.guestNickname) {
        setJoined(true)
      } else if (data.sessionId === sessionId) {
        setMessages((prev) => [...prev, data])
      }
    },
  })

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const resizeTextarea = () => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 120) + 'px'
  }

  const handleJoin = () => {
    if (!inputNick.trim()) return
    setNickname(inputNick.trim())
    send('/app/chat.join', { sessionId, guestNickname: inputNick.trim() })
    setJoined(true)
  }

  const sendText = () => {
    if (!inputText.trim() || !joined) return
    send('/app/chat.send', {
      sessionId,
      senderName: nickname,
      fromChatter: false,
      messageType: 'TEXT',
      content: inputText.trim(),
    })
    setInputText('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
  }

  const uploadAndSend = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    setUploadProgress(0)
    try {
      const res = await api.post('/upload', formData, {
        timeout: 0,
        onUploadProgress: (e) => {
          if (e.total) setUploadProgress(Math.round((e.loaded / e.total) * 100))
        },
      })
      const type: 'IMAGE' | 'VIDEO' = file.type.startsWith('video') ? 'VIDEO' : 'IMAGE'
      send('/app/chat.send', {
        sessionId,
        senderName: nickname,
        fromChatter: false,
        messageType: type,
        content: '',
        fileUrl: res.data.url,
      })
    } catch {
      alert('上传失败，请检查网络或文件大小后重试')
    } finally {
      setUploadProgress(null)
    }
  }

  const handleFileSelect = (inputRef: React.RefObject<HTMLInputElement | null>) => async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPanel(null)
    await uploadAndSend(file)
    if (inputRef.current) inputRef.current.value = ''
  }

  // ── 昵称输入页 ──────────────────────────────────────────────
  if (!joined) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center px-4" style={{ background: '#EDEDED' }}>
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-sm text-slate-500 mb-6"
          >
            <ArrowLeft size={14} /> 返回
          </button>
          <h2 className="font-semibold text-slate-900 text-xl mb-1">加入聊天室</h2>
          <p className="text-sm text-slate-500 mb-6">输入一个临时昵称即可开始聊天</p>
          <input
            type="text"
            placeholder="你的昵称"
            value={inputNick}
            onChange={(e) => setInputNick(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
            className="w-full px-4 py-3 text-base border border-slate-200 rounded-xl mb-4
              focus:outline-none focus:ring-2 focus:ring-[#07C160]/30"
          />
          <button
            onClick={handleJoin}
            disabled={!connected}
            className="w-full py-3 rounded-xl font-medium text-white transition-opacity disabled:opacity-50"
            style={{ background: '#07C160' }}
          >
            {connected ? '进入聊天' : '连接中...'}
          </button>
        </div>
      </div>
    )
  }

  // ── 聊天主界面 ───────────────────────────────────────────────
  return (
    <div className="h-[100dvh] flex flex-col" style={{ background: '#EDEDED' }}>

      {/* 顶栏 */}
      <div className="shrink-0 h-14 flex items-center px-2 border-b border-black/[0.08]"
        style={{ background: '#EDEDED' }}>
        <button onClick={() => navigate(-1)} className="p-2 rounded-lg active:bg-black/10">
          <ArrowLeft size={22} className="text-slate-800" />
        </button>
        <span className="flex-1 text-center font-medium text-slate-900">{nickname}</span>
        {/* 占位，保持标题居中 */}
        <div className="w-10" />
      </div>

      {/* 消息列表 */}
      <div
        className="flex-1 overflow-y-auto py-2"
        onClick={() => { setPanel(null); textareaRef.current?.blur() }}
      >
        {messages.length === 0 && (
          <p className="text-center text-xs text-slate-400 mt-10">发送消息开始聊天</p>
        )}

        {messages.map((msg, idx) => {
          const isSelf = !msg.fromChatter
          const showTime = needsTimestamp(messages[idx - 1], msg)

          return (
            <div key={idx}>
              {/* 时间戳 */}
              {showTime && (
                <p className="text-center text-[11px] text-slate-400 py-2 select-none">
                  {formatTime(msg.sentAt)}
                </p>
              )}

              {/* 消息行 */}
              <div className={`flex items-start gap-2.5 px-3 mb-3 ${isSelf ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* 头像 */}
                <Avatar
                  name={isSelf ? nickname : msg.senderName}
                  color={isSelf ? '#5B9BD5' : '#8DAE7F'}
                />

                {/* 气泡 + 尖角 */}
                <div className="relative max-w-[65%]">
                  <Tail
                    side={isSelf ? 'right' : 'left'}
                    color={isSelf ? '#95EC69' : '#ffffff'}
                  />
                  <div
                    className="rounded-lg px-3 py-2 text-sm leading-relaxed break-words"
                    style={{ background: isSelf ? '#95EC69' : '#ffffff', color: '#111' }}
                  >
                    {msg.messageType === 'TEXT' && msg.content}
                    {msg.messageType === 'IMAGE' && (
                      <img
                        src={msg.fileUrl}
                        alt="图片"
                        className="rounded-md max-w-full max-h-52 object-cover"
                      />
                    )}
                    {msg.messageType === 'VIDEO' && (
                      <video
                        src={msg.fileUrl}
                        controls
                        className="rounded-md max-w-full max-h-52"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}

        <div ref={bottomRef} />
      </div>

      {/* 底部输入区 */}
      <div className="shrink-0 border-t border-black/[0.08]" style={{ background: '#F7F7F7' }}>

        {/* 上传进度条 */}
        {uploadProgress !== null && (
          <div className="px-3 pt-2">
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span>上传中...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-1">
              <div
                className="h-1 rounded-full transition-all"
                style={{ width: `${uploadProgress}%`, background: '#07C160' }}
              />
            </div>
          </div>
        )}

        {/* 输入栏 */}
        <div className="flex items-end gap-1.5 px-2 py-2">
          {/* Emoji 按钮 */}
          <button
            className="shrink-0 p-2 rounded-lg active:bg-black/10"
            onClick={() => {
              if (panel === 'emoji') {
                setPanel(null)
                textareaRef.current?.focus()
              } else {
                textareaRef.current?.blur()
                setPanel('emoji')
              }
            }}
          >
            <Smile
              size={26}
              className={panel === 'emoji' ? 'text-[#07C160]' : 'text-slate-500'}
            />
          </button>

          {/* 文本输入框 */}
          <textarea
            ref={textareaRef}
            rows={1}
            value={inputText}
            onChange={(e) => { setInputText(e.target.value); resizeTextarea() }}
            onFocus={() => setPanel(null)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                sendText()
              }
            }}
            placeholder="发送消息..."
            className="flex-1 min-w-0 bg-white rounded-lg px-3 py-2 text-base
              focus:outline-none resize-none overflow-hidden"
            style={{ lineHeight: '1.5rem', maxHeight: 120 }}
          />

          {/* 有文字 → 发送按钮；无文字 → + 按钮 */}
          {inputText.trim() ? (
            <button
              onClick={sendText}
              className="shrink-0 px-3 py-2 rounded-lg text-sm font-medium text-white active:opacity-80"
              style={{ background: '#07C160' }}
            >
              发送
            </button>
          ) : (
            <button
              disabled={uploadProgress !== null}
              className="shrink-0 p-2 rounded-lg active:bg-black/10 disabled:opacity-40"
              onClick={() => {
                textareaRef.current?.blur()
                setPanel(panel === 'attach' ? null : 'attach')
              }}
            >
              <Plus
                size={26}
                className={panel === 'attach' ? 'text-[#07C160]' : 'text-slate-500'}
              />
            </button>
          )}
        </div>

        {/* Emoji 面板 */}
        {panel === 'emoji' && (
          <div className="px-1">
            <EmojiPicker
              onEmojiClick={(e) => setInputText((prev) => prev + e.emoji)}
              height={260}
              width="100%"
              searchDisabled
              skinTonesDisabled
            />
          </div>
        )}

        {/* 附件面板 */}
        {panel === 'attach' && (
          <div className="grid grid-cols-4 px-4 py-4 gap-y-2">
            <input
              ref={photoInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileSelect(photoInputRef)}
            />
            <input
              ref={videoInputRef}
              type="file"
              accept="video/*"
              className="hidden"
              onChange={handleFileSelect(videoInputRef)}
            />

            <button
              onClick={() => photoInputRef.current?.click()}
              className="flex flex-col items-center gap-1.5"
            >
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm active:opacity-70">
                <ImageIcon size={28} className="text-slate-600" />
              </div>
              <span className="text-[11px] text-slate-500">图片</span>
            </button>

            <button
              onClick={() => videoInputRef.current?.click()}
              className="flex flex-col items-center gap-1.5"
            >
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm active:opacity-70">
                <Film size={28} className="text-slate-600" />
              </div>
              <span className="text-[11px] text-slate-500">视频</span>
            </button>
          </div>
        )}

        {/* iPhone 底部安全区 */}
        <div style={{ height: 'env(safe-area-inset-bottom)' }} />
      </div>
    </div>
  )
}
