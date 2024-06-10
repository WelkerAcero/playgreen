export type USER_TYPE = {
    id: number,
    documentId: string,
    name: string,
    lastname: string,
    cellphone: string,
    email: string,
    address: string,
    gender?: string | undefined | null,
    birthDate: string,
    city: string,
    username: string,
    password: string,
    role_id: number,
    country_id: number,
    remember_token?: string | null,

    Roles?: ROLES_TYPE,
    Countries: COUNTRY_TYPE,
    BankAccounts: BANK_ACCOUNTS_TYPE,

    createdAt?: Date,
    updatedAt?: Date,
    iat?: number
}

export type BANK_ACCOUNTS_TYPE = {
    id?: number,
    account_number: string,
    amount: string,
    user_id: number,
    bet_option?: number,
}

export type COMPLETED_TRANSACTION_TYPE = {
    UsersTransactions: USERS_TRANSACTIONS_TYPE,
    BankAccounts: BANK_ACCOUNTS_TYPE
}

export type USERS_TRANSACTIONS_TYPE = {
    id?: number,
    amount_money: string,
    user_id: number,
    category_id: number,

    bet_id?: number,
    Users?: USER_TYPE,
    Categories?: CATEGORY_TYPE,
    Bets?: BETS_TYPE
    createdAt?: Date,
    updatedAt?: Date,
}

export type SPORTS_TYPE = {
    id: number,
    name: string,
    Events?: EVENTS_TYPE
}

export type EVENTS_TYPE = {
    id: number,
    name: string, 
    event_place: string,
    event_date: Date
    sport_id: number,

    Sports?: SPORTS_TYPE,
    Bets?: BETS_TYPE
}

export type TEAMS_TYPE = {
   id: number,
   name: string,
   BETS?: BETS_TYPE 
}

export type BETS_TYPE = {
    id: number,
    bet_option: number,
    odd: string,
    status: string,
    result?: string, /* WON | LOST */
    event_id: number,
    team_id: number,

    Events?: EVENTS_TYPE,
    Teams?: TEAMS_TYPE,
    UsersTransactions?: USERS_TRANSACTIONS_TYPE[],

    createdAt?: Date,
    updatedAt?: Date
}

export type CATEGORY_TYPE = {
    id: number,
    name: string
}

export type COUNTRY_TYPE = {
    id: number,
    name: number,
}

// ================ ROLES ==========================
export type ROLES_TYPE = {
    id: number,
    rol_name: string,
    RolesPermissions?: ROLES_PERMISSIONS_TYPE[],
    createdAt?: Date,
    updatedAt?: Date
}

export type ROLES_PERMISSIONS_TYPE = {
    id?: number,
    role_id: number,
    permission_id: number
    Permissions?: PERMISSIONS_TYPE
}

export type PERMISSIONS_TYPE = {
    id: number,
    type: string,
}

// ====================================================

export type YEAR_TYPE = {
    id: number,
    year: string
}

export type HOUR_TYPE = {
    id: number,
    hour: string
}

export type MONTH_TYPE = {
    id: number,
    month: string
}

export type VALIDATION_TYPE = {
    error: string,
    valid: boolean;
}

export type RULE_TYPE = {
    type: string,
    max?: number,
    min?: number,
    default?: null
}

export type PRISMA_ERROR_TYPE = {
    code: string,
    clientVersion: string,
    meta: { target: string[] }
}
