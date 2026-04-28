package com.tracker.codingtracker.dto;

public class CodeChefStatsDTO {
    private int totalProblemsSolved;
    private int fullyCorrect;
    private int partiallyCorrect;

    public CodeChefStatsDTO() {}

    public int getTotalProblemsSolved() { return totalProblemsSolved; }
    public void setTotalProblemsSolved(int totalProblemsSolved) { this.totalProblemsSolved = totalProblemsSolved; }

    public int getFullyCorrect() { return fullyCorrect; }
    public void setFullyCorrect(int fullyCorrect) { this.fullyCorrect = fullyCorrect; }

    public int getPartiallyCorrect() { return partiallyCorrect; }
    public void setPartiallyCorrect(int partiallyCorrect) { this.partiallyCorrect = partiallyCorrect; }
}