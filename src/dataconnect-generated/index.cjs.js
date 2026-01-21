const { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'example',
  service: 'pilareswebapp',
  location: 'us-east4'
};
exports.connectorConfig = connectorConfig;

const addNewCourseRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AddNewCourse', inputVars);
}
addNewCourseRef.operationName = 'AddNewCourse';
exports.addNewCourseRef = addNewCourseRef;

exports.addNewCourse = function addNewCourse(dcOrVars, vars) {
  return executeMutation(addNewCourseRef(dcOrVars, vars));
};

const listAllCoursesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListAllCourses');
}
listAllCoursesRef.operationName = 'ListAllCourses';
exports.listAllCoursesRef = listAllCoursesRef;

exports.listAllCourses = function listAllCourses(dc) {
  return executeQuery(listAllCoursesRef(dc));
};

const enrollUserInSessionRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'EnrollUserInSession', inputVars);
}
enrollUserInSessionRef.operationName = 'EnrollUserInSession';
exports.enrollUserInSessionRef = enrollUserInSessionRef;

exports.enrollUserInSession = function enrollUserInSession(dcOrVars, vars) {
  return executeMutation(enrollUserInSessionRef(dcOrVars, vars));
};

const getUserEnrollmentsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetUserEnrollments', inputVars);
}
getUserEnrollmentsRef.operationName = 'GetUserEnrollments';
exports.getUserEnrollmentsRef = getUserEnrollmentsRef;

exports.getUserEnrollments = function getUserEnrollments(dcOrVars, vars) {
  return executeQuery(getUserEnrollmentsRef(dcOrVars, vars));
};
