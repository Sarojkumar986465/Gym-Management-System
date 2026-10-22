package com.gymtracker.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "subscription_plans")
public class SubscriptionPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, precision = 8, scale = 2)
    private BigDecimal price;

    @Column(name = "billing_cycle", nullable = false, length = 30)
    private String billingCycle;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "max_visits_per_week")
    private Integer maxVisitsPerWeek;

    @Column(name = "locker_access")
    private Boolean lockerAccess = true;

    @Column(name = "trainer_sessions_included")
    private Integer trainerSessionsIncluded = 0;

    @Column(name = "active")
    private Boolean active = true;

    public SubscriptionPlan() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public String getBillingCycle() { return billingCycle; }
    public void setBillingCycle(String billingCycle) { this.billingCycle = billingCycle; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Integer getMaxVisitsPerWeek() { return maxVisitsPerWeek; }
    public void setMaxVisitsPerWeek(Integer maxVisitsPerWeek) { this.maxVisitsPerWeek = maxVisitsPerWeek; }

    public Boolean getLockerAccess() { return lockerAccess; }
    public void setLockerAccess(Boolean lockerAccess) { this.lockerAccess = lockerAccess; }

    public Integer getTrainerSessionsIncluded() { return trainerSessionsIncluded; }
    public void setTrainerSessionsIncluded(Integer trainerSessionsIncluded) { this.trainerSessionsIncluded = trainerSessionsIncluded; }

    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
}
