
import { Fields, Measurement, Schema, Tags } from '../influx2';

interface ISummaryTags extends Tags {}

interface ISummaryFields extends Fields {
  total_assets: number;
}

export interface ISummary extends Schema {
  tags: ISummaryTags;
  fields: ISummaryFields;
  timestamp: number | Date;
}

export type SummaryLog = Measurement<
  ISummary,
  ISummaryFields,
  ISummaryTags
>;
const name = 'summary_v1';
export const Summary = new Measurement<
  ISummary,
  ISummaryFields,
  ISummaryTags
>(name);
