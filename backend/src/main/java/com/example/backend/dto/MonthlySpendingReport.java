package com.example.backend.dto;

import java.time.LocalDate;
import java.util.Map;

public class MonthlySpendingReport {

    private String month;               
    private LocalDate startDate;               // first day of month
    private LocalDate endDate;                 // last day of month

    private double totalSpending;              //total this month
    private int transactionCount;              // # of expenses this month

    private Map<String, Double> spendingByCategory;


    //biggest expense category this month
    private String biggestExpenseCategory;  
    private double biggestExpenseAmount;       

    //comparison with previous month
    private double lastMonthTotalSpending;
    private int lastMonthTransactionCount;
    private Double percentChangeFromLastMonth; // null if no previous-month data

    public MonthlySpendingReport() {
    }

    // getters & setters
    public String getMonth() {
        return month;
    }

    public void setMonth(String month) {
        this.month = month;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public double getTotalSpending() {
        return totalSpending;
    }

    public void setTotalSpending(double totalSpending) {
        this.totalSpending = totalSpending;
    }

    public int getTransactionCount() {
        return transactionCount;
    }

    public void setTransactionCount(int transactionCount) {
        this.transactionCount = transactionCount;
    }

    public Map<String, Double> getSpendingByCategory() {
        return spendingByCategory;
    }

    public void setSpendingByCategory(Map<String, Double> spendingByCategory) {
        this.spendingByCategory = spendingByCategory;
    }

    public String getBiggestExpenseCategory() {
        return biggestExpenseCategory;
    }

    public void setBiggestExpenseCategory(String biggestExpenseCategory) {
        this.biggestExpenseCategory = biggestExpenseCategory;
    }

    public double getBiggestExpenseAmount() {
        return biggestExpenseAmount;
    }

    public void setBiggestExpenseAmount(double biggestExpenseAmount) {
        this.biggestExpenseAmount = biggestExpenseAmount;
    }

    public double getLastMonthTotalSpending() {
        return lastMonthTotalSpending;
    }

    public void setLastMonthTotalSpending(double lastMonthTotalSpending) {
        this.lastMonthTotalSpending = lastMonthTotalSpending;
    }

    public int getLastMonthTransactionCount() {
        return lastMonthTransactionCount;
    }

    public void setLastMonthTransactionCount(int lastMonthTransactionCount) {
        this.lastMonthTransactionCount = lastMonthTransactionCount;
    }

    public Double getPercentChangeFromLastMonth() {
        return percentChangeFromLastMonth;
    }

    public void setPercentChangeFromLastMonth(Double percentChangeFromLastMonth) {
        this.percentChangeFromLastMonth = percentChangeFromLastMonth;
    }

    private HighestTransaction highestTransaction;

public HighestTransaction getHighestTransaction() {
    return highestTransaction;
}

public void setHighestTransaction(HighestTransaction highestTransaction) {
    this.highestTransaction = highestTransaction;
}

}
