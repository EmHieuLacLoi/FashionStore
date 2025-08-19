package com.emhieulacloi.fashionstore.api.util;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.time.DateUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.apache.commons.lang3.time.DateFormatUtils;
import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Date;

public class FmsUtil {
    private static final Logger log = LoggerFactory.getLogger(FmsUtil.class);
    private static final String CHARS = "abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNOPQRSTUVWXYZ0123456789";

    public static Date unixTimeToDate(int unixtime) {
        return new Date(unixtime * 1000L);
    }

    public static String formatDate(int  unixTime, String strFormat) {
        if (unixTime >0) {
            Date date = new Date(unixTime*1000L);
            return DateFormatUtils.format(date, strFormat);
        }

        return "";
    }

    public static String formatDate(long  unixTime) {
        if (unixTime >0) {
            Date date = new Date(unixTime);
            return DateFormatUtils.format(date, "yyyy/MM/dd-hh:mm:ss");
        }

        return "";
    }

    public static String formatDate(Date date) {
        if (date!=null) {
            return DateFormatUtils.format(date, "yyyy/MM/dd-hh:mm:ss");
        }
        return "";
    }
    public static Date getBeginDay(Date date) {
        String sBeginDay = DateFormatUtils.format(date, "yyyy/MM/dd");
        try {
            return parseDate(sBeginDay,"yyyy/MM/dd");
        }catch (Exception e){
            log.error("Exception: {}" , e.getMessage());
        }

        return date;
    }

    public static Date parseDate(String strDate, String strFormat) throws ParseException {
        return DateUtils.parseDate(strDate, strFormat);
    }

    public static int[] getArray(String strArray) {
        if(StringUtils.isNotEmpty(strArray)) {
            strArray = StringUtils.replace(strArray, "[", "");
            strArray = StringUtils.replace(strArray, "]", "");
            String[] sArray = StringUtils.split(strArray, ",");
            int[] result = new int[sArray.length];
            for(int i=0;i<sArray.length;i++){
                result[i] = Integer.parseInt(sArray[i].trim());
            }
            return result;
        }

        return null;
    }

    public static float getShortDouble(double km) {
        long km10X = (long)(km*10);
        return ((float) km10X /10);
    }



    public static String convertTimestampToString(Timestamp timestamp, String format) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern(format);
        return timestamp.toLocalDateTime().format(formatter);
    }

    public static String validateStrings(String str) {
        if (str != null && !str.isEmpty()) {
            return str;
        } else {
            return null;
        }
    }
    public static Timestamp convertStringTimestamp(String dateString, String dateFormat) {
        try {
            SimpleDateFormat sdf = new SimpleDateFormat(dateFormat);
            Date parsedDate = sdf.parse(dateString);
            return new Timestamp(parsedDate.getTime());
        } catch (ParseException e) {
            log.error("Invalid date format: {}", e.getMessage());
            return null;
        }
    }

    public static double parseDoubleFromString(String quantityString) {
        double quantity = 0.0;
        try {
            if (quantityString != null) {
                quantity = Double.parseDouble(quantityString);
            }
        } catch (NumberFormatException e) {
            log.error("Invalid number format: {}", e.getMessage());
        }
        return quantity;
    }

    public static double parsePercentageToDouble(String percentageString) {
        try {
            String numericPart = percentageString.replace("%", "").trim();
            return Double.parseDouble(numericPart) / 100;
        } catch (NumberFormatException e) {
            log.error("Invalid percentage format: {}", e.getMessage());
            return 0.0;
        }
    }

    public static String formatDateString(String startDate) {
        String formattedDate = null;

        if (startDate != null) {
            try {
                DateTimeFormatter inputFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
                DateTimeFormatter outputFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

                if (startDate.contains(":")) {
                    formattedDate = LocalDate.parse(startDate, inputFormatter).format(outputFormatter);
                } else {
                    formattedDate = LocalDate.parse(startDate).format(outputFormatter);
                }
            } catch (Exception e) {
                log.error("Invalid date convert format: {}", e.getMessage());
            }
        }

        return formattedDate;
    }

    public static Timestamp convertStringToTimestamp(String dateString) {
        try {
            SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");

            Date parsedDate = sdf.parse(dateString);

            return new Timestamp(parsedDate.getTime());
        } catch (Exception e) {
            log.error("Lỗi chuyển đổi ngày: {}", e.getMessage());
            return null;
        }
    }
}