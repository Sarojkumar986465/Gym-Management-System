package com.gymtracker.repository;

import com.gymtracker.entity.WorkoutSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface WorkoutSessionRepository extends JpaRepository<WorkoutSession, Long> {
    List<WorkoutSession> findByMemberIdOrderBySessionDateDesc(Long memberId);
    
    @Query("SELECT DISTINCT w.sessionDate FROM WorkoutSession w WHERE w.member.id = :memberId ORDER BY w.sessionDate DESC")
    List<LocalDate> findDistinctSessionDatesByMember(@Param("memberId") Long memberId);

    @Query("SELECT COUNT(w) FROM WorkoutSession w WHERE w.member.id = :memberId")
    long countCompletedSessionsByMember(@Param("memberId") Long memberId);
}
