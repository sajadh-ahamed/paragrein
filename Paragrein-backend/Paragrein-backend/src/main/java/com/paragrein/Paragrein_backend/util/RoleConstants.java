package com.paragrein.Paragrein_backend.util;

import java.util.Set;

public final class RoleConstants {

    public static final String ADMIN = "ADMIN";
    public static final String CUSTOMER = "CUSTOMER";

    public static final String DRIVER = "DRIVER";
    public static final String WAREHOUSE = "WAREHOUSE";
    public static final String FINANCE = "FINANCE";
    public static final String OPERATIONS = "OPERATIONS";

    public static final Set<String> WORKER_ROLES = Set.of(
            DRIVER,
            WAREHOUSE,
            FINANCE,
            OPERATIONS
    );

    private RoleConstants() {
    }
}
