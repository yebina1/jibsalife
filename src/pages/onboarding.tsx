import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import OnboardingLayout from '../components/OnboardingLayout'
import Input from '../components/html/Input'
import onboardingWelcomeImage from '../img/onboarding/onboarding1.png'
import onboardingDogLoverImage from '../img/onboarding/onboarding2_doglover.png'
import onboardingCatLoverImage from '../img/onboarding/onboarding2_catlover.png'
import onboardingDogNameImage from '../img/onboarding/onboarding3_dog.png'
import onboardingCatNameImage from '../img/onboarding/onboarding3_cat.png'
import onboardingDogRecordImage from '../img/onboarding/onboarding4_dog.png'
import onboardingCatRecordImage from '../img/onboarding/onboarding4_cat.png'
import onboardingShareImage from '../img/onboarding/onboarding5.png'
import onboardingDogChatImage from '../img/onboarding/onboarding6_dog.png'
import onboardingCatChatImage from '../img/onboarding/onboarding6_cat.png'
import onboardingCompleteImage from '../img/onboarding/onboarding7.png'
import { writeMyProfile } from '../utils/myProfile'
import { defaultPetProfiles } from '../utils/petProfiles'
import { voteDetails } from './community/CommunityVoteData'
import knowledge1 from '../img/Knowledge/knowledge1.png'
import knowledge2 from '../img/Knowledge/knowledge2.png'
import knowledge3 from '../img/Knowledge/knowledge3.png'
import knowledge4 from '../img/Knowledge/knowledge4.png'
import animalCardImage from '../img/animal_card.png'
import bannerIcon2Image from '../img/banner_icon2.png'
import weeklyRankFirstImage from '../img/home_lanking/lank1.png'
import weeklyRankSecondImage from '../img/home_lanking/lank2.png'
import weeklyRankThirdImage from '../img/home_lanking/lank3.png'
import lankGoldIcon from '../svg/home/lank_gold.svg'
import onboardingDecoration1 from '../svg/onboarding/paw1.svg'
import onboardingDecoration2 from '../svg/onboarding/paw2.svg'
import onboardingDecoration3 from '../svg/onboarding/paw3.svg'
import onboardingDecoration4 from '../svg/onboarding/paw4.svg'
import onboardingDecoration5 from '../svg/onboarding/paw5.svg'
import onboardingDecoration6 from '../svg/onboarding/paw6.svg'
import { markCurrentUserProfileSetupDone } from '../utils/authAccounts'
import './onboarding.css'

type GuardianType = 'dog' | 'cat'

const guardianOptions = [
  {
    type: 'dog' as const,
    label: '멍멍 집사',
    image: onboardingDogLoverImage,
  },
  {
    type: 'cat' as const,
    label: '냥냥 집사',
    image: onboardingCatLoverImage,
  },
] as const

const featureSlides = [
  {
    title: 'AI와 함께\n우리 아이 건강을\n기록해 보세요',
    subtitle: '식사, 활동, 증상 등\n쉽게 기록할 수 있어요',
    dogImage: onboardingDogRecordImage,
    catImage: onboardingCatRecordImage,
  },
  {
    title: '다른 집사들과\n고민과 일상을\n나눠보세요',
    subtitle: '같은 고민도, 함께하면\n더 든든해요.',
    dogImage: onboardingShareImage,
    catImage: onboardingShareImage,
  },
  {
    title: '수의사와\n채팅 상담이 가능해요',
    subtitle: '건강 고민이 생기면 언제든\n수의사와 채팅으로\n상담할 수 있어요',
    dogImage: onboardingDogChatImage,
    catImage: onboardingCatChatImage,
  },
] as const

const bestPoseVoteImages = voteDetails.find((voteDetail) => voteDetail.id === 'best-pose')?.candidates.map((candidate) => candidate.image) ?? []

const onboardingPreloadImages = [
  onboardingWelcomeImage,
  onboardingDogLoverImage,
  onboardingCatLoverImage,
  onboardingDogNameImage,
  onboardingCatNameImage,
  onboardingDogRecordImage,
  onboardingCatRecordImage,
  onboardingShareImage,
  onboardingDogChatImage,
  onboardingCatChatImage,
  onboardingCompleteImage,
  onboardingDecoration1,
  onboardingDecoration2,
  onboardingDecoration3,
  onboardingDecoration4,
  onboardingDecoration5,
  onboardingDecoration6,
] as const

const homePreloadImages = [
  ...defaultPetProfiles.map((profile) => profile.image),
  weeklyRankFirstImage,
  weeklyRankSecondImage,
  weeklyRankThirdImage,
  lankGoldIcon,
  ...bestPoseVoteImages,
  bannerIcon2Image,
  knowledge1,
  knowledge2,
  knowledge3,
  knowledge4,
  animalCardImage,
] as const

const preloadedImages = new Set<string>()

function preloadImages(srcs: readonly string[]) {
  if (typeof window === 'undefined') return

  srcs.forEach((src) => {
    if (!src || preloadedImages.has(src)) return
    preloadedImages.add(src)

    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = src
    document.head.appendChild(link)

    const image = new Image()
    image.src = src
    image.decode?.().catch(() => {
      // The preload request still warms the cache even if decoding is skipped.
    })
  })
}

