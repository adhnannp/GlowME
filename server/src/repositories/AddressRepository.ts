import { BaseRepository } from './BaseRepository';
import { IAddressRepository } from '../core/interfaces/repositories/IAddressRepository';
import { IAddress } from '../models/Address';
import { Address } from '../models/Address';

export class AddressRepository extends BaseRepository<IAddress> implements IAddressRepository {
  constructor() {
    super(Address);
  }

}
