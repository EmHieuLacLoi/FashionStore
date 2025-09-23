package com.emhieulacloi.fashionstore.api.service.impl;

import com.emhieulacloi.fashionstore.api.common.component.MessageResource;
import com.emhieulacloi.fashionstore.api.common.exception.CommonException;
import com.emhieulacloi.fashionstore.api.domains.criteria.OrderCriteria;
import com.emhieulacloi.fashionstore.api.domains.dto.projection.OrderDTO;
import com.emhieulacloi.fashionstore.api.domains.dto.request.OrderItemRequestDTO;
import com.emhieulacloi.fashionstore.api.domains.dto.request.OrderRequestDTO;
import com.emhieulacloi.fashionstore.api.domains.dto.response.OrderItemResponseDTO;
import com.emhieulacloi.fashionstore.api.domains.dto.response.OrderResponseDTO;
import com.emhieulacloi.fashionstore.api.domains.dto.response.PaymentResponseDTO;
import com.emhieulacloi.fashionstore.api.domains.entity.*;
import com.emhieulacloi.fashionstore.api.enums.OrderStatusEnum;
import com.emhieulacloi.fashionstore.api.enums.SystemCodeEnum;
import com.emhieulacloi.fashionstore.api.repository.*;
import com.emhieulacloi.fashionstore.api.service.OrderService;
import com.emhieulacloi.fashionstore.api.service.mapper.OrderItemMapper;
import com.emhieulacloi.fashionstore.api.service.mapper.OrderMapper;
import com.emhieulacloi.fashionstore.api.service.mapper.PaymentMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {
    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;
    private final OrderItemMapper orderItemMapper;
    private final MessageResource messageResource;
    private final ProductVariantRepository productVariantRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductRepository productRepository;
    private final PaymentRepository paymentRepository;
    private final PaymentMapper paymentMapper;

    @Override
    @Transactional(rollbackFor = {Exception.class, Throwable.class})
    public OrderResponseDTO save(OrderRequestDTO dto) {
        if (dto.getOrderItems() == null || dto.getOrderItems().isEmpty()) {
            throw new CommonException()
                    .setErrorCode(SystemCodeEnum.ERROR_021.getCode(), messageResource)
                    .setStatusCode(HttpStatus.BAD_REQUEST);
        }

        Order order = orderMapper.toEntity(dto);
        order.setStatus(OrderStatusEnum.PENDING.getValue());

        BigDecimal totalAmount = BigDecimal.ZERO;

        Order savedOrder = orderRepository.save(order);

        List<OrderItem> items = new ArrayList<>();
        for (OrderItemRequestDTO itemDto : dto.getOrderItems()) {
            ProductVariant variant = productVariantRepository.findById(itemDto.getProductVariantId())
                    .orElseThrow(() -> new CommonException()
                            .setErrorCode(SystemCodeEnum.ERROR_005.getCode(), messageResource)
                            .setStatusCode(HttpStatus.BAD_REQUEST));

            Product product = productRepository.findById(variant.getProductId())
                    .orElseThrow(() -> new CommonException()
                    .setErrorCode(SystemCodeEnum.ERROR_005.getCode(), messageResource)
                    .setStatusCode(HttpStatus.BAD_REQUEST));

            if (itemDto.getQuantity() <= 0 || itemDto.getQuantity() > variant.getStockQuantity()) {
                throw new CommonException()
                        .setErrorCode(SystemCodeEnum.ERROR_022.getCode(), messageResource)
                        .setStatusCode(HttpStatus.BAD_REQUEST);
            }

            BigDecimal unitPrice = product.getPrice();
            BigDecimal totalPrice = unitPrice.multiply(BigDecimal.valueOf(itemDto.getQuantity()));

            OrderItem item = new OrderItem();
            item.setOrderId(savedOrder.getId());
            item.setProductVariantId(variant.getId());
            item.setQuantity(itemDto.getQuantity());
            item.setUnitPrice(unitPrice);
            item.setTotalPrice(totalPrice);

            items.add(item);
            totalAmount = totalAmount.add(totalPrice);
        }

        orderItemRepository.saveAll(items);

        savedOrder.setTotalAmount(totalAmount);
        orderRepository.save(savedOrder);

        OrderResponseDTO orderResponseDTO = orderMapper.entityToResponse(savedOrder);
        orderResponseDTO.setOrderItems(items.stream()
                .map(orderItemMapper::entityToResponse).toList());

        return orderResponseDTO;
    }

    @Override
    @Transactional(rollbackFor = {Exception.class, Throwable.class})
    public OrderResponseDTO update(Long id, OrderRequestDTO dto) {
        Order existingOrder = orderRepository.findById(id)
                .orElseThrow(() -> new CommonException()
                        .setErrorCode(SystemCodeEnum.ERROR_005.getCode(), messageResource)
                        .setStatusCode(HttpStatus.BAD_REQUEST));

        if (!existingOrder.getStatus().equals(OrderStatusEnum.PENDING.getValue())) {
            throw new CommonException()
                    .setErrorCode(SystemCodeEnum.ERROR_016.getCode(), messageResource)
                    .setStatusCode(HttpStatus.BAD_REQUEST);
        }

        orderItemRepository.deleteAllByOrderId(existingOrder.getId());

        dto.setId(existingOrder.getId());
        return save(dto);
    }

    @Override
    @Transactional(rollbackFor = {Exception.class, Throwable.class})
    public Integer delete(Long id) {
        Order existingOrder = orderRepository.findById(id)
                .orElseThrow(() -> new CommonException()
                        .setErrorCode(SystemCodeEnum.ERROR_005.getCode(), messageResource)
                        .setStatusCode(HttpStatus.BAD_REQUEST));

        if (!existingOrder.getStatus().equals(OrderStatusEnum.PENDING.getValue())) {
            throw new CommonException()
                    .setErrorCode(SystemCodeEnum.ERROR_023.getCode(), messageResource)
                    .setStatusCode(HttpStatus.BAD_REQUEST);
        }

        orderItemRepository.deleteAllByOrderId(id);
        orderRepository.deleteById(id);
        return 1;
    }

    @Override
    public Page<OrderResponseDTO> findAllByCriteria(OrderCriteria criteria, Pageable pageable) {
        Page<OrderDTO> orderDTOS = orderRepository.findAllByCriteria(criteria, pageable);

        List<OrderItemResponseDTO> allOrderItems = orderItemRepository
                .findAllByOrderIdIn(orderDTOS.getContent().stream().map(OrderDTO::getId).toList())
                .stream().map(orderItemMapper::dtoToResponse).toList();

        List<Payment> allPayments = paymentRepository
                .findAllByOrderIdIn(orderDTOS.getContent().stream().map(OrderDTO::getId).toList());

        List<OrderResponseDTO> orderResponseDTOS = orderDTOS.getContent().stream()
                .map(orderMapper::dtoToResponse)
                .toList();

        orderResponseDTOS.forEach(orderResponseDTO -> {
            List<OrderItemResponseDTO> orderItemsForOrder = allOrderItems.stream()
                    .filter(orderItem -> orderItem.getOrderId().equals(orderResponseDTO.getId()))
                    .toList();
            orderResponseDTO.setOrderItems(orderItemsForOrder);

            allPayments.stream()
                    .filter(payment -> payment.getOrderId().equals(orderResponseDTO.getId()))
                    .findFirst()
                    .ifPresent(payment -> orderResponseDTO.setPayment(paymentMapper.entityToResponse(payment)));
        });

        return new PageImpl<>(orderResponseDTOS, pageable, orderDTOS.getTotalElements());
    }
}

