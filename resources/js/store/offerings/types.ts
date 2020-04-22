export interface Offering {
  id: string;
  title: string;
  catalog_nbr: string | null;
  section: string | null;
  term_code: number;
  subject: string | null;
  instructors: {
    cnet_id: string;
    first_name: string;
    last_name: string;
  }[];
  manually_created_by: string | null;
  updated_at: string | null;
  room_id: string | null;
  paper_size: 'tabloid' | 'letter' | null;
  font_size: 'default' | 'smaller' | 'larger' | 'x-large' | null;
  names_to_show: 'first_and_last' | 'first_and_last_initial' | 'first_only' | 'last_only' | null;
  flipped: number | null;
  use_nicknames: number | null;
  use_prefixes: number | null;
}

export interface OfferingsState {
  [key: string]: Offering;
}

export const RECEIVE_OFFERINGS = 'RECEIVE_OFFERINGS'
export interface ReceiveOfferings {
  type: typeof RECEIVE_OFFERINGS;
  offerings: {
    [key: string]: Offering;
  };
}

export const REMOVE_OFFERING = 'REMOVE_OFFERING'
export interface RemoveOffering {
  type: typeof REMOVE_OFFERING;
  offeringId: string;
}

export const REMOVE_ALL_OFFERINGS = 'REMOVE_ALL_OFFERINGS'
export interface RemoveAllOfferings {
  type: typeof REMOVE_ALL_OFFERINGS;
}

export type OfferingsActionTypes =
  | ReceiveOfferings
  | RemoveOffering
  | RemoveAllOfferings
