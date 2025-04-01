package com.quizto.dto;

import com.quizto.model.Exam;
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
public class CurriculumResponse {
    private Long id;
    private String title;
    private String description;

    public CurriculumResponse(Exam exam) {
        this.id = exam.getId();
        this.title = exam.getTitle();
        this.description = exam.getDescription();
    }
}
