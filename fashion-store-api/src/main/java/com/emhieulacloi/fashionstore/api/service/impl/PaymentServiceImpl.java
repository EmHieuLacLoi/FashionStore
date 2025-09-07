package com.emhieulacloi.fashionstore.api.service.impl;

import com.emhieulacloi.fashionstore.api.common.component.MessageResource;
import com.emhieulacloi.fashionstore.api.common.exception.CommonException;
import com.emhieulacloi.fashionstore.api.domains.dto.request.PaymentRequestDTO;
import com.emhieulacloi.fashionstore.api.domains.dto.response.PaymentResponseDTO;
import com.emhieulacloi.fashionstore.api.domains.entity.Order;
import com.emhieulacloi.fashionstore.api.domains.entity.OrderItem;
import com.emhieulacloi.fashionstore.api.domains.entity.Payment;
import com.emhieulacloi.fashionstore.api.domains.entity.ProductVariant;
import com.emhieulacloi.fashionstore.api.enums.OrderStatusEnum;
import com.emhieulacloi.fashionstore.api.enums.PaymentStatusEnum;
import com.emhieulacloi.fashionstore.api.enums.SystemCodeEnum;
import com.emhieulacloi.fashionstore.api.repository.OrderItemRepository;
import com.emhieulacloi.fashionstore.api.repository.OrderRepository;
import com.emhieulacloi.fashionstore.api.repository.PaymentRepository;
import com.emhieulacloi.fashionstore.api.repository.ProductVariantRepository;
import com.emhieulacloi.fashionstore.api.service.PaymentService;
import com.emhieulacloi.fashionstore.api.service.mapper.PaymentMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {
    private final PaymentRepository paymentRepository;
    private final PaymentMapper paymentMapper;
    private final MessageResource messageResource;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductVariantRepository productVariantRepository;

    @Override
    @Transactional(rollbackFor = {Exception.class, Throwable.class})
    public PaymentResponseDTO save(PaymentRequestDTO dto) {
        validatePayment(dto);
        Payment payment = paymentMapper.toEntity(dto);

        if (payment.getStatus() == null) {
            payment.setStatus(PaymentStatusEnum.PENDING.getValue());

        }

        if (payment.getStatus().equals(PaymentStatusEnum.COMPLETED.getValue())) {
            completeOrder(payment.getOrderId());
        }

        Payment savedPayment = paymentRepository.save(payment);
        return paymentMapper.entityToResponse(savedPayment);
    }

    @Override
    @Transactional(rollbackFor = {Exception.class, Throwable.class})
    public PaymentResponseDTO update(Long id, PaymentRequestDTO dto) {
        Payment existingPayment = paymentRepository.findById(id)
                .orElseThrow(() -> new CommonException()
                        .setErrorCode(SystemCodeEnum.ERROR_005.getCode(), messageResource)
                        .setStatusCode(HttpStatus.BAD_REQUEST));

        if (dto.getStatus() != null) {
            existingPayment.setStatus(dto.getStatus());

            if (Objects.equals(dto.getStatus(), PaymentStatusEnum.COMPLETED.getValue())) {
                Order order = orderRepository.findById(existingPayment.getOrderId())
                        .orElseThrow(() -> new CommonException()
                                .setErrorCode(SystemCodeEnum.ERROR_005.getCode(), messageResource)
                                .setStatusCode(HttpStatus.BAD_REQUEST));
                order.setStatus(OrderStatusEnum.PROCESSING.getValue());
                orderRepository.save(order);
            }
        }

        Payment updated = paymentRepository.save(existingPayment);
        return paymentMapper.entityToResponse(updated);
    }

    @Override
    @Transactional(rollbackFor = {Exception.class, Throwable.class})
    public Integer delete(Long id) {
        if (!paymentRepository.existsById(id)) {
            throw new CommonException()
                    .setErrorCode(SystemCodeEnum.ERROR_005.getCode(), messageResource)
                    .setStatusCode(HttpStatus.BAD_REQUEST);
        }
        paymentRepository.deleteById(id);
        return 1;
    }

    private void validatePayment(PaymentRequestDTO dto) {
        if (dto.getOrderId() == null) {
            throw new CommonException()
                    .setErrorCode(SystemCodeEnum.ERROR_014.getCode(), messageResource)
                    .setStatusCode(HttpStatus.BAD_REQUEST);
        }

        Order order = orderRepository.findById(dto.getOrderId())
                .orElseThrow(() -> new CommonException()
                        .setErrorCode(SystemCodeEnum.ERROR_005.getCode(), messageResource)
                        .setStatusCode(HttpStatus.BAD_REQUEST));

        if (Objects.equals(order.getStatus(), OrderStatusEnum.CANCELLED.getValue())) {
            throw new CommonException()
                    .setErrorCode(SystemCodeEnum.ERROR_015.getCode(), messageResource)
                    .setStatusCode(HttpStatus.BAD_REQUEST);
        }

        if (dto.getAmount() == null || order.getTotalAmount().compareTo(dto.getAmount()) != 0) {
            throw new CommonException()
                    .setErrorCode(SystemCodeEnum.ERROR_018.getCode(), messageResource)
                    .setStatusCode(HttpStatus.BAD_REQUEST);
        }
    }

    private void completeOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new CommonException()
                        .setErrorCode(SystemCodeEnum.ERROR_005.getCode(), messageResource));

        List<OrderItem> items = orderItemRepository.findAllByOrderId(order.getId());

        for (OrderItem item : items) {
            ProductVariant variant = productVariantRepository.findById(item.getProductVariantId())
                    .orElseThrow(() -> new CommonException()
                            .setErrorCode(SystemCodeEnum.ERROR_005.getCode(), messageResource));

            if (variant.getStockQuantity() < item.getQuantity()) {
                throw new CommonException()
                        .setErrorCode(SystemCodeEnum.ERROR_024.getCode(), messageResource);
            }

            variant.setStockQuantity(variant.getStockQuantity() - item.getQuantity());
            productVariantRepository.save(variant);
        }

        order.setStatus(OrderStatusEnum.COMPLETED.getValue());
        orderRepository.save(order);
    }

}
