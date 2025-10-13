import { DataLoaderQuery } from '@/interfaces/data_interfaces'
import React, { useState } from 'react'
import axios from 'axios'
import Modal from '@/ui/Modal/Modal'
import useCustomForm from '@/hooks/useCustomForm'
import Input from '@/ui/form/Input'
import TextArea from '@/ui/form/TextArea'
import CheckBox from '@/ui/form/CheckBox'
import SelectList from '@/ui/form/SelectList'
import Button from '@/ui/button/Button'
import FullSpinnerWrapper from '@/ui/FullSpinnerWrapper'
import { handleHttpErrors, showSuccess } from '@/ui/alerts'
import { databaseDrivers } from '@/Pages/DataLoader/DataLoaderConnectionCreate'
import DynamicSelectList from '@/ui/form/DynamicSelectList'

interface CreateQueryModalProps {
  onClose: () => void
  onSuccess: (query: DataLoaderQuery) => void
}

const CreateQueryModal = ({ onClose, onSuccess }: CreateQueryModalProps) => {
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const { formData, setFormValue, toggleBoolean } = useCustomForm({
    // Query fields
    name: '',
    description: '',
    query: '',

    // Connection toggle
    use_existing_connection: false,
    connection_id: '',

    // New connection fields
    connection_name: '',
    connection_description: '',
    driver: 'mysql',
    host: '',
    port: '3306',
    username: '',
    password: '',
    database: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    try {
      const response = await axios.post(route('api.create.loader.query'), formData)
      if (response.data.success) {
        showSuccess(response.data.message)
        onSuccess(response.data.data)
        onClose()
      }
    } catch (error) {
      const validationErrors = handleHttpErrors(error, false)
      setErrors(validationErrors)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      setShowModal={onClose}
      title='Create New Query'
      large
    >
      <form
        onSubmit={handleSubmit}
        className='flex flex-col gap-4 p-4'
      >
        {/* Query Fields */}
        <div className='border-b pb-4'>
          <h3 className='mb-3 text-lg font-semibold'>Query Details</h3>
          <div className='grid grid-cols-1 gap-4'>
            <div className='flex flex-col gap-2'>
              <Input
                label='Query Name'
                value={formData.name}
                setValue={setFormValue('name')}
                error={errors.name}
              />
            </div>
            <div className='flex flex-col'>
              <TextArea
                label='Description'
                value={formData.description}
                setValue={setFormValue('description')}
                error={errors.description}
              />
            </div>
            <div className='flex flex-col'>
              <TextArea
                label='SQL Query'
                value={formData.query}
                setValue={setFormValue('query')}
                error={errors.query}
                placeholder='SELECT * FROM ...'
              />
            </div>
          </div>
        </div>

        {/* Connection Section */}
        <div>
          <h3 className='mb-3 text-lg font-semibold'>Connection</h3>

          <div className='mb-4'>
            <CheckBox
              label='Use existing connection'
              value={formData.use_existing_connection}
              toggleValue={toggleBoolean('use_existing_connection')}
            />
          </div>

          {formData.use_existing_connection ? (
            <div className='flex flex-col'>
              <DynamicSelectList
                label='Select Connection'
                url={route('loader-connections-list')}
                dataKey='id'
                displayKey='name'
                value={formData.connection_id}
                setValue={setFormValue('connection_id')}
                error={errors.connection_id}
              />
            </div>
          ) : (
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <div className='flex flex-col'>
                <Input
                  label='Connection Name'
                  value={formData.connection_name}
                  setValue={setFormValue('connection_name')}
                  error={errors.connection_name}
                />
              </div>
              <div className='flex flex-col'>
                <TextArea
                  label='Connection Description'
                  value={formData.connection_description}
                  setValue={setFormValue('connection_description')}
                  error={errors.connection_description}
                />
              </div>
              <div className='flex flex-col'>
                <SelectList
                  label='Driver'
                  list={databaseDrivers}
                  dataKey='value'
                  displayKey='label'
                  value={formData.driver}
                  setValue={setFormValue('driver')}
                  error={errors.driver}
                />
              </div>
              <div className='flex flex-col'>
                <Input
                  label='Host'
                  value={formData.host}
                  setValue={setFormValue('host')}
                  error={errors.host}
                />
              </div>
              <div className='flex flex-col'>
                <Input
                  label='Port'
                  value={formData.port}
                  setValue={setFormValue('port')}
                  error={errors.port}
                />
              </div>
              <div className='flex flex-col'>
                <Input
                  label='Database'
                  value={formData.database}
                  setValue={setFormValue('database')}
                  error={errors.database}
                />
              </div>
              <div className='flex flex-col'>
                <Input
                  label='Username'
                  value={formData.username}
                  setValue={setFormValue('username')}
                  error={errors.username}
                />
              </div>
              <div className='flex flex-col'>
                <Input
                  label='Password'
                  type='password'
                  value={formData.password}
                  setValue={setFormValue('password')}
                  error={errors.password}
                />
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className='flex justify-end gap-3 border-t pt-4'>
          <Button
            label='Cancel'
            variant='secondary'
            type='button'
            onClick={onClose}
          />
          <FullSpinnerWrapper processing={loading}>
            <Button
              label='Create Query'
              type='submit'
            />
          </FullSpinnerWrapper>
        </div>
      </form>
    </Modal>
  )
}

export default CreateQueryModal
