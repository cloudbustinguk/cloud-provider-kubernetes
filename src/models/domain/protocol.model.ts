import { model, property } from '@loopback/repository';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { ProtocolName } from '../enumerations';

@Entity()
@model()
export class Protocol {
  @property({
    type: 'number',
    id: true,
    required: true,
    generated: true
  })
  @PrimaryGeneratedColumn()
  id: number;

  @property({
    type: 'string'
  })
  @Index('protocol_name_index')
  @Column({ length: 250 })
  name: ProtocolName;

  @property({
    type: 'number',
    required: true
  })
  @Column()
  port: number;

  constructor(data?: Partial<Protocol>) {
    Object.assign(this, data);
  }
}
