export const __unstableAcquireStoreLock = ( store, path, { exclusive } ) => ( {
	dispatch,
} ) => {
	const promise = dispatch(
		__unstableEnqueueLockRequest( store, path, { exclusive } )
	);
	dispatch( __unstableProcessPendingLockRequests() );
	return promise;
};

export const __unstableEnqueueLockRequest = (
	store,
	path,
	{ exclusive }
) => ( { dispatch } ) => {
	return new Promise( ( resolve ) => {
		dispatch( {
			type: 'ENQUEUE_LOCK_REQUEST',
			request: { store, path, exclusive, notifyAcquired: resolve },
		} );
	} );
};

export const __unstableReleaseStoreLock = ( lock ) => ( { dispatch } ) => {
	dispatch( { type: 'RELEASE_LOCK', lock } );
	dispatch( __unstableProcessPendingLockRequests() );
};

export const __unstableProcessPendingLockRequests = () => ( {
	dispatch,
	select,
} ) => {
	dispatch( { type: 'PROCESS_PENDING_LOCK_REQUESTS' } );
	const lockRequests = select.__unstableGetPendingLockRequests();
	for ( const request of lockRequests ) {
		const { store, path, exclusive, notifyAcquired } = request;
		const isAvailable = select.__unstableIsLockAvailable( store, path, {
			exclusive,
		} );
		if ( isAvailable ) {
			const lock = { store, path, exclusive };
			dispatch( {
				type: 'GRANT_LOCK_REQUEST',
				lock,
				request,
			} );
			notifyAcquired( lock );
		}
	}
};
