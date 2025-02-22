package com.quizto.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

import com.quizto.model.Exam;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ExamResponse {
    private Long id;
    private String title;
    private String description;
    private Integer durationMinutes;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private LocalDateTime submittedAt;
    private String proctorUsername;
    private Integer score;
    private Integer totalQuestions;
    private List<QuestionDTO> questions;

public ExamResponse(Exam exam) {
    this.id = exam.getId();
    this.title = exam.getTitle();
    this.description = exam.getDescription();
    this.durationMinutes = exam.getDurationMinutes();
    this.startTime = exam.getStartTime();
    this.endTime = exam.getEndTime();
    this.proctorUsername = exam.getProctor().getUsername();
    this.totalQuestions = (exam.getQuestions() != null) ? exam.getQuestions().size() : 0;
    this.questions = (exam.getQuestions() != null)
        ? exam.getQuestions().stream()
            .map(q -> new QuestionDTO(q.getId(), q.getQuestionText(), q.getChoices()))
            .toList()
         :  null;   
}

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class QuestionDTO {
        private Long id;
        private String questionText;
        private List<String> choices;
    }
}
