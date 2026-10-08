import { Fragment, useId, useLayoutEffect, useRef } from 'react'
import type { TransitionLine } from '@/content/home'
import { hexToRgb, mixRgb } from '@/lib/color'
import { cx } from '@/lib/cx'
import { bell, clamp, lerp, smoothstep } from '@/lib/math'
import { observeScene, pinnedProgress } from '@/lib/scene'
import { Spring } from '@/lib/spring'
import { useMotion } from '@/providers/motion-context'
import styles from './ThemeTransition.module.css'

type Direction = 'to-light' | 'to-dark'

interface ThemeTransitionProps {
  id: string
  direction: Direction
  eyebrow?: string
  lines: TransitionLine[]
  text?: string
}

/* Cores dos dois universos (interpoladas pelo scroll) */
const COLOR = {
  titleOnDark: hexToRgb('#f2f4f8'),
  titleOnLight: hexToRgb('#141416'),
  textOnDark: hexToRgb('#a8aeb9'),
  textOnLight: hexToRgb('#55575e'),
  blue: hexToRgb('#4f86ff'),
  blueSoft: hexToRgb('#a9c4ff'),
  orange: hexToRgb('#ec7000'),
}

/** Suaviza saltos do scroll (roda do mouse) sem atrasar a resposta. */
const PROGRESS_SPRING = { stiffness: 140, damping: 1 }

const n3 = (value: number) => value.toFixed(3)

/**
 * Transição cinematográfica entre universos visuais.
 *
 * A seção é alta e contém um palco fixo (sticky). O progresso do scroll pelo
 * palco controla o crossfade entre as camadas escura e clara, as luzes fria
 * (azul) e quente (laranja), a revelação do texto e a cor tipográfica.
 * Somente `opacity`/`transform` mudam nas camadas — trabalho do compositor.
 */
