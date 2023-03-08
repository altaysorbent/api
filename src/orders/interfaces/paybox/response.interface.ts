export interface IPayboxResponse {
  pg_salt: string;
  pg_status: string;
  pg_description: string;
  pg_sig?: string;
}
