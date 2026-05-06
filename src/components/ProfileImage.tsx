type ProfileImageProps = {
  src: string
  alt: string
  className?: string
}

function ProfileImage({ src, alt, className }: ProfileImageProps) {
  const classNames = className ? `profile_image ${className}` : 'profile_image'

  return (
    <span className={classNames}>
      <img src={src} alt={alt} />
    </span>
  )
}

export default ProfileImage
