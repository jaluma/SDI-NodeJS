package com.uniovi.services;

import com.uniovi.entities.Message;
import com.uniovi.repositories.MessagesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MessagesService {

	private final MessagesRepository messagesRepository;

	@Autowired
	public MessagesService(MessagesRepository messagesRepository) {
		this.messagesRepository = messagesRepository;
	}

	void addAll(Iterable<Message> messagesList) {
		messagesRepository.saveAll(messagesList);
	}
}
