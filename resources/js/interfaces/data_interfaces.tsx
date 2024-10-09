import { MetaStructure } from '@/interfaces/meta_interfaces'

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
  query_id: number
  detail?: Partial<DataDetail> | null
  loader_query?: Partial<DataLoaderQuery> | null
  statuses?: JobStatuses[]
  latest?: JobStatuses
  last_status?: Partial<JobStatus> | null
}

export interface JobStatus extends Model {
  loader_job_id: number
  executed_at: string
  is_successful: 0 | 1
  total_records: number
  error_message: string | null
}

export interface DataTableItem extends Model {
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
  measure_1_unit?: string | null
  measure_2_unit?: string | null
  measure_3_unit?: string | null
  measure_4_unit?: string | null
  measure_5_unit?: string | null
  measure_6_unit?: string | null
  measure_7_unit?: string | null
  measure_8_unit?: string | null
}

export interface JobStatuses extends Model {
  loader_job_id: number
  executed_at: string
  completed_at: string
  is_successful: 0 | 1
  error_message?: string
  total_records: string
}
