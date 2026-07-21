package com.pingnpay.domain.invoice;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, UUID> {

    List<Invoice> findAllByOrganisationIdOrderByCreatedAtDesc(UUID organisationId);

    Optional<Invoice> findByIdAndOrganisationId(UUID id, UUID organisationId);

    long countByOrganisationId(UUID organisationId);

    @Query("SELECT COUNT(i) FROM Invoice i WHERE i.organisation.id = :orgId AND i.status = :status")
    long countByOrganisationIdAndStatus(UUID orgId, InvoiceStatus status);
}
