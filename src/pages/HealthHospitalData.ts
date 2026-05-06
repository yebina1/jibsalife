import hospitalPhoto24h from '../img/24h_animal.png'
import hospitalPhotoCompanion from '../img/companion_animal.png'
import hospitalPhotoLove from '../img/love_animal.png'
import hospitalPhotoWe from '../img/we_animal.png'

export type HospitalSearchItem = {
  name: string
  image: string
  rating: string
  reviewCount: number
  distanceKm: number
  tags: string[]
  open: string
  close: string
}

export const hospitalSearchItems: HospitalSearchItem[] = [
  {
    name: '24시 행복 동물병원',
    image: hospitalPhoto24h,
    rating: '4.8',
    reviewCount: 120,
    distanceKm: 1.2,
    tags: ['고양이친화', '건강검진', '스케일링'],
    open: '09:00',
    close: '20:30',
  },
  {
    name: '우리반려 동물병원',
    image: hospitalPhotoCompanion,
    rating: '4.5',
    reviewCount: 680,
    distanceKm: 0.7,
    tags: ['중성화수술', '건강검진', '스케일링'],
    open: '09:00',
    close: '19:00',
  },
  {
    name: '사랑 동물병원',
    image: hospitalPhotoLove,
    rating: '4.3',
    reviewCount: 420,
    distanceKm: 2.1,
    tags: ['외과응급진료', '강아지치과', '스케일링'],
    open: '09:00',
    close: '20:00',
  },
  {
    name: '우리 동물병원',
    image: hospitalPhotoWe,
    rating: '4.6',
    reviewCount: 198,
    distanceKm: 1.8,
    tags: ['고양이친화', '건강검진', '스케일링'],
    open: '09:00',
    close: '20:30',
  },
]

function toMinutes(value: string) {
  const [hour, minute] = value.split(':').map(Number)
  return hour * 60 + minute
}

export function getOperatingState(open: string, close: string) {
  const now = new Date()
  const currentMinutes = now.getHours() * 60 + now.getMinutes()
  const isOpen = currentMinutes >= toMinutes(open) && currentMinutes <= toMinutes(close)

  return { isOpen }
}
