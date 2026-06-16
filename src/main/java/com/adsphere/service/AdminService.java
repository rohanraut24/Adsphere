package com.adsphere.service;

import com.adsphere.dto.admin.AdminStats;
import com.adsphere.dto.admin.UserResponse;
import com.adsphere.model.Role;
import com.adsphere.model.UserStatus;
import com.adsphere.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private static final BigDecimal NETWORK_RATE  = new BigDecimal("0.20");
    private static final BigDecimal PLATFORM_RATE = new BigDecimal("0.10");

    private final UserRepository userRepository;
    private final WebsiteRepository websiteRepository;
    private final CampaignRepository campaignRepository;
    private final AdPlacementRepository adPlacementRepository;
    private final AnalyticsRepository analyticsRepository;
    private final RevenueTransactionRepository revenueTransactionRepository;

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream().map(this::toUserResponse).toList();
    }

    public List<UserResponse> getUsersByRole(Role role) {
        return userRepository.findByRole(role).stream().map(this::toUserResponse).toList();
    }

    public AdminStats getStats() {
        long totalUsers      = userRepository.count();
        long totalWebsites   = websiteRepository.count();
        long totalCampaigns  = campaignRepository.count();
        long totalPlacements = adPlacementRepository.count();

        var allAnalytics = analyticsRepository.findAll();
        long totalClicks      = allAnalytics.stream().mapToLong(a -> a.getClicks()).sum();
        long totalImpressions = allAnalytics.stream().mapToLong(a -> a.getImpressions()).sum();

        var allTx = revenueTransactionRepository.findAll();
        BigDecimal totalRevenue = allTx.stream()
                .map(t -> t.getTotalAmount())
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal platformRevenue = totalRevenue.multiply(PLATFORM_RATE).setScale(4, RoundingMode.HALF_UP);
        BigDecimal networkRevenue  = totalRevenue.multiply(NETWORK_RATE).setScale(4, RoundingMode.HALF_UP);

        return new AdminStats(totalUsers, totalWebsites, totalCampaigns, totalPlacements,
                totalClicks, totalImpressions, platformRevenue, networkRevenue);
    }

    public void suspendUser(Long userId) {
        var user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        user.setStatus(UserStatus.SUSPENDED);
        userRepository.save(user);
    }

    public void activateUser(Long userId) {
        var user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        user.setStatus(UserStatus.ACTIVE);
        userRepository.save(user);
    }

    private UserResponse toUserResponse(com.adsphere.model.User u) {
        UserResponse r = new UserResponse();
        r.setId(u.getId());
        r.setEmail(u.getEmail());
        r.setFullName(u.getFullName());
        r.setRole(u.getRole());
        r.setStatus(u.getStatus());
        r.setCreatedAt(u.getCreatedAt());
        return r;
    }
}
