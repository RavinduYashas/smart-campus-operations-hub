package com.smartcampus.backend.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/manager")
@PreAuthorize("hasRole('MANAGER')")
public class ManagerController {

    @GetMapping("/reports")
    public String getReports() {
        return "Daily operation reports for campus management.";
    }

    @GetMapping("/staff-overview")
    public String getStaffOverview() {
        return "Staffing overview and resource allocation reports.";
    }
}
