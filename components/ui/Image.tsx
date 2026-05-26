import NextImage from 'next/image';

interface ImageProps extends React.ComponentPropsWithoutRef<'img'> {
  src?: string;
}

export default function Image({ src, alt = '', className, ...props }: ImageProps) {
  if (!src) return null;

  // Ensure absolute URL if it is a relative upload path
  const resolvedSrc = src || "https://res.cloudinary.com/dimz2skii/image/upload/v1779823099/cld-sample-2.jpg"

  return (
    <NextImage
      src={resolvedSrc}
      alt={alt}
      className={className}
      unoptimized
      width={0}
      height={0}
      sizes="100vw"
      style={{ width: props.width || '100%', height: props.height || '100%', ...props.style }}
      {...(props as any)}
    />
  );
}
