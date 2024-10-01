import React from 'react'
import { Head } from '@inertiajs/react'

export interface MetaTagsFields {
  title?: string
  description?: string
  image?: string
  noIndex?: boolean
}

const MetaTags = ({
  title = 'KSEB',
  description = ``,
  image = '',
  noIndex = false,
}: MetaTagsFields) => {
  const url = ''

  return (
    <Head title={title}>
      <meta
        name='robots'
        content={`${noIndex ? 'noindex' : 'index'}`}
      />

      <meta
        name='twitter:card'
        content='summary_large_image'
      />
      <meta
        name='twitter:title'
        content={title}
      />
      <meta
        name='twitter:domain'
        content={url}
      />
      <meta
        name='twitter:image:src'
        content={image}
      />
      <meta
        name='twitter:description'
        content={description}
      />
      <meta
        name='title'
        property='og:title'
        content={title}
      />
      <meta
        property='og:type'
        content='article'
      />
      <meta
        name='og:url'
        content={url}
      />
      <meta
        name='image'
        property='og:image'
        content={image}
      />
      <meta
        name='description'
        property='og:description'
        content={description}
      />
      <meta
        name='author'
        content='Technopark'
      />
      <meta
        property='og:title'
        content={title}
      />
      <meta
        property='og:type'
        content='article'
      />
      <meta
        property='og:url'
        content={url}
      />
      <meta
        property='og:image'
        content={image}
      />
      <meta
        property='og:description'
        content={description}
      />
    </Head>
  )
}

export default MetaTags
