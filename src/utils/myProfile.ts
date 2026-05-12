import profileImage from '../img/pink_dog_profile.jpg'

export const MY_PROFILE_NAME = '뿌직뿌직'
export const MY_PROFILE_IMAGE = profileImage

const MY_PROFILE_STORAGE_KEY = 'jibsalife.my-profile'
export const MY_PROFILE_CHANGE_EVENT = 'jibsalife.my-profile-change'

type MyProfileStore = {
  name: string
}

const defaultMyProfile: MyProfileStore = {
  name: MY_PROFILE_NAME,
}

export function readMyProfile() {
  if (typeof window === 'undefined') {
    return defaultMyProfile
  }

  const savedValue = window.localStorage.getItem(MY_PROFILE_STORAGE_KEY)
  if (!savedValue) {
    return defaultMyProfile
  }

  try {
    const parsedValue = JSON.parse(savedValue) as Partial<MyProfileStore>
    return {
      name: typeof parsedValue.name === 'string' && parsedValue.name.trim()
        ? parsedValue.name
        : MY_PROFILE_NAME,
    }
  } catch {
    return defaultMyProfile
  }
}

export function readMyProfileName() {
  return readMyProfile().name
}

export function writeMyProfile(nextProfile: MyProfileStore) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(MY_PROFILE_STORAGE_KEY, JSON.stringify(nextProfile))
  window.dispatchEvent(new CustomEvent(MY_PROFILE_CHANGE_EVENT, { detail: nextProfile }))
}

