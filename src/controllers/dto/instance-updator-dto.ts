import { model, property } from '@loopback/repository';

@model()
export class InstanceUpdatorDto {
  @property({
    type: 'string',
    required: true
  })
  name: string;

  @property({
    type: 'string'
  })
  description?: string;

  constructor(data?: Partial<InstanceUpdatorDto>) {
    Object.assign(this, data);
  }
}
