import * as React from 'react';

import { SunIcon, ISunIconProps } from './Icons/Sun.Icon';
import { SettingIcon } from './Icons/Setting.Icon';
import { MoonIcon } from './Icons/Moon.Icon';

type Size = 'sm' | 'md' | 'lg' | 'xl';
type Variant = 'primary' | 'secondary' | 'text';
type Icon = 'sun' | 'moon' | 'setting';

export interface IButtonProps extends React.ComponentProps<'button'> {
  children: React.ReactNode;
  variant?: Variant;
  disabled?: boolean;
  size?: Size;
  icon?: Icon;
  shadow?: boolean;
  onClick?: () => void;
}

const icons: Record<Icon, React.FunctionComponent<ISunIconProps>> = {
  sun: SunIcon,
  moon: MoonIcon,
  setting: SettingIcon,
};

const sizeStyles: Record<Size, string> = {
  sm: 'p-1 text-sm',
  md: 'p-2 text-md',
  lg: 'p-3 text-lg',
  xl: 'p-4 text-xl',
};

const variantStyles: Record<Variant, string> = {
  primary: 'bg-primary text-white border border-primary hover:bg-white hover:text-primary',
  secondary: 'bg-secondary text-white',
  text: 'text-text border-none hover:text-text-light',
};

export function Button(props: IButtonProps): JSX.Element {
  const {
    variant = 'primary',
    disabled = false,
    size = 'md',
    className = '',
    icon,
    shadow = false,
    onMouseDown,
    onClick,
    children,
    ...restProps
  } = props;
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const [dripShow, setDripShow] = React.useState<boolean>(false);
  const [dripX, setDripX] = React.useState<number>(0);
  const [dripY, setDripY] = React.useState<number>(0);
  const onDripCompleted = React.useCallback(() => {
    setDripShow(false);
    setDripX(0);
    setDripY(0);
    onClick?.();
  }, [onClick]);
  const clickHandler = React.useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDripShow(true);
      setDripX(event.clientX - rect.left);
      setDripY(event.clientY - rect.top);
    }
  }, []);
  const handleMouseDown = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      // Prevent mouse click styles(e.g. outline)
      e.preventDefault();
      onMouseDown?.(e);
    },
    [onMouseDown],
  );
  const Icon = icon ? icons[icon] : null;
  return (
    <button
      {...restProps}
      ref={buttonRef}
      className={`relative overflow-hidden inline-flex flex-row justify-center items-center rounded select-none outline-none transition duration-150 ease-in-out ${
        sizeStyles[size]
      } ${variantStyles[variant]} ${
        disabled ? 'cursor-not-allowed text-text-light' : 'cursor-pointer'
      } ${shadow ? 'shadow-md transform hover:-translate-y-1' : ''} ${className}`}
      onClick={clickHandler}
      onMouseDown={handleMouseDown}
    >
      {Icon && <Icon size={14} className="z-10 mr-2 fill-current focus:fill-light" />}
      <span className="z-10">{children}</span>
      {dripShow && <ButtonDrip x={dripX} y={dripY} onCompleted={onDripCompleted} />}
    </button>
  );
}

interface ButtonDripProps {
  x: number;
  y: number;
  onCompleted: () => void;
}

function ButtonDrip({ x = 0, y = 0, onCompleted }: ButtonDripProps) {
  const dripRef = React.useRef<HTMLDivElement>(null);

  const top = Number.isNaN(+y) ? 0 : y - 10;

  const left = Number.isNaN(+x) ? 0 : x - 10;

  React.useEffect(() => {
    const element = dripRef.current;
    element?.addEventListener('animationend', onCompleted);
    return () => {
      element?.removeEventListener('animationend', onCompleted);
    };
  }, [onCompleted]);

  return (
    <div ref={dripRef} className="absolute left-0 right-0 top-0 bottom-0">
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        style={{ top, left }}
        className="absolute w-4 h-4"
      >
        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
          <g>
            <rect width="100%" height="100%" rx="10" />
          </g>
        </g>
      </svg>

      <style jsx>{`
        svg {
          animation: 250ms ease-in expand;
          animation-fill-mode: forwards;
        }
        svg > g > g {
          fill: theme('colors.gray.100');
        }
        @keyframes expand {
          0% {
            opacity: 0;
            transform: scale(1);
          }
          30% {
            opacity: 1;
          }
          80% {
            opacity: 0.5;
          }
          100% {
            transform: scale(28);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
