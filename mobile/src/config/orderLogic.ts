import { UserRole, OrderStatus } from '@api/types/dto';

export const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
    [OrderStatus.PENDING]: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
    [OrderStatus.CONFIRMED]: [OrderStatus.PREPARING, OrderStatus.CANCELLED],
    [OrderStatus.PREPARING]: [OrderStatus.READY, OrderStatus.CANCELLED],
    [OrderStatus.READY]: [OrderStatus.DRIVER_ASSIGNED, OrderStatus.CANCELLED], // Driver accept triggers this
    [OrderStatus.DRIVER_ASSIGNED]: [OrderStatus.IN_DELIVERY, OrderStatus.CANCELLED],
    [OrderStatus.IN_DELIVERY]: [OrderStatus.DELIVERED, OrderStatus.CANCELLED],
    [OrderStatus.DELIVERED]: [],
    [OrderStatus.CANCELLED]: [],
};

export const ROLE_ALLOWED_OFFICER: Record<UserRole, OrderStatus[]> = {
    [UserRole.CUSTOMER]: [OrderStatus.CANCELLED], // Only if pending? Backend decides
    [UserRole.MERCHANT]: [
        OrderStatus.CONFIRMED,
        OrderStatus.PREPARING,
        OrderStatus.READY,
        OrderStatus.CANCELLED
    ],
    [UserRole.COURIER]: [
        OrderStatus.DRIVER_ASSIGNED, // via accept endpoint
        OrderStatus.IN_DELIVERY,
        OrderStatus.DELIVERED
    ],
    [UserRole.ADMIN]: Object.values(OrderStatus),
};

export function getNextValidStatuses(currentStatus: OrderStatus, userRole: UserRole): OrderStatus[] {
    const physicallyPossible = ALLOWED_TRANSITIONS[currentStatus] || [];
    const roleAllowed = ROLE_ALLOWED_OFFICER[userRole] || [];

    return physicallyPossible.filter(status => roleAllowed.includes(status));
}

const ORDER_TRANSITIONS: Record<UserRole, Partial<Record<OrderStatus, OrderStatus[]>>> = {
    [UserRole.CUSTOMER]: {
        [OrderStatus.PENDING]: [OrderStatus.CANCELLED],
    },
    [UserRole.MERCHANT]: {
        [OrderStatus.PENDING]: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
        [OrderStatus.CONFIRMED]: [OrderStatus.PREPARING],
        [OrderStatus.PREPARING]: [OrderStatus.READY],
    },
    [UserRole.COURIER]: {
        [OrderStatus.READY]: [OrderStatus.IN_DELIVERY],
        [OrderStatus.IN_DELIVERY]: [OrderStatus.DELIVERED],
    },
    [UserRole.ADMIN]: {}
};

export function getNextStatus(current: OrderStatus, role: UserRole): OrderStatus | null {
    const roleTransitions = ORDER_TRANSITIONS[role];
    const allowed = roleTransitions ? roleTransitions[current] : null;
    return allowed && allowed.length > 0 ? allowed[0] : null;
}

export { STORAGE_KEYS, QUERY_KEYS } from './constants';
// Re-export constants to keep imports clean if needed,
// or simply keep this file focused on Order logic.
