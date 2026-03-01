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
  description: string;
  icon: string;
  fields: ProfileField[];
  required: boolean;
};

export const profileSections: ProfileSection[] = [
  {
    id: 'identity',
    description: 'Datos personales básicos y métodos de contacto directo.',
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
      }
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
