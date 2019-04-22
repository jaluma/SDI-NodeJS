package com.uniovi.services;

import org.springframework.stereotype.Service;

@Service
public class RolesService {

	private static final String[] roles = {"STANDARD_ROLE", "ADMIN_ROLE"};

	public String[] getRoles() {
		return roles;
	}
}