import { schema } from 'normalizr'

const offeringSchema = new schema.Entity('offerings')
export const offeringListSchema = new schema.Array(offeringSchema)

const studentSchema = new schema.Entity('students')
export const studentListSchema = new schema.Array(studentSchema)

const roomSchema = new schema.Entity('rooms')
export const roomListSchema = new schema.Array(roomSchema)

const tableSchema = new schema.Entity('tables')
export const tableListSchema = new schema.Array(tableSchema)
