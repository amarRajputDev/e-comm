import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/utils";

type ImgProps = Omit<ImageProps, "src" | "width" | "height"> & {
  src: string;
  alt: string;
  /** Natural ratio used for layout hints — CSS (object-cover / h-full) wins. */
  width?: number;
  height?: number;
};

/**
 * Thin wrapper over `next/image` so every storefront image gets responsive
 * `sizes`, AVIF/WebP negotiation and lazy loading without repeating props.
 * Object-fit is always `cover` — pass `className` for anything else.
 */
export function Img({
  src,
  alt,
  className,
  width = 1200,
  height = 1500,
  sizes = "100vw",
  preload,
  quality,
  ...rest
}: ImgProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes}
      quality={quality}
      preload={preload}
      loading={preload ? undefined : "lazy"}
      className={cn("object-cover", className)}
      {...rest}
    />
  );
}
