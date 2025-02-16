package com.quizto.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ExamRequest {
    private String title;
    private String description;
    private Integer durationMinutes;
    @Builder.Default
    private LocalDateTime startTime = LocalDateTime.now();
    @Builder.Default
    private LocalDateTime endTime = LocalDateTime.now().plusYears(1);
    private List<QuestionDTO> questions;

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class QuestionDTO {
        private String questionText;
        private List<String> choices;
        private Integer correctChoiceIndex;
    }
}
