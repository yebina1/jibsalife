import './Community.css'
import './CommunityVote.css'
import CommunityPage from '../components/CommunityPage'
import PageHeader from '../components/PageHeader'
import HeaderIcon from '../components/HeaderIcon'
import ContentSection from '../components/ContentSection'
import FloatingWriteButton from '../components/FloatingWriteButton'
import Button from '../components/html/Button'
import contents1 from '../img/contents1.png'
import contents2 from '../img/contents2.png'
import contents3 from '../img/contents3.png'
import contents4 from '../img/contents4.png'
import challengeHeadingImage from '../img/illust_login_pet.jpg'
import leeyoriImage from '../img/leeyori.png'
import pungpungiImage from '../img/pungpungi.png'

const communityVoteDependencies = {
  PageHeader,
  HeaderIcon,
  ContentSection,
  FloatingWriteButton,
  Button,
  contents1,
  contents2,
  contents3,
  contents4,
  challengeHeadingImage,
  leeyoriImage,
  pungpungiImage,
}

function CommunityVote() {
  return <CommunityPage section="vote" dependencies={communityVoteDependencies} />
}

export default CommunityVote
