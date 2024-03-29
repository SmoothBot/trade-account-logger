
import { Fields, Measurement, Schema, Tags } from '../influx2';

interface IAccountTags extends Tags {
  exchange: string
}

interface IAccountFields extends Fields {
  assets: number;
}

export interface IAccount extends Schema {
  tags: IAccountTags;
  fields: IAccountFields;
  timestamp: number | Date;
}

export type AccountLog = Measurement<
  IAccount,
  IAccountFields,
  IAccountTags
>;
const name = 'account_v1';
export const Account = new Measurement<
  IAccount,
  IAccountFields,
  IAccountTags
>(name);
