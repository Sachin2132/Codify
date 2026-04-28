package com.tracker.codingtracker.controller;
import com.tracker.codingtracker.dto.LeetCodeStatsDTO;
import com.tracker.codingtracker.service.LeetCodeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/leetcode")
@CrossOrigin("*")
public class LeetCodeController {
    @Autowired
    private LeetCodeService leetCodeService;
    @GetMapping("/{username}")
    public LeetCodeStatsDTO getLeetCodeStats(@PathVariable String username) {
        return leetCodeService.fetchLeetCodeStats(username);
    }
}