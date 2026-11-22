import type { JSX } from 'react';

type BrandMarkProps = {
  className?: string;
};

/**
 * Shield with a safety helmet: the app mark shared by the header, the
 * authentication screens and the side menu.
 */
const BrandMark = ({ className }: BrandMarkProps): JSX.Element => (
  <svg
    aria-hidden="true"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2.2}
    viewBox="0 0 24 24"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M8 11a4 4 0 0 1 8 0v1H8v-1z" />
    <path d="M7 13h10" />
  </svg>
);

export default BrandMark;
