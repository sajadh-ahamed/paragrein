package com.paragrein.Paragrein_backend.service;

import com.paragrein.Paragrein_backend.dto.ApiMessageResponse;
import com.paragrein.Paragrein_backend.dto.AdminUserResponse;
import com.paragrein.Paragrein_backend.dto.CreateWorkerRequest;

import java.util.List;

public interface AdminService {
    ApiMessageResponse createWorker(CreateWorkerRequest request);

    List<AdminUserResponse> getAllUsers();
}
