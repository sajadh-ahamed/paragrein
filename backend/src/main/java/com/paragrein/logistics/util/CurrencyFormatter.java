package com.paragrein.logistics.util;

import java.math.BigDecimal;
import java.text.NumberFormat;
import java.util.Locale;

public class CurrencyFormatter {

    private static final NumberFormat currencyInstance;

    static {
        currencyInstance = NumberFormat.getCurrencyInstance(new Locale("en", "LK"));
        currencyInstance.setCurrency(java.util.Currency.getInstance("LKR"));
    }

    public static String format(BigDecimal value) {
        return value == null ? currencyInstance.format(BigDecimal.ZERO) : currencyInstance.format(value);
    }
}