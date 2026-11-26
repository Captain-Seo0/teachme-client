// Mirrors teachme-server docs/api-spec.md `schools` response.
export type School = {
  school_code: string;
  school_name: string;
  school_kind: '중학교' | '고등학교';
  region: string | null;
  address: string | null;
};

/** A school chosen in onboarding: from search results, or typed in manually (code/kind null). */
export type SelectedSchool = {
  school_name: string;
  school_code: string | null;
  school_kind: string | null;
  address?: string | null;
};
