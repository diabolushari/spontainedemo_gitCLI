import AIInsights from './components/AiInsights'
import MainArea from './components/MainArea'
import Sidebar from './components/Sidebar'

interface Props {
  chatToken: string
  chatURL: string
}

export default function Chat({ chatToken, chatURL }: Props) {
  return (
    <div className='flex h-screen bg-gradient-to-r from-purple-300 to-blue-200'>
      <Sidebar />
      <MainArea
        chatToken={chatToken}
        chatURL={chatURL}
      />
      <AIInsights />
    </div>
  )
}
