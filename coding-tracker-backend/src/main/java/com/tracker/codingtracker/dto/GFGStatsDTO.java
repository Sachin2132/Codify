package com.tracker.codingtracker.dto;
import com.fasterxml.jackson.annotation.JsonAnyGetter;
import java.util.Map;

public class GFGStatsDTO {
    private Map<String, Integer> difficultyStats;
    public GFGStatsDTO() {}
    public GFGStatsDTO(Map<String, Integer> difficultyStats) {
        this.difficultyStats = difficultyStats;
    }
    @JsonAnyGetter
    public Map<String, Integer> getDifficultyStats() {
        return difficultyStats;
    }
    public void setDifficultyStats(Map<String, Integer> difficultyStats) {
        this.difficultyStats = difficultyStats;
    }
}