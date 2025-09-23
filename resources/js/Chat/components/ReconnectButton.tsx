import React from 'react'
import { FiWifi, FiWifiOff } from 'react-icons/fi'

interface ReconnectButtonProps {
  onReconnect: () => void
  isReconnecting: boolean
}

const ReconnectButton = React.memo(({ onReconnect, isReconnecting }: ReconnectButtonProps) => {
  return (
    <div className='flex flex-col items-center gap-4'>
      <div className='flex flex-col items-center gap-2 text-center'>
        <div className='flex h-16 w-16 items-center justify-center rounded-full bg-red-100'>
          <FiWifiOff className='h-8 w-8 text-red-600' />
        </div>
        <h2 className='text-lg font-semibold text-gray-800'>Connection Lost</h2>
        <p className='text-sm text-gray-600'>
          The chat connection has been interrupted. Click below to reconnect.
        </p>
      </div>

      <button
        onClick={onReconnect}
        disabled={isReconnecting}
        className={`flex items-center gap-3 rounded-xl px-6 py-3 font-medium transition-all duration-200 ${
          isReconnecting
            ? 'cursor-not-allowed bg-gray-400 text-white'
            : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg'
        }`}
      >
        {isReconnecting ? (
          <>
            <div className='h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-white'></div>
            <span>Reconnecting...</span>
          </>
        ) : (
          <>
            <FiWifi className='h-5 w-5' />
            <span>Reconnect to Chat</span>
          </>
        )}
      </button>
    </div>
  )
})

ReconnectButton.displayName = 'ReconnectButton'

export default ReconnectButton
