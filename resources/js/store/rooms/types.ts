export interface Room {
  id: string;
  name: string | null;
  type: 'template' | 'custom';
  seat_size: number;
}

export interface RoomsState {
  [roomId: string]: Room;
}

export const RECEIVE_ROOMS = 'RECEIVE_ROOMS'
export interface ReceiveRooms {
  type: typeof RECEIVE_ROOMS;
  rooms: {
    [roomId: string]: Room;
  };
}

export const REMOVE_ROOM = 'REMOVE_ROOM'
export interface RemoveRoom {
  type: typeof REMOVE_ROOM;
  roomId: string;
}

export type RoomsActionTypes =
  | ReceiveRooms
  | RemoveRoom;
