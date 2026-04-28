package com.tracker.codingtracker.service;
import com.tracker.codingtracker.dto.CodeChefStatsDTO;
import org.springframework.stereotype.Service;

@Service
public class CodeChefService {
    public CodeChefStatsDTO getUserStats(String username) {
        try {
            // CodeChef is also a React SPA — Jsoup cannot see the rendered DOM.
            // We use the same Puppeteer subprocess approach as GFG.
            String projectRoot = System.getProperty("user.dir");
            ProcessBuilder pb = new ProcessBuilder("node", projectRoot + "/codechefScraper.js", username);
            pb.directory(new java.io.File(projectRoot));
            pb.redirectErrorStream(true);
            Process process = pb.start();

            java.io.BufferedReader reader = new java.io.BufferedReader(new java.io.InputStreamReader(process.getInputStream()));
            StringBuilder output = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                output.append(line);
            }
            process.waitFor();

            org.json.JSONObject json = new org.json.JSONObject(output.toString());

            CodeChefStatsDTO stats = new CodeChefStatsDTO();
            stats.setTotalProblemsSolved(json.optInt("totalSolved", 0));
            stats.setFullyCorrect(json.optInt("fullyCorrect", 0));
            stats.setPartiallyCorrect(json.optInt("partiallyCorrect", 0));
            return stats;
        } catch (Exception e) {
            e.printStackTrace();
            CodeChefStatsDTO stats = new CodeChefStatsDTO();
            stats.setTotalProblemsSolved(0);
            stats.setFullyCorrect(0);
            stats.setPartiallyCorrect(0);
            return stats;
        }
    }
}