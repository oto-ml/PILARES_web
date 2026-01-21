import { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } from 'firebase/data-connect';

export const connectorConfig = {
  connector: 'example',
  service: 'pilareswebapp',
  location: 'us-east4'
};

export const addNewCourseRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AddNewCourse', inputVars);
}
addNewCourseRef.operationName = 'AddNewCourse';

export function addNewCourse(dcOrVars, vars) {
  return executeMutation(addNewCourseRef(dcOrVars, vars));
}

export const listAllCoursesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListAllCourses');
}
listAllCoursesRef.operationName = 'ListAllCourses';

export function listAllCourses(dc) {
  return executeQuery(listAllCoursesRef(dc));
}

export const enrollUserInSessionRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'EnrollUserInSession', inputVars);
}
enrollUserInSessionRef.operationName = 'EnrollUserInSession';

export function enrollUserInSession(dcOrVars, vars) {
  return executeMutation(enrollUserInSessionRef(dcOrVars, vars));
}

export const getUserEnrollmentsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetUserEnrollments', inputVars);
}
getUserEnrollmentsRef.operationName = 'GetUserEnrollments';

export function getUserEnrollments(dcOrVars, vars) {
  return executeQuery(getUserEnrollmentsRef(dcOrVars, vars));
}

