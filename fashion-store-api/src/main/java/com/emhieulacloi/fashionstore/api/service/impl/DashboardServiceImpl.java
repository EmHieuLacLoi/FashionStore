package com.emhieulacloi.fashionstore.api.service.impl;

import com.emhieulacloi.fashionstore.api.domains.dto.response.DashboardResponseDTO;
import com.emhieulacloi.fashionstore.api.repository.*;
import com.emhieulacloi.fashionstore.api.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.sql.Date;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final OrderItemRepository orderItemRepository;

    @Override
    public DashboardResponseDTO getDashboardData() {
        DashboardResponseDTO response = new DashboardResponseDTO();

        LocalDateTime now = LocalDateTime.now();
        YearMonth currentMonth = YearMonth.from(now);
        YearMonth previousMonth = currentMonth.minusMonths(1);

        Double currentMonthRevenue = paymentRepository.findRevenueBetweenDates(currentMonth.atDay(1).atStartOfDay(), currentMonth.plusMonths(1).atDay(1).atStartOfDay());
        Double previousMonthRevenue = paymentRepository.findRevenueBetweenDates(previousMonth.atDay(1).atStartOfDay(), currentMonth.atDay(1).atStartOfDay());
        double revenueGrowth = calculateGrowthRate(currentMonthRevenue, previousMonthRevenue);

        Long currentMonthOrders = orderRepository.countOrdersBetweenDates(currentMonth.atDay(1).atStartOfDay(), currentMonth.plusMonths(1).atDay(1).atStartOfDay());
        Long previousMonthOrders = orderRepository.countOrdersBetweenDates(previousMonth.atDay(1).atStartOfDay(), currentMonth.atDay(1).atStartOfDay());
        double orderGrowth = calculateGrowthRate(currentMonthOrders.doubleValue(), previousMonthOrders.doubleValue());

        Long currentMonthCustomers = userRepository.countUsersBetweenDates(currentMonth.atDay(1).atStartOfDay(), currentMonth.plusMonths(1).atDay(1).atStartOfDay());
        Long previousMonthCustomers = userRepository.countUsersBetweenDates(previousMonth.atDay(1).atStartOfDay(), currentMonth.atDay(1).atStartOfDay());
        double customerGrowth = calculateGrowthRate(currentMonthCustomers.doubleValue(), previousMonthCustomers.doubleValue());

        Long totalProducts = productRepository.count();

        var revenueKpi = new DashboardResponseDTO.KpiDetail<>(currentMonthRevenue, revenueGrowth);
        var ordersKpi = new DashboardResponseDTO.KpiDetail<>(currentMonthOrders, orderGrowth);
        var customersKpi = new DashboardResponseDTO.KpiDetail<>(currentMonthCustomers, customerGrowth);
        var productsKpi = new DashboardResponseDTO.KpiDetail<>(totalProducts, 0.0);
        response.setKpis(new DashboardResponseDTO.KpiCards(revenueKpi, ordersKpi, customersKpi, productsKpi));

        response.setRevenueLast7Days(getRevenueReportForLast7Days());

        Pageable topFive = PageRequest.of(0, 5);
        response.setTop5Products(orderItemRepository.findTopSellingProducts(topFive));

        return response;
    }

    private double calculateGrowthRate(Double current, Double previous) {
        if (previous == null || previous == 0) {
            return (current != null && current > 0) ? 100.0 : 0.0;
        }
        if (current == null) {
            current = 0.0;
        }
        return ((current - previous) / previous) * 100.0;
    }

    private List<DashboardResponseDTO.RevenueByDay> getRevenueReportForLast7Days() {
        LocalDateTime sevenDaysAgo = LocalDate.now().minusDays(6).atStartOfDay();
        List<Object[]> revenueFromDbRaw = paymentRepository.findRevenueLast7DaysRaw(sevenDaysAgo);

        Map<LocalDate, Double> revenueMap = revenueFromDbRaw.stream()
                .collect(Collectors.toMap(
                        row -> ((Date) row[0]).toLocalDate(),
                        row -> ((BigDecimal) row[1]).doubleValue()
                ));

        List<LocalDate> last7Days = IntStream.range(0, 7)
                .mapToObj(i -> LocalDate.now().minusDays(i))
                .collect(Collectors.toList());

        List<DashboardResponseDTO.RevenueByDay> finalReport = new ArrayList<>();
        for (LocalDate day : last7Days) {
            Double totalAmount = revenueMap.getOrDefault(day, 0.0);
            finalReport.add(new DashboardResponseDTO.RevenueByDay(day, totalAmount));
        }

        finalReport.sort(Comparator.comparing(DashboardResponseDTO.RevenueByDay::date));
        return finalReport;
    }
}
