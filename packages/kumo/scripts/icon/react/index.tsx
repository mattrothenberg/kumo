import * as React from 'react';
import { IconNamesArr, type IconName } from '@cloudflare/echo-assets/icons';
// Vite generated asset url, see https://vite.dev/guide/assets
import iconSpriteUrl from '@cloudflare/echo-assets/icons/sprite.svg';
import { cva, cx, type cvaVariantProps } from '@fractus/theme';

export { type IconName } from '@cloudflare/echo-assets/icons';

export const iconNames = IconNamesArr as IconName[];

export const ICON_VARIANTS = {
  look: {
    default: 'echo-c-icon-look--default',
    gold: 'echo-c-icon-look--gold',
    info: 'echo-c-icon-look--info',
    warning: 'echo-c-icon-look--warning',
    success: 'echo-c-icon-look--success',
    inverted: 'echo-c-icon-look--inverted',
    muted: 'echo-c-icon-look--muted',
    primary: 'echo-c-icon-look--primary',
    attention: 'echo-c-icon-look--attention',
    currentColor: 'echo-c-icon-look--current-color',
  },
  size: {
    default: 'echo-c-icon-size--default',
    '2xs': 'echo-c-icon-size--2xs',
    xs: 'echo-c-icon-size--xs',
    sm: 'echo-c-icon-size--sm',
    md: 'echo-c-icon-size--md',
    lg: 'echo-c-icon-size--lg',
    xl: 'echo-c-icon-size--xl',
    '2xl': 'echo-c-icon-size--2xl',
  },
  focusable: {
    true: 'echo-c-icon--focusable',
    false: '',
  },
};

const ICON_DEFAULT_VARIANTS = {
  look: 'default',
  size: 'default',
  focusable: false,
} as const;

export const iconVariants = cva({
  variants: ICON_VARIANTS,
  defaultVariants: ICON_DEFAULT_VARIANTS,
});

export type IconProps = React.ComponentProps<'svg'> &
  cvaVariantProps<typeof iconVariants> & {
    glyph: IconName;
    title?: string;
  };

export const Icon = ({
  ref,
  glyph,
  title,
  className,
  focusable = ICON_DEFAULT_VARIANTS.focusable,
  size = ICON_DEFAULT_VARIANTS.size,
  look = ICON_DEFAULT_VARIANTS.look,
  ...props
}: IconProps) => {
  const id = React.useId();
  const ariaHidden = !title;

  const componentClassName = cx(
    'echo-c-icon',
    iconVariants({ look, size, focusable }),
    className,
  );

  return (
    <svg
      ref={ref}
      aria-hidden={ariaHidden}
      className={componentClassName}
      role={ariaHidden ? undefined : 'img'}
      aria-labelledby={ariaHidden ? undefined : id}
      focusable={focusable}
      {...props}
    >
      {title && <title id={id}>{title}</title>}
      <use href={`${iconSpriteUrl}#${glyph}`} />
    </svg>
  );
};
