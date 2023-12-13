import React, {
  forwardRef,
  HTMLAttributes,
  ReactElement,
  ReactNode,
  Ref,
} from 'react';
import classNames from 'classnames';
import { IconProps } from '../Icon';
import { Loader } from '../Loader';
import { combinedClicks } from '../../lib/click';

import { ColorName as ButtonColor } from '../../styles/colors';
import {
  ButtonSize,
  ButtonVariant,
  ButtonIconPosition,
  useGetIconWithSize,
  IconOnlySizeToClassName,
  SizeToClassName,
  VariantColorToClassName,
  VariantToClassName,
} from './common';

export type IconType = React.ReactElement<IconProps>;

export { ButtonColor, ButtonSize, ButtonVariant, ButtonIconPosition };

interface CommonButtonProps {
  size?: ButtonSize;
  loading?: boolean;
  pressed?: boolean;
  disabled?: boolean;
  children?: ReactNode;
  tag?: React.ElementType & AllowedTags;
}

// when color is present, variant is required
type ColorButtonProps =
  | { color: ButtonColor; variant: ButtonVariant }
  | { color?: never; variant?: ButtonVariant };

// when iconPosition is present, icon is required
type IconButtonProps =
  | { iconPosition: ButtonIconPosition; icon: IconType }
  | { iconPosition?: never; icon?: IconType };

type BaseButtonProps = CommonButtonProps & ColorButtonProps & IconButtonProps;

export type AllowedTags = keyof Pick<JSX.IntrinsicElements, 'a' | 'button'>;
export type AllowedElements = HTMLButtonElement | HTMLAnchorElement;
export type ButtonElementType<Tag extends AllowedTags> = Tag extends 'a'
  ? HTMLAnchorElement
  : HTMLButtonElement;

export type ButtonProps<T extends AllowedTags> = BaseButtonProps &
  HTMLAttributes<T> &
  JSX.IntrinsicElements[T] & {
    ref?: Ref<ButtonElementType<T>>;
  };

function ButtonComponent<TagName extends AllowedTags>(
  {
    variant,
    size = ButtonSize.Medium,
    color,
    className,
    icon,
    iconPosition = ButtonIconPosition.Left,
    loading,
    pressed,
    children,
    onClick,
    tag: Tag = 'button',
    ...props
  }: ButtonProps<TagName>,
  ref?: Ref<ButtonElementType<TagName>>,
): ReactElement {
  const iconOnly = icon && !children;
  const getIconWithSize = useGetIconWithSize(size, iconOnly, iconPosition);
  const isAnchor = Tag === 'a';

  return (
    <Tag
      {...props}
      {...(isAnchor ? combinedClicks(onClick) : { onClick })}
      aria-busy={loading}
      aria-pressed={pressed}
      ref={ref}
      className={classNames(
        `btn inline-flex flex-row items-center justify-center border
        typo-callout font-bold
        no-underline shadow-none cursor-pointer select-none focus-outline relative
        transition duration-200 ease-in-out`,
        { iconOnly },
        iconOnly ? IconOnlySizeToClassName[size] : SizeToClassName[size],
        !color && VariantToClassName[variant],
        VariantColorToClassName[variant]?.[color],
        className,
      )}
    >
      {icon &&
        iconPosition === ButtonIconPosition.Left &&
        getIconWithSize(icon)}
      {loading ? <span className="invisible">{children}</span> : children}
      {icon &&
        iconPosition === ButtonIconPosition.Right &&
        getIconWithSize(icon)}
      {loading && (
        <Loader
          data-testid="buttonLoader"
          className="absolute inset-0 m-auto !visible"
        />
      )}
    </Tag>
  );
}

export const Button = forwardRef(ButtonComponent);