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
      }
    }
  }
`;
