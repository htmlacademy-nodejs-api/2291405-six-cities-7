import { UserNameLimit } from '../limits/user-name-limit.enum.js';
import { UserPasswordLimit } from '../limits/user-password-limit.enum.js';

export const UserMessages = {
  email: {
    invalidFormat: 'email must be a valid address'
  },
  avatarUrl: {
    invalidFormat: 'avatarPath is required',
  },
  name: {
    invalidFormat: 'name is required',
    lengthField: `min length is ${ UserNameLimit.Min }, max is ${ UserNameLimit.Max }`,
  },
  type: {
    invalid: 'type must be an pro | regular',
  },
  password: {
    invalidFormat: 'password is required',
    lengthField: `min length for password is ${ UserPasswordLimit.Min }, max is ${ UserPasswordLimit.Max }`
  },
};
