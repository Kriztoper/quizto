package com.quizto.repository;

import com.quizto.entity.Submission;
import com.quizto.model.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, Long> {
    Optional<Submission> findFirstByUserOrderBySubmittedAtDesc(User user);

    List<Submission> findAllByUserIdAndExamIdIn(Long userId, List<Long> examIds);
}
