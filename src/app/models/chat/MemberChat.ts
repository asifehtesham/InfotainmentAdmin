
export interface PeerData {
    id: string;
    data: any;
}

export interface MemberChat {
    MemberID: string;
    ConnectionId: string;
    Name: string;
    LastMessage: string;
    LastSeenOn: string;
}

export interface SignalInfo {
    user: string;
    signal: any;
}

export interface ChatMessage {
    own: boolean;
    message: string;
    time?: Date;
}