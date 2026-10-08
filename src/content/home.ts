/**
 * Textos da Home abaixo da hero. Conteúdo fictício e demonstrativo.
 *
 * Títulos em dois tons: `lead` em destaque e `muted` em tom secundário,
 * fechados por um ponto final na cor de acento do universo ativo.
 */
export interface TwoToneTitle {
  lead: string
  muted: string
}

export interface TransitionLine {
  text: string
  /** Trecho final destacado na cor de acento (muda de cor com o scroll). */
  accent?: string
}

export const toItauTransition = {
  eyebrow: 'Universo Itaú',
  lines: [{ text: 'Itaú', accent: '.' }, { text: 'Feito de futuro.' }] satisfies TransitionLine[],
  text: 'Soluções, experiências e serviços pensados para acompanhar cada momento da sua vida.',
}

export const ecosystemContent = {
  eyebrow: 'Ecossistema Itaú',
  title: { lead: 'Um ecossistema completo', muted: 'para quem quer mais' } satisfies TwoToneTitle,
  lede: 'Conta, cartões, experiências e atendimento reunidos em uma experiência construída para acompanhar o presente e evoluir com o futuro.',
  items: [
    {
      id: 'cartoes',
      title: 'Cartões',
      text: 'Soluções para diferentes perfis, com benefícios que acompanham o seu ritmo.',
      art: 'cards',
      size: 'wide',
    },
    {
      id: 'conta',
      title: 'Conta',
      text: 'Praticidade, segurança e controle para o dia a dia.',
      art: 'account',
      size: 'narrow',
    },
    {
      id: 'experiencias-itau',
      title: 'Experiências',
      text: 'Vantagens, conveniência e acesso a momentos exclusivos.',
      art: 'orbit',
      size: 'narrow',
    },
    {
      id: 'atendimento',
      title: 'Atendimento',
      text: 'Suporte pensado para estar presente quando você precisar.',
      art: 'chat',
      size: 'wide',
    },
  ] as const,
}

export const pillarsContent = {
  eyebrow: 'Nossos pilares',
  title: { lead: 'Tecnologia, confiança e proximidade', muted: 'em cada experiência' } satisfies TwoToneTitle,
  lede: 'Os fundamentos que orientam cada produto, cada serviço e cada interação.',
  items: [
    {
      title: 'Inovação',
      text: 'Tecnologia que antecipa necessidades e simplifica as decisões do dia a dia.',
      icon: 'orbit',
    },
    {
      title: 'Segurança',
      text: 'Proteção em cada camada, para você usar com tranquilidade onde estiver.',
      icon: 'shield',
    },
    {
      title: 'Conveniência',
      text: 'Tudo o que importa ao alcance de poucos toques, no seu tempo.',
      icon: 'bolt',
    },
  ] as const,
}

export const toBlackTransition = {
  eyebrow: 'Itaú Black',
  lines: [{ text: 'O universo ', accent: 'Black' }, { text: 'começa onde o comum termina.' }] satisfies TransitionLine[],
}

export const benefitsContent = {
  eyebrow: 'Benefícios Black',
  title: { lead: 'Benefícios que acompanham', muted: 'cada destino' } satisfies TwoToneTitle,
  lede: 'Uma experiência pensada para oferecer mais conforto, mais possibilidades e mais exclusividade em cada etapa da sua jornada.',
  items: [
    {
      title: 'Salas VIP',
      text: 'Acesso a salas em aeroportos para viagens mais confortáveis ao redor do mundo.',
      icon: 'plane',
    },
    {
      title: 'Concierge 24 horas',
      text: 'Assistência dedicada para facilitar o seu dia a dia e as suas viagens.',
      icon: 'bell',
    },
    {
      title: 'Pontos que não expiram',
      text: 'Mais liberdade para usar os seus pontos no seu tempo.',
      icon: 'infinity',
    },
    {
      title: 'Experiências exclusivas',
      text: 'Condições, eventos e vantagens pensados para um estilo de vida premium.',
      icon: 'ticket',
    },
  ] as const,
}

export const finalCtaContent = {
  eyebrow: 'Itaú Black',
  title: { lead: 'Seu próximo nível', muted: 'começa aqui' } satisfies TwoToneTitle,
  lede: 'Descubra uma experiência criada para quem busca mais exclusividade, mais benefícios e uma relação diferente com o banco.',
  primaryCta: 'Peça o seu',
  secondaryCta: { label: 'Conheça os benefícios', href: '#beneficios' },
  tertiaryCta: { label: 'Explorar cartões', href: '#ecossistema' },
  demoNotice: 'Este é um projeto conceitual: nenhuma solicitação real é enviada.',
}

/** Identificação discreta no rodapé: projeto conceitual, sem vínculo oficial. */
export const footerNote = 'Conceito de portfólio · não oficial'
