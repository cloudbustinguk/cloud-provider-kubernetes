import { BaseRepository } from '../repositories';

export class BaseService<T extends { id: number }, R extends BaseRepository<T, number>> {
  constructor(protected _repository: R) {}

  getAll(): Promise<T[]> {
    return this._repository.find();
  }

  getById(id: number): Promise<T> {
    return this._repository.findById(id);
  }

  save(object: T): Promise<T> {
    return this._repository.save(object);
  }

  delete(object: T): Promise<boolean> {
    return this._repository.deleteById(object.id);
  }

  update(object: T): Promise<T> {
    return this._repository.updateById(object.id, object);
  }
}
