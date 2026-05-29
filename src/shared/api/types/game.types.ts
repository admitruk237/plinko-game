export type Risk = 'LOW' | 'MEDIUM' | 'HIGH';

export interface GameConfigDto {
  rows: number[];
  risks: Risk[];
  minBet: string;
  maxBet: string;
  payoutTables: Record<Risk, Record<string, number[]>>;
}
