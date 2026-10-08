import { useEffect, useRef, useState } from 'react'
import { BrandMark } from '@/components/brand/BrandMark'
import { ButtonLink } from '@/components/ui/Button/ButtonLink'
import { CloseIcon, MenuIcon } from '@/components/ui/icons/icons'
import { headerCta, primaryNav } from '@/content/navigation'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import styles from './Header.module.css'
import { useHeaderJourney } from './useHeaderJourney'

const DESKTOP_QUERY = '(min-width: 960px)'

/**
 * Header fixo. Acompanha a jornada visual da página: `data-theme`
 * (black | light) e `data-scrolled` são escritos por `useHeaderJourney`,
 * e o CSS faz a transição suave entre os universos.
 */
export function Header() {
  const headerRef = useRef<HTMLElement>(null)
  const [menuRequested, setMenuRequested] = useState(false)
  const isDesktop = useMediaQuery(DESKTOP_QUERY)
  // Derivado: ao passar para desktop o menu móvel simplesmente deixa de existir.
  const menuOpen = menuRequested && !isDesktop
  useHeaderJourney(headerRef)

  useEffect(() => {
    if (!menuOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuRequested(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [menuOpen])

  const closeMenu = () => setMenuRequested(false)

  return (
    <header ref={headerRef} className={styles.header} data-open={menuOpen}>
      <span className={styles.glass} aria-hidden="true" />

      <div className={styles.bar}>
        <a href="#topo" className={styles.brand} aria-label="Itaú Black, conceito de interface — início">
          <span className={styles.markStack}>
            <BrandMark tone="silver" className={styles.markBlack} />
            <BrandMark tone="orange" className={styles.markLight} />
          </span>
        </a>

        <nav className={styles.nav} aria-label="Principal">
          <ul className={styles.navList}>
            {primaryNav.map((item) => (
              <li key={item.href}>
                <a className={styles.navLink} href={item.href}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.actions}>
          <ButtonLink href={headerCta.href} variant="ghost" size="sm" className={styles.cta}>
            {headerCta.label}
          </ButtonLink>
          <button
            type="button"
            className={styles.menuButton}
            aria-expanded={menuOpen}
            aria-controls="menu-movel"
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            onClick={() => setMenuRequested((open) => !open)}
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      <div id="menu-movel" className={styles.panel} data-open={menuOpen} inert={!menuOpen}>
        <nav aria-label="Principal (menu móvel)">
          <ul className={styles.panelList}>
            {primaryNav.map((item) => (
              <li key={item.href}>
                <a className={styles.panelLink} href={item.href} onClick={closeMenu}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <ButtonLink href={headerCta.href} className={styles.panelCta} onClick={closeMenu}>
          {headerCta.label}
        </ButtonLink>
      </div>
    </header>
  )
}
