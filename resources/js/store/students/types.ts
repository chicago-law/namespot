export interface Student {
  id: string;
  cnet_id: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  short_first_name: string;
  short_last_name: string;
  nickname: string | null;
  prefix: string | null;
  picture: string;
  academic_prog_descr: string | null;
  academic_level: string | null;
}

export interface StudentsState {
  [studentId: string]: Student;
}

export const RECEIVE_STUDENTS = 'RECEIVE_STUDENTS'
export interface ReceiveStudents {
  type: typeof RECEIVE_STUDENTS;
  students: {
    [studentId: string]: Student;
  };
}

export type StudentsActionTypes = ReceiveStudents;
