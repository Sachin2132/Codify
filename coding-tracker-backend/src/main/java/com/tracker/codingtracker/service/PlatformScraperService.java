package com.tracker.codingtracker.service;

import com.tracker.codingtracker.dto.GFGStatsDTO;
import com.tracker.codingtracker.dto.CodeChefStatsDTO;
import org.json.JSONObject;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.File;
import java.io.InputStreamReader;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Unified scraper service: spawns a single Puppeteer process that scrapes
 * GFG and CodeChef concurrently in the same Chromium instance.
 * One cold start instead of two → ~50% faster.
 */
@Service
public class PlatformScraperService {

    public static class ScrapeResult {
        public final GFGStatsDTO gfg;
        public final CodeChefStatsDTO codechef;
        public ScrapeResult(GFGStatsDTO gfg, CodeChefStatsDTO codechef) {
            this.gfg = gfg;
            this.codechef = codechef;
        }
    }

    public ScrapeResult scrapeAll(String gfgUsername, String codechefUsername) {
        try {
            String projectRoot = System.getProperty("user.dir");
            ProcessBuilder pb = new ProcessBuilder(
                "node",
                projectRoot + "/platformScraper.js",
                "gfg=" + gfgUsername,
                "codechef=" + codechefUsername
            );
            pb.directory(new File(projectRoot));
            pb.redirectErrorStream(true);
            Process process = pb.start();

            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            StringBuilder output = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                output.append(line);
            }
            process.waitFor();

            JSONObject root = new JSONObject(output.toString());

            // --- Parse GFG ---
            JSONObject gfgJson = root.optJSONObject("gfg");
            Map<String, Integer> gfgStats = new LinkedHashMap<>();
            if (gfgJson != null) {
                gfgStats.put("basic",              gfgJson.optInt("basic", 0));
                gfgStats.put("easy",               gfgJson.optInt("easy", 0));
                gfgStats.put("medium",             gfgJson.optInt("medium", 0));
                gfgStats.put("hard",               gfgJson.optInt("hard", 0));
                gfgStats.put("totalProblemsSolved",gfgJson.optInt("totalProblemsSolved", 0));
            } else {
                gfgStats.put("basic", 0); gfgStats.put("easy", 0);
                gfgStats.put("medium", 0); gfgStats.put("hard", 0);
                gfgStats.put("totalProblemsSolved", 0);
            }
            GFGStatsDTO gfgDTO = new GFGStatsDTO();
            gfgDTO.setDifficultyStats(gfgStats);

            // --- Parse CodeChef ---
            JSONObject ccJson = root.optJSONObject("codechef");
            CodeChefStatsDTO ccDTO = new CodeChefStatsDTO();
            if (ccJson != null) {
                ccDTO.setTotalProblemsSolved(ccJson.optInt("totalSolved", 0));
                ccDTO.setFullyCorrect(ccJson.optInt("fullyCorrect", 0));
                ccDTO.setPartiallyCorrect(ccJson.optInt("partiallyCorrect", 0));
            }

            return new ScrapeResult(gfgDTO, ccDTO);

        } catch (Exception e) {
            e.printStackTrace();
            // Safe empty fallback
            Map<String, Integer> empty = new LinkedHashMap<>();
            empty.put("basic", 0); empty.put("easy", 0);
            empty.put("medium", 0); empty.put("hard", 0);
            empty.put("totalProblemsSolved", 0);
            GFGStatsDTO gfgDTO = new GFGStatsDTO();
            gfgDTO.setDifficultyStats(empty);
            CodeChefStatsDTO ccDTO = new CodeChefStatsDTO();
            return new ScrapeResult(gfgDTO, ccDTO);
        }
    }
}
