import { SessionData } from 'express-session'

export interface UserSessionData extends SessionData {
    userId?: string
}