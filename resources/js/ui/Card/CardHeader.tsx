import BackButton from '@/ui/button/BackButton'
import Heading from '@/typography/Heading'
import React from 'react'
import AddButton from '@/ui/button/AddButton'
import EditButton from '@/ui/button/EditButton'
import DeleteButton from '@/ui/button/DeleteButton'
import BreadCrumbs, { BreadcrumbItemLink } from '@/Components/BreadCrumbs'

interface Props {
  title: string
  backUrl?: string
  addUrl?: string
  editUrl?: string
  deleteUrl?: string
  onAddClick?: () => unknown
  onBackClick?: () => unknown
  onEditClick?: () => unknown
  onDeleteClick?: () => unknown
  subheading?: string
  breadCrumb?: BreadcrumbItemLink[]
  titleClassName?: string
}

export default function CardHeader({
  title,
  backUrl,
  addUrl,
  onAddClick,
  onBackClick,
  editUrl,
  onEditClick,
  deleteUrl,
  onDeleteClick,
  subheading,
  breadCrumb,
  titleClassName,
}: Props) {
  return (
    <div className=''>
      <div className='flex flex-wrap items-center justify-between gap-5 px-4 py-4'>
        <div className='flex items-center gap-5'>
          {(backUrl != null || onBackClick != null) && (
            <BackButton
              link={backUrl}
              onClick={onBackClick}
            />
          )}
          <div className='flex flex-col'>
            <Heading className={`subheader-1stop uppercase ${titleClassName}`}>{title}</Heading>
            <BreadCrumbs breadcrumbItems={breadCrumb} />
          </div>
        </div>

        <div className='flex flex-wrap gap-2'>
          {(editUrl != null || onEditClick != null) && (
            <EditButton
              link={editUrl}
              onClick={onEditClick}
            />
          )}
          {(deleteUrl != null || onDeleteClick != null) && (
            <DeleteButton
              link={deleteUrl}
              onClick={onDeleteClick}
            />
          )}
          {(addUrl != null || onAddClick != null) && (
            <AddButton
              link={addUrl}
              onClick={onAddClick}
            />
          )}
        </div>
      </div>
      <div className='small-1stop pl-4 text-primary'>{subheading ?? ''}</div>
    </div>
  )
}
