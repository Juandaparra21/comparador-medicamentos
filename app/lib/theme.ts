export const THEME_KEY = 'farmi_theme'
export const THEME_EVENT = 'farmi-theme-change'

/* Tema efectivo actual leyendo el atributo que ya puso el script inline
   del layout (o una eleccion manual previa). */
export function getEffectiveDark(): boolean {
  if (typeof document === 'undefined') return false
  return document.documentElement.getAttribute('data-theme') === 'dark'
}

/* true si el usuario eligio el tema a mano (no esta siguiendo el sistema). */
export function hasManualTheme(): boolean {
  try {
    return localStorage.getItem(THEME_KEY) !== null
  } catch {
    return false
  }
}

export function setManualTheme(dark: boolean) {
  if (dark) {
    document.documentElement.setAttribute('data-theme', 'dark')
  } else {
    document.documentElement.removeAttribute('data-theme')
  }
  try {
    localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light')
  } catch {
    // localStorage puede no estar disponible en navegacion privada
  }
  window.dispatchEvent(new CustomEvent(THEME_EVENT, { detail: { dark } }))
}
