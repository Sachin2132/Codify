package com.tracker.codingtracker.controller;
import com.tracker.codingtracker.dto.CodeChefStatsDTO;
import com.tracker.codingtracker.service.CodeChefService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/codechef")
public class CodeChefController {
    private final CodeChefService codeChefService;
    @Autowired
    public CodeChefController(CodeChefService codeChefService) {
        this.codeChefService = codeChefService;
    }
    @GetMapping("/{username}")
    public ResponseEntity<CodeChefStatsDTO> getCodeChefStats(@PathVariable String username) {
        CodeChefStatsDTO stats = codeChefService.getUserStats(username);
        if (stats == null) {
            return ResponseEntity.status(500).build();
        }
        return ResponseEntity.ok(stats);
    }
}