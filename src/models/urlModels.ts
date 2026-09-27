export interface short_url {
  id: string;
  long_url: string;
  created_at: Date;
  expires_at?: Date;
  isCustom: Boolean;
}