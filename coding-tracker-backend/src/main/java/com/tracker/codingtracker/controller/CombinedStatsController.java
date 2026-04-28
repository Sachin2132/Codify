package com.tracker.codingtracker.controller;

import com.tracker.codingtracker.dto.*;
import com.tracker.codingtracker.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.concurrent.CompletableFuture;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/stats")
public class CombinedStatsController {

    @Autowired private LeetCodeService leetCodeService;
    @Autowired private PlatformScraperService platformScraperService;

    @GetMapping
    public AllPlatformStatsDTO getAllStats(
        @RequestParam String leetcode,
        @RequestParam String gfg,
        @RequestParam String codechef
    ) throws Exception {
        // Fire LeetCode (fast GraphQL API) and the unified Puppeteer scraper IN PARALLEL
        CompletableFuture<LeetCodeStatsDTO> leetFuture = CompletableFuture
            .supplyAsync(() -> leetCodeService.fetchLeetCodeStats(leetcode));

        CompletableFuture<PlatformScraperService.ScrapeResult> scraperFuture = CompletableFuture
            .supplyAsync(() -> platformScraperService.scrapeAll(gfg, codechef));

        // Block until BOTH complete (total time = max of the two, not sum)
        LeetCodeStatsDTO leetCodeStats = leetFuture.get();
        PlatformScraperService.ScrapeResult scraped = scraperFuture.get();

        return new AllPlatformStatsDTO(leetCodeStats, scraped.gfg, scraped.codechef);
    }
}