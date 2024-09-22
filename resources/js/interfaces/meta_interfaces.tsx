import { Model } from '@/interfaces/data_interfaces'

export interface MetaStructure extends Model {
  structure_name: string
  description?: string | null
  meta_data_count?: number
}

export interface MetaData extends Model {
  name: string
  description?: string | null
  meta_structure_id: number
  meta_structure?: Partial<MetaStructure> | null
  structure_name?: string | null

  meta_hierarchy?: MetaHierarchy
  meta_group?: MetaDataGroup

  hierarchy_item?: MetaHierarchyItem[]
  group_item?: MetaDataGroupItem[]
}

export interface MetaDataGroup extends Model {
  name: string
  description?: string | null
  items_count?: number
}

export interface MetaDataGroupItem extends Model {
  meta_group_id: number
  meta_data_id: number
  meta_data?: Partial<MetaData> | null
  meta_data_group?: Partial<MetaDataGroup> | null
  meta_data_name?: string | null
  meta_group_name?: string | null
}

export interface MetaHierarchy extends Model {
  name: string
  description?: string | null
  items?: Partial<MetaHierarchyItem>[]
  items_count?: number
}

export interface MetaHierarchyItem extends Model {
  meta_hierarchy_id: number
  parent_id: number | null
  level: number
  meta_data_id: number
  meta_data?: Partial<MetaData> | null
  meta_hierarchy?: Partial<MetaHierarchy> | null
  parent?: Partial<MetaHierarchyItem> | null
}
