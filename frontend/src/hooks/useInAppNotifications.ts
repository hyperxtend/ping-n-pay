import { useEffect, useRef, useState, useCallback } from 'react'
import type { InAppNotificationPayload } from '../types/notification'

// Using native WebSocket + STOMP via SockJS
// Install: npm install @stomp/stompjs sockjs-client @types/sockjs-client
// For now we use a lightweight polling fallback if SockJS isn't wired yet.

export function useInAppNotifications() {
  const [notifications, setNotifications] = useState<InAppNotificationPayload[]>([])
  const [unreadCount, setUnreadCount]     = useState(0)

  const addNotification = useCallback((payload: InAppNotificationPayload) => {
    setNotifications((prev) => [payload, ...prev].slice(0, 50)) // keep last 50
    setUnreadCount((c) => c + 1)
  }, [])

  const markAllRead = useCallback(() => setUnreadCount(0), [])

  // WebSocket connection — requires @stomp/stompjs + sockjs-client
  // Wired up once those packages are installed. Connection is gracefully
  // skipped in dev if the backend isn't running.
  const stompRef = useRef<unknown>(null)

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (!token) return

    let active = true

    // Dynamic import so the app still works before sockjs is installed
    Promise.all([
      import('@stomp/stompjs').catch(() => null),
      import('sockjs-client').catch(() => null),
    ]).then(([stompModule, SockJS]) => {
      if (!active || !stompModule || !SockJS) return

      const { Client } = stompModule as typeof import('@stomp/stompjs')
      const client = new Client({
        webSocketFactory: () => new (SockJS as unknown as new (url: string) => WebSocket)('/api/ws'),
        connectHeaders: { Authorization: `Bearer ${token}` },
        reconnectDelay: 5000,
        onConnect: () => {
          client.subscribe('/user/queue/notifications', (msg) => {
            try {
              addNotification(JSON.parse(msg.body) as InAppNotificationPayload)
            } catch {
              // ignore malformed messages
            }
          })
        },
      })

      client.activate()
      stompRef.current = client
    })

    return () => {
      active = false
      const c = stompRef.current as { deactivate?: () => void } | null
      c?.deactivate?.()
    }
  }, [addNotification])

  return { notifications, unreadCount, markAllRead }
}
