package com.fintrix.backend.repository;

import com.fintrix.backend.entity.PasswordResetToken;
import java.util.Optional;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.repository.query.Param;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    Optional<PasswordResetToken> findByToken(String token);

    @Query("select t from PasswordResetToken t where t.user.id = :userId and t.used = false and t.type = com.fintrix.backend.entity.PasswordResetToken$Type.OTP order by t.createdAt desc")
    Optional<PasswordResetToken> findLatestActiveOtpForUser(@Param("userId") Long userId);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("update PasswordResetToken t set t.used = true where t.user.id = :userId and t.used = false")
    int markAllTokensUsedForUser(@Param("userId") Long userId);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("update PasswordResetToken t set t.used = true where t.user.id = :userId and t.used = false and t.type = com.fintrix.backend.entity.PasswordResetToken$Type.OTP")
    int markAllOtpsUsedForUser(@Param("userId") Long userId);
}

