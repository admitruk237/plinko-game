'use client'

import { ReactNode, useRef } from 'react'
import { useSettingsStore } from '@/entities/settings'

interface Props {
  soundEffectsEnabled: boolean
  animationsEnabled: boolean
  children: ReactNode
}

export const SettingsProvider = ({
  soundEffectsEnabled,
  animationsEnabled,
  children,
}: Props) => {
  const initialized = useRef(false)
  if (!initialized.current) {
    useSettingsStore.setState({ soundEffectsEnabled, animationsEnabled })
    initialized.current = true
  }

  return <>{children}</>
}
