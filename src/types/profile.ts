// Mirrors teachme-server docs/db-schema.md (`profiles`, enums `study_concern`, `ai_student`).
export type StudyConcern =
  | 'just_for_fun'
  | 'cant_explain_terms'
  | 'confused_causality'
  | 'trips_on_tricky_questions';

export type AiStudent = 'dapdapi' | 'chorongi' | 'ttokttogi' | 'kkanjogi';

export type Grade = 1 | 2 | 3;

export type Profile = {
  id: string;
  nickname: string;
  avatar: string;
  school_name: string;
  /** NEIS school code. Null when the school was typed in manually. */
  school_code: string | null;
  /** '중학교' | '고등학교' (NEIS). Null when the school was typed in manually. */
  school_kind: string | null;
  grade: Grade;
  study_concern: StudyConcern;
  matched_student: AiStudent;
  created_at: string;
  updated_at: string;
};

/** Fields the client inserts; `id` is the signed-in user's id. */
export type NewProfile = Omit<Profile, 'id' | 'created_at' | 'updated_at'>;
