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
  type: string
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
}
