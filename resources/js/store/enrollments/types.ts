export interface Enrollment {
  student_id: string;
  seat: string | null;
  canvas_role: string;
  canvas_enrollment_state: string;
  ais_enrollment_state: string;
  ais_enrollment_reason: string;
  is_in_ais: number;
  is_namespot_addition: number;
}

export interface Enrollments {
  [studentId: string]: Enrollment;
}

export interface EnrollmentsState {
  [offeringId: string]: Enrollments;
}

export const RECEIVE_ENROLLMENTS = 'RECEIVE_ENROLLMENTS'
export interface ReceiveEnrollments {
  type: typeof RECEIVE_ENROLLMENTS;
  enrollments: EnrollmentsState;
}

export const UPDATE_ENROLLMENT = 'UPDATE_ENROLLMENT'
export interface UpdateEnrollment {
  type: typeof UPDATE_ENROLLMENT;
  offeringId: string;
  studentId: string;
  params: Partial<Enrollment>;
}

export const REMOVE_ENROLLMENT = 'REMOVE_ENROLLMENT'
export interface RemoveEnrollment {
  type: typeof REMOVE_ENROLLMENT;
  offeringId: string;
  studentId: string;
}

export type EnrollmentsActionTypes =
  | ReceiveEnrollments
  | UpdateEnrollment
  | RemoveEnrollment;
