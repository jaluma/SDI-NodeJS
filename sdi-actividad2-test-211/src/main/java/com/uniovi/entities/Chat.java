package com.uniovi.entities;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.*;

@Document(collection = "chats")
public class Chat {
	@Id
	private ObjectId _id;

	private List<Message> messages = new ArrayList<>();
	private Item item;

	public Chat(Item item) {
		this.item = item;
		Association.Chats.createChat(this, item);
	}

	public String getId() {
		return _id.toHexString();
	}

	public void setId(ObjectId id) {
		this._id = id;
	}

	public Item getItem() {
		return item;
	}

	public void setItem(Item item) {
		this.item = item;
	}

	public Set<Message> getMessages() {
		return new HashSet<>(messages);
	}

	public void setMessages(List<Message> messages) {
		this.messages = messages;
	}

	List<Message> _getMessages() {
		return messages;
	}

	@Override
	public boolean equals(Object o) {
		if(this == o)
			return true;
		if(o == null || getClass() != o.getClass())
			return false;
		Chat chat = (Chat) o;
		return Objects.equals(messages, chat.messages) && Objects.equals(item, chat.item);
	}

	@Override
	public int hashCode() {
		return Objects.hash(messages, item);
	}
}
