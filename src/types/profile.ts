// Mirrors teachme-server docs/db-schema.md (`profiles`, enums `study_concern`, `ai_student`, `student_type`).
export type StudyConcern =
  | 'just_for_fun'
  | 'cant_explain_terms'
  | 'confused_causality'
  | 'trips_on_tricky_questions';

export type AiStudent = 'dapdapi' | 'chorongi' | 'ttokttogi' | 'kkanjogi';

export type StudentType = 'middle_school' | 'high_school' | 'repeat_exam_taker' | 'general';

export type Grade = 1 | 2 | 3;

export type Profile = {
  id: string;
  nickname: string;
  /** Default avatar color id: mint | peach | sky | lemon. Shown when `avatar_url` is null. */
  avatar: string;
  /** Public URL of the uploaded profile photo (`avatars` bucket), or null. */
  avatar_url: string | null;
  student_type: StudentType | null;
  /**
   * Null when the school step was skipped (repeat_exam_taker / general).
   * NOTE: the DB column is still NOT NULL as of the last db-schema.md; the server must allow null.
   */
  school_name: string | null;
  /** NEIS school code. Null when the school was typed in manually or skipped. */
  school_code: string | null;
  /** '중학교' | '고등학교' (NEIS). Null when the school was typed in manually or skipped. */
  school_kind: string | null;
  /**
   * Null for repeat_exam_taker / general.
   * NOTE: the DB column is still NOT NULL as of the last db-schema.md; the server must allow null.
   */
  grade: Grade | null;
  study_concern: StudyConcern;
  matched_student: AiStudent;
  created_at: string;
  updated_at: string;
};

/** Fields the client inserts; `id` is the signed-in user's id. */
export type NewProfile = Omit<Profile, 'id' | 'created_at' | 'updated_at'>;
