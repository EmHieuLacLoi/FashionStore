package com.emhieulacloi.fashionstore.api.domains.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardResponseDTO {

    @JsonProperty("kpis")
    private KpiCards kpis;

    @JsonProperty("revenue_last_7_days")
    private List<RevenueByDay> revenueLast7Days;

    @JsonProperty("top_5_products")
    private List<TopProduct> top5Products;

    public record KpiDetail<T>(
            T value,
            double growthRate
    ) {}

    public record KpiCards(
            KpiDetail<Double> totalRevenue,
            KpiDetail<Long> totalOrders,
            KpiDetail<Long> totalCustomers,
            KpiDetail<Long> totalProducts
    ) {}

    public record RevenueByDay(
            LocalDate date,
            Double totalAmount
    ) {}
}
