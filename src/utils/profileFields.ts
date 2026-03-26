// Profile field definitions and validation

export type ProfileField = {
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'url' | 'textarea' | 'select' | 'date' | 'social';
  readOnly?: boolean;
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
        name: 'display_name',
        label: 'Usuario',
        type: 'text',
        readOnly: true,
        required: true,
      },
      {
        name: 'email',
        label: 'Email',
        type: 'email',
        readOnly: true,
        required: true,
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
