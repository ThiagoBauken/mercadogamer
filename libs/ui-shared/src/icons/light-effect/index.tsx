import { useMemo } from 'react';

export const LightEffectIcon: React.FC<IconProps> = (props) => {
  const { color = 'currentColor', size = '1em' } = props;
  const _size = useMemo(() => (typeof size === 'string' ? size : `${size}px`), [size]);
  return (
    <svg height={_size} viewBox="0 0 374 375" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle
        opacity="0.2"
        cx="187"
        cy="187.482"
        r="166.943"
        fill="url(#paint0_radial_1832_7278)"
      />
      <path
        opacity="0.2"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M93.4976 25.5351C121.925 9.12247 154.172 0.481934 186.998 0.481934V187.481L186.998 187.481L280.498 25.5349C308.925 41.9476 332.532 65.5541 348.944 93.9817L186.999 187.481L187 187.482V187.483H374C374 220.308 365.359 252.555 348.946 280.983L187 187.483H186.999L280.498 349.429C252.07 365.842 219.823 374.483 186.998 374.483V187.484L93.4986 349.428C65.0711 333.016 41.4646 309.41 25.0518 280.983L186.997 187.483H0C0.000136924 154.657 8.64102 122.41 25.0542 93.9819L186.996 187.48L93.4976 25.5351Z"
        fill="url(#paint1_radial_1832_7278)"
      />
      <defs>
        <radialGradient
          id="paint0_radial_1832_7278"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(187 187.482) rotate(90) scale(166.943)"
        >
          <stop stopColor={color} />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </radialGradient>
        <radialGradient
          id="paint1_radial_1832_7278"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(187 187.482) rotate(90) scale(187 187)"
        >
          <stop stopColor={color} />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
};
