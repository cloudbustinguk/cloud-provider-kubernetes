import { Image, Flavour, InstanceAccount } from '../domain';
import { APPLICATION_CONFIG } from '../../application-config';
import { IK8SRequestHelper } from './k8s-request-helper.model';
import { logger } from '../../utils';

export interface K8sDeploymentRequestConfig {
  name: string,
  image: Image,
  flavour: Flavour,
  account: InstanceAccount,
  imagePullSecret?: string,
  helper?: IK8SRequestHelper
}

export class K8sDeploymentRequest {
  private _model: any;

  get name(): string {
    return this._config.name;
  }

  get model(): any {
    return this._model;
  }

  isValid(): boolean {
    const volumeMounts = this._model.spec.template.spec.containers[0].volumeMounts;
    const volumes = this._model.spec.template.spec.volumes;

    if (volumeMounts && volumeMounts.length > 0) {
      if (volumes) {
        let validName = true;

        // verify if volumes name are valid
        let i = 0;
        const namePattern = RegExp(/^[a-z0-9]([-a-z0-9]*[a-z0-9])?$/);

        while (validName && volumes.length > i) {
          if (volumes[i].name) {
            validName = namePattern.test(volumes[i].name);
          } else {
            validName = false;
          }
          i++;
        }
        if (!validName) {
          logger.error(`Kubernetes deployment-request volume ${volumes[i].name} is not a valid name`);
          return false;
        }

        // verify that all volumeMounts have a volume
        let match = true;
        i = 0;
        while (match && volumeMounts.length > i) {
          if (volumeMounts[i].name) {
            match = volumes.find((volume) => volume.name === volumeMounts[i].name) != null;
          } else {
            match = false;
          }
          i++;
        }
        if (!match) {
          logger.error(`Kubernetes deployment-request did not have a volume for volumeMount ${volumeMounts[i].name}`);
          return false
        }
      } else {
        logger.error(`Kubernetes deployment-request did not have any volumes but does have volume-mounts`);
        return false;
      }
    }
    return true;
  }

  constructor(private _config: K8sDeploymentRequestConfig) {
    this._model = {
      apiVersion: 'apps/v1',
      kind: 'Deployment',
      metadata: {
        name: this._config.name,
        labels: {
          app: this._config.name,
          owner: APPLICATION_CONFIG().kubernetes.ownerLabel
        }
      },
      spec: {
        replicas: 1,
        selector: {
          matchLabels: {
            app: this._config.name
          }
        },
        template: {
          metadata: {
            labels: {
              app: this._config.name
            }
          },
          spec: {
            containers: [
              {
                name: this._config.name,
                image: this._config.image.repository ? `${this._config.image.repository}/${this._config.image.path}` : this._config.image.path,
                ports: this._config.image.protocols.map(imageProtocol => {
                  return { name: imageProtocol.protocol.name.toLowerCase(), containerPort: imageProtocol.getPort() };
                }),
                command: this._config.image.command ? [this._config.image.command] : undefined,
                args: this._config.image.args ? this._config.image.args.split(',') : undefined,
                env: this._getEnvVars(),
                volumeMounts: this._getVolumeMounts(),
                securityContext: this._getSecurityContext(),
                resources: {
                  limits: {
                    cpu: `${this._config.flavour.cpu}`,
                    memory: `${this._config.flavour.memory}Mi`
                  },
                  requests: {
                    cpu: `${this._config.flavour.cpu}`,
                    memory: `${this._config.flavour.memory}Mi`
                  }
                }
              }
            ],
            imagePullSecrets: this._config.imagePullSecret != null ? [{ name: this._config.imagePullSecret }] : [],
            volumes: this._getVolumes()
          }
        }
      }
    };
  }

  private _getVolumeMounts(): any {
    if (this._config.image.volumes) {
      const volumeMounts = this._config.image.volumes.map(volume => ({
        mountPath: volume.path,
        name: volume.name,
        readOnly: volume.readOnly
      }));

      if (this._config.helper && this._config.helper.getVolumes) {
        this._config.helper.getVolumes(this._config.image, this._config.account)
          .filter(volumeData => volumeData != null)
          .filter(volumeData => volumeData.volumeMount != null)
          .forEach(volumeData => {
            const volumeMount = volumeMounts.find(aVolumeMount => aVolumeMount.name === volumeData.name);
            volumeMount.mountPath = volumeData.volumeMount.mountPath ? volumeData.volumeMount.mountPath : volumeMount.mountPath;
            volumeMount.readOnly = volumeData.volumeMount.readOnly ? volumeData.volumeMount.readOnly : volumeMount.readOnly;
          });
      }

      return volumeMounts;
    }

    return undefined;
  }

  private _getVolumes(): any {
    return (this._config.helper && this._config.helper.getVolumes) ?
      this._config.helper.getVolumes(this._config.image, this._config.account).map(volumeData => {
        const volume = volumeData.volume;
        volume.name = volumeData.name;
        return volume;
      }) : undefined;
  }

  private _getEnvVars(): any {
    const envVars = {};
    if (this._config.image.envVars) {
      // Get env vars from image
      this._config.image.envVars.forEach(envVar => envVars[envVar.name] = envVar.value);
    }

    if (this._config.helper && this._config.helper.getEnvVars) {
      // Get env vars from helper
      const helperEnvVars = this._config.helper.getEnvVars(this._config.image, this._config.account);
      if (helperEnvVars) {
        // Add or override env var
        helperEnvVars.forEach(envVar => envVars[envVar.name] = envVar.value);
      }
    }

    const envVarArray = Object.keys(envVars).map(key => ({ name: key, value: envVars[key] }));
    return envVarArray;
  }

  private _getSecurityContext(): any {
    const helperRunAsUID = (this._config.helper && this._config.helper.getRunAsUID) ? this._config.helper.getRunAsUID(this._config.image, this._config.account) : null;
    const imageRunAsUID = this._config.image.runAsUID;

    const runAsUID = helperRunAsUID ? helperRunAsUID : imageRunAsUID;
    return (runAsUID != null) ? {
      runAsUser: runAsUID
    } : undefined;
  }

}