const featureBodyGapByStep: Record<4 | 5 | 6, number> = {
  4: 39,
  5: 39,
  6: 38,
}

const featureContentGapByStep: Partial<Record<4 | 5 | 6, number>> = {
  6: 54,
}

const featureSlideByStep = {
  4: featureSlides[0],
  5: featureSlides[1],
  6: featureSlides[2],
} as const

const featureNextStepByStep: Record<4 | 5 | 6, 5 | 6 | null> = {
  4: 6,
  6: 5,
  5: null,
}

const featureIndicatorByStep: Record<4 | 5 | 6, number> = {
  4: 0,
  6: 1,
  5: 2,
}

const featureProgressStepByStep: Record<4 | 5 | 6, number> = {
  4: 1,
  6: 2,
  5: 3,
}

const ONBOARDING_DONE_KEY = 'jibsalife.onboarding.done'

const nicknameSuggestions = [
  '포근한하루',
  '노을산책',
  '따뜻한기록',
  '느린발걸음',
  '낮잠러',
  '몽글몽글',
  '산책메이트',
  '간식수집가',
  '츄르연구원',
  '꼬리흔들러',
  '캣타워마스터',
  '장난감수호자',
  '오늘도출석',
  '기록하는하루',
  '매일산책중',
  '우리집막내',
  '간식탐험가',
] as const

function getRandomNicknameSuggestion() {
  return nicknameSuggestions[Math.floor(Math.random() * nicknameSuggestions.length)]
}

const onboardingDecorations = [
  onboardingDecoration1,
  onboardingDecoration2,
  onboardingDecoration3,
  onboardingDecoration4,
  onboardingDecoration5,
  onboardingDecoration6,
] as const

function DecoratedOnboardingImage({
  src,
  alt,
  variant,
  imageClassName,
}: {
  src: string
  alt: string
  variant: 'welcome' | 'complete'
  imageClassName: string
}) {
  return (
    <div className={`onboarding_decorated_image onboarding_decorated_image_${variant}`}>
      {onboardingDecorations.map((decoration, index) => (
        <img
          key={`${variant}-${decoration}`}
          className={`onboarding_decoration onboarding_decoration_${index + 1}`}
          src={decoration}
          alt=""
          aria-hidden="true"
        />
      ))}
      <img
        className={`onboarding_visual_image ${imageClassName}`}
        src={src}
        alt={alt}
      />
    </div>
  )
}

