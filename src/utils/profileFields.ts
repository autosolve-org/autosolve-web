// Profile field definitions and validation

export type ProfileField = {
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'url' | 'textarea';
  placeholder?: string;
  required?: boolean;
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
    id: 'personal',
    title: 'Datos Personales',
    icon: '📋',
    required: true,
    fields: [
      {
        name: 'nombre',
        label: 'Nombre',
        type: 'text',
        placeholder: 'Juan',
        required: true,
      },
      {
        name: 'apellido',
        label: 'Apellido',
        type: 'text',
        placeholder: 'Pérez',
        required: true,
      },
      {
        name: 'email',
        label: 'Email',
        type: 'email',
        placeholder: 'juan@ejemplo.com',
        required: true,
      },
      {
        name: 'telefono',
        label: 'Teléfono',
        type: 'tel',
        placeholder: '+1 234 567 8900',
      },
    ],
  },
  {
    id: 'professional',
    title: 'Datos Profesionales',
    icon: '💼',
    required: false,
    fields: [
      {
        name: 'profesion',
        label: 'Profesión',
        type: 'text',
        placeholder: 'Ingeniero de Software',
      },
      {
        name: 'empresa',
        label: 'Empresa',
        type: 'text',
        placeholder: 'Tech Corp',
      },
      {
        name: 'cargo',
        label: 'Cargo',
        type: 'text',
        placeholder: 'Senior Developer',
      },
    ],
  },
  {
    id: 'academic',
    title: 'Datos Académicos',
    icon: '🎓',
    required: false,
    fields: [
      {
        name: 'universidad',
        label: 'Universidad',
        type: 'text',
        placeholder: 'Universidad Nacional',
      },
      {
        name: 'carrera',
        label: 'Carrera',
        type: 'text',
        placeholder: 'Ingeniería en Sistemas',
      },
      {
        name: 'nivel_academico',
        label: 'Nivel Académico',
        type: 'text',
        placeholder: 'Licenciatura',
      },
    ],
  },
  {
    id: 'location',
    title: 'Ubicación',
    icon: '🌍',
    required: false,
    fields: [
      {
        name: 'ciudad',
        label: 'Ciudad',
        type: 'text',
        placeholder: 'Buenos Aires',
      },
      {
        name: 'pais',
        label: 'País',
        type: 'text',
        placeholder: 'Argentina',
      },
    ],
  },
  {
    id: 'additional',
    title: 'Datos Adicionales',
    icon: '📝',
    required: false,
    fields: [
      {
        name: 'bio',
        label: 'Biografía',
        type: 'textarea',
        placeholder: 'Cuéntanos sobre ti...',
      },
      {
        name: 'skills',
        label: 'Habilidades',
        type: 'text',
        placeholder: 'JavaScript, Python, React...',
      },
      {
        name: 'linkedin_url',
        label: 'LinkedIn',
        type: 'url',
        placeholder: 'https://linkedin.com/in/tu-perfil',
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
  const requiredSection = profileSections.find((s) => s.required);
  if (!requiredSection) return true;

  return requiredSection.fields
    .filter((f) => f.required)
    .every((field) => {
      const value = profileData[field.name];
      return value !== undefined && value !== null && value !== '';
    });
}
