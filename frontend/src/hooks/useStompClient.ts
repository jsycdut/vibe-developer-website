import { useEffect, useRef, useCallback, useState } from 'react'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

interface UseStompOptions {
  onMessage: (destination: string, body: unknown) => void
  subscriptions: string[]
}

export function useStompClient({ onMessage, subscriptions }: UseStompOptions) {
  const clientRef = useRef<Client | null>(null)
  const subsRef = useRef(subscriptions)
  subsRef.current = subscriptions
  // 用 ref 保持 onMessage 最新引用，避免闭包捕获旧的 state
  const onMessageRef = useRef(onMessage)
  onMessageRef.current = onMessage
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS('/ws-connect'),
      reconnectDelay: 5000,
      onConnect: () => {
        setConnected(true)
        subsRef.current.forEach((dest) => {
          client.subscribe(dest, (frame) => {
            try {
              onMessageRef.current(dest, JSON.parse(frame.body))
            } catch {
              onMessageRef.current(dest, frame.body)
            }
          })
        })
      },
      onDisconnect: () => setConnected(false),
      // onStompError 只记日志，不改 connected——ERROR 帧不代表连接断开
      onStompError: (frame) => console.error('[STOMP] error:', frame.headers?.message),
      onWebSocketError: (e) => console.error('[STOMP] WebSocket error:', e),
    })
    client.activate()
    clientRef.current = client

    return () => { client.deactivate() }
  }, [])  // eslint-disable-line react-hooks/exhaustive-deps

  const send = useCallback((destination: string, body: unknown) => {
    if (!clientRef.current?.connected) return
    clientRef.current.publish({
      destination,
      body: JSON.stringify(body),
    })
  }, [])

  return { send, connected }
}
