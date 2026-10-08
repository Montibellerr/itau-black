/** Junta classes condicionalmente: cx('a', isOn && 'b') → 'a b'. */
export const cx = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(' ')
