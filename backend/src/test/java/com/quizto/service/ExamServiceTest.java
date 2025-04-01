package com.quizto.service;

import com.quizto.dto.SubmissionRequest;
import com.quizto.model.Exam;
import com.quizto.model.Question;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.HashMap;
import java.util.List;

@ExtendWith(MockitoExtension.class)
public class ExamServiceTest {
    private Exam exam;
    private SubmissionRequest submissionRequest;

    @BeforeEach
    public void setup() {
        exam = new Exam();
        exam.setQuestions(List.of(
                Question.builder()
                        .id(1L)
                        .correctChoiceIndex(0)
                        .questionText("Question 1")
                        .build(),
                Question.builder()
                        .id(2L)
                        .correctChoiceIndex(1)
                        .questionText("Question 2")
                        .build(),
                Question.builder()
                        .id(3L)
                        .correctChoiceIndex(2)
                        .questionText("Question 3")
                        .build()
        ));

        submissionRequest = new SubmissionRequest();
        submissionRequest.setAnswers(new HashMap<>());
    }

    @Test
    public void testAllAnswersCorrect() {
        // Arrange
        submissionRequest.getAnswers().put(1L, 0);
        submissionRequest.getAnswers().put(2L, 1);
        submissionRequest.getAnswers().put(3L, 2);

        // Act
        int score = ExamService.calculateScore(submissionRequest.getAnswers(), exam.getQuestions());

        // Assert
        assert score == 3;
    }

    @Test
    public void testOneAnswerWrong() {
        // Arrange
        submissionRequest.getAnswers().put(1L, 4);
        submissionRequest.getAnswers().put(2L, 1);
        submissionRequest.getAnswers().put(3L, 2);

        // Act
        int score = ExamService.calculateScore(submissionRequest.getAnswers(), exam.getQuestions());

        // Assert
        assert score == 2;
    }

    @Test
    public void testAllAnswersWrong() {
        // Arrange
        submissionRequest.getAnswers().put(1L, 4);
        submissionRequest.getAnswers().put(2L, 4);
        submissionRequest.getAnswers().put(3L, 4);

        // Act
        int score = ExamService.calculateScore(submissionRequest.getAnswers(), exam.getQuestions());

        // Assert
        assert score == 0;
    }
}
