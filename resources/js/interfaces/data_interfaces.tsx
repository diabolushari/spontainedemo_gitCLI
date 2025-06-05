import { JSONStructureDefinition } from '@/Components/DataLoader/SetDataStructure/useJsonStructure'
import { JsonFieldMapping } from '@/Components/DataLoader/useJsonFieldMapping'
import { MetaData, MetaHierarchy, MetaStructure } from '@/interfaces/meta_interfaces'

export interface Model {
  id: number
  created_at?: string | null
  updated_at?: string | null
  created_by?: number | null
  updated_by?: number | null
}

export interface User extends Model {
  name: string
  email: string
  role?: string
  office_code?: string
}

export interface ReferenceDataDomain extends Model {
  domain: string
}

export interface ReferenceDataParameter extends Model {
  domain_id: number
  parameter: string
}

export interface ReferenceData extends Model {
  domain_id: number
  parameter_id: number
  domain: string
  parameter: string
  sort_order: number
  value_one: string
  value_two: string | null
}

export interface SubjectArea extends Model {
  name: string
  description: string | null
  table_name: string
  is_active: 0 | 1
}

export interface DataDetail extends Model {
  subject_area_id: number
  name: string
  description: string | null
  subject_area: string
  table_name: string
  date_fields?: Partial<TableDateField>[]
  dimension_fields?: Partial<TableDimensionField>[]
  measure_fields?: Partial<TableMeasureField>[]
  relation_fields?: Partial<DataTableRelation>[]
  text_fields?: Partial<DataTableText>[]
  jobs?: Partial<DataLoaderJob>[]
  is_active: 0 | 1
}

export interface TableDateField extends Model {
  data_detail_id: number
  column: string
  field_name: string
}

export interface TableDimensionField extends Model {
  data_detail_id: number
  column: string
  field_name: string
  meta_structure_id: number
  structure?: Partial<MetaStructure>
}

export interface TableMeasureField extends Model {
  data_detail_id: number
  column: string
  unit_column: string | null
  field_name: string
  unit_field_name: string | null
}

export interface SubsetDetail extends Model {
  name: string
  description: string | null
  group_data: 0 | 1
  data_detail_id: number
  dates?: Partial<SubsetDateField>[]
  dimensions?: Partial<SubsetDimensionField>[]
  measures?: Partial<SubsetMeasureField>[]
  data_detail?: Partial<DataDetail> | null
  max_rows_to_fetch: number | null
  use_for_training_ai: 0 | 1
  proactive_insight_instructions: string | null
  visualization_instructions: string | null
  type: string | null
}

export interface SubsetDateField extends Model {
  subset_detail_id: number
  field_id: number
  start_date: string | null
  subset_field_name: string
  subset_column: string
  end_date: string | null
  use_expression: 0 | 1
  date_field_expression: string | null
  use_dynamic_date: 0 | 1
  use_last_found_data: 0 | 1
  dynamic_start_type: string | null
  dynamic_start_offset: number | null
  dynamic_start_unit: string | null
  dynamic_end_type: string | null
  dynamic_end_offset: number | null
  dynamic_end_unit: string | null
  sort_order: string | null
  info?: Partial<TableDateField>
}

export interface SubsetDimensionField extends Model {
  subset_detail_id: number
  field_id: number
  subset_field_name: string
  subset_column: string
  filter_only: 0 | 1
  column_expression: string | null
  hierarchy_id: number | null
  description: string | null
  sort_order: string | null
  filters: number[] | null
  filter_values?: Partial<MetaData>[] | null
  info?: Partial<TableDimensionField>
  hierarchy?: Partial<MetaHierarchy>
}

export interface SubsetMeasureField extends Model {
  subset_detail_id: number
  field_id: number
  subset_field_name: string
  subset_column: string
  aggregation: string | null
  expression: string | null
  weight_field_id: number | null
  sort_order: string | null
  info?: Partial<TableMeasureField>
}

export interface DataLoaderConnection extends Model {
  name: string
  description: string | null
  driver: string
  host: string
  port: number
  database: string
  username: string
  queries_count?: number | null
}

export interface DataLoaderQuery extends Model {
  connection_id: number
  query: string
  name: string
  description: string | null
  loader_connection?: Partial<DataLoaderConnection> | null
}

export const HOURLY_CRON = 'HOURLY'
export const DAILY_CRON = 'DAILY'
export const WEEKLY_CRON = 'WEEKLY'
export const MONTHLY_CRON = 'MONTHLY'
export const YEARLY_CRON = 'YEARLY'

