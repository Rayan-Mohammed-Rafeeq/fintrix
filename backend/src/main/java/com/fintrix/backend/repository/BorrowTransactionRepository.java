package com.fintrix.backend.repository;

import com.fintrix.backend.entity.BorrowTransaction;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface BorrowTransactionRepository extends JpaRepository<BorrowTransaction, Long> {

    List<BorrowTransaction> findByBorrowerId(Long borrowerId);

    List<BorrowTransaction> findByLenderId(Long lenderId);

    @Query("""
        select bt
        from BorrowTransaction bt
        where (bt.borrower.id = :userId or bt.lender.id = :userId)
        order by bt.createdAt desc
        """)
    List<BorrowTransaction> findAllInvolvingUser(@Param("userId") Long userId);

    @Query("""
        select bt
        from BorrowTransaction bt
        where bt.workspace.id = :workspaceId
          and (bt.borrower.id = :userId or bt.lender.id = :userId)
        order by bt.createdAt desc
        """)
    List<BorrowTransaction> findAllInvolvingUserInWorkspace(@Param("workspaceId") Long workspaceId,
                                                            @Param("userId") Long userId);

    @Query("""
        select bt
        from BorrowTransaction bt
        where bt.id = :id and bt.workspace.id = :workspaceId
        """)
    java.util.Optional<BorrowTransaction> findByIdAndWorkspaceId(@Param("id") Long id,
                                                                 @Param("workspaceId") Long workspaceId);
}

