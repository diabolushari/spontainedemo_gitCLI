import { JSONStructureDefinition } from '@/Components/DataLoader/SetDataStructure/useJsonStructure'
import { DataTableFieldMapping } from '@/Components/DataLoader/useDataTableToJsonMapping'
import { SelectedMeasure } from '@/Components/WidgetsEditor/OverviewWidgetEditor'
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
  text_fields?: Partial<TableTextField>[]
  jobs?: Partial<DataLoaderJob>[]
  is_active: 0 | 1
}

export interface DataDetailFields {
  dates: TableDateField[]
  dimensions: TableDimensionField[]
  measures: TableMeasureField[]
  texts: TableTextField[]
  relations: DataDetail[]
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

/**
 * The data structure for a subset detail, which is used to configure the output of a subset.
 *
 * @property {string} name - The name of the subset detail.
 * @property {string | null} description - The description of the subset detail.
 * @property {0 | 1} group_data - Indicates whether the subset detail should group data.
 * @property {number} data_detail_id - The ID of the data detail that the subset detail belongs to.
 * @property {Partial<SubsetDateField>[]} [dates] - The date fields of the subset detail.
 * @property {Partial<SubsetDimensionField>[]} [dimensions] - The dimension fields of the subset detail.
 * @property {Partial<SubsetMeasureField>[]} [measures] - The measure fields of the subset detail.
 * @property {Partial<DataDetail> | null} [data_detail] - The data detail that the subset detail belongs to.
 * @property {number | null} max_rows_to_fetch - The maximum number of rows to fetch for the subset detail.
 * @property {0 | 1} use_for_training_ai - Indicates whether the subset detail should be used for training AI.
 * @property {string | null} proactive_insight_instructions - The proactive insights instructions for the subset detail.
 * @property {string | null} visualization_instructions - The visualization instructions for the subset detail.
 * @property {string | null} type - The type of the subset detail.
 */
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

export const SUB_HOUR_CRON = 'SUB_HOUR'
export const HOURLY_CRON = 'HOURLY'
export const DAILY_CRON = 'DAILY'
export const WEEKLY_CRON = 'WEEKLY'
export const MONTHLY_CRON = 'MONTHLY'
export const YEARLY_CRON = 'YEARLY'

export type CronType =
  | typeof SUB_HOUR_CRON
  | typeof HOURLY_CRON
  | typeof DAILY_CRON
  | typeof WEEKLY_CRON
  | typeof MONTHLY_CRON
  | typeof YEARLY_CRON

export const cronTypes = [
  {
    value: SUB_HOUR_CRON,
    label: 'Sub-Hourly',
  },
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
  field_mapping?: DataTableFieldMapping[] | null
  schedule_start_time?: string | null
  sub_hour_interval?: number | null
  retries?: number
  retries_interval?: number
  attempts?: number
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

export interface TableTextField extends Model {
  data_detail_id: number
  column: string
  field_name: string
  is_long_text: boolean
}

export interface Page extends Model {
  id: number
  title: string
  description: string
  url: string
  published_at: string
}

export interface BlockDimension {
  padding_top: string
  padding_bottom: string
  margin_top: string
  margin_bottom: string
  mobile_width: string
  tablet_width: string
  laptop_width: string
  desktop_width: string
}

export interface Ranking {
  subset_id: number
  title: string
  data_field: {
    label: string
    value: string
    show_label: boolean
  }
}

export interface Axis {
  label: string
  value: string
  show_label: boolean
}

export interface Trend {
  subset_id: number
  title: string
  data_field: {
    x_axis: Axis
    y_axis: Axis
  }
  tooltip_field: {
    label: string
    unit: string
    show_label: boolean
  }
  color: string
  chart_type: 'area' | 'bar'
}

export interface Overview {
  title: string
  description: string
  card_type: 'chart_and_table' | 'chart_only' | 'table_only'
  overview_chart?: OverviewChart
  overview_table?: OverviewTable[]
}

export interface OverviewChart {
  title: string
  subset_id: string
  chart_type: string
  x_axis: string
  y_axis: string[]

  [key: string]: any
}

export interface OverviewTable {
  title: string
  subset_id: string | null
  measure_field_dimension?: string
  measure_field: string
  col_span?: boolean
  filters?: Filter[]

  [key: string]: any
}

export interface Config {
  title: string
  data_table_id: string
  subtitle: string
  default_date?: string
  default_view?: string
  subset_group_id: number
  trend_selected: boolean
  ranking_selected: boolean
  overview_selected: boolean
  explore_button_group?: string
  data_explore_selected?: boolean
  trend: Trend
  ranking: Ranking
  overview: Overview
}

export interface Block extends Model {
  id: number
  page_id: number
  name: string
  position: number
  dimensions: BlockDimension
  data: Config
}

export interface OfficeCoordinates {
  level: string
  circle: string
  office_id: number
  office_code: string
  office_name: string
  latitude: number
  longitude: number
}

export interface Filter {
  readonly dimension: string
  readonly operator: string
  readonly value: string | number
}

export interface Dimension {
  id: number
  subset_field_name: string
  subset_column: string
}

export interface HighlightCardData {
  title: string
  subtitle: string
  subset_id: number | null
  measure: SelectedMeasure
  subset_name?: string | null
}

export interface Widget {
  id?: number
  title: string
  subtitle: string
  type: string
  collection_id: number
  updated_at?: string
  collection?: WidgetCollection
  data: {
    description?: string
    link?: string
    ai_agent: boolean
    data_table_id: number
    subset_group_id: number
    overview: {
      chart_type: string
      measures: {
        subset_field_name: string
        subset_column: string
        unit?: string
      }[]
      dimension: string
      color_palette: string
      subset_id: number | null
      subset_name?: string
      hierarchy_id: number | null
      hierarchy_item_id: number | null
      hierarchy_item_name: string | null
    }
    highlight_cards: HighlightCardData[]
    trend: {
      subset_id: number | null
      subset_name?: string
      chart_type: 'area' | 'bar'
      measure: SelectedMeasure | null
      dimension: string
      color: string
    }
    rank: {
      subset_group_name: string | null
      subset_id: number | null
      subset_name?: string
      order_by: SelectedMeasure | null
      level: string
      hierarchy_id: number | null
      dimension_column: string | null
      field_column: string | null
    }
    explore: {
      subset_group_name: string | null
    }
  }
}

export interface WidgetCollection {
  id: number
  name: string
  description: string | null
  created_at: string
  updated_at: string
  widget_count: number
  last_updated: string
  widgets?: Widget[]
}

export interface WidgetPosition {
  position: number
  widgetId: number | null
  widget?: Widget | null
  type?: 'widget' | 'text'
  textContent?: string
}

export interface PageSection {
  id: number
  type: 'singleCol' | 'doubleCol' | 'tripleCol'
  title: string | null
  widgets: WidgetPosition[]
  description: string | null
}

export interface DashboardPage extends Model {
  id: number
  title: string
  description: string
  link: string
  page: PageSection[]
  published: boolean
  anchor_widget: number | null
  config: {
    heading_style: number | null
  } | null
}
