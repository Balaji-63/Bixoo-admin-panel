
import { notificationsActions } from '../slices/notificationsSlice';
import { requirementsActions } from '../slices/requirementsSlice';

let socket = null;

export const outboxSocketMiddleware = (store) => (next) => (action) => {
  // 1. Initialize Connection on Admin Login
  if (action.type === 'auth/loginSuccess') {
    if (socket !== null) socket.close();
    
    // Connect to the events worker service
    socket = new WebSocket(import.meta.env.VITE_WS_OUTBOX_URL);

    socket.onopen = () => {
      store.dispatch(notificationsActions.connectionEstablished());
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      // Route outbox events to specific reducers based on domain
      switch (data.topic) {
        case 'AUCTION_CLOSED':
          store.dispatch(notificationsActions.addAlert({
            level: 'WARNING',
            message: `Auction ${data.lotId} closed. Winner computed: ${data.winnerId}`,
          }));
          break;
        case 'PARTIAL_SUPPLY_ACCEPTED':
          // Dynamically reduce remaining quantity in the requirements slice without reload
          store.dispatch(requirementsActions.reduceRequirementNeed({
            reqId: data.reqId,
            allocatedQty: data.qty,
          }));
          break;
        case 'GPS_LATENCY_ALERT':
          store.dispatch(notificationsActions.addAlert({
            level: 'CRITICAL',
            message: `Trip ${data.tripId} GPS signal lost. Last seen ${data.lastSeen} mins ago.`,
          }));
          break;
        default:
          store.dispatch(notificationsActions.addAlert(data));
      }
    };

    socket.onerror = () => store.dispatch(notificationsActions.connectionError());
  }

  // 2. Teardown on Admin Logout
  if (action.type === 'auth/logout') {
    if (socket !== null) {
      socket.close();
      socket = null;
    }
  }

  return next(action);
};