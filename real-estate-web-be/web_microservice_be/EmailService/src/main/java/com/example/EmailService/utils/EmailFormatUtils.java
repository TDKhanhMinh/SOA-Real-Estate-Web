package com.example.EmailService.utils;

import java.text.NumberFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

public class EmailFormatUtils {
    private static final NumberFormat vndFormat =
            NumberFormat.getCurrencyInstance(new Locale("vi", "VN"));

    private static final DateTimeFormatter dateTimeFormat =
            DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    public static String vnd(Object number) {
        if (number == null) return "";
        return vndFormat.format(number);
    }

    public static String date(LocalDateTime time) {
        if (time == null) return "";
        return dateTimeFormat.format(time);
    }
}
