export enum ErrorMessageTx {
    details = 'Something went wrong while retrieving transaction details.',
    notFound = 'This transaction does not exist'
}

export enum ErrorMessagePendingTx {
    details = 'message.error.tx.pending'
}

export enum TxStatus {
    success = 'common.success',
    failed = 'common.fail',
    pending = 'common.pending',
    replaced = 'common.replaced'
}
