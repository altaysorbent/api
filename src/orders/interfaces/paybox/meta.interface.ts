export interface IPayboxMeta {
  pg_merchant_id: string;
  pg_order_id: string;
  pg_amount: number;
  pg_currency: string;
  pg_lifetime: number;
  pg_description: string; //
  pg_success_url: string;
  pg_testing_mode: string;
  pg_salt: string;
  pg_user_phone: string;
  pg_user_contact_email: string;
  pg_request_method: string;
  pg_sig: string;
}
