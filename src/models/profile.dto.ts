export interface ProfileDTO {
  id?: string;
  user_id?: string;

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

  // ── Unified Learned Data (profile + CV + extension learner) ──
  data_learned?: Record<string, any> | null;

  // ── User Preferences ──
  preferences?: Record<string, any> | null;

  created_at?: string;
  updated_at?: string;
}
