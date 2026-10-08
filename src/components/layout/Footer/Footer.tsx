import { BrandMark } from '@/components/brand/BrandMark'
import { footerNote } from '@/content/home'
import { primaryNav } from '@/content/navigation'
import styles from './Footer.module.css'

/** Rodapé minimalista: marca + identificação discreta + navegação. */
export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <div className={styles.signature}>
            <a href="#topo" className={styles.brand} aria-label="Voltar ao topo">
              <BrandMark tone="silver" className={styles.mark} />
            </a>
            <p className={styles.note}>{footerNote}</p>
          </div>

          <nav aria-label="Rodapé">
            <ul className={styles.links}>
              {primaryNav.map((item) => (
                <li key={item.href}>
                  <a href={item.href}>{item.label}</a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  )
}
