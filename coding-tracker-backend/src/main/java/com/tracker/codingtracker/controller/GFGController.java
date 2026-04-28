package com.tracker.codingtracker.controller;
import com.tracker.codingtracker.dto.GFGStatsDTO;
import com.tracker.codingtracker.service.GeeksForGeeksService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/gfg")
public class GFGController {
    @Autowired
    private GeeksForGeeksService gfgService;
    @GetMapping("/{username}")
    public GFGStatsDTO getGFGStats(@PathVariable String username) {
        return gfgService.getUserStats(username);
    }
}