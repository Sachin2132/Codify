package com.tracker.codingtracker.dto;

public class AllPlatformStatsDTO {
    private LeetCodeStatsDTO leetCodeStats;
    private GFGStatsDTO gfgStats;
    private CodeChefStatsDTO codeChefStats;
    public AllPlatformStatsDTO(LeetCodeStatsDTO leetCodeStats, GFGStatsDTO gfgStats, CodeChefStatsDTO codeChefStats) {
        this.leetCodeStats = leetCodeStats;
        this.gfgStats = gfgStats;
        this.codeChefStats = codeChefStats;
    }
    public LeetCodeStatsDTO getLeetCodeStats() {
        return leetCodeStats;
    }
    public GFGStatsDTO getGfgStats() {
        return gfgStats;
    }
    public CodeChefStatsDTO getCodeChefStats() {
        return codeChefStats;
    }
}