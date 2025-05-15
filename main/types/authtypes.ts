export type User = {
    username: string;
    password: string;
    hint: string;
    isAdmin: boolean;
    id?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export type Session = {
  userId: string,
  expiresAt: string,
}

export type SessionPayload = {
    userId: string;
    expiresAt: Date;
};