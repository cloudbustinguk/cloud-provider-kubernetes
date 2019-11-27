export class K8sDeployment {

  get name(): string {
    return this.isValid() ? this._k8sResponse.metadata.name : null;
  }

  constructor(private _k8sResponse: any) {
  }

  isValid() {
    return (this._k8sResponse != null &&
     this._k8sResponse.kind != null && 
     this._k8sResponse.kind === 'Deployment' &&
     this._k8sResponse.metadata != null && 
     this._k8sResponse.metadata.name != null);
  }
}