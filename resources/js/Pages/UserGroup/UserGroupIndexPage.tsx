import ListResourcePage, { ListItemKeys } from '@/Components/ListingPage/ListResourcePage'
import { FormItem } from '@/FormBuilder/FormBuilder'
import useCustomForm from '@/hooks/useCustomForm'
import { UserGroup } from '@/interfaces/data_interfaces'
import { Paginator } from '@/ui/ui_interfaces'
import { router } from '@inertiajs/react'
import { useCallback, useMemo } from 'react'

interface Props {
  userGroups: Paginator<UserGroup>
  oldSearch?: string
}

export default function UserGroupIndexPage({ userGroups, oldSearch }: Readonly<Props>) {
  const { formData, setFormValue } = useCustomForm({
    search: oldSearch ?? '',
  })

  const formItems = useMemo<Record<'search', FormItem<string, any, any, any>>>(() => {
    return {
      search: {
        type: 'text',
        placeholder: 'Search by group name',
        label: 'Search',
        setValue: setFormValue('search'),
      },
    }
  }, [setFormValue])

  const data = useMemo(() => {
    return userGroups.data.map((group) => ({
      ...group,
      actions: [
        {
          title: 'View',
          url: route('manage-user-group.show', {
            userGroup: group.id,
          }),
        },
      ],
    }))
  }, [userGroups])

  const keys = useMemo(() => {
    return [
      { key: 'group_name', label: 'Group Name', isCardHeader: true },
      {
        key: 'description',
        label: 'Description',
        isShownInCard: true,
        hideLabel: false,
      },
      {
        key: 'users_count',
        label: 'Users',
        isShownInCard: true,
        hideLabel: false,
      },
    ] as ListItemKeys<UserGroup>[]
  }, [])

  const handleCardClick = useCallback((id: number | string) => {
    router.get(route('manage-user-group.show', { manage_user_group: id }))
  }, [])

  return (
    <ListResourcePage
      formData={formData}
      formItems={formItems}
      keys={keys}
      rows={data}
      paginator={userGroups}
      searchUrl={route('manage-user-group.index')}
      addUrl={route('manage-user-group.create')}
      primaryKey='id'
      type='users'
      subtype='user-groups'
      title='User Groups'
      subheading='Manage user groups, permissions, and hierarchy assignments.'
      handleCardClick={handleCardClick}
      formStyles='bg-white p-4 rounded-lg shadow-sm border border-gray-100'
      cardStyles='p-4 hover:scale-[1.02] transition-transform duration-200 shadow-sm hover:shadow-md cursor-pointer'
    />
  )
}
