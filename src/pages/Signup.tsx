import { useState } from 'react'
import { useNavigate } from 'react-router'
import Input from '../components/html/Input'
import Button from '../components/html/Button'
import Title from '../components/Title'
import helloIcon from '../svg/hello icon.svg'
import loginPetImg from '../img/illust_login_pet.png'
import './Signup.css'

type PetType = 'dog' | 'cat'

type Terms = {
  all: boolean
  age: boolean
  service: boolean
  privacy: boolean
  marketing: boolean
}

function Signup() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [petType, setPetType] = useState<PetType | null>(null)
  const [petName, setPetName] = useState('')
  const [terms, setTerms] = useState<Terms>({
    all: false,
    age: false,
    service: false,
    privacy: false,
    marketing: false,
  })

  const allRequiredChecked = terms.age && terms.service && terms.privacy
  const isFormValid =
    email.trim() !== '' &&
    password.length >= 8 &&
    password === passwordConfirm &&
    petType !== null &&
    allRequiredChecked

  const handleTermToggle = (key: keyof Terms) => {
    if (key === 'all') {
      const next = !terms.all
      setTerms({ all: next, age: next, service: next, privacy: next, marketing: next })
    } else {
      setTerms((prev) => {
        const next = { ...prev, [key]: !prev[key] }
        next.all = next.age && next.service && next.privacy && next.marketing
        return next
      })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid) return
    navigate('/login')
  }

  return (
    <div className="signup_page">
      <div className="signup_hero">
        <Title
          as="h2"
          className="signup_hero_copy"
          title={(
            <>
              집사인생에 오신 것을<br />환영해요{' '}
              <img src={helloIcon} alt="" aria-hidden="true" width={24} height={24} className="signup_hello_icon" />
            </>
          )}
        >
          <p className="signup_hero_sub">
            반려동물과 함께하는 소중한 순간을<br />기록하고 관리해 보세요.
          </p>
        </Title>
        <img src={loginPetImg} alt="반려동물 일러스트" className="signup_hero_img" />
      </div>

      <form className="signup_form" onSubmit={handleSubmit}>
        {/* 이메일 */}
        <div className="signup_section">
          <span className="signup_label">이메일</span>
          <div className="signup_email_row">
            <Input
              value={email}
              type="email"
              placeholder="이메일을 입력해 주세요"
              ariaLabel="이메일"
              className="signup_input"
              onChange={setEmail}
            />
            <button type="button" className="signup_check_btn">
              중복확인
            </button>
          </div>
        </div>

        {/* 비밀번호 */}
        <div className="signup_section">
          <span className="signup_label">비밀번호</span>
          <div className="signup_inputs">
            <Input
              value={password}
              type="password"
              placeholder="숫자, 영문, 특수문자 조합 최소 8자"
              ariaLabel="비밀번호"
              className="signup_input"
              onChange={setPassword}
            />
            <Input
              value={passwordConfirm}
              type="password"
              placeholder="비밀번호 재입력"
              ariaLabel="비밀번호 재입력"
              className="signup_input"
              onChange={setPasswordConfirm}
            />
          </div>
        </div>

        {/* 반려동물 종류 */}
        <div className="signup_section">
          <span className="signup_label">반려동물 종류</span>
          <div className="signup_pet_type_row">
            <button
              type="button"
              className={`signup_pet_type_btn${petType === 'dog' ? ' is_active' : ''}`}
              onClick={() => setPetType('dog')}
            >
              강아지
            </button>
            <button
              type="button"
              className={`signup_pet_type_btn${petType === 'cat' ? ' is_active' : ''}`}
              onClick={() => setPetType('cat')}
            >
              고양이
            </button>
          </div>
        </div>

        {/* 반려동물 이름 */}
        <div className="signup_section">
          <span className="signup_label">
            반려동물 이름{' '}
            <span className="signup_label_opt">(선택)</span>
          </span>
          <Input
            value={petName}
            placeholder="반려동물 이름을 입력하세요."
            ariaLabel="반려동물 이름"
            className="signup_input"
            onChange={setPetName}
          />
        </div>

        {/* 약관동의 */}
        <div className="signup_section">
          <span className="signup_label">약관동의</span>
          <div className="signup_terms_card">
            <button
              type="button"
              className="signup_terms_row signup_terms_all"
              onClick={() => handleTermToggle('all')}
            >
              <span className={`signup_terms_check${terms.all ? ' is_active' : ''}`} aria-hidden="true">
                <i className="bx bx-check" />
              </span>
              <span className="signup_terms_text signup_terms_text_bold">모두 동의합니다.</span>
            </button>

            <div className="signup_terms_divider" />

            <button
              type="button"
              className="signup_terms_row"
              onClick={() => handleTermToggle('age')}
            >
              <span className={`signup_terms_check${terms.age ? ' is_active' : ''}`} aria-hidden="true">
                <i className="bx bx-check" />
              </span>
              <span className="signup_terms_text">
                만 14세 이상입니다.{' '}
                <span className="signup_terms_required">(필수)</span>
              </span>
            </button>

            <button
              type="button"
              className="signup_terms_row"
              onClick={() => handleTermToggle('service')}
            >
              <span className={`signup_terms_check${terms.service ? ' is_active' : ''}`} aria-hidden="true">
                <i className="bx bx-check" />
              </span>
              <span className="signup_terms_text">
                서비스 이용약관에 동의합니다.{' '}
                <span className="signup_terms_required">(필수)</span>
              </span>
              <i className="bx bx-chevron-right signup_terms_chevron" aria-hidden="true" />
            </button>

            <button
              type="button"
              className="signup_terms_row"
              onClick={() => handleTermToggle('privacy')}
            >
              <span className={`signup_terms_check${terms.privacy ? ' is_active' : ''}`} aria-hidden="true">
                <i className="bx bx-check" />
              </span>
              <span className="signup_terms_text">
                개인정보 수집 이용에 동의합니다.{' '}
                <span className="signup_terms_required">(필수)</span>
              </span>
              <i className="bx bx-chevron-right signup_terms_chevron" aria-hidden="true" />
            </button>

            <button
              type="button"
              className="signup_terms_row"
              onClick={() => handleTermToggle('marketing')}
            >
              <span className={`signup_terms_check${terms.marketing ? ' is_active' : ''}`} aria-hidden="true">
                <i className="bx bx-check" />
              </span>
              <span className="signup_terms_text">
                이벤트 할인 혜택 알림 수신에 동의합니다.{' '}
                <span className="signup_terms_optional">(선택)</span>
              </span>
            </button>
          </div>
        </div>

        <Button
          type="submit"
          className="purple_btn"
          disabled={!isFormValid}
        >
          회원가입 하기
        </Button>
      </form>
    </div>
  )
}

export default Signup
