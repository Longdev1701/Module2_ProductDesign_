// Design tokens — giống hệt web fe/src/app/globals.css
export const C = {
  // Brand
  navy:    '#00143B',
  navyMid: '#00236f',
  gold:    '#FFB800',

  // Surface
  surface:    '#FAF8FF',
  surfaceDim: '#F2F3FF',
  white:      '#FFFFFF',

  // Text
  textPrimary:   '#131B2E',
  textSecondary: '#444651',
  textMuted:     '#737784',

  // Border
  border:    '#C5C5D3',
  borderFaint:'#E8E8F0',

  // Status
  emerald: '#059669',
  emeraldBg: '#ECFDF5',
  amber:   '#D97706',
  amberBg: '#FFFBEB',
  rose:    '#E11D48',
  roseBg:  '#FFF1F2',
  blue:    '#1D4ED8',
  blueBg:  '#EFF6FF',
  slate:   '#64748B',
  slateBg: '#F1F5F9',
} as const;

export const FONT_SIZE = {
  xs:   10,
  sm:   12,
  base: 14,
  md:   15,
  lg:   17,
  xl:   20,
  '2xl': 24,
} as const;
