import { MonitoringService } from '../services/monitoring.service';

/**
 * Contract to observe to be monitored.
 */
export interface IMonitored {
  /** Monitor getter property. */
  readonly monitor: MonitoringService;
}