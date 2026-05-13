import dogStarBanner from '../../img/2026_05_3weeks_vote/2026_05_3_weeks_dog_star_vote.png'
import dogStarVote1 from '../../img/2026_05_3weeks_vote/2026_05_3weeks_vote_1.jpg'
import dogStarVote2 from '../../img/2026_05_3weeks_vote/2026_05_3weeks_vote_2.jpg'
import dogStarVote3 from '../../img/2026_05_3weeks_vote/2026_05_3weeks_vote_3.jpg'
import dogStarVote4 from '../../img/2026_05_3weeks_vote/2026_05_3weeks_vote_4.jpg'
import dogStarVote5 from '../../img/2026_05_3weeks_vote/2026_05_3weeks_vote_5.jpg'
import dogStarVote6 from '../../img/2026_05_3weeks_vote/2026_05_3weeks_vote_6.jpg'
import bestPoseBanner from '../../img/vote/pose_vote/best_pose_vote.png'
import poseVote1 from '../../img/vote/pose_vote/pose_vote1.png'
import poseVote2 from '../../img/vote/pose_vote/pose_vote2.png'
import poseVote3 from '../../img/vote/pose_vote/pose_vote3.png'
import poseVote4 from '../../img/vote/pose_vote/pose_vote4.png'
import poseVote5 from '../../img/vote/pose_vote/pose_vote5.png'
import poseVote6 from '../../img/vote/pose_vote/pose_vote6.png'

export type CommunityVoteId = 'mission' | 'subscriber' | 'best-pose'

type VoteCandidate = {
  id: number
  name: string
  image: string
  objectPosition?: string
}

export type MissionVote = {
  id: CommunityVoteId
  sectionTitle: string
  title: string
  participants: number
  timeText: string
  organizer: string
  buttonType?: 'vote' | 'notify' | 'result'
  subText?: string
}

export type VoteDetail = {
  id: CommunityVoteId
  timeText: string
  bannerTitleLines: string[]
  bannerDescription: string
  bannerBackgroundColor: string
  bannerImage: string
  candidates: readonly VoteCandidate[]
}

export const missionVotes: MissionVote[] = [
  {
    id: 'best-pose',
    sectionTitle: '멍스타 미션 투표',
    title: '이달의 BEST 포즈는?',
    participants: 22,
    timeText: '7시간 남음',
    organizer: '운영자',
  },
  {
    id: 'subscriber',
    sectionTitle: '멍스타 미션 투표',
    title: '집사일기 멍스타 모델 도전하기',
    participants: 10,
    timeText: '02:18:35 남음',
    organizer: '운영자',
    buttonType: 'notify',
    subText: '선착순 10명 한정 오픈 예정',
  },
]

export const regularVoteItems = [
  {
    id: 1,
    title: '이번 생일파티에 쓸 사진 골라주세요',
    description: '우리 꼬미 생일 파티에 쓸 사진 골라주세요',
    deadline: '2026년 4월 30일까지',
    participants: 10,
    done: false,
    modified: true,
  },
  {
    id: 2,
    title: '침대 올라오면 봐준다 vs 절대 안 된다',
    description: '현실 집사 밸런스 게임',
    deadline: '2026년 4월 30일까지',
    participants: 22,
    done: false,
    resultOnly: true,
  },
  {
    id: 3,
    title: '간식은 하루에 몇 번 정도 주시나요?',
    description: '다들 어떻게 관리하시는지 궁금해요!',
    deadline: '2026년 4월 30일까지',
    participants: 8,
    done: false,
    modified: true,
  },
  {
    id: 4,
    title: '우리 아이 사진이 사람 사진보다 많다',
    description: '집사들의 OX 투표',
    deadline: '2026년 4월 30일까지',
    participants: 4,
    done: false,
  },
] as const

const dogStarCandidates = [
  { id: 1, name: '콩이', image: dogStarVote1 },
  { id: 2, name: '공심이', image: dogStarVote2 },
  { id: 3, name: '뽕뽕이', image: dogStarVote3 },
  { id: 4, name: '도라', image: dogStarVote4 },
  { id: 5, name: '봉이', image: dogStarVote5 },
  { id: 6, name: '바둑이', image: dogStarVote6 },
] as const

const poseCandidates = [
  { id: 1, name: '쿠키', image: poseVote1 },
  { id: 2, name: '호두', image: poseVote2 },
  { id: 3, name: '이불리', image: poseVote3 },
  { id: 4, name: '라운이', image: poseVote4 },
  { id: 5, name: '봄이', image: poseVote5 },
  { id: 6, name: '바둑이', image: poseVote6 },
] as const

export const voteDetails: VoteDetail[] = [
  {
    id: 'mission',
    timeText: '7시간 남음',
    bannerTitleLines: ['5월 3주차', '멍스타 미션 투표'],
    bannerDescription: '밥 먹는 사진 중 BEST를 골라주세요!',
    bannerBackgroundColor: '#FFE9BB',
    bannerImage: dogStarBanner,
    candidates: dogStarCandidates,
  },
  {
    id: 'subscriber',
    timeText: '7시간 남음',
    bannerTitleLines: ['5월 3주차', '멍스타 도전하기'],
    bannerDescription: '우리 아이의 멍스타 순간에 도전해보세요!',
    bannerBackgroundColor: '#FFE9BB',
    bannerImage: dogStarBanner,
    candidates: dogStarCandidates,
  },
  {
    id: 'best-pose',
    timeText: '7시간 남음',
    bannerTitleLines: ['이달의', 'Best 포즈는?'],
    bannerDescription: '포즈가 돋보이는 BEST를 골라주세요!',
    bannerBackgroundColor: '#A7D8F8',
    bannerImage: bestPoseBanner,
    candidates: poseCandidates,
  },
]
