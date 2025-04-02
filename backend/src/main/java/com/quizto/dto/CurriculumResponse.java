package com.quizto.dto;

import com.quizto.model.CurriculumTopic;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CurriculumResponse {
    private Long id;
    private String title;
    private String description;
    private List<CurriculumTopic> topics;
}
