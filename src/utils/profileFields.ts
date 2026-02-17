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
    id: 'personal_info',
    title: 'Información Personal',
    icon: '👤',
    required: true,
    fields: [
      // Grupo 1: Identidad y Contacto
      {
        name: 'nombre',
        label: 'Nombres',
        type: 'text',
        placeholder: 'Juan Román',
        required: true,
        group: 'Identidad',
      },
      {
        name: 'apellido',
        label: 'Apellidos',
        type: 'text',
        placeholder: 'Pérez García',
        required: true,
        group: 'Identidad',
      },
      {
        name: 'apodo',
        label: 'Apodo / Nickname',
        type: 'text',
        placeholder: '@juanroman',
        group: 'Identidad',
      },
      {
        name: 'bio',
        label: 'Biografia',
        type: 'textarea',
        placeholder: 'Desarrollador apasionado con más de 5 años...',
        group: 'Identidad',
        maxLength: 500,
      },
      {
        name: 'email',
        label: 'Email Personal',
        type: 'email',
        placeholder: 'juan@ejemplo.com',
        required: true,
        group: 'Identidad',
      },
      {
        name: 'telefono',
        label: 'Teléfono Móvil',
        type: 'tel',
        placeholder: '+51 987 654 321',
        group: 'Identidad',
      },
      {
        name: 'social_networks',
        label: 'Redes Sociales',
        type: 'social',
        placeholder: 'Agrega tus redes profesionales',
        group: 'Identidad',
      },
      // Grupo 2: Documentación y Ubicación
      {
        name: 'dni',
        label: 'DNI / Documento',
        type: 'text',
        placeholder: '12345678',
        required: true,
        group: 'Documentación y Residencia',
      },
      {
        name: 'genero',
        label: 'Género',
        type: 'select',
        options: ['Masculino', 'Femenino', 'No binario', 'Prefiero no decirlo'],
        group: 'Documentación y Residencia',
      },
      {
        name: 'fecha_nacimiento',
        label: 'Fecha de Nacimiento',
        type: 'date',
        group: 'Documentación y Residencia',
      },
      {
        name: 'direccion',
        label: 'Dirección',
        type: 'text',
        placeholder: 'Av. Las Gardenias 123',
        group: 'Documentación y Residencia',
      },
      {
        name: 'distrito',
        label: 'Distrito',
        type: 'text',
        placeholder: 'Miraflores',
        group: 'Documentación y Residencia',
      },
      {
        name: 'ciudad',
        label: 'Ciudad',
        type: 'text',
        placeholder: 'Lima',
        group: 'Documentación y Residencia',
      },
      {
        name: 'pais',
        label: 'País',
        type: 'text',
        placeholder: 'Perú',
        group: 'Documentación y Residencia',
      },
      {
        name: 'codigo_postal',
        label: 'Código Postal',
        type: 'text',
        placeholder: '15047',
        group: 'Documentación y Residencia',
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
