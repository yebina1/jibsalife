import ChevronIcon from './ChevronIcon'
import ProfileImage from './ProfileImage'
import './SummaryProfileCard.css'

type SummaryProfileStat = {
  label: string
  value: string
}

type SummaryProfileCardProps = {
  image: string
  name: string
  breed: string
  details: string
  stats: readonly SummaryProfileStat[]
  careGuideLabel?: string
  imageAlt?: string
  className?: string
  onEdit?: () => void
  onCareGuideClick?: () => void
}

type SummaryProfileAddCardProps = {
  label?: string
  className?: string
  onClick?: () => void
}

function ProfileEditIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
      <circle cx="10" cy="5.5" r="3" />
      <path d="M4.2 16.5c1.1-2.7 3.3-4.1 5.8-4.1 1.1 0 2.1.3 3 .8" />
      <path d="m13.8 16.2 3.9-3.9 1.4 1.4-3.9 3.9-2 .5Z" />
    </svg>
  )
}

function StatEditIcon() {
  return <i className="bx bx-edit" aria-hidden="true" />
}

function ProfileDetails({ details }: { details: string }) {
  const detailItems = details.split(' · ').map((item) => {
    const [label, ...valueParts] = item.split(':')
    return {
      label: label.trim(),
      value: valueParts.join(':').trim(),
    }
  })

  return (
    <p className="summary_profile_card_details">
      {detailItems.map((item, index) => (
        <span key={item.label}>
          {index > 0 ? <em aria-hidden="true">·</em> : null}
          <span className="summary_profile_card_detail_label">{item.label}:</span>
          <strong>{item.value}</strong>
        </span>
      ))}
    </p>
  )
}

function SummaryProfileCard({
  image,
  name,
  breed,
  details,
  stats,
  careGuideLabel = '케어 가이드',
  imageAlt,
  className,
  onEdit,
  onCareGuideClick,
}: SummaryProfileCardProps) {
  const classNames = className
    ? `summary_profile_card ${className}`
    : 'summary_profile_card'

  return (
    <article className={classNames}>
      <div className="summary_profile_card_top">
        <ProfileImage src={image} alt={imageAlt ?? `${name} 프로필`} />

        <div className="summary_profile_card_body summary_profile_card_text_frame">
          <div className="summary_profile_card_header">
            <div className="summary_profile_card_copy">
              <div className="summary_profile_card_name_row">
                <strong>{name}</strong>
                <span>{breed}</span>
              </div>
              <ProfileDetails details={details} />
            </div>

            <button
              type="button"
              className="summary_profile_card_edit"
              aria-label="프로필 수정"
              onClick={onEdit}
            >
              <ProfileEditIcon />
            </button>
          </div>

          <button
            type="button"
            className="summary_profile_card_guide"
            onClick={onCareGuideClick}
          >
            {careGuideLabel}
            <ChevronIcon direction="right" size="md" />
          </button>
        </div>
      </div>

      <ul className="summary_profile_card_stats" aria-label={`${name} 활동 요약`}>
        {stats.map((stat) => (
          <li key={stat.label}>
            <span>
              {stat.label}
              <StatEditIcon />
            </span>
            <strong>{stat.value}</strong>
          </li>
        ))}
      </ul>
    </article>
  )
}

export default SummaryProfileCard

export function SummaryProfileAddCard({
  label = '프로필 추가',
  className,
  onClick,
}: SummaryProfileAddCardProps) {
  const classNames = className
    ? `summary_profile_card summary_profile_card_add ${className}`
    : 'summary_profile_card summary_profile_card_add'

  return (
    <article className={classNames} aria-label={label}>
      <button type="button" className="summary_profile_card_add_button" aria-label={label} onClick={onClick}>
        <i />
      </button>
    </article>
  )
}
