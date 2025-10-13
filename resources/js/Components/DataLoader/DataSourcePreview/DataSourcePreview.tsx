import React, { useState } from 'react'
import Button from '@/ui/button/Button'
import Card from '@/ui/Card/Card'
import JsonDataViewer from './JsonDataViewer'

interface Props {
  url: string
}

function DataSourcePreview({ url }: Readonly<Props>) {
  const [showPreview, setShowPreview] = useState(false)

  return (
    <Card className='my-10 px-2 py-5'>
      <div className='my-5 flex'>
        <Button
          label='Test Query'
          onClick={() => setShowPreview(true)}
        />
      </div>
      {showPreview && <JsonDataViewer url={url} />}
    </Card>
  )
}

export default React.memo(DataSourcePreview)
