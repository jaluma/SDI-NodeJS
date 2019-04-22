package com.uniovi.entities;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.Objects;

@Document(collection = "messages")
public class Message {
	@Id
	private ObjectId _id;

	private String message;
	private LocalDateTime time;

	private User user;

	public Message(String message, LocalDateTime time) {
		setMessage(message);
		setTime(time);
	}

	Message() {
	}

	public String getId() {
		return _id.toHexString();
	}

	public void setId(ObjectId id) {
		this._id = id;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public LocalDateTime getTime() {
		return time;
	}

	public void setTime(LocalDateTime time) {
		this.time = time;
	}

	public User getUser() {
		return user;
	}

	void setUser(User user) {
		this.user = user;
	}

	@Override
	public boolean equals(Object o) {
		if(this == o)
			return true;
		if(o == null || getClass() != o.getClass())
			return false;
		Message message1 = (Message) o;
		return Objects.equals(message, message1.message) && Objects.equals(time, message1.time);
	}

	@Override
	public int hashCode() {
		return Objects.hash(message, time);
	}
}
