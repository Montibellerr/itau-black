export interface NavItem {
  label: string
  href: string
}

/** Âncoras para as seções da Home. */
export const primaryNav: NavItem[] = [
  { label: 'Cartões', href: '#ecossistema' },
  { label: 'Benefícios', href: '#beneficios' },
  { label: 'Experiências', href: '#experiencias' },
  { label: 'Atendimento', href: '#atendimento' },
]

export const headerCta: NavItem = { label: 'Peça o seu', href: '#proximo-nivel' }
