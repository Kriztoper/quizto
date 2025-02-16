package com.quizto.service;

import com.quizto.dto.ExamRequest;
import com.quizto.dto.ExamResponse;
import com.quizto.dto.SubmissionRequest;
import com.quizto.dto.SubmissionResponse;
import com.quizto.entity.Submission;
import com.quizto.model.Exam;
import com.quizto.model.Question;
import com.quizto.repository.ExamRepository;
import com.quizto.repository.SubmissionRepository;
import com.quizto.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExamService {

    private final ExamRepository examRepository;
    private final UserRepository userRepository;
    private final SubmissionRepository submissionRepository;

    @Transactional
    public ExamResponse createExam(ExamRequest request) {
        var username = SecurityContextHolder.getContext().getAuthentication().getName();
        var proctor = userRepository.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("Proctor not found"));

        var exam = Exam.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .durationMinutes(request.getDurationMinutes())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .proctor(proctor)
                .questions(new ArrayList<>())
                .build();

        // Create questions and set up bidirectional relationship
        List<Question> questions = request.getQuestions().stream()
                .<Question>map(q -> Question.builder()
                        .questionText(q.getQuestionText())
                        .choices(new ArrayList<>(q.getChoices()))
                        .correctChoiceIndex(q.getCorrectChoiceIndex())
                        .exam(exam)
                        .build())
                .collect(Collectors.toList());

        exam.setQuestions(questions);

        var savedExam = examRepository.save(exam);
        return mapToExamResponse(savedExam);
    }

    public List<ExamResponse> getExamsByUser(Long userId) {
        List<ExamResponse> exams = examRepository.findAll().stream()
                .map(this::mapToExamResponse)
                .collect(Collectors.toList());
        List<Long> examIds = exams.stream()
                .map(ExamResponse::getId)
                .collect(Collectors.toList());

        List<Submission> submissions = submissionRepository.findAllByUserIdAndExamIdIn(userId, examIds);
        exams.forEach(e -> e.setScore(submissions.stream()
                .filter(s -> s.getExam().getId() == e.getId())
                .sorted(Comparator.comparing(Submission::getSubmittedAt).reversed())
                .findFirst()
                .map(Submission::getScore)
                .orElse(0)
        ));
        return exams;
    }

    public ExamResponse getExam(Long id) {
        var exam = examRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Exam not found"));
        return mapToExamResponse(exam);
    }

    @Transactional
    public SubmissionResponse submitExam(Long examId, SubmissionRequest request) {
        var exam = examRepository.findById(examId)
                .orElseThrow(() -> new EntityNotFoundException("Exam not found"));

        if (LocalDateTime.now().isAfter(exam.getEndTime())) {
            throw new IllegalStateException("Exam has ended");
        }

        var username = SecurityContextHolder.getContext().getAuthentication().getName();
        var user = userRepository.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        // Calculate score
        int score = 0;
        for (Question question : exam.getQuestions()) {
            Integer userAnswer = request.getAnswers().get(question.getId());
            if (userAnswer != null && userAnswer == question.getCorrectChoiceIndex()) {
                score++;
            }
        }

        // Create and save submission
        var submission = Submission.builder()
                .exam(exam)
                .user(user)
                .answers(request.getAnswers())
                .score(score)
                .submittedAt(LocalDateTime.now())
                .build();

        submission = submissionRepository.save(submission);

        return SubmissionResponse.builder()
                .id(submission.getId())
                .examId(exam.getId())
                .examTitle(exam.getTitle())
                .score(submission.getScore())
                .submittedAt(submission.getSubmittedAt())
                .build();
    }

    @Transactional
    public void deleteExam(Long id) {
        if (!examRepository.existsById(id)) {
            throw new EntityNotFoundException("Exam not found");
        }
        examRepository.deleteById(id);
    }

    public SubmissionResponse getLastSubmission() {
        var username = SecurityContextHolder.getContext().getAuthentication().getName();
        var user = userRepository.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        var lastSubmission = submissionRepository.findFirstByUserOrderBySubmittedAtDesc(user)
                .orElseThrow(() -> new EntityNotFoundException("No submissions found"));

        return SubmissionResponse.builder()
                .id(lastSubmission.getId())
                .examId(lastSubmission.getExam().getId())
                .examTitle(lastSubmission.getExam().getTitle())
                .score(lastSubmission.getScore())
                .submittedAt(lastSubmission.getSubmittedAt())
                .build();
    }

    @Transactional
    public ExamResponse updateExam(Long id, ExamRequest request) {
        var exam = examRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Exam not found"));

        // Verify that the current user is the proctor of this exam
        var username = SecurityContextHolder.getContext().getAuthentication().getName();
        if (!exam.getProctor().getUsername().equals(username)) {
            throw new IllegalStateException("Only the exam proctor can update this exam");
        }

        // Update basic exam details
        exam.setTitle(request.getTitle());
        exam.setDescription(request.getDescription());
        exam.setDurationMinutes(request.getDurationMinutes());
        exam.setStartTime(request.getStartTime());
        exam.setEndTime(request.getEndTime());

        // Update questions
        // First, remove all existing questions
        new ArrayList<>(exam.getQuestions()).forEach(exam::removeQuestion);
        
        // Create and add new questions
        request.getQuestions().forEach(q -> {
            Question question = Question.builder()
                    .questionText(q.getQuestionText())
                    .choices(new ArrayList<>(q.getChoices()))
                    .correctChoiceIndex(q.getCorrectChoiceIndex())
                    .build();
            exam.addQuestion(question);
        });

        var savedExam = examRepository.save(exam);
        return mapToExamResponse(savedExam);
    }

    private ExamResponse mapToExamResponse(Exam exam) {
        return ExamResponse.builder()
                .id(exam.getId())
                .title(exam.getTitle())
                .description(exam.getDescription())
                .durationMinutes(exam.getDurationMinutes())
                .startTime(exam.getStartTime())
                .endTime(exam.getEndTime())
                .proctorUsername(exam.getProctor().getUsername())
                .questions(exam.getQuestions().stream()
                        .map(q -> ExamResponse.QuestionDTO.builder()
                                .id(q.getId())
                                .questionText(q.getQuestionText())
                                .choices(q.getChoices())
                                .build())
                        .collect(Collectors.toList()))
                .build();
    }
}
