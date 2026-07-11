'use client'

import { useEffect, useMemo } from 'react'
import { LEGACY_TRANSLATIONS } from './legacyTranslations'
import { TRANSLATIONS, type TranslationEntry } from './translations'
import type { Locale } from './config'

const ATTRIBUTES = ['alt', 'aria-label', 'placeholder', 'title'] as const
const EXCLUDED_TAGS = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'CODE', 'PRE'])

function normalized(value: string) {
  return value.replace(/\s+/g, ' ').trim()
}

function dictionaries() {
  const entries = Object.values({ ...TRANSLATIONS, ...LEGACY_TRANSLATIONS })
  const byText = new Map<string, TranslationEntry>()
  for (const entry of entries) {
    for (const text of Object.values(entry)) byText.set(normalized(text), entry)
  }
  return byText
}

// Components that have not yet been migrated to useLang() can still respond to
// a locale change. The observer also handles content rendered after an async
// request, such as search results and maps.
export function AutomaticTranslator({ locale }: { locale: Locale }) {
  const byText = useMemo(dictionaries, [])

  useEffect(() => {
    const translate = (value: string) => {
      const entry = byText.get(normalized(value))
      return entry ? entry[locale] : value
    }

    const translateElement = (element: Element) => {
      if (EXCLUDED_TAGS.has(element.tagName)) return
      for (const attribute of ATTRIBUTES) {
        const value = element.getAttribute(attribute)
        if (!value) continue
        const translated = translate(value)
        if (translated !== value) element.setAttribute(attribute, translated)
      }
      for (const node of Array.from(element.childNodes)) {
        if (node.nodeType !== Node.TEXT_NODE || !node.textContent?.trim()) continue
        const translated = translate(node.textContent)
        if (translated !== node.textContent) node.textContent = translated
      }
    }

    const translateTree = (root: ParentNode) => {
      if (root instanceof Element) translateElement(root)
      root.querySelectorAll?.('*').forEach(translateElement)
    }

    translateTree(document.body)
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of Array.from(mutation.addedNodes)) {
          if (node instanceof Element) translateTree(node)
          else if (node.nodeType === Node.TEXT_NODE && node.parentElement) translateElement(node.parentElement)
        }
      }
    })
    observer.observe(document.body, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [byText, locale])

  return null
}
