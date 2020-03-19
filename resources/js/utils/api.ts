import axios, { AxiosPromise } from 'axios'
import queryString from 'query-string'
import { User } from '../store/authedUser/types'
import { Offering, OfferingsState } from '../store/offerings/types'
import { Room } from '../store/rooms/types'
import { Table } from '../store/tables/types'
import { Student, StudentsState } from '../store/students/types'
import { Enrollments, Enrollment } from '../store/enrollments/types'
import { TempTable } from '../store/session/types'
import { SettingsState } from '../store/settings/types'

const api = {
  // Authed User
  getAuthedUser: (): AxiosPromise<User> => (
    axios.get('/api/authed-user')
  ),

  // Rooms
  fetchRooms: (
    params?: FetchRoomsParams,
  ): AxiosPromise<FetchRoomsResponse> => (
    axios.get(`/api/rooms${params ? `?${queryString.stringify(params)}` : ''}`)
  ),
  updateRoom: (
    roomId: string,
    updates: Partial<Room>,
  ): AxiosPromise<FetchRoomsResponse> => (
    axios.put(`/api/rooms/${roomId}`, updates)
  ),
  createRoom: (
    offeringId: string | null = null,
  ): AxiosPromise<CreateRoomsResponse> => (
    axios.post('/api/rooms', { offeringId })
  ),
  deleteRoom: (
    roomId: string,
  ) => (
    axios.delete(`/api/rooms/${roomId}`)
  ),

  // Tables
  fetchTables: (
    roomId: string,
  ): AxiosPromise<FetchTablesResponse> => (
    axios.get(`/api/tables?roomId=${roomId}`)
  ),
  updateTable: (
    tableId: string,
    updates: Partial<Table>,
  ): AxiosPromise<FetchTablesResponse> => (
    axios.put(`/api/tables/${tableId}`, updates)
  ),
  createTable: (
    newTable: TempTable,
  ): AxiosPromise<Table> => (
    axios.post('/api/tables', newTable)
  ),
  deleteTable: (
    tableId: string,
  ): AxiosPromise => (
    axios.delete(`/api/tables/${tableId}`)
  ),

  // Students
  fetchStudents: (
    params?: FetchStudentsParams,
  ): AxiosPromise<FetchStudentsResponse> => (
    axios.get(`/api/students${params ? `?${queryString.stringify(params)}` : ''}`)
  ),
  updateStudent: (
    studentId: string,
    updates: Partial<Student>,
  ): AxiosPromise<FetchStudentsResponse> => (
    axios.put(`/api/students/${studentId}`, updates)
  ),
  uploadPicture: (
    formData: FormData,
  ): AxiosPromise<UploadPictureResponse> => (
    axios.post('/api/upload-student-picture', formData)
  ),

  // Offerings and Enrollments
  fetchOfferings: (
    params?: FetchOfferingsParams,
  ): AxiosPromise<FetchOfferingsResponse> => (
    axios.get(`/api/offerings${params ? `?${queryString.stringify(params)}` : ''}`)
  ),
  updateOffering: (
    offeringId: string,
    updates: Partial<Offering>,
  ): AxiosPromise<UpdateOfferingResponse> => (
    axios.put(`/api/offerings/${offeringId}`, updates)
  ),
  createOffering: (
    params: CreateOfferingParams,
  ): AxiosPromise<FetchOfferingsResponse> => (
    axios.post('/api/offerings', params)
  ),
  deleteOffering: (
    offeringId: string,
  ): AxiosPromise => (
    axios.delete(`/api/offerings/${offeringId}`)
  ),
  fetchEnrollments: (
    offeringId: string,
  ): AxiosPromise<FetchEnrollmentsResponse> => (
    axios.get(`/api/offerings/${offeringId}/enrollments`)
  ),
  updateEnrollment: (
    offeringId: string,
    studentId: string,
    updates: Partial<Enrollment>,
  ): AxiosPromise<FetchEnrollmentsResponse> => (
    axios.put(`/api/offerings/${offeringId}/enrollments/${studentId}`, updates)
  ),
  createEnrollment: (
    offeringId: string,
    studentId: string,
  ): AxiosPromise<CreateEnrollmentResponse> => (
    axios.post(`/api/offerings/${offeringId}/enrollments/${studentId}`)
  ),
  deleteEnrollment: (
    offeringId: string,
    studentId: string,
  ) => (
    axios.delete(`/api/offerings/${offeringId}/enrollments/${studentId}`)
  ),

  // Search
  searchStudents: (
    params: StudentSearchParams,
  ): AxiosPromise<StudentSearchResponse> => (
    axios.post('/api/search/students', params)
  ),

  // Settings
  fetchSettings: (): AxiosPromise<{ settings: SettingsState }> => (
    axios.get('/api/settings')
  ),
  updateSettings: (
    updates: Partial<SettingsState>,
  ): AxiosPromise<{ settings: SettingsState }> => (
    axios.put('/api/settings', updates)
  ),

  // Import Export
  importFile: (
    type: DataCats,
    fd: FormData,
  ): AxiosPromise<ImportResponse> => (
    axios.post(`/api/import/${type}`, fd)
  ),
}

interface FetchRoomsParams {
  roomId?: string;
}
interface FetchRoomsResponse {
  rooms: {
    [roomId: string]: Room;
  };
}
interface CreateRoomsResponse {
  rooms: {
    [roomId: string]: Room;
  };
  enrollments: {
    [offeringId: string]: Enrollments;
  };
  offerings?: {
    [offeringId: string]: Offering;
  };
}
interface FetchTablesResponse {
  tables: { [tableId: string]: Table };
}
interface FetchStudentsParams {
  offeringId?: string;
  plan?: string;
  term?: string;
}
interface FetchStudentsResponse {
  students: {
    [studentId: string]: Student;
  };
}
interface FetchOfferingsParams {
  id?: string;
  termCode?: number;
}
interface FetchOfferingsResponse {
  offerings: {
    [offeringId: string]: Offering;
  };
}
interface UpdateOfferingResponse {
  offerings: {
    [offeringId: string]: Offering;
  };
  enrollments: {
    [offeringId: string]: Enrollments;
  };
}
export interface CreateOfferingParams {
  title: string;
  term_code: number;
  catalog_nbr?: string;
  section?: string;
}
interface FetchEnrollmentsResponse {
  enrollments: {
    [offeringId: string]: Enrollments;
  };
}
interface CreateEnrollmentResponse {
  enrollments: {
    [offeringId: string]: Enrollments;
  };
  students: {
    [studentId: string]: Student;
  };
}
interface StudentSearchParams {
  query: string;
  limit?: number;
}
interface StudentSearchResponse {
  count: number;
  students: Student[];
}
interface UploadPictureResponse {
  success: boolean;
  fileName: string;
}
export interface LaravelHttpException {
  exception: string;
  file: string;
  line: number;
  message: string;
}
interface ImportResponse {
  students: StudentsState;
  offerings: OfferingsState;
  created: number;
  updated: number;
}
export type DataCats =
  | 'offerings'
  | 'students'
  | 'instructors'
  | 'enrollments'
  | 'teachings'

export default api
