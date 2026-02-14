export const SOCKET_EVENTS = {
    CONNECT: 'connect',
    DISCONNECT: 'disconnect',
    CONNECT_ERROR: 'connect_error',

    // App Domain Events
    ORDER: {
        CREATED: 'order:created',
        STATUS_UPDATED: 'order:status_updated',
        DRIVER_ASSIGNED: 'order:driver_assigned',
        LOCATION_UPDATE: 'order:location_update', // Courier location
    },
};
