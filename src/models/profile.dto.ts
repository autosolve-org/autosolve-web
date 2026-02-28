export interface ProfileDTO {
  id?: string;
  user_id?: string;
  label: string; // Personal | Work | University
  is_default: boolean;

  // ── Identity ──
  first_name: string;
  last_name: string;
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

  // ── Experience ──
  profession?: string | null;
  company?: string | null;
  job_title?: string | null;
  experience_summary?: string | null;
  skills?: string | null;

  // ── Education ──
  university?: string | null;
  degree?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  certifications?: string | null;

  // Extra/Custom data
  data?: Record<string, any> | null;
  created_at?: string;
  updated_at?: string;
}
