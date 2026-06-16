package com.adsphere.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class AdminStats {
    private long totalUsers;
    private long totalWebsites;
    private long totalCampaigns;
    private long totalPlacements;
    private long totalClicks;
    private long totalImpressions;
    private BigDecimal totalPlatformRevenue;
    private BigDecimal totalNetworkRevenue;
}
