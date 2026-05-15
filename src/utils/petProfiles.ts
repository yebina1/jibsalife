import leeyoriImage from '../img/leeyori.png'
import pungpungiImage from '../img/pungpungi.png'

export type PetProfileSummary = {
  id: number
  type: 'profile'
  name: string
  breed: string
  image: string
  birthDate: string
  weight: string
  sex: string
}

const PET_PROFILES_STORAGE_KEY = 'jibsalife.pet-profiles'
const SELECTED_PET_PROFILE_ID_STORAGE_KEY = 'jibsalife.selected-pet-profile-id'
export const PET_PROFILES_CHANGE_EVENT = 'jibsalife.pet-profiles-change'

export const defaultPetProfiles: PetProfileSummary[] = [
  {
    id: 1,
    type: 'profile',
    name: '이요리',
    breed: '코리안 쇼트 헤어',
    image: leeyoriImage,
    birthDate: '2021.05.11',
    weight: '3',
    sex: '남',
  },
  {
    id: 2,
    type: 'profile',
    name: '뿡뿡이',
    breed: '포메라니안',
    image: pungpungiImage,
    birthDate: '2024.05.11',
    weight: '5',
    sex: '남',
  },
]

function normalizeProfileImage(image: unknown, fallbackImage: string) {
  if (typeof image !== 'string') return fallbackImage

  const trimmedImage = image.trim()
  if (!trimmedImage) return fallbackImage

  const isUploadedImage = trimmedImage.startsWith('data:image/')
  const isExternalImage = /^https?:\/\//.test(trimmedImage)
  const isCurrentBundledImage = trimmedImage === fallbackImage

  if (isUploadedImage || isExternalImage || isCurrentBundledImage) {
    return trimmedImage
  }

  return fallbackImage
}

function normalizePetProfile(value: Partial<PetProfileSummary>, fallback: PetProfileSummary): PetProfileSummary {
  return {
    id: typeof value.id === 'number' ? value.id : fallback.id,
    type: 'profile',
    name: typeof value.name === 'string' && value.name.trim() ? value.name : fallback.name,
    breed: typeof value.breed === 'string' && value.breed.trim() ? value.breed : fallback.breed,
    image: normalizeProfileImage(value.image, fallback.image),
    birthDate: typeof value.birthDate === 'string' ? value.birthDate : fallback.birthDate,
    weight: typeof value.weight === 'string' ? value.weight : fallback.weight,
    sex: typeof value.sex === 'string' ? value.sex : fallback.sex,
  }
}

export function readPetProfiles() {
  if (typeof window === 'undefined') {
    return defaultPetProfiles
  }

  const savedValue = window.localStorage.getItem(PET_PROFILES_STORAGE_KEY)
  if (!savedValue) {
    return defaultPetProfiles
  }

  try {
    const parsedValue = JSON.parse(savedValue) as Partial<PetProfileSummary>[]
    if (!Array.isArray(parsedValue) || parsedValue.length === 0) {
      return defaultPetProfiles
    }

    return parsedValue.map((profile, index) =>
      normalizePetProfile(profile, defaultPetProfiles[index] ?? defaultPetProfiles[0]),
    )
  } catch {
    return defaultPetProfiles
  }
}

export function writePetProfiles(nextProfiles: PetProfileSummary[]) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(PET_PROFILES_STORAGE_KEY, JSON.stringify(nextProfiles))
  window.dispatchEvent(new CustomEvent(PET_PROFILES_CHANGE_EVENT, { detail: nextProfiles }))
}

export function readSelectedPetProfileId() {
  const profiles = readPetProfiles()
  const fallbackProfile = profiles[0] ?? defaultPetProfiles[0]

  if (typeof window === 'undefined') {
    return fallbackProfile.id
  }

  const savedValue = Number(window.localStorage.getItem(SELECTED_PET_PROFILE_ID_STORAGE_KEY))
  return Number.isFinite(savedValue) && profiles.some((profile) => profile.id === savedValue)
    ? savedValue
    : fallbackProfile.id
}

export function writeSelectedPetProfileId(profileId: number) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(SELECTED_PET_PROFILE_ID_STORAGE_KEY, String(profileId))
  window.dispatchEvent(new CustomEvent(PET_PROFILES_CHANGE_EVENT, { detail: readPetProfiles() }))
}

export function readSelectedPetProfile() {
  const profiles = readPetProfiles()
  const selectedId = readSelectedPetProfileId()
  return profiles.find((profile) => profile.id === selectedId) ?? profiles[0] ?? defaultPetProfiles[0]
}

export function readSelectedPetProfileName() {
  return readSelectedPetProfile().name
}
