import { gql } from 'apollo-server-micro';

export const GET_TIME_HEALTH = gql`
  query GetTimeHealth($auth: authType!) {
    getTimeHealth(auth: $auth) {
      score
      channels {
        id
        score
        significant
        monitoredTime
        monitoredUptime
        monitoredDowntime
        partner {
          node {
            alias
          }
        }
      }
    }
  }
`;
