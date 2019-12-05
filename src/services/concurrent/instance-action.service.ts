import { bind, BindingScope, inject } from '@loopback/core';
import { InstanceCommand, InstanceCommandType } from '../../models';
import { InstanceAction, InstanceActionListener } from './instance.action';
import { logger } from '../../utils';
import { InstanceService } from '../instance.service';
import { K8sInstanceService } from '../k8sInstance.service';
import { InstanceActionPromiseQueue } from './instance-action-promise-queue';
import { CreateInstanceAction } from './create-instance.action';
import { StateInstanceAction } from './state-instance.action';
import { StartInstanceAction } from './start-instance.action';
import { ShutdownInstanceAction } from './shutdown-instance.action';
import { RebootInstanceAction } from './reboot-instance.action';
import { DeleteInstanceAction } from './delete-instance.action';

@bind({ scope: BindingScope.SINGLETON })
export class InstanceActionService implements InstanceActionListener {
  private _actions = new Map<number, InstanceActionPromiseQueue>();

  constructor(
    @inject('services.InstanceService') private _instanceService: InstanceService,
    @inject('services.K8sInstanceService') private _k8sInstanceService: K8sInstanceService) {}

  execute(instanceCommand: InstanceCommand): Promise<void> {
    let action: InstanceAction = null;
    if (instanceCommand.type === InstanceCommandType.CREATE) {
      action = new CreateInstanceAction(instanceCommand, this._instanceService, this._k8sInstanceService, this);
    
    } else if (instanceCommand.type === InstanceCommandType.STATE) {
      action = new StateInstanceAction(instanceCommand, this._instanceService, this._k8sInstanceService, this);
    
    } else if (instanceCommand.type === InstanceCommandType.START) {
      action = new StartInstanceAction(instanceCommand, this._instanceService, this._k8sInstanceService, this);
    
    } else if (instanceCommand.type === InstanceCommandType.SHUTDOWN) {
      action = new ShutdownInstanceAction(instanceCommand, this._instanceService, this._k8sInstanceService, this);
    
    } else if (instanceCommand.type === InstanceCommandType.REBOOT) {
      action = new RebootInstanceAction(instanceCommand, this._instanceService, this._k8sInstanceService, this);
    
    } else if (instanceCommand.type === InstanceCommandType.DELETE) {
      action = new DeleteInstanceAction(instanceCommand, this._instanceService, this._k8sInstanceService, this);
    }

    return this._queueAction(action);
  }

  private _queueAction(instanceAction: InstanceAction): Promise<void> {
    const instance = instanceAction.instance;

    let actionQueue = this._actions.get(instance.id);
    if (actionQueue == null) {
      actionQueue = new InstanceActionPromiseQueue(() => {
        logger.debug(`Deleting action queue for instance ${instance.id}`);
        this._actions.delete(instance.id);
      });
      this._actions.set(instance.id, actionQueue);
    }

    return actionQueue.add(instanceAction);
  }

  onTerminated(instanceAction: InstanceAction) {
    logger.info(`Action ${instanceAction.type} successfully ran on instance ${instanceAction.instance.id}`);
  }

  onError(instanceAction: InstanceAction, error: any) {
    logger.error(`Action ${instanceAction.type} failed to run on instance ${instanceAction.instance.id}: ${error}`);
  };

}