function Onboarding() {
  const navigate = useNavigate()
  const { search } = useLocation()
  const isProfileSetup = new URLSearchParams(search).get('setup') === 'profile'
  const pageRef = useRef<HTMLElement>(null)
  const [step, setStep] = useState(() => (isProfileSetup ? 2 : 1))
  const [guardianType, setGuardianType] = useState<GuardianType | null>(null)
  const [profileName, setProfileName] = useState<string>(getRandomNicknameSuggestion)

  const selectedType = guardianType ?? 'dog'
  const trimmedProfileName = profileName.trim()

  useEffect(() => {
    document.documentElement.classList.add('onboarding-active')
    preloadImages([...onboardingPreloadImages, ...homePreloadImages])

    return () => {
      document.documentElement.classList.remove('onboarding-active')
    }
  }, [])

  useEffect(() => {
    pageRef.current?.scrollTo({ top: 0 })
    pageRef.current?.querySelector('.onboarding_layout')?.scrollTo({ top: 0 })
    window.scrollTo({ top: 0 })
  }, [step])

  const handleSkip = () => {
    localStorage.setItem(ONBOARDING_DONE_KEY, 'true')
    navigate('/login')
  }

  const handleGuardianContinue = () => {
    if (!guardianType || trimmedProfileName.length < 2) return

    writeMyProfile({
      name: trimmedProfileName,
      guardianType,
    })

    setStep(7)
  }

  const handleProfileNameContinue = () => {
    if (trimmedProfileName.length < 2) return

    writeMyProfile({
      name: trimmedProfileName,
      guardianType: selectedType,
    })

    setStep(4)
  }

  const renderStep = () => {
    if (step === 1) {
      return (
        <OnboardingLayout
          title={'집사인생에\n오신 것을 환영해요!'}
          subtitle={'우리 아이의 하루를\n더 건강하고, 더 따뜻하게\n기록해 보세요.'}
          bodyGap={74}
          visual={(
            <DecoratedOnboardingImage
              src={onboardingWelcomeImage}
              variant="welcome"
              imageClassName="onboarding_visual_image_welcome"
              alt="온보딩 환영 일러스트"
            />
          )}
          actionLabel="다음"
          actionClassName="purple_btn onboarding_action_start"
          onAction={() => setStep(4)}
        />
      )
    }

    if (step === 2) {
      return (
        <OnboardingLayout
          title={'집사 프로필 만들기'}
          subtitle={'캐릭터와 닉네임을 설정해주세요.'}
          bodyGap={32}
          visual={(
            <div className="onboarding_guardian_grid">
              {guardianOptions.map((option) => {
                const isSelected = guardianType === option.type

                return (
                  <button
                    key={option.type}
                    type="button"
                    className={`onboarding_guardian_card${isSelected ? ' is_selected' : ''}`}
                    onClick={() => setGuardianType(option.type)}
                  >
                    <img src={option.image} alt={option.label} aria-hidden="true" />
                    <strong className="title_h4_semibold">{option.label}</strong>
                    <span className="onboarding_guardian_card_check" aria-hidden="true">
                      <i className="bx bx-check" />
                    </span>
                  </button>
                )
              })}
            </div>
          )}
          actionLabel="이 캐릭터로 시작하기"
          actionClassName="purple_btn onboarding_action_primary"
          actionDisabled={!guardianType || trimmedProfileName.length < 2}
          onAction={handleGuardianContinue}
        >
          <div className="onboarding_guardian_name_form">
            <Input
              value={profileName}
              placeholder={'\uC774\uB984\uC744 \uC785\uB825\uD574 \uC8FC\uC138\uC694'}
              ariaLabel={'\uC9D1\uC0AC \uD504\uB85C\uD544 \uB2C9\uB124\uC784'}
              onChange={setProfileName}
            />
            <p className="onboarding_guardian_name_hint">
              {'\uB2C9\uB124\uC784\uC740 \uC5B8\uC81C\uB4E0\uC9C0 \uC218\uC815\uD560 \uC218 \uC788\uC5B4\uC694.'}
            </p>
          </div>
        </OnboardingLayout>
      )
    }

    if (step === 3) {
      return (
        <OnboardingLayout
          step={3}
          totalSteps={6}
          title={'어떤 이름으로\n불러드릴까요?'}
          subtitle="커뮤니티에서 사용되는 이름이에요."
          bodyGap={32}
          visual={(
            <img
              className="onboarding_visual_image onboarding_visual_image_pet"
              src={selectedType === 'dog' ? onboardingDogNameImage : onboardingCatNameImage}
              alt="반려동물 이름 입력 안내 일러스트"
              aria-hidden="true"
            />
          )}
          actionLabel="다음"
          actionClassName="purple_btn onboarding_action_primary"
          actionDisabled={trimmedProfileName.length < 2}
          onAction={handleProfileNameContinue}
        >
          <div className="onboarding_name_form">
            <Input
              value={profileName}
              placeholder="이름을 입력해 주세요"
              ariaLabel="집사 프로필 닉네임"
              onChange={setProfileName}
            />
            <p className="onboarding_name_hint">
              닉네임은 언제든 수정할 수 있어요.
            </p>
          </div>
        </OnboardingLayout>
      )
    }

    if (step >= 4 && step <= 6) {
      const featureStep = step as 4 | 5 | 6
      const slide = featureSlideByStep[featureStep]

      const handleFeatureContinue = () => {
        const nextStep = featureNextStepByStep[featureStep]

        if (nextStep) {
          setStep(nextStep)
          return
        }

        localStorage.setItem(ONBOARDING_DONE_KEY, 'true')
        navigate('/login')
      }

      return (
        <OnboardingLayout
          step={featureProgressStepByStep[featureStep]}
          totalSteps={3}
          bodyGap={featureBodyGapByStep[featureStep]}
          contentGap={featureContentGapByStep[featureStep]}
          title={slide.title}
          subtitle={slide.subtitle}
          visual={(
            <img
              className="onboarding_visual_image onboarding_visual_image_feature"
              src={selectedType === 'dog' ? slide.dogImage : slide.catImage}
              alt={slide.title.replaceAll('\n', ' ')}
              aria-hidden="true"
            />
          )}
          indicatorCount={3}
          activeIndicator={featureIndicatorByStep[featureStep]}
          actionLabel="다음"
          actionClassName="purple_btn onboarding_action_primary"
          onAction={handleFeatureContinue}
        />
      )
    }

    return (
      <OnboardingLayout
        title={`${trimmedProfileName || profileName} 집사님,\n준비가 완료됐어요!`}
        subtitle={'이제 우리 아이의 건강을 기록해보세요.'}
        bodyGap={76}
        visual={(
          <DecoratedOnboardingImage
            src={onboardingCompleteImage}
            variant="complete"
            imageClassName="onboarding_visual_image_complete"
            alt="온보딩 완료 일러스트"
          />
        )}
        actionLabel="집사인생 시작하기"
        actionClassName="purple_btn onboarding_action_primary onboarding_action_start"
        onAction={() => {
          localStorage.setItem(ONBOARDING_DONE_KEY, 'true')
          markCurrentUserProfileSetupDone()
          navigate('/home')
        }}
      />
    )
  }

  return (
    <main key={step} ref={pageRef} className="onboarding_page">
      {step >= 4 && step <= 6 ? (
        <button
          type="button"
          className="onboarding_skip_button caption_medium"
          onClick={handleSkip}
        >
          건너뛰기
        </button>
      ) : null}
      {renderStep()}
    </main>
  )
}

export default Onboarding
