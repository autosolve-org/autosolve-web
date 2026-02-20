// Profile field definitions and validation

export type ProfileField = {
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'url' | 'textarea' | 'select' | 'date' | 'social';
  placeholder?: string;
  required?: boolean;
  options?: string[]; // For select inputs
  group?: string; // For internal grouping within a section
  maxLength?: number;
};

export type ProfileSection = {
  id: string;
  title: string;
  icon: string;
  fields: ProfileField[];
  required: boolean;
};

export const profileSections: ProfileSection[] = [
  {
    id: 'identity',
    title: 'Identidad',
    icon: '👤',
    required: true,
    fields: [
      {
        name: 'first_name',
        label: 'Nombres',
        type: 'text',
        placeholder: 'Juan Román',
        required: true,
      },
      {
        name: 'last_name',
        label: 'Apellidos',
        type: 'text',
        placeholder: 'Pérez García',
        required: true,
      },
      {
        name: 'email',
        label: 'Email Personal',
        type: 'email',
        placeholder: 'juan@ejemplo.com',
        required: true,
      },
      {
        name: 'phone_number',
        label: 'Teléfono Móvil',
        type: 'tel',
        placeholder: '+51 987 654 321',
      },
      {
        name: 'national_id',
        label: 'DNI / Documento',
        type: 'text',
        placeholder: '12345678',
      },
      {
        name: 'birth_date',
        label: 'Fecha de Nacimiento',
        type: 'date',
      },
    ],
  },
  {
    id: 'location',
    title: 'Ubicación',
    icon: '📍',
    required: true,
    fields: [
      {
        name: 'address',
        label: 'Dirección',
        type: 'text',
        placeholder: 'Av. Las Gardenias 123',
      },
      {
        name: 'district',
        label: 'Distrito',
        type: 'text',
        placeholder: 'Miraflores',
      },
      {
        name: 'city',
        label: 'Ciudad',
        type: 'text',
        placeholder: 'Lima',
      },
      {
        name: 'country',
        label: 'País',
        type: 'text',
        placeholder: 'Perú',
      },
      {
        name: 'postal_code',
        label: 'Código Postal',
        type: 'text',
        placeholder: '15047',
      },
    ],
  },
  {
    id: 'experience',
    title: 'Experiencia',
    icon: '💼',
    required: false,
    fields: [
      {
        name: 'profession',
        label: 'Profesión Actual',
        type: 'text',
        placeholder: 'Ingeniero de Software Senior',
      },
      {
        name: 'company',
        label: 'Empresa Actual',
        type: 'text',
        placeholder: 'Google / Freelance',
      },
      {
        name: 'job_title',
        label: 'Cargo / Rol',
        type: 'text',
        placeholder: 'Frontend Developer',
      },
      {
        name: 'experience_summary',
        label: 'Resumen de Experiencia',
        type: 'textarea',
        placeholder: 'He trabajado en proyectos de...',
      },
      {
        name: 'skills',
        label: 'Habilidades',
        type: 'text',
        placeholder: 'React, Node.js, Cloud',
      },
    ],
  },
  {
    id: 'education',
    title: 'Educación',
    icon: '🎓',
    required: false,
    fields: [
      {
        name: 'university',
        label: 'Institución / Universidad',
        type: 'text',
        placeholder: 'Universidad Nacional Mayor de San Marcos',
      },
      {
        name: 'degree',
        label: 'Carrera / Especialidad',
        type: 'text',
        placeholder: 'Ingeniería de Sistemas',
      },
      {
        name: 'start_date',
        label: 'Fecha Inicio',
        type: 'text',
        placeholder: 'Marzo 2018',
      },
      {
        name: 'end_date',
        label: 'Fecha Fin',
        type: 'text',
        placeholder: 'Diciembre 2023',
      },
      {
        name: 'certifications',
        label: 'Certificaciones',
        type: 'textarea',
        placeholder: 'AWS Certified, English, etc.',
      },
    ],
  },
];

export function calculateSectionCompletion(
  section: ProfileSection,
  profileData: Record<string, unknown>
): { completed: number; total: number } {
  const total = section.fields.length;
  const completed = section.fields.filter((field) => {
    const value = profileData[field.name];
    return value !== undefined && value !== null && value !== '';
  }).length;

  return { completed, total };
}

export function calculateOverallCompletion(
  profileData: Record<string, unknown>
): number {
  let totalFields = 0;
  let completedFields = 0;

  profileSections.forEach((section) => {
    const { completed, total } = calculateSectionCompletion(section, profileData);
    totalFields += total;
    completedFields += completed;
  });

  return totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 0;
}

export function areRequiredFieldsComplete(
  profileData: Record<string, unknown>
): boolean {
  return profileSections
    .filter((s) => s.required)
    .every((section) => 
      section.fields
        .filter((f) => f.required)
        .every((field) => {
          const value = profileData[field.name];
          return value !== undefined && value !== null && value !== '';
        })
    );
}
