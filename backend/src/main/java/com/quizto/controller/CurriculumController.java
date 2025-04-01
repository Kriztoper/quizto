package com.quizto.controller;

import com.quizto.dto.CurriculumResponse;
import com.quizto.service.CurriculumService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/curriculum")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class CurriculumController {
    private final CurriculumService curriculumService;

    @GetMapping
    public ResponseEntity<List<CurriculumResponse>> getAllCurriculums() {
        return ResponseEntity.ok(curriculumService.getAllCurriculums());
    }

}
