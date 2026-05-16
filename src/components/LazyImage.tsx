import { type CSSProperties, useEffect, useRef, useState } from 'react'
import './LazyImage.css'

type LazyImageProps = {
  src: string
  webpSrc?: string
  alt: string
  width?: number
  height?: number
  priority?: boolean
  className?: string
  rootClassName?: string
  style?: CSSProperties
  rootStyle?: CSSProperties
  objectFit?: CSSProperties['objectFit']
  objectPosition?: string
}

export default function LazyImage({
  src,
  webpSrc,
  alt,
  width,
  height,
  priority = false,
  className,
  rootClassName,
  style,
  rootStyle,
  objectFit,
  objectPosition,
}: LazyImageProps) {
  const [loaded, setLoaded] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  // 이미 캐시된 이미지는 onLoad가 발생하지 않으므로 complete 상태 확인
  useEffect(() => {
    if (imgRef.current?.complete && imgRef.current.naturalWidth > 0) {
      setLoaded(true)
    }
  }, [])

  const resolvedImgStyle: CSSProperties = {
    ...(objectFit !== undefined ? { objectFit } : {}),
    ...(objectPosition !== undefined ? { objectPosition } : {}),
    ...style,
  }
  const hasImgStyle = Object.keys(resolvedImgStyle).length > 0

  const imgProps = {
    ref: imgRef,
    src,
    alt,
    ...(width !== undefined ? { width } : {}),
    ...(height !== undefined ? { height } : {}),
    loading: priority ? ('eager' as const) : ('lazy' as const),
    decoding: 'async' as const,
    fetchPriority: priority ? ('high' as const) : ('auto' as const),
    className: ['lazy_img', className].filter(Boolean).join(' '),
    style: hasImgStyle ? resolvedImgStyle : undefined,
    onLoad: () => setLoaded(true),
  }

  return (
    <div
      className={['lazy_img_root', loaded ? 'is_loaded' : '', rootClassName].filter(Boolean).join(' ')}
      style={rootStyle}
    >
      {!loaded && <span className="lazy_img_skeleton" aria-hidden="true" />}
      {webpSrc ? (
        <picture className="lazy_img_picture">
          <source srcSet={webpSrc} type="image/webp" />
          <img {...imgProps} />
        </picture>
      ) : (
        <img {...imgProps} />
      )}
    </div>
  )
}
