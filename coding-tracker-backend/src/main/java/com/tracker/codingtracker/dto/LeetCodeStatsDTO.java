package com.tracker.codingtracker.dto;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonPropertyOrder({ "easySolved", "mediumSolved", "hardSolved", "totalSolved" })
public class LeetCodeStatsDTO {
    private int easySolved;
    private int mediumSolved;
    private int hardSolved;
    private int totalSolved;

    public LeetCodeStatsDTO() {}

    public LeetCodeStatsDTO(int easySolved, int mediumSolved, int hardSolved, int totalSolved) {
        this.easySolved = easySolved;
        this.mediumSolved = mediumSolved;
        this.hardSolved = hardSolved;
        this.totalSolved = totalSolved;
    }

    // Getters & Setters
    public int getEasySolved() { return easySolved; }
    public void setEasySolved(int easySolved) { this.easySolved = easySolved; }

    public int getMediumSolved() { return mediumSolved; }
    public void setMediumSolved(int mediumSolved) { this.mediumSolved = mediumSolved; }

    public int getHardSolved() { return hardSolved; }
    public void setHardSolved(int hardSolved) { this.hardSolved = hardSolved; }

    public int getTotalSolved() { return totalSolved; }
    public void setTotalSolved(int totalSolved) { this.totalSolved = totalSolved; }
}