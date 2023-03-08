export class PayboxResultDTO {
  pg_order_id: number;
  pg_payment_id: string;
  pg_currency: string;
  pg_amount: string;
  pg_net_amount?: string;
  pg_ps_amount?: string;
  pg_ps_full_amount?: string;
  pg_ps_currency?: string;
  pg_payment_system: string;
  pg_result: string;
  pg_payment_date: string;
  pg_can_reject: string;
  pg_user_phone?: string;
  pg_card_brand?: string;
  pg_card_pan?: string;
  pg_auth_code?: string;
  pg_captured?: string;
  pg_overpayment?: number;
  pg_failure_code?: number;
  pg_failure_description?: string;
  pg_recurring_profile_id?: string;
  pg_recurring_profile_expiry_date: string;
  pg_salt: string;
  pg_sig: string;
}
