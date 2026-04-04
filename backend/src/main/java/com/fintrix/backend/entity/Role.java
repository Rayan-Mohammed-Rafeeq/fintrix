package com.fintrix.backend.enums;

/**
 * Workspace-level role. Authorizations should be evaluated against a user's
 * {@link com.fintrix.backend.entity.Membership} for a given workspace.
 */
public enum Role {
    ADMIN,
    ANALYST,
    VIEWER
}
