import {
  inject,
  lifeCycleObserver,
  LifeCycleObserver,
  ValueOrPromise,
} from '@loopback/core';
import {juggler} from '@loopback/repository';
import * as config from './kubernetes.datasource.json';
import {K8config} from './kubeconfig';
import { ApiRoot} from 'kubernetes-client';
import {KubeConfig} from '@kubernetes/client-node';
const Request = require('kubernetes-client/backends/request');
const Client = require('kubernetes-client').Client;


@lifeCycleObserver('datasource')
export class KubernetesDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'kubernetes';
  K8sClient: ApiRoot;


  constructor(
    @inject('datasources.config.kubernetes', {optional: true})
      dsConfig: object = config,
  ) {
    super(dsConfig);
    const kubeconfig = new KubeConfig();
    kubeconfig.loadFromString(JSON.stringify(K8config));
    const backend = new Request({kubeconfig});
    this.K8sClient = new Client({backend, version: '1.13'});
  }

  /**
   * Start the datasource when application is started
   */
  start(): ValueOrPromise<void> {
  }

  /**
   * Disconnect the datasource when application is stopped. This allows the
   * application to be shut down gracefully.
   */
  stop(): ValueOrPromise<void> {
    return super.disconnect();
  }
}
