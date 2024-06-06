export const Component = {
  RestApplication: 'RestApplication',
  Logger: 'Logger',
  Config: 'Config',
  DatabaseClient: 'DatabaseClient',
  HostService: 'HostService',
  HostModel: 'HostModel',
  OfferService: 'OfferService',
  OfferModel: 'OfferModel',
  CommentService: Symbol.for('CommentService'),
  CommentModel: Symbol.for('CommentModel'),
  HostController: Symbol.for('HostController'),
  OfferController: Symbol.for('OfferController'),
  ExceptionFilter: Symbol.for('ExceptionFilter'),
  AuthService: Symbol.for('AuthService'),
  AuthExceptionFilter: Symbol.for('AuthExceptionFilter')
};
