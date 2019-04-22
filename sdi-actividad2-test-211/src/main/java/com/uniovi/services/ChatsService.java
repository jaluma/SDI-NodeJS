package com.uniovi.services;

import com.uniovi.entities.Chat;
import com.uniovi.repositories.ChatsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ChatsService {
	private final ChatsRepository chatsRepository;

	@Autowired
	public ChatsService(ChatsRepository chatsRepository) {
		this.chatsRepository = chatsRepository;
	}

	@Transactional
	public void deleteAll() {
		chatsRepository.deleteAll();
	}

	void addAll(Iterable<Chat> chatList) {
		chatsRepository.saveAll(chatList);
	}

}
