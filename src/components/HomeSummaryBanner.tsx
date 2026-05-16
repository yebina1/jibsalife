import { Fragment } from 'react'
import './HomeSummaryBanner.css'

type HomeSummaryBannerProps = {
  text: string
  imageSrc: string
  imagePriority?: boolean
  backgroundColor?: string
  ariaLabel?: string
  rotateImage?: boolean
  imageWidth?: number
  imageHeight?: number
  imageTop?: number
  imageBottom?: number
  imageRight?: number
}

function HomeSummaryBanner({
  text,
  imageSrc,
  imagePriority = false,
  backgroundColor = '#43779E',
  ariaLabel = '배너',
  rotateImage = true,
  imageWidth = 76,
  imageHeight = 90,
  imageTop = -24,
  imageBottom,
  imageRight = 48,
}: HomeSummaryBannerProps) {
  const lines = text.split('\n')

  return (
    <div
      className="home_summary_banner"
      aria-label={ariaLabel}
      style={{ backgroundColor }}
    >
      <p className="p_medium home_summary_banner_text">
        {lines.map((line, index) => (
          <Fragment key={`${line}-${index}`}>
            {line}
            {index < lines.length - 1 ? <br /> : null}
          </Fragment>
        ))}
      </p>
      <img
        className={`home_summary_banner_image ${rotateImage ? 'is_rotated' : ''}`}
        src={imageSrc}
        alt={`${ariaLabel} 이미지`}
        aria-hidden="true"
        loading={imagePriority ? 'eager' : 'lazy'}
        fetchPriority={imagePriority ? 'high' : 'auto'}
        decoding="async"
        style={{
          width: `${imageWidth}px`,
          height: `${imageHeight}px`,
          top: imageBottom === undefined ? `${imageTop}px` : undefined,
          bottom: imageBottom === undefined ? undefined : `${imageBottom}px`,
          right: `${imageRight}px`,
        }}
      />
    </div>
  )
}

export default HomeSummaryBanner
