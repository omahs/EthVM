import { Address } from '@app/server/modules/address'
import { Tx } from '@app/server/modules/txs'
import { BaseMongoDbRepository, MongoEthVM } from '@app/server/repositories'

export interface AddressRepository {
  getTxs(hash: string, limit: number, page: number): Promise<Tx[]>
  getAddress(hash: string): Promise<Address | null>
  getTotalTxs(hash: string): Promise<number>
}

export class MongoAddressRepository extends BaseMongoDbRepository implements AddressRepository {
  public getTotalTxs(hash: string): Promise<number> {
    return this.db
      .collection(MongoEthVM.collections.transactions)
      .count({ $or: [{ from: hash }, { to: hash }] })
      .then(resp => {
        if (!resp) {
          return 0
        }
        return resp
      })
  }
  public getAddress(hash: string): Promise<Address | null> {
    return this.db
      .collection(MongoEthVM.collections.accounts)
      .findOne({ address: hash })
      .then(resp => {
        if (!resp) {
          return null
        }
        return resp
      })
  }

  public getTxs(hash: string, limit: number, page: number): Promise<Tx[]> {
    const start = page * limit
    return this.db
      .collection(MongoEthVM.collections.transactions)
      .find({ $or: [{ from: hash }, { to: hash }] })
      .sort({ transactionIndex: -1 })
      .skip(start)
      .limit(limit)
      .toArray()
      .then(resp => {
        if (!resp) {
          return []
        }
        return resp
      })
  }
}