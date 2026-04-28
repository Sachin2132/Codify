package com.tracker.codingtracker.service;
// import org.jsoup.Jsoup;
// import org.jsoup.nodes.Document;
// import org.jsoup.nodes.Element;
// import org.jsoup.select.Elements;
import org.springframework.stereotype.Service;
import com.tracker.codingtracker.dto.GFGStatsDTO;
import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class GeeksForGeeksService {
    public GFGStatsDTO getUserStats(String username) {
        try {
            // GeeksForGeeks dynamically renders difficulty stats via Client-Side React + CSRF blocking, 
            // making Jsoup unviable. We use a local Puppeteer Node.js script to extract the fully rendered DOM.
            // Resolve script path relative to the backend project root (robust across run contexts)
            String projectRoot = System.getProperty("user.dir");
            ProcessBuilder pb = new ProcessBuilder("node", projectRoot + "/gfgScraper.js", username);
            pb.directory(new java.io.File(projectRoot));
            pb.redirectErrorStream(true);
            Process process = pb.start();

            // Read the output from the Node script
            java.io.BufferedReader reader = new java.io.BufferedReader(new java.io.InputStreamReader(process.getInputStream()));
            StringBuilder output = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                output.append(line);
            }
            process.waitFor();

            org.json.JSONObject json = new org.json.JSONObject(output.toString());
            
            Map<String, Integer> difficultyStats = new LinkedHashMap<>();
            difficultyStats.put("basic", json.optInt("basic", 0));
            difficultyStats.put("easy", json.optInt("easy", 0));
            difficultyStats.put("medium", json.optInt("medium", 0));
            difficultyStats.put("hard", json.optInt("hard", 0));
            difficultyStats.put("totalProblemsSolved", json.optInt("totalProblemsSolved", 0));

            GFGStatsDTO stats = new GFGStatsDTO();
            stats.setDifficultyStats(difficultyStats);
            return stats;
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Integer> empty = new LinkedHashMap<>();
            empty.put("basic", 0);
            empty.put("easy", 0);
            empty.put("medium", 0);
            empty.put("hard", 0);
            empty.put("totalProblemsSolved", 0);
            GFGStatsDTO stats = new GFGStatsDTO();
            stats.setDifficultyStats(empty);
            return stats;
        }
    }
}