export const Component = {
  RestApplication: 'RestApplication',
  Logger: 'Logger',
  Config: 'Config',
  DatabaseClient: 'DatabaseClient',
  UserService: 'UserService',
  UserModel: 'UserModel',
  OfferService: 'OfferService',
  OfferModel: 'OfferModel',
  CommentService: Symbol.for('CommentService'),
  CommentModel: Symbol.for('CommentModel'),
  UserController: Symbol.for('UserController'),
  OfferController: Symbol.for('OfferController'),
  ExceptionFilter: Symbol.for('ExceptionFilter'),
  AuthService: Symbol.for('AuthService'),
  AuthExceptionFilter: Symbol.for('AuthExceptionFilter')
};
