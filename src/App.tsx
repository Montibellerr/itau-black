import { BlackBenefits } from '@/components/home/BlackBenefits/BlackBenefits'
import { Ecosystem } from '@/components/home/Ecosystem/Ecosystem'
import { FinalCta } from '@/components/home/FinalCta/FinalCta'
import { Pillars } from '@/components/home/Pillars/Pillars'
import { ThemeTransition } from '@/components/home/ThemeTransition/ThemeTransition'
import { Hero } from '@/components/hero/Hero/Hero'
import { Header } from '@/components/layout/Header/Header'
import { toBlackTransition, toItauTransition } from '@/content/home'
import { MotionProvider } from '@/providers/MotionProvider'

/**
 * Home como jornada visual em atos:
 * Black (hero) → transição → Itaú (ecossistema, pilares) → transição →
 * Black (benefícios) → encerramento.
 */
export default function App() {
  return (
    <MotionProvider>
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <Header />
      <main id="conteudo">
        <Hero />
        <ThemeTransition id="itau" direction="to-light" {...toItauTransition} />
        <Ecosystem />
        <Pillars />
        <ThemeTransition id="black" direction="to-dark" {...toBlackTransition} />
        <BlackBenefits />
        <FinalCta />
      </main>
    </MotionProvider>
  )
}
