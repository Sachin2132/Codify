package com.tracker.codingtracker.service;
import com.tracker.codingtracker.dto.LeetCodeStatsDTO;
import org.json.JSONObject;
import org.springframework.stereotype.Service;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Scanner;

@Service
public class LeetCodeService {
	public LeetCodeStatsDTO fetchLeetCodeStats(String username) {
	    try {
	        URL url = new URL("https://leetcode.com/graphql");
	        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
	        String query = "{ \"query\": \"query getUserProfile($username: String!) { matchedUser(username: $username) { submitStats: submitStatsGlobal { acSubmissionNum { difficulty count } } } }\", \"variables\": { \"username\": \"" + username + "\" } }";
	        connection.setRequestMethod("POST");
	        connection.setRequestProperty("Content-Type", "application/json");
	        connection.setDoOutput(true);
	        try (OutputStream os = connection.getOutputStream()) {
	            byte[] input = query.getBytes("utf-8");
	            os.write(input, 0, input.length);
	        }
	        Scanner scanner = new Scanner(connection.getInputStream());
	        StringBuilder jsonStr = new StringBuilder();
	        while (scanner.hasNext()) {
	            jsonStr.append(scanner.nextLine());
	        }
	        scanner.close();
	        JSONObject json = new JSONObject(jsonStr.toString());
	        JSONObject data = json.optJSONObject("data");
	        if (data == null || data.isNull("matchedUser")) {
	            System.out.println("LeetCode username not found: " + username);
	            return new LeetCodeStatsDTO(0, 0, 0, 0);
	        }
	        JSONObject matchedUser = data.optJSONObject("matchedUser");
	        if (matchedUser == null) {
	            System.out.println("No matched user data found.");
	            return new LeetCodeStatsDTO(0, 0, 0, 0);
	        }
	        var submissions = matchedUser
	                .getJSONObject("submitStats")
	                .getJSONArray("acSubmissionNum");
	        int total = submissions.getJSONObject(0).getInt("count");
	        int easy = submissions.getJSONObject(1).getInt("count");
	        int medium = submissions.getJSONObject(2).getInt("count");
	        int hard = submissions.getJSONObject(3).getInt("count");
	        
	        return new LeetCodeStatsDTO(easy, medium, hard, total);
	    } catch (Exception e) {
	        e.printStackTrace();
	        return new LeetCodeStatsDTO(0, 0, 0, 0);
	    }
	}
}