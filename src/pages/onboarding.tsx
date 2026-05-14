import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
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

const featureBodyGapByStep: Record<4 | 5 | 6, number> = {
  4: 39,
  5: 39,
  6: 38,
}

const featureContentGapByStep: Partial<Record<4 | 5 | 6, number>> = {
  6: 54,
}

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

function Onboarding() {
  const navigate = useNavigate()
  const pageRef = useRef<HTMLElement>(null)
  const [step, setStep] = useState(1)
  const [guardianType, setGuardianType] = useState<GuardianType | null>(null)
  const [profileName, setProfileName] = useState<string>(getRandomNicknameSuggestion)

  const selectedType = guardianType ?? 'dog'
  const trimmedProfileName = profileName.trim()

  useEffect(() => {
    document.documentElement.classList.add('onboarding-active')
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
    setStep(7)
  }

  const handleGuardianContinue = () => {
    if (!guardianType) return
    setStep(3)
  }

  const handleProfileNameContinue = () => {
    if (trimmedProfileName.length < 2) return

    writeMyProfile({
      name: trimmedProfileName,
    })

    setStep(4)
  }

  const renderStep = () => {
    if (step === 1) {
      return (
        <OnboardingLayout
          step={1}
          totalSteps={6}
          title={'집사인생에\n오신 것을 환영해요!'}
          subtitle={'우리 아이의 하루를\n더 건강하고, 더 따뜻하게\n기록해 보세요.'}
          bodyGap={74}
          visual={(
            <img
              className="onboarding_visual_image onboarding_visual_image_welcome"
              src={onboardingWelcomeImage}
              alt="집사인생 환영 일러스트"
            />
          )}
          actionLabel="다음"
          actionClassName="purple_btn onboarding_action_start"
          onAction={() => setStep(2)}
        />
      )
    }

    if (step === 2) {
      return (
        <OnboardingLayout
          step={2}
          totalSteps={6}
          title="어떤 집사님이신가요?"
          subtitle={'선택한 캐릭터와 함께\n집사인생을 시작해요!'}
          bodyGap={90}
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
          actionDisabled={!guardianType}
          onAction={handleGuardianContinue}
        />
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
      const slide = featureSlides[step - 4]
      const featureStep = step as 4 | 5 | 6

      const handleFeatureContinue = () => {
        if (step < 6) {
          setStep(step + 1)
          return
        }

        setStep(7)
      }

      return (
        <OnboardingLayout
          step={step}
          totalSteps={6}
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
          activeIndicator={step - 4}
          actionLabel="다음"
          actionClassName="purple_btn onboarding_action_primary"
          onAction={handleFeatureContinue}
        />
      )
    }

    return (
      <OnboardingLayout
        topCenterLabel="완료"
        reserveTopActionSpace
        title={'이제 함께\n기록해 볼까요?'}
        subtitle={'집사인생이 우리 아이의\n건강한 하루를 응원해요!'}
        bodyGap={76}
        visual={(
          <img
            className="onboarding_visual_image onboarding_visual_image_complete"
            src={onboardingCompleteImage}
            alt="온보딩 완료 일러스트"
          />
        )}
        actionLabel="집사인생 시작하기"
        actionClassName="purple_btn onboarding_action_primary"
        onAction={() => {
          localStorage.setItem('jibsalife.onboarding.done', 'true')
          navigate('/login')
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
