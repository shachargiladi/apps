import React, {
  CSSProperties,
  ReactElement,
  ReactNode,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';
import {
  Item,
  Menu,
  TriggerEvent,
  useContextMenu,
} from '@dailydotdev/react-contexify';
import { ArrowIcon, VIcon } from '../icons';
import styles from './Dropdown.module.css';
import { useViewSize, ViewSize } from '../../hooks';
import { ListDrawer } from '../drawers/ListDrawer';
import { SelectParams } from '../drawers/common';
import { RootPortal } from '../tooltips/Portal';
import { DrawerProps } from '../drawers';
import { Button, ButtonSize, ButtonVariant } from '../buttons/Button';
import { IconProps } from '../Icon';

interface ClassName {
  container?: string;
  menu?: string;
  label?: string;
  chevron?: string;
  indicator?: string;
  button?: string;
  item?: string;
}

export interface DropdownProps {
  icon?: ReactNode;
  shouldIndicateSelected?: boolean;
  dynamicMenuWidth?: boolean;
  className?: ClassName;
  style?: CSSProperties;
  selectedIndex: number;
  options: string[];
  onChange: (value: string, index: number) => unknown;
  buttonSize?: ButtonSize;
  buttonVariant?: ButtonVariant;
  scrollable?: boolean;
  renderItem?: (value: string, index: number) => ReactNode;
  placeholder?: string;
  iconOnly?: boolean;
  drawerProps?: Omit<DrawerProps, 'children' | 'onClose'>;
  openFullScreen?: boolean;
}

export function Dropdown({
  icon,
  className = {},
  selectedIndex,
  options,
  onChange,
  dynamicMenuWidth,
  shouldIndicateSelected,
  buttonSize = ButtonSize.Large,
  buttonVariant = ButtonVariant.Float,
  scrollable = false,
  renderItem,
  placeholder = '',
  iconOnly,
  drawerProps,
  openFullScreen,
  ...props
}: DropdownProps): ReactElement {
  const isMobile = useViewSize(ViewSize.MobileL);
  const [id] = useState(`dropdown-${Math.random().toString(36).substring(7)}`);
  const [isVisible, setVisibility] = useState(false);
  const [menuWidth, setMenuWidth] = useState<number>();
  const triggerRef = useRef<HTMLButtonElement>();
  const { show, hideAll } = useContextMenu({ id });

  const showMenu = (event: TriggerEvent): void => {
    const { right, bottom, width } = triggerRef.current.getBoundingClientRect();
    setMenuWidth(width);
    setVisibility(true);
    show(event, {
      position: { x: right, y: bottom + 8 },
    });
  };

  const handleMenuTrigger = (event: React.MouseEvent): void => {
    if (isVisible) {
      setVisibility(false);
      hideAll();
      return;
    }
    showMenu(event);
  };

  const handleKeyboard = (event: React.KeyboardEvent): void => {
    switch (event.key) {
      case 'Enter':
        showMenu(event);
        break;
      case 'Escape':
        if (isVisible) {
          setVisibility(false);
          hideAll();
        }
        break;
      default:
        break;
    }
  };

  const handleChange = ({ value, index }: SelectParams): void => {
    onChange(value, index);
  };

  const fullScreen = openFullScreen ?? isMobile;

  return (
    <div
      className={classNames(styles.dropdown, className.container)}
      {...props}
    >
      <Button
        type="button"
        ref={triggerRef}
        variant={buttonVariant}
        size={buttonSize}
        className={classNames(
          'group flex w-full items-center px-3 font-normal text-text-tertiary typo-body hover:bg-theme-hover hover:text-text-primary',
          className?.button,
          iconOnly && 'items-center justify-center',
        )}
        onClick={handleMenuTrigger}
        onKeyDown={handleKeyboard}
        tabIndex={0}
        aria-haspopup="true"
        aria-expanded={isVisible}
      >
        {icon &&
          React.cloneElement(icon as ReactElement<IconProps>, {
            secondary:
              (icon as ReactElement<IconProps>).props.secondary ?? isVisible,
          })}
        <span
          className={classNames('mr-1 flex flex-1 truncate', className.label)}
        >
          {selectedIndex >= 0 ? options[selectedIndex] : placeholder}
        </span>
        <ArrowIcon
          className={classNames(
            'ml-auto text-xl transition-transform group-hover:text-text-tertiary',
            isVisible ? 'rotate-0' : 'rotate-180',
            styles.chevron,
            className.chevron,
          )}
        />
      </Button>
      {fullScreen ? (
        <RootPortal>
          <ListDrawer
            drawerProps={{
              ...drawerProps,
              isOpen: isVisible,
              onClose: () => setVisibility(false),
              title: drawerProps?.title ? (
                <>
                  <Button
                    size={ButtonSize.Small}
                    className="mr-2"
                    icon={<ArrowIcon className="-rotate-90" secondary />}
                    onClick={handleMenuTrigger}
                  />
                  {drawerProps.title}
                </>
              ) : null,
            }}
            options={options}
            customItem={renderItem}
            selected={selectedIndex}
            onSelectedChange={handleChange}
            shouldIndicateSelected={shouldIndicateSelected}
          />
        </RootPortal>
      ) : (
        <Menu
          disableBoundariesCheck
          id={id}
          className={classNames(className.menu || 'menu-primary', {
            scrollable,
          })}
          animation="fade"
          onHidden={() => setVisibility(false)}
          style={{ width: !dynamicMenuWidth && menuWidth }}
        >
          {options.map((option, index) => (
            <Item
              key={option}
              onClick={({ data, event }) => handleChange({ event, ...data })}
              data={{ value: option, index }}
              className={classNames(styles.item, className?.item)}
            >
              {renderItem ? renderItem(option, index) : option}
              {shouldIndicateSelected && selectedIndex === index && (
                <VIcon
                  className={classNames('ml-auto', className.indicator)}
                  secondary
                />
              )}
            </Item>
          ))}
        </Menu>
      )}
    </div>
  );
}
