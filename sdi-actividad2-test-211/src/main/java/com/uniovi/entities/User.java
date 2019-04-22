package com.uniovi.entities;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Document(collection = "users")
public class User {
	@Id
	private ObjectId _id;

	private String email;
	private String name;
	private String lastName;
	private String fullName;

	private String password;

	private String role;
	private double money;

	public User(String email, String name, String lastName) {
		super();
		this.email = email;
		this.name = name;
		this.lastName = lastName;
		this.fullName = name + " " + lastName;
	}

	public User() {
	}

	public String getId() {
		return _id.toHexString();
	}

	public void setId(ObjectId id) {
		this._id = id;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public String getFullName() {
		return this.name + " " + this.lastName;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getRole() {
		return role;
	}

	public void setRole(String role) {
		this.role = role;
	}

	public double getMoney() {
		return money;
	}

	public void setMoney(double money) {
		this.money = money;
	}

	@Override
	public boolean equals(Object o) {
		if(this == o)
			return true;
		if(o == null || getClass() != o.getClass())
			return false;
		if(!(o instanceof User)) {
			return false;
		}
		User user = (User) o;
		return user.email != null && email.equals(user.email) && user.name != null && name.equals(user.name) && user.lastName != null && lastName.equals(user.lastName) && user.role != null && role
				.equals(user.role);
	}

	@Override
	public int hashCode() {
		return Objects.hash(email, name, lastName, role);
	}
}