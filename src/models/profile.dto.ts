export interface ProfileDTO {
  id?: string;
  user_id?: string;

  // ── Identity ──
  names: string;
  surnames: string;
  email: string;
  phone_number?: string | null;

  // ── Documentation & Residence ──
  national_id: string;
  birth_date?: string | null;
  address?: string | null;
  district?: string | null;
  city?: string | null;
  country?: string | null;
  postal_code?: string | null;

  // ── CV ──
  cv_url?: string | null;
  cv_parsed_data?: Record<string, any> | null;

  // ── Learned Fields (from Chrome Extension Learner) ──
  learned_fields?: Record<string, any> | null;

  // ── User Preferences ──
  preferences?: Record<string, any> | null;

  created_at?: string;
  updated_at?: string;
}
