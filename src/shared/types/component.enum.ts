export const Component = {
  RestApplication: 'RestApplication',
  Logger: 'Logger',
  Config: 'Config',
  DatabaseClient: 'DatabaseClient',
  HostService: 'HostService',
  HostModel: 'HostModel',
  CityService: 'CityService',
  CityModel: 'CityModel',
  LocationService: 'LocationService',
  LocationModel: 'LocationModel',
  OfferService: 'OfferService',
  OfferModel: 'OfferModel',
  CommentService: Symbol.for('CommentService'),
  CommentModel: Symbol.for('CommentModel')
} as const;
