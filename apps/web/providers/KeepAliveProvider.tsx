'use client'

import { useEffect } from 'react'
import { keepAliveService } from '@/lib/keepAlive'

export function KeepAliveProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        // Start keep-alive service when app mounts to prevent backend sleeping
        console.log('[KeepAliveProvider] Initializing keep-alive service...')
        keepAliveService.start()

        // Cleanup on unmount
        return () => {
            keepAliveService.stop()
        }
    }, [])

    return <>{children}</>
}
