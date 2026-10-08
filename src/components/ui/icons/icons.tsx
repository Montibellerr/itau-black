import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

const base: IconProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  )
}

export function MenuIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 9h16" />
      <path d="M4 15h16" />
    </svg>
  )
}

export function CloseIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m6 6 12 12" />
      <path d="M18 6 6 18" />
    </svg>
  )
}

/* ---------- Pilares ---------- */

export function OrbitIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="2.6" />
      <ellipse cx="12" cy="12" rx="9.5" ry="4.2" transform="rotate(-28 12 12)" />
      <circle cx="19.4" cy="7.6" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function ShieldIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3.2 19 5.8v5.6c0 4.3-2.9 7.7-7 9.2-4.1-1.5-7-4.9-7-9.2V5.8Z" />
      <path d="m9 12 2.1 2.1L15.2 10" />
    </svg>
  )
}

export function BoltIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M13.2 2.8 5.6 13.4h6.1l-1 7.8 7.7-10.6h-6.1Z" />
    </svg>
  )
}

/* ---------- Benefícios Black ---------- */

export function PlaneIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M21 15.6v-1.9l-7.6-4.6V4.3a1.4 1.4 0 0 0-2.8 0v4.8L3 13.7v1.9l7.6-2.4v4.9l-2.1 1.5v1.3l3.5-1 3.5 1v-1.3l-2.1-1.5v-4.9Z" />
    </svg>
  )
}

export function BellIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5 17a7 7 0 0 1 14 0" />
      <path d="M3.5 17h17" />
      <path d="M4.5 20h15" />
      <path d="M12 10V7.6" />
      <path d="M10.4 7.6h3.2" />
    </svg>
  )
}

export function InfinityIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 12c-2-2.6-3.6-3.9-5.4-3.9a3.9 3.9 0 0 0 0 7.8c1.8 0 3.4-1.3 5.4-3.9Zm0 0c2 2.6 3.6 3.9 5.4 3.9a3.9 3.9 0 0 0 0-7.8c-1.8 0-3.4 1.3-5.4 3.9Z" />
    </svg>
  )
}

export function TicketIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3.5 7.5A1.5 1.5 0 0 1 5 6h14a1.5 1.5 0 0 1 1.5 1.5V10a2 2 0 0 0 0 4v2.5A1.5 1.5 0 0 1 19 18H5a1.5 1.5 0 0 1-1.5-1.5V14a2 2 0 0 0 0-4Z" />
      <path d="M14.5 6.8v10.4" strokeDasharray="1.6 2.2" />
    </svg>
  )
}

export function ContactlessIcon(props: IconProps) {
  return (
    <svg {...base} strokeWidth={1.7} {...props}>
      <path d="M6.5 9.2a4 4 0 0 1 0 5.6" />
      <path d="M9.8 7a7.2 7.2 0 0 1 0 10" />
      <path d="M13.1 4.8a10.4 10.4 0 0 1 0 14.4" />
      <path d="M16.4 2.6a13.6 13.6 0 0 1 0 18.8" />
    </svg>
  )
}
