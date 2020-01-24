import gql from 'graphql-tag';

export const DRIVER_LIST_QUERY = gql`
  mutation getEmployeeList($filter: EmployeeListFilterInput!) {
    getEmployeeList(filter: $filter) {
      id
      employeeName
      designation
      aadharNo
      panNo
      passportNo
      primaryContactNo
      secondaryContactNo
      employeeFatherName
      employeeMotherName
      primaryAddress
      secondaryAddress
      employeeAddress
      personalMailId
      officialMailId
      disability
      drivingLicenceNo
      gender
      typeOfEmployment
      managerId
      status
      maritalStatus
      strjoiningDate
      strjobEndDate
      strresignationDate
      strresignationAcceptanceDate
      strdrivingLicenceValidity
      transportRoute {
        id
        routeName
      }
      branch {
        id
      }
      vehicle {
        id
        vehicleNumber
        vehicleType
      }
    }
  }
`;