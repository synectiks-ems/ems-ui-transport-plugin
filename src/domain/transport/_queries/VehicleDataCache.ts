import gql from 'graphql-tag';

export const VEHICLE_DATA_CACHE = gql`
  query {
    createVehicleDataCache {
      transportRoute {
        id
        routeName
        routeDetails
        routeMapUrl
        noOfStops
        routeFrequency
        status
      }
      vehicle {
        id
        vehicleNumber
        vehicleType
        capacity
        ownerShip
        yearOfManufacturing
        manufacturingCompany
        model
        chasisNo
        rcNo
        status
        strOnBoardingDate
        strDateOfRegistration
      }
      contract {
        id
        vendorName
        typeOfOwnerShip
        durationOfContract
        strStartDate
        strEndDate
        startDate
        endDate
      }
      employee {
        id
        employeeName
        designation
        aadharNo
        panNo
        gender
        primaryContactNo
        employeeFatherName
        employeeMotherName
        primaryAddress
        personalMailId
        officialMailId
        drivingLicenceNo
        drivingLicenceValidity
      }
      stopage {
        id
        stopageName
        status
      }
      vehicleContractLink {
        id
        vehicleId
        contractId
        vehicle {
          id
          vehicleNumber
          vehicleType
          capacity
          ownerShip
          yearOfManufacturing
          manufacturingCompany
          model
          chasisNo
          rcNo
          status
          strOnBoardingDate
          strDateOfRegistration
        }
        contract {
          id
          vendorName
          typeOfOwnerShip
          durationOfContract
          strStartDate
          strEndDate
        }
      }
      vehicleDriverLink {
        id
        vehicleId
        employeeId
        vehicle {
          id
          vehicleNumber
          vehicleType
          capacity
          ownerShip
          yearOfManufacturing
          manufacturingCompany
          model
          chasisNo
          rcNo
          status
          strOnBoardingDate
          strDateOfRegistration
        }
        employee {
          id
          employeeName
          designation
          aadharNo
          panNo
          gender
          primaryContactNo
          employeeFatherName
          employeeMotherName
          primaryAddress
          personalMailId
          officialMailId
          drivingLicenceNo
          drivingLicenceValidity
        }
      }
      transportRouteVehicleLink {
        id
        transportRouteId
        vehicleId
        transportRoute {
          id
          routeName
          routeDetails
          routeMapUrl
          noOfStops
          routeFrequency
          status
        }
        vehicle {
          id
          vehicleNumber
          vehicleType
          capacity
          ownerShip
          yearOfManufacturing
          manufacturingCompany
          model
          chasisNo
          rcNo
          status
          strOnBoardingDate
          strDateOfRegistration
        }
      }
      transportRouteStopageLink {
        id
        transportRouteId
        stopageId
        transportRoute {
          id
          routeName
          routeDetails
          routeMapUrl
          noOfStops
          routeFrequency
          status
        }
        stopage {
          id
          stopageName
          status
          branchId
        }
      }
    }
  }
`;
