export enum K8sServiceStatus {
  PENDING = 'PENDING',
  UNKNOWN = 'UNKNOWN',
  BUILDING = 'BUILDING',
  STARTING = 'STARTING',
  ACTIVE = 'ACTIVE',
  STOPPING = 'STOPPING',
  STOPPED = 'STOPPED',
  REBOOTING = 'REBOOTING',
  UNAVAILABLE = 'UNAVAILABLE',
  ERROR = 'ERROR',
  DELETING = 'DELETING',
  DELETED = 'DELETED'
}
