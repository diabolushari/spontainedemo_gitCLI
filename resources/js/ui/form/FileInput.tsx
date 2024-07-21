import React, { ChangeEvent } from 'react'
import { XIcon } from 'lucide-react'
import StrongText from '@/typograpy/StrongText'
import Paragraph from '@/typograpy/Paragraph'
import ErrorText from '@/typograpy/ErrorText'

export interface Props {
  file?: File | null
  label?: string
  error?: string
  styles?: string
  setValue: (value: File | null) => unknown
  accept?: string
}

function fileSizeInMB(sizeInBytes?: number): string {
  return ((sizeInBytes ?? 0) / (1024 * 1024)).toFixed(2)
}

export default function FileInput({ file, label, error, setValue, accept }: Props) {
  const onFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files != null && e.target.files.length > 0) {
      setValue(e.target.files[0])
    }
  }

  return (
    <>
      {file == null && (
        <>
          <label className='standard-label'>{label}</label>
          <input
            type='file'
            name='name'
            onChange={onFile}
            className='standard-input'
            accept={accept}
          />
        </>
      )}
      {file != null && (
        <div className='flex flex-col items-center text-center'>
          <StrongText>{file.name}</StrongText>
          <Paragraph>{fileSizeInMB(file.size)} MB</Paragraph>
          <Paragraph>{file?.type}</Paragraph>
          <button
            type='button'
            onClick={() => setValue(null)}
            className='ml-2 text-red-500 hover:bg-gray-200 rounded-lg p-2 hover:text-white'
          >
            <XIcon size={20} />
          </button>
        </div>
      )}
      {error && <ErrorText>{error}</ErrorText>}
    </>
  )
}
