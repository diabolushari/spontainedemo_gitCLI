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
  hierarchy_primary_field?: MetaHierarchyItem[]
  hierarchy_secondary_field?: MetaHierarchyItem[]
  hierarchy_primary_field_count?: number
  hierarchy_secondary_field_count?: number
  group_item_count: number
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
  levels?: Partial<MetaHierarchyLevelInfo>[]
}

export interface MetaHierarchyItem extends Model {
  meta_hierarchy_id: number
  parent_id: number | null
  level: number
  primary_field_id: number
  secondary_field_id: number | null
  primary_field?: Partial<MetaData> | null
  secondary_field?: Partial<MetaData> | null
  meta_hierarchy?: Partial<MetaHierarchy> | null
  parent?: Partial<MetaHierarchyItem> | null
  levelInfos?: Partial<MetaHierarchyLevelInfo>[]
}

export interface MetaHierarchyLevelInfo extends Model {
  level: number
  primary_field_structure_id: number | null
  secondary_field_structure_id: number
  name: string | null
  primary_structure: MetaStructure | null
  secondary_structure: MetaStructure | null
}
