export type USER_TYPE = {
    id: number,
    documentType: string,
    documentId: string,
    name: string,
    lastname: string,
    cellphone: string,
    email: string,
    password: string,
    role_id: number,
    remember_token?: string | null,

    Roles?: ROLES_TYPE,

    createdAt?: Date,
    updatedAt?: Date,
    iat?: number
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
