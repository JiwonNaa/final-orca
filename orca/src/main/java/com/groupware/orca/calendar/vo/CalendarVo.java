package com.groupware.orca.calendar.vo;

import lombok.Data;

@Data
public class CalendarVo {
    private int calendarNo;
    private String writerNo;
    private String title;
    private String content;
    private String startDate;
    private String endDate;
    private char repeatYn;
    private String enrollDate;
    private String delDate;
    private String range;
}