export const CreateHostMessages = {
  email: {
    invalidFormat: 'email must be a valid address'
  },
  avatarUrl: {
    invalidFormat: 'avatarPath is required',
  },
  name: {
    invalidFormat: 'name is required',
    lengthField: 'min length is 1, max is 15',
  },
  password: {
    invalidFormat: 'password is required',
    lengthField: 'min length for password is 6, max is 12'
  },
} as const;