export function ThemeTransition({ id, direction, eyebrow, lines, text }: ThemeTransitionProps) {
  const tier = useMotion()
  const titleId = useId()
  const sectionRef = useRef<HTMLElement>(null)
  const darkRef = useRef<HTMLDivElement>(null)
  const coolRef = useRef<HTMLDivElement>(null)
  const warmRef = useRef<HTMLDivElement>(null)
  const sheenRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const toLight = direction === 'to-light'
  const isStatic = tier === 'static'

  useLayoutEffect(() => {
    const section = sectionRef.current
    const dark = darkRef.current
    const cool = coolRef.current
    const warm = warmRef.current
    const sheen = sheenRef.current
    const content = contentRef.current
    if (!section || !dark || !cool || !warm || !content) return

    const lineEls = [...content.querySelectorAll<HTMLElement>('[data-line]')]
    const accentEls = [...content.querySelectorAll<HTMLElement>('[data-accent]')]
    const title = content.querySelector<HTMLElement>('[data-title]')
    const eyebrowEl = content.querySelector<HTMLElement>('[data-eyebrow]')
    const textEl = content.querySelector<HTMLElement>('[data-text]')
    const rule = content.querySelector<HTMLElement>('[data-rule]')

    const render = (p: number) => {
      // Luminosidade do ambiente (0 = Black, 1 = Itaú)
      const light = toLight ? smoothstep(0.16, 0.6, p) : 1 - smoothstep(0.22, 0.62, p)
      dark.style.opacity = n3(1 - light)

      // Luz fria: dissipa ao sair do Black, condensa ao voltar
      const coolAmount = toLight ? 1 - smoothstep(0, 0.42, p) : smoothstep(0.38, 0.85, p)
      cool.style.opacity = n3(coolAmount)
      cool.style.transform = `scale(${n3(toLight ? 1 + (1 - coolAmount) * 0.35 : 0.8 + coolAmount * 0.2)})`

      // Luz quente: nasce de baixo como um amanhecer, depois assenta
      const warmAmount = toLight
        ? smoothstep(0.1, 0.42, p) * (1 - 0.45 * smoothstep(0.55, 1, p))
        : (1 - smoothstep(0.04, 0.46, p)) * 0.55
      const warmDrop = toLight ? 1 - smoothstep(0.1, 0.6, p) : smoothstep(0.04, 0.5, p)
      warm.style.opacity = n3(warmAmount)
      warm.style.transform = `translate3d(0, ${n3(warmDrop * 28)}%, 0)`

      // Reflexo prateado que atravessa o palco na chegada ao Black
      if (sheen) {
        const sweep = clamp((p - 0.55) / 0.4)
        sheen.style.opacity = n3(bell(sweep))
        sheen.style.transform = `translate3d(${n3(lerp(-70, 70, sweep))}%, 0, 0)`
      }

      // Tipografia acompanha o fundo: claro sobre escuro → escuro sobre claro
      const ink = toLight ? smoothstep(0.3, 0.46, p) : 1 - smoothstep(0.34, 0.5, p)
      const titleColor = mixRgb(COLOR.titleOnDark, COLOR.titleOnLight, ink)
      const textColor = mixRgb(COLOR.textOnDark, COLOR.textOnLight, ink)
      const accentColor = toLight
        ? mixRgb(COLOR.blue, COLOR.orange, smoothstep(0.32, 0.52, p))
        : mixRgb(COLOR.orange, COLOR.blueSoft, smoothstep(0.36, 0.56, p))

      if (title) title.style.color = titleColor
      accentEls.forEach((el) => {
        el.style.color = accentColor
      })

      lineEls.forEach((el, index) => {
        const start = (toLight ? 0.24 : 0.22) + index * 0.14
        const reveal = smoothstep(start, start + 0.2, p)
        el.style.opacity = n3(reveal)
        el.style.transform = `translate3d(0, ${n3((1 - reveal) * 56)}px, 0)`
      })

      if (eyebrowEl) {
        const reveal = smoothstep(0.16, 0.32, p)
        eyebrowEl.style.opacity = n3(reveal)
        eyebrowEl.style.color = textColor
        eyebrowEl.style.setProperty('--eyebrow-accent', accentColor)
      }

      if (textEl) {
        const reveal = smoothstep(0.5, 0.68, p)
        textEl.style.opacity = n3(reveal)
        textEl.style.transform = `translate3d(0, ${n3((1 - reveal) * 24)}px, 0)`
        textEl.style.color = textColor
      }

      if (rule) rule.style.transform = `scaleX(${n3(smoothstep(0.58, 0.82, p))})`
    }

    // Movimento reduzido: estado final estático (o CSS cria a passagem em degradê).
    if (isStatic) {
      render(1)
      return
    }

    const progress = new Spring(0, PROGRESS_SPRING)
    let first = true

    return observeScene(section, (metrics, dt) => {
      const target = pinnedProgress(metrics)
      if (first) {
        // Primeiro frame (ex.: página recarregada no meio do scroll): sem animar.
        progress.value = progress.target = target
        first = false
      }
      progress.target = target
      const resting = progress.step(dt)
      render(progress.value)
      return !resting
    })
  }, [toLight, isStatic])

  const fromTheme = toLight ? 'black' : 'light'
  const toTheme = toLight ? 'light' : 'black'

  return (
    <section
      ref={sectionRef}
      id={id}
      className={cx(styles.scene, toLight ? styles.toLight : styles.toDark)}
      data-static={isStatic || undefined}
      data-header-theme={fromTheme}
      data-header-theme-to={toTheme}
      data-header-split="0.4"
      aria-labelledby={titleId}
    >
      <div className={styles.stage}>
        <div className={styles.layers} aria-hidden="true">
          <div className={styles.light} />
          <div ref={darkRef} className={styles.dark} />
          <div ref={coolRef} className={styles.cool} />
          <div ref={warmRef} className={styles.warm} />
          {!toLight && <div ref={sheenRef} className={styles.sheen} />}
          <div className={styles.blend} />
          <div className={styles.grain} />
        </div>

        <div ref={contentRef} className={styles.content}>
          {eyebrow && (
            <p className={styles.eyebrow} data-eyebrow>
              {eyebrow}
            </p>
          )}
          <h2 id={titleId} className={styles.title} data-title>
            {lines.map((line, index) => (
              <Fragment key={index}>
                {index > 0 && ' '}
                <span className={styles.line} data-line>
                  {line.text}
                  {line.accent && (
                    <span className={styles.accent} data-accent>
                      {line.accent}
                    </span>
                  )}
                </span>
              </Fragment>
            ))}
          </h2>
          {text && (
            <p className={styles.text} data-text>
              {text}
            </p>
          )}
          <span className={styles.rule} data-rule aria-hidden="true" />
        </div>
      </div>
    </section>
  )
}
