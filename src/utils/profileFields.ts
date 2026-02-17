// Profile field definitions and validation

export type ProfileField = {
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'url' | 'textarea';
  placeholder?: string;
  required?: boolean;
  group?: string;
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
    id: 'personal_info',
    title: 'Información Personal',
    icon: '👤',
    required: true,
    fields: [
      // Datos Identitarios
      {
        name: 'nombre',
        label: 'Nombres',
        type: 'text',
        placeholder: 'Juan Román',
        required: true,
        group: 'Datos Identitarios',
      },
      {
        name: 'apellido',
        label: 'Apellidos',
        type: 'text',
        placeholder: 'Pérez García',
        required: true,
        group: 'Datos Identitarios',
      },
      {
        name: 'dni',
        label: 'DNI / Documento',
        type: 'text',
        placeholder: '12345678',
        required: true,
        group: 'Datos Identitarios',
      },
      {
        name: 'genero',
        label: 'Género',
        type: 'text',
        placeholder: 'Masculino / Femenino / Otro',
        group: 'Datos Identitarios',
      },
      {
        name: 'bio',
        label: 'Bio / Resumen Profesional',
        type: 'textarea',
        placeholder: 'Desarrollador apasionado por...',
        group: 'Datos Identitarios',
      },
      // Contacto y Redes
      {
        name: 'email',
        label: 'Email',
        type: 'email',
        placeholder: 'juan@ejemplo.com',
        required: true,
        group: 'Contacto y Redes',
      },
      {
        name: 'telefono',
        label: 'Teléfono',
        type: 'tel',
        placeholder: '+51 987 654 321',
        group: 'Contacto y Redes',
      },
      {
        name: 'direccion',
        label: 'Dirección',
        type: 'text',
        placeholder: 'Av. Las Gardenias 123',
        group: 'Contacto y Redes',
      },
      {
        name: 'distrito',
        label: 'Distrito',
        type: 'text',
        placeholder: 'Miraflores',
        group: 'Contacto y Redes',
      },
      {
        name: 'codigo_postal',
        label: 'Código Postal',
        type: 'text',
        placeholder: '15047',
        group: 'Contacto y Redes',
      },
      {
        name: 'linkedin_url',
        label: 'LinkedIn URL',
        type: 'url',
        placeholder: 'https://linkedin.com/in/tuperfil',
        group: 'Contacto y Redes',
      },
      {
        name: 'social_networks',
        label: 'Otras Redes Social',
        type: 'text',
        placeholder: 'GitHub, Portafolio, etc.',
        group: 'Contacto y Redes',
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
        name: 'profesion',
        label: 'Profesión Actual',
        type: 'text',
        placeholder: 'Ingeniero de Software Senior',
      },
      {
        name: 'empresa',
        label: 'Empresa Actual',
        type: 'text',
        placeholder: 'Google / Freelance',
      },
      {
        name: 'cargo',
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
      {
        name: 'hobbies',
        label: 'Hobbies',
        type: 'text',
        placeholder: 'Trekking, Fotografía',
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
        name: 'universidad',
        label: 'Institución / Universidad',
        type: 'text',
        placeholder: 'Universidad Nacional Mayor de San Marcos',
      },
      {
        name: 'carrera',
        label: 'Carrera / Especialidad',
        type: 'text',
        placeholder: 'Ingeniería de Sistemas',
      },
      {
        name: 'student_code',
        label: 'Código de Estudiante',
        type: 'text',
        placeholder: '14200123',
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
  const requiredSection = profileSections.find((s) => s.required);
  if (!requiredSection) return true;

  return requiredSection.fields
    .filter((f) => f.required)
    .every((field) => {
      const value = profileData[field.name];
      return value !== undefined && value !== null && value !== '';
    });
}
