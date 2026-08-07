package com.pingnpay.domain.payment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public interface PaymentRepository extends JpaRepository<Payment, UUID> {

    List<Payment> findByInvoiceIdOrderByPaidAtDesc(UUID invoiceId);

    @Query("SELECT p FROM Payment p WHERE p.invoice.organisation.id = :orgId ORDER BY p.paidAt DESC")
    List<Payment> findAllByOrgId(UUID orgId);

    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p WHERE p.invoice.organisation.id = :orgId")
    BigDecimal sumAmountByOrgId(UUID orgId);
}