export type CronType =
  | typeof HOURLY_CRON
  | typeof DAILY_CRON
  | typeof WEEKLY_CRON
  | typeof MONTHLY_CRON
  | typeof YEARLY_CRON

export const cronTypes = [
  {
    value: HOURLY_CRON,
    label: 'Hourly',
  },
  {
    value: DAILY_CRON,
    label: 'Daily',
  },
  {
    value: WEEKLY_CRON,
    label: 'Weekly',
  },
  {
    value: MONTHLY_CRON,
    label: 'Monthly',
  },
  {
    value: YEARLY_CRON,
    label: 'Yearly',
  },
]

export interface DataLoaderJob extends Model {
  name: string
  description: string | null
  cron_type: CronType
  start_date: string | null
  end_date: string | null
  schedule_time: string | null
  day_of_week: string | null
  day_of_month: number | null
  month_of_year: number | null
  data_detail_id: number
  source_type: string | null
  query_id: number | null
  api_id: number | null
  api?: Partial<DataLoaderAPI> | null
  delete_existing_data: 0 | 1
  duplicate_identification_field: string | null
  predecessor_job_id: number | null
  detail?: Partial<DataDetail> | null
  loader_query?: Partial<DataLoaderQuery> | null
  statuses?: JobStatuses[]
  latest?: JobStatuses
  last_status?: Partial<JobStatus> | null
  field_mapping?: Partial<JsonFieldMapping>[] | null
}

export interface JobStatus extends Model {
  loader_job_id: number
  executed_at: string
  is_successful: 0 | 1
  total_records: number
  error_message: string | null
}

export interface DataTableItem extends Model {
  office_name?: string | null
  office_code?: string | null
  data_detail_id?: number
  date_1?: string | null
  date_2?: string | null
  date_3?: string | null
  date_4?: string | null
  date_5?: string | null
  dim_1?: number | null
  dim_2?: number | null
  dim_3?: number | null
  dim_4?: number | null
  dim_5?: number | null
  dim_1_name?: string | null
  dim_2_name?: string | null
  dim_3_name?: string | null
  dim_4_name?: string | null
  dim_5_name?: string | null
  dim_6_name?: string | null
  dim_7_name?: string | null
  dim_8_name?: string | null
  dim_9_name?: string | null
  dim_10_name?: string | null
  measure_1?: number | null
  measure_2?: number | null
  measure_3?: number | null
  measure_4?: number | null
  measure_5?: number | null
  measure_6?: number | null
  measure_7?: number | null
  measure_8?: number | null
}

export interface JobStatuses extends Model {
  loader_job_id: number
  executed_at: string
  completed_at: string
  is_successful: 0 | 1
  error_message?: string
  total_records: string
}

export const sortOrder = [
  { name: 'Ascending', value: 'ASC' },
  { name: 'Descending', value: 'DESC' },
]

export interface SubsetGroup extends Model {
  name: string
  description: string | null
  items?: Partial<SubsetGroupItem>[]
}

export interface SubsetGroupItem extends Model {
  name: string
  subset_group_id: number
  subset_detail_id: number
  item_number: number
  trend_field: string | null
  subset?: Partial<SubsetDetail> | null
}

export const officeLevels = [
  { level: 0, name: 'state' },
  { level: 1, name: 'region' },
  { level: 2, name: 'circle' },
  { level: 3, name: 'division' },
  { level: 4, name: 'subdivision' },
  { level: 5, name: 'section' },
]

export interface KeyValue {
  key: string
  value: string | null
}

export interface DataLoaderAPI extends Model {
  name: string
  description: string | null
  url: string
  method: 'GET' | 'POST'
  headers: KeyValue[] | null
  body: KeyValue[] | null
  response_structure: JSONStructureDefinition
}

export interface DataTableRelation extends Model {
  data_detail_id: number
  column: string
  field_name: string
  related_table_id: number
  related_table?: Partial<DataDetail> | null
}

export interface DataTableText extends Model {
  data_detail_id: number
  column: string
  field_name: string
  is_long_text: boolean
}

export interface PagesList extends Model {
  id: number
  title: string
  description: string
  url: string
  published_at: string
}

export interface Block extends Model {
  id: number
  page_id: number
  name: string
  position: number
  dimensions: {
    padding_top: string
    padding_bottom: string
    margin_top: string
    margin_bottom: string
    mobile_width: string
    tablet_width: string
    laptop_width: string
    desktop_width: string
  }
  data: JSON
}
