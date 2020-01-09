import { Image, InstanceUser } from "../models";
import { APPLICATION_CONFIG } from "../application-config";
import { logger } from "./logger";

export interface IK8SRequestHelper {

  getVolumes(image: Image, user: InstanceUser): any;
  getEnvVars(image: Image, user: InstanceUser): any;
}

export class K8SRequestHelperLoader {

  static getHelper(): IK8SRequestHelper {
    const requestHelperPath = APPLICATION_CONFIG().kubernetes.requestHelper;
    if (requestHelperPath != null) {
      try {
        let fullPath = requestHelperPath;
        if (!requestHelperPath.startsWith('/')) {
          fullPath = `../../${requestHelperPath}`;
        }
        const requestHelper = require(fullPath) as IK8SRequestHelper;
        return requestHelper;
  
      } catch (error) {
        logger.warn(`Could not load K8SRequestHelper with the file path '${requestHelperPath}'`);
      }
    }

    return null;
  }
}
