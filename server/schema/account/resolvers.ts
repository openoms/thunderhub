import { ContextType } from 'server/types/apiTypes';
import { SSO_ACCOUNT, SERVER_ACCOUNT } from 'src/context/AccountContext';
import { logger } from 'server/helpers/logger';
import { requestLimiter } from 'server/helpers/rateLimiter';

export const accountResolvers = {
  Query: {
    getServerAccounts: async (
      _: undefined,
      params: any,
      context: ContextType
    ) => {
      const { ip, accounts, account, sso, ssoVerified } = context;
      await requestLimiter(ip, 'getServerAccounts');

      const { macaroon, cert, host } = sso;
      let ssoAccount = null;
      if (macaroon && host && ssoVerified) {
        logger.debug(
          `Macaroon${
            cert ? ', certificate' : ''
          } and host (${host}) found for SSO.`
        );
        ssoAccount = {
          name: 'SSO Account',
          id: SSO_ACCOUNT,
          loggedIn: true,
          type: SSO_ACCOUNT,
        };
      }

      const currentId = account?.id;
      const withStatus =
        accounts?.map(a => ({
          ...a,
          loggedIn: a.id === currentId,
          type: SERVER_ACCOUNT,
        })) || [];

      return ssoAccount ? [...withStatus, ssoAccount] : withStatus;
    },
  },
};
