import { useState, useEffect, useRef } from 'react'
import { ArrowLeft, Smile, Image as ImageIcon, Send, Plus, X } from 'lucide-react'
import EmojiPicker from 'emoji-picker-react'
import { useAuth } from '../contexts/AuthContext'
import { useStompClient } from '../hooks/useStompClient'
import api from '../lib/api'

interface ChatSession {
  id: string
  guestNickname: string
  active: boolean
  lastMessage?: string
  lastMessageAt?: string
  initiatorName?: string
}

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

export default function AdminChatPage() {
  const { user } = useAuth()
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null)
  const [messages, setMessages] = useState<ChatMsg[]>([])
  const [inputText, setInputText] = useState('')
  const [showEmoji, setShowEmoji] = useState(false)
  const [showNewChat, setShowNewChat] = useState(false)
  const [chatters, setChatters] = useState<string[]>([])
  const bottomRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadProgress, setUploadProgress] = useState<number | null>(null)

  const activeSession = sessions.find((s) => s.id === activeSessionId)

  const { send, connected } = useStompClient({
    subscriptions: ['/topic/chatter.workspace'],
    onMessage: (_dest, body) => {
      const data = body as ChatMsg & { guestNickname?: string; initiatorName?: string }
      if (data.guestNickname && !data.sessionId) {
        // 新会话广播：内部会话只对参与者可见
        const session = data as unknown as ChatSession
        const isInternal = !!session.initiatorName
        const isParticipant = session.initiatorName === user?.username || session.guestNickname === user?.username
        if (isInternal && !isParticipant) return
        setSessions((prev) => {
          const exists = prev.find((s) => s.id === session.id)
          if (exists) return prev
          return [session, ...prev]
        })
      } else if (data.sessionId) {
        // 更新会话最后消息
        setSessions((prev) => prev.map((s) =>
          s.id === data.sessionId
            ? { ...s, lastMessage: data.content || '[文件]', lastMessageAt: data.sentAt }
            : s
        ))
        setMessages((prev) => {
          if (data.sessionId === activeSessionId) {
            return [...prev, data]
          }
          return prev
        })
      }
    },
  })

  useEffect(() => {
    api.get('/chat/sessions').then((r) => setSessions(r.data))
  }, [])

  useEffect(() => {
    if (!activeSessionId) return
    api.get(`/chat/sessions/${activeSessionId}/messages`).then((r) => setMessages(r.data))
  }, [activeSessionId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const openNewChat = () => {
    setShowNewChat(true)
    if (chatters.length === 0) {
      api.get('/chat/chatters').then((r) => setChatters(r.data))
    }
  }

  const startInternalSession = async (targetUsername: string) => {
    const res = await api.post('/chat/sessions/internal', { targetUsername })
    const newSession: ChatSession = res.data
    setSessions((prev) => {
      const exists = prev.find((s) => s.id === newSession.id)
      if (exists) return prev
      return [newSession, ...prev]
    })
    setActiveSessionId(newSession.id)
    setShowNewChat(false)
  }

  const sendText = () => {
    if (!inputText.trim() || !activeSessionId || !user) return
    const msg: ChatMsg = {
      sessionId: activeSessionId,
      senderName: user.username,
      fromChatter: true,
      messageType: 'TEXT',
      content: inputText.trim(),
    }
    send('/app/chat.send', msg)
    setInputText('')
    setShowEmoji(false)
  }

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !activeSessionId || !user) return
    const formData = new FormData()
    formData.append('file', file)
    setUploadProgress(0)
    try {
      const res = await api.post('/upload', formData, {
        timeout: 0,
        onUploadProgress: (ev) => {
          if (ev.total) setUploadProgress(Math.round((ev.loaded / ev.total) * 100))
        },
      })
      const type: 'IMAGE' | 'VIDEO' = file.type.startsWith('video') ? 'VIDEO' : 'IMAGE'
      const msg: ChatMsg = {
        sessionId: activeSessionId,
        senderName: user.username,
        fromChatter: true,
        messageType: type,
        content: '',
        fileUrl: res.data.url,
      }
      send('/app/chat.send', msg)
    } catch {
      alert('上传失败，请检查网络或文件大小后重试')
    } finally {
      setUploadProgress(null)
      e.target.value = ''
    }
  }

  const getSessionDisplayName = (s: ChatSession) => {
    if (!s.initiatorName) return s.guestNickname
    // 内部会话：显示对方名字
    return s.initiatorName === user?.username ? s.guestNickname : s.initiatorName
  }

  return (
    <div className="relative w-full h-full flex overflow-hidden bg-slate-50 md:rounded-2xl md:border border-slate-900/10">

      {/* 栏目一：会话列表（移动端：无选中时显示，有选中时隐藏；桌面端：始终显示） */}
      <div className={`w-full md:w-80 shrink-0 border-r border-slate-900/10 bg-white flex flex-col
        ${activeSessionId ? 'hidden md:flex' : 'flex'}`}
      >
        {/* 列表头部 */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <span className="font-bold text-slate-900">对话列表</span>
          <button
            onClick={openNewChat}
            className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-600 transition-colors"
            title="发起新对话"
          >
            <Plus size={16} />
          </button>
        </div>

        {/* 新对话选择面板 */}
        {showNewChat && (
          <div className="border-b border-slate-100 bg-blue-50/50">
            <div className="px-4 py-2 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">选择对话对象</span>
              <button
                onClick={() => setShowNewChat(false)}
                className="p-0.5 hover:bg-slate-200 rounded"
              >
                <X size={14} className="text-slate-400" />
              </button>
            </div>
            {chatters.length === 0 ? (
              <p className="px-4 pb-3 text-xs text-slate-400">
                {chatters.length === 0 ? '暂无其他 Chatter 用户' : '加载中...'}
              </p>
            ) : (
              <div className="px-2 pb-2 space-y-1">
                {chatters.map((name) => (
                  <button
                    key={name}
                    onClick={() => startInternalSession(name)}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-blue-100 text-sm text-slate-700 font-medium transition-colors"
                  >
                    {name}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          {sessions.length === 0 && (
            <p className="text-slate-400 text-sm text-center py-8">暂无会话</p>
          )}
          {sessions.map((s) => (
            <div
              key={s.id}
              onClick={() => setActiveSessionId(s.id)}
              className={`px-4 py-3 cursor-pointer border-b border-slate-50 hover:bg-slate-50 transition-colors ${
                activeSessionId === s.id ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <div className={`w-2 h-2 rounded-full ${s.initiatorName ? 'bg-purple-400' : 'bg-green-500'}`} />
                <p className="font-semibold text-slate-800 text-sm">{getSessionDisplayName(s)}</p>
                {s.initiatorName && (
                  <span className="text-xs text-purple-400 ml-auto">内部</span>
                )}
              </div>
              {s.lastMessage && (
                <p className="text-xs text-slate-400 truncate">{s.lastMessage}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 栏目二：聊天主视窗（移动端：有选中时显示，无选中时隐藏；桌面端：始终显示） */}
      <div className={`flex-1 flex flex-col bg-white min-w-0
        ${activeSessionId ? 'flex' : 'hidden md:flex'}`}
      >
        {/* 聊天头部 */}
        <div className="h-14 border-b border-slate-100 px-4 flex items-center gap-2 bg-white/80 backdrop-blur-md">
          <button
            className="md:hidden p-1 hover:bg-slate-100 rounded-lg"
            onClick={() => setActiveSessionId(null)}
          >
            <ArrowLeft size={20} />
          </button>
          {activeSession ? (
            <>
              <span className="font-bold text-slate-800">{getSessionDisplayName(activeSession)}</span>
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs text-slate-400">在线</span>
              {activeSession.initiatorName && (
                <span className="text-xs text-purple-400 ml-2">内部会话</span>
              )}
            </>
          ) : (
            <span className="text-slate-400 text-sm">选择一个会话开始回复</span>
          )}
        </div>

        {/* 消息区 */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50">
          {!activeSessionId && (
            <p className="text-slate-300 text-sm text-center py-20">← 从左侧选择一个会话</p>
          )}
          {messages.map((msg, idx) => {
            const isSelf = msg.senderName === user?.username
            return (
              <div key={idx} className={`flex ${isSelf ? 'justify-end' : 'justify-start'}`}>
                {!isSelf && (
                  <span className="text-xs text-slate-400 self-end mr-1">{msg.senderName}</span>
                )}
                <div className={`max-w-xs rounded-2xl px-4 py-2 shadow-sm ${
                  isSelf
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-slate-800 border border-slate-900/10'
                }`}>
                  {msg.messageType === 'TEXT' && <p className="text-sm">{msg.content}</p>}
                  {msg.messageType === 'IMAGE' && (
                    <img src={msg.fileUrl} alt="图片" className="rounded-lg max-w-full" />
                  )}
                  {msg.messageType === 'VIDEO' && (
                    <video src={msg.fileUrl} controls className="rounded-lg max-w-full" />
                  )}
                </div>
              </div>
            )
          })}
          <div ref={bottomRef} />
        </div>

        {/* 底部操作栏 */}
        <div className="px-5 py-3 border-t border-slate-100 bg-white relative">
          {showEmoji && (
            <div className="absolute bottom-16 left-2 z-50">
              <EmojiPicker
                onEmojiClick={(e) => setInputText((prev) => prev + e.emoji)}
                height={350}
              />
            </div>
          )}
          {/* 上传进度条 */}
          {uploadProgress !== null && (
            <div className="mb-2">
              <div className="flex justify-between text-xs text-slate-500 mb-1">
                <span>上传中...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-1">
                <div
                  className="h-1 rounded-full bg-blue-500 transition-all"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}
          <input type="file" ref={fileInputRef} accept="image/*,video/*" className="hidden" onChange={handleFile} />
          <div className="flex items-center gap-2">
            <button
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg"
              onClick={() => setShowEmoji(!showEmoji)}
            >
              <Smile size={20} />
            </button>
            <button
              disabled={uploadProgress !== null}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg disabled:opacity-40"
              onClick={() => fileInputRef.current?.click()}
            >
              <ImageIcon size={20} />
            </button>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  sendText()
                }
              }}
              placeholder={activeSession ? `回复 ${getSessionDisplayName(activeSession)}...` : '请先选择会话'}
              disabled={!activeSessionId}
              className="flex-1 min-w-0 px-4 py-2 bg-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm disabled:opacity-50"
            />
            <button
              onClick={sendText}
              disabled={!activeSessionId || !connected}
              className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
