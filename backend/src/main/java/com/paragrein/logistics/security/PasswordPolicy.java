package com.paragrein.logistics.security;

public final class PasswordPolicy {

    public static final String REQUIREMENTS = "Password must be at least 8 characters and include uppercase, lowercase, number, and special character.";

    private PasswordPolicy() {
    }

    public static boolean isStrong(String password) {
        return password != null
                && password.length() >= 8
                && password.matches(".*[A-Z].*")
                && password.matches(".*[a-z].*")
                && password.matches(".*\\d.*")
                && password.matches(".*[^A-Za-z0-9].*");
    }
}
