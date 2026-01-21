import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface AddNewCourseData {
  course_insert: Course_Key;
}

export interface AddNewCourseVariables {
  category: string;
  createdAt: TimestampString;
  description: string;
  imageUrl?: string | null;
  name: string;
  prerequisites?: string | null;
  price: number;
}

export interface Course_Key {
  id: UUIDString;
  __typename?: 'Course_Key';
}

export interface EnrollUserInSessionData {
  enrollment_insert: Enrollment_Key;
}

export interface EnrollUserInSessionVariables {
  sessionId: UUIDString;
  userId: UUIDString;
  enrollmentDate: TimestampString;
  status: string;
}

export interface Enrollment_Key {
  id: UUIDString;
  __typename?: 'Enrollment_Key';
}

export interface GetUserEnrollmentsData {
  enrollments: ({
    id: UUIDString;
    sessionId: UUIDString;
    enrollmentDate: TimestampString;
    status: string;
  } & Enrollment_Key)[];
}

export interface GetUserEnrollmentsVariables {
  userId: UUIDString;
}

export interface Instructor_Key {
  id: UUIDString;
  __typename?: 'Instructor_Key';
}

export interface ListAllCoursesData {
  courses: ({
    id: UUIDString;
    name: string;
    description: string;
    category: string;
    price: number;
    imageUrl?: string | null;
    prerequisites?: string | null;
  } & Course_Key)[];
}

export interface Session_Key {
  id: UUIDString;
  __typename?: 'Session_Key';
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

interface AddNewCourseRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddNewCourseVariables): MutationRef<AddNewCourseData, AddNewCourseVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AddNewCourseVariables): MutationRef<AddNewCourseData, AddNewCourseVariables>;
  operationName: string;
}
export const addNewCourseRef: AddNewCourseRef;

export function addNewCourse(vars: AddNewCourseVariables): MutationPromise<AddNewCourseData, AddNewCourseVariables>;
export function addNewCourse(dc: DataConnect, vars: AddNewCourseVariables): MutationPromise<AddNewCourseData, AddNewCourseVariables>;

interface ListAllCoursesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAllCoursesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListAllCoursesData, undefined>;
  operationName: string;
}
export const listAllCoursesRef: ListAllCoursesRef;

export function listAllCourses(): QueryPromise<ListAllCoursesData, undefined>;
export function listAllCourses(dc: DataConnect): QueryPromise<ListAllCoursesData, undefined>;

interface EnrollUserInSessionRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: EnrollUserInSessionVariables): MutationRef<EnrollUserInSessionData, EnrollUserInSessionVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: EnrollUserInSessionVariables): MutationRef<EnrollUserInSessionData, EnrollUserInSessionVariables>;
  operationName: string;
}
export const enrollUserInSessionRef: EnrollUserInSessionRef;

export function enrollUserInSession(vars: EnrollUserInSessionVariables): MutationPromise<EnrollUserInSessionData, EnrollUserInSessionVariables>;
export function enrollUserInSession(dc: DataConnect, vars: EnrollUserInSessionVariables): MutationPromise<EnrollUserInSessionData, EnrollUserInSessionVariables>;

interface GetUserEnrollmentsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserEnrollmentsVariables): QueryRef<GetUserEnrollmentsData, GetUserEnrollmentsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetUserEnrollmentsVariables): QueryRef<GetUserEnrollmentsData, GetUserEnrollmentsVariables>;
  operationName: string;
}
export const getUserEnrollmentsRef: GetUserEnrollmentsRef;

export function getUserEnrollments(vars: GetUserEnrollmentsVariables): QueryPromise<GetUserEnrollmentsData, GetUserEnrollmentsVariables>;
export function getUserEnrollments(dc: DataConnect, vars: GetUserEnrollmentsVariables): QueryPromise<GetUserEnrollmentsData, GetUserEnrollmentsVariables>;

