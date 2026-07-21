package com.pingnpay.invoice;

import com.pingnpay.domain.invoice.InvoiceStatus;
import com.pingnpay.domain.user.User;
import com.pingnpay.invoice.dto.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/v1/invoices")
@RequiredArgsConstructor
public class InvoiceController {

    private final InvoiceService invoiceService;

    /** GET /api/v1/invoices — list all invoices for the current user's org */
    @GetMapping
    public ResponseEntity<List<InvoiceSummaryResponse>> getAll(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(invoiceService.findAll(user));
    }

    /** GET /api/v1/invoices/{id} — get full invoice detail */
    @GetMapping("/{id}")
    public ResponseEntity<InvoiceResponse> getById(
            @PathVariable UUID id,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(invoiceService.findById(id, user));
    }

    /** POST /api/v1/invoices — create a new DRAFT invoice */
    @PostMapping
    public ResponseEntity<InvoiceResponse> create(
            @Valid @RequestBody CreateInvoiceRequest request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.status(HttpStatus.CREATED).body(invoiceService.create(request, user));
    }

    /** PUT /api/v1/invoices/{id} — update a DRAFT invoice */
    @PutMapping("/{id}")
    public ResponseEntity<InvoiceResponse> update(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateInvoiceRequest request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(invoiceService.update(id, request, user));
    }

    /** PATCH /api/v1/invoices/{id}/status — transition invoice status */
    @PatchMapping("/{id}/status")
    public ResponseEntity<InvoiceResponse> updateStatus(
            @PathVariable UUID id,
            @RequestParam InvoiceStatus status,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(invoiceService.updateStatus(id, status, user));
    }

    /** DELETE /api/v1/invoices/{id} — delete a DRAFT invoice */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable UUID id,
            @AuthenticationPrincipal User user) {
        invoiceService.delete(id, user);
        return ResponseEntity.noContent().build();
    }
}
