package com.quizto.controller;

import com.quizto.dto.ExamRequest;
import com.quizto.dto.ExamResponse;
import com.quizto.dto.SubmissionRequest;
import com.quizto.dto.SubmissionResponse;
import com.quizto.service.ExamService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/exam")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class ExamController {

    private final ExamService examService;

    @PostMapping
    @PreAuthorize("hasRole('PROCTOR')")
    public ResponseEntity<ExamResponse> createExam(@RequestBody ExamRequest request) {
        return ResponseEntity.ok(examService.createExam(request));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ExamResponse>> getExamsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(examService.getExamsByUser(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExamResponse> getExam(@PathVariable Long id) {
        return ResponseEntity.ok(examService.getExam(id));
    }
    
    @GetMapping("/{id}/question-count")
    public ResponseEntity<Integer> getQuestionCount(@PathVariable Long id) {
        return ResponseEntity.ok(examService.getQuestionCount(id));
    }

    @PostMapping("/{id}/submit")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<SubmissionResponse> submitExam(
            @PathVariable Long id,
            @RequestBody SubmissionRequest request
    ) {
        return ResponseEntity.ok(examService.submitExam(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('PROCTOR')")
    public ResponseEntity<Void> deleteExam(@PathVariable Long id) {
        examService.deleteExam(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('PROCTOR')")
    public ResponseEntity<ExamResponse> updateExam(
            @PathVariable Long id,
            @RequestBody ExamRequest request
    ) {
        return ResponseEntity.ok(examService.updateExam(id, request));
    }

    @GetMapping("/last-submission")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<SubmissionResponse> getLastSubmission() {
        return ResponseEntity.ok(examService.getLastSubmission());
    }
}
