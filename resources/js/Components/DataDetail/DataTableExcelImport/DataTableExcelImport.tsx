import { DataDetail } from '@/interfaces/data_interfaces'
import Button from '@/ui/button/Button'
import { useCallback, useState } from 'react'
import Modal from '@/ui/Modal/Modal'
import useCustomForm from '@/hooks/useCustomForm'
import useInertiaPost from '@/hooks/useInertiaPost'
import FileInput from '@/ui/form/FileInput'

interface Props {
  dataDetail: DataDetail
}

export default function DataTableExcelImport({ dataDetail }: Readonly<Props>) {
  const [showImportModal, setShowImportModal] = useState(false)

  const onUploadComplete = useCallback(() => {
    setShowImportModal(false)
  }, [])

  const { formData, setFormValue } = useCustomForm({
    file: null as File | null,
  })

  const { post, errors, loading } = useInertiaPost<{ file: File | null }>(
    route('import-data-table', {
      dataDetail: dataDetail.id,
    }),
    {
      onComplete: onUploadComplete,
    }
  )

  return (
    <>
      <Button
        label='Import Excel'
        onClick={() => setShowImportModal(true)}
      />
      {showImportModal && (
        <Modal
          title='Import Excel'
          setShowModal={setShowImportModal}
        >
          <form className='flex flex-col gap-5 p-2'>
            <div className='flex flex-col'>
              <FileInput
                setValue={setFormValue('file')}
                label='File'
                accept='xls,xlsx'
                error={errors.file}
                file={formData.file}
              />
            </div>
            <div className='flex justify-end gap-5'>
              <Button
                label='Cancel'
                onClick={() => setShowImportModal(false)}
              />
              <Button
                label='Import'
                onClick={() => post(formData)}
                processing={loading}
              />
            </div>
          </form>
        </Modal>
      )}
    </>
  )
}
