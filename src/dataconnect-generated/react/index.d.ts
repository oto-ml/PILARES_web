import { AddNewCourseData, AddNewCourseVariables, ListAllCoursesData, EnrollUserInSessionData, EnrollUserInSessionVariables, GetUserEnrollmentsData, GetUserEnrollmentsVariables } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useAddNewCourse(options?: useDataConnectMutationOptions<AddNewCourseData, FirebaseError, AddNewCourseVariables>): UseDataConnectMutationResult<AddNewCourseData, AddNewCourseVariables>;
export function useAddNewCourse(dc: DataConnect, options?: useDataConnectMutationOptions<AddNewCourseData, FirebaseError, AddNewCourseVariables>): UseDataConnectMutationResult<AddNewCourseData, AddNewCourseVariables>;

export function useListAllCourses(options?: useDataConnectQueryOptions<ListAllCoursesData>): UseDataConnectQueryResult<ListAllCoursesData, undefined>;
export function useListAllCourses(dc: DataConnect, options?: useDataConnectQueryOptions<ListAllCoursesData>): UseDataConnectQueryResult<ListAllCoursesData, undefined>;

export function useEnrollUserInSession(options?: useDataConnectMutationOptions<EnrollUserInSessionData, FirebaseError, EnrollUserInSessionVariables>): UseDataConnectMutationResult<EnrollUserInSessionData, EnrollUserInSessionVariables>;
export function useEnrollUserInSession(dc: DataConnect, options?: useDataConnectMutationOptions<EnrollUserInSessionData, FirebaseError, EnrollUserInSessionVariables>): UseDataConnectMutationResult<EnrollUserInSessionData, EnrollUserInSessionVariables>;

export function useGetUserEnrollments(vars: GetUserEnrollmentsVariables, options?: useDataConnectQueryOptions<GetUserEnrollmentsData>): UseDataConnectQueryResult<GetUserEnrollmentsData, GetUserEnrollmentsVariables>;
export function useGetUserEnrollments(dc: DataConnect, vars: GetUserEnrollmentsVariables, options?: useDataConnectQueryOptions<GetUserEnrollmentsData>): UseDataConnectQueryResult<GetUserEnrollmentsData, GetUserEnrollmentsVariables>;
