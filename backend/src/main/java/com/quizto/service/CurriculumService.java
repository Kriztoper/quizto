package com.quizto.service;

import com.quizto.dto.CurriculumResponse;
import com.quizto.model.Curriculum;
import com.quizto.repository.CurriculumRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CurriculumService {

    private final CurriculumRepository curriculumRepository;

    public List<CurriculumResponse> getAllCurriculums() {
        return curriculumRepository.findAll().stream()
                .map(this::mapToCurriculumResponse)
                .collect(Collectors.toList());
    }

    private CurriculumResponse mapToCurriculumResponse(Curriculum curriculum) {
        return CurriculumResponse.builder()
                .id(curriculum.getId())
                .title(curriculum.getTitle())
                .description(curriculum.getDescription())
                .build();
    }
}
