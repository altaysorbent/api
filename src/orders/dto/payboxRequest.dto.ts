export interface PayboxRequestDTO {
  pg_order_id: string;
  pg_payment_id: string;
  pg_amount: string;
  pg_currency: string;
  pg_net_amount: string;
  pg_ps_amount: string;
  pg_ps_full_amount: string;
  pg_ps_currency: string;
  pg_payment_system: string;
  pg_description: string;
  pg_result: string;
  pg_payment_date: string;
  pg_can_reject: string;
  pg_user_phone: string;
  pg_need_phone_notification: string;
  pg_user_contact_email: string;
  pg_need_email_notification: string;
  pg_testing_mode: string;
  pg_captured: string;
  pg_card_pan: string;
  pg_card_exp: string;
  pg_card_owner: string;
  pg_auth_code: string;
  pg_card_brand: string;
  pg_salt: string;
  pg_sig: string;
}
