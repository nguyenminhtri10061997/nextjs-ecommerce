'use client'

import { useLinkStatus } from 'next/link'
import AppLineProgress from '../AppLineProgress'

export default function LinkLoadingIndicator() {
    const { pending } = useLinkStatus()
    return pending ? (
        <AppLineProgress />
    ) : null
}