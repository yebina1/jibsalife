import dogStarBanner from '../../img/2026_05_3weeks_vote/2026_05_3_weeks_dog_star_vote.png'
import dogStarVote1 from '../../img/2026_05_3weeks_vote/2026_05_3weeks_vote_1.jpg'
import dogStarVote2 from '../../img/2026_05_3weeks_vote/2026_05_3weeks_vote_2.jpg'
import dogStarVote3 from '../../img/2026_05_3weeks_vote/2026_05_3weeks_vote_3.jpg'
import dogStarVote4 from '../../img/2026_05_3weeks_vote/2026_05_3weeks_vote_4.jpg'
import dogStarVote5 from '../../img/2026_05_3weeks_vote/2026_05_3weeks_vote_5.jpg'
import dogStarVote6 from '../../img/2026_05_3weeks_vote/2026_05_3weeks_vote_6.jpg'
import dogStarVote7 from '../../img/2026_05_3weeks_vote/2026_05_3weeks_vote_7.jpg'
import dogStarVote8 from '../../img/2026_05_3weeks_vote/2026_05_3weeks_vote_8.jpg'
import dogStarVote9 from '../../img/2026_05_3weeks_vote/2026_05_3weeks_vote_9.jpg'
import dogStarVote10 from '../../img/2026_05_3weeks_vote/2026_05_3weeks_vote_10.jpg'
import bestPoseBanner from '../../img/pose_vote/best_pose_vote.png'
import poseVote1 from '../../img/pose_vote/pose_vote_1.jpg'
import poseVote2 from '../../img/pose_vote/pose_vote_2.jpg'
import poseVote3 from '../../img/pose_vote/pose_vote_3.jpg'
import poseVote4 from '../../img/pose_vote/pose_vote_4.jpg'
import poseVote5 from '../../img/pose_vote/pose_vote_5.jpg'
import poseVote6 from '../../img/pose_vote/pose_vote_6.jpg'
import poseVote7 from '../../img/pose_vote/pose_vote_7.jpg'
import poseVote8 from '../../img/pose_vote/pose_vote_8.jpg'
import poseVote9 from '../../img/pose_vote/pose_vote_9.jpg'
import poseVote10 from '../../img/pose_vote/pose_vote_10.jpg'

export type CommunityVoteId = 'mission' | 'subscriber' | 'best-pose'

type VoteCandidate = {
  id: number
  name: string
  image: string
}

export type MissionVote = {
  id: Extract<CommunityVoteId, 'mission' | 'subscriber'>
  sectionTitle: string
  title: string
  participants: number
  timeText: string
  organizer: string
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
    id: 'mission',
    sectionTitle: '멍스타 미션 투표',
    title: '밥 먹는 사진 중 BEST를 골라주세요!',
    participants: 22,
    timeText: '7시간 남음',
    organizer: '운영자',
  },
  {
    id: 'subscriber',
    sectionTitle: '구독자 전용 참여하기',
    title: '멍스타 도전하기',
    participants: 22,
    timeText: '7시간 남음',
    organizer: '운영자',
  },
]

export const regularVoteItems = [
  {
    id: 1,
    voteId: 'best-pose',
    title: '오늘의 베스트 포즈는?',
    description: '가장 포즈가 돋보이는 것을 골라주세요.',
    deadline: '2026년 4월 30일까지',
    participants: 10,
    done: false,
  },
  {
    id: 2,
    title: '간식 기다리기 챔피언은?',
    description: '간식을 기다리는 가장 귀여운 순간을 골라주세요',
    deadline: '2026년 4월 30일까지',
    participants: 22,
    done: true,
  },
  {
    id: 3,
    title: '집사 바라기 1등은?',
    description: '가장 마음이 녹는 것을 골라주세요',
    deadline: '2026년 4월 30일까지',
    participants: 8,
    done: true,
  },
  {
    id: 4,
    title: '표정 부자는 누구?',
    description: '가장 매력적인 순간을 골라주세요.',
    deadline: '2026년 4월 30일까지',
    participants: 4,
    done: true,
  },
  {
    id: 5,
    title: '표정 부자는 누구?',
    description: '가장 매력적인 순간을 골라주세요.',
    deadline: '2026년 4월 30일까지',
    participants: 4,
    done: true,
  },
] as const

const dogStarCandidates = [
  { id: 1, name: '콩이', image: dogStarVote1 },
  { id: 2, name: '공심이', image: dogStarVote2 },
  { id: 3, name: '뽕뽕이', image: dogStarVote3 },
  { id: 4, name: '도라', image: dogStarVote4 },
  { id: 5, name: '봉이', image: dogStarVote5 },
  { id: 6, name: '바둑이', image: dogStarVote6 },
  { id: 7, name: '몽이', image: dogStarVote7 },
  { id: 8, name: '로이', image: dogStarVote8 },
  { id: 9, name: '설기', image: dogStarVote9 },
  { id: 10, name: '슈슈', image: dogStarVote10 },
] as const

const poseCandidates = [
  { id: 1, name: '쿠키', image: poseVote1 },
  { id: 2, name: '호두', image: poseVote2 },
  { id: 3, name: '이불리', image: poseVote3 },
  { id: 4, name: '라운이', image: poseVote4 },
  { id: 5, name: '봄이', image: poseVote5 },
  { id: 6, name: '바둑이', image: poseVote6 },
  { id: 7, name: '창순이', image: poseVote7 },
  { id: 8, name: '두릅이', image: poseVote8 },
  { id: 9, name: '보리', image: poseVote9 },
  { id: 10, name: '찹쌀이', image: poseVote10 },
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
